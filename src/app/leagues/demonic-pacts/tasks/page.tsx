"use client";

import { useState, useEffect, useMemo } from "react";
import { demonicPactsLeague } from "@/data/demonic-pacts";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ProgressBar } from "@/components/ui/ProgressBar";
import type { TaskDifficulty } from "@/types/league";
import Link from "next/link";

const difficultyColors: Record<TaskDifficulty, "green" | "blue" | "gold" | "purple" | "red"> = {
  easy: "green",
  medium: "blue",
  hard: "gold",
  elite: "purple",
  master: "red",
};

const STORAGE_KEY = "gielinor-completed-tasks";

export default function TaskTracker() {
  const league = demonicPactsLeague;
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const [filterDifficulty, setFilterDifficulty] = useState<TaskDifficulty | "all">("all");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [showCompleted, setShowCompleted] = useState(true);

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setCompleted(new Set(JSON.parse(saved)));
      } catch { /* ignore */ }
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...completed]));
  }, [completed]);

  const toggleTask = (taskId: string) => {
    setCompleted((prev) => {
      const next = new Set(prev);
      if (next.has(taskId)) {
        next.delete(taskId);
      } else {
        next.add(taskId);
      }
      return next;
    });
  };

  const categories = useMemo(
    () => Array.from(new Set(league.tasks.map((t) => t.category))).sort(),
    [league.tasks]
  );

  const filteredTasks = useMemo(() => {
    return league.tasks.filter((task) => {
      if (filterDifficulty !== "all" && task.difficulty !== filterDifficulty) return false;
      if (filterCategory !== "all" && task.category !== filterCategory) return false;
      if (!showCompleted && completed.has(task.id)) return false;
      if (search && !task.name.toLowerCase().includes(search.toLowerCase()) &&
          !task.description.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [league.tasks, filterDifficulty, filterCategory, showCompleted, search, completed]);

  const totalPoints = league.tasks.reduce((sum, t) => sum + t.points, 0);
  const earnedPoints = league.tasks
    .filter((t) => completed.has(t.id))
    .reduce((sum, t) => sum + t.points, 0);

  const completedByDifficulty = (diff: TaskDifficulty) => {
    const tasks = league.tasks.filter((t) => t.difficulty === diff);
    const done = tasks.filter((t) => completed.has(t.id));
    return { total: tasks.length, done: done.length };
  };

  // Find current reward tier
  const currentTier = league.rewardTiers
    .filter((t) => earnedPoints >= t.pointsRequired)
    .pop();
  const nextTier = league.rewardTiers.find((t) => earnedPoints < t.pointsRequired);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-3 text-sm text-osrs-text-dim">
        <Link href="/" className="hover:text-osrs-gold">Home</Link>
        <span>/</span>
        <Link href="/leagues/demonic-pacts" className="hover:text-osrs-gold">Demonic Pacts</Link>
        <span>/</span>
        <span className="text-osrs-gold">Task Tracker</span>
      </div>

      <h1
        className="text-3xl font-bold text-osrs-gold text-glow-gold mb-2"
        style={{ fontFamily: "var(--font-runescape)" }}
      >
        Task Tracker
      </h1>
      <p className="text-osrs-text-dim mb-8">
        Track your progress across all {league.tasks.length} league tasks.
        Click a task to mark it complete.
      </p>

      {/* Progress Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-8">
        <Card glow="gold" className="lg:col-span-2">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-osrs-text">Overall Progress</h3>
            <span className="text-sm text-osrs-gold font-bold">
              {completed.size} / {league.tasks.length} tasks
            </span>
          </div>
          <ProgressBar
            value={earnedPoints}
            max={totalPoints}
            color="bg-gradient-to-r from-osrs-gold to-demon-ember"
            size="lg"
          />
          <div className="mt-3 flex items-center gap-4 text-sm">
            <div>
              <span className="text-osrs-text-dim">Points: </span>
              <span className="text-osrs-gold font-bold">{earnedPoints.toLocaleString()}</span>
            </div>
            {currentTier && (
              <div>
                <span className="text-osrs-text-dim">Tier: </span>
                <span className="font-bold" style={{ color: currentTier.color }}>
                  {currentTier.name}
                </span>
              </div>
            )}
            {nextTier && (
              <div>
                <span className="text-osrs-text-dim">Next: </span>
                <span className="font-bold" style={{ color: nextTier.color }}>
                  {nextTier.name} ({(nextTier.pointsRequired - earnedPoints).toLocaleString()} pts)
                </span>
              </div>
            )}
          </div>
        </Card>

        <Card className="lg:col-span-2">
          <h3 className="font-bold text-osrs-text mb-3">By Difficulty</h3>
          <div className="space-y-2">
            {(["easy", "medium", "hard", "elite", "master"] as const).map((diff) => {
              const { total, done } = completedByDifficulty(diff);
              return (
                <div key={diff} className="flex items-center gap-3">
                  <Badge variant={difficultyColors[diff]}>{diff}</Badge>
                  <div className="flex-1">
                    <ProgressBar
                      value={done}
                      max={total}
                      showText={false}
                      size="sm"
                      color={
                        diff === "easy" ? "bg-osrs-green" :
                        diff === "medium" ? "bg-osrs-blue" :
                        diff === "hard" ? "bg-osrs-gold" :
                        diff === "elite" ? "bg-osrs-purple" : "bg-demon-glow"
                      }
                    />
                  </div>
                  <span className="text-xs text-osrs-text-dim w-12 text-right">
                    {done}/{total}
                  </span>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search tasks..."
              className="w-full bg-osrs-darker border border-osrs-border rounded-lg px-3 py-2 text-sm text-osrs-text focus:border-osrs-gold focus:outline-none"
            />
          </div>
          <select
            value={filterDifficulty}
            onChange={(e) => setFilterDifficulty(e.target.value as TaskDifficulty | "all")}
            className="bg-osrs-darker border border-osrs-border rounded-lg px-3 py-2 text-sm text-osrs-text"
          >
            <option value="all">All Difficulties</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
            <option value="elite">Elite</option>
            <option value="master">Master</option>
          </select>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="bg-osrs-darker border border-osrs-border rounded-lg px-3 py-2 text-sm text-osrs-text"
          >
            <option value="all">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <label className="flex items-center gap-2 text-sm text-osrs-text-dim cursor-pointer whitespace-nowrap">
            <input
              type="checkbox"
              checked={showCompleted}
              onChange={(e) => setShowCompleted(e.target.checked)}
              className="rounded"
            />
            Show completed
          </label>
        </div>
      </Card>

      {/* Task List */}
      <div className="space-y-2">
        {filteredTasks.map((task) => {
          const isDone = completed.has(task.id);
          return (
            <div
              key={task.id}
              onClick={() => toggleTask(task.id)}
              className={`flex items-center gap-4 p-3 rounded-lg border cursor-pointer transition-all ${
                isDone
                  ? "bg-osrs-green/5 border-osrs-green/20 opacity-70"
                  : "bg-osrs-panel border-osrs-border hover:border-osrs-gold/50"
              }`}
            >
              <div
                className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 ${
                  isDone
                    ? "bg-osrs-green border-osrs-green text-white"
                    : "border-osrs-border"
                }`}
              >
                {isDone && (
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className={`font-medium text-sm ${isDone ? "line-through text-osrs-text-dim" : "text-osrs-text"}`}>
                    {task.name}
                  </span>
                  <Badge variant={difficultyColors[task.difficulty]}>{task.difficulty}</Badge>
                  <Badge variant="default">{task.category}</Badge>
                </div>
                <p className="text-xs text-osrs-text-dim mt-0.5">{task.description}</p>
              </div>

              <div className="text-sm font-bold text-osrs-gold flex-shrink-0">
                {task.points} pts
              </div>
            </div>
          );
        })}

        {filteredTasks.length === 0 && (
          <Card className="text-center py-8">
            <p className="text-osrs-text-dim">No tasks match your filters.</p>
          </Card>
        )}
      </div>
    </div>
  );
}
