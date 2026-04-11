import type {
  DpsContext,
  DpsResult,
  MultiplierStep,
  BuildLoadout,
  EquipmentBonuses,
  PlayerConfig,
  BossPreset,
  Item,
  AttackType,
} from "@/types/dps";
import { getPact } from "@/data/pacts";

// ═══════════════════════════════════════════════════════════════════════
// PUBLIC API
// ═══════════════════════════════════════════════════════════════════════

export function calculateDps(ctx: DpsContext): DpsResult {
  const weapon = ctx.loadout.weapon;
  const speed = getAttackSpeed(ctx);
  const interval = speed * 0.6;

  const totalBonuses = sumEquipmentBonuses(ctx.loadout);
  const equipStr = getEquipmentStrength(ctx, totalBonuses);
  const effStrLevel = calculateEffectiveStrengthLevel(ctx);
  const baseMax = calculateBaseMaxHit(ctx, effStrLevel, equipStr, weapon);

  const chain = getMultiplierChain(ctx, baseMax);
  let finalMax = baseMax;
  for (const step of chain) {
    finalMax = Math.floor(finalMax * step.factor);
  }

  // Apply flat max hit modifiers (F8 powered staff -8, H4 +5)
  finalMax += getFlatMaxHitMod(ctx);
  if (finalMax < 0) finalMax = 0;

  const atkRoll = calculateAttackRoll(ctx, totalBonuses);
  const defRoll = calculateDefenceRoll(ctx.target, getAttackType(ctx));
  const baseAcc = standardAccuracy(atkRoll, defRoll);

  // Double accuracy roll (N7 crossbow, Fang, Drygore)
  const finalAcc = applyDoubleRoll(ctx, baseAcc);

  // Base DPS
  let baseDps: number;
  const alwaysMax = hasModifier(ctx, "always-max");
  if (alwaysMax) {
    baseDps = (finalMax * finalAcc) / interval;
  } else if (weapon?.id === "fang") {
    // Fang min-hit mechanic: min hit = floor(maxHit * 3/20) = 15% of reduced max
    // Wiki calc: shrink = trunc(max * 3/20), min = shrink, max = max - shrink
    const fangMin = Math.trunc(finalMax * 3 / 20);
    baseDps = ((finalMax + fangMin) / 2 * finalAcc) / interval;
  } else {
    baseDps = ((finalMax / 2) * finalAcc) / interval;
  }

  // Bonus DPS from D2 (light +40% bonus hit), D3 (heavy 15% blindbag)
  let bonusDps = 0;
  bonusDps += calculateBonusHitDps(ctx, finalMax, finalAcc, interval);
  bonusDps += calculateBlindbagDps(ctx, finalMax, finalAcc, interval);

  // Bolt special effects
  bonusDps += calculateBoltSpecDps(ctx, finalMax, finalAcc, interval);

  // Keris 1/51 triple-damage proc vs kalphites
  if (weapon?.id === "keris-breaching" && ctx.target.isKalphite) {
    // On proc (1/51), hit is tripled. Average bonus = (1/51) * 2 * avgDmg
    const avgDmg = (finalMax / 2) * finalAcc;
    bonusDps += (1 / 51) * 2 * avgDmg / interval;
  }

  // Flask of Fervour flat DPS
  bonusDps += getFlatDps(ctx);

  // Scythe: 3 independent hits with independent accuracy rolls
  // hit1 = 100% max, hit2 = floor(max/2), hit3 = floor(max/4)
  if (weapon?.id === "scythe") {
    const hit2Max = Math.floor(finalMax / 2);
    const hit3Max = Math.floor(finalMax / 4);
    // Each hit has independent accuracy; base DPS already covers hit1
    baseDps += ((hit2Max / 2) * finalAcc) / interval;
    baseDps += ((hit3Max / 2) * finalAcc) / interval;
  }

  // Double hit weapons (Tecpatl)
  if (weapon?.id === "echo-tecpatl") {
    baseDps *= 2;
  }

  // Echo cascade DPS
  const echoDps = calculateEchoDps(ctx, baseDps + bonusDps);

  const totalDps = baseDps + bonusDps + echoDps;

  return {
    dps: totalDps,
    maxHit: finalMax,
    accuracy: finalAcc,
    speed,
    echoDps,
    breakdown: {
      effectiveLevel: effStrLevel,
      equipmentStrength: equipStr,
      baseMaxHit: baseMax,
      multiplierChain: chain,
      finalMaxHit: finalMax,
      attackRoll: atkRoll,
      defenceRoll: defRoll,
      baseAccuracy: baseAcc,
      finalAccuracy: finalAcc,
      attackSpeed: speed,
      baseDps,
      echoDps,
      bonusDps,
    },
  };
}

