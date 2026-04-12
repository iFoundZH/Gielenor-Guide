import type {
  OptimizerConfig,
  OptimizerResult,
  OptimizedConfig,
  BuildLoadout,
  Item,
  EquipmentSlot,
  CombatStyle,
  PlayerConfig,
  PotionType,
  PrayerType,
  AttackStyleBonus,
  BossPreset,
  PactNode,
  AmmoCategory,
} from "@/types/dps";
import { PACT_POINT_LIMIT } from "@/types/dps";
import { ITEMS } from "@/data/items";
import { calculateDps } from "@/lib/dps-engine";
import { getAllNodes, canSelectNode } from "@/data/pacts";

// ═══════════════════════════════════════════════════════════════════════
// PUBLIC API
// ═══════════════════════════════════════════════════════════════════════

export function optimizeGear(config: OptimizerConfig): OptimizerResult[] {
  const { player, target, lockedSlots, topN } = config;
  const style = player.combatStyle;
  const regions = player.regions;

  // Step 1: Get available items by slot (filtered by region + style)
  const slotItems = getSlotCandidates(style, regions, lockedSlots);

  // Step 2: Prune dominated items per slot
  for (const slot of Object.keys(slotItems) as EquipmentSlot[]) {
    if (lockedSlots[slot]) continue; // don't prune locked slots
    if (slot === "weapon") {
      // Group weapons by category, prune within each group only
      // Prevents bows from dominating crossbows (which get rstr from bolts)
      const weaponsByCategory = new Map<string, Item[]>();
      for (const w of slotItems.weapon) {
        const cat = w.weaponCategory ?? "other";
        if (!weaponsByCategory.has(cat)) weaponsByCategory.set(cat, []);
        weaponsByCategory.get(cat)!.push(w);
      }
      const prunedWeapons: Item[] = [];
      for (const [, group] of weaponsByCategory) {
        prunedWeapons.push(...pruneDominated(group, style));
      }
      slotItems.weapon = prunedWeapons;
    } else if (slot === "ammo") {
      // Group ammo by category, prune within each group only
      // Prevents bolts (rstr 122) from dominating arrows (rstr 60) which are needed for bows
      const ammoByCategory = new Map<string, Item[]>();
      for (const a of slotItems.ammo) {
        const cat = getAmmoCategory(a);
        if (!ammoByCategory.has(cat)) ammoByCategory.set(cat, []);
        ammoByCategory.get(cat)!.push(a);
      }
      const prunedAmmo: Item[] = [];
      for (const [, group] of ammoByCategory) {
        prunedAmmo.push(...pruneDominated(group, style));
      }
      slotItems.ammo = prunedAmmo;
    } else {
      slotItems[slot] = pruneDominated(slotItems[slot], style);
    }
  }

  // Step 3: Exhaustive combinatorial search — try EVERY combination across all slots
  // NO budget cap: user explicitly wants millions of combinations evaluated
  const weapons = slotItems.weapon;
  const bestPerWeapon = new Map<string, OptimizerResult>();
  let totalCombinations = 0;

  // Free slots (excluding weapon and shield, which are enumerated in the weapon loop)
  const freeSlots = (["head", "cape", "neck", "ammo", "body", "legs", "hands", "feet", "ring"] as EquipmentSlot[])
    .filter(s => !lockedSlots[s]);

  for (const weapon of weapons) {
    // Set optimal spell for staff weapons (Ice Barrage for ancient-capable staves)
    const spellMax = getOptimalSpellMaxHit(weapon);
    const adjustedPlayer = spellMax !== undefined
      ? { ...player, spellMaxHit: spellMax }
      : player;

    // 2H: no shield. 1H: try each shield + no-shield fallback
    const shields: (Item | null)[] = weapon.isTwoHanded
      ? [null]
      : slotItems.shield.length > 0
        ? [...slotItems.shield, null]
        : [null];

    // Build per-slot candidate arrays (ammo filtered by weapon compatibility)
    const candidates: (Item | null)[][] = freeSlots.map(slot => {
      let items = slotItems[slot];
      if (slot === "ammo") {
        const compat = getCompatibleAmmo(weapon);
        if (compat) {
          items = items.filter(a => compat.includes(getAmmoCategory(a)));
        }
      }
      return items.length > 0 ? items : [null];
    });

    const wid = weapon.id;

    for (const shield of shields) {
      // Mutable loadout — reused across all combinations for this weapon+shield
      const loadout: BuildLoadout = {
        head: null, cape: null, neck: null, ammo: null,
        weapon, body: null, shield, legs: null,
        hands: null, feet: null, ring: null,
      };
      for (const slot of Object.keys(lockedSlots) as EquipmentSlot[]) {
        if (lockedSlots[slot]) loadout[slot] = lockedSlots[slot]!;
      }

      // Recursive exhaustive enumeration — no caps, no shortcuts
      const enumerate = (depth: number) => {
        if (depth === freeSlots.length) {
          totalCombinations++;
          const result = calculateDps({ player: adjustedPlayer, loadout, target });
          const existing = bestPerWeapon.get(wid);
          if (!existing || result.dps > existing.result.dps) {
            bestPerWeapon.set(wid, { loadout: { ...loadout }, result });
          }
          return;
        }
        const slot = freeSlots[depth];
        for (const item of candidates[depth]) {
          loadout[slot] = item;
          enumerate(depth + 1);
        }
      };

      enumerate(0);
    }
  }

  // Return one result per weapon, sorted by DPS, top N
  const results = [...bestPerWeapon.values()]
    .sort((a, b) => b.result.dps - a.result.dps)
    .slice(0, topN);

  // Tag the top result with the total combinations evaluated
  if (results.length > 0) {
    results[0].combinationsEvaluated = totalCombinations;
  }

  return results;
}

