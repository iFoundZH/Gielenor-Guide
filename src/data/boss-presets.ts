import type { BossPreset } from "@/types/dps";

export const BOSS_PRESETS: BossPreset[] = [
  // ══════════════════════════════════════════════════════════════════════
  // GOD WARS DUNGEON (Asgarnia) — wiki-verified 2026-04-11
  // ══════════════════════════════════════════════════════════════════════

  { id: "graardor", name: "General Graardor", defenceLevel: 250, magicLevel: 80,
    dstab: 90, dslash: 90, dcrush: 90, dranged: 90, dmagic: 298,
    hp: 255, region: "asgarnia" },

  { id: "zilyana", name: "Commander Zilyana", defenceLevel: 300, magicLevel: 300,
    dstab: 100, dslash: 100, dcrush: 100, dranged: 100, dmagic: 100,
    hp: 255, region: "asgarnia" },

  { id: "kreearra", name: "Kree'arra", defenceLevel: 260, magicLevel: 200,
    dstab: 180, dslash: 180, dcrush: 180, dranged: 200, dmagic: 200,
    hp: 255, region: "asgarnia" },

  { id: "kril", name: "K'ril Tsutsaroth", defenceLevel: 270, magicLevel: 200,
    dstab: 70, dslash: 80, dcrush: 80, dranged: 80, dmagic: 80,
    hp: 255, region: "asgarnia" },

  { id: "nex", name: "Nex", defenceLevel: 260, magicLevel: 230,
    dstab: 40, dslash: 140, dcrush: 60, dranged: 190, dmagic: 300,
    hp: 3400, region: "asgarnia" },

  // ══════════════════════════════════════════════════════════════════════
  // DESERT TREASURE II BOSSES — wiki-verified
  // ══════════════════════════════════════════════════════════════════════

  { id: "duke", name: "Duke Sucellus", defenceLevel: 215, magicLevel: 230,
    dstab: 210, dslash: 30, dcrush: 160, dranged: 300, dmagic: 400,
    hp: 330, region: "fremennik" },

  { id: "leviathan", name: "The Leviathan", defenceLevel: 250, magicLevel: 160,
    dstab: 260, dslash: 190, dcrush: 230, dranged: 50, dmagic: 280,
    hp: 900, region: "desert" },

  { id: "whisperer", name: "The Whisperer", defenceLevel: 250, magicLevel: 180,
    dstab: 180, dslash: 300, dcrush: 220, dranged: 300, dmagic: 10,
    hp: 900, region: "asgarnia" },

  { id: "vardorvis", name: "Vardorvis", defenceLevel: 215, magicLevel: 215,
    dstab: 215, dslash: 65, dcrush: 85, dranged: 580, dmagic: 580,
    hp: 700, region: "varlamore" },

  // ══════════════════════════════════════════════════════════════════════
  // RAIDS
  // ══════════════════════════════════════════════════════════════════════

  { id: "olm-melee", name: "Great Olm (Melee Hand)", defenceLevel: 175, magicLevel: 150,
    dstab: 50, dslash: 50, dcrush: 50, dranged: 50, dmagic: 50,
    hp: 800, region: "kourend" },

  { id: "olm-head", name: "Great Olm (Head)", defenceLevel: 175, magicLevel: 250,
    dstab: 0, dslash: 0, dcrush: 0, dranged: 0, dmagic: 50,
    hp: 800, region: "kourend" },

  { id: "verzik-p3", name: "Verzik Vitur (P3)", defenceLevel: 150, magicLevel: 100,
    dstab: 20, dslash: 20, dcrush: 20, dranged: 60, dmagic: 60,
    hp: 1500, region: "morytania" },

  { id: "wardens-p3", name: "Wardens (P3 Tumeken)", defenceLevel: 200, magicLevel: 200,
    dstab: 80, dslash: 80, dcrush: 80, dranged: 80, dmagic: -60,
    hp: 880, region: "desert" },

  // ══════════════════════════════════════════════════════════════════════
  // SLAYER BOSSES — wiki-verified
  // ══════════════════════════════════════════════════════════════════════

  { id: "cerberus", name: "Cerberus", defenceLevel: 100, magicLevel: 220,
    dstab: 50, dslash: 100, dcrush: 25, dranged: 100, dmagic: 65,
    hp: 600, region: "asgarnia" },

  { id: "hydra", name: "Alchemical Hydra", defenceLevel: 100, magicLevel: 260,
    dstab: 75, dslash: 150, dcrush: 150, dranged: 45, dmagic: 150,
    hp: 1100, region: "kourend" },

  { id: "thermy", name: "Thermonuclear Smoke Devil", defenceLevel: 190, magicLevel: 1,
    dstab: 0, dslash: 0, dcrush: 0, dranged: 10, dmagic: 0,
    hp: 240 },

  { id: "kraken", name: "Kraken", defenceLevel: 1, magicLevel: 1,
    dstab: 0, dslash: 0, dcrush: 0, dranged: 300, dmagic: 130,
    hp: 255 },

  { id: "abyssal-sire", name: "Abyssal Sire", defenceLevel: 250, magicLevel: 200,
    dstab: 20, dslash: 20, dcrush: 20, dranged: 40, dmagic: 40,
    hp: 400 },

  // ══════════════════════════════════════════════════════════════════════
  // OTHER NOTABLE BOSSES — wiki-verified
  // ══════════════════════════════════════════════════════════════════════

  { id: "vorkath", name: "Vorkath", defenceLevel: 214, magicLevel: 150,
    dstab: 26, dslash: 108, dcrush: 108, dranged: 26, dmagic: 240,
    hp: 750, region: "fremennik" },

  { id: "zulrah", name: "Zulrah", defenceLevel: 300, magicLevel: 300,
    dstab: 0, dslash: 0, dcrush: 0, dranged: 50, dmagic: -45,
    hp: 500, region: "kandarin" },

  { id: "corp", name: "Corporeal Beast", defenceLevel: 310, magicLevel: 350,
    dstab: 25, dslash: 200, dcrush: 100, dranged: 230, dmagic: 150,
    hp: 2000, region: "asgarnia" },

  { id: "hunllef", name: "Corrupted Hunllef", defenceLevel: 240, magicLevel: 240,
    dstab: 20, dslash: 20, dcrush: 20, dranged: 20, dmagic: 20,
    hp: 1000, region: "tirannwn" },

  { id: "kbd", name: "King Black Dragon", defenceLevel: 240, magicLevel: 240,
    dstab: 70, dslash: 70, dcrush: 70, dranged: 20, dmagic: 20,
    hp: 240 },

  { id: "kq", name: "Kalphite Queen (P2)", defenceLevel: 300, magicLevel: 300,
    dstab: 10, dslash: 10, dcrush: 10, dranged: 10, dmagic: 10,
    hp: 255, region: "desert" },

  { id: "nightmare", name: "The Nightmare", defenceLevel: 150, magicLevel: 150,
    dstab: 120, dslash: 180, dcrush: 40, dranged: 600, dmagic: 600,
    hp: 2400, region: "morytania" },

  { id: "jad", name: "TzTok-Jad", defenceLevel: 480, magicLevel: 480,
    dstab: 0, dslash: 0, dcrush: 0, dranged: 0, dmagic: 0,
    hp: 250 },

  { id: "zuk", name: "TzKal-Zuk", defenceLevel: 260, magicLevel: 600,
    dstab: 0, dslash: 0, dcrush: 0, dranged: 0, dmagic: 0,
    hp: 1400 },

  { id: "sol-heredit", name: "Sol Heredit", defenceLevel: 300, magicLevel: 300,
    dstab: 80, dslash: 80, dcrush: 80, dranged: 80, dmagic: 80,
    hp: 2000, region: "varlamore" },

  // ══════════════════════════════════════════════════════════════════════
  // VARLAMORE BOSSES
  // ══════════════════════════════════════════════════════════════════════

  { id: "amoxliatl", name: "Amoxliatl", defenceLevel: 180, magicLevel: 100,
    dstab: 40, dslash: 40, dcrush: 40, dranged: 40, dmagic: 40,
    hp: 500, region: "varlamore" },

  { id: "echo-amoxliatl", name: "Echo Amoxliatl", defenceLevel: 220, magicLevel: 130,
    dstab: 60, dslash: 60, dcrush: 60, dranged: 60, dmagic: 60,
    hp: 750, region: "varlamore" },

  // ══════════════════════════════════════════════════════════════════════
  // CUSTOM TARGET
  // ══════════════════════════════════════════════════════════════════════

  { id: "custom", name: "Custom Target", defenceLevel: 1, magicLevel: 1,
    dstab: 0, dslash: 0, dcrush: 0, dranged: 0, dmagic: 0,
    hp: 100 },
];

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
