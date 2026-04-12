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
  SpellElement,
} from "@/types/dps";
import { PACT_POINT_LIMIT } from "@/types/dps";
import { ITEMS } from "@/data/items";
import { calculateDps } from "@/lib/dps-engine";
import { getAllNodes, canSelectNode, canDeselectNode } from "@/data/pacts";
import { aggregatePactEffects } from "@/lib/pact-effects";
import { ANCIENT_SPELLS as ANCIENT_SPELL_DATA, STANDARD_SPELLS as STANDARD_SPELL_DATA } from "@/data/spells";

// ═══════════════════════════════════════════════════════════════════════
// SMART PRUNING THRESHOLDS
// Items must score ≥ threshold fraction of the best item in their slot.
// This replaces hard top-K caps with adaptive, score-relative filtering.
// ═══════════════════════════════════════════════════════════════════════

// Module-level counter: tracks ALL calculateDps calls across all optimizer phases.
// Reset at the start of optimizeBuild, read at the end to report total work done.
let _totalEvaluations = 0;

/** Tracked wrapper around calculateDps — increments the global evaluation counter. */
function evalDpsTracked(params: { player: PlayerConfig; loadout: BuildLoadout; target: BossPreset }): import("@/types/dps").DpsResult {
  _totalEvaluations++;
  return calculateDps(params);
}

/** Flags for pact effects that make non-offensive equipment stats DPS-relevant. */
interface PactAwareness {
  hasThornsScaling: boolean;     // defenceRecoilScaling: defence bonuses → thorns damage
  hasAirPrayerScaling: boolean;  // airSpellMaxHitPrayerBonus: prayer bonus → air spell max hit chance
  hasMeleePrayerScaling: boolean; // meleePrayerStrBonus: prayer bonus → melee str (+50%)
  hasThrownMeleeScaling: boolean; // thrownMeleeStrScale: melee str → ranged str for thrown (+80%)
}

const NO_PACT_FLAGS: PactAwareness = {
  hasThornsScaling: false,
  hasAirPrayerScaling: false,
  hasMeleePrayerScaling: false,
  hasThrownMeleeScaling: false,
};

const ARMOUR_SCORE_THRESHOLD = 0.4;  // 40% of best — kills junk wiki items, keeps viable options
const ARMOUR_HARD_CAP = 6;           // Safety cap per armour slot
const WEAPON_SCORE_THRESHOLD = 0.25; // Weapons are diverse due to passives/speed — keep more
const WEAPON_HARD_CAP = 5;           // Per weapon category
const AMMO_SCORE_THRESHOLD = 0.4;
const AMMO_HARD_CAP = 3;             // Per ammo category

/** Staves that can autocast ancient magicks (Ice Barrage base max = 30) */
const ANCIENT_AUTOCAST_STAVES = new Set([
  "kodai", "nightmare-staff", "harm-staff", "echo-shadowflame",
  "ancient-staff", "master-wand", "toxic-sotd", "sotd", "ahrim-staff",
]);

// ═══════════════════════════════════════════════════════════════════════
// PUBLIC API
// ═══════════════════════════════════════════════════════════════════════

