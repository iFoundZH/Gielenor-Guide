"use client";

import { useState } from "react";
import type { BossPreset } from "@/types/dps";
import { BOSS_PRESETS } from "@/data/boss-presets";

interface Props {
  selected: BossPreset;
  onSelect: (boss: BossPreset) => void;
}

export function BossSelector({ selected, onSelect }: Props) {
  const [search, setSearch] = useState("");

  const filtered = search
    ? BOSS_PRESETS.filter(b => b.name.toLowerCase().includes(search.toLowerCase()))
    : BOSS_PRESETS;

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold text-osrs-gold uppercase tracking-wider">Target</h3>
      <input
        type="text"
        placeholder="Search bosses..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="w-full px-3 py-1.5 bg-osrs-darker border border-osrs-border rounded-lg text-sm text-osrs-text focus:border-osrs-gold focus:outline-none"
      />
      <div className="max-h-48 overflow-y-auto space-y-1">
        {filtered.map(boss => (
          <button
            key={boss.id}
            onClick={() => { onSelect(boss); setSearch(""); }}
            className={`w-full text-left px-3 py-1.5 rounded-lg text-xs transition-all ${
              selected.id === boss.id
                ? "bg-osrs-gold/20 text-osrs-gold border border-osrs-gold/30"
                : "text-osrs-text-dim hover:text-osrs-text hover:bg-osrs-panel-hover"
            }`}
          >
            <span className="font-medium">{boss.name}</span>
            {boss.region && (
              <span className="ml-2 text-[10px] opacity-60 capitalize">{boss.region}</span>
            )}
          </button>
        ))}
      </div>
      <div className="text-[10px] text-osrs-text-dim">
        Def: {selected.defenceLevel} | HP: {selected.hp} | Magic Lvl: {selected.magicLevel}
      </div>
    </div>
  );
}
