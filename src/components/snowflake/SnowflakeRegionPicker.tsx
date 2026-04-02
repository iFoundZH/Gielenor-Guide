"use client";

import { osrsRegions } from "@/data/osrs-regions";

interface SnowflakeRegionPickerProps {
  selectedRegions: string[];
  onToggle: (regionId: string) => void;
}

export function SnowflakeRegionPicker({ selectedRegions, onToggle }: SnowflakeRegionPickerProps) {
  const allSelected = selectedRegions.length === 0;

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm text-osrs-text-dim">
          {allSelected
            ? "No region restrictions (all regions accessible)"
            : `${selectedRegions.length} region${selectedRegions.length === 1 ? "" : "s"} allowed`}
        </p>
        {selectedRegions.length > 0 && (
          <button
            onClick={() => selectedRegions.forEach(onToggle)}
            className="text-xs text-osrs-blue hover:underline"
          >
            Clear all
          </button>
        )}
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {osrsRegions.map((region) => {
          const isSelected = selectedRegions.includes(region.id);
          return (
            <div
              key={region.id}
              onClick={() => onToggle(region.id)}
              className={`p-3 rounded-lg border cursor-pointer transition-all ${
                isSelected
                  ? "bg-osrs-blue/10 border-osrs-blue text-osrs-text"
                  : "bg-osrs-panel border-osrs-border text-osrs-text-dim hover:border-osrs-blue/50"
              }`}
            >
              <h5 className="font-bold text-sm">{region.name}</h5>
              <p className="text-[10px] mt-1 opacity-70 line-clamp-2">{region.description}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