// ═══════════════════════════════════════════════════════════════════════
// EFFECTIVE LEVEL (for Strength / Max Hit)
// Wiki order: base → potion (additive) → prayer (floor) → style + 8 → void (floor)
// ═══════════════════════════════════════════════════════════════════════

export function calculateEffectiveStrengthLevel(ctx: DpsContext): number {
  const { player } = ctx;
  const style = player.combatStyle;

  let base: number;
  switch (style) {
    case "melee": base = player.strength; break;
    case "ranged": base = player.ranged; break;
    case "magic": base = player.magic; break;
  }

  // Step 1: Potion boost (additive to base level)
  base += getPotionStrengthBoost(base, player.potion, style);

  // Step 2: Prayer multiplier (floor after)
  base = Math.floor(base * getPrayerStrengthMultiplier(player));

  // Step 3: Style bonus + 8
  base += getStrengthStyleBonus(player) + 8;

  // Step 4: Void multiplier (floor after)
  if (player.voidSet !== "none") {
    const voidMult = getVoidStrengthMultiplier(player.voidSet, style);
    base = Math.floor(base * voidMult);
  }

  return base;
}

/** Returns the additive boost amount, not the boosted level */
function getPotionStrengthBoost(baseLevel: number, potion: PlayerConfig["potion"], style: string): number {
  switch (potion) {
    case "super-combat":
    case "super-strength":
      if (style === "melee") return 5 + Math.floor(baseLevel * 0.15);
      return 0;
    case "super-attack":
      return 0; // attack only, no strength boost
    case "ranging":
      if (style === "ranged") return 4 + Math.floor(baseLevel * 0.10);
      return 0;
    case "magic":
      if (style === "magic") return 4 + Math.floor(baseLevel * 0.10);
      return 0;
    case "overload":
      // NMZ overload: melee uses super combat formula, ranged/magic use their respective potion formulas
      if (style === "melee") return 5 + Math.floor(baseLevel * 0.15);
      if (style === "ranged") return 4 + Math.floor(baseLevel * 0.10);
      if (style === "magic") return 4 + Math.floor(baseLevel * 0.10);
      return 0;
    case "smelling-salts":
      if (style === "melee" || style === "ranged" || style === "magic") return 11 + Math.floor(baseLevel * 0.16);
      return 0;
    default:
      return 0;
  }
}

function getPrayerStrengthMultiplier(player: PlayerConfig): number {
  switch (player.prayerType) {
    case "piety": return 1.23;
    case "chivalry": return 1.18;
    case "ultimate-strength": return 1.15;
    case "superhuman-strength": return 1.10;
    case "burst-of-strength": return 1.05;
    case "rigour": return 1.23;
    case "eagle-eye": return 1.15;
    case "hawk-eye": return 1.10;
    case "sharp-eye": return 1.05;
    // Magic prayers don't boost damage directly
    case "augury": return 1.0;
    case "mystic-might": return 1.0;
    case "mystic-lore": return 1.0;
    case "mystic-will": return 1.0;
    default: return 1.0;
  }
}

function getStrengthStyleBonus(player: PlayerConfig): number {
  switch (player.attackStyle) {
    case "aggressive": return 3;
    case "controlled": return 1;
    default: return 0; // accurate, rapid, longrange, autocast, defensive
  }
}

function getVoidStrengthMultiplier(voidSet: PlayerConfig["voidSet"], style: string): number {
  if (voidSet === "elite-void") {
    if (style === "ranged") return 1.125; // elite void ranged = 12.5% str
    if (style === "magic") return 1.025;  // elite void mage = 2.5% dmg
    return 1.10; // elite void melee
  }
  // Regular void: melee/ranged = 10%, magic = 0% damage bonus
  if (style === "magic") return 1.0;
  return 1.10;
}

function getPrayerAccuracyMultiplier(player: PlayerConfig): number {
  switch (player.prayerType) {
    case "piety": return 1.20;
    case "chivalry": return 1.15;
    case "rigour": return 1.20;
    case "eagle-eye": return 1.15;
    case "hawk-eye": return 1.10;
    case "sharp-eye": return 1.05;
    case "augury": return 1.25;
    case "mystic-might": return 1.15;
    case "mystic-lore": return 1.10;
    case "mystic-will": return 1.05;
    default: return 1.0;
  }
}

