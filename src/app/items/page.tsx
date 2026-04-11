"use client";

import { useState, useMemo } from "react";
import type { EquipmentSlot, CombatStyle, Item } from "@/types/dps";
import { ITEMS } from "@/data/items";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

type SortKey = "name" | "mstr" | "rstr" | "mdmg" | "prayer";

const SLOTS: { value: EquipmentSlot | "all"; label: string }[] = [
  { value: "all", label: "All Slots" },
  { value: "weapon", label: "Weapon" },
  { value: "head", label: "Head" },
  { value: "body", label: "Body" },
  { value: "legs", label: "Legs" },
  { value: "shield", label: "Shield" },
  { value: "cape", label: "Cape" },
  { value: "neck", label: "Neck" },
  { value: "ammo", label: "Ammo" },
  { value: "hands", label: "Hands" },
  { value: "feet", label: "Feet" },
  { value: "ring", label: "Ring" },
];

const STYLES: { value: CombatStyle | "all"; label: string }[] = [
  { value: "all", label: "All Styles" },
  { value: "melee", label: "Melee" },
  { value: "ranged", label: "Ranged" },
  { value: "magic", label: "Magic" },
];

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "name", label: "Name" },
  { value: "mstr", label: "Melee Str" },
  { value: "rstr", label: "Ranged Str" },
  { value: "mdmg", label: "Magic Dmg" },
  { value: "prayer", label: "Prayer" },
];