// ═══════════════════════════════════════════════════════════════════════
// FULL-SPECTRUM OPTIMIZER
// Searches potions, prayers, attack styles, void, and pacts alongside gear.
// "auto" values get searched; concrete values stay locked.
// ═══════════════════════════════════════════════════════════════════════

interface ConfigCombo {
  potion: Exclude<PotionType, "auto">;
  prayerType: Exclude<PrayerType, "auto">;
  attackStyle: Exclude<AttackStyleBonus, "auto">;
  voidSet: "none" | "void" | "elite-void";
}

export function optimizeBuild(config: OptimizerConfig): OptimizerResult[] {
  const { player, target, lockedSlots, topN } = config;
  const style = player.combatStyle;

  // Phase 0: Auto-select regions if user hasn't chosen any
  const autoRegion = needsRegionAutoSelect(player.regions);
  const regionSets = autoRegion
    ? rankRegionCombos(player, target, lockedSlots, style)
    : [player.regions];

  const bestPerWeapon = new Map<string, OptimizerResult>();

  function mergeResults(results: OptimizerResult[], optConfig: OptimizedConfig) {
    for (const r of results) {
      const wid = r.loadout.weapon?.id ?? "";
      const spellMax = getOptimalSpellMaxHit(r.loadout.weapon);
      const config = spellMax !== undefined
        ? { ...optConfig, spellMaxHit: spellMax }
        : optConfig;
      r.optimizedConfig = config;

      const existing = bestPerWeapon.get(wid);
      if (!existing || r.result.dps > existing.result.dps) {
        bestPerWeapon.set(wid, r);
      }
    }
  }

  for (const regionSet of regionSets) {
    const regionPlayer = { ...player, regions: regionSet };

    // Phase 1: Enumerate all config combos for "auto" fields
    const combos = enumerateConfigCombos(regionPlayer);

    // Phase 2: Quick rank — test top 5 weapons with greedy fill for each combo
    const ranked = quickRankCombos(combos, regionPlayer, target, lockedSlots, style);
    const topCombos = ranked.slice(0, 5);
    const baseOptConfig = autoRegion ? { regions: regionSet } : {};

    // Phase 3: Pact beam search using greedy fill (fast)
    // Only for the best config combo — beam search is cheap, exhaustive gear search is not
    const bestCombo = topCombos[0]?.combo;
    let bestPacts: string[] = regionPlayer.activePacts;
    if (bestCombo) {
      const resolved = resolvePlayer(regionPlayer, bestCombo);
      const cleanPlayer = { ...resolved, activePacts: [] as string[] };
      const pactConfigs = optimizePactsBeam(cleanPlayer, target, lockedSlots);
      if (pactConfigs.length > 0) {
        bestPacts = pactConfigs[0];
      }
    }

    // Phase 4: Exhaustive gear search — ONE call with best config + best pacts
    // This is the expensive step (millions of combinations)
    if (bestCombo) {
      const resolved = resolvePlayer(regionPlayer, bestCombo);
      const pactPlayer = { ...resolved, activePacts: bestPacts };
      const results = optimizeGear({
        player: pactPlayer, target, lockedSlots, topN,
      });
      mergeResults(results, { ...baseOptConfig, ...buildOptimizedConfig(regionPlayer, bestCombo), activePacts: bestPacts });

      // Iterative refinement: re-optimise pacts against the best gear found
      const best = results[0];
      if (best) {
        const cleanPlayer2 = { ...resolved, activePacts: [] as string[] };
        const refinedPacts = optimizePactsBeam(cleanPlayer2, target, lockedSlots, best.loadout);
        if (refinedPacts.length > 0 && refinedPacts[0].join(",") !== bestPacts.join(",")) {
          const refinedPlayer = { ...resolved, activePacts: refinedPacts[0] };
          const refinedResults = optimizeGear({
            player: refinedPlayer, target, lockedSlots, topN,
          });
          mergeResults(refinedResults, { ...baseOptConfig, ...buildOptimizedConfig(regionPlayer, bestCombo), activePacts: refinedPacts[0] });
        }
      }
    }
  }

  return [...bestPerWeapon.values()]
    .sort((a, b) => b.result.dps - a.result.dps)
    .slice(0, topN);
}