// ═══════════════════════════════════════════════════════════════════════
// EQUIPMENT BONUSES
// ═══════════════════════════════════════════════════════════════════════

export function sumEquipmentBonuses(loadout: BuildLoadout): EquipmentBonuses {
  const total: EquipmentBonuses = {
    astab: 0, aslash: 0, acrush: 0, aranged: 0, amagic: 0,
    dstab: 0, dslash: 0, dcrush: 0, dranged: 0, dmagic: 0,
    mstr: 0, rstr: 0, mdmg: 0, prayer: 0,
  };

  const slots = Object.values(loadout) as (Item | null)[];
  for (const item of slots) {
    if (!item) continue;
    for (const key of Object.keys(total) as (keyof EquipmentBonuses)[]) {
      total[key] += item.bonuses[key];
    }
  }

  return total;
}

function getEquipmentStrength(ctx: DpsContext, bonuses: EquipmentBonuses): number {
  const style = ctx.player.combatStyle;
  let str: number;

  switch (style) {
    case "melee": str = bonuses.mstr; break;
    case "ranged": str = bonuses.rstr; break;
    case "magic": {
      // For Shadow: triple equipment magic damage %
      if (ctx.loadout.weapon?.id === "shadow") {
        str = Math.min(100, bonuses.mdmg * 3);
      } else {
        str = bonuses.mdmg;
      }
      break;
    }
  }

  // G6: +20% of STR level as melee strength
  if (style === "melee" && hasPact(ctx, "G6")) {
    str += Math.floor(ctx.player.strength * 0.20);
  }

  // G7: +50% of Prayer level as melee strength
  if (style === "melee" && hasPact(ctx, "G7")) {
    str += Math.floor(ctx.player.prayer * 0.50);
  }

  return str;
}

// ═══════════════════════════════════════════════════════════════════════
// MAX HIT
// ═══════════════════════════════════════════════════════════════════════

export function calculateBaseMaxHit(
  ctx: DpsContext,
  effectiveLevel: number,
  equipStr: number,
  weapon: Item | null,
): number {
  const style = ctx.player.combatStyle;

  if (style === "magic") {
    // Powered staves: each has a unique base max hit formula using VISIBLE magic level
    if (weapon?.weaponCategory === "powered-staff") {
      const visibleMagic = ctx.player.magic + getPotionStrengthBoost(ctx.player.magic, ctx.player.potion, "magic");
      const baseDmg = getPoweredStaffBaseDamage(weapon.id, visibleMagic);
      // Then apply magic damage % (already tripled for Shadow in getEquipmentStrength)
      return Math.floor(baseDmg * (1 + equipStr / 100));
    }
    // Standard spells: Fire Surge base = 24
    const spellBaseMax = 24;
    return Math.floor(spellBaseMax * (1 + equipStr / 100));
  }

  // Melee and Ranged: floor(0.5 + effLvl * (equipStr + 64) / 640)
  return Math.floor(0.5 + effectiveLevel * (equipStr + 64) / 640);
}

/** Per-staff base max hit from wiki */
function getPoweredStaffBaseDamage(weaponId: string, visibleMagic: number): number {
  switch (weaponId) {
    case "shadow":
      return Math.floor(visibleMagic / 3) + 1;
    case "sang":
    case "echo-lithic-sceptre":
      return Math.floor(visibleMagic / 3) - 1;
    case "trident-swamp":
      return Math.floor(visibleMagic / 3) - 2;
    default:
      return Math.floor(visibleMagic / 3) - 5; // Trident of the Seas default
  }
}

export function calculateMaxHit(ctx: DpsContext): number {
  const weapon = ctx.loadout.weapon;
  const totalBonuses = sumEquipmentBonuses(ctx.loadout);
  const equipStr = getEquipmentStrength(ctx, totalBonuses);
  const effLevel = calculateEffectiveStrengthLevel(ctx);
  const baseMax = calculateBaseMaxHit(ctx, effLevel, equipStr, weapon);

  const chain = getMultiplierChain(ctx, baseMax);
  let finalMax = baseMax;
  for (const step of chain) {
    finalMax = Math.floor(finalMax * step.factor);
  }
  finalMax += getFlatMaxHitMod(ctx);
  return Math.max(0, finalMax);
}

// ═══════════════════════════════════════════════════════════════════════
// MULTIPLIER CHAIN
// Wiki: applied sequentially, floor after each multiplication
// ═══════════════════════════════════════════════════════════════════════

