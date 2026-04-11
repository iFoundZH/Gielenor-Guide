"use client";

import type { PlayerConfig, CombatStyle, PotionType, PrayerType, AttackStyleBonus, SpellElement } from "@/types/dps";
import { aggregatePactEffects } from "@/lib/pact-effects";

const POTIONS: { value: PotionType; label: string }[] = [
  { value: "auto", label: "Auto (best)" },
  { value: "none", label: "None" },
  { value: "super-combat", label: "Super Combat" },
  { value: "super-attack", label: "Super Attack" },
  { value: "super-strength", label: "Super Strength" },
  { value: "ranging", label: "Ranging Potion" },
  { value: "magic", label: "Magic Potion" },
  { value: "overload", label: "Overload" },
  { value: "smelling-salts", label: "Smelling Salts" },
];

const PRAYERS: { value: PrayerType; label: string; style: CombatStyle | "all" }[] = [
  { value: "auto", label: "Auto (best)", style: "all" },
  { value: "none", label: "None", style: "all" },
  { value: "piety", label: "Piety", style: "melee" },
  { value: "chivalry", label: "Chivalry", style: "melee" },
  { value: "ultimate-strength", label: "Ultimate Strength", style: "melee" },
  { value: "rigour", label: "Rigour", style: "ranged" },
  { value: "eagle-eye", label: "Eagle Eye", style: "ranged" },
  { value: "augury", label: "Augury", style: "magic" },
  { value: "mystic-might", label: "Mystic Might", style: "magic" },
];

const SPELLS: { value: number; label: string; element: SpellElement }[] = [
  { value: 24, label: "Fire Surge (24)", element: "fire" },
  { value: 30, label: "Ice Barrage (30)", element: "ice" },
  { value: 28, label: "Blood Barrage (28)", element: "blood" },
  { value: 22, label: "Ice Burst (22)", element: "ice" },
  { value: 20, label: "Fire Wave (20)", element: "fire" },
  { value: 16, label: "Fire Blast (16)", element: "fire" },
  { value: 26, label: "Smoke Barrage (26)", element: "smoke" },
  { value: 24, label: "Shadow Barrage (24)", element: "shadow" },
  { value: 21, label: "Air Surge (21)", element: "air" },
  { value: 22, label: "Earth Surge (22)", element: "earth" },
  { value: 24, label: "Water Surge (24)", element: "water" },
];

const ATTACK_STYLES: { value: AttackStyleBonus; label: string }[] = [
  { value: "auto", label: "Auto (best)" },
  { value: "accurate", label: "Accurate" },
  { value: "aggressive", label: "Aggressive" },
  { value: "controlled", label: "Controlled" },
  { value: "defensive", label: "Defensive" },
  { value: "rapid", label: "Rapid" },
  { value: "longrange", label: "Longrange" },
  { value: "autocast", label: "Autocast" },
];

interface Props {
  config: PlayerConfig;
  onChange: (config: PlayerConfig) => void;
}

const SPELL_ELEMENTS: { value: SpellElement; label: string }[] = [
  { value: "none", label: "None / Powered" },
  { value: "air", label: "Air" },
  { value: "water", label: "Water" },
  { value: "fire", label: "Fire" },
  { value: "earth", label: "Earth" },
  { value: "smoke", label: "Smoke" },
  { value: "ice", label: "Ice" },
  { value: "blood", label: "Blood" },
  { value: "shadow", label: "Shadow" },
];

