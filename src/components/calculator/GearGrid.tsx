"use client";

import type { BuildLoadout, EquipmentSlot, Item } from "@/types/dps";

const SLOT_LAYOUT: { slot: EquipmentSlot; label: string; row: number; col: number }[] = [
  { slot: "head",   label: "Head",   row: 0, col: 1 },
  { slot: "cape",   label: "Cape",   row: 1, col: 0 },
  { slot: "neck",   label: "Neck",   row: 1, col: 1 },
  { slot: "ammo",   label: "Ammo",   row: 1, col: 2 },
  { slot: "weapon", label: "Weapon", row: 2, col: 0 },
  { slot: "body",   label: "Body",   row: 2, col: 1 },
  { slot: "shield", label: "Shield", row: 2, col: 2 },
  { slot: "legs",   label: "Legs",   row: 3, col: 1 },
  { slot: "hands",  label: "Hands",  row: 4, col: 0 },
  { slot: "feet",   label: "Feet",   row: 4, col: 1 },
  { slot: "ring",   label: "Ring",   row: 4, col: 2 },
];

interface Props {
  loadout: BuildLoadout;
  onSlotClick: (slot: EquipmentSlot) => void;
  onLockToggle?: (slot: EquipmentSlot) => void;
  lockedSlots?: Set<EquipmentSlot>;
}

export function GearGrid({ loadout, onSlotClick, onLockToggle, lockedSlots }: Props) {
  return (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold text-osrs-gold uppercase tracking-wider">Equipment</h3>
      <div className="grid grid-cols-3 gap-2">
        {SLOT_LAYOUT.map(({ slot, label }) => {
          const item: Item | null = loadout[slot];
          const isLocked = lockedSlots?.has(slot);

          return (
            <div key={slot} className="relative">
              <button
                onClick={() => onSlotClick(slot)}
                onContextMenu={e => {
                  e.preventDefault();
                  if (item && onLockToggle) onLockToggle(slot);
                }}
                className={`w-full p-2 rounded-lg border text-center transition-all min-h-[56px] ${
                  item
                    ? "bg-osrs-panel border-osrs-gold/30 hover:border-osrs-gold"
                    : "bg-osrs-darker border-osrs-border hover:border-osrs-text-dim"
                } ${isLocked ? "ring-1 ring-demon-glow/50" : ""}`}
              >
                <div className="text-[9px] text-osrs-text-dim uppercase tracking-wider mb-0.5">
                  {label}
                </div>
                {item ? (
                  <div className="text-[10px] text-osrs-text leading-tight truncate">
                    {item.name}
                  </div>
                ) : (
                  <div className="text-[10px] text-osrs-text-dim/50">Empty</div>
                )}
              </button>
              {item && onLockToggle && (
                <button
                  onClick={e => { e.stopPropagation(); onLockToggle(slot); }}
                  className={`absolute top-1 right-1 w-4 h-4 flex items-center justify-center rounded text-[8px] transition-all ${
                    isLocked
                      ? "bg-demon-glow/20 text-demon-glow"
                      : "bg-osrs-darker/50 text-osrs-text-dim/40 hover:text-osrs-text-dim"
                  }`}
                  title={isLocked ? "Unlock slot" : "Lock slot"}
                >
                  {isLocked ? "L" : "U"}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