export function getMultiplierChain(ctx: DpsContext, _baseMax: number): MultiplierStep[] {
  const chain: MultiplierStep[] = [];
  const style = ctx.player.combatStyle;
  const weapon = ctx.loadout.weapon;
  const weaponCat = weapon?.weaponCategory;

  // 1. Slayer helm / V's helm / Salve amulet (mutually exclusive — use best)
  // Wiki: slayer helm melee = 7/6 (~16.67%), ranged/magic (imbued) = 1.15 (15%)
  // Salve (ei) = 20% all styles vs undead. Does NOT stack with slayer helm.
  const head = ctx.loadout.head;
  const hasSalve = ctx.loadout.neck?.id === "salve-ei" && ctx.target.isUndead;
  const hasSlayerHelm = ctx.player.onSlayerTask && (head?.id === "slayer-helm-i" || head?.id === "echo-vs-helm");

  if (hasSalve && hasSlayerHelm) {
    // Use whichever is higher: salve 20% vs slayer helm 16.67% (melee) / 15% (ranged/magic)
    // Salve always wins or ties
    chain.push({ name: "Salve (ei) vs Undead", factor: 1.20 });
  } else if (hasSalve) {
    chain.push({ name: "Salve (ei) vs Undead", factor: 1.20 });
  } else if (hasSlayerHelm) {
    if (style === "melee") {
      chain.push({ name: head!.name, factor: 7 / 6 });
    } else {
      chain.push({ name: head!.name, factor: 1.15 });
    }
  }

  // 2. Style % pacts (GA/HA/FA)
  if (style === "melee" && hasPact(ctx, "GA")) {
    chain.push({ name: "Guardian's Aspect", factor: 1.01 });
  }
  if (style === "ranged" && hasPact(ctx, "HA")) {
    chain.push({ name: "Hunter's Aspect", factor: 1.01 });
  }
  if (style === "magic" && hasPact(ctx, "FA")) {
    chain.push({ name: "Forsaken's Aspect", factor: 1.01 });
  }

  // 3. Crossbow +70% (K8)
  if (weaponCat === "crossbow" && hasPact(ctx, "K8")) {
    chain.push({ name: "Crossbow Mastery", factor: 1.70 });
  }

  // 4. Halberd distance (J4: +4% per 3 tiles)
  if (weaponCat === "halberd" && hasPact(ctx, "J4")) {
    const dist = ctx.player.targetDistance ?? 1;
    const bonus = 1 + 0.04 * Math.floor(dist / 3);
    if (bonus > 1) {
      chain.push({ name: "Reaching Strikes", factor: bonus });
    }
  }

  // 5. Twisted Bow passive (scales with target magic level)
  // Wiki calc source: t2 = trunc((3M - factor)/100), t3 = trunc((trunc(3M/10) - 10*factor)^2/100)
  // damage: base=250, factor=14; accuracy uses same formula with base=140, factor=10
  if (weapon?.id === "tbow") {
    const M = Math.min(250, ctx.target.magicLevel);
    const t2 = Math.trunc((3 * M - 14) / 100);
    const t3 = Math.trunc(Math.pow(Math.trunc(3 * M / 10) - 140, 2) / 100);
    const tbowDmg = Math.min(250, Math.max(0, 250 + t2 - t3));
    chain.push({ name: "Twisted Bow", factor: tbowDmg / 100 });
  }

  // 6. Osmumten's Fang: max hit × 0.85
  if (weapon?.id === "fang") {
    chain.push({ name: "Fang 0.85x", factor: 0.85 });
  }

  // 7. Shadowflame 40% bonus spell damage
  if (weapon?.id === "echo-shadowflame") {
    chain.push({ name: "Shadowflame 40%", factor: 1.40 });
  }

  // 8. Arclight vs demons (+70%) — only applies to isDemon targets
  if (weapon?.id === "arclight" && ctx.target.isDemon) {
    chain.push({ name: "Arclight vs Demons", factor: 1.70 });
  }

  // 9. Devil's Element elemental weakness (+30%)
  if (ctx.loadout.shield?.id === "echo-devils-element" && ctx.target.elementalWeakness === "magic") {
    chain.push({ name: "Devil's Element", factor: 1.30 });
  }

  // 10. Dragon Hunter Crossbow vs dragons (+25% dmg)
  if (weapon?.id === "dhcb" && ctx.target.isDragon) {
    chain.push({ name: "DHCB vs Dragons", factor: 1.25 });
  }

  // 11. Dragon Hunter Lance vs dragons (+20% dmg)
  if (weapon?.id === "dhl" && ctx.target.isDragon) {
    chain.push({ name: "DHL vs Dragons", factor: 1.20 });
  }

  // 12. Wilderness weapons (+50% dmg when target is in wilderness)
  const wildernessWeapons = ["craws-bow", "webweaver-bow", "viggoras-chainmace", "ursine-chainmace"];
  if (weapon && wildernessWeapons.includes(weapon.id) && ctx.target.region === "wilderness") {
    chain.push({ name: `${weapon.name} (Wilderness)`, factor: 1.50 });
  }

  // 13. Wilderness sceptres (+25% magic dmg in wilderness)
  const wildernessSceptres = ["thammarons-sceptre", "accursed-sceptre"];
  if (weapon && wildernessSceptres.includes(weapon.id) && ctx.target.region === "wilderness") {
    chain.push({ name: `${weapon.name} (Wilderness)`, factor: 1.25 });
  }

  // 14. Keris Partisan vs kalphites (+33% dmg)
  if (weapon?.id === "keris-breaching" && ctx.target.isKalphite) {
    chain.push({ name: "Keris vs Kalphites", factor: 4 / 3 });
  }

  // 15. Crystal armour set bonus with Bow of Faerdhinen
  // Per piece: helm +2.5%, body +7.5%, legs +5%. Total +15% with full set.
  if (weapon?.id === "bowfa") {
    let crystalDmg = 0;
    if (ctx.loadout.head?.id === "crystal-helm") crystalDmg += 0.025;
    if (ctx.loadout.body?.id === "crystal-body") crystalDmg += 0.075;
    if (ctx.loadout.legs?.id === "crystal-legs") crystalDmg += 0.05;
    if (crystalDmg > 0) {
      chain.push({ name: "Crystal Armour", factor: 1 + crystalDmg });
    }
  }

  // 16. Inquisitor's armour set bonus (crush weapons only)
  // +0.5% per piece, +2.5% bonus for full set (total 4% with 3 pieces)
  if (style === "melee" && getAttackType(ctx) === "crush") {
    let inqPieces = 0;
    if (ctx.loadout.head?.id === "inq-helm") inqPieces++;
    if (ctx.loadout.body?.id === "inq-body") inqPieces++;
    if (ctx.loadout.legs?.id === "inq-legs") inqPieces++;
    if (inqPieces > 0) {
      const inqBonus = inqPieces * 0.005 + (inqPieces === 3 ? 0.025 : 0);
      chain.push({ name: `Inquisitor's (${inqPieces}pc)`, factor: 1 + inqBonus });
    }
  }

  return chain;
}

