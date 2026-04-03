"use client";

import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import type { OptimalPathResult } from "@/types/optimal-path";
import type { TaskDifficulty } from "@/types/league";

interface PathSummaryCardProps {
  result: OptimalPathResult;
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

function formatTime(minutes: number): string {
  if (minutes < 60) return `${minutes}m`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

export function PathSummaryCard({
  result,
  mode,
  onModeChange,
  excludeCompleted,
  onExcludeCompletedChange,
  hasImportData,
}: PathSummaryCardProps) {
  return (
    <Card>
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h3
            className="text-lg font-bold text-osrs-gold mb-2"
            style={{ fontFamily: "var(--font-runescape)" }}
          >
            Path Summary
          </h3>
          <div className="flex flex-wrap gap-2 mb-3">
            <Badge variant="gold">{result.totalTasks} tasks</Badge>
            <Badge variant="gold">
              {result.totalPoints.toLocaleString()} pts
            </Badge>
            <Badge variant="default">{result.stages.length} stages</Badge>
            {result.totalEstimatedMinutes > 0 && (
              <Badge variant="default">
                ~{formatTime(result.totalEstimatedMinutes)}
              </Badge>
            )}
          </div>

          {/* Difficulty breakdown */}
          <div className="flex flex-wrap gap-1.5">
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
        </div>

        {/* Controls */}
        <div className="flex flex-col gap-2 sm:items-end shrink-0">
          {/* Mode toggle */}
          <div className="flex rounded-lg border border-osrs-border overflow-hidden text-xs">
            <button
              onClick={() => onModeChange("import")}
              disabled={!hasImportData}
              className={`px-3 py-1.5 transition-all ${
                mode === "import"
                  ? "bg-osrs-gold/20 text-osrs-gold"
                  : "text-osrs-text-dim hover:text-osrs-gold"
              } ${!hasImportData ? "opacity-40 cursor-not-allowed" : ""}`}
            >
              Import from Planner
            </button>
            <button
              onClick={() => onModeChange("standalone")}
              className={`px-3 py-1.5 transition-all border-l border-osrs-border ${
                mode === "standalone"
                  ? "bg-osrs-gold/20 text-osrs-gold"
                  : "text-osrs-text-dim hover:text-osrs-gold"
              }`}
            >
              Configure Manually
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
      </div>

      {/* Shortfall warning */}
      {!result.isAchievable && (
        <div className="mt-4 p-3 bg-demon-glow/10 border border-demon-glow/30 rounded-lg">
          <p className="text-sm text-demon-glow font-medium">
            Goal exceeds accessible points by{" "}
            {result.pointsShortfall.toLocaleString()} pts
          </p>
          <p className="text-xs text-osrs-text-dim mt-1">
            Unlock more regions or complete additional tasks to reach this goal.
            The path below shows the maximum progress achievable with current
            selections.
          </p>
        </div>
      )}
    </Card>
  );
}
