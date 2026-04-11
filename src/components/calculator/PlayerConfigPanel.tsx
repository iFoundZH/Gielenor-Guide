"use client";

import type { PlayerConfig, CombatStyle, PotionType, PrayerType, AttackStyleBonus } from "@/types/dps";

const POTIONS: { value: PotionType; label: string }[] = [
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
  { value: "none", label: "None", style: "all" },
  { value: "piety", label: "Piety", style: "melee" },
  { value: "chivalry", label: "Chivalry", style: "melee" },
  { value: "ultimate-strength", label: "Ultimate Strength", style: "melee" },
  { value: "rigour", label: "Rigour", style: "ranged" },
  { value: "eagle-eye", label: "Eagle Eye", style: "ranged" },
  { value: "augury", label: "Augury", style: "magic" },
  { value: "mystic-might", label: "Mystic Might", style: "magic" },
];

const SPELLS: { value: number; label: string }[] = [
  { value: 24, label: "Fire Surge (24)" },
  { value: 30, label: "Ice Barrage (30)" },
  { value: 28, label: "Blood Barrage (28)" },
  { value: 22, label: "Ice Burst (22)" },
  { value: 20, label: "Fire Wave (20)" },
  { value: 16, label: "Fire Blast (16)" },
];

const ATTACK_STYLES: { value: AttackStyleBonus; label: string }[] = [
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

export function PlayerConfigPanel({ config, onChange }: Props) {
  const update = (partial: Partial<PlayerConfig>) => onChange({ ...config, ...partial });

  const filteredPrayers = PRAYERS.filter(
    p => p.style === "all" || p.style === config.combatStyle,
  );

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
              prayerType: "none",
              potion: "none",
              attackStyle: style === "ranged" ? "rapid" : style === "magic" ? "autocast" : "aggressive",
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
            value={config.spellMaxHit ?? 24}
            onChange={e => update({ spellMaxHit: parseInt(e.target.value) })}
            className="w-full px-3 py-1.5 bg-osrs-darker border border-osrs-border rounded-lg text-sm text-osrs-text focus:border-osrs-gold focus:outline-none"
          >
            {SPELLS.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
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