// ═══════════════════════════════════════════════════════════════════════
// ACCURACY
// ═══════════════════════════════════════════════════════════════════════

export function calculateAttackRoll(ctx: DpsContext, bonuses: EquipmentBonuses): number {
  const style = ctx.player.combatStyle;
  const weapon = ctx.loadout.weapon;

  // Calculate effective attack level
  let base: number;
  switch (style) {
    case "melee": base = ctx.player.attack; break;
    case "ranged": base = ctx.player.ranged; break;
    case "magic": base = ctx.player.magic; break;
  }

  // Step 1: Potion boost
  base += getPotionAttackBoost(base, ctx.player.potion, style);

  // Step 2: Prayer
  base = Math.floor(base * getPrayerAccuracyMultiplier(ctx.player));

  // Step 3: Style + 8
  base += getAccuracyStyleBonus(ctx.player) + 8;

  // Step 4: Void accuracy (magic = 45%, melee/ranged = 10%)
  if (ctx.player.voidSet !== "none") {
    const voidAccMult = style === "magic" ? 1.45 : 1.10;
    base = Math.floor(base * voidAccMult);
  }

  // Get equipment attack bonus for the attack type
  let equipAtk: number;
  const atkType = getAttackType(ctx);
  switch (atkType) {
    case "stab": equipAtk = bonuses.astab; break;
    case "slash": equipAtk = bonuses.aslash; break;
    case "crush": equipAtk = bonuses.acrush; break;
    case "ranged": equipAtk = bonuses.aranged; break;
    case "magic": equipAtk = bonuses.amagic; break;
  }

  // Shadow triples magic attack from equipment
  if (weapon?.id === "shadow" && style === "magic") {
    equipAtk = bonuses.amagic * 3;
  }

  let roll = base * (equipAtk + 64);

  // Slayer helm / Salve amulet accuracy (mutually exclusive — use best)
  {
    const head = ctx.loadout.head;
    const hasSalve = ctx.loadout.neck?.id === "salve-ei" && ctx.target.isUndead;
    const hasSlayerHelm = ctx.player.onSlayerTask && (head?.id === "slayer-helm-i" || head?.id === "echo-vs-helm");

    if (hasSalve && hasSlayerHelm) {
      // Salve 20% always >= slayer helm (16.67% melee, 15% ranged/magic)
      roll = Math.floor(roll * 1.20);
    } else if (hasSalve) {
      roll = Math.floor(roll * 1.20);
    } else if (hasSlayerHelm) {
      if (style === "melee") {
        roll = Math.floor(roll * (7 / 6));
      } else {
        roll = Math.floor(roll * 1.15);
      }
    }
  }

  // Pact accuracy bonuses
  const pactAccBonus = getPactAccuracyBonus(ctx);
  if (pactAccBonus > 0) {
    roll = Math.floor(roll * (1 + pactAccBonus / 100));
  }

  // Twisted Bow accuracy scaling
  // Wiki calc source: t2 = trunc((3M - 10)/100), t3 = trunc((trunc(3M/10) - 100)^2/100)
  if (weapon?.id === "tbow") {
    const M = Math.min(250, ctx.target.magicLevel);
    const t2 = Math.trunc((3 * M - 10) / 100);
    const t3 = Math.trunc(Math.pow(Math.trunc(3 * M / 10) - 100, 2) / 100);
    const tbowAcc = Math.min(140, Math.max(0, 140 + t2 - t3));
    roll = Math.floor(roll * tbowAcc / 100);
  }

  // Arclight accuracy vs demons — only applies to isDemon targets
  if (weapon?.id === "arclight" && ctx.target.isDemon) {
    roll = Math.floor(roll * 1.70);
  }

  // Dragon Hunter Crossbow accuracy vs dragons (+30%)
  if (weapon?.id === "dhcb" && ctx.target.isDragon) {
    roll = Math.floor(roll * 1.30);
  }

  // Dragon Hunter Lance accuracy vs dragons (+20%)
  if (weapon?.id === "dhl" && ctx.target.isDragon) {
    roll = Math.floor(roll * 1.20);
  }

  // Wilderness weapon accuracy (+50% melee/ranged, +100% magic)
  const wildernessWeapons = ["craws-bow", "webweaver-bow", "viggoras-chainmace", "ursine-chainmace"];
  if (weapon && wildernessWeapons.includes(weapon.id) && ctx.target.region === "wilderness") {
    roll = Math.floor(roll * 1.50);
  }
  const wildernessSceptres = ["thammarons-sceptre", "accursed-sceptre"];
  if (weapon && wildernessSceptres.includes(weapon.id) && ctx.target.region === "wilderness") {
    roll = Math.floor(roll * 2.0); // +100% magic accuracy
  }

  // Crystal armour set accuracy bonus with Bow of Faerdhinen
  // Per piece: helm +5%, body +15%, legs +10%. Total +30% with full set.
  if (weapon?.id === "bowfa") {
    let crystalAcc = 0;
    if (ctx.loadout.head?.id === "crystal-helm") crystalAcc += 0.05;
    if (ctx.loadout.body?.id === "crystal-body") crystalAcc += 0.15;
    if (ctx.loadout.legs?.id === "crystal-legs") crystalAcc += 0.10;
    if (crystalAcc > 0) {
      roll = Math.floor(roll * (1 + crystalAcc));
    }
  }

  // Inquisitor's armour accuracy bonus (crush weapons only)
  // +0.5% per piece, +2.5% bonus for full set (total 4%)
  if (style === "melee" && atkType === "crush") {
    let inqPieces = 0;
    if (ctx.loadout.head?.id === "inq-helm") inqPieces++;
    if (ctx.loadout.body?.id === "inq-body") inqPieces++;
    if (ctx.loadout.legs?.id === "inq-legs") inqPieces++;
    if (inqPieces > 0) {
      const inqBonus = inqPieces * 0.005 + (inqPieces === 3 ? 0.025 : 0);
      roll = Math.floor(roll * (1 + inqBonus));
    }
  }

  return roll;
}

