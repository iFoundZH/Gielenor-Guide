"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/Badge";
import type { ProgressionResult } from "@/types/optimal-path";
import type { TaskDifficulty } from "@/types/league";

interface ProgressionSummaryCardProps {
  result: ProgressionResult;
  mode: "import" | "standalone";
  onModeChange: (mode: "import" | "standalone") => void;
  excludeCompleted: boolean;
  onExcludeCompletedChange: (v: boolean) => void;
  hasImportData: boolean;
}

const DIFFICULTY_COLORS: Record<
  TaskDifficulty,
  "green" | "blue" | "gold" | "purple" | "red"
> = {
  easy: "green",
  medium: "blue",
  hard: "gold",
  elite: "purple",
  master: "red",
};

export function ProgressionSummaryCard({
  result,
  mode,
  onModeChange,
  excludeCompleted,
  onExcludeCompletedChange,
  hasImportData,
}: ProgressionSummaryCardProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  return (
    <div className="space-y-2">
      {/* Compact summary bar */}
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="gold">{result.totalTasks} tasks</Badge>
        <Badge variant="gold">{result.totalPoints.toLocaleString()} pts</Badge>
        <Badge variant="default">{result.phases.length} phases</Badge>

        <button
          onClick={() => setShowDetails(!showDetails)}
          className="text-xs text-osrs-text-dim hover:text-osrs-gold transition-colors ml-1"
        >
          {showDetails ? "\u25BE Details" : "\u25B8 Details"}
        </button>

        {/* Settings dropdown */}
        <div className="relative ml-auto">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="text-xs text-osrs-text-dim hover:text-osrs-gold transition-colors p-1 rounded border border-osrs-border/40 hover:border-osrs-gold/40"
            title="Settings"
          >
            &#x2699;
          </button>
          {showSettings && (
            <div className="absolute right-0 top-full mt-1 z-20 bg-osrs-panel border border-osrs-border rounded-lg shadow-lg p-3 min-w-[200px]">
              {/* Mode toggle */}
              <div className="flex rounded-lg border border-osrs-border overflow-hidden text-xs mb-2">
                <button
                  onClick={() => onModeChange("import")}
                  disabled={!hasImportData}
                  className={`px-3 py-1.5 flex-1 transition-all ${
                    mode === "import"
                      ? "bg-osrs-gold/20 text-osrs-gold"
                      : "text-osrs-text-dim hover:text-osrs-gold"
                  } ${!hasImportData ? "opacity-40 cursor-not-allowed" : ""}`}
                >
                  Import
                </button>
                <button
                  onClick={() => onModeChange("standalone")}
                  className={`px-3 py-1.5 flex-1 transition-all border-l border-osrs-border ${
                    mode === "standalone"
                      ? "bg-osrs-gold/20 text-osrs-gold"
                      : "text-osrs-text-dim hover:text-osrs-gold"
                  }`}
                >
                  Manual
                </button>
              </div>

              {/* Exclude completed toggle */}
              <label className="flex items-center gap-2 cursor-pointer text-xs text-osrs-text-dim">
                <input
                  type="checkbox"
                  checked={excludeCompleted}
                  onChange={(e) => onExcludeCompletedChange(e.target.checked)}
                  className="rounded border-osrs-border bg-osrs-darker"
                />
                Exclude completed tasks
              </label>
            </div>
          )}
        </div>
      </div>

      {/* Collapsible details */}
      {showDetails && (
        <div className="flex flex-wrap gap-1.5 pt-1">
          {(
            Object.keys(result.difficultyBreakdown) as TaskDifficulty[]
          )
            .filter((d) => result.difficultyBreakdown[d] > 0)
            .map((d) => (
              <Badge key={d} variant={DIFFICULTY_COLORS[d]} size="sm">
                {result.difficultyBreakdown[d]} {d}
              </Badge>
            ))}
        </div>
      )}

      {/* Info banner when relic thresholds are not available */}
      {!result.hasRelicThresholds && (
        <div className="p-2.5 bg-osrs-blue/10 border border-osrs-blue/30 rounded-lg">
          <p className="text-xs text-osrs-blue font-medium">
            Phases organized by difficulty &mdash; updates to relic-tier milestones once wiki data is available.
          </p>
        </div>
      )}

      {/* Shortfall warning (always visible) */}
      {!result.isAchievable && (
        <div className="p-2.5 bg-demon-glow/10 border border-demon-glow/30 rounded-lg">
          <p className="text-xs text-demon-glow font-medium">
            Goal exceeds accessible points by{" "}
            {result.pointsShortfall.toLocaleString()} pts
          </p>
          <p className="text-[10px] text-osrs-text-dim mt-0.5">
            Unlock more regions or complete additional tasks to reach this goal.
          </p>
        </div>
      )}
    </div>
  );
}