function getValidPotions(style: CombatStyle): Exclude<PotionType, "auto">[] {
  switch (style) {
    case "melee":
      return ["super-combat", "overload", "smelling-salts", "none"];
    case "ranged":
      return ["ranging", "overload", "smelling-salts", "none"];
    case "magic":
      return ["magic", "overload", "smelling-salts", "none"];
  }
}

function getValidPrayers(style: CombatStyle): Exclude<PrayerType, "auto">[] {
  switch (style) {
    case "melee":
      return ["piety", "chivalry", "none"];
    case "ranged":
      return ["rigour", "eagle-eye", "none"];
    case "magic":
      return ["augury", "mystic-might", "none"];
  }
}

function getValidAttackStyles(style: CombatStyle): Exclude<AttackStyleBonus, "auto">[] {
  switch (style) {
    case "melee":
      return ["aggressive", "accurate", "controlled"];
    case "ranged":
      return ["rapid", "accurate", "longrange"];
    case "magic":
      return ["autocast", "accurate", "longrange"];
  }
}

function enumerateConfigCombos(player: PlayerConfig): ConfigCombo[] {
  const style = player.combatStyle;
  const potions = player.potion === "auto" ? getValidPotions(style) : [player.potion];
  const prayers = player.prayerType === "auto" ? getValidPrayers(style) : [player.prayerType];
  const styles = player.attackStyle === "auto" ? getValidAttackStyles(style) : [player.attackStyle];
  // Void requires wearing void armour (head/body/legs/hands) which replaces BIS gear.
  // Since we don't model void equipment, never auto-select void — it would stack
  // percentage bonuses on top of BIS gear, massively inflating DPS.
  const voids: ("none" | "void" | "elite-void")[] =
    player.voidSet === "auto" ? ["none"] : [player.voidSet];

  const combos: ConfigCombo[] = [];
  for (const potion of potions) {
    for (const prayerType of prayers) {
      for (const attackStyle of styles) {
        for (const voidSet of voids) {
          combos.push({ potion, prayerType, attackStyle, voidSet });
        }
      }
    }
  }
  return combos;
}

function resolvePlayer(player: PlayerConfig, combo: ConfigCombo): PlayerConfig {
  return {
    ...player,
    potion: combo.potion,
    prayerType: combo.prayerType,
    attackStyle: combo.attackStyle,
    voidSet: combo.voidSet,
  };
}

