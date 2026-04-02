"use client";

import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import type { RegionGuide } from "@/types/league-guides";

const tierVariant = (t: string) => t === "S" ? "gold" : t === "A" ? "blue" : "default";
const typeVariant = (t: string) => t === "starting" ? "green" : t === "auto-unlock" ? "blue" : t === "inaccessible" ? "red" : "default";

export function RegionGuideSection({ guide }: { guide: RegionGuide }) {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-osrs-text-dim mb-2">{guide.intro}</p>
        <p className="text-sm text-osrs-blue">{guide.unlockMechanic}</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {guide.regions.map((region) => (
          <Card key={region.name} className={region.type === "inaccessible" ? "opacity-50" : ""}>
            <div className="flex items-start gap-3 mb-3">
              <Badge variant={tierVariant(region.tier)}>{region.tier}</Badge>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-osrs-text" style={{ fontFamily: "var(--font-runescape)" }}>
                    {region.name}
                  </h3>
                  <Badge variant={typeVariant(region.type)} size="sm">{region.type}</Badge>
                </div>
                {region.echoBoss && (
                  <p className="text-xs text-demon-glow mt-0.5">Echo Boss: {region.echoBoss}</p>
                )}
              </div>
            </div>
            {region.taskCount !== undefined && (
              <div className="flex gap-4 text-xs mb-2">
                <span><span className="text-osrs-text-dim">Tasks: </span><span className="text-osrs-text font-bold">{region.taskCount}</span></span>
                {region.totalPoints !== undefined && (
                  <span><span className="text-osrs-text-dim">Points: </span><span className="text-osrs-gold font-bold">{region.totalPoints.toLocaleString()}</span></span>
                )}
              </div>
            )}
            <div className="flex flex-wrap gap-1 mb-3">
              {region.highlights.map((h) => (
                <Badge key={h} variant="default" size="sm">{h}</Badge>
              ))}
            </div>
            {region.type !== "inaccessible" && (
              <div className="space-y-2 text-xs">
                <div>
                  <span className="text-osrs-green font-bold">Pick first if: </span>
                  <span className="text-osrs-text-dim">{region.pickFirstIf}</span>
                </div>
                <div>
                  <span className="text-demon-glow font-bold">Avoid if: </span>
                  <span className="text-osrs-text-dim">{region.avoidIf}</span>
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
