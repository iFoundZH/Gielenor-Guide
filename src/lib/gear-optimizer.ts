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
    slotItems[slot] = pruneDominated(slotItems[slot], style);
  }

  // Step 3: Weapon-first enumeration
  const weapons = slotItems.weapon;
  const heap: OptimizerResult[] = [];

  for (const weapon of weapons) {
    // If 2H, shield slot is blocked
    const shields = weapon.isTwoHanded ? [null] : slotItems.shield;

    for (const shield of shields) {
      // Build the best loadout for this weapon+shield combo
      const loadout = buildBestLoadout(slotItems, weapon, shield, lockedSlots);

      const ctx = { player, loadout, target };
      const result = calculateDps(ctx);

      insertIntoHeap(heap, { loadout, result }, topN);
    }
  }

  return heap.sort((a, b) => b.result.dps - a.result.dps);
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

  // Phase 1: Enumerate all config combos for "auto" fields
  const combos = enumerateConfigCombos(player);

  // Phase 2: Quick rank — test top 3 weapons with greedy fill for each combo
  const ranked = quickRankCombos(combos, player, target, lockedSlots, style);

  // Phase 3: Full gear optimize for top 5 combos
  const topCombos = ranked.slice(0, 5);
  const heap: OptimizerResult[] = [];

  for (const { combo } of topCombos) {
    const resolved = resolvePlayer(player, combo);
    const results = optimizeGear({
      player: resolved,
      target,
      lockedSlots,
      topN,
    });

    // Tag each result with the optimized config
    const optConfig = buildOptimizedConfig(player, combo);
    for (const r of results) {
      r.optimizedConfig = optConfig;
      insertIntoHeap(heap, r, topN);
    }
  }

  // Phase 4: Comprehensive pact optimization via beam search (if activePacts empty = auto)
  if (player.activePacts.length === 0) {
    // Run beam search for top 2 config combos — different potions/prayers may favour different pacts
    const numPactCombos = Math.min(2, topCombos.length);
    for (let ci = 0; ci < numPactCombos; ci++) {
      const combo = topCombos[ci].combo;
      const resolved = resolvePlayer(player, combo);
      const pactConfigs = optimizePactsBeam(resolved, target, lockedSlots);
      for (const pacts of pactConfigs) {
        const pactPlayer = { ...resolved, activePacts: pacts };
        const pactResults = optimizeGear({
          player: pactPlayer, target, lockedSlots, topN,
        });
        const optConfig = { ...buildOptimizedConfig(player, combo), activePacts: pacts };
        for (const r of pactResults) {
          r.optimizedConfig = optConfig;
          insertIntoHeap(heap, r, topN);
        }
      }
    }

    // Iterative refinement: re-optimise pacts against the best gear found so far
    if (heap.length > 0) {
      const best = heap.reduce((a, b) => (a.result.dps > b.result.dps ? a : b));
      const bestCombo = topCombos[0]?.combo;
      if (bestCombo) {
        const resolved = resolvePlayer(player, bestCombo);
        // Fixed-loadout beam search is fast (no gear estimation per candidate)
        const refinedPacts = optimizePactsBeam(resolved, target, lockedSlots, best.loadout);
        for (const pacts of refinedPacts.slice(0, 2)) {
          const pactPlayer = { ...resolved, activePacts: pacts };
          const pactResults = optimizeGear({
            player: pactPlayer, target, lockedSlots, topN,
          });
          const optConfig = { ...buildOptimizedConfig(player, bestCombo), activePacts: pacts };
          for (const r of pactResults) {
            r.optimizedConfig = optConfig;
            insertIntoHeap(heap, r, topN);
          }
        }
      }
    }
  }

  return heap.sort((a, b) => b.result.dps - a.result.dps);
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
  const voids: ("none" | "void" | "elite-void")[] =
    player.voidSet === "auto" ? ["none", "void", "elite-void"] : [player.voidSet];

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

