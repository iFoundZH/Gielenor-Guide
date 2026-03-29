"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Tabs } from "@/components/ui/Tabs";
import type { ContentAvailability } from "@/types/snowflake";

interface ContentAvailabilityPanelProps {
  availability: ContentAvailability;
}

export function ContentAvailabilityPanel({ availability }: ContentAvailabilityPanelProps) {
  const [showBlocked, setShowBlocked] = useState(false);
  const [search, setSearch] = useState("");

  const tabs = [
    { id: "quests", label: "Quests", count: availability.availableQuestCount },
    { id: "bosses", label: "Bosses", count: availability.availableBossCount },
  ];

  return (
    <div>
      <Card className="mb-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-xs text-osrs-text-dim mb-1">Quests Available</div>
            <ProgressBar
              value={availability.availableQuestCount}
              max={availability.totalQuestCount}
              color="bg-osrs-blue"
              size="sm"
            />
          </div>
          <div>
            <div className="text-xs text-osrs-text-dim mb-1">Bosses Available</div>
            <ProgressBar
              value={availability.availableBossCount}
              max={availability.totalBossCount}
              color="bg-osrs-blue"
              size="sm"
            />
          </div>
        </div>
      </Card>

      <div className="flex items-center gap-3 mb-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search content..."
          className="flex-1 bg-osrs-darker border border-osrs-border rounded-lg px-3 py-2 text-sm text-osrs-text focus:border-osrs-blue focus:outline-none"
        />
        <label className="flex items-center gap-2 text-sm text-osrs-text-dim cursor-pointer whitespace-nowrap">
          <input type="checkbox" checked={showBlocked} onChange={(e) => setShowBlocked(e.target.checked)} className="rounded" />
          Show blocked
        </label>
      </div>

      <Tabs tabs={tabs} defaultTab="quests">
        {(activeTab) => {
          const items = activeTab === "bosses" ? availability.bosses : availability.quests;
          const filtered = items
            .filter((item) => {
              if (!showBlocked && !item.available) return false;
              if (search && !item.name.toLowerCase().includes(search.toLowerCase())) return false;
              return true;
            })
            .sort((a, b) => {
              if (a.available !== b.available) return a.available ? -1 : 1;
              return a.name.localeCompare(b.name);
            });

          return (
            <div className="space-y-1">
              {filtered.map((item) => (
                <div
                  key={item.id}
                  className={`flex items-start gap-3 p-2 rounded-lg border text-sm ${
                    item.available
                      ? "bg-osrs-panel border-osrs-border"
                      : "bg-osrs-darker/50 border-osrs-border/50 opacity-60"
                  }`}
                >
                  <span className={`flex-shrink-0 mt-0.5 text-xs ${item.available ? "text-osrs-green" : "text-demon-glow"}`}>
                    {item.available ? "O" : "X"}
                  </span>
                  <div className="flex-1 min-w-0">
                    <span className="font-medium text-osrs-text">{item.name}</span>
                    {item.blockers.length > 0 && (
                      <div className="mt-1 flex flex-wrap gap-1">
                        {item.blockers.map((b, i) => (
                          <Badge
                            key={i}
                            variant={b.type === "region" ? "blue" : b.type === "skill" ? "gold" : "purple"}
                            size="sm"
                          >
                            {b.description}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {filtered.length === 0 && (
                <Card className="text-center py-4">
                  <p className="text-osrs-text-dim text-sm">
                    {showBlocked ? "No content matches your search." : "All matching content is blocked by your restrictions."}
                  </p>
                </Card>
              )}
            </div>
          );
        }}
      </Tabs>
    </div>
  );
}
