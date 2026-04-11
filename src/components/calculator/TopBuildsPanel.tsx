"use client";

import type { OptimizerResult, BuildLoadout } from "@/types/dps";

interface Props {
  results: OptimizerResult[];
  isRunning: boolean;
  onSelect: (loadout: BuildLoadout) => void;
  onOptimize: () => void;
}

export function TopBuildsPanel({ results, isRunning, onSelect, onOptimize }: Props) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-osrs-gold uppercase tracking-wider">Top Builds</h3>
        <button
          onClick={onOptimize}
          disabled={isRunning}
          className="px-4 py-1.5 rounded-lg text-xs font-medium bg-gradient-to-r from-demon-glow to-demon-ember text-white hover:opacity-90 disabled:opacity-50 transition-all"
        >
          {isRunning ? "Optimizing..." : "Optimize"}
        </button>
      </div>

      {results.length === 0 && !isRunning && (
        <div className="text-xs text-osrs-text-dim text-center py-8">
          Click Optimize to find the best gear
        </div>
      )}

      <div className="space-y-2">
        {results.map((r, i) => {
          const weapon = r.loadout.weapon;
          const keyItems = getKeyItems(r.loadout);

          return (
            <button
              key={i}
              onClick={() => onSelect(r.loadout)}
              className="w-full text-left bg-osrs-darker rounded-lg border border-osrs-border hover:border-osrs-gold/40 p-3 transition-all group"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-bold text-osrs-gold group-hover:text-glow-gold">
                  #{i + 1} — {r.result.dps.toFixed(2)} DPS
                </span>
                <span className="text-[10px] text-osrs-text-dim">
                  {(r.result.accuracy * 100).toFixed(1)}% acc
                </span>
              </div>
              <div className="text-xs text-osrs-text">
                {weapon?.name ?? "No weapon"}
              </div>
              {keyItems.length > 0 && (
                <div className="text-[10px] text-osrs-text-dim mt-0.5 truncate">
                  {keyItems.join(" + ")}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function getKeyItems(loadout: BuildLoadout): string[] {
  const items: string[] = [];
  if (loadout.head) items.push(loadout.head.name);
  if (loadout.body) items.push(loadout.body.name);
  if (loadout.neck) items.push(loadout.neck.name);
  if (loadout.ring) items.push(loadout.ring.name);
  return items.slice(0, 3);
}
