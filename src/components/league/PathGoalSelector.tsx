"use client";

import type { PathGoal } from "@/types/optimal-path";

interface PathGoalSelectorProps {
  goals: PathGoal[];
  selectedGoal: PathGoal | null;
  onSelect: (goal: PathGoal) => void;
  collapsed?: boolean;
  onToggle?: () => void;
  currentPoints?: number;
}

function ProgressRing({
  value,
  max,
  size = 32,
  color,
}: {
  value: number;
  max: number;
  size?: number;
  color: string;
}) {
  const radius = (size - 4) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(1, max > 0 ? value / max : 0);
  const offset = circumference * (1 - progress);

  return (
    <svg width={size} height={size} className="flex-shrink-0">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        className="progress-ring-bg"
        strokeWidth={3}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        className="progress-ring-fill"
        stroke={color}
        strokeWidth={3}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
      <text
        x="50%"
        y="50%"
        dominantBaseline="central"
        textAnchor="middle"
        className="fill-osrs-text"
        fontSize={size * 0.25}
        fontWeight="bold"
      >
        {Math.round(progress * 100)}%
      </text>
    </svg>
  );
}

export function PathGoalSelector({
  goals,
  selectedGoal,
  onSelect,
  collapsed = false,
  onToggle,
  currentPoints = 0,
}: PathGoalSelectorProps) {
  if (collapsed && selectedGoal) {
    return (
      <div className="flex items-center gap-3">
        <ProgressRing
          value={currentPoints}
          max={selectedGoal.targetPoints}
          size={36}
          color={selectedGoal.color}
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <div
              className="w-2.5 h-2.5 rounded-full flex-shrink-0"
              style={{ backgroundColor: selectedGoal.color }}
            />
            <span className="text-sm font-bold text-osrs-text truncate">
              {selectedGoal.label}
            </span>
            <span className="text-xs text-osrs-text-dim">
              {currentPoints.toLocaleString()} / {selectedGoal.targetPoints.toLocaleString()} pts
            </span>
          </div>
        </div>
        <button
          onClick={onToggle}
          className="text-xs text-osrs-gold hover:text-osrs-gold/80 transition-colors px-2 py-1 rounded border border-osrs-border/40 hover:border-osrs-gold/40"
        >
          Change
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h2
          className="text-lg font-bold text-osrs-gold"
          style={{ fontFamily: "var(--font-runescape)" }}
        >
          Select Your Goal
        </h2>
        {selectedGoal && onToggle && (
          <button
            onClick={onToggle}
            className="text-xs text-osrs-text-dim hover:text-osrs-gold transition-colors"
          >
            Collapse
          </button>
        )}
      </div>
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