function getPotionAttackBoost(baseLevel: number, potion: PlayerConfig["potion"], style: string): number {
  switch (potion) {
    case "super-combat":
    case "super-attack":
      if (style === "melee") return 5 + Math.floor(baseLevel * 0.15);
      return 0;
    case "ranging":
      if (style === "ranged") return 4 + Math.floor(baseLevel * 0.10);
      return 0;
    case "magic":
      if (style === "magic") return 4 + Math.floor(baseLevel * 0.10);
      return 0;
    case "overload":
      // NMZ overload: melee uses super attack formula, ranged/magic use their respective formulas
      if (style === "melee") return 5 + Math.floor(baseLevel * 0.15);
      if (style === "ranged") return 4 + Math.floor(baseLevel * 0.10);
      if (style === "magic") return 4 + Math.floor(baseLevel * 0.10);
      return 0;
    case "smelling-salts":
      return 11 + Math.floor(baseLevel * 0.16);
    default:
      return 0;
  }
}

function getAccuracyStyleBonus(player: PlayerConfig): number {
  switch (player.attackStyle) {
    case "accurate": return 3;
    case "controlled": return 1;
    default: return 0;
  }
}

export function calculateDefenceRoll(target: BossPreset, attackType: AttackType): number {
  // Magic attacks: defence roll uses target's magic level (not defence level)
  const defLevel = attackType === "magic" ? target.magicLevel : target.defenceLevel;

  let defBonus: number;
  switch (attackType) {
    case "stab": defBonus = target.dstab; break;
    case "slash": defBonus = target.dslash; break;
    case "crush": defBonus = target.dcrush; break;
    case "ranged": defBonus = target.dranged; break;
    case "magic": defBonus = target.dmagic; break;
  }

  return (defLevel + 9) * (defBonus + 64);
}

