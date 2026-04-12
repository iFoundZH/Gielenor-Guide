import type { Item, EquipmentSlot, EquipmentBonuses, CombatStyle, WeaponCategory, AttackType } from "@/types/dps";
import equipmentDb from "./equipment-db.json";

// ═══════════════════════════════════════════════════════════════════════
// IMPORT & TRANSFORM WIKI DATA
// ═══════════════════════════════════════════════════════════════════════

interface RawItem {
  id: string;
  wikiId: number;
  name: string;
  slot: EquipmentSlot;
  bonuses: EquipmentBonuses;
  isTwoHanded?: boolean;
  weaponCategory?: WeaponCategory;
  attackSpeed?: number;
  combatStyle?: CombatStyle;
  attackType?: AttackType;
}

const rawItems = equipmentDb as RawItem[];

// ── ID Overrides: map our stable IDs → wiki item name (case-insensitive) ──
// Items referenced by ID in dps-engine.ts MUST keep their old IDs.
const ID_OVERRIDES: Record<string, string> = {
  // Melee weapons
  "scythe": "Scythe of vitur",
  "fang": "Osmumten's fang",
  "saeldor": "Blade of saeldor",
  "rapier": "Ghrazi rapier",
  "inq-mace": "Inquisitor's mace",
  "whip": "Abyssal whip",
  "dclaws": "Dragon claws",
  "tentacle": "Abyssal tentacle",
  "d-scim": "Dragon scimitar",
  "sgs": "Saradomin godsword",
  "zgs": "Zamorak godsword",
  "arclight": "Arclight",
  "dhl": "Dragon hunter lance",
  "keris-breaching": "Keris partisan of breaching",
  "crystal-halberd": "Crystal halberd",
  // Ranged weapons
  "zcb": "Zaryte crossbow",
  "acb": "Armadyl crossbow",
  "dcb": "Dragon crossbow",
  "dhcb": "Dragon hunter crossbow",
  "blowpipe": "Toxic blowpipe",
  "bowfa": "Bow of faerdhinen",
  "msb-i": "Magic shortbow (i)",
  "craws-bow": "Craw's bow",
  "webweaver-bow": "Webweaver bow",
  "eclipse-atlatl": "Eclipse atlatl",
  // Wilderness melee
  "viggoras-chainmace": "Viggora's chainmace",
  "ursine-chainmace": "Ursine chainmace",
  // Magic weapons
  "shadow": "Tumeken's shadow",
  "tbow": "Twisted bow",
  "sang": "Sanguinesti staff",
  "trident-swamp": "Trident of the swamp",
  "kodai": "Kodai wand",
  "nightmare-staff": "Nightmare staff",
  "harm-staff": "Harmonised nightmare staff",
  "thammarons-sceptre": "Thammaron's sceptre",
  "accursed-sceptre": "Accursed sceptre",
  // Head
  "torva-helm": "Torva full helm",
  "neit-helm": "Neitiznot faceguard",
  "serp-helm": "Serpentine helm",
  "masori-mask": "Masori mask (f)",
  "armadyl-helm": "Armadyl helmet",
  "ancestral-hat": "Ancestral hat",
  "virtus-mask": "Virtus mask",
  "slayer-helm-i": "Slayer helmet (i)",
  "crystal-helm": "Crystal helm",
  "inq-helm": "Inquisitor's great helm",
  // Body
  "torva-body": "Torva platebody",
  "bcp": "Bandos chestplate",
  "fighter-torso": "Fighter torso",
  "masori-body": "Masori body (f)",
  "armadyl-body": "Armadyl chestplate",
  "ancestral-top": "Ancestral robe top",
  "virtus-top": "Virtus robe top",
  "crystal-body": "Crystal body",
  "inq-body": "Inquisitor's hauberk",
  // Legs
  "torva-legs": "Torva platelegs",
  "tassets": "Bandos tassets",
  "masori-chaps": "Masori chaps (f)",
  "armadyl-skirt": "Armadyl chainskirt",
  "ancestral-bottom": "Ancestral robe bottom",
  "virtus-bottom": "Virtus robe bottom",
  "crystal-legs": "Crystal legs",
  "inq-legs": "Inquisitor's plateskirt",
  // Shield
  "avernic": "Avernic defender",
  "dragon-def": "Dragon defender",
  "dragonfire-shield": "Dragonfire shield",
  "spectral": "Spectral spirit shield",
  "arcane": "Arcane spirit shield",
  "twisted-buckler": "Twisted buckler",
  "book-of-dead": "Book of the dead",
  "elidinis-ward": "Elidinis' ward (f)",
  // Cape
  "infernal-cape": "Infernal cape",
  "fire-cape": "Fire cape",
  "avas-assembler": "Ava's assembler",
  "imbued-god-cape": "Imbued saradomin cape",
  // Neck
  "torture": "Amulet of torture",
  "blood-fury": "Amulet of blood fury",
  "anguish": "Necklace of anguish",
  "occult": "Occult necklace",
  "salve-ei": "Salve amulet(ei)",
  "fury": "Amulet of fury",
  // Ammo
  "ruby-bolts-e": "Ruby dragon bolts (e)",
  "diamond-bolts-e": "Diamond dragon bolts (e)",
  "dragon-arrows": "Dragon arrow",
  "amethyst-arrows": "Amethyst arrow",
  "rune-arrows": "Rune arrow",
  "amethyst-darts": "Amethyst dart",
  "dragon-darts": "Dragon dart",
  "dragon-javelin": "Dragon javelin",
  // Hands
  "ferocious": "Ferocious gloves",
  "zaryte-vambs": "Zaryte vambraces",
  "barrows-gloves": "Barrows gloves",
  "tormented": "Tormented bracelet",
  // Feet
  "primordial": "Primordial boots",
  "pegasian": "Pegasian boots",
  "eternal": "Eternal boots",
  "dragon-boots": "Dragon boots",
  // Ring
  "ultor": "Ultor ring",
  "venator": "Venator ring",
  "magus": "Magus ring",
  "bellator": "Bellator ring",
  "berserker-i": "Berserker ring (i)",
  "archers-i": "Archers ring (i)",
  "seers-i": "Seers ring (i)",
  // Echo items (DP league)
  "echo-vs-helm": "V's helm",
  "echo-kings-barrage": "King's barrage",
  "echo-tecpatl": "Infernal tecpatl",
  "echo-fang-hound": "Fang of the hound",
  "echo-shadowflame": "Shadowflame quadrant",
  "echo-natures-recurve": "Nature's recurve",
  "echo-devils-element": "Devil's element",
  "echo-crystal-blessing": "Crystal blessing",
  "echo-lithic-sceptre": "Lithic sceptre",
  "echo-drygore-blowpipe": "Drygore blowpipe",
};

