/**
 * Build Storage Tests
 *
 * Tests the URL sharing encode/decode round-trip and build ID generation.
 * (localStorage CRUD is tested via E2E since it needs a browser environment)
 */
import { describe, it, expect } from "vitest";
import { encodeBuild, decodeBuild, generateBuildId } from "@/lib/build-storage";
import type { PlayerConfig, EquipmentSlot } from "@/types/dps";

// ═══════════════════════════════════════════════════════════════════════
// ENCODE / DECODE ROUND-TRIP
// ═══════════════════════════════════════════════════════════════════════

describe("encodeBuild / decodeBuild", () => {
  it("round-trips a basic melee build", () => {
    const player: PlayerConfig = {
      attack: 99, strength: 99, defence: 99, ranged: 99, magic: 99,
      prayer: 99, hitpoints: 99,
      potion: "super-combat", prayerType: "piety",
      attackStyle: "accurate", combatStyle: "melee",
      regions: ["asgarnia", "morytania"],
      activePacts: ["node1", "node7"],
      voidSet: "none", onSlayerTask: true,
    };
    const loadout: { [slot in EquipmentSlot]: string | null } = {
      head: "torva-helm", cape: "infernal-cape", neck: "torture",
      ammo: null, weapon: "whip", body: "torva-body", shield: "avernic",
      legs: "torva-legs", hands: "ferocious", feet: "primordial", ring: "ultor",
    };

    const encoded = encodeBuild(player, loadout, "graardor");
    expect(typeof encoded).toBe("string");
    expect(encoded.length).toBeGreaterThan(0);

    const decoded = decodeBuild(encoded);
    expect(decoded).not.toBeNull();
    expect(decoded!.player.attack).toBe(99);
    expect(decoded!.player.strength).toBe(99);
    expect(decoded!.player.potion).toBe("super-combat");
    expect(decoded!.player.prayerType).toBe("piety");
    expect(decoded!.player.combatStyle).toBe("melee");
    expect(decoded!.player.regions).toEqual(["asgarnia", "morytania"]);
    expect(decoded!.player.activePacts).toEqual(["node1", "node7"]);
    expect(decoded!.player.onSlayerTask).toBe(true);
    expect(decoded!.loadout.weapon).toBe("whip");
    expect(decoded!.loadout.head).toBe("torva-helm");
    expect(decoded!.loadout.shield).toBe("avernic");
    expect(decoded!.targetId).toBe("graardor");
  });

  it("round-trips a ranged build with distance and pacts", () => {
    const player: PlayerConfig = {
      attack: 75, strength: 75, defence: 75, ranged: 99, magic: 75,
      prayer: 77, hitpoints: 99,
      potion: "ranging", prayerType: "rigour",
      attackStyle: "rapid", combatStyle: "ranged",
      regions: ["kourend"], activePacts: ["node1", "node7", "node2"],
      voidSet: "elite-void", onSlayerTask: false,
      targetDistance: 10,
    };
    const loadout: { [slot in EquipmentSlot]: string | null } = {
      head: null, cape: "avas-assembler", neck: "anguish",
      ammo: "dragon-arrows", weapon: "tbow", body: null, shield: null,
      legs: null, hands: null, feet: null, ring: "venator",
    };

    const encoded = encodeBuild(player, loadout);
    const decoded = decodeBuild(encoded);
    expect(decoded).not.toBeNull();
    expect(decoded!.player.ranged).toBe(99);
    expect(decoded!.player.voidSet).toBe("elite-void");
    expect(decoded!.player.targetDistance).toBe(10);
    expect(decoded!.loadout.weapon).toBe("tbow");
    expect(decoded!.targetId).toBeUndefined();
  });

  it("round-trips a magic build with spell max hit", () => {
    const player: PlayerConfig = {
      attack: 99, strength: 99, defence: 99, ranged: 99, magic: 99,
      prayer: 99, hitpoints: 99,
      potion: "magic", prayerType: "augury",
      attackStyle: "autocast", combatStyle: "magic",
      regions: [], activePacts: [],
      voidSet: "none", onSlayerTask: false,
      spellMaxHit: 30,
    };
    const loadout: { [slot in EquipmentSlot]: string | null } = {
      head: null, cape: null, neck: null, ammo: null,
      weapon: "kodai", body: null, shield: null,
      legs: null, hands: null, feet: null, ring: null,
    };

    const encoded = encodeBuild(player, loadout);
    const decoded = decodeBuild(encoded);
    expect(decoded!.player.spellMaxHit).toBe(30);
    expect(decoded!.player.combatStyle).toBe("magic");
  });

  it("invalid base64 returns null", () => {
    expect(decodeBuild("not-valid-base64!!!")).toBeNull();
  });

  it("corrupted JSON returns null", () => {
    const encoded = btoa("{ broken json }}}");
    expect(decodeBuild(encoded)).toBeNull();
  });

  it("empty string returns null", () => {
    expect(decodeBuild("")).toBeNull();
  });
});

// ═══════════════════════════════════════════════════════════════════════
// BUILD ID GENERATION
// ═══════════════════════════════════════════════════════════════════════

describe("generateBuildId", () => {
  it("returns a non-empty string", () => {
    const id = generateBuildId();
    expect(typeof id).toBe("string");
    expect(id.length).toBeGreaterThan(0);
  });

  it("generates unique IDs", () => {
    const ids = new Set<string>();
    for (let i = 0; i < 100; i++) {
      ids.add(generateBuildId());
    }
    expect(ids.size).toBe(100);
  });
});