export default function ItemsPage() {
  const [slot, setSlot] = useState<EquipmentSlot | "all">("all");
  const [style, setStyle] = useState<CombatStyle | "all">("all");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortKey>("name");

  const filtered = useMemo(() => {
    let items = [...ITEMS];

    if (slot !== "all") items = items.filter(i => i.slot === slot);
    if (style !== "all") items = items.filter(i => matchesStyle(i, style));
    if (search) items = items.filter(i => i.name.toLowerCase().includes(search.toLowerCase()));

    items.sort((a, b) => {
      if (sort === "name") return a.name.localeCompare(b.name);
      return (b.bonuses[sort] ?? 0) - (a.bonuses[sort] ?? 0);
    });

    return items;
  }, [slot, style, search, sort]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-3xl font-bold text-osrs-gold mb-6" style={{ fontFamily: "var(--font-runescape)" }}>
        Item Database
      </h1>

      {/* Filter Bar */}
      <div className="flex flex-wrap gap-3 mb-6">
        <select value={slot} onChange={e => setSlot(e.target.value as EquipmentSlot | "all")}
          className="px-3 py-1.5 bg-osrs-darker border border-osrs-border rounded-lg text-sm text-osrs-text">
          {SLOTS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
        </select>

        <select value={style} onChange={e => setStyle(e.target.value as CombatStyle | "all")}
          className="px-3 py-1.5 bg-osrs-darker border border-osrs-border rounded-lg text-sm text-osrs-text">
          {STYLES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
        </select>

        <select value={sort} onChange={e => setSort(e.target.value as SortKey)}
          className="px-3 py-1.5 bg-osrs-darker border border-osrs-border rounded-lg text-sm text-osrs-text">
          {SORT_OPTIONS.map(s => <option key={s.value} value={s.value}>Sort: {s.label}</option>)}
        </select>

        <input
          type="text" placeholder="Search items..." value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1 min-w-[200px] px-3 py-1.5 bg-osrs-darker border border-osrs-border rounded-lg text-sm text-osrs-text focus:border-osrs-gold focus:outline-none"
        />
      </div>

      <div className="text-xs text-osrs-text-dim mb-4">{filtered.length} items</div>

      {/* Item Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(item => (
          <ItemCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}

function ItemCard({ item }: { item: Item }) {
  const [expanded, setExpanded] = useState(false);

  const isEcho = item.id.startsWith("echo-");

  return (
    <Card
      glow={isEcho ? "red" : "none"}
      hover
      onClick={() => setExpanded(!expanded)}
      className={isEcho ? "bg-parchment" : ""}
    >
      <div className="flex items-start justify-between mb-2">
        <div>
          <h3 className="font-bold text-osrs-text text-sm">{item.name}</h3>
          <div className="flex items-center gap-1.5 mt-0.5">
            <Badge variant="default" size="sm">{item.slot}</Badge>
            {item.region && <Badge variant="gold" size="sm">{item.region}</Badge>}
            {item.isTwoHanded && <Badge variant="red" size="sm">2H</Badge>}
            {isEcho && <Badge variant="red" size="sm">Echo</Badge>}
          </div>
        </div>
        {item.combatStyle && (
          <Badge variant={item.combatStyle === "melee" ? "gold" : item.combatStyle === "ranged" ? "green" : "blue"} size="sm">
            {item.combatStyle}
          </Badge>
        )}
      </div>

      {/* Key offensive stats */}
      <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-osrs-text-dim">
        {item.bonuses.mstr > 0 && <Stat label="Str" value={item.bonuses.mstr} />}
        {item.bonuses.rstr > 0 && <Stat label="RStr" value={item.bonuses.rstr} />}
        {item.bonuses.mdmg > 0 && <Stat label="MDmg" value={`${item.bonuses.mdmg}%`} />}
        {item.bonuses.astab > 0 && <Stat label="Stab" value={item.bonuses.astab} />}
        {item.bonuses.aslash > 0 && <Stat label="Slash" value={item.bonuses.aslash} />}
        {item.bonuses.acrush > 0 && <Stat label="Crush" value={item.bonuses.acrush} />}
        {item.bonuses.aranged > 0 && <Stat label="RAtk" value={item.bonuses.aranged} />}
        {item.bonuses.amagic > 0 && <Stat label="MAtk" value={item.bonuses.amagic} />}
        {item.bonuses.prayer > 0 && <Stat label="Pray" value={item.bonuses.prayer} />}
      </div>

      {item.passive && (
        <div className="mt-2 text-xs text-osrs-purple">{item.passive}</div>
      )}

      {item.attackSpeed && (
        <div className="text-[10px] text-osrs-text-dim mt-1">
          Speed: {item.attackSpeed}t ({(item.attackSpeed * 0.6).toFixed(1)}s)
          {item.weaponCategory && <span className="ml-2 capitalize">({item.weaponCategory})</span>}
        </div>
      )}

      {/* Expanded: Full stat table */}
      {expanded && (
        <div className="mt-3 pt-3 border-t border-osrs-border grid grid-cols-2 gap-1 text-[10px]">
          <StatRow label="Stab Atk" value={item.bonuses.astab} />
          <StatRow label="Slash Atk" value={item.bonuses.aslash} />
          <StatRow label="Crush Atk" value={item.bonuses.acrush} />
          <StatRow label="Range Atk" value={item.bonuses.aranged} />
          <StatRow label="Magic Atk" value={item.bonuses.amagic} />
          <StatRow label="Stab Def" value={item.bonuses.dstab} />
          <StatRow label="Slash Def" value={item.bonuses.dslash} />
          <StatRow label="Crush Def" value={item.bonuses.dcrush} />
          <StatRow label="Range Def" value={item.bonuses.dranged} />
          <StatRow label="Magic Def" value={item.bonuses.dmagic} />
          <StatRow label="Melee Str" value={item.bonuses.mstr} />
          <StatRow label="Range Str" value={item.bonuses.rstr} />
          <StatRow label="Magic Dmg" value={`${item.bonuses.mdmg}%`} />
          <StatRow label="Prayer" value={item.bonuses.prayer} />
        </div>
      )}
    </Card>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <span>
      <span className="text-osrs-text-dim">{label}:</span>{" "}
      <span className="text-osrs-text">{value}</span>
    </span>
  );
}

function StatRow({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex justify-between text-osrs-text-dim">
      <span>{label}</span>
      <span className="text-osrs-text">{value}</span>
    </div>
  );
}

function matchesStyle(item: Item, style: CombatStyle): boolean {
  if (item.combatStyle) return item.combatStyle === style;
  const b = item.bonuses;
  switch (style) {
    case "melee": return b.mstr > 0 || b.astab > 0 || b.aslash > 0 || b.acrush > 0;
    case "ranged": return b.rstr > 0 || b.aranged > 0;
    case "magic": return b.mdmg > 0 || b.amagic > 0;
  }
}
