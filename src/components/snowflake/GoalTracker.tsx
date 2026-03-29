"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import type { SnowflakeGoal, GoalCategory, GoalPriority } from "@/types/snowflake";

interface GoalTrackerProps {
  goals: SnowflakeGoal[];
  onChange: (goals: SnowflakeGoal[]) => void;
}

const CATEGORIES: GoalCategory[] = ["quest", "boss", "skill", "diary", "other"];
const PRIORITIES: GoalPriority[] = ["high", "medium", "low"];

const PRIORITY_COLORS: Record<GoalPriority, "red" | "gold" | "default"> = {
  high: "red",
  medium: "gold",
  low: "default",
};

const CATEGORY_COLORS: Record<GoalCategory, "blue" | "red" | "gold" | "purple" | "default"> = {
  quest: "blue",
  boss: "red",
  skill: "gold",
  diary: "purple",
  other: "default",
};

export function GoalTracker({ goals, onChange }: GoalTrackerProps) {
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState<GoalCategory>("other");
  const [newPriority, setNewPriority] = useState<GoalPriority>("medium");
  const [filterCategory, setFilterCategory] = useState<GoalCategory | "all">("all");
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "completed">("all");

  const addGoal = () => {
    if (!newTitle.trim()) return;
    const goal: SnowflakeGoal = {
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
      title: newTitle.trim(),
      category: newCategory,
      priority: newPriority,
      completed: false,
    };
    onChange([...goals, goal]);
    setNewTitle("");
  };

  const toggleGoal = (goalId: string) => {
    onChange(goals.map((g) => g.id === goalId ? { ...g, completed: !g.completed } : g));
  };

  const deleteGoal = (goalId: string) => {
    onChange(goals.filter((g) => g.id !== goalId));
  };

  const filtered = goals.filter((g) => {
    if (filterCategory !== "all" && g.category !== filterCategory) return false;
    if (filterStatus === "active" && g.completed) return false;
    if (filterStatus === "completed" && !g.completed) return false;
    return true;
  });

  const completedCount = goals.filter((g) => g.completed).length;
  const byCategory = CATEGORIES.map((cat) => ({
    cat,
    total: goals.filter((g) => g.category === cat).length,
    done: goals.filter((g) => g.category === cat && g.completed).length,
  })).filter((c) => c.total > 0);

  return (
    <div className="space-y-4">
      {/* Progress overview */}
      <Card>
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-bold text-osrs-text">Goal Progress</h3>
          <span className="text-sm text-osrs-blue font-bold">{completedCount} / {goals.length}</span>
        </div>
        {byCategory.length > 0 && (
          <div className="flex flex-wrap gap-3 mt-2">
            {byCategory.map(({ cat, total, done }) => (
              <div key={cat} className="text-xs">
                <Badge variant={CATEGORY_COLORS[cat]}>{cat}</Badge>
                <span className="ml-1 text-osrs-text-dim">{done}/{total}</span>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Add goal form */}
      <Card>
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addGoal()}
            placeholder="New goal..."
            className="flex-1 bg-osrs-darker border border-osrs-border rounded-lg px-3 py-2 text-sm text-osrs-text focus:border-osrs-blue focus:outline-none"
          />
          <select
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value as GoalCategory)}
            className="bg-osrs-darker border border-osrs-border rounded-lg px-2 py-2 text-sm text-osrs-text"
          >
            {CATEGORIES.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
          </select>
          <select
            value={newPriority}
            onChange={(e) => setNewPriority(e.target.value as GoalPriority)}
            className="bg-osrs-darker border border-osrs-border rounded-lg px-2 py-2 text-sm text-osrs-text"
          >
            {PRIORITIES.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
          <button
            onClick={addGoal}
            className="px-4 py-2 bg-osrs-blue text-white rounded-lg text-sm font-bold hover:bg-osrs-blue/90 transition-all"
          >
            Add
          </button>
        </div>
      </Card>

      {/* Filters */}
      <div className="flex gap-3 text-sm">
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value as GoalCategory | "all")}
          className="bg-osrs-darker border border-osrs-border rounded-lg px-2 py-1 text-xs text-osrs-text"
        >
          <option value="all">All categories</option>
          {CATEGORIES.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
        </select>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as "all" | "active" | "completed")}
          className="bg-osrs-darker border border-osrs-border rounded-lg px-2 py-1 text-xs text-osrs-text"
        >
          <option value="all">All goals</option>
          <option value="active">Active</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      {/* Goal list */}
      <div className="space-y-1">
        {filtered
          .sort((a, b) => {
            if (a.completed !== b.completed) return a.completed ? 1 : -1;
            const priorityOrder = { high: 0, medium: 1, low: 2 };
            return priorityOrder[a.priority] - priorityOrder[b.priority];
          })
          .map((goal) => (
            <div
              key={goal.id}
              className={`flex items-center gap-3 p-2 rounded-lg border transition-all ${
                goal.completed
                  ? "bg-osrs-green/5 border-osrs-green/20 opacity-70"
                  : "bg-osrs-panel border-osrs-border"
              }`}
            >
              <button
                onClick={() => toggleGoal(goal.id)}
                className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 ${
                  goal.completed ? "bg-osrs-green border-osrs-green text-white" : "border-osrs-border hover:border-osrs-blue"
                }`}
              >
                {goal.completed && (
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
              <div className="flex-1 min-w-0">
                <span className={`text-sm font-medium ${goal.completed ? "line-through text-osrs-text-dim" : "text-osrs-text"}`}>
                  {goal.title}
                </span>
              </div>
              <Badge variant={CATEGORY_COLORS[goal.category]} size="sm">{goal.category}</Badge>
              <Badge variant={PRIORITY_COLORS[goal.priority]} size="sm">{goal.priority}</Badge>
              <button
                onClick={() => deleteGoal(goal.id)}
                className="text-osrs-text-dim hover:text-demon-glow text-xs px-1"
              >
                x
              </button>
            </div>
          ))}
        {filtered.length === 0 && (
          <Card className="text-center py-4">
            <p className="text-osrs-text-dim text-sm">No goals yet. Add one above to get started.</p>
          </Card>
        )}
      </div>
    </div>
  );
}