function buildOptimizedConfig(player: PlayerConfig, combo: ConfigCombo): OptimizedConfig {
  const opt: OptimizedConfig = {};
  if (player.potion === "auto") opt.potion = combo.potion;
  if (player.prayerType === "auto") opt.prayerType = combo.prayerType;
  if (player.attackStyle === "auto") opt.attackStyle = combo.attackStyle;
  if (player.voidSet === "auto") opt.voidSet = combo.voidSet;
  return opt;
}

// ═══════════════════════════════════════════════════════════════════════
// REGION AUTO-SELECTION
// ═══════════════════════════════════════════════════════════════════════

const STARTING_REGIONS = ["varlamore", "karamja", "misthalin"];
const CHOOSABLE_REGIONS = ["asgarnia", "fremennik", "kandarin", "morytania", "desert", "tirannwn", "kourend", "wilderness"];

/** True if the user hasn't selected any choosable regions beyond the 3 starting ones. */
function needsRegionAutoSelect(regions: string[]): boolean {
  return !regions.some(r => CHOOSABLE_REGIONS.includes(r));
}

/** Generate all C(n,k) combinations of an array. */
function combinations<T>(arr: T[], k: number): T[][] {
  if (k === 0) return [[]];
  if (arr.length < k) return [];
  const [first, ...rest] = arr;
  const withFirst = combinations(rest, k - 1).map(c => [first, ...c]);
  const withoutFirst = combinations(rest, k);
  return [...withFirst, ...withoutFirst];
}

/**
 * Rank all C(8,3)=56 possible region combos by quick DPS estimate.
 * Returns the top 5 full region arrays (starting + chosen), best first.
 */
function rankRegionCombos(
  player: PlayerConfig,
  target: BossPreset,
  locked: Partial<BuildLoadout>,
  style: CombatStyle,
): string[][] {
  const allCombos = combinations(CHOOSABLE_REGIONS, 3);

  // Use BIS config assumptions for speed
  const bestPotion = getValidPotions(style)[0];
  const bestPrayer = getValidPrayers(style)[0];
  const bestStyle = getValidAttackStyles(style)[0];
  const resolved: PlayerConfig = {
    ...player,
    potion: bestPotion,
    prayerType: bestPrayer,
    attackStyle: bestStyle,
    voidSet: "none",
  };

  const scored = allCombos.map(chosen => {
    const regions = [...STARTING_REGIONS, ...chosen];
    const regionPlayer = { ...resolved, regions };
    const slotItems = getSlotCandidates(style, regions, locked);

    // Quick estimate: top 5 weapons by score, greedy fill
    const weaponScores = slotItems.weapon.map(w => ({ w, score: offensiveScore(w, style) }));
    weaponScores.sort((a, b) => b.score - a.score);
    const topWeapons = weaponScores.slice(0, 5);

    let bestDps = 0;
    for (const { w } of topWeapons) {
      const shield = w.isTwoHanded ? null : (slotItems.shield[0] ?? null);
      const loadout = buildBestLoadout(slotItems, w, shield, locked);
      const spellMax = getOptimalSpellMaxHit(w);
      const evalPlayer = spellMax !== undefined ? { ...regionPlayer, spellMaxHit: spellMax } : regionPlayer;
      const result = calculateDps({ player: evalPlayer, loadout, target });
      if (result.dps > bestDps) bestDps = result.dps;
    }

    return { regions, dps: bestDps };
  });

  scored.sort((a, b) => b.dps - a.dps);
  return scored.slice(0, 5).map(s => s.regions);
}

function quickRankCombos(
  combos: ConfigCombo[],
  player: PlayerConfig,
  target: BossPreset,
  locked: Partial<BuildLoadout>,
  style: CombatStyle,
): { combo: ConfigCombo; dps: number }[] {
  const regions = player.regions;
  const slotItems = getSlotCandidates(style, regions, locked);

  // Pick top 5 weapons by offensive score (more diverse than 3)
  const weaponScores = slotItems.weapon.map(w => ({ w, score: offensiveScore(w, style) }));
  weaponScores.sort((a, b) => b.score - a.score);
  const topWeapons = weaponScores.slice(0, 5).map(ws => ws.w);

  const results: { combo: ConfigCombo; dps: number }[] = [];

  for (const combo of combos) {
    const resolved = resolvePlayer(player, combo);
    let bestDps = 0;

    for (const weapon of topWeapons) {
      const shield = weapon.isTwoHanded ? null : (slotItems.shield[0] ?? null);
      const loadout = buildBestLoadout(slotItems, weapon, shield, locked);

      // Use optimal spell for staff weapons
      const spellMax = getOptimalSpellMaxHit(weapon);
      const evalPlayer = spellMax !== undefined
        ? { ...resolved, spellMaxHit: spellMax }
        : resolved;

      const result = calculateDps({ player: evalPlayer, loadout, target });
      if (result.dps > bestDps) bestDps = result.dps;
    }

    results.push({ combo, dps: bestDps });
  }

  results.sort((a, b) => b.dps - a.dps);
  return results;
}