export function optimizeGear(config: OptimizerConfig): OptimizerResult[] {
  const { player, target, lockedSlots, topN } = config;
  const style = player.combatStyle;
  const regions = player.regions;

  // Step 1: Detect pact-based item pool expansions
  const pe = aggregatePactEffects(player.activePacts);
  const pactFlags: PactAwareness = {
    hasThornsScaling: pe.thornsDamage > 0 && pe.defenceRecoilScaling,
    hasAirPrayerScaling: style === "magic" && (pe.airSpellMaxHitPrayerBonus > 0 || pe.airSpellDamagePerPrayer > 0)
      && (player.spellElement === "air" || player.spellElement === "smoke"),
    hasMeleePrayerScaling: style === "melee" && pe.meleePrayerStrBonus,
    hasThrownMeleeScaling: style === "ranged" && pe.thrownMeleeStrScale,
  };

  // Step 2: Get available items by slot (filtered by region + style + pact awareness)
  const slotItems = getSlotCandidates(style, regions, lockedSlots, pactFlags);

  // Step 3: Smart pruning — dominated-item removal + score threshold filtering
  // The wiki DB has 2000+ items; dominated pruning removes strictly inferior items,
  // then score threshold keeps only items scoring ≥ X% of the best in their slot.
  // This adapts to each slot's distribution: 4-6 items typically survive per slot.

  for (const slot of Object.keys(slotItems) as EquipmentSlot[]) {
    if (lockedSlots[slot]) continue; // don't prune locked slots
    if (slot === "weapon") {
      // Group weapons by category, prune within each group only
      const weaponsByCategory = new Map<string, Item[]>();
      for (const w of slotItems.weapon) {
        const cat = w.weaponCategory ?? "other";
        if (!weaponsByCategory.has(cat)) weaponsByCategory.set(cat, []);
        weaponsByCategory.get(cat)!.push(w);
      }
      const prunedWeapons: Item[] = [];
      for (const [, group] of weaponsByCategory) {
        const pruned = pruneDominated(group, style, pactFlags);
        prunedWeapons.push(...pruneByThreshold(pruned, style, WEAPON_SCORE_THRESHOLD, WEAPON_HARD_CAP, pactFlags));
      }
      slotItems.weapon = prunedWeapons;
    } else if (slot === "ammo") {
      // Group ammo by category, prune within each group only
      const ammoByCategory = new Map<string, Item[]>();
      for (const a of slotItems.ammo) {
        const cat = getAmmoCategory(a);
        if (!ammoByCategory.has(cat)) ammoByCategory.set(cat, []);
        ammoByCategory.get(cat)!.push(a);
      }
      const prunedAmmo: Item[] = [];
      for (const [, group] of ammoByCategory) {
        const pruned = pruneDominated(group, style, pactFlags);
        prunedAmmo.push(...pruneByThreshold(pruned, style, AMMO_SCORE_THRESHOLD, AMMO_HARD_CAP, pactFlags));
      }
      slotItems.ammo = prunedAmmo;
    } else {
      slotItems[slot] = pruneByThreshold(
        pruneDominated(slotItems[slot], style, pactFlags),
        style, ARMOUR_SCORE_THRESHOLD, ARMOUR_HARD_CAP, pactFlags,
      );
    }
  }

  // Step 4: Exhaustive combinatorial search — try EVERY combination across all slots
  const weapons = slotItems.weapon;
  const bestPerWeapon = new Map<string, OptimizerResult>();
  let totalCombinations = 0;

  // Free slots (excluding weapon and shield, which are enumerated in the weapon loop)
  const freeSlots = (["head", "cape", "neck", "ammo", "body", "legs", "hands", "feet", "ring"] as EquipmentSlot[])
    .filter(s => !lockedSlots[s]);

  for (const weapon of weapons) {
    // Set optimal spell for staff weapons (respects player's chosen element if set)
    const spellConfig = getOptimalSpellConfig(weapon, player.spellElement);
    const adjustedPlayer = spellConfig
      ? { ...player, spellMaxHit: spellConfig.spellMaxHit, spellElement: spellConfig.spellElement }
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
          const result = evalDpsTracked({ player: adjustedPlayer, loadout, target });
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

  // Tag the top result with gear combinations counted (Phase 4 only — total evals tracked globally)
  if (results.length > 0) {
    results[0].totalEvaluations = totalCombinations;
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
  onSlayerTask: boolean;
}

export function optimizeBuild(config: OptimizerConfig): OptimizerResult[] {
  _totalEvaluations = 0;
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
      const spellConfig = getOptimalSpellConfig(r.loadout.weapon, optConfig.spellElement);
      const config = spellConfig
        ? { ...optConfig, spellMaxHit: spellConfig.spellMaxHit, spellElement: spellConfig.spellElement }
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
    const combos = enumerateConfigCombos(regionPlayer, target);

    // Phase 2: Quick rank — test top 5 weapons with greedy fill for each combo
    const ranked = quickRankCombos(combos, regionPlayer, target, lockedSlots, style);
    const topCombos = ranked.slice(0, 5);
    const baseOptConfig = autoRegion ? { regions: regionSet } : {};

    // Phase 3: Pact + spell element optimization
    // Skip pact optimization if user has manually selected pacts (non-empty).
    // For magic staves: try each spell element to find the best pact+element combo.
    // For melee/ranged: standard pact beam search.
    const bestCombo = topCombos[0]?.combo;
    const userLockedPacts = regionPlayer.activePacts.length > 0;
    let bestPacts: string[] = regionPlayer.activePacts;
    let bestSpellCfg: SpellConfig | undefined;
    // Spell element is only "locked" when the user manually chose BOTH pacts and a spell.
    // When pacts are auto, spellElement was likely set by a previous optimizer run — always re-search.
    const userLockedSpell = userLockedPacts
      && regionPlayer.spellElement !== undefined && regionPlayer.spellElement !== "none";
    // Additional pact+spell combos to try in Phase 4 (magic archetypes: element vs powered)
    const extraPactConfigs: { pacts: string[]; spell?: SpellConfig }[] = [];

    if (bestCombo) {
      const resolved = resolvePlayer(regionPlayer, bestCombo);

      if (userLockedPacts) {
        // User locked pacts — respect their selection, only optimize spell if auto
        if (style === "magic" && !userLockedSpell) {
          const si = getSlotCandidates(style, regionPlayer.regions, lockedSlots);
          // Test both ancient and standard staves for spell element
          const staffWeaponsLocked = si.weapon
            .filter(w => w.weaponCategory === "staff")
            .map(w => ({ w, s: offensiveScore(w, style) }))
            .sort((a, b) => b.s - a.s);
          const testedSpellbooksLocked = new Set<string>();
          let bestSpellDpsLocked = -Infinity;
          for (const { w: staffW } of staffWeaponsLocked) {
            const spellbook = ANCIENT_AUTOCAST_STAVES.has(staffW.id) ? "ancient" : "standard";
            if (testedSpellbooksLocked.has(spellbook)) continue;
            testedSpellbooksLocked.add(spellbook);

            const viableSpells = getViableSpells(staffW);
            const staffShield = staffW.isTwoHanded ? null : (si.shield[0] ?? null);
            const staffLoadout = buildBestLoadout(si, staffW, staffShield, lockedSlots);
            for (const spell of viableSpells) {
              const spellPlayer = { ...resolved, spellMaxHit: spell.spellMaxHit, spellElement: spell.spellElement };
              const dps = evalDpsTracked({ player: spellPlayer, loadout: staffLoadout, target }).dps;
              if (dps > bestSpellDpsLocked) {
                bestSpellDpsLocked = dps;
                bestSpellCfg = spell;
              }
            }
          }
        }
      } else {
        // User didn't select pacts — auto-optimize them
        const cleanPlayer = { ...resolved, activePacts: [] as string[] };

        if (style === "magic" && !userLockedSpell) {
          // Test BOTH standard staves (with spell elements) and powered staves (without)
          // by collecting pact sets for each archetype and running Phase 4 for BOTH.
          // Quick estimation can't reliably pick the winner, so we let Phase 4's exhaustive
          // search determine which archetype actually produces higher DPS.
          const si = getSlotCandidates(style, regionPlayer.regions, lockedSlots);
          const ranked = si.weapon
            .map(w => ({ w, s: offensiveScore(w, style) }))
            .sort((a, b) => b.s - a.s);

          // Path A: Standard staves — test each spell element with staff-only beam search
          const STAFF_ONLY = new Set(["staff"]);
          const staffWeapons = ranked.filter(({ w }) => w.weaponCategory === "staff");
          const testedSpellbooks = new Set<string>();
          let bestStaffDps = -Infinity;
          let bestStaffPacts: string[] = [];
          let bestStaffSpell: SpellConfig | undefined;
          for (const { w: staffW } of staffWeapons) {
            // Harm staff tests BOTH spellbooks (standard at 4t, ancient at 5t) — give it its own key
            const spellbook = staffW.id === "harm-staff" ? "harm"
              : ANCIENT_AUTOCAST_STAVES.has(staffW.id) ? "ancient" : "standard";
            if (testedSpellbooks.has(spellbook)) continue;
            testedSpellbooks.add(spellbook);

            const viableSpells = getViableSpells(staffW);

            // Build spell list including a virtual "smoke-as-air" entry for ancient staves.
            // Smoke Barrage + smokeCountsAsAir pact converts to air, enabling +7% per prayer
            // scaling. The beam search can't discover this 2-step synergy incrementally, so
            // we test it directly: Smoke Barrage max hit (27) with air element + 6 prayers.
            const spellsToTest: SpellConfig[] = [...viableSpells];
            if (spellbook === "ancient") {
              const smokeSpell = viableSpells.find(s => s.spellElement === "smoke");
              if (smokeSpell) {
                spellsToTest.push({ spellMaxHit: smokeSpell.spellMaxHit, spellElement: "air" });
              }
            }

            for (const spell of spellsToTest) {
              // Air/smoke spells scale with prayer count — assume max (6) for evaluation
              const isAirElement = spell.spellElement === "air" || spell.spellElement === "smoke";
              const spellPlayer = {
                ...cleanPlayer,
                spellMaxHit: spell.spellMaxHit,
                spellElement: spell.spellElement,
                ...(isAirElement ? { activePrayerCount: 6 } : {}),
              };
              const pactConfigs = optimizePactsBeam(spellPlayer, target, lockedSlots, undefined, STAFF_ONLY);
              if (pactConfigs.length > 0) {
                const evalPlayer = { ...spellPlayer, activePacts: pactConfigs[0] };
                const shield = staffW.isTwoHanded ? null : (si.shield[0] ?? null);
                const loadout = buildBestLoadout(si, staffW, shield, lockedSlots);
                const dps = evalDpsTracked({ player: evalPlayer, loadout, target }).dps;
                if (dps > bestStaffDps) {
                  bestStaffDps = dps;
                  bestStaffPacts = pactConfigs[0];
                  bestStaffSpell = spell;
                }
              }
            }
          }

          // Path B: Powered staves — beam search with powered-staff-only evaluation
          const POWERED_ONLY = new Set(["powered-staff"]);
          const poweredPactConfigs = optimizePactsBeam(cleanPlayer, target, lockedSlots, undefined, POWERED_ONLY);

          // Use powered-staff pacts as primary (most reliable for Phase 4),
          // and element-staff pacts as extra config to also run in Phase 4.
          if (poweredPactConfigs.length > 0) {
            bestPacts = poweredPactConfigs[0];
            bestSpellCfg = undefined;
            // Add element build as extra Phase 4 run
            if (bestStaffPacts.length > 0) {
              extraPactConfigs.push({ pacts: bestStaffPacts, spell: bestStaffSpell });
            }
          } else if (bestStaffPacts.length > 0) {
            bestPacts = bestStaffPacts;
            bestSpellCfg = bestStaffSpell;
          }
        } else if (style === "magic" && userLockedSpell) {
          // Magic with locked spell — optimize pacts only
          const spellPlayer = { ...cleanPlayer, spellMaxHit: resolved.spellMaxHit, spellElement: resolved.spellElement };
          const pactConfigs = optimizePactsBeam(spellPlayer, target, lockedSlots);
          if (pactConfigs.length > 0) bestPacts = pactConfigs[0];
        } else if (style === "ranged") {
          // Ranged: try pact optimization per weapon archetype (bow, crossbow, blowpipe, thrown)
          // Different archetypes benefit from very different pacts — crossbow mastery vs bow stacking etc.
          const si = getSlotCandidates(style, regionPlayer.regions, lockedSlots);
          const archetypes = new Map<string, Item>();
          for (const w of si.weapon) {
            const cat = w.weaponCategory ?? "other";
            const existing = archetypes.get(cat);
            if (!existing || offensiveScore(w, style) > offensiveScore(existing, style)) {
              archetypes.set(cat, w);
            }
          }

          let bestArchDps = -Infinity;
          for (const [, topW] of archetypes) {
            const shield = topW.isTwoHanded ? null : (si.shield[0] ?? null);
            const loadout = buildBestLoadout(si, topW, shield, lockedSlots);
            const pactConfigs = optimizePactsBeam(cleanPlayer, target, lockedSlots, loadout);
            if (pactConfigs.length > 0) {
              const evalPlayer = { ...cleanPlayer, activePacts: pactConfigs[0] };
              const dps = evalDpsTracked({ player: evalPlayer, loadout, target }).dps;
              if (dps > bestArchDps) {
                bestArchDps = dps;
                bestPacts = pactConfigs[0];
              }
            }
          }

          // Fallback if no archetypes found
          if (bestPacts.length === 0) {
            const pactConfigs = optimizePactsBeam(cleanPlayer, target, lockedSlots);
            if (pactConfigs.length > 0) bestPacts = pactConfigs[0];
          }
        } else {
          // Melee: per-archetype pact optimization (like ranged).
          // Halberds benefit from distance pacts that are invisible when the beam search
          // takes MAX(dps) across all weapons — non-halberd weapons always dominate the MAX,
          // so distance pacts never appear valuable. Run separate beam searches per archetype.
          const si = getSlotCandidates(style, regionPlayer.regions, lockedSlots);
          const archetypes = new Map<string, Item>();
          for (const w of si.weapon) {
            const cat = w.weaponCategory ?? "other";
            const existing = archetypes.get(cat);
            if (!existing || offensiveScore(w, style) > offensiveScore(existing, style)) {
              archetypes.set(cat, w);
            }
          }

          let bestArchDps = -Infinity;
          const archPactResults: { cat: string; pacts: string[]; dps: number }[] = [];
          for (const [cat, topW] of archetypes) {
            const shield = topW.isTwoHanded ? null : (si.shield[0] ?? null);
            const loadout = buildBestLoadout(si, topW, shield, lockedSlots);
            // Enable capstone injection for halberds: node155 (range boost to 7) requires
            // traversing non-DPS gateway nodes the greedy beam never picks.
            const needsCapstone = cat === "halberd";
            const pactConfigs = optimizePactsBeam(cleanPlayer, target, lockedSlots, loadout, undefined, needsCapstone);
            if (pactConfigs.length > 0) {
              const evalPlayer = { ...cleanPlayer, activePacts: pactConfigs[0] };
              const dps = evalDpsTracked({ player: evalPlayer, loadout, target }).dps;
              archPactResults.push({ cat, pacts: pactConfigs[0], dps });
              if (dps > bestArchDps) {
                bestArchDps = dps;
                bestPacts = pactConfigs[0];
              }
            }
          }

          // Push non-winning archetype pacts into extraPactConfigs so Phase 4
          // evaluates ALL weapons with each archetype's optimal pacts.
          for (const r of archPactResults) {
            if (r.pacts.join(",") !== bestPacts.join(",")) {
              extraPactConfigs.push({ pacts: r.pacts });
            }
          }

          // Fallback if no archetypes found
          if (bestPacts.length === 0) {
            const pactConfigs = optimizePactsBeam(cleanPlayer, target, lockedSlots);
            if (pactConfigs.length > 0) bestPacts = pactConfigs[0];
          }
        }
      }
    }

    // Phase 4: Exhaustive gear search — run for primary pacts + any extra archetype pacts
    if (bestCombo) {
      const resolved = resolvePlayer(regionPlayer, bestCombo);

      // Build list of pact configs to run Phase 4 with
      const phase4Configs: { pacts: string[]; spell?: SpellConfig }[] = [{ pacts: bestPacts, spell: bestSpellCfg }];
      for (const extra of extraPactConfigs) {
        // Skip if same pacts as primary
        if (extra.pacts.join(",") !== bestPacts.join(",")) {
          phase4Configs.push(extra);
        }
      }

      const allPhase4Results: OptimizerResult[] = [];
      for (const p4cfg of phase4Configs) {
        const isAirSpell = p4cfg.spell?.spellElement === "air" || p4cfg.spell?.spellElement === "smoke";
        const pactPlayer = p4cfg.spell
          ? { ...resolved, activePacts: p4cfg.pacts, spellElement: p4cfg.spell.spellElement, spellMaxHit: p4cfg.spell.spellMaxHit,
              ...(isAirSpell ? { activePrayerCount: 6 } : {}) }
          : { ...resolved, activePacts: p4cfg.pacts };
        const results = optimizeGear({ player: pactPlayer, target, lockedSlots, topN });
        const optCfg: OptimizedConfig = {
          ...baseOptConfig,
          ...buildOptimizedConfig(regionPlayer, bestCombo),
          ...(!userLockedPacts ? { activePacts: p4cfg.pacts } : {}),
          ...(!userLockedSpell && p4cfg.spell ? { spellElement: p4cfg.spell.spellElement, spellMaxHit: p4cfg.spell.spellMaxHit } : {}),
          ...(isAirSpell ? { activePrayerCount: 6 } : {}),
        };
        mergeResults(results, optCfg);
        allPhase4Results.push(...results);
      }

      // Iterative refinement: re-optimise pacts (+ spell for magic) against best gear
      // Skip if user locked pacts — nothing to refine
      const sortedP4 = allPhase4Results.sort((a, b) => b.result.dps - a.result.dps);
      const best = sortedP4[0];
      if (best && !userLockedPacts) {
        const cleanPlayer2 = { ...resolved, activePacts: [] as string[] };
        let refinedPacts = bestPacts;
        let refinedSpell = bestSpellCfg;

        if (style === "magic" && !userLockedSpell && best.loadout.weapon) {
          let refinedBestDps = -Infinity;

          // Try spell elements with best weapon if it's a standard staff
          const viableSpells = getViableSpells(best.loadout.weapon);
          for (const spell of viableSpells) {
            const spellPlayer = { ...cleanPlayer2, spellMaxHit: spell.spellMaxHit, spellElement: spell.spellElement };
            const pactConfigs = optimizePactsBeam(spellPlayer, target, lockedSlots, best.loadout);
            if (pactConfigs.length > 0) {
              const evalPlayer = { ...spellPlayer, activePacts: pactConfigs[0] };
              const dps = evalDpsTracked({ player: evalPlayer, loadout: best.loadout, target }).dps;
              if (dps > refinedBestDps) {
                refinedBestDps = dps;
                refinedPacts = pactConfigs[0];
                refinedSpell = spell;
              }
            }
          }

          // If best is powered staff, also check if a standard staff in the results could beat it
          if (best.loadout.weapon.weaponCategory === "powered-staff" || viableSpells.length === 0) {
            const staffResult = sortedP4.find(r =>
              r.loadout.weapon?.weaponCategory === "staff" && r.loadout.weapon !== best.loadout.weapon
            );
            if (staffResult?.loadout.weapon) {
              const staffSpells = getViableSpells(staffResult.loadout.weapon);
              for (const spell of staffSpells) {
                const spellPlayer = { ...cleanPlayer2, spellMaxHit: spell.spellMaxHit, spellElement: spell.spellElement };
                const pactConfigs = optimizePactsBeam(spellPlayer, target, lockedSlots, staffResult.loadout);
                if (pactConfigs.length > 0) {
                  const evalPlayer = { ...spellPlayer, activePacts: pactConfigs[0] };
                  const dps = evalDpsTracked({ player: evalPlayer, loadout: staffResult.loadout, target }).dps;
                  if (dps > refinedBestDps) {
                    refinedBestDps = dps;
                    refinedPacts = pactConfigs[0];
                    refinedSpell = spell;
                  }
                }
              }
            }

            // Also refine powered staff without element
            const pactConfigs = optimizePactsBeam(cleanPlayer2, target, lockedSlots, best.loadout);
            if (pactConfigs.length > 0) {
              const evalPlayer = { ...cleanPlayer2, activePacts: pactConfigs[0] };
              const dps = evalDpsTracked({ player: evalPlayer, loadout: best.loadout, target }).dps;
              if (dps > refinedBestDps) {
                refinedBestDps = dps;
                refinedPacts = pactConfigs[0];
                refinedSpell = undefined;
              }
            }
          }
        } else if (style !== "magic" || userLockedSpell) {
          const pactConfigs = optimizePactsBeam(cleanPlayer2, target, lockedSlots, best.loadout);
          if (pactConfigs.length > 0) refinedPacts = pactConfigs[0];
        }

        const changed = refinedPacts.join(",") !== bestPacts.join(",")
          || (refinedSpell?.spellElement !== bestSpellCfg?.spellElement);
        if (changed) {
          const refinedPlayer = refinedSpell
            ? { ...resolved, activePacts: refinedPacts, spellElement: refinedSpell.spellElement, spellMaxHit: refinedSpell.spellMaxHit }
            : { ...resolved, activePacts: refinedPacts };
          const refinedResults = optimizeGear({ player: refinedPlayer, target, lockedSlots, topN });
          const refinedOptCfg: OptimizedConfig = {
            ...baseOptConfig,
            ...buildOptimizedConfig(regionPlayer, bestCombo),
            activePacts: refinedPacts,
            ...(refinedSpell ? { spellElement: refinedSpell.spellElement, spellMaxHit: refinedSpell.spellMaxHit } : {}),
          };
          mergeResults(refinedResults, refinedOptCfg);
        }
      }
    }
  }

  // Phase 5: Per-build pact refinement — each build gets its own optimal pact set.
  // Skip if user manually selected pacts (they apply uniformly to all builds).
  const finalResults = [...bestPerWeapon.values()]
    .sort((a, b) => b.result.dps - a.result.dps)
    .slice(0, topN);

  const userLockedPactsGlobal = player.activePacts.length > 0;
  if (!userLockedPactsGlobal) {
    for (const r of finalResults) {
      if (!r.optimizedConfig) continue;
      const opt = r.optimizedConfig;

      // Reconstruct the fully-resolved player for this build (no "auto" fields)
      const resolved: PlayerConfig = {
        ...player,
        ...(opt.potion ? { potion: opt.potion } : {}),
        ...(opt.prayerType ? { prayerType: opt.prayerType } : {}),
        ...(opt.attackStyle ? { attackStyle: opt.attackStyle } : {}),
        ...(opt.voidSet ? { voidSet: opt.voidSet } : {}),
        ...(opt.onSlayerTask !== undefined ? { onSlayerTask: opt.onSlayerTask } : {}),
        ...(opt.regions ? { regions: opt.regions } : {}),
        activePacts: [],
      };

      if (style === "magic" && r.loadout.weapon) {
        const viableSpells = getViableSpells(r.loadout.weapon);

        // Also test smoke-as-air virtual spell for ancient-only staves (same as Phase 3).
        // Skip for harm-staff — it has real Wind Surge (standard air) so the virtual spell
        // is redundant and would get incorrect 4t speed (ancient spells are 5t on harm).
        const spellsToTest = [...viableSpells];
        if (ANCIENT_AUTOCAST_STAVES.has(r.loadout.weapon.id) && r.loadout.weapon.id !== "harm-staff") {
          const smokeSpell = viableSpells.find(s => s.spellElement === "smoke");
          if (smokeSpell) {
            spellsToTest.push({ spellMaxHit: smokeSpell.spellMaxHit, spellElement: "air" });
          }
        }

        let bestDps = -Infinity;
        let bestPactsForBuild: string[] = opt.activePacts ?? [];
        let bestSpellForBuild: SpellConfig | undefined;
        let bestPrayerCount: number | undefined;

        for (const spell of spellsToTest) {
          // Air/smoke spells scale with prayer count — assume max (6)
          const isAir = spell.spellElement === "air" || spell.spellElement === "smoke";
          const sp = { ...resolved, spellMaxHit: spell.spellMaxHit, spellElement: spell.spellElement,
            ...(isAir ? { activePrayerCount: 6 } : {}) };
          const pactConfigs = optimizePactsBeam(sp, target, lockedSlots, r.loadout);
          if (pactConfigs.length > 0) {
            const ep = { ...sp, activePacts: pactConfigs[0] };
            const dps = evalDpsTracked({ player: ep, loadout: r.loadout, target }).dps;
            if (dps > bestDps) {
              bestDps = dps;
              bestPactsForBuild = pactConfigs[0];
              bestSpellForBuild = spell;
              bestPrayerCount = isAir ? 6 : undefined;
            }
          }
        }
        // Also try without spell element (powered staves)
        const noSpellPacts = optimizePactsBeam(resolved, target, lockedSlots, r.loadout);
        if (noSpellPacts.length > 0) {
          const ep = { ...resolved, activePacts: noSpellPacts[0] };
          const dps = evalDpsTracked({ player: ep, loadout: r.loadout, target }).dps;
          if (dps > bestDps) { bestDps = dps; bestPactsForBuild = noSpellPacts[0]; bestSpellForBuild = undefined; bestPrayerCount = undefined; }
        }

        r.optimizedConfig = { ...opt, activePacts: bestPactsForBuild,
          ...(bestSpellForBuild ? { spellElement: bestSpellForBuild.spellElement, spellMaxHit: bestSpellForBuild.spellMaxHit } : {}),
          ...(bestPrayerCount ? { activePrayerCount: bestPrayerCount } : {}),
        };
        const finalPlayer = { ...resolved, activePacts: bestPactsForBuild,
          ...(bestSpellForBuild ? { spellElement: bestSpellForBuild.spellElement, spellMaxHit: bestSpellForBuild.spellMaxHit } : {}),
          ...(bestPrayerCount ? { activePrayerCount: bestPrayerCount } : {}),
        };
        r.result = evalDpsTracked({ player: finalPlayer, loadout: r.loadout, target });
      } else {
        // Melee or ranged — beam search pacts for this specific loadout (with capstone injection)
        const pactConfigs = optimizePactsBeam(resolved, target, lockedSlots, r.loadout, undefined, true);
        if (pactConfigs.length > 0) {
          r.optimizedConfig = { ...opt, activePacts: pactConfigs[0] };
          const finalPlayer = { ...resolved, activePacts: pactConfigs[0] };
          r.result = evalDpsTracked({ player: finalPlayer, loadout: r.loadout, target });
        }
      }
    }
  }

  // Re-sort after per-build refinement (different pacts change DPS)
  const sorted = finalResults.sort((a, b) => b.result.dps - a.result.dps);

  // Attach total evaluation count across ALL phases (pact beam, gear search, refinement, etc.)
  if (sorted.length > 0) {
    sorted[0].totalEvaluations = _totalEvaluations;
  }

  return sorted;
}

function getValidPotions(style: CombatStyle, boss?: BossPreset): Exclude<PotionType, "auto">[] {
  const bossId = boss?.id ?? "";
  const isCox = bossId.startsWith("olm");
  const isToa = bossId.startsWith("wardens");

  switch (style) {
    case "melee":
      return [
        "super-combat",
        ...(isCox ? ["overload" as const] : []),
        ...(isToa ? ["smelling-salts" as const] : []),
        "none",
      ];
    case "ranged":
      return [
        "ranging",
        ...(isCox ? ["overload" as const] : []),
        ...(isToa ? ["smelling-salts" as const] : []),
        "none",
      ];
    case "magic":
      return [
        "magic",
        ...(isCox ? ["overload" as const] : []),
        ...(isToa ? ["smelling-salts" as const] : []),
        "none",
      ];
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

function enumerateConfigCombos(player: PlayerConfig, boss?: BossPreset): ConfigCombo[] {
  const style = player.combatStyle;
  const potions = player.potion === "auto" ? getValidPotions(style, boss) : [player.potion];
  const prayers = player.prayerType === "auto" ? getValidPrayers(style) : [player.prayerType];
  const styles = player.attackStyle === "auto" ? getValidAttackStyles(style) : [player.attackStyle];
  // Void is not auto-searched — void armour replaces BIS gear in head/body/legs/hands
  // but those items aren't modelled, so auto-selecting void would stack % bonuses on BIS.
  // Users must explicitly pick void/elite-void if they want it.
  const voidSet: "none" | "void" | "elite-void" =
    player.voidSet === "auto" ? "none" : player.voidSet;
  // Slayer task: bosses that require a task always force on; "auto" searches both on/off otherwise
  const slayerOptions: boolean[] = boss?.requiresSlayerTask
    ? [true]
    : player.onSlayerTask === "auto" ? [true, false] : [player.onSlayerTask === true];
  const combos: ConfigCombo[] = [];
  for (const potion of potions) {
    for (const prayerType of prayers) {
      for (const attackStyle of styles) {
        for (const onSlayerTask of slayerOptions) {
          combos.push({ potion, prayerType, attackStyle, voidSet, onSlayerTask });
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
    onSlayerTask: combo.onSlayerTask,
  };
}

function buildOptimizedConfig(player: PlayerConfig, combo: ConfigCombo): OptimizedConfig {
  const opt: OptimizedConfig = {};
  if (player.potion === "auto") opt.potion = combo.potion;
  if (player.prayerType === "auto") opt.prayerType = combo.prayerType;
  if (player.attackStyle === "auto") opt.attackStyle = combo.attackStyle;
  if (player.voidSet === "auto") opt.voidSet = combo.voidSet;
  if (player.onSlayerTask === "auto") opt.onSlayerTask = combo.onSlayerTask;
  return opt;
}

// ═══════════════════════════════════════════════════════════════════════
// REGION AUTO-SELECTION
// ═══════════════════════════════════════════════════════════════════════

const STARTING_REGIONS = ["varlamore", "karamja"];
const CHOOSABLE_REGIONS = ["asgarnia", "fremennik", "kandarin", "morytania", "desert", "tirannwn", "kourend", "wilderness"];

/** True if the user hasn't selected any choosable regions beyond the 2 starting ones. */
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
 * Rank region combos by quick DPS estimate.
 * If the boss lives in a choosable region, that region is forced into every combo
 * (C(7,2)=21 combos). Otherwise all C(8,3)=56 combos are evaluated.
 * Returns the top 5 full region arrays (starting + chosen), best first.
 */
function rankRegionCombos(
  player: PlayerConfig,
  target: BossPreset,
  locked: Partial<BuildLoadout>,
  style: CombatStyle,
): string[][] {
  const bossRegion = target.region;
  const forcedRegion = bossRegion && CHOOSABLE_REGIONS.includes(bossRegion) ? bossRegion : null;
  const remainingPool = forcedRegion
    ? CHOOSABLE_REGIONS.filter(r => r !== forcedRegion)
    : CHOOSABLE_REGIONS;
  const slotsToFill = forcedRegion ? 2 : 3;
  const allCombos = combinations(remainingPool, slotsToFill).map(combo =>
    forcedRegion ? [forcedRegion, ...combo] : combo,
  );

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
    onSlayerTask: target.requiresSlayerTask ? true : player.onSlayerTask === "auto" ? false : player.onSlayerTask === true,
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
      const spellConfig = getOptimalSpellConfig(w);
      const evalPlayer = spellConfig
        ? { ...regionPlayer, spellMaxHit: spellConfig.spellMaxHit, spellElement: spellConfig.spellElement }
        : regionPlayer;
      const result = evalDpsTracked({ player: evalPlayer, loadout, target });
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

      // Use optimal spell for staff weapons (default element for quick rank)
      const spellConfig = getOptimalSpellConfig(weapon);
      const evalPlayer = spellConfig
        ? { ...resolved, spellMaxHit: spellConfig.spellMaxHit, spellElement: spellConfig.spellElement }
        : resolved;

      const result = evalDpsTracked({ player: evalPlayer, loadout, target });
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
  "talent_distance_melee_minhit",
  "talent_melee_range_conditional_boost",
  "talent_overheal_consumption_boost",
  "talent_unique_blindbag_chance",
  "talent_unique_blindbag_damage",
  "talent_melee_range_multiplier",
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
  "talent_firerune_regen_damage_boost",
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
  /** When set, quickWeapons only includes weapons from these categories */
  weaponCategoryFilter?: Set<string>,
  /** Enable capstone injection post-processing (expensive — only for final per-build refinement) */
  enableCapstoneInjection: boolean = false,
): string[][] {
  const BEAM_WIDTH = 6;
  const NUM_RESULTS = 3;
  const allNodes = getAllNodes();
  const ROOT = "node1";
  const style = player.combatStyle;

  // --- Quick gear estimation resources (skip when fixedLoadout given) ------
  let slotItems: SlotItemMap | null = null;
  const quickWeapons: { weapon: Item; shield: Item | null }[] = [];

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
          pruned.push(...pruneByThreshold(pruneDominated(group, style), style, 0.25, 2));
        }
        slotItems.weapon = pruned;
      } else {
        slotItems[slot] = pruneByThreshold(pruneDominated(slotItems[slot], style), style, 0.5, 3);
      }
    }
    const scores = slotItems.weapon.map(w => ({ w, s: offensiveScore(w, style) }));
    scores.sort((a, b) => b.s - a.s);
    // Use top-2 weapons for quick estimation — more is diminishing returns since we
    // re-optimize pacts per build in Phase 5. This keeps beam search fast (~2 weapons
    // instead of 6+ categories).
    const MAX_QUICK_WEAPONS = 2;
    const seenCats = new Set<string>();
    for (const { w } of scores) {
      if (quickWeapons.length >= MAX_QUICK_WEAPONS) break;
      const cat = w.weaponCategory ?? "other";
      if (weaponCategoryFilter && !weaponCategoryFilter.has(cat)) continue;
      if (!seenCats.has(cat)) {
        seenCats.add(cat);
        quickWeapons.push({
          weapon: w,
          shield: w.isTwoHanded ? null : (slotItems!.shield[0] ?? null),
        });
      }
    }
  }

  /** Estimate DPS for a pact set. */
  function evalDps(pacts: string[]): number {
    const p = { ...player, activePacts: pacts };
    if (fixedLoadout) {
      const spellConfig = getOptimalSpellConfig(fixedLoadout.weapon, player.spellElement);
      const evalPlayer = spellConfig
        ? { ...p, spellMaxHit: spellConfig.spellMaxHit, spellElement: spellConfig.spellElement }
        : p;
      return evalDpsTracked({ player: evalPlayer, loadout: fixedLoadout, target }).dps;
    }
    let best = 0;
    for (const { weapon, shield } of quickWeapons) {
      const loadout = buildBestLoadout(slotItems!, weapon, shield, lockedSlots);
      const spellConfig = getOptimalSpellConfig(weapon, player.spellElement);
      const evalPlayer = spellConfig
        ? { ...p, spellMaxHit: spellConfig.spellMaxHit, spellElement: spellConfig.spellElement }
        : p;
      const dps = evalDpsTracked({ player: evalPlayer, loadout, target }).dps;
      if (dps > best) best = dps;
    }
    return best;
  }

  // --- Beam search ---------------------------------------------------------
  // Pre-build adjacency index and style-relevant node set for fast frontier computation.
  // Instead of iterating all 132 nodes per beam entry, we compute the "frontier" — only
  // unselected nodes adjacent to the current selection. Typically 10-20 nodes vs 132.
  const nodeIndex = new Map(allNodes.map(n => [n.id, n]));
  const relevantNodes = new Set(allNodes.filter(n => isNodeRelevantForStyle(n, style)).map(n => n.id));

  /** Get the frontier: unselected, style-relevant nodes adjacent to selected. */
  function getFrontier(selected: Set<string>): string[] {
    const frontier: string[] = [];
    const seen = new Set<string>();
    for (const id of selected) {
      const node = nodeIndex.get(id);
      if (!node) continue;
      for (const neighbor of node.linkedNodes) {
        if (selected.has(neighbor) || seen.has(neighbor)) continue;
        seen.add(neighbor);
        if (relevantNodes.has(neighbor)) frontier.push(neighbor);
      }
    }
    return frontier;
  }

  interface BeamEntry { selected: Set<string>; dps: number }
  let beam: BeamEntry[] = [{ selected: new Set([ROOT]), dps: evalDps([ROOT]) }];

  for (let step = 1; step < PACT_POINT_LIMIT; step++) {
    const next = new Map<string, BeamEntry>();

    for (const entry of beam) {
      const frontier = getFrontier(entry.selected);

      for (const nodeId of frontier) {
        const sel = new Set(entry.selected);
        sel.add(nodeId);

        const pacts = [...sel].sort();
        const dps = evalDps(pacts);
        const key = pacts.join(",");

        const prev = next.get(key);
        if (!prev || dps > prev.dps) {
          next.set(key, { selected: sel, dps });
        }
      }
    }

    if (next.size === 0) break;

    const sorted = [...next.values()].sort((a, b) => b.dps - a.dps);
    beam = sorted.slice(0, BEAM_WIDTH);
  }

  // --- Capstone injection: try paths to unreached capstone nodes ----------
  // The greedy beam misses capstones behind low-value gateway nodes (e.g. node155
  // for halberds requires traversing node88 which has minimal DPS value on its own).
  // Only enabled for final per-build refinement (Phase 5) to avoid N^2 blowup.
  if (!enableCapstoneInjection) {
    beam.sort((a, b) => b.dps - a.dps);
    return beam.slice(0, NUM_RESULTS).map(e => [...e.selected]);
  }
  const capstones = allNodes.filter(n => n.size === "node_capstone" && isNodeRelevantForStyle(n, style));

  const best = beam[0]; // only refine the top candidate
  if (best && best.selected.size >= PACT_POINT_LIMIT) {
    // Pre-compute marginal DPS for all removable nodes (once, reused across capstones)
    const basePacts = [...best.selected];
    const removable: { id: string; marginalDps: number }[] = [];
    for (const id of best.selected) {
      if (id === ROOT) continue;
      if (!canDeselectNode(id, best.selected)) continue;
      const marginal = best.dps - evalDps(basePacts.filter(p => p !== id));
      removable.push({ id, marginalDps: marginal });
    }
    removable.sort((a, b) => a.marginalDps - b.marginalDps);

    // Try all capstones and pick the one with the biggest DPS improvement
    let bestCapResult: { selected: Set<string>; dps: number } | null = null;
    for (const cap of capstones) {
      if (best.selected.has(cap.id)) continue;

      const path = bfsPathToSelected(cap.id, best.selected, nodeIndex);
      if (!path || path.length === 0) continue;
      const toAdd = path.filter(id => !best.selected.has(id));
      if (toAdd.length === 0) continue;

      // Sequentially remove least-valuable nodes, verifying connectivity after each
      const available = removable.filter(r => !toAdd.includes(r.id));
      const newSelected = new Set(best.selected);
      let removed = 0;
      for (const r of available) {
        if (removed >= toAdd.length) break;
        if (!newSelected.has(r.id)) continue;
        newSelected.delete(r.id);
        if (!isConnectedFromRoot(ROOT, newSelected, nodeIndex)) {
          newSelected.add(r.id); continue;
        }
        removed++;
      }
      if (removed < toAdd.length) continue;

      for (const id of toAdd) newSelected.add(id);
      if (!isConnectedFromRoot(ROOT, newSelected, nodeIndex)) continue;
      if (newSelected.size !== PACT_POINT_LIMIT) continue;

      const newDps = evalDps([...newSelected]);
      if (newDps > best.dps && (!bestCapResult || newDps > bestCapResult.dps)) {
        bestCapResult = { selected: newSelected, dps: newDps };
      }
    }
    if (bestCapResult) {
      best.selected = bestCapResult.selected;
      best.dps = bestCapResult.dps;
    }
  }

  beam.sort((a, b) => b.dps - a.dps);
  return beam.slice(0, NUM_RESULTS).map(e => [...e.selected]);
}

/** BFS from target node backward through tree to find shortest path to any node in `selected` */
function bfsPathToSelected(targetId: string, selected: Set<string>, nodeIndex: Map<string, PactNode>): string[] | null {
  const visited = new Set<string>();
  const parent = new Map<string, string>();
  const queue = [targetId];
  visited.add(targetId);

  while (queue.length > 0) {
    const current = queue.shift()!;
    const node = nodeIndex.get(current);
    if (!node) continue;

    for (const neighbor of node.linkedNodes) {
      if (visited.has(neighbor)) continue;
      visited.add(neighbor);
      parent.set(neighbor, current);

      if (selected.has(neighbor)) {
        // Reconstruct path from target to this selected node (excluding the anchor)
        const path: string[] = [];
        let cur = current;
        while (cur !== targetId) {
          path.push(cur);
          cur = parent.get(cur)!;
        }
        path.push(targetId);
        return path;
      }
      queue.push(neighbor);
    }
  }
  return null;
}

/** BFS from root to verify all nodes in `selected` are reachable through selected neighbors */
function isConnectedFromRoot(root: string, selected: Set<string>, nodeIndex: Map<string, PactNode>): boolean {
  if (!selected.has(root)) return false;
  const visited = new Set<string>();
  const queue = [root];
  visited.add(root);
  while (queue.length > 0) {
    const cur = queue.shift()!;
    const node = nodeIndex.get(cur);
    if (!node) continue;
    for (const neighbor of node.linkedNodes) {
      if (!visited.has(neighbor) && selected.has(neighbor)) {
        visited.add(neighbor);
        queue.push(neighbor);
      }
    }
  }
  return visited.size === selected.size;
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
  pactFlags: PactAwareness = NO_PACT_FLAGS,
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
    // (or defensive value when thorns scaling is active)
    if (isUsefulForStyle(item, style, pactFlags)) {
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

function isUsefulForStyle(
  item: Item, style: CombatStyle,
  pactFlags: PactAwareness = NO_PACT_FLAGS,
): boolean {
  const b = item.bonuses;

  // When thorns + defence_recoil_scaling pacts are active, high-defence items
  // contribute to DPS through thorns damage. Include items with meaningful total def.
  if (pactFlags.hasThornsScaling) {
    const totalDef = b.dstab + b.dslash + b.dcrush + b.dranged + b.dmagic;
    if (totalDef >= 100) return true; // +1 thorns damage threshold
  }

  // When prayer bonus → DPS pacts are active, prayer items become relevant
  if (b.prayer > 0) {
    if (pactFlags.hasAirPrayerScaling && style === "magic") return true;
    if (pactFlags.hasMeleePrayerScaling && style === "melee") return true;
  }

  // When thrown melee str scale pact is active, melee str items are relevant for ranged
  if (pactFlags.hasThrownMeleeScaling && style === "ranged" && b.mstr > 0) {
    return true;
  }

  // Standard offensive check
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

/**
 * Score-based threshold pruning: keep items scoring ≥ threshold% of the best
 * item in the group, up to a hard cap. Passives always survive since they
 * interact with pact effects in non-obvious ways.
 *
 * Unlike hard top-K, this adapts to each slot's item distribution:
 * - Black d'hide (score 30) survives vs Masori (47) at 40% threshold
 * - Green d'hide (score 15) gets pruned — it's <40% of best
 * - Items with no str bonus (pure accuracy armour) get pruned since
 *   the melee scoring weights str 5x (matching actual DPS impact)
 *
 * When hasThornsScaling is true, defence bonuses also contribute to score
 * (thorns + defence_recoil_scaling pact makes total def → DPS).
 */
function pruneByThreshold(
  items: Item[],
  style: CombatStyle,
  threshold: number,
  hardCap: number,
  pactFlags: PactAwareness = NO_PACT_FLAGS,
): Item[] {
  if (items.length <= 1) return items;

  const withPassive = items.filter(i => i.passive);
  const withoutPassive = items.filter(i => !i.passive);

  if (withoutPassive.length === 0) return withPassive;

  // Score each item — includes pact-based cross-stat contributions
  const scored = withoutPassive.map(i => ({ item: i, score: pruningScore(i, style, pactFlags) }));
  const bestScore = Math.max(...scored.map(s => s.score));
  if (bestScore <= 0) return withPassive;

  const minScore = bestScore * threshold;

  // Filter by threshold, sort by score descending, apply hard cap
  const surviving = scored
    .filter(s => s.score >= minScore)
    .sort((a, b) => b.score - a.score)
    .slice(0, hardCap)
    .map(s => s.item);

  // Merge passive items back (dedup by id)
  const ids = new Set(surviving.map(i => i.id));
  for (const item of withPassive) {
    if (!ids.has(item.id)) {
      surviving.push(item);
      ids.add(item.id);
    }
  }

  return surviving;
}

/** Scoring function for pruning decisions. Includes pact-based value when relevant. */
function pruningScore(item: Item, style: CombatStyle, pactFlags: PactAwareness = NO_PACT_FLAGS): number {
  let score = offensiveScore(item, style, pactFlags);
  if (pactFlags.hasThornsScaling) {
    const b = item.bonuses;
    const totalDef = b.dstab + b.dslash + b.dcrush + b.dranged + b.dmagic;
    if (totalDef > 0) score += totalDef * 0.05;
  }
  return score;
}

function pruneDominated(items: Item[], style: CombatStyle, pactFlags: PactAwareness = NO_PACT_FLAGS): Item[] {
  if (items.length <= 1) return items;

  return items.filter((item, i) => {
    // Keep items with passives — they can't be easily dominated
    if (item.passive) return true;

    for (let j = 0; j < items.length; j++) {
      if (i === j) continue;
      if (dominates(items[j], item, style, pactFlags)) return false;
    }
    return true;
  });
}

function dominates(a: Item, b: Item, style: CombatStyle, pactFlags: PactAwareness = NO_PACT_FLAGS): boolean {
  // a dominates b if a is >= b in all DPS-relevant stats and > in at least one
  const ab = a.bonuses;
  const bb = b.bonuses;

  let strictlyBetter = false;

  // Prayer bonus is NOT included in domination checks even when pacts make it DPS-relevant.
  // Reason: prayer contributes at most +50% as mstr (e.g. prayer=5 → +2.5 mstr equivalent),
  // which is small vs BIS mstr=14. Including it prevents natural pruning of 100+ prayer-only
  // items, causing combinatorial explosion. Prayer is still included in scoring thresholds.

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
      // When thrown melee scaling is active, melee str contributes to ranged DPS
      if (pactFlags.hasThrownMeleeScaling) {
        if (ab.mstr < bb.mstr) return false;
        if (ab.mstr > bb.mstr) strictlyBetter = true;
      }
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

function offensiveScore(item: Item, style: string, pactFlags: PactAwareness = NO_PACT_FLAGS): number {
  const b = item.bonuses;
  switch (style) {
    case "melee": {
      // Weight mstr 5x: +1 mstr ≈ +0.1 DPS while +1 attack ≈ +0.0005 DPS for armour.
      // For weapons both stats are large so relative ranking is preserved.
      let score = b.mstr * 5 + Math.max(b.astab, b.aslash, b.acrush);
      // meleePrayerStrBonus: +50% of prayer bonus as melee str
      // +1 prayer = +0.5 mstr ≈ weight 1.0 (conservative to avoid combinatorial explosion
      // from 100+ prayer-only items; items need real offensive stats to survive pruning)
      if (pactFlags.hasMeleePrayerScaling && b.prayer > 0) {
        score += b.prayer * 1.0;
      }
      return score;
    }
    case "ranged": {
      // Weight rstr 5x to match melee — ranged str is equally impactful for DPS
      let score = b.rstr * 5 + b.aranged;
      // thrownMeleeStrScale: +80% of mstr as ranged str for thrown
      // +1 mstr = +0.8 rstr ≈ weight 4 (0.8 * 5)
      if (pactFlags.hasThrownMeleeScaling && b.mstr > 0) {
        score += b.mstr * 4;
      }
      return score;
    }
    case "magic": {
      let score = b.mdmg * 3 + b.amagic;
      // Powered staves have mdmg=0 but high base damage from magic level.
      // Add a DPS-equivalent bonus so they rank alongside regular staves.
      if (item.weaponCategory === "powered-staff") {
        score += 60;
      }
      // Air pact prayer scaling: prayer bonus → max hit chance
      // +1 prayer bonus ≈ +1% max hit chance ≈ +0.5% DPS
      if (pactFlags.hasAirPrayerScaling && b.prayer > 0) {
        score += b.prayer * 2;
      }
      return score;
    }
    default:
      return 0;
  }
}

// ═══════════════════════════════════════════════════════════════════════
// SPELL CONFIGURATION
// Each ancient/standard spell has a base max hit and element.
// The optimizer tries each viable spell to find the best element+pact combo.
// ═══════════════════════════════════════════════════════════════════════

interface SpellConfig {
  spellMaxHit: number;
  spellElement: SpellElement;
}

// Use shared spell data from src/data/spells.ts (weirdgloop spells.json)
const ANCIENT_SPELLS: SpellConfig[] = ANCIENT_SPELL_DATA;
const STANDARD_SPELLS: SpellConfig[] = STANDARD_SPELL_DATA;

/** Returns all viable spell configs for a staff weapon. Empty for non-staves. */
function getViableSpells(weapon: Item | null): SpellConfig[] {
  if (!weapon) return [];
  if (weapon.weaponCategory !== "staff") return [];
  // Harm staff can autocast BOTH standard (at 4t) and ancient (at 5t) spells
  if (weapon.id === "harm-staff") return [...STANDARD_SPELLS, ...ANCIENT_SPELLS];
  return ANCIENT_AUTOCAST_STAVES.has(weapon.id) ? ANCIENT_SPELLS : STANDARD_SPELLS;
}

/**
 * Returns the best spell config for a staff weapon.
 * If spellElement is provided and valid for this weapon, uses that element.
 * Otherwise defaults to highest-base-damage spell.
 * Returns undefined for non-staff weapons.
 */
function getOptimalSpellConfig(weapon: Item | null, spellElement?: SpellElement): SpellConfig | undefined {
  if (!weapon) return undefined;
  if (weapon.weaponCategory !== "staff") return undefined;

  // Harm staff can autocast both standard and ancient spells
  const spells = weapon.id === "harm-staff"
    ? [...STANDARD_SPELLS, ...ANCIENT_SPELLS]
    : ANCIENT_AUTOCAST_STAVES.has(weapon.id) ? ANCIENT_SPELLS : STANDARD_SPELLS;

  // If a specific element is requested and matches this weapon type, use it
  if (spellElement && spellElement !== "none") {
    const match = spells.find(s => s.spellElement === spellElement);
    if (match) return match;
    // Explicit element set but doesn't match this weapon's spellbook (e.g. "air" on ancient staff
    // for smoke→air builds). Don't override — let the player config's spellMaxHit/element stand.
    return undefined;
  }

  // Default: highest base damage (first in array)
  return spells[0];
}
