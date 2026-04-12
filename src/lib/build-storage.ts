import type { SavedBuild, PlayerConfig, EquipmentSlot } from "@/types/dps";

const STORAGE_KEY = "gielinor-dps-builds";

// ═══════════════════════════════════════════════════════════════════════
// CRUD
// ═══════════════════════════════════════════════════════════════════════

export function getBuilds(): SavedBuild[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveBuild(build: SavedBuild): void {
  const builds = getBuilds();
  const idx = builds.findIndex(b => b.id === build.id);
  if (idx >= 0) {
    builds[idx] = build;
  } else {
    builds.push(build);
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(builds));
}

export function deleteBuild(id: string): void {
  const builds = getBuilds().filter(b => b.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(builds));
}

// ═══════════════════════════════════════════════════════════════════════
// URL SHARING
// ═══════════════════════════════════════════════════════════════════════

interface CompactBuild {
  p: {
    a: number; s: number; d: number; r: number; m: number; pr: number;
    pot: string; pry: string; sty: string; cs: string;
    reg: string[]; pacts: string[];
    void: string; slay: boolean | "auto";
    dist?: number; spell?: number;
  };
  gear: { [slot: string]: string | null };
  target?: string;
}

export function encodeBuild(
  player: PlayerConfig,
  loadout: { [slot in EquipmentSlot]: string | null },
  targetId?: string,
): string {
  const compact: CompactBuild = {
    p: {
      a: player.attack, s: player.strength, d: player.defence,
      r: player.ranged, m: player.magic, pr: player.prayer,
      pot: player.potion, pry: player.prayerType,
      sty: player.attackStyle, cs: player.combatStyle,
      reg: player.regions, pacts: player.activePacts,
      void: player.voidSet, slay: player.onSlayerTask,
      dist: player.targetDistance, spell: player.spellMaxHit,
    },
    gear: loadout,
    target: targetId,
  };

  return btoa(JSON.stringify(compact));
}

export function decodeBuild(encoded: string): {
  player: PlayerConfig;
  loadout: { [slot in EquipmentSlot]: string | null };
  targetId?: string;
} | null {
  try {
    const compact: CompactBuild = JSON.parse(atob(encoded));
    const player: PlayerConfig = {
      attack: compact.p.a,
      strength: compact.p.s,
      defence: compact.p.d,
      ranged: compact.p.r,
      magic: compact.p.m,
      prayer: compact.p.pr,
      hitpoints: 99,
      potion: compact.p.pot as PlayerConfig["potion"],
      prayerType: compact.p.pry as PlayerConfig["prayerType"],
      attackStyle: compact.p.sty as PlayerConfig["attackStyle"],
      combatStyle: compact.p.cs as PlayerConfig["combatStyle"],
      regions: compact.p.reg,
      activePacts: compact.p.pacts,
      voidSet: compact.p.void as PlayerConfig["voidSet"],
      onSlayerTask: compact.p.slay,
      targetDistance: compact.p.dist,
      spellMaxHit: compact.p.spell,
    };

    const loadout = compact.gear as { [slot in EquipmentSlot]: string | null };
    return { player, loadout, targetId: compact.target };
  } catch {
    return null;
  }
}

export function generateBuildId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}
