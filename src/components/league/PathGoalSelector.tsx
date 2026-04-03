"use client";

import type { PathGoal } from "@/types/optimal-path";

interface PathGoalSelectorProps {
  goals: PathGoal[];
  selectedGoal: PathGoal | null;
  onSelect: (goal: PathGoal) => void;
}

export function PathGoalSelector({ goals, selectedGoal, onSelect }: PathGoalSelectorProps) {
  return (
    <div>
      <h2
        className="text-lg font-bold text-osrs-gold mb-3"
        style={{ fontFamily: "var(--font-runescape)" }}
      >
        Select Your Goal
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {goals.map((goal) => {
          const isSelected = selectedGoal?.targetPoints === goal.targetPoints && selectedGoal?.type === goal.type;
          return (
            <button
              key={`${goal.type}-${goal.targetPoints}`}
              onClick={() => onSelect(goal)}
              className={`rounded-xl border p-3 text-left transition-all ${
                isSelected
                  ? "border-osrs-gold bg-osrs-gold/10 border-glow-gold"
                  : "border-osrs-border bg-osrs-panel hover:border-osrs-gold/50 hover:bg-osrs-panel-hover"
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: goal.color }}
                />
                <span className="text-sm font-bold text-osrs-text">
                  {goal.label}
                </span>
              </div>
              <div className="text-xs text-osrs-text-dim">
                {goal.targetPoints.toLocaleString()} pts
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
