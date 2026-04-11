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
import { aggregatePactEffects, type AggregatedPactEffects } from "@/lib/pact-effects";

// ═══════════════════════════════════════════════════════════════════════
// PUBLIC API
// ═══════════════════════════════════════════════════════════════════════

export function calculateDps(ctx: DpsContext): DpsResult {
  if (process.env.NODE_ENV !== "production") {
    const p = ctx.player;
    if (p.potion === "auto" || p.prayerType === "auto" || p.attackStyle === "auto" || p.voidSet === "auto") {
      throw new Error("calculateDps received unresolved 'auto' values — resolve before calling");
    }
  }

  // Lazily compute aggregated pact effects
  ctx.pactEffects ??= aggregatePactEffects(ctx.player.activePacts);
  const pe = ctx.pactEffects;

  const weapon = ctx.loadout.weapon;
  const speed = getAttackSpeed(ctx, pe);
  const interval = speed * 0.6;

  const totalBonuses = sumEquipmentBonuses(ctx.loadout);

  // Apply off-hand stat boost pact
  applyOffhandStatBoost(ctx, pe, totalBonuses);

  const equipStr = getEquipmentStrength(ctx, pe, totalBonuses);
  const effStrLevel = calculateEffectiveStrengthLevel(ctx, pe);
  const baseMax = calculateBaseMaxHit(ctx, effStrLevel, equipStr, weapon);

  const chain = getMultiplierChain(ctx, pe, baseMax);
  let finalMax = baseMax;
  for (const step of chain) {
    finalMax = Math.floor(finalMax * step.factor);
  }

  // Apply flat max hit modifiers (powered staff speed pact -8 for 1H)
  finalMax += getFlatMaxHitMod(ctx, pe);
  if (finalMax < 0) finalMax = 0;

  const atkRoll = calculateAttackRoll(ctx, pe, totalBonuses);
  const defRoll = calculateDefenceRoll(ctx.target, getAttackType(ctx));
  const baseAcc = standardAccuracy(atkRoll, defRoll);

  // Store rolls for Fang exact formula
  ctx._fangAtkRoll = atkRoll;
  ctx._fangDefRoll = defRoll;

  // Double accuracy roll (crossbow pact, Fang, Drygore)
  let finalAcc = applyDoubleRoll(ctx, pe, baseAcc);

  // Max accuracy roll from range pact: proc chance of min(1, 0.05 * distance)
  if (pe.maxAccuracyRollFromRange) {
    const dist = ctx.player.targetDistance ?? 1;
    const procChance = Math.min(1, 0.05 * dist);
    // Effective accuracy: procChance * 1.0 + (1-procChance) * finalAcc
    finalAcc = procChance + (1 - procChance) * finalAcc;
  }

  // Base DPS
  let baseDps: number;
  const alwaysMax = pe.crossbowMaxHit && weapon?.weaponCategory === "crossbow";
  if (alwaysMax) {
    baseDps = (finalMax * finalAcc) / interval;
  } else if (weapon?.id === "fang") {
    const fangMin = Math.trunc(finalMax * 3 / 20);
    baseDps = ((finalMax + fangMin) / 2 * finalAcc) / interval;
  } else {
    baseDps = ((finalMax / 2) * finalAcc) / interval;
  }

  // Bonus DPS from light weapon double-hit, heavy weapon blindbag
  let bonusDps = 0;
  bonusDps += calculateBonusHitDps(ctx, pe, finalMax, finalAcc, interval);
  bonusDps += calculateBlindbagDps(ctx, pe, finalMax, finalAcc, interval);

  // Bolt special effects
  bonusDps += calculateBoltSpecDps(ctx, finalMax, finalAcc, interval);

  // Keris 1/51 triple-damage proc vs kalphites
  if (weapon?.id === "keris-breaching" && ctx.target.isKalphite) {
    const avgDmg = (finalMax / 2) * finalAcc;
    bonusDps += (1 / 51) * 2 * avgDmg / interval;
  }

  // Scythe: multi-hit based on target size
  if (weapon?.id === "scythe") {
    const targetSize = ctx.target.size ?? 3;
    if (targetSize >= 2) {
      const hit2Max = Math.floor(finalMax / 2);
      baseDps += ((hit2Max / 2) * finalAcc) / interval;
    }
    if (targetSize >= 3) {
      const hit3Max = Math.floor(finalMax / 4);
      baseDps += ((hit3Max / 2) * finalAcc) / interval;
    }
  }

  // Infernal Tecpatl: hits twice per attack
  if (weapon?.id === "echo-tecpatl") {
    baseDps *= 2;
  }

  // Fang of the Hound: 5% Flames of Cerberus proc (base max 10, always hits, scales with mdmg%)
  if (weapon?.id === "echo-fang-hound") {
    const fireMax = Math.floor(10 * (1 + totalBonuses.mdmg / 100));
    bonusDps += 0.05 * (fireMax / 2) / interval;
  }

  // 2H melee echo: 5% chance to trigger a ranged echo
  if (pe.twohMeleeEchos && weapon?.weaponCategory === "2h-melee") {
    bonusDps += 0.05 * (baseDps + bonusDps);
  }

  // Echo cascade DPS (ranged echo system)
  const echoDps = calculateEchoDps(ctx, pe, baseDps + bonusDps, finalAcc);

  // Earth spell defence scaling: flat damage per 12 defence levels
  if (pe.earthScaleDefenceStat > 0 && ctx.player.combatStyle === "magic") {
    const flatDmg = Math.floor(ctx.player.defence / pe.earthScaleDefenceStat);
    if (flatDmg > 0) {
      bonusDps += (flatDmg * finalAcc) / interval;
    }
  }

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

export function calculateEffectiveStrengthLevel(ctx: DpsContext, pe?: AggregatedPactEffects): number {
  pe ??= aggregatePactEffects(ctx.player.activePacts);
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
  // Buffed ranged prayers: multiply prayer factor by 1.30
  let prayerMult = getPrayerStrengthMultiplier(player);
  if (pe.buffedRangedPrayers && style === "ranged" && prayerMult > 1) {
    const prayerBonus = prayerMult - 1;
    prayerMult = 1 + prayerBonus * 1.30;
  }
  base = Math.floor(base * prayerMult);

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
    default: return 0;
  }
}

