"use client";

import { useState, useMemo } from "react";
import { Region, LeagueTask } from "@/types/league";
import { RegionAnalysis } from "@/types/efficiency-guide";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { RegionDetailPanel } from "@/components/league/RegionDetailPanel";
import { computeRegionStats } from "@/lib/region-stats";
import { REGION_BOSSES } from "@/lib/build-analysis";

interface RegionPickerProps {
  regions: Region[];
  maxRegions: number;
  selectedRegions: string[];
  onToggle?: (regionId: string) => void;
  tasks?: LeagueTask[];
  regionAnalysis?: RegionAnalysis[];
}

export function RegionPicker({ regions, maxRegions, selectedRegions, onToggle, tasks, regionAnalysis }: RegionPickerProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const choosableRegions = regions.filter((r) => r.type === "choosable");
  const fixedRegions = regions.filter((r) => r.type === "starting" || r.type === "auto-unlock");
  const inaccessible = regions.filter((r) => r.type === "inaccessible");
  const selectedCount = selectedRegions.length;
  const hasDetailData = tasks && tasks.length > 0;

  const expandedStats = useMemo(() => {
    if (!expandedId || !tasks) return null;
    return computeRegionStats(expandedId, tasks, regionAnalysis);
  }, [expandedId, tasks, regionAnalysis]);

  const toggleExpand = (regionId: string) => {
    setExpandedId((prev) => (prev === regionId ? null : regionId));
  };

  const renderRegionGroup = (regionList: Region[], getStatus: (r: Region) => "locked-in" | "selected" | "available" | "disabled" | "inaccessible") => {
    const items: React.ReactNode[] = [];
    for (const region of regionList) {
      const status = getStatus(region);
      const canClick = status === "available" || status === "selected";

      items.push(
        <RegionCard
          key={region.id}
          region={region}
          status={status}
          onClick={onToggle && canClick ? () => onToggle(region.id) : undefined}
          hasDetailData={!!hasDetailData}
          isExpanded={expandedId === region.id}
          onToggleExpand={() => toggleExpand(region.id)}
          tasks={tasks}
          regionAnalysis={regionAnalysis}
        />
      );

      // Render detail panel inline after expanded card
      if (expandedId === region.id && expandedStats) {
        items.push(
          <div key={`${region.id}-detail`} style={{ gridColumn: "1 / -1" }}>
            <RegionDetailPanel stats={expandedStats} echoBoss={region.echoBoss} />
          </div>
        );
      }
    }
    return items;
  };

  return (
    <div className="space-y-6">
      {/* Fixed regions */}
      {fixedRegions.length > 0 && (
        <div>
          <h4 className="text-sm font-bold text-osrs-text-dim mb-3 uppercase tracking-wider">Always Available</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {renderRegionGroup(fixedRegions, () => "locked-in")}
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
            {renderRegionGroup(choosableRegions, (region) => {
              const isSelected = selectedRegions.includes(region.id);
              const canSelect = isSelected || selectedCount < maxRegions;
              return isSelected ? "selected" : canSelect ? "available" : "disabled";
            })}
          </div>
        </div>
      )}

      {/* Inaccessible */}
      {inaccessible.length > 0 && (
        <div>
          <h4 className="text-sm font-bold text-demon-glow mb-3 uppercase tracking-wider">Inaccessible</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {renderRegionGroup(inaccessible, () => "inaccessible")}
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
  hasDetailData,
  isExpanded,
  onToggleExpand,
  tasks,
  regionAnalysis,
}: {
  region: Region;
  status: "locked-in" | "selected" | "available" | "disabled" | "inaccessible";
  onClick?: () => void;
  hasDetailData: boolean;
  isExpanded: boolean;
  onToggleExpand: () => void;
  tasks?: LeagueTask[];
  regionAnalysis?: RegionAnalysis[];
}) {
  const borderClass =
    status === "selected" ? "ring-2 ring-osrs-gold border-osrs-gold" :
    status === "locked-in" ? "border-osrs-green/50" :
    status === "inaccessible" ? "border-demon-glow/30 opacity-50" :
    status === "disabled" ? "opacity-40" :
    "border-osrs-border";

  // Compact stat line from regionAnalysis
  const analysis = regionAnalysis?.find((a) => a.regionId === region.id);
  const bossCount = tasks ? computeQuickBossCount(region.id) : null;

  return (
    <Card
      hover={status === "available" || status === "selected"}
      onClick={onClick}
      className={`${borderClass} ${onClick ? "cursor-pointer" : ""}`}
    >
      <div className="flex items-center justify-between mb-1">
        <h5 className="font-bold text-osrs-text text-sm">{region.name}</h5>
        <div className="flex items-center gap-1.5">
          {status === "locked-in" && <Badge variant="green">Auto</Badge>}
          {status === "selected" && <Badge variant="gold">Selected</Badge>}
          {status === "inaccessible" && <Badge variant="red">Locked</Badge>}
          {hasDetailData && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleExpand();
              }}
              className={`p-1 rounded-md transition-colors ${
                isExpanded
                  ? "text-osrs-gold bg-osrs-gold/10"
                  : "text-osrs-text-dim hover:text-osrs-gold hover:bg-osrs-gold/10"
              }`}
              title={isExpanded ? "Collapse details" : "Expand details"}
            >
              <svg
                className={`w-4 h-4 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          )}
        </div>
      </div>
      <p className="text-xs text-osrs-text-dim mb-2">{region.description}</p>

      {/* Compact stat line */}
      {hasDetailData && (bossCount != null || analysis) && (
        <div className="flex items-center gap-2 mb-2 text-xs">
          {analysis?.tier && (
            <span className={`font-bold ${
              analysis.tier === "S" ? "text-osrs-gold" :
              analysis.tier === "A" ? "text-osrs-green" :
              "text-osrs-blue"
            }`}>
              {analysis.tier}
            </span>
          )}
          {bossCount != null && bossCount > 0 && (
            <span className="text-osrs-text-dim">{bossCount} bosses</span>
          )}
          {analysis && analysis.totalPoints > 0 && (
            <span className="text-osrs-text-dim">{analysis.totalPoints.toLocaleString()} pts</span>
          )}
        </div>
      )}

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

function computeQuickBossCount(regionId: string): number {
  const bosses = REGION_BOSSES[regionId];
  return bosses ? bosses.length : 0;
}