// ── Passive effects (human-readable, used for display + DPS engine logic) ──
const PASSIVES: Record<string, string> = {
  "scythe": "Hits up to 3 times based on target size: 100%/50%/25% max hit",
  "shadow": "Triples magic attack + magic damage % from all equipment",
  "tbow": "Accuracy/damage scale with target magic level (cap 250)",
  "fang": "Double accuracy roll, min hit = floor(max×3/20)",
  "bowfa": "Crystal armour synergy: +15% acc, +15% dmg with full set",
  "arclight": "+70% accuracy and damage vs demons",
  "dhl": "+20% accuracy and damage vs dragons",
  "dhcb": "+30% accuracy, +25% damage vs dragons",
  "keris-breaching": "+33% damage vs kalphites, 1/51 triple-damage proc",
  "blowpipe": "Uses darts as ammo, adds dart ranged str",
  "sang": "Powered staff (max = magic/3 - 1), 1/6 heal",
  "trident-swamp": "Built-in spell (max hit scales with magic), venom",
  "kodai": "Autocast ancient magicks, 15% rune saving, unlimited water runes",
  "nightmare-staff": "Accepts orbs for enhanced attacks",
  "harm-staff": "Standard spells cast at 4t instead of 5t",
  "slayer-helm-i": "Melee: +16.67% acc & dmg. Ranged/Magic: +15% acc & dmg. On task only.",
  "crystal-helm": "+5% ranged acc, +2.5% ranged dmg with Bow of Faerdhinen",
  "crystal-body": "+15% ranged acc, +7.5% ranged dmg with Bow of Faerdhinen",
  "crystal-legs": "+10% ranged acc, +5% ranged dmg with Bow of Faerdhinen",
  "blood-fury": "20% chance to heal 30% of melee damage dealt",
  "salve-ei": "+20% accuracy and damage vs undead (all styles)",
  "ruby-bolts-e": "Blood Forfeit: 6% chance to hit 20% of target's remaining HP",
  "diamond-bolts-e": "Armour Piercing: 10% chance to ignore ranged defence",
  "craws-bow": "+50% accuracy and damage in wilderness",
  "webweaver-bow": "+50% accuracy and damage in wilderness",
  "viggoras-chainmace": "+50% accuracy and damage in wilderness",
  "ursine-chainmace": "+50% accuracy and damage in wilderness",
  "thammarons-sceptre": "+100% magic accuracy, +25% magic damage in wilderness",
  "accursed-sceptre": "+100% magic accuracy, +25% magic damage in wilderness",
  // Echo items
  "echo-vs-helm": "Acts as Slayer Helmet (i) for all styles. 5% damage redirected to 0",
  "echo-kings-barrage": "Fires 2 bolts per attack (each at halved max hit). Freezes target",
  "echo-tecpatl": "Hits twice per attack. 10% bonus damage to demons",
  "echo-fang-hound": "5% chance to proc Flames of Cerberus (bonus fire hit)",
  "echo-shadowflame": "40% bonus damage on spells. Provides infinite runes for all spellbooks",
  "echo-natures-recurve": "50% chance to heal 10% of damage dealt",
  "echo-devils-element": "+30% damage on elemental weakness spells",
  "echo-crystal-blessing": "Crystal armour set bonuses apply to melee and magic as well as ranged",
  "echo-lithic-sceptre": "Powered staff. Shatter stacks: each hit adds a stack, increasing damage",
  "echo-drygore-blowpipe": "Double accuracy roll. 25% chance to apply burn (3-tick fire DoT)",
};

