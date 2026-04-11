import type { BossPreset } from "@/types/dps";

export const BOSS_PRESETS: BossPreset[] = [
  // ══════════════════════════════════════════════════════════════════════
  // GOD WARS DUNGEON (Asgarnia) — wiki-verified 2026-04-11
  // ══════════════════════════════════════════════════════════════════════

  { id: "graardor", name: "General Graardor", defenceLevel: 250, magicLevel: 80,
    dstab: 90, dslash: 90, dcrush: 90, dranged: 90, dmagic: 298,
    hp: 255, size: 4, region: "asgarnia" },

  { id: "zilyana", name: "Commander Zilyana", defenceLevel: 300, magicLevel: 300,
    dstab: 100, dslash: 100, dcrush: 100, dranged: 100, dmagic: 100,
    hp: 255, size: 2, region: "asgarnia" },

  { id: "kreearra", name: "Kree'arra", defenceLevel: 260, magicLevel: 200,
    dstab: 180, dslash: 180, dcrush: 180, dranged: 200, dmagic: 200,
    hp: 255, size: 5, region: "asgarnia" },

  { id: "kril", name: "K'ril Tsutsaroth", defenceLevel: 270, magicLevel: 200,
    dstab: 70, dslash: 80, dcrush: 80, dranged: 80, dmagic: 80,
    hp: 255, size: 5, region: "asgarnia", isDemon: true },

  { id: "nex", name: "Nex", defenceLevel: 260, magicLevel: 230,
    dstab: 40, dslash: 140, dcrush: 60, dranged: 190, dmagic: 300,
    hp: 3400, size: 3, region: "asgarnia" },

  // ══════════════════════════════════════════════════════════════════════
  // DESERT TREASURE II BOSSES — wiki-verified
  // ══════════════════════════════════════════════════════════════════════

  { id: "duke", name: "Duke Sucellus", defenceLevel: 215, magicLevel: 230,
    dstab: 210, dslash: 30, dcrush: 160, dranged: 300, dmagic: 400,
    hp: 330, size: 7, region: "fremennik" },

  { id: "leviathan", name: "The Leviathan", defenceLevel: 250, magicLevel: 160,
    dstab: 260, dslash: 190, dcrush: 230, dranged: 50, dmagic: 280,
    hp: 900, size: 3, region: "desert" },

  { id: "whisperer", name: "The Whisperer", defenceLevel: 250, magicLevel: 180,
    dstab: 180, dslash: 300, dcrush: 220, dranged: 300, dmagic: 10,
    hp: 900, size: 1, region: "asgarnia" },

  { id: "vardorvis", name: "Vardorvis", defenceLevel: 215, magicLevel: 215,
    dstab: 215, dslash: 65, dcrush: 85, dranged: 580, dmagic: 580,
    hp: 700, size: 2, region: "varlamore" },

  // ══════════════════════════════════════════════════════════════════════
  // RAIDS
  // ══════════════════════════════════════════════════════════════════════

  { id: "olm-melee", name: "Great Olm (Melee Hand)", defenceLevel: 175, magicLevel: 150,
    dstab: 50, dslash: 50, dcrush: 50, dranged: 50, dmagic: 50,
    hp: 800, size: 5, region: "kourend", isDragon: true },

  { id: "olm-head", name: "Great Olm (Head)", defenceLevel: 175, magicLevel: 250,
    dstab: 0, dslash: 0, dcrush: 0, dranged: 0, dmagic: 50,
    hp: 800, size: 5, region: "kourend", isDragon: true },

  { id: "verzik-p3", name: "Verzik Vitur (P3)", defenceLevel: 150, magicLevel: 100,
    dstab: 20, dslash: 20, dcrush: 20, dranged: 60, dmagic: 60,
    hp: 1500, size: 5, region: "morytania", isUndead: true },

  { id: "wardens-p3", name: "Wardens (P3 Tumeken)", defenceLevel: 200, magicLevel: 200,
    dstab: 80, dslash: 80, dcrush: 80, dranged: 80, dmagic: -60,
    hp: 880, size: 5, region: "desert" },

  // ══════════════════════════════════════════════════════════════════════
  // SLAYER BOSSES — wiki-verified
  // ══════════════════════════════════════════════════════════════════════

  { id: "cerberus", name: "Cerberus", defenceLevel: 100, magicLevel: 220,
    dstab: 50, dslash: 100, dcrush: 25, dranged: 100, dmagic: 65,
    hp: 600, size: 3, region: "asgarnia", isDemon: true },

  { id: "hydra", name: "Alchemical Hydra", defenceLevel: 100, magicLevel: 260,
    dstab: 75, dslash: 150, dcrush: 150, dranged: 45, dmagic: 150,
    hp: 1100, size: 4, region: "kourend", isDragon: true },

  { id: "thermy", name: "Thermonuclear Smoke Devil", defenceLevel: 190, magicLevel: 1,
    dstab: 0, dslash: 0, dcrush: 0, dranged: 10, dmagic: 0,
    hp: 240, size: 2, region: "desert" },

  { id: "kraken", name: "Kraken", defenceLevel: 1, magicLevel: 1,
    dstab: 0, dslash: 0, dcrush: 0, dranged: 300, dmagic: 130,
    hp: 255, size: 3, region: "kandarin" },

  { id: "abyssal-sire", name: "Abyssal Sire", defenceLevel: 250, magicLevel: 200,
    dstab: 20, dslash: 20, dcrush: 20, dranged: 40, dmagic: 40,
    hp: 400, size: 5, region: "morytania", isDemon: true },

  { id: "grotesque-guardians", name: "Grotesque Guardians", defenceLevel: 100, magicLevel: 140,
    dstab: 0, dslash: 0, dcrush: 0, dranged: 0, dmagic: 0,
    hp: 450, size: 4, region: "morytania" },

  // ══════════════════════════════════════════════════════════════════════
  // OTHER NOTABLE BOSSES — wiki-verified
  // ══════════════════════════════════════════════════════════════════════

  { id: "vorkath", name: "Vorkath", defenceLevel: 214, magicLevel: 150,
    dstab: 26, dslash: 108, dcrush: 108, dranged: 26, dmagic: 240,
    hp: 750, size: 7, region: "fremennik", isDragon: true, isUndead: true },

  { id: "zulrah", name: "Zulrah", defenceLevel: 300, magicLevel: 300,
    dstab: 0, dslash: 0, dcrush: 0, dranged: 50, dmagic: -45,
    hp: 500, size: 3, region: "kandarin" },

  { id: "corp", name: "Corporeal Beast", defenceLevel: 310, magicLevel: 350,
    dstab: 25, dslash: 200, dcrush: 100, dranged: 230, dmagic: 150,
    hp: 2000, size: 5, region: "asgarnia" },

  { id: "hunllef", name: "Corrupted Hunllef", defenceLevel: 240, magicLevel: 240,
    dstab: 20, dslash: 20, dcrush: 20, dranged: 20, dmagic: 20,
    hp: 1000, size: 3, region: "tirannwn" },

  { id: "kbd", name: "King Black Dragon", defenceLevel: 240, magicLevel: 240,
    dstab: 70, dslash: 70, dcrush: 70, dranged: 20, dmagic: 20,
    hp: 240, size: 3, region: "wilderness", isDragon: true },

  { id: "kq", name: "Kalphite Queen (P2)", defenceLevel: 300, magicLevel: 300,
    dstab: 10, dslash: 10, dcrush: 10, dranged: 10, dmagic: 10,
    hp: 255, size: 3, region: "desert", isKalphite: true },

  { id: "nightmare", name: "The Nightmare", defenceLevel: 150, magicLevel: 150,
    dstab: 120, dslash: 180, dcrush: 40, dranged: 600, dmagic: 600,
    hp: 2400, size: 5, region: "morytania" },

  { id: "jad", name: "TzTok-Jad", defenceLevel: 480, magicLevel: 480,
    dstab: 0, dslash: 0, dcrush: 0, dranged: 0, dmagic: 0,
    hp: 250, size: 3, region: "karamja" },

  { id: "zuk", name: "TzKal-Zuk", defenceLevel: 260, magicLevel: 600,
    dstab: 0, dslash: 0, dcrush: 0, dranged: 0, dmagic: 0,
    hp: 1400, size: 7, region: "karamja" },

  { id: "sol-heredit", name: "Sol Heredit", defenceLevel: 300, magicLevel: 300,
    dstab: 80, dslash: 80, dcrush: 80, dranged: 80, dmagic: 80,
    hp: 2000, size: 5, region: "varlamore" },

  { id: "giant-mole", name: "Giant Mole", defenceLevel: 50, magicLevel: 1,
    dstab: 0, dslash: 0, dcrush: 0, dranged: 0, dmagic: 0,
    hp: 200, size: 3, region: "asgarnia" },

  // ══════════════════════════════════════════════════════════════════════
  // FREMENNIK BOSSES — wiki-verified
  // ══════════════════════════════════════════════════════════════════════

  { id: "dag-rex", name: "Dagannoth Rex", defenceLevel: 255, magicLevel: 0,
    dstab: 255, dslash: 255, dcrush: 255, dranged: 255, dmagic: 10,
    hp: 255, size: 3, region: "fremennik" },

  { id: "dag-prime", name: "Dagannoth Prime", defenceLevel: 255, magicLevel: 255,
    dstab: 255, dslash: 255, dcrush: 255, dranged: 10, dmagic: 255,
    hp: 255, size: 3, region: "fremennik" },

  { id: "dag-supreme", name: "Dagannoth Supreme", defenceLevel: 128, magicLevel: 255,
    dstab: 10, dslash: 10, dcrush: 10, dranged: 550, dmagic: 255,
    hp: 255, size: 3, region: "fremennik" },

  { id: "phantom-muspah", name: "Phantom Muspah", defenceLevel: 200, magicLevel: 150,
    dstab: 185, dslash: 134, dcrush: 120, dranged: 56, dmagic: 437,
    hp: 850, size: 3, region: "fremennik" },

  // ══════════════════════════════════════════════════════════════════════
  // KOUREND BOSSES — wiki-verified
  // ══════════════════════════════════════════════════════════════════════

  { id: "araxxor", name: "Araxxor", defenceLevel: 135, magicLevel: 190,
    dstab: 160, dslash: 75, dcrush: 15, dranged: 218, dmagic: 237,
    hp: 1020, size: 4, region: "kourend" },

  { id: "demonic-gorillas", name: "Demonic Gorillas", defenceLevel: 200, magicLevel: 195,
    dstab: 0, dslash: 0, dcrush: 0, dranged: 0, dmagic: 20,
    hp: 380, size: 2, region: "kandarin", isDemon: true },

  { id: "sarachnis", name: "Sarachnis", defenceLevel: 150, magicLevel: 150,
    dstab: 60, dslash: 40, dcrush: 10, dranged: 300, dmagic: 150,
    hp: 400, size: 4, region: "kourend" },

  { id: "skotizo", name: "Skotizo", defenceLevel: 200, magicLevel: 280,
    dstab: 80, dslash: 80, dcrush: 80, dranged: 130, dmagic: 80,
    hp: 450, size: 3, region: "kourend", isDemon: true },

  // ══════════════════════════════════════════════════════════════════════
  // VARLAMORE BOSSES
  // ══════════════════════════════════════════════════════════════════════

  { id: "amoxliatl", name: "Amoxliatl", defenceLevel: 180, magicLevel: 100,
    dstab: 40, dslash: 40, dcrush: 40, dranged: 40, dmagic: 40,
    hp: 500, size: 3, region: "varlamore" },

  { id: "echo-amoxliatl", name: "Echo Amoxliatl", defenceLevel: 220, magicLevel: 130,
    dstab: 60, dslash: 60, dcrush: 60, dranged: 60, dmagic: 60,
    hp: 750, size: 3, region: "varlamore" },

  // ══════════════════════════════════════════════════════════════════════
  // CUSTOM TARGET
  // ══════════════════════════════════════════════════════════════════════

  { id: "custom", name: "Custom Target", defenceLevel: 1, magicLevel: 1,
    dstab: 0, dslash: 0, dcrush: 0, dranged: 0, dmagic: 0,
    hp: 100, size: 1 },
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