// ═══════════════════════════════════════════════════════════════════════
// PACT STYLE RELEVANCE
// ═══════════════════════════════════════════════════════════════════════

const MELEE_EFFECTS = new Set([
  "talent_percentage_melee_damage",
  "talent_light_weapon_faster",
  "talent_light_weapon_doublehit",
  "talent_free_random_weapon_attack_chance",
  "talent_multi_hit_str_increase",
  "talent_melee_strength_prayer_bonus",
  "talent_percentage_melee_maxhit_distance",
  "talent_2h_melee_echos",
]);

const RANGED_EFFECTS = new Set([
  "talent_percentage_ranged_damage",
  "talent_ranged_regen_echo_chance",
  "talent_crossbow_echo_reproc_chance",
  "talent_crossbow_slow_big_hits",
  "talent_crossbow_max_hit",
  "talent_crossbow_double_accuracy_roll",
  "talent_bow_always_pass_accuracy",
  "talent_bow_fast_hits",
  "talent_bow_min_hit_stacking_increase",
  "talent_bow_max_hit_stacking_increase",
  "talent_thrown_maxhit_echoes",
  "talent_thrown_weapon_melee_str_scale",
  "talent_thrown_weapon_accuracy",
  "talent_thrown_weapon_multi",
  "talent_buffed_ranged_prayers",
  "talent_ranged_echo_cyclical",
  "talent_ranged_strength_hp_difference",
]);

const MAGIC_EFFECTS = new Set([
  "talent_percentage_magic_damage",
  "talent_magic_attack_speed_traditional",
  "talent_magic_attack_speed_powered",
  "talent_air_spell_damage_active_prayers",
  "talent_air_spell_max_hit_prayer_bonus",
  "talent_water_spell_damage_high_hp",
  "talent_water_spell_bouce_heal",
  "talent_fire_hp_consume_for_damage",
  "talent_fire_spell_burn_bounce",
  "talent_earth_reduce_defence",
  "talent_earth_scale_defence_stat",
  "talent_smoke_counts_as_air",
  "talent_ice_counts_as_water",
  "talent_blood_counts_as_fire",
  "talent_shadow_counts_as_earth",
  "talent_regen_stave_charges_water",
  "talent_regen_stave_charges_fire",
  "talent_regen_stave_charges_air",
  "talent_regen_stave_charges_earth",
  "talent_regen_magic_level_boost",
]);

/** Check whether a pact node could provide DPS benefit for the given style. */
export function isNodeRelevantForStyle(node: PactNode, style: CombatStyle): boolean {
  const styleSet = style === "melee" ? MELEE_EFFECTS
    : style === "ranged" ? RANGED_EFFECTS
    : MAGIC_EFFECTS;

  for (const e of node.effects) {
    // Effect matches the current style
    if (styleSet.has(e.type)) return true;
    // Effect is for a different style — check if it's in ANY style set
    if (!MELEE_EFFECTS.has(e.type) && !RANGED_EFFECTS.has(e.type) && !MAGIC_EFFECTS.has(e.type)) {
      // Universal/neutral effect (accuracy, defence, regen, etc.)
      return true;
    }
  }

  return false;
}

/**
 * Beam-search pact optimizer.
 *
 * Unlike simple greedy, this keeps the top BEAM_WIDTH partial solutions at
 * every expansion step so it can see past "transit" nodes (defence / regen)
 * that don't directly improve DPS but unlock powerful capstones.
 *
 * Always fills all 40 points — no early stopping.
 *
 * @param fixedLoadout — when supplied, evaluates against that specific gear
 *   (fast). Otherwise estimates with top-3 weapons + greedy fill (thorough).
 * @returns Up to NUM_RESULTS distinct 40-node pact configurations, best first.
 */