export function calculateAccuracy(ctx: DpsContext): number {
  const totalBonuses = sumEquipmentBonuses(ctx.loadout);
  const atkRoll = calculateAttackRoll(ctx, totalBonuses);
  const defRoll = calculateDefenceRoll(ctx.target, getAttackType(ctx));
  const baseAcc = standardAccuracy(atkRoll, defRoll);
  return applyDoubleRoll(ctx, baseAcc);
}

function standardAccuracy(attackRoll: number, defenceRoll: number): number {
  if (attackRoll > defenceRoll) {
    return 1 - (defenceRoll + 2) / (2 * (attackRoll + 1));
  } else {
    return attackRoll / (2 * (defenceRoll + 1));
  }
}

function applyDoubleRoll(ctx: DpsContext, baseAcc: number): number {
  const weapon = ctx.loadout.weapon;
  const weaponCat = weapon?.weaponCategory;

  // N7: crossbow double roll
  if (weaponCat === "crossbow" && hasPact(ctx, "N7")) {
    return 1 - (1 - baseAcc) * (1 - baseAcc);
  }

  // Osmumten's Fang: double accuracy roll
  if (weapon?.id === "fang") {
    return 1 - (1 - baseAcc) * (1 - baseAcc);
  }

  // Drygore Blowpipe double roll
  if (weapon?.id === "echo-drygore-blowpipe") {
    return 1 - (1 - baseAcc) * (1 - baseAcc);
  }

  return baseAcc;
}

// ═══════════════════════════════════════════════════════════════════════
// ATTACK SPEED
// ═══════════════════════════════════════════════════════════════════════

function getAttackSpeed(ctx: DpsContext): number {
  const weapon = ctx.loadout.weapon;
  let speed = weapon?.attackSpeed ?? 4;

  // Rapid style: -1 tick for ranged
  if (ctx.player.attackStyle === "rapid" && ctx.player.combatStyle === "ranged") {
    speed -= 1;
  }

  const weaponCat = weapon?.weaponCategory;

  // F7: spell -2t
  if (weaponCat === "staff" && hasPact(ctx, "F7")) {
    speed -= 2;
  }

  // F8: powered staff -3t
  if (weaponCat === "powered-staff" && hasPact(ctx, "F8")) {
    speed -= 3;
  }

  // J2: light melee -1t
  if (weaponCat === "1h-light" && hasPact(ctx, "J2")) {
    speed -= 1;
  }

  // K4: bow -1t
  if (weaponCat === "bow" && hasPact(ctx, "K4")) {
    speed -= 1;
  }

  // K8: crossbow -2t
  if (weaponCat === "crossbow" && hasPact(ctx, "K8")) {
    speed -= 2;
  }

  return Math.max(1, speed);
}

// ═══════════════════════════════════════════════════════════════════════
// ECHO CASCADE
// ═══════════════════════════════════════════════════════════════════════