// ── Region mapping (DP league region locks) ──
const REGIONS: Record<string, string> = {
  // Asgarnia — GWD, Nex, Corp, Cerberus
  "torva-helm": "asgarnia", "torva-body": "asgarnia", "torva-legs": "asgarnia",
  "bcp": "asgarnia", "tassets": "asgarnia",
  "armadyl-helm": "asgarnia", "armadyl-body": "asgarnia", "armadyl-skirt": "asgarnia",
  "virtus-mask": "asgarnia", "virtus-top": "asgarnia", "virtus-bottom": "asgarnia",
  "sgs": "asgarnia", "zgs": "asgarnia",
  "zcb": "asgarnia", "acb": "asgarnia",
  "zaryte-vambs": "asgarnia",
  "echo-fang-hound": "asgarnia",
  // Morytania — ToB, Barrows, Nightmare
  "scythe": "morytania", "rapier": "morytania", "avernic": "morytania",
  "sang": "morytania",
  "inq-mace": "morytania", "inq-helm": "morytania", "inq-body": "morytania", "inq-legs": "morytania",
  "nightmare-staff": "morytania", "harm-staff": "morytania",
  "echo-lithic-sceptre": "morytania",
  // Kourend — CoX
  "tbow": "kourend", "kodai": "kourend",
  "ancestral-hat": "kourend", "ancestral-top": "kourend", "ancestral-bottom": "kourend",
  "twisted-buckler": "kourend", "book-of-dead": "kourend",
  "echo-natures-recurve": "kourend",
  // Desert — ToA, DKS rings
  "shadow": "desert", "fang": "desert",
  "masori-mask": "desert", "masori-body": "desert", "masori-chaps": "desert",
  "elidinis-ward": "desert",
  "keris-breaching": "desert",
  "ultor": "desert", "venator": "desert", "magus": "desert", "bellator": "desert",
  "echo-drygore-blowpipe": "desert",
  // Tirannwn — Gauntlet, Crystal
  "bowfa": "tirannwn", "saeldor": "tirannwn",
  "crystal-helm": "tirannwn", "crystal-body": "tirannwn", "crystal-legs": "tirannwn",
  "crystal-halberd": "tirannwn",
  "echo-crystal-blessing": "tirannwn",
  // Fremennik — DKS, Vorkath
  "neit-helm": "fremennik",
  "echo-vs-helm": "fremennik",
  // Wilderness — Rev weapons
  "craws-bow": "wilderness", "webweaver-bow": "wilderness",
  "viggoras-chainmace": "wilderness", "ursine-chainmace": "wilderness",
  "thammarons-sceptre": "wilderness", "accursed-sceptre": "wilderness",
  "echo-kings-barrage": "wilderness",
  // Varlamore
  "eclipse-atlatl": "varlamore",
  "echo-tecpatl": "varlamore",
  // Kandarin
  "echo-shadowflame": "kandarin",
  "echo-devils-element": "kandarin",
};