function optimizePactsBeam(
  player: PlayerConfig,
  target: BossPreset,
  lockedSlots: Partial<BuildLoadout>,
  fixedLoadout?: BuildLoadout,
): string[][] {
  const BEAM_WIDTH = 12;
  const NUM_RESULTS = 5;
  const allNodes = getAllNodes();
  const ROOT = "node1";
  const style = player.combatStyle;

  // --- Quick gear estimation resources (skip when fixedLoadout given) ------
  let slotItems: SlotItemMap | null = null;
  let quickWeapons: { weapon: Item; shield: Item | null }[] = [];

  if (!fixedLoadout) {
    slotItems = getSlotCandidates(style, player.regions, lockedSlots);
    for (const slot of Object.keys(slotItems) as EquipmentSlot[]) {
      if (lockedSlots[slot]) continue;
      if (slot === "weapon") {
        const weaponsByCategory = new Map<string, Item[]>();
        for (const w of slotItems.weapon) {
          const cat = w.weaponCategory ?? "other";
          if (!weaponsByCategory.has(cat)) weaponsByCategory.set(cat, []);
          weaponsByCategory.get(cat)!.push(w);
        }
        const pruned: Item[] = [];
        for (const [, group] of weaponsByCategory) {
          pruned.push(...pruneDominated(group, style));
        }
        slotItems.weapon = pruned;
      } else {
        slotItems[slot] = pruneDominated(slotItems[slot], style);
      }
    }
    const scores = slotItems.weapon.map(w => ({ w, s: offensiveScore(w, style) }));
    scores.sort((a, b) => b.s - a.s);
    quickWeapons = scores.slice(0, 3).map(({ w }) => ({
      weapon: w,
      shield: w.isTwoHanded ? null : (slotItems!.shield[0] ?? null),
    }));
  }

  /** Estimate DPS for a pact set. */
  function evalDps(pacts: string[]): number {
    const p = { ...player, activePacts: pacts };
    if (fixedLoadout) {
      // Use optimal spell for the fixed loadout weapon
      const spellMax = getOptimalSpellMaxHit(fixedLoadout.weapon);
      const evalPlayer = spellMax !== undefined ? { ...p, spellMaxHit: spellMax } : p;
      return calculateDps({ player: evalPlayer, loadout: fixedLoadout, target }).dps;
    }
    let best = 0;
    for (const { weapon, shield } of quickWeapons) {
      const loadout = buildBestLoadout(slotItems!, weapon, shield, lockedSlots);
      const spellMax = getOptimalSpellMaxHit(weapon);
      const evalPlayer = spellMax !== undefined ? { ...p, spellMaxHit: spellMax } : p;
      const dps = calculateDps({ player: evalPlayer, loadout, target }).dps;
      if (dps > best) best = dps;
    }
    return best;
  }

  // --- Beam search ---------------------------------------------------------
  interface BeamEntry { selected: Set<string>; dps: number }
  let beam: BeamEntry[] = [{ selected: new Set([ROOT]), dps: evalDps([ROOT]) }];

  for (let step = 1; step < PACT_POINT_LIMIT; step++) {
    const next = new Map<string, BeamEntry>();

    for (const entry of beam) {
      for (const node of allNodes) {
        if (entry.selected.has(node.id)) continue;
        if (!isNodeRelevantForStyle(node, style)) continue;
        if (!canSelectNode(node.id, entry.selected)) continue;

        const sel = new Set(entry.selected);
        sel.add(node.id);

        const pacts = [...sel].sort(); // sorted for deterministic key + DPS doesn't depend on order
        const dps = evalDps(pacts);
        const key = pacts.join(",");

        const prev = next.get(key);
        if (!prev || dps > prev.dps) {
          next.set(key, { selected: sel, dps });
        }
      }
    }

    if (next.size === 0) break; // no more reachable nodes

    const sorted = [...next.values()].sort((a, b) => b.dps - a.dps);
    beam = sorted.slice(0, BEAM_WIDTH);
  }

  beam.sort((a, b) => b.dps - a.dps);
  return beam.slice(0, NUM_RESULTS).map(e => [...e.selected]);
}

