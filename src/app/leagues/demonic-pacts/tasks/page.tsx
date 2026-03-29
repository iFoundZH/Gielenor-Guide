"use client";

import { useState, useEffect, useMemo } from "react";
import { demonicPactsLeague } from "@/data/demonic-pacts";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ProgressBar } from "@/components/ui/ProgressBar";
import type { TaskDifficulty, LeagueBuild } from "@/types/league";
import Link from "next/link";

const difficultyColors: Record<TaskDifficulty, "green" | "blue" | "gold" | "purple" | "red"> = {
  easy: "green",
  medium: "blue",
  hard: "gold",
  elite: "purple",
  master: "red",
};

const difficultyOrder: Record<TaskDifficulty, number> = {
  easy: 1, medium: 2, hard: 3, elite: 4, master: 5,
};

const STORAGE_KEY = "gielinor-dp-tasks";
const BUILD_KEY = "gielinor-dp-build";

type SortMode = "default" | "points-desc" | "points-asc" | "difficulty";

export default function TaskTracker() {
  const league = demonicPactsLeague;
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const [filterDifficulty, setFilterDifficulty] = useState<TaskDifficulty | "all">("all");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterRegion, setFilterRegion] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [showCompleted, setShowCompleted] = useState(true);
  const [filterByBuild, setFilterByBuild] = useState(false);
  const [sortMode, setSortMode] = useState<SortMode>("default");
  const [buildRegions, setBuildRegions] = useState<string[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) try { setCompleted(new Set(JSON.parse(saved))); } catch { /* ignore */ }

    const buildSaved = localStorage.getItem(BUILD_KEY);
    if (buildSaved) {
      try {
        const build: LeagueBuild = JSON.parse(buildSaved);
        setBuildRegions(build.regions || []);
      } catch { /* ignore */ }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...completed]));
  }, [completed]);

  const toggleTask = (taskId: string) => {
    setCompleted((prev) => {
      const next = new Set(prev);
      if (next.has(taskId)) next.delete(taskId); else next.add(taskId);
      return next;
    });
  };

  const categories = useMemo(
    () => Array.from(new Set(league.tasks.map((t) => t.category))).sort(),
    [league.tasks]
  );

  const regions = useMemo(
    () => Array.from(new Set(league.tasks.map((t) => t.region).filter(Boolean))).sort() as string[],
    [league.tasks]
  );

  // Accessible regions = starting + auto-unlock + user's chosen regions
  const accessibleRegions = useMemo(() => {
    const auto = league.regions.filter((r) => r.type === "starting" || r.type === "auto-unlock").map((r) => r.id);
    return [...auto, ...buildRegions];
  }, [buildRegions, league.regions]);

  const isTaskAccessible = (taskRegion?: string) => {
    if (!taskRegion) return true; // global tasks are always accessible
    return accessibleRegions.includes(taskRegion);
  };

  const filteredTasks = useMemo(() => {
    let tasks = league.tasks.filter((task) => {
      if (filterDifficulty !== "all" && task.difficulty !== filterDifficulty) return false;
      if (filterCategory !== "all" && task.category !== filterCategory) return false;
      if (filterRegion !== "all" && task.region !== filterRegion) return false;
      if (filterByBuild && buildRegions.length > 0 && !isTaskAccessible(task.region)) return false;
      if (!showCompleted && completed.has(task.id)) return false;
      if (search && !task.name.toLowerCase().includes(search.toLowerCase()) &&
          !task.description.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });

    if (sortMode === "points-desc") tasks = [...tasks].sort((a, b) => b.points - a.points);
    else if (sortMode === "points-asc") tasks = [...tasks].sort((a, b) => a.points - b.points);
    else if (sortMode === "difficulty") tasks = [...tasks].sort((a, b) => difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty]);

    return tasks;
  }, [league.tasks, filterDifficulty, filterCategory, filterRegion, filterByBuild, buildRegions, showCompleted, search, completed, sortMode, accessibleRegions]);

  const PAGE_SIZE = 50;
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  // Reset visible count when filters change
  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [filterDifficulty, filterCategory, filterRegion, filterByBuild, showCompleted, search, sortMode]);

  const totalPoints = league.tasks.reduce((sum, t) => sum + t.points, 0);
  const earnedPoints = league.tasks.filter((t) => completed.has(t.id)).reduce((sum, t) => sum + t.points, 0);

  const completedByDifficulty = (diff: TaskDifficulty) => {
    const tasks = league.tasks.filter((t) => t.difficulty === diff);
    const done = tasks.filter((t) => completed.has(t.id));
    return { total: tasks.length, done: done.length };
  };

  const currentTier = league.rewardTiers.filter((t) => earnedPoints >= t.pointsRequired).pop();
  const nextTier = league.rewardTiers.find((t) => earnedPoints < t.pointsRequired);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex items-center gap-2 mb-3 text-sm text-osrs-text-dim">
        <Link href="/" className="hover:text-osrs-gold">Home</Link>
        <span>/</span>
        <Link href="/leagues/demonic-pacts" className="hover:text-osrs-gold">Demonic Pacts</Link>
        <span>/</span>
        <span className="text-osrs-gold">Task Tracker</span>
      </div>

      <h1 className="text-3xl font-bold text-osrs-gold text-glow-gold mb-2" style={{ fontFamily: "var(--font-runescape)" }}>
        Task Tracker
      </h1>
      <p className="text-osrs-text-dim mb-8">
        Track your progress across all {league.tasks.length} league tasks. Click a task to mark it complete.
      </p>

      {/* Progress Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
        <Card glow="gold" className="lg:col-span-2">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-osrs-text">Overall Progress</h3>
            <span className="text-sm text-osrs-gold font-bold">{completed.size} / {league.tasks.length} tasks</span>
          </div>
          <ProgressBar value={earnedPoints} max={totalPoints} color="bg-gradient-to-r from-osrs-gold to-demon-ember" size="lg" />
          <div className="mt-3 flex items-center gap-4 text-sm">
            <div>
              <span className="text-osrs-text-dim">Points: </span>
              <span className="text-osrs-gold font-bold">{earnedPoints.toLocaleString()}</span>
            </div>
            {currentTier && (
              <div>
                <span className="text-osrs-text-dim">Tier: </span>
                <span className="font-bold" style={{ color: currentTier.color }}>{currentTier.name}</span>
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
                    <ProgressBar value={done} max={total} showText={false} size="sm"
                      color={diff === "easy" ? "bg-osrs-green" : diff === "medium" ? "bg-osrs-blue" : diff === "hard" ? "bg-osrs-gold" : diff === "elite" ? "bg-osrs-purple" : "bg-demon-glow"} />
                  </div>
                  <span className="text-xs text-osrs-text-dim w-12 text-right">{done}/{total}</span>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Reward Track */}
      <Card className="mb-6">
        <h3 className="font-bold text-osrs-text mb-3 text-sm">Reward Progress</h3>
        <div className="relative">
          <div className="flex items-center gap-0">
            {league.rewardTiers.map((tier, i) => {
              const isUnlocked = earnedPoints >= tier.pointsRequired;
              const prevPoints = i > 0 ? league.rewardTiers[i - 1].pointsRequired : 0;
              const segmentProgress = Math.min(1, Math.max(0, (earnedPoints - prevPoints) / (tier.pointsRequired - prevPoints)));
              return (
                <div key={tier.name} className="flex-1 flex items-center">
                  <div className="flex-1 h-1.5 rounded-full bg-osrs-darker relative overflow-hidden">
                    <div
                      className="absolute inset-y-0 left-0 rounded-full transition-all"
                      style={{
                        width: `${(isUnlocked ? 100 : segmentProgress * 100)}%`,
                        backgroundColor: tier.color,
                      }}
                    />
                  </div>
                  <div className="flex flex-col items-center mx-1" title={`${tier.name}: ${tier.pointsRequired.toLocaleString()} pts`}>
                    <div
                      className={`w-3 h-3 rounded-full border-2 ${isUnlocked ? "border-transparent" : "border-osrs-border bg-osrs-darker"}`}
                      style={isUnlocked ? { backgroundColor: tier.color, borderColor: tier.color } : {}}
                    />
                    <span className="text-[9px] text-osrs-text-dim mt-0.5 hidden sm:block">{tier.name}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Card>

      {/* Filters */}
      <Card className="mb-6">
        <div className="flex flex-col gap-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
                placeholder="Search tasks..."
                className="w-full bg-osrs-darker border border-osrs-border rounded-lg px-3 py-2 text-sm text-osrs-text focus:border-osrs-gold focus:outline-none" />
            </div>
            <select value={filterDifficulty} onChange={(e) => setFilterDifficulty(e.target.value as TaskDifficulty | "all")}
              className="bg-osrs-darker border border-osrs-border rounded-lg px-3 py-2 text-sm text-osrs-text">
              <option value="all">All Difficulties</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
              <option value="elite">Elite</option>
              <option value="master">Master</option>
            </select>
            <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}
              className="bg-osrs-darker border border-osrs-border rounded-lg px-3 py-2 text-sm text-osrs-text">
              <option value="all">All Categories</option>
              {categories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
            {regions.length > 0 && (
              <select value={filterRegion} onChange={(e) => setFilterRegion(e.target.value)}
                className="bg-osrs-darker border border-osrs-border rounded-lg px-3 py-2 text-sm text-osrs-text">
                <option value="all">All Regions</option>
                {regions.map((r) => {
                  const region = league.regions.find((lr) => lr.id === r);
                  return <option key={r} value={r}>{region?.name || r}</option>;
                })}
              </select>
            )}
            <select value={sortMode} onChange={(e) => setSortMode(e.target.value as SortMode)}
              className="bg-osrs-darker border border-osrs-border rounded-lg px-3 py-2 text-sm text-osrs-text">
              <option value="default">Sort: Default</option>
              <option value="points-desc">Points: High to Low</option>
              <option value="points-asc">Points: Low to High</option>
              <option value="difficulty">Difficulty</option>
            </select>
            {buildRegions.length > 0 && (
              <label className="flex items-center gap-2 text-sm text-osrs-gold cursor-pointer whitespace-nowrap">
                <input type="checkbox" checked={filterByBuild} onChange={(e) => setFilterByBuild(e.target.checked)} className="rounded" />
                My Build Only
              </label>
            )}
            <label className="flex items-center gap-2 text-sm text-osrs-text-dim cursor-pointer whitespace-nowrap">
              <input type="checkbox" checked={showCompleted} onChange={(e) => setShowCompleted(e.target.checked)} className="rounded" />
              Show completed
            </label>
          </div>
        </div>
      </Card>

      {/* Task List */}
      {filteredTasks.length > PAGE_SIZE && (
        <div className="text-xs text-osrs-text-dim mb-2">Showing {Math.min(visibleCount, filteredTasks.length)} of {filteredTasks.length} tasks</div>
      )}
      <div className="space-y-2">
        {filteredTasks.slice(0, visibleCount).map((task) => {
          const isDone = completed.has(task.id);
          const accessible = isTaskAccessible(task.region);
          return (
            <div
              key={task.id}
              onClick={() => toggleTask(task.id)}
              className={`flex items-center gap-4 p-3 rounded-lg border cursor-pointer transition-all ${
                isDone
                  ? "bg-osrs-green/5 border-osrs-green/20 opacity-70"
                  : !accessible && buildRegions.length > 0
                  ? "bg-osrs-darker/50 border-osrs-border/50 opacity-50"
                  : "bg-osrs-panel border-osrs-border hover:border-osrs-gold/50"
              }`}
            >
              <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 ${
                isDone ? "bg-osrs-green border-osrs-green text-white" : "border-osrs-border"
              }`}>
                {isDone && (
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`font-medium text-sm ${isDone ? "line-through text-osrs-text-dim" : "text-osrs-text"}`}>
                    {task.name}
                  </span>
                  <Badge variant={difficultyColors[task.difficulty]}>{task.difficulty}</Badge>
                  <Badge variant="default">{task.category}</Badge>
                  {task.region && !accessible && buildRegions.length > 0 && (
                    <span className="text-[10px] text-demon-glow">Locked</span>
                  )}
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
        {visibleCount < filteredTasks.length && (
          <button onClick={() => setVisibleCount((v) => v + PAGE_SIZE)}
            className="w-full py-3 rounded-lg border border-osrs-border bg-osrs-panel hover:border-osrs-gold/50 text-osrs-gold text-sm font-bold transition-colors">
            Load More ({filteredTasks.length - visibleCount} remaining)
          </button>
        )}
      </div>
    </div>
  );
}