// ── Stat overrides (wiki (i) variants differ from base DB data) ──
const STAT_OVERRIDES: Record<string, Partial<EquipmentBonuses>> = {
  "slayer-helm-i": { mstr: 3, rstr: 3, mdmg: 3 },
};

// ── Attack speed overrides (wiki DB may not reflect effective speed) ──
const ATTACK_SPEED_OVERRIDES: Record<string, number> = {
  "harm-staff": 4, // Harmonised orb: standard spells cast at 4t instead of 5t
};

// ── Weapon category overrides (for items whose wiki category doesn't map well) ──
const WEAPON_CAT_OVERRIDES: Record<string, WeaponCategory> = {
  "eclipse-atlatl": "thrown",
  "echo-tecpatl": "2h-melee",
  "echo-fang-hound": "1h-light",
  "echo-shadowflame": "staff",
  "echo-natures-recurve": "bow",
  "echo-kings-barrage": "crossbow",
  "echo-lithic-sceptre": "powered-staff",
  "echo-drygore-blowpipe": "blowpipe",
};

// ── Manual items not in wiki data ──
const Z: EquipmentBonuses = { astab: 0, aslash: 0, acrush: 0, aranged: 0, amagic: 0, dstab: 0, dslash: 0, dcrush: 0, dranged: 0, dmagic: 0, mstr: 0, rstr: 0, mdmg: 0, prayer: 0 };

const MANUAL_ITEMS: Item[] = [
  // Atlatl Dart — wiki has 0 rstr but it provides +55 ranged str as ammo for Eclipse Atlatl
  { id: "atlatl-dart", name: "Atlatl Dart", slot: "ammo",
    bonuses: { ...Z, rstr: 55 },
    region: "varlamore" },
  // Masori Assembler Max Cape — not in wiki (custom combined item)
  { id: "ma2-cape-range", name: "Masori Assembler Max Cape", slot: "cape",
    bonuses: { ...Z, aranged: 10, dstab: 3, dslash: 3, dcrush: 3, dranged: 5, rstr: 2, prayer: 4 } },

  // ── Echo items (DP league — not in wiki equipment DB) ──
  { id: "echo-vs-helm", name: "V's helm", slot: "head",
    bonuses: { ...Z, amagic: 8, aranged: 12, mstr: 8, rstr: 2, mdmg: 3 },
    region: "fremennik",
    passive: PASSIVES["echo-vs-helm"] },
  { id: "echo-kings-barrage", name: "King's barrage", slot: "weapon",
    bonuses: { ...Z, aranged: 130, rstr: 14 },
    isTwoHanded: true, weaponCategory: "crossbow", attackSpeed: 6,
    combatStyle: "ranged", attackType: "ranged",
    region: "wilderness",
    passive: PASSIVES["echo-kings-barrage"] },
  { id: "echo-tecpatl", name: "Infernal tecpatl", slot: "weapon",
    bonuses: { ...Z, astab: 72, aslash: 72, acrush: 72, mstr: 70 },
    isTwoHanded: true, weaponCategory: "2h-melee", attackSpeed: 4,
    combatStyle: "melee", attackType: "slash",
    region: "varlamore",
    passive: PASSIVES["echo-tecpatl"] },
  { id: "echo-fang-hound", name: "Fang of the hound", slot: "weapon",
    bonuses: { ...Z, astab: 60, aslash: 60, mstr: 20 },
    weaponCategory: "1h-light", attackSpeed: 3,
    combatStyle: "melee", attackType: "stab",
    region: "asgarnia",
    passive: PASSIVES["echo-fang-hound"] },
  { id: "echo-shadowflame", name: "Shadowflame quadrant", slot: "weapon",
    bonuses: { ...Z, acrush: 60, amagic: 25, mstr: 50, mdmg: 15 },
    isTwoHanded: true, weaponCategory: "staff", attackSpeed: 5,
    combatStyle: "magic", attackType: "magic",
    region: "kandarin",
    passive: PASSIVES["echo-shadowflame"] },
  { id: "echo-natures-recurve", name: "Nature's recurve", slot: "weapon",
    bonuses: { ...Z, aranged: 95, rstr: 4 },
    isTwoHanded: true, weaponCategory: "bow", attackSpeed: 4,
    combatStyle: "ranged", attackType: "ranged",
    region: "kourend",
    passive: PASSIVES["echo-natures-recurve"] },
  { id: "echo-devils-element", name: "Devil's element", slot: "shield",
    bonuses: { ...Z, amagic: 20, mdmg: 6, prayer: 3 },
    region: "kandarin",
    passive: PASSIVES["echo-devils-element"] },
  { id: "echo-crystal-blessing", name: "Crystal blessing", slot: "ammo",
    bonuses: { ...Z, prayer: 5 },
    region: "tirannwn",
    passive: PASSIVES["echo-crystal-blessing"] },
  { id: "echo-lithic-sceptre", name: "Lithic sceptre", slot: "weapon",
    bonuses: { ...Z, amagic: 25 },
    isTwoHanded: true, weaponCategory: "powered-staff", attackSpeed: 4,
    combatStyle: "magic", attackType: "magic",
    region: "morytania",
    passive: PASSIVES["echo-lithic-sceptre"] },
  { id: "echo-drygore-blowpipe", name: "Drygore blowpipe", slot: "weapon",
    bonuses: { ...Z, aranged: 50, rstr: 10 },
    isTwoHanded: true, weaponCategory: "blowpipe", attackSpeed: 3,
    combatStyle: "ranged", attackType: "ranged",
    region: "desert",
    passive: PASSIVES["echo-drygore-blowpipe"] },
];

