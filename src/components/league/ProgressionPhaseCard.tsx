"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ProgressBar } from "@/components/ui/ProgressBar";
import type { ProgressionPhase } from "@/types/optimal-path";
import type { TaskDifficulty } from "@/types/league";

interface ProgressionPhaseCardProps {
  phase: ProgressionPhase;
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

export function ProgressionPhaseCard({
  phase,
  goalPoints,
  goalColor,
}: ProgressionPhaseCardProps) {
  const [showAllTasks, setShowAllTasks] = useState(false);

  return (
    <Card className="relative">
      {/* Phase header — numbered circle + title (GettingStartedSection pattern) */}
      <div className="flex items-start gap-4">
        <div
          className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm"
          style={{
            backgroundColor: `${goalColor}20`,
            color: goalColor,
            border: `1px solid ${goalColor}40`,
          }}
        >
          {phase.phaseNumber}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
            <div>
              <h4
                className="font-bold text-osrs-text"
                style={{ fontFamily: "var(--font-runescape)" }}
              >
                Phase {phase.phaseNumber}: {phase.name}
              </h4>
              <p className="text-xs text-osrs-text-dim">
                {phase.allTasks.length} tasks &middot;{" "}
                {phase.totalPoints.toLocaleString()} pts needed
                <span className="mx-1">&middot;</span>
                {phase.startPoints.toLocaleString()} &rarr;{" "}
                {phase.endPoints.toLocaleString()} pts
              </p>
            </div>
            <div className="text-right shrink-0">
              <div className="text-sm font-bold text-osrs-gold">
                {phase.cumulativePoints.toLocaleString()} pts
              </div>
              <div className="text-xs text-osrs-text-dim">cumulative</div>
            </div>
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mt-3">
        <ProgressBar
          value={phase.cumulativePoints}
          max={goalPoints}
          color="bg-osrs-gold"
          size="sm"
          showText={false}
        />
      </div>

      {/* Relic choices */}
      {phase.relicChoices.length > 0 && (
        <div className="mt-4">
          <h5 className="text-xs font-bold text-osrs-gold mb-2 uppercase tracking-wider">
            Relic Choices
          </h5>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {phase.relicChoices.map((relic) => (
              <div
                key={relic.id}
                className="border border-osrs-border/40 rounded-lg bg-osrs-darker/30 p-2.5"
              >
                <div className="text-sm font-medium text-osrs-text">
                  {relic.name}
                </div>
                <p className="text-xs text-osrs-text-dim mt-0.5 line-clamp-2">
                  {relic.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Passive effects unlocked at this tier */}
      {phase.passiveEffects.length > 0 && (
        <div className="mt-3 p-2.5 bg-osrs-green/5 border border-osrs-green/20 rounded-lg">
          <p className="text-xs font-bold text-osrs-green mb-1 uppercase tracking-wider">
            Unlocks at This Tier
          </p>
          {phase.passiveEffects.map((effect, i) => (
            <p key={i} className="text-xs text-osrs-text-dim">
              &#x2605; {effect}
            </p>
          ))}
        </div>
      )}

      {/* Reward tiers crossed */}
      {phase.rewardTiersCrossed.length > 0 && (
        <div className="mt-3">
          {phase.rewardTiersCrossed.map((tier) => (
            <div
              key={tier.name}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg border mb-1.5 last:mb-0"
              style={{
                backgroundColor: `${tier.color}10`,
                borderColor: `${tier.color}30`,
              }}
            >
              <span className="text-sm">&#x1F3C6;</span>
              <span className="text-xs font-medium" style={{ color: tier.color }}>
                {tier.name} earned during this phase
              </span>
              <span className="text-xs text-osrs-text-dim ml-auto">
                {tier.pointsRequired.toLocaleString()} pts
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Category focus */}
      {phase.categoryFocus.length > 0 && (
        <div className="mt-3">
          <h5 className="text-xs font-bold text-osrs-gold mb-1.5 uppercase tracking-wider">
            Focus Areas
          </h5>
          <div className="flex flex-wrap gap-1.5">
            {phase.categoryFocus.map((entry) => (
              <Badge key={entry.category} variant="default" size="sm">
                {entry.category}: {entry.points.toLocaleString()} pts
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Key tasks (highlighted) */}
      {phase.highlightedTasks.length > 0 && (
        <div className="mt-3">
          <h5 className="text-xs font-bold text-osrs-gold mb-1.5 uppercase tracking-wider">
            Key Tasks
          </h5>
          <div className="space-y-1">
            {phase.highlightedTasks.map((task) => (
              <div
                key={task.id}
                className="flex items-center justify-between text-xs px-2 py-1 bg-osrs-darker/50 rounded"
              >
                <span className="text-osrs-text truncate mr-2">
                  <span className="text-osrs-green mr-1.5">&#x2726;</span>
                  {task.name}
                </span>
                <div className="flex items-center gap-1.5 shrink-0">
                  <Badge variant={DIFFICULTY_COLORS[task.difficulty]} size="sm">
                    {task.difficulty}
                  </Badge>
                  <span className="text-osrs-gold font-medium">
                    {task.points} pts
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Show all tasks toggle */}
      {phase.allTasks.length > phase.highlightedTasks.length && (
        <div className="mt-3">
          <button
            onClick={() => setShowAllTasks(!showAllTasks)}
            className="text-xs text-osrs-gold hover:text-osrs-gold/80 transition-colors font-medium"
          >
            {showAllTasks
              ? `\u25BE Hide full task list`
              : `\u25B8 Show all ${phase.allTasks.length} tasks`}
          </button>

          {showAllTasks && (
            <div className="mt-2 space-y-3">
              {phase.categoryGroups.map((group) => (
                <div key={group.category}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-osrs-text uppercase tracking-wider">
                      {group.category}
                    </span>
                    <span className="text-xs text-osrs-text-dim">
                      {group.tasks.length} task
                      {group.tasks.length !== 1 ? "s" : ""} &middot;{" "}
                      {group.totalPoints.toLocaleString()} pts
                    </span>
                  </div>
                  <div className="space-y-0.5">
                    {group.tasks.map((task) => (
                      <div
                        key={task.id}
                        className="flex items-center justify-between text-xs px-2 py-0.5 text-osrs-text-dim"
                      >
                        <span className="truncate mr-2">{task.name}</span>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <Badge
                            variant={DIFFICULTY_COLORS[task.difficulty]}
                            size="sm"
                          >
                            {task.difficulty}
                          </Badge>
                          <span className="text-osrs-gold">
                            {task.points} pts
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </Card>
  );
}
