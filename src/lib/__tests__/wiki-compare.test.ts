import { describe, it, expect } from "vitest";
import { buildWikiCalcUrl } from "@/lib/wiki-compare";
import type { PlayerConfig, BuildLoadout, BossPreset } from "@/types/dps";

describe("buildWikiCalcUrl", () => {
  const mockPlayer: PlayerConfig = {
    attackLevel: 99,
    strengthLevel: 99,
    defenceLevel: 99,
    rangedLevel: 99,
    magicLevel: 99,
    hitpointsLevel: 99,
    prayerLevel: 99,
    combatStyle: "melee",
    attackStyle: "accurate",
    potion: "none",
    prayer: "none",
    onTask: false,
    inWilderness: false,
    chargeSpell: false,
    selectedRegions: [],
    selectedPacts: [],
    spellMaxHit: 0,
  };

  const mockLoadout: BuildLoadout = {};

  const mockBoss: BossPreset = {
    id: "custom",
    name: "Custom",
    defenceLevel: 1,
    magicLevel: 1,
    hp: 100,
    dstab: 0,
    dslash: 0,
    dcrush: 0,
    dranged: 0,
    dmagic: 0,
    size: 1,
    region: "none",
  };

  it("returns the wiki DPS calculator URL", () => {
    const url = buildWikiCalcUrl(mockPlayer, mockLoadout, mockBoss);
    expect(url).toBe("https://tools.runescape.wiki/osrs-dps/");
  });

  it("returns the same URL regardless of inputs", () => {
    const url1 = buildWikiCalcUrl(mockPlayer, mockLoadout, mockBoss);
    const url2 = buildWikiCalcUrl(
      { ...mockPlayer, combatStyle: "ranged" },
      { weapon: { id: "tbow", name: "Twisted bow", slot: "weapon", bonuses: { astab: 0, aslash: 0, acrush: 0, aranged: 70, amagic: 0, dstab: 0, dslash: 0, dcrush: 0, dranged: 0, dmagic: 0, mstr: 0, rstr: 20, mdmg: 0, prayer: 0 }, attackSpeed: 6, combatStyle: "ranged", isTwoHanded: true } },
      { ...mockBoss, id: "zulrah", name: "Zulrah" },
    );
    expect(url1).toBe(url2);
  });
});
