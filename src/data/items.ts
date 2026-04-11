import type { Item, EquipmentSlot, CombatStyle } from "@/types/dps";

// Zero bonuses template
const Z = { astab: 0, aslash: 0, acrush: 0, aranged: 0, amagic: 0, dstab: 0, dslash: 0, dcrush: 0, dranged: 0, dmagic: 0, mstr: 0, rstr: 0, mdmg: 0, prayer: 0 };

function b(overrides: Partial<typeof Z>): typeof Z {
  return { ...Z, ...overrides };
}

export const ITEMS: Item[] = [
  // ══════════════════════════════════════════════════════════════════════
  // MELEE WEAPONS
  // ══════════════════════════════════════════════════════════════════════

  // Scythe of Vitur (wiki-verified)
  { id: "scythe", name: "Scythe of Vitur", slot: "weapon", isTwoHanded: true, weaponCategory: "scythe", attackSpeed: 5, combatStyle: "melee", attackType: "slash",
    bonuses: b({ astab: 70, aslash: 125, acrush: 30, amagic: -6, dslash: 8, dcrush: 10, mstr: 75 }),
    region: "morytania", passive: "Hits 3 targets: 100%/50%/25% max hit" },

  // Tumeken's Shadow (wiki-verified: +35 magic atk, +0% magic dmg base, shadow passive triples equip bonuses)
  { id: "shadow", name: "Tumeken's Shadow", slot: "weapon", isTwoHanded: true, weaponCategory: "powered-staff", attackSpeed: 5, combatStyle: "magic", attackType: "magic",
    bonuses: b({ amagic: 35, dmagic: 20, prayer: 1 }),
    region: "desert", passive: "Triples magic attack + magic damage % from all equipment" },

  // Twisted Bow (wiki-verified: +70 range atk, +20 range str, +4 prayer, speed 5)
  { id: "tbow", name: "Twisted Bow", slot: "weapon", isTwoHanded: true, weaponCategory: "bow", attackSpeed: 5, combatStyle: "ranged", attackType: "ranged",
    bonuses: b({ aranged: 70, rstr: 20, prayer: 4 }),
    region: "kourend", passive: "Accuracy/damage scale with target magic (cap 250)" },

  // Osmumten's Fang
  { id: "fang", name: "Osmumten's Fang", slot: "weapon", weaponCategory: "1h-heavy", attackSpeed: 5, combatStyle: "melee", attackType: "stab",
    bonuses: b({ astab: 105, aslash: 75, mstr: 103 }),
    region: "desert", passive: "Double accuracy roll, min hit = max/2 vs high-def" },

  // Blade of Saeldor
  { id: "saeldor", name: "Blade of Saeldor", slot: "weapon", weaponCategory: "1h-heavy", attackSpeed: 4, combatStyle: "melee", attackType: "slash",
    bonuses: b({ astab: 55, aslash: 94, mstr: 89 }),
    region: "tirannwn" },

  // Ghrazi Rapier
  { id: "rapier", name: "Ghrazi Rapier", slot: "weapon", weaponCategory: "1h-light", attackSpeed: 4, combatStyle: "melee", attackType: "stab",
    bonuses: b({ astab: 94, aslash: 55, mstr: 89 }),
    region: "morytania" },

  // Inquisitor's Mace (wiki-verified: +52 stab, -4 slash, +95 crush, +89 str, +2 pray)
  { id: "inq-mace", name: "Inquisitor's Mace", slot: "weapon", weaponCategory: "1h-heavy", attackSpeed: 4, combatStyle: "melee", attackType: "crush",
    bonuses: b({ astab: 52, aslash: -4, acrush: 95, mstr: 89, prayer: 2 }),
    region: "morytania" },

  // Abyssal Whip
  { id: "whip", name: "Abyssal Whip", slot: "weapon", weaponCategory: "1h-light", attackSpeed: 4, combatStyle: "melee", attackType: "slash",
    bonuses: b({ astab: 0, aslash: 82, mstr: 82 }) },

  // Dragon Claws (spec weapon, listed for completeness)
  { id: "dclaws", name: "Dragon Claws", slot: "weapon", weaponCategory: "1h-light", attackSpeed: 4, combatStyle: "melee", attackType: "slash",
    bonuses: b({ astab: 41, aslash: 57, acrush: -4, mstr: 56 }) },

  // Abyssal Tentacle
  { id: "tentacle", name: "Abyssal Tentacle", slot: "weapon", weaponCategory: "1h-light", attackSpeed: 4, combatStyle: "melee", attackType: "slash",
    bonuses: b({ astab: 0, aslash: 90, mstr: 86 }) },

  // Dragon Scimitar
  { id: "d-scim", name: "Dragon Scimitar", slot: "weapon", weaponCategory: "1h-light", attackSpeed: 4, combatStyle: "melee", attackType: "slash",
    bonuses: b({ astab: 8, aslash: 67, mstr: 66 }) },

  // Saradomin Godsword
  { id: "sgs", name: "Saradomin Godsword", slot: "weapon", isTwoHanded: true, weaponCategory: "2h-melee", attackSpeed: 6, combatStyle: "melee", attackType: "slash",
    bonuses: b({ astab: 0, aslash: 132, acrush: 80, mstr: 132 }),
    region: "asgarnia" },

  // Zamorak Godsword
  { id: "zgs", name: "Zamorak Godsword", slot: "weapon", isTwoHanded: true, weaponCategory: "2h-melee", attackSpeed: 6, combatStyle: "melee", attackType: "slash",
    bonuses: b({ astab: 0, aslash: 132, acrush: 80, mstr: 132 }),
    region: "asgarnia" },

  // Arclight
  { id: "arclight", name: "Arclight", slot: "weapon", weaponCategory: "1h-heavy", attackSpeed: 4, combatStyle: "melee", attackType: "slash",
    bonuses: b({ astab: 38, aslash: 72, mstr: 72 }),
    passive: "+70% accuracy and damage vs demons" },

  // Dragon Hunter Lance (wiki-verified: +85 stab, +65 slash, +20 crush, +82 str)
  { id: "dhl", name: "Dragon Hunter Lance", slot: "weapon", weaponCategory: "1h-heavy", attackSpeed: 4, combatStyle: "melee", attackType: "stab",
    bonuses: b({ astab: 85, aslash: 65, acrush: 20, mstr: 82 }),
    passive: "+20% accuracy and damage vs dragons" },

  // Keris Partisan of Breaching (wiki-verified)
  { id: "keris-breaching", name: "Keris Partisan of Breaching", slot: "weapon", weaponCategory: "1h-heavy", attackSpeed: 5, combatStyle: "melee", attackType: "stab",
    bonuses: b({ astab: 78, acrush: 2, mstr: 75 }),
    region: "desert", passive: "+33% damage vs kalphites, 1/51 triple-damage proc" },

  // Crystal Halberd
  { id: "crystal-halberd", name: "Crystal Halberd", slot: "weapon", isTwoHanded: true, weaponCategory: "halberd", attackSpeed: 7, combatStyle: "melee", attackType: "slash",
    bonuses: b({ astab: 70, aslash: 95, mstr: 97 }),
    region: "tirannwn" },

  // ══════════════════════════════════════════════════════════════════════
  // RANGED WEAPONS
  // ══════════════════════════════════════════════════════════════════════

  // Zaryte Crossbow
  { id: "zcb", name: "Zaryte Crossbow", slot: "weapon", weaponCategory: "crossbow", attackSpeed: 5, combatStyle: "ranged", attackType: "ranged",
    bonuses: b({ aranged: 110 }),
    region: "asgarnia" },

  // Armadyl Crossbow
  { id: "acb", name: "Armadyl Crossbow", slot: "weapon", weaponCategory: "crossbow", attackSpeed: 5, combatStyle: "ranged", attackType: "ranged",
    bonuses: b({ aranged: 100, prayer: 1 }),
    region: "asgarnia" },

  // Dragon Crossbow
  { id: "dcb", name: "Dragon Crossbow", slot: "weapon", weaponCategory: "crossbow", attackSpeed: 5, combatStyle: "ranged", attackType: "ranged",
    bonuses: b({ aranged: 94 }) },

  // Dragon Hunter Crossbow (wiki-verified: +95 ranged atk)
  { id: "dhcb", name: "Dragon Hunter Crossbow", slot: "weapon", weaponCategory: "crossbow", attackSpeed: 5, combatStyle: "ranged", attackType: "ranged",
    bonuses: b({ aranged: 95 }),
    passive: "+30% accuracy, +25% damage vs dragons" },

  // Toxic Blowpipe
  { id: "blowpipe", name: "Toxic Blowpipe", slot: "weapon", isTwoHanded: true, weaponCategory: "blowpipe", attackSpeed: 3, combatStyle: "ranged", attackType: "ranged",
    bonuses: b({ aranged: 30, rstr: 20 }),
    passive: "Uses darts as ammo, adds dart ranged str" },

  // Bow of Faerdhinen
  { id: "bowfa", name: "Bow of Faerdhinen", slot: "weapon", isTwoHanded: true, weaponCategory: "bow", attackSpeed: 4, combatStyle: "ranged", attackType: "ranged",
    bonuses: b({ aranged: 128, rstr: 106 }),
    region: "tirannwn", passive: "Crystal armor synergy: +15% acc, +15% dmg with full set" },

  // Magic Shortbow (i)
  { id: "msb-i", name: "Magic Shortbow (i)", slot: "weapon", isTwoHanded: true, weaponCategory: "bow", attackSpeed: 3, combatStyle: "ranged", attackType: "ranged",
    bonuses: b({ aranged: 75 }) },

  // Craw's Bow (wiki-verified)
  { id: "craws-bow", name: "Craw's Bow", slot: "weapon", isTwoHanded: true, weaponCategory: "bow", attackSpeed: 4, combatStyle: "ranged", attackType: "ranged",
    bonuses: b({ aranged: 75, rstr: 60 }),
    region: "wilderness", passive: "+50% accuracy and damage in wilderness" },

  // Webweaver Bow (wiki-verified)
  { id: "webweaver-bow", name: "Webweaver Bow", slot: "weapon", isTwoHanded: true, weaponCategory: "bow", attackSpeed: 5, combatStyle: "ranged", attackType: "ranged",
    bonuses: b({ aranged: 85, rstr: 65 }),
    region: "wilderness", passive: "+50% accuracy and damage in wilderness" },

  // Viggora's Chainmace (wiki-verified)
  { id: "viggoras-chainmace", name: "Viggora's Chainmace", slot: "weapon", weaponCategory: "1h-heavy", attackSpeed: 4, combatStyle: "melee", attackType: "crush",
    bonuses: b({ acrush: 72, mstr: 72 }),
    region: "wilderness", passive: "+50% accuracy and damage in wilderness" },

  // Ursine Chainmace (wiki-verified)
  { id: "ursine-chainmace", name: "Ursine Chainmace", slot: "weapon", weaponCategory: "1h-heavy", attackSpeed: 4, combatStyle: "melee", attackType: "crush",
    bonuses: b({ acrush: 78, mstr: 78 }),
    region: "wilderness", passive: "+50% accuracy and damage in wilderness" },

  // Thammaron's Sceptre (wiki-verified)
  { id: "thammarons-sceptre", name: "Thammaron's Sceptre", slot: "weapon", weaponCategory: "powered-staff", attackSpeed: 5, combatStyle: "magic", attackType: "magic",
    bonuses: b({ amagic: 20, mdmg: 3 }),
    region: "wilderness", passive: "+100% magic accuracy, +25% magic damage in wilderness" },

  // Accursed Sceptre (wiki-verified)
  { id: "accursed-sceptre", name: "Accursed Sceptre", slot: "weapon", weaponCategory: "powered-staff", attackSpeed: 5, combatStyle: "magic", attackType: "magic",
    bonuses: b({ amagic: 22, mdmg: 4 }),
    region: "wilderness", passive: "+100% magic accuracy, +25% magic damage in wilderness" },

  // Eclipse Atlatl (wiki-verified: Varlamore thrown weapon)
  { id: "eclipse-atlatl", name: "Eclipse Atlatl", slot: "weapon", weaponCategory: "thrown", attackSpeed: 3, combatStyle: "ranged", attackType: "ranged",
    bonuses: b({ aranged: 90 }),
    region: "varlamore" },

  // ══════════════════════════════════════════════════════════════════════
  // MAGIC WEAPONS (non-powered)
  // ══════════════════════════════════════════════════════════════════════

  // Sanguinesti Staff (wiki-verified: 1H, +25 magic, +0% mdmg base, 4t)
  { id: "sang", name: "Sanguinesti Staff", slot: "weapon", weaponCategory: "powered-staff", attackSpeed: 4, combatStyle: "magic", attackType: "magic",
    bonuses: b({ amagic: 25, aranged: -4, dstab: 2, dslash: 3, dcrush: 1, dmagic: 15 }),
    region: "morytania", passive: "Powered staff (max = magic/3 - 1), 1/6 heal" },

  // Trident of the Swamp
  { id: "trident-swamp", name: "Trident of the Swamp", slot: "weapon", weaponCategory: "powered-staff", attackSpeed: 4, combatStyle: "magic", attackType: "magic",
    bonuses: b({ amagic: 25, mdmg: 3 }),
    passive: "Built-in spell (max hit scales with magic), venom" },

  // Kodai Wand
  { id: "kodai", name: "Kodai Wand", slot: "weapon", weaponCategory: "staff", attackSpeed: 5, combatStyle: "magic", attackType: "magic",
    bonuses: b({ amagic: 28, mdmg: 5 }),
    region: "kourend", passive: "Autocast ancient magicks, 15% rune saving, unlimited water runes" },

  // Nightmare Staff
  { id: "nightmare-staff", name: "Nightmare Staff", slot: "weapon", weaponCategory: "staff", attackSpeed: 5, combatStyle: "magic", attackType: "magic",
    bonuses: b({ amagic: 16, mdmg: 3, prayer: 2 }),
    passive: "Accepts orbs for enhanced attacks" },

  // Harmonised Nightmare Staff (wiki-verified: +16 magic atk, +15% magic dmg, +14 magic def, 4t for standard spells)
  { id: "harm-staff", name: "Harmonised Nightmare Staff", slot: "weapon", weaponCategory: "staff", attackSpeed: 4, combatStyle: "magic", attackType: "magic",
    bonuses: b({ amagic: 16, dmagic: 14, mdmg: 15 }),
    passive: "Standard spells cast at 4t instead of 5t" },

  // ══════════════════════════════════════════════════════════════════════
  // HEAD SLOT
  // ══════════════════════════════════════════════════════════════════════

  { id: "torva-helm", name: "Torva Full Helm", slot: "head",
    bonuses: b({ amagic: -5, aranged: -5, dstab: 59, dslash: 60, dcrush: 62, dranged: 57, dmagic: -2, mstr: 8, prayer: 1 }),
    region: "asgarnia" },

  { id: "neit-helm", name: "Neitiznot Faceguard", slot: "head",
    bonuses: b({ dstab: 33, dslash: 30, dcrush: 35, dranged: -2, dmagic: -2, mstr: 6, prayer: 3 }),
    region: "fremennik" },

  { id: "serp-helm", name: "Serpentine Helm", slot: "head",
    bonuses: b({ dstab: 52, dslash: 55, dcrush: 58, dranged: -1, dmagic: -5, mstr: 5 }) },

  { id: "masori-mask", name: "Masori Mask (f)", slot: "head",
    bonuses: b({ amagic: -1, aranged: 12, dstab: 8, dslash: 10, dcrush: 12, dranged: 9, dmagic: 12, rstr: 2, prayer: 1 }),
    region: "desert" },

  { id: "armadyl-helm", name: "Armadyl Helmet", slot: "head",
    bonuses: b({ aranged: 10, dstab: 6, dslash: 6, dcrush: 8, dranged: 10, mstr: 0, rstr: 0, prayer: 1 }),
    region: "asgarnia" },

  { id: "ancestral-hat", name: "Ancestral Hat", slot: "head",
    bonuses: b({ amagic: 8, aranged: -2, dstab: 12, dslash: 11, dcrush: 13, dmagic: 5, mdmg: 3 }),
    region: "kourend" },

  { id: "virtus-mask", name: "Virtus Mask", slot: "head",
    bonuses: b({ amagic: 8, dmagic: 8, mdmg: 3, prayer: 1 }),
    region: "asgarnia" },

  { id: "slayer-helm-i", name: "Slayer Helmet (i)", slot: "head",
    bonuses: b({ amagic: 3, aranged: 3, dstab: 30, dslash: 32, dcrush: 27, dranged: 30, dmagic: 10, mstr: 3 }),
    passive: "Melee: +16.67% acc & dmg. Ranged/Magic: +15% acc & dmg. On task only." },

  // Crystal Helm (wiki-verified: Tirannwn)
  { id: "crystal-helm", name: "Crystal Helm", slot: "head",
    bonuses: b({ aranged: 6, dstab: 9, dslash: 9, dcrush: 9, dranged: 9 }),
    region: "tirannwn", passive: "+5% ranged acc, +2.5% ranged dmg with Bow of Faerdhinen" },

  // Inquisitor's Great Helm (wiki-verified)
  { id: "inq-helm", name: "Inquisitor's Great Helm", slot: "head",
    bonuses: b({ acrush: 4, dstab: 27, dslash: 27, dcrush: 27, dranged: -5, dmagic: -5, mstr: 2, prayer: 1 }),
    region: "morytania" },

  // ══════════════════════════════════════════════════════════════════════
  // BODY SLOT
  // ══════════════════════════════════════════════════════════════════════

  { id: "torva-body", name: "Torva Platebody", slot: "body",
    bonuses: b({ amagic: -18, aranged: -14, dstab: 117, dslash: 111, dcrush: 117, dranged: 142, dmagic: -11, mstr: 6, prayer: 1 }),
    region: "asgarnia" },

  { id: "bcp", name: "Bandos Chestplate", slot: "body",
    bonuses: b({ amagic: -15, aranged: -10, dstab: 98, dslash: 93, dcrush: 105, dranged: 133, dmagic: -6, mstr: 4, prayer: 1 }),
    region: "asgarnia" },

  { id: "fighter-torso", name: "Fighter Torso", slot: "body",
    bonuses: b({ dstab: 51, dslash: 45, dcrush: 54, dranged: -7, dmagic: -21, mstr: 4 }) },

  { id: "masori-body", name: "Masori Body (f)", slot: "body",
    bonuses: b({ amagic: -4, aranged: 43, dstab: 59, dslash: 52, dcrush: 64, dranged: 60, dmagic: 74, rstr: 4, prayer: 1 }),
    region: "desert" },

  { id: "armadyl-body", name: "Armadyl Chestplate", slot: "body",
    bonuses: b({ aranged: 33, dstab: 56, dslash: 48, dcrush: 61, dranged: 57, mstr: 0, prayer: 1 }),
    region: "asgarnia" },

  { id: "ancestral-top", name: "Ancestral Robe Top", slot: "body",
    bonuses: b({ amagic: 35, aranged: -8, dstab: 42, dslash: 31, dcrush: 51, dmagic: 28, mdmg: 3 }),
    region: "kourend" },

  { id: "virtus-top", name: "Virtus Robe Top", slot: "body",
    bonuses: b({ amagic: 35, dmagic: 30, mdmg: 3, prayer: 1 }),
    region: "asgarnia" },

  { id: "crystal-body", name: "Crystal Body", slot: "body",
    bonuses: b({ aranged: 26, dstab: 42, dslash: 42, dcrush: 42, dranged: 42, rstr: 0 }),
    region: "tirannwn", passive: "+6% ranged acc, +3% ranged dmg with Bow of Faerdhinen" },

  // Inquisitor's Hauberk (wiki-verified)
  { id: "inq-body", name: "Inquisitor's Hauberk", slot: "body",
    bonuses: b({ acrush: 8, dstab: 38, dslash: 38, dcrush: 38, dranged: -7, dmagic: -7, mstr: 4, prayer: 1 }),
    region: "morytania" },

  // ══════════════════════════════════════════════════════════════════════
  // LEGS SLOT
  // ══════════════════════════════════════════════════════════════════════

  { id: "torva-legs", name: "Torva Platelegs", slot: "legs",
    bonuses: b({ amagic: -24, aranged: -11, dstab: 87, dslash: 78, dcrush: 79, dranged: 102, dmagic: -9, mstr: 4, prayer: 1 }),
    region: "asgarnia" },

  { id: "tassets", name: "Bandos Tassets", slot: "legs",
    bonuses: b({ amagic: -21, aranged: -7, dstab: 71, dslash: 63, dcrush: 66, dranged: 93, dmagic: -4, mstr: 2, prayer: 1 }),
    region: "asgarnia" },

  { id: "masori-chaps", name: "Masori Chaps (f)", slot: "legs",
    bonuses: b({ amagic: -2, aranged: 27, dstab: 35, dslash: 30, dcrush: 39, dranged: 37, dmagic: 46, rstr: 2, prayer: 1 }),
    region: "desert" },

  { id: "armadyl-skirt", name: "Armadyl Chainskirt", slot: "legs",
    bonuses: b({ aranged: 20, dstab: 31, dslash: 17, dcrush: 33, dranged: 38, mstr: 0, prayer: 1 }),
    region: "asgarnia" },

  { id: "ancestral-bottom", name: "Ancestral Robe Bottom", slot: "legs",
    bonuses: b({ amagic: 26, aranged: -7, dstab: 27, dslash: 24, dcrush: 30, dmagic: 20, mdmg: 3 }),
    region: "kourend" },

  { id: "virtus-bottom", name: "Virtus Robe Bottom", slot: "legs",
    bonuses: b({ amagic: 26, dmagic: 22, mdmg: 3, prayer: 1 }),
    region: "asgarnia" },

  { id: "crystal-legs", name: "Crystal Legs", slot: "legs",
    bonuses: b({ aranged: 13, dstab: 26, dslash: 26, dcrush: 26, dranged: 26, rstr: 0 }),
    region: "tirannwn", passive: "+4% ranged acc, +2% ranged dmg with Bow of Faerdhinen" },

  // Inquisitor's Plateskirt (wiki-verified)
  { id: "inq-legs", name: "Inquisitor's Plateskirt", slot: "legs",
    bonuses: b({ acrush: 6, dstab: 21, dslash: 21, dcrush: 21, dranged: -4, dmagic: -4, mstr: 2, prayer: 1 }),
    region: "morytania" },

  // ══════════════════════════════════════════════════════════════════════
  // SHIELD SLOT
  // ══════════════════════════════════════════════════════════════════════

  { id: "avernic", name: "Avernic Defender", slot: "shield",
    bonuses: b({ astab: 30, aslash: 29, acrush: 28, amagic: -5, aranged: -4, dstab: 30, dslash: 29, dcrush: 28, dmagic: -5, dranged: -4, mstr: 8 }),
    region: "morytania" },

  { id: "dragon-def", name: "Dragon Defender", slot: "shield",
    bonuses: b({ astab: 25, aslash: 24, acrush: 23, dstab: 24, dslash: 26, dcrush: 25, mstr: 6 }) },

  { id: "dragonfire-shield", name: "Dragonfire Shield", slot: "shield",
    bonuses: b({ dstab: 30, dslash: 32, dcrush: 34, dranged: 7, dmagic: 10, mstr: 7 }) },

  { id: "spectral", name: "Spectral Spirit Shield", slot: "shield",
    bonuses: b({ dstab: 30, dslash: 30, dcrush: 30, dranged: 30, dmagic: 30, prayer: 3 }) },

  { id: "arcane", name: "Arcane Spirit Shield", slot: "shield",
    bonuses: b({ amagic: 20, dstab: 30, dslash: 30, dcrush: 30, dranged: 30, dmagic: 30, prayer: 3 }) },

  { id: "twisted-buckler", name: "Twisted Buckler", slot: "shield",
    bonuses: b({ aranged: 10, dstab: 2, dslash: 3, dcrush: 1, dranged: 15, rstr: 0, prayer: 2 }),
    region: "kourend" },

  { id: "book-of-dead", name: "Book of the Dead", slot: "shield",
    bonuses: b({ amagic: 6, mdmg: 3, prayer: 5 }),
    region: "kourend" },

  { id: "elidinis-ward", name: "Elidinis' Ward (f)", slot: "shield",
    bonuses: b({ amagic: 25, dstab: 53, dslash: 55, dcrush: 73, dranged: 52, dmagic: 2, mdmg: 5, prayer: 4 }),
    region: "desert" },

  // ══════════════════════════════════════════════════════════════════════
  // CAPE SLOT
  // ══════════════════════════════════════════════════════════════════════

  { id: "infernal-cape", name: "Infernal Cape", slot: "cape",
    bonuses: b({ astab: 4, aslash: 4, acrush: 4, dstab: 12, dslash: 12, dcrush: 12, dranged: 12, dmagic: 12, mstr: 8, prayer: 2 }) },

  { id: "fire-cape", name: "Fire Cape", slot: "cape",
    bonuses: b({ astab: 1, aslash: 1, acrush: 1, dstab: 11, dslash: 11, dcrush: 11, dranged: 11, dmagic: 11, mstr: 4, prayer: 2 }) },

  { id: "avas-assembler", name: "Ava's Assembler", slot: "cape",
    bonuses: b({ aranged: 8, dstab: 1, dslash: 1, dcrush: 1, dranged: 2, rstr: 2, prayer: 2 }) },

  { id: "ma2-cape-range", name: "Masori Assembler Max Cape", slot: "cape",
    bonuses: b({ aranged: 10, dstab: 3, dslash: 3, dcrush: 3, dranged: 5, rstr: 2, prayer: 4 }) },

  { id: "imbued-god-cape", name: "Imbued God Cape", slot: "cape",
    bonuses: b({ amagic: 15, dmagic: 15, mdmg: 2 }) },

  // ══════════════════════════════════════════════════════════════════════
  // NECK SLOT
  // ══════════════════════════════════════════════════════════════════════

  { id: "torture", name: "Amulet of Torture", slot: "neck",
    bonuses: b({ astab: 15, aslash: 15, acrush: 15, mstr: 10, prayer: 2 }) },

  { id: "blood-fury", name: "Amulet of Blood Fury", slot: "neck",
    bonuses: b({ astab: 15, aslash: 15, acrush: 15, mstr: 10, prayer: 2 }),
    passive: "20% chance to heal 30% of melee damage dealt" },

  { id: "anguish", name: "Necklace of Anguish", slot: "neck",
    bonuses: b({ aranged: 15, rstr: 5, prayer: 2 }) },

  { id: "occult", name: "Occult Necklace", slot: "neck",
    bonuses: b({ amagic: 12, mdmg: 5 }) },

  // Salve Amulet (ei) — +20% acc & dmg vs undead (all styles), does NOT stack with slayer helm
  { id: "salve-ei", name: "Salve Amulet (ei)", slot: "neck",
    bonuses: b({ dstab: 2, dslash: 2, dcrush: 2, dranged: 2, dmagic: 2 }),
    passive: "+20% accuracy and damage vs undead (all styles)" },

  { id: "fury", name: "Amulet of Fury", slot: "neck",
    bonuses: b({ astab: 10, aslash: 10, acrush: 10, aranged: 10, amagic: 10, dstab: 15, dslash: 15, dcrush: 15, dranged: 15, dmagic: 15, mstr: 8, prayer: 5 }) },

  // ══════════════════════════════════════════════════════════════════════
  // AMMO SLOT
  // ══════════════════════════════════════════════════════════════════════

  { id: "ruby-bolts-e", name: "Ruby Dragon Bolts (e)", slot: "ammo",
    bonuses: b({ rstr: 122 }),
    passive: "Blood Forfeit: 6% chance to hit 20% of target's remaining HP" },

  { id: "diamond-bolts-e", name: "Diamond Dragon Bolts (e)", slot: "ammo",
    bonuses: b({ rstr: 122 }),
    passive: "Armour Piercing: 10% chance to ignore ranged defence" },

  { id: "dragon-arrows", name: "Dragon Arrows", slot: "ammo",
    bonuses: b({ aranged: 0, rstr: 60 }) },

  { id: "amethyst-arrows", name: "Amethyst Arrows", slot: "ammo",
    bonuses: b({ aranged: 0, rstr: 55 }) },

  { id: "rune-arrows", name: "Rune Arrows", slot: "ammo",
    bonuses: b({ aranged: 0, rstr: 49 }) },

  { id: "amethyst-darts", name: "Amethyst Darts", slot: "ammo",
    bonuses: b({ aranged: 3, rstr: 14 }) },

  { id: "dragon-darts", name: "Dragon Darts", slot: "ammo",
    bonuses: b({ aranged: 2, rstr: 18 }) },

  { id: "atlatl-dart", name: "Atlatl Dart", slot: "ammo",
    bonuses: b({ rstr: 55 }),
    region: "varlamore" },

  // ══════════════════════════════════════════════════════════════════════
  // HANDS SLOT
  // ══════════════════════════════════════════════════════════════════════

  { id: "ferocious", name: "Ferocious Gloves", slot: "hands",
    bonuses: b({ astab: 16, aslash: 16, acrush: 16, mstr: 14 }) },

  { id: "zaryte-vambs", name: "Zaryte Vambraces", slot: "hands",
    bonuses: b({ aranged: 18, dstab: 0, dranged: 8, dmagic: 2, rstr: 2, prayer: 1 }),
    region: "asgarnia" },

  { id: "barrows-gloves", name: "Barrows Gloves", slot: "hands",
    bonuses: b({ astab: 12, aslash: 12, acrush: 12, aranged: 12, amagic: 6, dstab: 12, dslash: 12, dcrush: 12, dranged: 12, dmagic: 6, mstr: 12, rstr: 0 }) },

  { id: "tormented", name: "Tormented Bracelet", slot: "hands",
    bonuses: b({ amagic: 10, mdmg: 5 }) },

  // ══════════════════════════════════════════════════════════════════════
  // FEET SLOT
  // ══════════════════════════════════════════════════════════════════════

  { id: "primordial", name: "Primordial Boots", slot: "feet",
    bonuses: b({ astab: 2, aslash: 2, acrush: 2, dstab: 22, dslash: 22, dcrush: 22, mstr: 5 }) },

  { id: "pegasian", name: "Pegasian Boots", slot: "feet",
    bonuses: b({ aranged: 12, dstab: 5, dslash: 3, dcrush: 5, dranged: 12 }) },

  { id: "eternal", name: "Eternal Boots", slot: "feet",
    bonuses: b({ amagic: 8, dstab: 5, dslash: 3, dcrush: 5, dmagic: 8 }) },

  { id: "dragon-boots", name: "Dragon Boots", slot: "feet",
    bonuses: b({ dstab: 16, dslash: 17, dcrush: 18, mstr: 4 }) },

  // ══════════════════════════════════════════════════════════════════════
  // RING SLOT
  // ══════════════════════════════════════════════════════════════════════

  { id: "ultor", name: "Ultor Ring", slot: "ring",
    bonuses: b({ mstr: 12 }),
    region: "desert" },

  { id: "venator", name: "Venator Ring", slot: "ring",
    bonuses: b({ aranged: 10, rstr: 2 }),
    region: "desert" },

  { id: "magus", name: "Magus Ring", slot: "ring",
    bonuses: b({ amagic: 8, mdmg: 2 }),
    region: "desert" },

  { id: "bellator", name: "Bellator Ring", slot: "ring",
    bonuses: b({ astab: 0, aslash: 0, acrush: 0, mstr: 6 }),
    region: "desert" },

  { id: "berserker-i", name: "Berserker Ring (i)", slot: "ring",
    bonuses: b({ mstr: 8 }) },

  { id: "archers-i", name: "Archers' Ring (i)", slot: "ring",
    bonuses: b({ aranged: 8 }) },

  { id: "seers-i", name: "Seers' Ring (i)", slot: "ring",
    bonuses: b({ amagic: 8 }) },

  // ══════════════════════════════════════════════════════════════════════
  // ECHO ITEMS — All 10 revealed Apr 10 2026
  // ══════════════════════════════════════════════════════════════════════

  // V's Helm (Head, Fremennik)
  { id: "echo-vs-helm", name: "V's Helm", slot: "head",
    bonuses: b({ aranged: 12, amagic: 8, dstab: 30, dslash: 32, dcrush: 27, dranged: 30, dmagic: 10, mstr: 8, rstr: 2, mdmg: 3 }),
    region: "fremennik",
    passive: "Acts as Slayer Helmet (i) for all styles. 5% damage redirected to 0 (damage reduction)" },

  // King's Barrage (2H Weapon, Wilderness)
  { id: "echo-kings-barrage", name: "King's Barrage", slot: "weapon", isTwoHanded: true, weaponCategory: "crossbow", attackSpeed: 6, combatStyle: "ranged", attackType: "ranged",
    bonuses: b({ aranged: 130, rstr: 14 }),
    region: "wilderness",
    passive: "Fires 2 bolts per attack (each at halved max hit). Freezes target" },

  // Infernal Tecpatl (2H Weapon, Varlamore)
  { id: "echo-tecpatl", name: "Infernal Tecpatl", slot: "weapon", isTwoHanded: true, weaponCategory: "2h-melee", attackSpeed: 4, combatStyle: "melee", attackType: "stab",
    bonuses: b({ astab: 72, aslash: 72, acrush: 72, mstr: 70 }),
    region: "varlamore",
    passive: "Hits twice per attack. 10% bonus damage to demons (demonbane)" },

  // Fang of the Hound (1H Weapon, Asgarnia)
  { id: "echo-fang-hound", name: "Fang of the Hound", slot: "weapon", weaponCategory: "1h-light", attackSpeed: 3, combatStyle: "melee", attackType: "stab",
    bonuses: b({ astab: 60, aslash: 60, mstr: 20 }),
    region: "asgarnia",
    passive: "5% chance to proc Flames of Cerberus (bonus fire hit)" },

  // Shadowflame Quadrant (2H Weapon, Kandarin)
  { id: "echo-shadowflame", name: "Shadowflame Quadrant", slot: "weapon", isTwoHanded: true, weaponCategory: "staff", attackSpeed: 5, combatStyle: "magic", attackType: "magic",
    bonuses: b({ acrush: 60, amagic: 25, mstr: 50, mdmg: 15 }),
    region: "kandarin",
    passive: "40% bonus damage on spells. Provides infinite runes for all spellbooks" },

  // Nature's Recurve (2H Weapon, Kourend)
  { id: "echo-natures-recurve", name: "Nature's Recurve", slot: "weapon", isTwoHanded: true, weaponCategory: "bow", attackSpeed: 4, combatStyle: "ranged", attackType: "ranged",
    bonuses: b({ aranged: 95, rstr: 4 }),
    region: "kourend",
    passive: "50% chance to heal 10% of damage dealt" },

  // Devil's Element (Shield, Kandarin)
  { id: "echo-devils-element", name: "Devil's Element", slot: "shield",
    bonuses: b({ amagic: 20, dstab: 0, dslash: 0, dcrush: 0, dranged: 0, dmagic: 20, mdmg: 6, prayer: 3 }),
    region: "kandarin",
    passive: "+30% damage on elemental weakness spells" },

  // Crystal Blessing (Ammo, Tirannwn)
  { id: "echo-crystal-blessing", name: "Crystal Blessing", slot: "ammo",
    bonuses: b({ prayer: 5 }),
    region: "tirannwn",
    passive: "Crystal armour set bonuses apply to melee and magic as well as ranged" },

  // Lithic Sceptre (2H Weapon, Morytania)
  { id: "echo-lithic-sceptre", name: "Lithic Sceptre", slot: "weapon", isTwoHanded: true, weaponCategory: "powered-staff", attackSpeed: 4, combatStyle: "magic", attackType: "magic",
    bonuses: b({ amagic: 25, mdmg: 4 }),
    region: "morytania",
    passive: "Powered staff. Shatter stacks: each hit adds a stack, stacks increase subsequent damage" },

  // Drygore Blowpipe (2H Weapon, Desert)
  { id: "echo-drygore-blowpipe", name: "Drygore Blowpipe", slot: "weapon", isTwoHanded: true, weaponCategory: "blowpipe", attackSpeed: 2, combatStyle: "ranged", attackType: "ranged",
    bonuses: b({ aranged: 50, rstr: 10 }),
    region: "desert",
    passive: "Double accuracy roll. 25% chance to apply burn (3-tick fire DoT)" },
];

// ═══════════════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════

const itemMap = new Map(ITEMS.map(item => [item.id, item]));

export function getItem(id: string): Item | undefined {
  return itemMap.get(id);
}

export function getItemsBySlot(slot: EquipmentSlot): Item[] {
  return ITEMS.filter(item => item.slot === slot);
}

export function getItemsByRegion(region: string): Item[] {
  return ITEMS.filter(item => item.region === region);
}

export function getItemsForStyle(style: CombatStyle): Item[] {
  return ITEMS.filter(item => {
    // Weapons: match combat style
    if (item.combatStyle) return item.combatStyle === style;
    // Armour: match based on offensive bonuses
    const { bonuses } = item;
    switch (style) {
      case "melee":
        return bonuses.mstr > 0 || bonuses.astab > 0 || bonuses.aslash > 0 || bonuses.acrush > 0;
      case "ranged":
        return bonuses.rstr > 0 || bonuses.aranged > 0;
      case "magic":
        return bonuses.mdmg > 0 || bonuses.amagic > 0;
    }
  });
}

export function getAvailableItems(regions: string[]): Item[] {
  return ITEMS.filter(item => !item.region || regions.includes(item.region));
}
