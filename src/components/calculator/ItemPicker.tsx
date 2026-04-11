"use client";

import { useState } from "react";
import type { EquipmentSlot, Item, CombatStyle } from "@/types/dps";
import { getItemsBySlot } from "@/data/items";

interface Props {
  slot: EquipmentSlot;
  style: CombatStyle;
  regions: string[];
  onSelect: (item: Item | null) => void;
  onClose: () => void;
}

export function ItemPicker({ slot, style, regions, onSelect, onClose }: Props) {
  const [search, setSearch] = useState("");

  const allItems = getItemsBySlot(slot).filter(item => {
    // Region filter
    if (item.region && !regions.includes(item.region)) return false;
    // Search filter
    if (search && !item.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  // Sort: items matching combat style first, then by offensive score
  const sorted = [...allItems].sort((a, b) => {
    const aMatch = matchesStyle(a, style) ? 1 : 0;
    const bMatch = matchesStyle(b, style) ? 1 : 0;
    if (aMatch !== bMatch) return bMatch - aMatch;
    return offScore(b, style) - offScore(a, style);
  });

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-osrs-panel border border-osrs-border rounded-xl p-4 w-full max-w-md max-h-[80vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-osrs-gold capitalize">{slot} Slot</h3>
          <button onClick={onClose} className="text-osrs-text-dim hover:text-osrs-text text-lg">&times;</button>
        </div>

        <input
          type="text"
          placeholder="Search items..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full px-3 py-1.5 bg-osrs-darker border border-osrs-border rounded-lg text-sm text-osrs-text focus:border-osrs-gold focus:outline-none mb-3"
          autoFocus
        />

        <button
          onClick={() => onSelect(null)}
          className="w-full text-left px-3 py-2 rounded-lg text-xs text-osrs-text-dim hover:bg-osrs-panel-hover mb-1"
        >
          (Empty slot)
        </button>

        <div className="flex-1 overflow-y-auto space-y-0.5">
          {sorted.map(item => (
            <button
              key={item.id}
              onClick={() => onSelect(item)}
              className="w-full text-left px-3 py-2 rounded-lg text-xs hover:bg-osrs-panel-hover transition-all group"
            >
              <div className="flex items-center justify-between">
                <span className="text-osrs-text group-hover:text-osrs-gold font-medium">
                  {item.name}
                </span>
                {item.region && (
                  <span className="text-[10px] text-osrs-text-dim capitalize">{item.region}</span>
                )}
              </div>
              <div className="text-[10px] text-osrs-text-dim mt-0.5">
                {formatBonuses(item, style)}
                {item.passive && <span className="ml-2 text-osrs-purple">{item.passive}</span>}
              </div>
            </button>
          ))}
          {sorted.length === 0 && (
            <div className="text-xs text-osrs-text-dim text-center py-4">No items found</div>
          )}
        </div>
      </div>
    </div>
  );
}

function matchesStyle(item: Item, style: CombatStyle): boolean {
  if (item.combatStyle) return item.combatStyle === style;
  const b = item.bonuses;
  switch (style) {
    case "melee": return b.mstr > 0;
    case "ranged": return b.rstr > 0 || b.aranged > 5;
    case "magic": return b.mdmg > 0 || b.amagic > 5;
  }
}

function offScore(item: Item, style: CombatStyle): number {
  const b = item.bonuses;
  switch (style) {
    case "melee": return b.mstr * 2 + Math.max(b.astab, b.aslash, b.acrush);
    case "ranged": return b.rstr * 2 + b.aranged;
    case "magic": return b.mdmg * 3 + b.amagic;
  }
}

function formatBonuses(item: Item, style: CombatStyle): string {
  const b = item.bonuses;
  const parts: string[] = [];
  switch (style) {
    case "melee":
      if (b.mstr) parts.push(`Str:${b.mstr}`);
      if (b.astab) parts.push(`Stab:${b.astab}`);
      if (b.aslash) parts.push(`Slash:${b.aslash}`);
      if (b.acrush) parts.push(`Crush:${b.acrush}`);
      break;
    case "ranged":
      if (b.rstr) parts.push(`RStr:${b.rstr}`);
      if (b.aranged) parts.push(`RAtk:${b.aranged}`);
      break;
    case "magic":
      if (b.mdmg) parts.push(`MDmg:${b.mdmg}%`);
      if (b.amagic) parts.push(`MAtk:${b.amagic}`);
      break;
  }
  if (b.prayer) parts.push(`Pray:${b.prayer}`);
  return parts.join(" | ");
}
