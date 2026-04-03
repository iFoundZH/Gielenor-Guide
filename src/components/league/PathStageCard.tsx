"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ProgressBar } from "@/components/ui/ProgressBar";
import type { PathStage, TaskCluster } from "@/types/optimal-path";
import type { TaskDifficulty } from "@/types/league";

interface PathStageCardProps {
  stage: PathStage;
  goalPoints: number;
  goalColor: string;
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

function ClusterCard({ cluster }: { cluster: TaskCluster }) {
  const [expanded, setExpanded] = useState(false);

  const difficulties = (
    Object.keys(cluster.tasksByDifficulty) as TaskDifficulty[]
  ).filter((d) => cluster.tasksByDifficulty[d] > 0);

  return (
    <div className="border border-osrs-border/40 rounded-lg bg-osrs-darker/30">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left px-3 py-2 flex items-center justify-between gap-2 hover:bg-osrs-dark/30 transition-colors rounded-lg"
      >
        <div className="min-w-0">
          <div className="text-sm font-medium text-osrs-text truncate">
            {cluster.label}
          </div>
          <div className="flex flex-wrap gap-1 mt-1">
            {difficulties.map((d) => (
              <Badge key={d} variant={DIFFICULTY_COLORS[d]} size="sm">
                {cluster.tasksByDifficulty[d]} {d}
              </Badge>
            ))}
          </div>
        </div>
        <div className="text-right shrink-0">
          <div className="text-sm font-bold text-osrs-gold">
            {cluster.totalPoints.toLocaleString()} pts
          </div>
          <div className="text-xs text-osrs-text-dim">
            {cluster.tasks.length} task{cluster.tasks.length !== 1 ? "s" : ""}
            {cluster.estimatedMinutes > 0 &&
              ` · ~${formatTime(cluster.estimatedMinutes)}`}
          </div>
        </div>
      </button>

      {expanded && (
        <div className="px-3 pb-2 space-y-1 border-t border-osrs-border/20 pt-2">
          {cluster.tasks.map((task) => (
            <div
              key={task.id}
              className="flex items-center justify-between text-xs px-2 py-1 bg-osrs-darker/50 rounded"
            >
              <span className="text-osrs-text truncate mr-2">{task.name}</span>
              <Badge
                variant={DIFFICULTY_COLORS[task.difficulty]}
                size="sm"
              >
                {task.points} pts
              </Badge>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function PathStageCard({
  stage,
  goalPoints,
  goalColor,
}: PathStageCardProps) {
  const milestoneIcon =
    stage.milestone.type === "relic-unlock" ? "\u{1F513}" : "\u{1F3C6}";

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
              {stage.name}
              <span className="font-normal text-osrs-text-dim ml-2">
                {milestoneIcon} {stage.milestone.label}
              </span>
            </h4>
            <p className="text-xs text-osrs-text-dim">
              {stage.tasks.length} tasks &middot;{" "}
              {stage.stagePoints.toLocaleString()} pts
              {stage.estimatedMinutes > 0 &&
                ` · ~${formatTime(stage.estimatedMinutes)}`}
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

      {/* Task clusters */}
      {stage.clusters.length > 0 && (
        <div className="mt-3 space-y-2">
          {stage.clusters.map((cluster, i) => (
            <ClusterCard key={`${cluster.label}-${i}`} cluster={cluster} />
          ))}
        </div>
      )}
    </Card>
  );
}