// ═══════════════════════════════════════════════════════════════════════
// AMMO CLASSIFICATION & COMPATIBILITY
// ═══════════════════════════════════════════════════════════════════════

export function getAmmoCategory(item: Item): AmmoCategory {
  const name = item.name.toLowerCase();
  if (name.includes("arrow")) return "arrow";
  if (name.includes("bolt")) return "bolt";
  if (name.includes("dart") || name.includes("tar")) return "dart";
  if (name.includes("javelin")) return "javelin";
  if (name.includes("blessing")) return "blessing";
  return "other";
}

export function getCompatibleAmmo(weapon: Item | null): AmmoCategory[] | null {
  if (!weapon?.weaponCategory) return null;
  switch (weapon.weaponCategory) {
    case "bow": return ["arrow", "blessing"];
    case "crossbow": return ["bolt", "blessing"];
    case "blowpipe": return ["dart", "blessing"];
    case "thrown": return ["blessing"];
    default: return null;
  }
}

// ═══════════════════════════════════════════════════════════════════════
// SLOT CANDIDATES
// ═══════════════════════════════════════════════════════════════════════

type SlotItemMap = { [slot in EquipmentSlot]: Item[] };

function getSlotCandidates(
  style: CombatStyle,
  regions: string[],
  locked: Partial<BuildLoadout>,
): SlotItemMap {
  const result: SlotItemMap = {
    head: [], cape: [], neck: [], ammo: [], weapon: [],
    body: [], shield: [], legs: [], hands: [], feet: [], ring: [],
  };

  for (const item of ITEMS) {
    // Region check
    if (item.region && !regions.includes(item.region)) continue;

    // Slot
    const slot = item.slot;

    // If locked, only include the locked item
    if (locked[slot]) continue;

    // Weapon must match combat style
    if (slot === "weapon") {
      if (item.combatStyle && item.combatStyle !== style) continue;
      result.weapon.push(item);
      continue;
    }

    // For non-weapon slots, include if it has any offensive value for the style
    if (isUsefulForStyle(item, style)) {
      result[slot].push(item);
    }
  }

  // Add "none" option for optional slots (ammo, shield, cape, etc.)
  // Weapons must always be filled
  for (const slot of Object.keys(result) as EquipmentSlot[]) {
    if (slot === "weapon") continue;
    if (locked[slot]) {
      result[slot] = [locked[slot]!];
    }
  }

  // Add locked items
  for (const slot of Object.keys(locked) as EquipmentSlot[]) {
    if (locked[slot]) {
      result[slot] = [locked[slot]!];
    }
  }

  return result;
}

function isUsefulForStyle(item: Item, style: CombatStyle): boolean {
  // Prayer bonus doesn't affect DPS formulas (only prayer sustain), so exclude it
  const b = item.bonuses;
  switch (style) {
    case "melee":
      return b.mstr > 0 || b.astab > 0 || b.aslash > 0 || b.acrush > 0;
    case "ranged":
      return b.rstr > 0 || b.aranged > 0;
    case "magic":
      return b.mdmg > 0 || b.amagic > 0;
  }
}

// ═══════════════════════════════════════════════════════════════════════
// DOMINATED ITEM PRUNING
// ═══════════════════════════════════════════════════════════════════════

function pruneDominated(items: Item[], style: CombatStyle): Item[] {
  if (items.length <= 1) return items;

  return items.filter((item, i) => {
    // Keep items with passives — they can't be easily dominated
    if (item.passive) return true;

    for (let j = 0; j < items.length; j++) {
      if (i === j) continue;
      if (dominates(items[j], item, style)) return false;
    }
    return true;
  });
}