function calculateEchoDps(ctx: DpsContext, baseDps: number): number {
  let echoRate = 0;

  if (ctx.player.combatStyle === "ranged" && hasPact(ctx, "B2")) {
    echoRate += 0.25;
  }
  if (hasPact(ctx, "K10")) {
    echoRate += 0.05;
  }
  if (ctx.loadout.weapon?.weaponCategory === "crossbow" && hasPact(ctx, "E2")) {
    echoRate += 0.15;
  }

  if (echoRate <= 0) return 0;

  if (hasPact(ctx, "K3")) {
    const p = echoRate;
    const cascadeMult = 1 + p / 2 + p / 4 + p / 8;
    return baseDps * p * cascadeMult;
  }

  if (ctx.loadout.weapon?.weaponCategory === "bow" && hasPact(ctx, "E1")) {
    return baseDps * echoRate;
  }

  return baseDps * echoRate;
}

// ═══════════════════════════════════════════════════════════════════════
// BONUS HITS (D2, D3)
// ═══════════════════════════════════════════════════════════════════════

function calculateBonusHitDps(ctx: DpsContext, maxHit: number, accuracy: number, interval: number): number {
  if (!hasPact(ctx, "D2")) return 0;
  if (ctx.loadout.weapon?.weaponCategory !== "1h-light") return 0;
  const bonusMax = Math.floor(maxHit * 0.40);
  return (bonusMax / 2 * accuracy) / interval;
}

function calculateBlindbagDps(ctx: DpsContext, maxHit: number, accuracy: number, interval: number): number {
  if (!hasPact(ctx, "D3")) return 0;
  if (ctx.loadout.weapon?.weaponCategory !== "1h-heavy") return 0;
  return 0.15 * (maxHit * accuracy) / interval;
}

function calculateBoltSpecDps(ctx: DpsContext, maxHit: number, accuracy: number, interval: number): number {
  const ammo = ctx.loadout.ammo;
  if (!ammo) return 0;
  const weaponCat = ctx.loadout.weapon?.weaponCategory;
  if (weaponCat !== "crossbow") return 0;

  // Ruby Dragon Bolts (e): 6% proc, deals min(100, 20% of target HP) as flat damage
  if (ammo.id === "ruby-bolts-e") {
    const procDmg = Math.min(100, Math.floor(ctx.target.hp * 0.20));
    // On proc: flat damage replaces normal hit. Bonus DPS = proc chance * (procDmg - normalAvg)
    const normalAvg = maxHit / 2;
    const boltBonus = 0.06 * accuracy * (procDmg - normalAvg);
    return Math.max(0, boltBonus) / interval;
  }

  // Diamond Dragon Bolts (e): 10% proc, ignores ranged defence (acc ≈ 1.0)
  if (ammo.id === "diamond-bolts-e") {
    // Effective accuracy = 0.10 * 1.0 + 0.90 * normalAcc
    const boostedAcc = 0.10 + 0.90 * accuracy;
    // Bonus from increased accuracy
    const normalDps = (maxHit / 2 * accuracy) / interval;
    const boostedDps = (maxHit / 2 * boostedAcc) / interval;
    return boostedDps - normalDps;
  }

  return 0;
}

// ═══════════════════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════════════════

function getAttackType(ctx: DpsContext): AttackType {
  return ctx.loadout.weapon?.attackType ?? (ctx.player.combatStyle === "ranged" ? "ranged" : ctx.player.combatStyle === "magic" ? "magic" : "slash");
}

function hasPact(ctx: DpsContext, pactId: string): boolean {
  return ctx.player.activePacts.includes(pactId);
}

function hasModifier(ctx: DpsContext, type: string): boolean {
  for (const pactId of ctx.player.activePacts) {
    const pact = getPact(pactId);
    if (!pact) continue;
    for (const mod of pact.modifiers) {
      if (mod.type === type) {
        if (mod.condition) {
          const weaponCat = ctx.loadout.weapon?.weaponCategory;
          if (mod.condition !== weaponCat) continue;
        }
        return true;
      }
    }
  }
  return false;
}

function getPactAccuracyBonus(ctx: DpsContext): number {
  let bonus = 0;
  if (hasPact(ctx, "CA")) bonus += 15;
  if (hasPact(ctx, "F1")) bonus += 35;
  if (hasPact(ctx, "H1")) {
    const dist = ctx.player.targetDistance ?? 1;
    bonus += 5 + 5 * dist;
  }
  return bonus;
}

function getFlatMaxHitMod(ctx: DpsContext): number {
  let mod = 0;
  if (ctx.player.combatStyle === "melee" && hasPact(ctx, "H4")) {
    mod += 5;
  }
  if (ctx.loadout.weapon?.weaponCategory === "powered-staff" && hasPact(ctx, "F8")) {
    mod -= 8;
  }
  return mod;
}

function getFlatDps(ctx: DpsContext): number {
  if (hasPact(ctx, "FLASK")) return 1.5;
  return 0;
}