// ═══════════════════════════════════════════════════════════════════════
// BUILD ITEM LIST
// ═══════════════════════════════════════════════════════════════════════

// Build reverse lookup: wiki name (lowercase) → our ID
const nameToOurId = new Map<string, string>();
for (const [ourId, wikiName] of Object.entries(ID_OVERRIDES)) {
  nameToOurId.set(wikiName.toLowerCase(), ourId);
}

// Track which IDs we've used (to prevent duplicates)
const usedIds = new Set<string>();

function processItem(raw: RawItem): Item {
  const nameLower = raw.name.toLowerCase();
  const ourId = nameToOurId.get(nameLower);
  const id = ourId ?? raw.id;

  const item: Item = {
    id,
    name: raw.name,
    slot: raw.slot,
    bonuses: raw.bonuses,
  };

  // Weapon fields
  if (raw.slot === "weapon") {
    if (raw.isTwoHanded) item.isTwoHanded = true;
    if (raw.attackSpeed) item.attackSpeed = raw.attackSpeed;
    item.weaponCategory = (ourId && WEAPON_CAT_OVERRIDES[ourId]) || raw.weaponCategory;
    item.combatStyle = raw.combatStyle;
    item.attackType = raw.attackType;
  }

  // Stat overrides
  if (ourId && STAT_OVERRIDES[ourId]) {
    item.bonuses = { ...item.bonuses, ...STAT_OVERRIDES[ourId] };
  }

  // Attack speed overrides
  if (ourId && ATTACK_SPEED_OVERRIDES[ourId]) {
    item.attackSpeed = ATTACK_SPEED_OVERRIDES[ourId];
  }

  // Passive
  if (ourId && PASSIVES[ourId]) {
    item.passive = PASSIVES[ourId];
  }

  // Region
  if (ourId && REGIONS[ourId]) {
    item.region = REGIONS[ourId];
  }

  return item;
}

// Manual items first — hand-curated echo stats win over DB versions
const items: Item[] = [];
for (const item of MANUAL_ITEMS) {
  if (!usedIds.has(item.id)) {
    usedIds.add(item.id);
    items.push(item);
  }
}

// Then process wiki items — ONLY include curated items (those with ID overrides)
// Non-curated items lack region locks and pollute the optimizer with junk
for (const raw of rawItems) {
  const nameLower = raw.name.toLowerCase();
  if (!nameToOurId.has(nameLower)) continue; // skip non-curated items
  const item = processItem(raw);
  if (!usedIds.has(item.id)) {
    usedIds.add(item.id);
    items.push(item);
  }
}

export const ITEMS: Item[] = items;

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