function getVoidStrengthMultiplier(voidSet: PlayerConfig["voidSet"], style: string): number {
  if (voidSet === "elite-void") {
    if (style === "ranged") return 1.125;
    if (style === "magic") return 1.025;
    return 1.10;
  }
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

/** Mutate bonuses to add off-hand stat boost pact */
function applyOffhandStatBoost(ctx: DpsContext, pe: AggregatedPactEffects, bonuses: EquipmentBonuses): void {
  if (!pe.offhandStatBoost) return;
  // Off-hand equipped means shield slot has an item
  if (!ctx.loadout.shield) return;
  bonuses.mstr += 5;
  bonuses.rstr += 5;
  bonuses.mdmg += 2;
}

function getEquipmentStrength(ctx: DpsContext, pe: AggregatedPactEffects, bonuses: EquipmentBonuses): number {
  const style = ctx.player.combatStyle;
  let str: number;

  switch (style) {
    case "melee": str = bonuses.mstr; break;
    case "ranged": str = bonuses.rstr; break;
    case "magic": {
      if (ctx.loadout.weapon?.id === "shadow") {
        str = Math.min(100, bonuses.mdmg * 3);
      } else {
        str = bonuses.mdmg;
      }
      break;
    }
  }

  // Multi-hit str increase: +20% of Strength level for light/1H melee
  if (style === "melee" && pe.multiHitStrIncrease) {
    const weaponCat = ctx.loadout.weapon?.weaponCategory;
    if (weaponCat === "1h-light" || weaponCat === "1h-heavy" || weaponCat === "standard") {
      str += Math.floor(ctx.player.strength * 0.20);
    }
  }

  // Melee prayer str bonus: +50% of worn prayer bonus as melee str
  if (style === "melee" && pe.meleePrayerStrBonus) {
    str += Math.floor(bonuses.prayer * 0.50);
  }

  // Thrown weapon melee str scale: +80% of melee str as ranged str
  if (style === "ranged" && pe.thrownMeleeStrScale && ctx.loadout.weapon?.weaponCategory === "thrown") {
    str += Math.floor(bonuses.mstr * 0.80);
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
    if (weapon?.weaponCategory === "powered-staff") {
      const visibleMagic = ctx.player.magic + getPotionStrengthBoost(ctx.player.magic, ctx.player.potion, "magic");
      const baseDmg = getPoweredStaffBaseDamage(weapon.id, visibleMagic);
      return Math.floor(baseDmg * (1 + equipStr / 100));
    }
    const spellBaseMax = ctx.player.spellMaxHit ?? 24;
    return Math.floor(spellBaseMax * (1 + equipStr / 100));
  }

  return Math.floor(0.5 + effectiveLevel * (equipStr + 64) / 640);
}

function getPoweredStaffBaseDamage(weaponId: string, visibleMagic: number): number {
  switch (weaponId) {
    case "shadow":
      return Math.floor(visibleMagic / 3) + 1;
    case "sang":
      return Math.floor(visibleMagic / 3) - 1;
    case "echo-lithic-sceptre":
      return Math.max(10, Math.floor(visibleMagic / 3) - 10);
    case "trident-swamp":
      return Math.floor(visibleMagic / 3) - 2;
    default:
      return Math.floor(visibleMagic / 3) - 5;
  }
}

export function calculateMaxHit(ctx: DpsContext): number {
  ctx.pactEffects ??= aggregatePactEffects(ctx.player.activePacts);
  const pe = ctx.pactEffects;
  const weapon = ctx.loadout.weapon;
  const totalBonuses = sumEquipmentBonuses(ctx.loadout);
  applyOffhandStatBoost(ctx, pe, totalBonuses);
  const equipStr = getEquipmentStrength(ctx, pe, totalBonuses);
  const effLevel = calculateEffectiveStrengthLevel(ctx, pe);
  const baseMax = calculateBaseMaxHit(ctx, effLevel, equipStr, weapon);

  const chain = getMultiplierChain(ctx, pe, baseMax);
  let finalMax = baseMax;
  for (const step of chain) {
    finalMax = Math.floor(finalMax * step.factor);
  }
  finalMax += getFlatMaxHitMod(ctx, pe);
  return Math.max(0, finalMax);
}

// ═══════════════════════════════════════════════════════════════════════
// MULTIPLIER CHAIN
// ═══════════════════════════════════════════════════════════════════════

export function getMultiplierChain(ctx: DpsContext, pe: AggregatedPactEffects, _baseMax: number): MultiplierStep[] {
  const chain: MultiplierStep[] = [];
  const style = ctx.player.combatStyle;
  const weapon = ctx.loadout.weapon;
  const weaponCat = weapon?.weaponCategory;

  // 1. Slayer helm / Salve amulet (mutually exclusive)
  const head = ctx.loadout.head;
  const hasSalve = ctx.loadout.neck?.id === "salve-ei" && ctx.target.isUndead;
  const hasSlayerHelm = ctx.player.onSlayerTask && (head?.id === "slayer-helm-i" || head?.id === "echo-vs-helm");

  if (hasSalve && hasSlayerHelm) {
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

  // 2. Style % pacts (sum of +1% nodes)
  if (style === "melee" && pe.meleeDamagePercent > 0) {
    chain.push({ name: `Melee Pacts +${pe.meleeDamagePercent}%`, factor: 1 + pe.meleeDamagePercent / 100 });
  }
  if (style === "ranged" && pe.rangedDamagePercent > 0) {
    chain.push({ name: `Ranged Pacts +${pe.rangedDamagePercent}%`, factor: 1 + pe.rangedDamagePercent / 100 });
  }
  if (style === "magic" && pe.magicDamagePercent > 0) {
    chain.push({ name: `Magic Pacts +${pe.magicDamagePercent}%`, factor: 1 + pe.magicDamagePercent / 100 });
  }

  // 3. Crossbow +70% / +2t (crossbow slow big hits pact)
  if (weaponCat === "crossbow" && pe.crossbowSlowBigHits) {
    chain.push({ name: "Crossbow Mastery", factor: 1.70 });
  }

  // 4. Melee distance damage: +4% + 4% per 3 tiles
  if (pe.meleeDistanceDamagePercent > 0 && style === "melee") {
    const dist = ctx.player.targetDistance ?? 1;
    const pct = pe.meleeDistanceDamagePercent;
    const bonus = 1 + (pct * (Math.floor(dist / 3) + 1)) / 100;
    if (bonus > 1) {
      chain.push({ name: "Distance Max Hit", factor: bonus });
    }
  }

  // 5. Twisted Bow passive (scales with target magic level)
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

  // 8. Arclight vs demons (+70%)
  if (weapon?.id === "arclight" && ctx.target.isDemon) {
    chain.push({ name: "Arclight vs Demons", factor: 1.70 });
  }

  // 8b. Infernal Tecpatl vs demons (+10%)
  if (weapon?.id === "echo-tecpatl" && ctx.target.isDemon) {
    chain.push({ name: "Tecpatl vs Demons", factor: 1.10 });
  }

  // 9. Devil's Element: +30% elemental weakness to all elements (elemental spells only, not powered staves)
  if (ctx.loadout.shield?.id === "echo-devils-element" && style === "magic" && weaponCat !== "powered-staff") {
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

  // 12. Wilderness weapons (+50% dmg)
  const wildernessWeapons = ["craws-bow", "webweaver-bow", "viggoras-chainmace", "ursine-chainmace"];
  if (weapon && wildernessWeapons.includes(weapon.id) && ctx.target.region === "wilderness") {
    chain.push({ name: `${weapon.name} (Wilderness)`, factor: 1.50 });
  }

  // 13. Wilderness sceptres (+25% magic dmg)
  const wildernessSceptres = ["thammarons-sceptre", "accursed-sceptre"];
  if (weapon && wildernessSceptres.includes(weapon.id) && ctx.target.region === "wilderness") {
    chain.push({ name: `${weapon.name} (Wilderness)`, factor: 1.25 });
  }

  // 14. Keris Partisan vs kalphites (+33% dmg)
  if (weapon?.id === "keris-breaching" && ctx.target.isKalphite) {
    chain.push({ name: "Keris vs Kalphites", factor: 4 / 3 });
  }

  // 15. Crystal armour set bonus (Bow of Faerdhinen, or any weapon with Crystal blessing)
  if (weapon?.id === "bowfa" || ctx.loadout.ammo?.id === "echo-crystal-blessing") {
    let crystalDmg = 0;
    if (ctx.loadout.head?.id === "crystal-helm") crystalDmg += 0.025;
    if (ctx.loadout.body?.id === "crystal-body") crystalDmg += 0.075;
    if (ctx.loadout.legs?.id === "crystal-legs") crystalDmg += 0.05;
    if (crystalDmg > 0) {
      chain.push({ name: "Crystal Armour", factor: 1 + crystalDmg });
    }
  }

  // 16. Inquisitor's armour set bonus (crush weapons only)
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

  // 17. Air spell pact: +X% damage per active prayer
  if (pe.airSpellDamagePerPrayer > 0 && style === "magic" && ctx.player.prayerType !== "none") {
    // Count active prayers (we only track 1 prayer at a time in our model)
    const prayerCount = 1;
    const airBonus = pe.airSpellDamagePerPrayer * prayerCount;
    chain.push({ name: `Air Spell Prayers +${airBonus}%`, factor: 1 + airBonus / 100 });
  }

  // 18. Water spell pact: +20% at full HP (scales with HP%)
  if (pe.waterSpellDamageHighHp && style === "magic") {
    // Assume full HP for DPS calculation (best case)
    chain.push({ name: "Water Spell Full HP", factor: 1.20 });
  }

  return chain;
}

// ═══════════════════════════════════════════════════════════════════════
// ACCURACY
// ═══════════════════════════════════════════════════════════════════════

export function calculateAttackRoll(ctx: DpsContext, pe: AggregatedPactEffects, bonuses: EquipmentBonuses): number {
  const style = ctx.player.combatStyle;
  const weapon = ctx.loadout.weapon;

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

  // Step 4: Void accuracy
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

  // Thrown weapon flat accuracy pact
  if (pe.thrownFlatAccuracy > 0 && weapon?.weaponCategory === "thrown") {
    equipAtk += pe.thrownFlatAccuracy;
  }

  let roll = base * (equipAtk + 64);

  // Slayer helm / Salve amulet accuracy (mutually exclusive)
  {
    const head = ctx.loadout.head;
    const hasSalve = ctx.loadout.neck?.id === "salve-ei" && ctx.target.isUndead;
    const hasSlayerHelm = ctx.player.onSlayerTask && (head?.id === "slayer-helm-i" || head?.id === "echo-vs-helm");

    if (hasSalve && hasSlayerHelm) {
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

  // Pact accuracy bonus (sum of all accuracy nodes)
  if (pe.allStyleAccuracyPercent > 0) {
    roll = Math.floor(roll * (1 + pe.allStyleAccuracyPercent / 100));
  }

  // Twisted Bow accuracy scaling
  if (weapon?.id === "tbow") {
    const M = Math.min(250, ctx.target.magicLevel);
    const t2 = Math.trunc((3 * M - 10) / 100);
    const t3 = Math.trunc(Math.pow(Math.trunc(3 * M / 10) - 100, 2) / 100);
    const tbowAcc = Math.min(140, Math.max(0, 140 + t2 - t3));
    roll = Math.floor(roll * tbowAcc / 100);
  }

  // Arclight accuracy vs demons
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

  // Wilderness weapon accuracy
  const wildernessWeapons = ["craws-bow", "webweaver-bow", "viggoras-chainmace", "ursine-chainmace"];
  if (weapon && wildernessWeapons.includes(weapon.id) && ctx.target.region === "wilderness") {
    roll = Math.floor(roll * 1.50);
  }
  const wildernessSceptres = ["thammarons-sceptre", "accursed-sceptre"];
  if (weapon && wildernessSceptres.includes(weapon.id) && ctx.target.region === "wilderness") {
    roll = Math.floor(roll * 2.0);
  }

  // Crystal armour set accuracy bonus (Bowfa or any weapon with Crystal blessing)
  if (weapon?.id === "bowfa" || ctx.loadout.ammo?.id === "echo-crystal-blessing") {
    let crystalAcc = 0;
    if (ctx.loadout.head?.id === "crystal-helm") crystalAcc += 0.05;
    if (ctx.loadout.body?.id === "crystal-body") crystalAcc += 0.15;
    if (ctx.loadout.legs?.id === "crystal-legs") crystalAcc += 0.10;
    if (crystalAcc > 0) {
      roll = Math.floor(roll * (1 + crystalAcc));
    }
  }

  // Inquisitor's armour accuracy bonus (crush only)
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
  ctx.pactEffects ??= aggregatePactEffects(ctx.player.activePacts);
  const totalBonuses = sumEquipmentBonuses(ctx.loadout);
  applyOffhandStatBoost(ctx, ctx.pactEffects, totalBonuses);
  const atkRoll = calculateAttackRoll(ctx, ctx.pactEffects, totalBonuses);
  const defRoll = calculateDefenceRoll(ctx.target, getAttackType(ctx));
  const baseAcc = standardAccuracy(atkRoll, defRoll);
  return applyDoubleRoll(ctx, ctx.pactEffects, baseAcc);
}

function standardAccuracy(attackRoll: number, defenceRoll: number): number {
  if (attackRoll > defenceRoll) {
    return 1 - (defenceRoll + 2) / (2 * (attackRoll + 1));
  } else {
    return attackRoll / (2 * (defenceRoll + 1));
  }
}

function applyDoubleRoll(ctx: DpsContext, pe: AggregatedPactEffects, baseAcc: number): number {
  const weapon = ctx.loadout.weapon;
  const weaponCat = weapon?.weaponCategory;

  // Crossbow double roll pact
  if (weaponCat === "crossbow" && pe.crossbowDoubleRoll) {
    return 1 - (1 - baseAcc) * (1 - baseAcc);
  }

  // Osmumten's Fang: exact discrete double-roll
  if (weapon?.id === "fang") {
    const atkRoll = ctx._fangAtkRoll ?? 0;
    const defRoll = ctx._fangDefRoll ?? 0;
    return fangExactAccuracy(atkRoll, defRoll);
  }

  // Drygore Blowpipe double roll
  if (weapon?.id === "echo-drygore-blowpipe") {
    return 1 - (1 - baseAcc) * (1 - baseAcc);
  }

  return baseAcc;
}

function fangExactAccuracy(attackRoll: number, defenceRoll: number): number {
  const A = attackRoll;
  const D = defenceRoll;
  if (A > D) {
    return 1 - (D + 2) * (2 * D + 3) / ((A + 1) * (A + 1) * 6);
  } else {
    return A * (4 * A + 5) / (6 * (A + 1) * (D + 1));
  }
}

// ═══════════════════════════════════════════════════════════════════════
// ATTACK SPEED
// ═══════════════════════════════════════════════════════════════════════

function getAttackSpeed(ctx: DpsContext, pe: AggregatedPactEffects): number {
  const weapon = ctx.loadout.weapon;
  let speed = weapon?.attackSpeed ?? 4;

  // Rapid style: -1 tick for ranged
  if (ctx.player.attackStyle === "rapid" && ctx.player.combatStyle === "ranged") {
    speed -= 1;
  }

  const weaponCat = weapon?.weaponCategory;

  // Spell speed pact: -2t for standard spells (min 2t)
  if (weaponCat === "staff" && pe.magicSpellSpeedReduction > 0) {
    speed -= pe.magicSpellSpeedReduction;
  }

  // Powered staff speed pact: -3t (min 1t)
  if (weaponCat === "powered-staff" && pe.poweredStaffSpeedReduction > 0) {
    speed -= pe.poweredStaffSpeedReduction;
  }

  // Light weapon faster pact: -1t for <1kg melee
  if (weaponCat === "1h-light" && pe.lightWeaponFaster) {
    speed -= 1;
  }

  // Bow fast hits pact: -1t
  if (weaponCat === "bow" && pe.bowFastHits) {
    speed -= 1;
  }

  // Crossbow slow big hits pact: +2t (damage handled in multiplier chain)
  if (weaponCat === "crossbow" && pe.crossbowSlowBigHits) {
    speed += 2;
  }

  return Math.max(1, speed);
}

// ═══════════════════════════════════════════════════════════════════════
// ECHO CASCADE
// ═══════════════════════════════════════════════════════════════════════

function calculateEchoDps(ctx: DpsContext, pe: AggregatedPactEffects, baseDps: number, _accuracy: number): number {
  // Base echo chance from pact nodes
  let echoRate = pe.rangedRegenEchoChance / 100;
  if (echoRate <= 0) return 0;
  if (ctx.player.combatStyle !== "ranged" && !pe.twohMeleeEchos) return 0;

  // Combine with regen chance for effective echo rate
  // The wiki calc multiplies echo chance by regen rate; we approximate by using the raw echo% as the effective proc rate
  // (Regen rate is assumed near 100% with enough regen nodes selected)

  // Crossbow echo reproc chance
  if (ctx.loadout.weapon?.weaponCategory === "crossbow") {
    echoRate += pe.crossbowEchoReprocChance / 100;
  }

  if (echoRate <= 0) return 0;

  let echoDps: number;

  // Echo cascade: echoes can trigger more echoes at half chance (up to 4 times)
  if (pe.rangedEchoCyclical) {
    const p = echoRate;
    // Geometric sum: p + p*(p/2) + p*(p/2)*(p/4) + p*(p/2)*(p/4)*(p/8) ≈ p * (1 + p/2 + p^2/8 + p^3/48)
    const cascadeMult = 1 + p / 2 + (p * p) / 8 + (p * p * p) / 48;
    echoDps = baseDps * p * cascadeMult;
  } else {
    echoDps = baseDps * echoRate;
  }

  // Bow echoes never miss: effective echo DPS is already at full accuracy
  // (no accuracy penalty for echoes, so no adjustment needed—echoes use base weapon accuracy by default)

  return echoDps;
}

// ═══════════════════════════════════════════════════════════════════════
// BONUS HITS
// ═══════════════════════════════════════════════════════════════════════

function calculateBonusHitDps(_ctx: DpsContext, pe: AggregatedPactEffects, maxHit: number, accuracy: number, interval: number): number {
  if (!pe.lightWeaponDoubleHit) return 0;
  if (_ctx.loadout.weapon?.weaponCategory !== "1h-light") return 0;
  const bonusMax = Math.floor(maxHit * 0.40);
  return (bonusMax / 2 * accuracy) / interval;
}

function calculateBlindbagDps(_ctx: DpsContext, pe: AggregatedPactEffects, maxHit: number, accuracy: number, interval: number): number {
  if (pe.blindbagChance <= 0) return 0;
  const weaponCat = _ctx.loadout.weapon?.weaponCategory;
  if (weaponCat !== "1h-heavy" && weaponCat !== "2h-melee") return 0;
  return (pe.blindbagChance / 100) * (maxHit * accuracy) / interval;
}

function calculateBoltSpecDps(ctx: DpsContext, maxHit: number, accuracy: number, interval: number): number {
  const ammo = ctx.loadout.ammo;
  if (!ammo) return 0;
  const weaponCat = ctx.loadout.weapon?.weaponCategory;
  if (weaponCat !== "crossbow") return 0;

  if (ammo.id === "ruby-bolts-e") {
    const procDmg = Math.min(100, Math.floor(ctx.target.hp * 0.20));
    const normalAvg = maxHit / 2;
    const boltBonus = 0.06 * accuracy * (procDmg - normalAvg);
    return Math.max(0, boltBonus) / interval;
  }

  if (ammo.id === "diamond-bolts-e") {
    const boostedAcc = 0.10 + 0.90 * accuracy;
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

function getFlatMaxHitMod(ctx: DpsContext, pe: AggregatedPactEffects): number {
  let mod = 0;
  // Powered staff speed pact: 1H staves lose 8 max hit
  if (ctx.loadout.weapon?.weaponCategory === "powered-staff" && pe.poweredStaffSpeedReduction > 0) {
    // Only 1H staves lose max hit — check if weapon is NOT two-handed
    if (!ctx.loadout.weapon.isTwoHanded) {
      mod -= 8;
    }
  }
  return mod;
}