function quickRankCombos(
  combos: ConfigCombo[],
  player: PlayerConfig,
  target: BossPreset,
  locked: Partial<BuildLoadout>,
  style: CombatStyle,
): { combo: ConfigCombo; dps: number }[] {
  const regions = player.regions;
  const slotItems = getSlotCandidates(style, regions, locked);

  // Pick top 3 weapons by offensive score
  const weaponScores = slotItems.weapon.map(w => ({ w, score: offensiveScore(w, style) }));
  weaponScores.sort((a, b) => b.score - a.score);
  const topWeapons = weaponScores.slice(0, 3).map(ws => ws.w);

  const results: { combo: ConfigCombo; dps: number }[] = [];

  for (const combo of combos) {
    const resolved = resolvePlayer(player, combo);
    let bestDps = 0;

    for (const weapon of topWeapons) {
      const shields = weapon.isTwoHanded ? [null] : slotItems.shield;
      const shield = shields.length > 0 ? shields[0] : null;
      const loadout = buildBestLoadout(slotItems, weapon, shield, locked);

      const result = calculateDps({ player: resolved, loadout, target });
      if (result.dps > bestDps) bestDps = result.dps;
    }

    results.push({ combo, dps: bestDps });
  }

  results.sort((a, b) => b.dps - a.dps);
  return results;
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
      slotItems[slot] = pruneDominated(slotItems[slot], style);
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
      return calculateDps({ player: p, loadout: fixedLoadout, target }).dps;
    }
    let best = 0;
    for (const { weapon, shield } of quickWeapons) {
      const loadout = buildBestLoadout(slotItems!, weapon, shield, lockedSlots);
      const dps = calculateDps({ player: p, loadout, target }).dps;
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
  const b = item.bonuses;
  switch (style) {
    case "melee":
      return b.mstr > 0 || b.astab > 0 || b.aslash > 0 || b.acrush > 0 || b.prayer > 0;
    case "ranged":
      return b.rstr > 0 || b.aranged > 0 || b.prayer > 0;
    case "magic":
      return b.mdmg > 0 || b.amagic > 0 || b.prayer > 0;
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
  // a dominates b if a is >= b in all offensive stats and > in at least one
  const ab = a.bonuses;
  const bb = b.bonuses;

  let strictlyBetter = false;

  switch (style) {
    case "melee": {
      if (ab.mstr < bb.mstr) return false;
      if (ab.astab < bb.astab) return false;
      if (ab.aslash < bb.aslash) return false;
      if (ab.acrush < bb.acrush) return false;
      if (ab.prayer < bb.prayer) return false;
      if (ab.mstr > bb.mstr || ab.astab > bb.astab || ab.aslash > bb.aslash || ab.acrush > bb.acrush || ab.prayer > bb.prayer) strictlyBetter = true;
      break;
    }
    case "ranged": {
      if (ab.rstr < bb.rstr) return false;
      if (ab.aranged < bb.aranged) return false;
      if (ab.prayer < bb.prayer) return false;
      if (ab.rstr > bb.rstr || ab.aranged > bb.aranged || ab.prayer > bb.prayer) strictlyBetter = true;
      break;
    }
    case "magic": {
      if (ab.mdmg < bb.mdmg) return false;
      if (ab.amagic < bb.amagic) return false;
      if (ab.prayer < bb.prayer) return false;
      if (ab.mdmg > bb.mdmg || ab.amagic > bb.amagic || ab.prayer > bb.prayer) strictlyBetter = true;
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

    const candidates = slotItems[slot];
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
    case "magic":
      return b.mdmg * 3 + b.amagic + b.prayer * 0.5;
    default:
      return 0;
  }
}

// ═══════════════════════════════════════════════════════════════════════
// MIN-HEAP (top N by DPS)
// ═══════════════════════════════════════════════════════════════════════

function insertIntoHeap(heap: OptimizerResult[], item: OptimizerResult, maxSize: number): void {
  if (heap.length < maxSize) {
    heap.push(item);
  } else {
    // Find the minimum DPS in heap
    let minIdx = 0;
    for (let i = 1; i < heap.length; i++) {
      if (heap[i].result.dps < heap[minIdx].result.dps) {
        minIdx = i;
      }
    }
    if (item.result.dps > heap[minIdx].result.dps) {
      heap[minIdx] = item;
    }
  }
}
