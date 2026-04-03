"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ProgressBar } from "@/components/ui/ProgressBar";
import type { PathStage } from "@/types/optimal-path";
import type { TaskDifficulty } from "@/types/league";

interface PathStageCardProps {
  stage: PathStage;
  goalPoints: number;
  goalColor: string;
}

const DIFFICULTY_COLORS: Record<TaskDifficulty, "green" | "blue" | "gold" | "purple" | "red"> = {
  easy: "green",
  medium: "blue",
  hard: "gold",
  elite: "purple",
  master: "red",
};

export function PathStageCard({ stage, goalPoints, goalColor }: PathStageCardProps) {
  const [expanded, setExpanded] = useState(false);

  const milestoneIcon = stage.milestone.type === "relic-unlock" ? "🔓" : "🏆";

  // Group tasks by category for the expanded view
  const categories = Object.entries(stage.tasksByCategory).sort(
    (a, b) => b[1] - a[1]
  );

  return (
    <Card className="relative">
      {/* Stage header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0"
            style={{
              backgroundColor: `${goalColor}20`,
              color: goalColor,
              border: `1px solid ${goalColor}40`,
            }}
          >
            {stage.stageNumber}
          </div>
          <div>
            <h4 className="text-sm font-bold text-osrs-text">
              {milestoneIcon} {stage.milestone.label}
            </h4>
            <p className="text-xs text-osrs-text-dim">
              {stage.tasks.length} tasks &middot;{" "}
              {stage.stagePoints.toLocaleString()} pts this stage
            </p>
          </div>
        </div>

        <div className="text-right">
          <div className="text-sm font-bold text-osrs-gold">
            {stage.cumulativePoints.toLocaleString()} pts
          </div>
          <div className="text-xs text-osrs-text-dim">cumulative</div>
        </div>
      </div>

      {/* Progress toward goal */}
      <ProgressBar
        value={stage.cumulativePoints}
        max={goalPoints}
        color="bg-osrs-gold"
        size="sm"
        showText={false}
      />

      {/* Passive effects unlocked at this milestone */}
      {stage.milestone.passiveEffects.length > 0 && (
        <div className="mt-3 p-2 bg-osrs-green/5 border border-osrs-green/20 rounded-lg">
          <p className="text-xs font-medium text-osrs-green mb-1">Unlocks:</p>
          {stage.milestone.passiveEffects.map((effect, i) => (
            <p key={i} className="text-xs text-osrs-text-dim">
              &bull; {effect}
            </p>
          ))}
        </div>
      )}

      {/* Difficulty distribution */}
      <div className="flex flex-wrap gap-1.5 mt-3">
        {(Object.keys(stage.tasksByDifficulty) as TaskDifficulty[])
          .filter((d) => stage.tasksByDifficulty[d] > 0)
          .map((d) => (
            <Badge key={d} variant={DIFFICULTY_COLORS[d]} size="sm">
              {stage.tasksByDifficulty[d]} {d}
            </Badge>
          ))}
      </div>

      {/* Expand/collapse task list */}
      {stage.tasks.length > 0 && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-3 text-xs text-osrs-gold hover:underline"
        >
          {expanded ? "Hide tasks" : `Show ${stage.tasks.length} tasks`}
        </button>
      )}

      {expanded && (
        <div className="mt-3 space-y-3 max-h-96 overflow-y-auto">
          {categories.map(([category, count]) => (
            <div key={category}>
              <h5 className="text-xs font-bold text-osrs-text-dim mb-1">
                {category} ({count})
              </h5>
              <div className="space-y-1">
                {stage.tasks
                  .filter((t) => t.category === category)
                  .map((task) => (
                    <div
                      key={task.id}
                      className="flex items-center justify-between text-xs px-2 py-1 bg-osrs-darker/50 rounded"
                    >
                      <span className="text-osrs-text">{task.name}</span>
                      <div className="flex items-center gap-2 shrink-0">
                        <Badge variant={DIFFICULTY_COLORS[task.difficulty]} size="sm">
                          {task.points} pts
                        </Badge>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