function dominates(a: Item, b: Item, style: CombatStyle): boolean {
  // a dominates b if a is >= b in all DPS-relevant stats and > in at least one
  // Prayer bonus excluded — it doesn't affect DPS formulas
  const ab = a.bonuses;
  const bb = b.bonuses;

  let strictlyBetter = false;

  switch (style) {
    case "melee": {
      if (ab.mstr < bb.mstr) return false;
      if (ab.astab < bb.astab) return false;
      if (ab.aslash < bb.aslash) return false;
      if (ab.acrush < bb.acrush) return false;
      if (ab.mstr > bb.mstr || ab.astab > bb.astab || ab.aslash > bb.aslash || ab.acrush > bb.acrush) strictlyBetter = true;
      break;
    }
    case "ranged": {
      if (ab.rstr < bb.rstr) return false;
      if (ab.aranged < bb.aranged) return false;
      if (ab.rstr > bb.rstr || ab.aranged > bb.aranged) strictlyBetter = true;
      break;
    }
    case "magic": {
      if (ab.mdmg < bb.mdmg) return false;
      if (ab.amagic < bb.amagic) return false;
      if (ab.mdmg > bb.mdmg || ab.amagic > bb.amagic) strictlyBetter = true;
      break;
    }
  }

  return strictlyBetter;
}

// ═══════════════════════════════════════════════════════════════════════
// BEST LOADOUT CONSTRUCTION
// ═══════════════════════════════════════════════════════════════════════

function buildBestLoadout(
  slotItems: SlotItemMap,
  weapon: Item,
  shield: Item | null,
  locked: Partial<BuildLoadout>,
): BuildLoadout {
  const loadout: BuildLoadout = {
    head: null, cape: null, neck: null, ammo: null,
    weapon, body: null, shield, legs: null,
    hands: null, feet: null, ring: null,
  };

  // Apply locked slots
  for (const slot of Object.keys(locked) as EquipmentSlot[]) {
    if (locked[slot]) {
      loadout[slot] = locked[slot]!;
    }
  }

  // For each non-fixed slot, pick the best item by offensive value
  const style = weapon.combatStyle ?? "melee";
  const freeSlots: EquipmentSlot[] = ["head", "cape", "neck", "ammo", "body", "legs", "hands", "feet", "ring"];

  for (const slot of freeSlots) {
    if (locked[slot]) continue;
    if (slot === "shield" && weapon.isTwoHanded) continue;

    let candidates = slotItems[slot];

    // Filter ammo by weapon compatibility
    if (slot === "ammo") {
      const compat = getCompatibleAmmo(weapon);
      if (compat) {
        candidates = candidates.filter(a => compat.includes(getAmmoCategory(a)));
      }
    }

    if (candidates.length === 0) continue;

    let bestItem: Item | null = null;
    let bestScore = -Infinity;

    for (const item of candidates) {
      const score = offensiveScore(item, style);
      if (score > bestScore) {
        bestScore = score;
        bestItem = item;
      }
    }

    if (bestItem && bestScore > 0) {
      loadout[slot] = bestItem;
    }
  }

  return loadout;
}

function offensiveScore(item: Item, style: string): number {
  const b = item.bonuses;
  switch (style) {
    case "melee":
      return b.mstr * 2 + Math.max(b.astab, b.aslash, b.acrush) + b.prayer * 0.5;
    case "ranged":
      return b.rstr * 2 + b.aranged + b.prayer * 0.5;
    case "magic": {
      let score = b.mdmg * 3 + b.amagic + b.prayer * 0.5;
      // Powered staves have mdmg=0 but high base damage from magic level.
      // Add a DPS-equivalent bonus so they rank alongside regular staves.
      if (item.weaponCategory === "powered-staff") {
        score += 60;
      }
      return score;
    }
    default:
      return 0;
  }
}

// ═══════════════════════════════════════════════════════════════════════
// SPELL MAX HIT (for regular staves in optimizer)
// ═══════════════════════════════════════════════════════════════════════

/** Staves that can autocast ancient magicks (Ice Barrage base max = 30) */
const ANCIENT_AUTOCAST_STAVES = new Set([
  "kodai", "nightmare-staff", "harm-staff", "echo-shadowflame",
  "ancient-staff", "master-wand", "toxic-sotd", "sotd", "ahrim-staff",
]);

/**
 * Returns the optimal spellMaxHit for a regular staff weapon.
 * Powered staves and non-staff weapons return undefined (not applicable).
 */
function getOptimalSpellMaxHit(weapon: Item | null): number | undefined {
  if (!weapon) return undefined;
  if (weapon.weaponCategory !== "staff") return undefined;
  return ANCIENT_AUTOCAST_STAVES.has(weapon.id) ? 30 : 24;
}