export function PlayerConfigPanel({ config, onChange }: Props) {
  const update = (partial: Partial<PlayerConfig>) => onChange({ ...config, ...partial });

  const filteredPrayers = PRAYERS.filter(
    p => p.style === "all" || p.style === config.combatStyle,
  );

  // Compute pact effects to show conditional inputs
  const pe = config.activePacts.length > 0 ? aggregatePactEffects(config.activePacts) : null;

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-osrs-gold uppercase tracking-wider">Player Stats</h3>

      {/* Combat Style Tabs */}
      <div className="flex gap-1">
        {(["melee", "ranged", "magic"] as CombatStyle[]).map(style => (
          <button
            key={style}
            onClick={() => update({
              combatStyle: style,
              prayerType: "auto",
              potion: "auto",
              attackStyle: "auto",
            })}
            className={`flex-1 px-3 py-2 text-xs font-medium rounded-lg capitalize transition-all ${
              config.combatStyle === style
                ? "bg-osrs-gold text-osrs-darker"
                : "bg-osrs-panel text-osrs-text-dim hover:text-osrs-gold"
            }`}
          >
            {style}
          </button>
        ))}
      </div>

      {/* Stat Inputs */}
      <div className="grid grid-cols-2 gap-2">
        {config.combatStyle === "melee" && (
          <>
            <StatInput label="Attack" value={config.attack} onChange={v => update({ attack: v })} />
            <StatInput label="Strength" value={config.strength} onChange={v => update({ strength: v })} />
          </>
        )}
        {config.combatStyle === "ranged" && (
          <StatInput label="Ranged" value={config.ranged} onChange={v => update({ ranged: v })} />
        )}
        {config.combatStyle === "magic" && (
          <StatInput label="Magic" value={config.magic} onChange={v => update({ magic: v })} />
        )}
        <StatInput label="Prayer" value={config.prayer} onChange={v => update({ prayer: v })} />
      </div>

      {/* Potion */}
      <SelectField
        label="Potion"
        value={config.potion}
        options={POTIONS}
        onChange={v => update({ potion: v as PotionType })}
      />

      {/* Prayer */}
      <SelectField
        label="Prayer"
        value={config.prayerType}
        options={filteredPrayers}
        onChange={v => update({ prayerType: v as PrayerType })}
      />

      {/* Attack Style */}
      <SelectField
        label="Attack Style"
        value={config.attackStyle}
        options={ATTACK_STYLES}
        onChange={v => update({ attackStyle: v as AttackStyleBonus })}
      />

      {/* Spell (magic only, non-powered staves) */}
      {config.combatStyle === "magic" && (
        <div>
          <label className="text-xs text-osrs-text-dim block mb-1">Spell</label>
          <select
            value={`${config.spellMaxHit ?? 24}:${config.spellElement ?? "fire"}`}
            onChange={e => {
              const [maxStr, elem] = e.target.value.split(":");
              update({ spellMaxHit: parseInt(maxStr), spellElement: elem as SpellElement });
            }}
            className="w-full px-3 py-1.5 bg-osrs-darker border border-osrs-border rounded-lg text-sm text-osrs-text focus:border-osrs-gold focus:outline-none"
          >
            {SPELLS.map((opt, i) => (
              <option key={`${opt.value}-${opt.element}-${i}`} value={`${opt.value}:${opt.element}`}>{opt.label}</option>
            ))}
          </select>
        </div>
      )}

      {/* Toggles */}
      <div className="space-y-2">
        <Toggle
          label="On Slayer Task"
          checked={config.onSlayerTask}
          onChange={v => update({ onSlayerTask: v })}
        />
        <SelectField
          label="Void"
          value={config.voidSet}
          options={[
            { value: "auto", label: "Auto (best)" },
            { value: "none", label: "None" },
            { value: "void", label: "Void Knight" },
            { value: "elite-void", label: "Elite Void" },
          ]}
          onChange={v => update({ voidSet: v as PlayerConfig["voidSet"] })}
        />
      </div>

      {/* Target Distance */}
      <StatInput
        label="Distance (tiles)"
        value={config.targetDistance ?? 1}
        onChange={v => update({ targetDistance: v })}
        min={0}
        max={15}
      />

      {/* Pact-conditional inputs */}
      {pe && (pe.rangedStrengthHpDifference || pe.fireHpConsumeForDamage || pe.waterSpellDamageHighHp) && (
        <StatInput
          label="Current HP"
          value={config.currentHitpoints ?? config.hitpoints}
          onChange={v => update({ currentHitpoints: v })}
          min={1}
          max={config.hitpoints}
        />
      )}

      {pe && (pe.airSpellDamagePerPrayer > 0 || pe.airSpellMaxHitPrayerBonus > 0) && config.combatStyle === "magic" && (
        <StatInput
          label="Active Prayers"
          value={config.activePrayerCount ?? 1}
          onChange={v => update({ activePrayerCount: v })}
          min={0}
          max={6}
        />
      )}

      {pe && (pe.smokeCountsAsAir || pe.iceCountsAsWater || pe.bloodCountsAsFire || pe.shadowCountsAsEarth ||
              pe.airSpellDamagePerPrayer > 0 || pe.fireHpConsumeForDamage || pe.earthReduceDefence ||
              pe.waterSpellDamageHighHp) && config.combatStyle === "magic" && (
        <SelectField
          label="Spell Element"
          value={config.spellElement ?? "none"}
          options={SPELL_ELEMENTS}
          onChange={v => update({ spellElement: v as SpellElement })}
        />
      )}

      {pe && (pe.uniqueBlindBagChance || pe.uniqueBlindBagDamage > 0) && config.combatStyle === "melee" && (
        <StatInput
          label="Heavy Weapons (inv)"
          value={config.uniqueHeavyWeapons ?? 0}
          onChange={v => update({ uniqueHeavyWeapons: v })}
          min={0}
          max={5}
        />
      )}

      {pe && pe.overhealConsumptionBoost && config.combatStyle === "melee" && (
        <Toggle
          label="Has Overheal"
          checked={config.hasOverheal ?? false}
          onChange={v => update({ hasOverheal: v })}
        />
      )}
    </div>
  );
}

function StatInput({ label, value, onChange, min = 1, max = 99 }: {
  label: string; value: number; onChange: (v: number) => void; min?: number; max?: number;
}) {
  return (
    <div>
      <label className="text-xs text-osrs-text-dim block mb-1">{label}</label>
      <input
        type="number"
        min={min}
        max={max}
        value={value}
        onChange={e => onChange(Math.min(max, Math.max(min, parseInt(e.target.value) || min)))}
        className="w-full px-3 py-1.5 bg-osrs-darker border border-osrs-border rounded-lg text-sm text-osrs-text focus:border-osrs-gold focus:outline-none"
      />
    </div>
  );
}

function SelectField<T extends string>({ label, value, options, onChange }: {
  label: string; value: T; options: { value: T; label: string }[]; onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="text-xs text-osrs-text-dim block mb-1">{label}</label>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full px-3 py-1.5 bg-osrs-darker border border-osrs-border rounded-lg text-sm text-osrs-text focus:border-osrs-gold focus:outline-none"
      >
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  );
}

function Toggle({ label, checked, onChange }: {
  label: string; checked: boolean; onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex items-center gap-2 cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={e => onChange(e.target.checked)}
        className="w-4 h-4 accent-osrs-gold"
      />
      <span className="text-xs text-osrs-text-dim">{label}</span>
    </label>
  );
}
