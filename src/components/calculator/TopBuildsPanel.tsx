"use client";

import type { OptimizerResult, OptimizedConfig, BuildLoadout } from "@/types/dps";

interface Props {
  results: OptimizerResult[];
  isRunning: boolean;
  onSelect: (loadout: BuildLoadout, optimizedConfig?: OptimizedConfig) => void;
  onOptimize: () => void;
}

const LABEL_MAP: Record<string, string> = {
  "super-combat": "Super Combat",
  "super-attack": "Super Attack",
  "super-strength": "Super Strength",
  "ranging": "Ranging Pot",
  "magic": "Magic Pot",
  "overload": "Overload",
  "smelling-salts": "Smelling Salts",
  "piety": "Piety",
  "chivalry": "Chivalry",
  "rigour": "Rigour",
  "eagle-eye": "Eagle Eye",
  "augury": "Augury",
  "mystic-might": "Mystic Might",
  "accurate": "Accurate",
  "aggressive": "Aggressive",
  "controlled": "Controlled",
  "defensive": "Defensive",
  "rapid": "Rapid",
  "longrange": "Longrange",
  "autocast": "Autocast",
  "void": "Void",
  "elite-void": "Elite Void",
};

const STARTING_REGIONS = new Set(["varlamore", "karamja", "misthalin"]);
const REGION_LABELS: Record<string, string> = {
  asgarnia: "Asgarnia", fremennik: "Fremennik", kandarin: "Kandarin",
  morytania: "Morytania", desert: "Desert", tirannwn: "Tirannwn",
  kourend: "Kourend", wilderness: "Wilderness",
};

function formatOptimizedConfig(opt?: OptimizedConfig): string | null {
  if (!opt) return null;
  const parts: string[] = [];
  if (opt.prayerType && opt.prayerType !== "none") parts.push(LABEL_MAP[opt.prayerType] ?? opt.prayerType);
  if (opt.potion && opt.potion !== "none") parts.push(LABEL_MAP[opt.potion] ?? opt.potion);
  if (opt.attackStyle) parts.push(LABEL_MAP[opt.attackStyle] ?? opt.attackStyle);
  if (opt.voidSet && opt.voidSet !== "none") parts.push(LABEL_MAP[opt.voidSet] ?? opt.voidSet);
  if (opt.activePacts && opt.activePacts.length > 0) parts.push(`${opt.activePacts.length} pacts`);
  return parts.length > 0 ? parts.join(" · ") : null;
}

function formatRegions(opt?: OptimizedConfig): string | null {
  if (!opt?.regions) return null;
  const chosen = opt.regions.filter(r => !STARTING_REGIONS.has(r));
  if (chosen.length === 0) return null;
  return chosen.map(r => REGION_LABELS[r] ?? r).join(" + ");
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

      {results.length > 0 && results[0].combinationsEvaluated && (
        <div className="text-[10px] text-osrs-text-dim text-center">
          {results[0].combinationsEvaluated.toLocaleString()} combinations evaluated
        </div>
      )}

      {results.length === 0 && !isRunning && (
        <div className="text-xs text-osrs-text-dim text-center py-8">
          Click Optimize to find the best gear
        </div>
      )}

      <div className="space-y-2">
        {results.map((r, i) => {
          const weapon = r.loadout.weapon;
          const keyItems = getKeyItems(r.loadout);
          const configLabel = formatOptimizedConfig(r.optimizedConfig);
          const regionLabel = formatRegions(r.optimizedConfig);

          return (
            <button
              key={i}
              onClick={() => onSelect(r.loadout, r.optimizedConfig)}
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
              {configLabel && (
                <div className="text-[10px] text-demon-glow mt-1 truncate">
                  {configLabel}
                </div>
              )}
              {regionLabel && (
                <div className="text-[10px] text-osrs-gold/70 mt-0.5 truncate">
                  Regions: {regionLabel}
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
