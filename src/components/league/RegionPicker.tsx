"use client";

import { Region } from "@/types/league";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

interface RegionPickerProps {
  regions: Region[];
  maxRegions: number;
  selectedRegions: string[];
  onToggle?: (regionId: string) => void;
}

export function RegionPicker({ regions, maxRegions, selectedRegions, onToggle }: RegionPickerProps) {
  const choosableRegions = regions.filter((r) => r.type === "choosable");
  const fixedRegions = regions.filter((r) => r.type === "starting" || r.type === "auto-unlock");
  const inaccessible = regions.filter((r) => r.type === "inaccessible");
  const selectedCount = selectedRegions.length;

  return (
    <div className="space-y-6">
      {/* Fixed regions */}
      {fixedRegions.length > 0 && (
        <div>
          <h4 className="text-sm font-bold text-osrs-text-dim mb-3 uppercase tracking-wider">Always Available</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {fixedRegions.map((region) => (
              <RegionCard key={region.id} region={region} status="locked-in" />
            ))}
          </div>
        </div>
      )}

      {/* Choosable regions */}
      {maxRegions > 0 && choosableRegions.length > 0 && (
        <div>
          <h4 className="text-sm font-bold text-osrs-text-dim mb-1 uppercase tracking-wider">
            Choose {maxRegions} Regions
          </h4>
          <p className="text-xs text-osrs-text-dim mb-3">
            {selectedCount} / {maxRegions} selected
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {choosableRegions.map((region) => {
              const isSelected = selectedRegions.includes(region.id);
              const canSelect = isSelected || selectedCount < maxRegions;
              return (
                <RegionCard
                  key={region.id}
                  region={region}
                  status={isSelected ? "selected" : canSelect ? "available" : "disabled"}
                  onClick={onToggle && canSelect ? () => onToggle(region.id) : undefined}
                />
              );
            })}
          </div>
        </div>
      )}

      {/* Inaccessible */}
      {inaccessible.length > 0 && (
        <div>
          <h4 className="text-sm font-bold text-demon-glow mb-3 uppercase tracking-wider">Inaccessible</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {inaccessible.map((region) => (
              <RegionCard key={region.id} region={region} status="inaccessible" />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function RegionCard({
  region,
  status,
  onClick,
}: {
  region: Region;
  status: "locked-in" | "selected" | "available" | "disabled" | "inaccessible";
  onClick?: () => void;
}) {
  const borderClass =
    status === "selected" ? "ring-2 ring-osrs-gold border-osrs-gold" :
    status === "locked-in" ? "border-osrs-green/50" :
    status === "inaccessible" ? "border-demon-glow/30 opacity-50" :
    status === "disabled" ? "opacity-40" :
    "border-osrs-border";

  return (
    <Card
      hover={status === "available" || status === "selected"}
      onClick={onClick}
      className={`${borderClass} ${onClick ? "cursor-pointer" : ""}`}
    >
      <div className="flex items-center justify-between mb-1">
        <h5 className="font-bold text-osrs-text text-sm">{region.name}</h5>
        {status === "locked-in" && <Badge variant="green">Auto</Badge>}
        {status === "selected" && <Badge variant="gold">Selected</Badge>}
        {status === "inaccessible" && <Badge variant="red">Locked</Badge>}
      </div>
      <p className="text-xs text-osrs-text-dim mb-2">{region.description}</p>
      <div className="flex flex-wrap gap-1">
        {region.keyContent.slice(0, 4).map((content, i) => (
          <span key={i} className="text-xs bg-osrs-darker/50 rounded px-1.5 py-0.5 text-osrs-text-dim">
            {content}
          </span>
        ))}
        {region.keyContent.length > 4 && (
          <span className="text-xs text-osrs-text-dim">+{region.keyContent.length - 4} more</span>
        )}
      </div>
      {region.echoBoss && (
        <div className="mt-2 text-xs text-demon-ember">
          Echo Boss: {region.echoBoss}
        </div>
      )}
    </Card>
  );
}
