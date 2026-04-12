/**
 * Boss Presets — wiki-synced via scripts/sync-bosses.py → boss-db.json
 *
 * Stats (defenceLevel, dstab, dslash, etc.) come from weirdgloop/osrs-dps-calc monsters.json.
 * Region assignments come from OSRS Wiki DP Areas page + manual overrides for league classifications.
 * Non-wiki fields (damageModifier, typicalDistance, requiresSlayerTask) are applied as manual overrides.
 *
 * To update stats: `npm run sync:bosses` then review the diff output.
 */
import type { BossPreset } from "@/types/dps";
import bossDb from "./boss-db.json";

// ═══════════════════════════════════════════════════════════════════════
// MANUAL OVERRIDES — fields not available in monsters.json
// ═══════════════════════════════════════════════════════════════════════

const DAMAGE_MODIFIERS: Record<string, BossPreset["damageModifier"]> = {
  "tekton": { type: "tekton-magic" },
  "kraken": { type: "kraken-ranged" },
  "corp": { type: "corp" },
  "zulrah": { type: "zulrah-cap" },
};

const TYPICAL_DISTANCES: Record<string, number> = {
  "kraken": 4,
  "zulrah": 3,
  "jad": 10,
  "zuk": 10,
  "dag-prime": 5,
};

const REQUIRES_SLAYER_TASK = new Set([
  "cerberus", "hydra", "thermy", "kraken", "abyssal-sire", "grotesque-guardians",
]);

// ═══════════════════════════════════════════════════════════════════════
// BUILD BOSS PRESETS FROM SYNCED DATA
// ═══════════════════════════════════════════════════════════════════════

interface BossDbEntry {
  id: string;
  name: string;
  defenceLevel: number;
  magicLevel: number;
  hp: number;
  size: number;
  attackSpeed: number;
  dstab: number;
  dslash: number;
  dcrush: number;
  dranged: number;
  dranged_light: number;
  dranged_standard: number;
  dranged_heavy: number;
  dmagic: number;
  region?: string;
  isDemon?: boolean;
  isDragon?: boolean;
  isUndead?: boolean;
  isKalphite?: boolean;
  isSlayerMonster?: boolean;
  elementalWeakness?: string;
  elementalWeaknessPercent?: number;
}

function buildBossPresets(): BossPreset[] {
  const presets: BossPreset[] = (bossDb as BossDbEntry[]).map((entry) => {
    const boss: BossPreset = {
      id: entry.id,
      name: entry.name,
      defenceLevel: entry.defenceLevel,
      magicLevel: entry.magicLevel,
      hp: entry.hp,
      size: entry.size,
      dstab: entry.dstab,
      dslash: entry.dslash,
      dcrush: entry.dcrush,
      dranged: entry.dranged,
      dranged_light: entry.dranged_light,
      dranged_standard: entry.dranged_standard,
      dranged_heavy: entry.dranged_heavy,
      dmagic: entry.dmagic,
      region: entry.region,
    };

    // Attack speed from wiki (used for thorns DPS calc)
    if (entry.attackSpeed > 0) boss.attackSpeed = entry.attackSpeed;

    // Boolean attributes from wiki
    if (entry.isDemon) boss.isDemon = true;
    if (entry.isDragon) boss.isDragon = true;
    if (entry.isUndead) boss.isUndead = true;
    if (entry.isKalphite) boss.isKalphite = true;
    if (entry.isSlayerMonster) boss.isSlayerMonster = true;

    // Elemental weakness from wiki
    if (entry.elementalWeakness) {
      boss.elementalWeakness = entry.elementalWeakness;
      boss.elementalWeaknessPercent = entry.elementalWeaknessPercent ?? 0;
    }

    // Manual overrides
    if (DAMAGE_MODIFIERS[entry.id]) {
      boss.damageModifier = DAMAGE_MODIFIERS[entry.id];
    }
    if (TYPICAL_DISTANCES[entry.id] !== undefined) {
      boss.typicalDistance = TYPICAL_DISTANCES[entry.id];
    }
    if (REQUIRES_SLAYER_TASK.has(entry.id)) {
      boss.requiresSlayerTask = true;
    }

    return boss;
  });

  // Add custom target (not from wiki)
  presets.push({
    id: "custom",
    name: "Custom Target",
    defenceLevel: 1,
    magicLevel: 1,
    dstab: 0, dslash: 0, dcrush: 0,
    dranged: 0, dranged_light: 0, dranged_standard: 0, dranged_heavy: 0,
    dmagic: 0,
    hp: 100,
    size: 1,
  });

  return presets;
}

export const BOSS_PRESETS: BossPreset[] = buildBossPresets();

// ═══════════════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════

const bossMap = new Map(BOSS_PRESETS.map(b => [b.id, b]));

export function getBoss(id: string): BossPreset | undefined {
  return bossMap.get(id);
}

export function getBossesByRegion(region: string): BossPreset[] {
  return BOSS_PRESETS.filter(b => b.region === region);
}
