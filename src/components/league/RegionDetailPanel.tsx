"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/Badge";
import type { RegionStats } from "@/lib/region-stats";

type DetailTab = "bosses" | "quests" | "tasks" | "strategy";

interface RegionDetailPanelProps {
  stats: RegionStats;
  echoBoss?: string;
}

const DIFFICULTY_COLORS: Record<string, string> = {
  easy: "bg-osrs-green/20 text-osrs-green",
  medium: "bg-osrs-blue/20 text-osrs-blue",
  hard: "bg-osrs-gold/20 text-osrs-gold",
  elite: "bg-osrs-purple/20 text-osrs-purple",
  master: "bg-demon-glow/20 text-demon-glow",
};

const BOSS_DIFF_COLORS: Record<string, string> = {
  endgame: "text-demon-glow",
  high: "text-osrs-gold",
  mid: "text-osrs-green",
};

const TIER_COLORS: Record<string, string> = {
  S: "bg-osrs-gold/20 text-osrs-gold border border-osrs-gold/30",
  A: "bg-osrs-green/20 text-osrs-green border border-osrs-green/30",
  B: "bg-osrs-blue/20 text-osrs-blue border border-osrs-blue/30",
  C: "bg-osrs-border text-osrs-text-dim",
};

export function RegionDetailPanel({ stats, echoBoss }: RegionDetailPanelProps) {
  const [activeTab, setActiveTab] = useState<DetailTab>("bosses");

  const tabs: { id: DetailTab; label: string; count?: number }[] = [
    { id: "bosses", label: "Bosses", count: stats.bossCount },
    { id: "quests", label: "Quests", count: stats.questCount },
    { id: "tasks", label: "Tasks", count: stats.taskCount },
    { id: "strategy", label: "Strategy" },
  ];

  return (
    <div className="bg-osrs-darker/80 border border-osrs-border rounded-lg overflow-hidden">
      {/* Summary stats bar */}
      <div className="flex flex-wrap items-center gap-3 px-4 py-2.5 bg-osrs-dark/50 border-b border-osrs-border text-xs">
        {stats.tier && (
          <span className={`inline-flex items-center rounded-full px-2 py-0.5 font-bold ${TIER_COLORS[stats.tier]}`}>
            {stats.tier} Tier
          </span>
        )}
        <span className="text-osrs-text-dim">
          <span className="text-osrs-text font-medium">{stats.taskCount}</span> Tasks
        </span>
        <span className="text-osrs-text-dim">
          <span className="text-osrs-gold font-medium">{stats.totalTaskPoints.toLocaleString()}</span> pts
        </span>
        {stats.estimatedPtsPerHour != null && stats.estimatedPtsPerHour > 0 && (
          <span className="text-osrs-text-dim">
            ~<span className="text-osrs-text font-medium">{stats.estimatedPtsPerHour}</span> pts/hr
          </span>
        )}
        <span className="text-osrs-text-dim">
          <span className="text-osrs-text font-medium">{stats.bossCount}</span> Bosses
        </span>
        <span className="text-osrs-text-dim">
          <span className="text-osrs-text font-medium">{stats.totalQuestPoints}</span> QP
        </span>
      </div>

      {/* Mini tabs */}
      <div className="flex border-b border-osrs-border">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 text-xs font-medium transition-colors ${
              activeTab === tab.id
                ? "text-osrs-gold border-b-2 border-osrs-gold bg-osrs-gold/5"
                : "text-osrs-text-dim hover:text-osrs-text hover:bg-osrs-gold/5"
            }`}
          >
            {tab.label}
            {tab.count != null && (
              <span className="ml-1 text-osrs-text-dim">({tab.count})</span>
            )}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="p-4 max-h-72 overflow-y-auto">
        {activeTab === "bosses" && <BossesTab stats={stats} echoBoss={echoBoss} />}
        {activeTab === "quests" && <QuestsTab stats={stats} />}
        {activeTab === "tasks" && <TasksTab stats={stats} />}
        {activeTab === "strategy" && <StrategyTab stats={stats} />}
      </div>
    </div>
  );
}

function BossesTab({ stats, echoBoss }: { stats: RegionStats; echoBoss?: string }) {
  if (stats.bosses.length === 0) {
    return <p className="text-sm text-osrs-text-dim">No bosses in this region.</p>;
  }

  const grouped = {
    endgame: stats.bosses.filter((b) => b.difficulty === "endgame"),
    high: stats.bosses.filter((b) => b.difficulty === "high"),
    mid: stats.bosses.filter((b) => b.difficulty === "mid"),
  };

  return (
    <div className="space-y-3">
      {(["endgame", "high", "mid"] as const).map((diff) => {
        const bosses = grouped[diff];
        if (bosses.length === 0) return null;
        return (
          <div key={diff}>
            <h5 className={`text-xs font-bold uppercase tracking-wider mb-1.5 ${BOSS_DIFF_COLORS[diff]}`}>
              {diff === "endgame" ? "Endgame" : diff === "high" ? "High-Level" : "Mid-Level"}
            </h5>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {bosses.map((boss) => (
                <div
                  key={boss.name}
                  className={`rounded-lg border px-3 py-2 text-xs ${
                    echoBoss && boss.name.toLowerCase().includes(echoBoss.toLowerCase())
                      ? "border-demon-glow/50 bg-demon-glow/5"
                      : "border-osrs-border/50 bg-osrs-dark/30"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-osrs-text">{boss.name}</span>
                    {boss.combatLevel && (
                      <span className="text-osrs-text-dim">Lvl {boss.combatLevel}</span>
                    )}
                    {echoBoss && boss.name.toLowerCase().includes(echoBoss.toLowerCase()) && (
                      <span className="text-demon-ember font-medium">Echo</span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {boss.category.map((cat) => (
                      <span key={cat} className="text-osrs-text-dim capitalize">{cat}</span>
                    ))}
                    {boss.slayerReq && (
                      <span className="text-osrs-gold">Slayer {boss.slayerReq}</span>
                    )}
                  </div>
                  {boss.notableDrops.length > 0 && (
                    <div className="mt-1 text-osrs-text-dim truncate">
                      {boss.notableDrops.join(", ")}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function QuestsTab({ stats }: { stats: RegionStats }) {
  if (stats.quests.length === 0) {
    return <p className="text-sm text-osrs-text-dim">No quests in this region.</p>;
  }

  // Count by difficulty
  const byCounts: Record<string, number> = {};
  for (const q of stats.quests) {
    byCounts[q.difficulty] = (byCounts[q.difficulty] || 0) + 1;
  }

  // Notable quests: those with unlocks or QP >= 2
  const notable = stats.quests.filter((q) => q.questPoints >= 2 || q.keyUnlocks.length > 0);

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {Object.entries(byCounts).map(([diff, count]) => (
          <Badge key={diff} variant={diff === "master" || diff === "grandmaster" ? "red" : diff === "experienced" ? "gold" : diff === "intermediate" ? "blue" : "green"}>
            {count} {diff}
          </Badge>
        ))}
        <span className="text-xs text-osrs-text-dim self-center">
          {stats.totalQuestPoints} total quest points
        </span>
      </div>

      {notable.length > 0 && (
        <div>
          <h5 className="text-xs font-bold text-osrs-text-dim uppercase tracking-wider mb-1.5">Notable Quests</h5>
          <div className="space-y-1.5">
            {notable.slice(0, 12).map((q) => (
              <div key={q.name} className="flex items-start gap-2 text-xs">
                <span className={`shrink-0 rounded px-1.5 py-0.5 capitalize ${DIFFICULTY_COLORS[q.difficulty] || "bg-osrs-border text-osrs-text-dim"}`}>
                  {q.difficulty.slice(0, 3)}
                </span>
                <div className="min-w-0">
                  <span className="text-osrs-text">{q.name}</span>
                  {q.questPoints > 0 && <span className="text-osrs-gold ml-1">({q.questPoints} QP)</span>}
                  {q.keyUnlocks.length > 0 && (
                    <div className="text-osrs-text-dim truncate">{q.keyUnlocks[0]}</div>
                  )}
                </div>
              </div>
            ))}
            {notable.length > 12 && (
              <p className="text-xs text-osrs-text-dim">+{notable.length - 12} more notable quests</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function TasksTab({ stats }: { stats: RegionStats }) {
  if (stats.taskCount === 0) {
    return <p className="text-sm text-osrs-text-dim">No tasks assigned to this region.</p>;
  }

  const difficulties: { key: string; label: string; color: string; pts: number }[] = [
    { key: "easy", label: "Easy", color: "bg-osrs-green", pts: 10 },
    { key: "medium", label: "Medium", color: "bg-osrs-blue", pts: 30 },
    { key: "hard", label: "Hard", color: "bg-osrs-gold", pts: 80 },
    { key: "elite", label: "Elite", color: "bg-osrs-purple", pts: 200 },
    { key: "master", label: "Master", color: "bg-demon-glow", pts: 400 },
  ];

  const maxCount = Math.max(...Object.values(stats.tasksByDifficulty), 1);

  return (
    <div className="space-y-3">
      <div className="text-xs text-osrs-text-dim mb-2">
        <span className="text-osrs-gold font-bold">{stats.totalTaskPoints.toLocaleString()}</span> total points from{" "}
        <span className="text-osrs-text font-medium">{stats.taskCount}</span> tasks
      </div>

      {/* Horizontal stacked bar */}
      <div className="flex h-4 rounded-full overflow-hidden bg-osrs-dark/50">
        {difficulties.map(({ key, color }) => {
          const count = stats.tasksByDifficulty[key as keyof typeof stats.tasksByDifficulty];
          if (count === 0) return null;
          const pct = (count / stats.taskCount) * 100;
          return (
            <div
              key={key}
              className={`${color} opacity-80`}
              style={{ width: `${pct}%` }}
              title={`${count} ${key}`}
            />
          );
        })}
      </div>

      {/* Breakdown table */}
      <div className="space-y-1.5">
        {difficulties.map(({ key, label, color, pts }) => {
          const count = stats.tasksByDifficulty[key as keyof typeof stats.tasksByDifficulty];
          if (count === 0) return null;
          return (
            <div key={key} className="flex items-center gap-2 text-xs">
              <div className={`w-2 h-2 rounded-full ${color} shrink-0`} />
              <span className="text-osrs-text w-16">{label}</span>
              <div className="flex-1 bg-osrs-dark/30 rounded-full h-1.5">
                <div
                  className={`${color} h-1.5 rounded-full opacity-60`}
                  style={{ width: `${(count / maxCount) * 100}%` }}
                />
              </div>
              <span className="text-osrs-text-dim w-8 text-right">{count}</span>
              <span className="text-osrs-gold w-16 text-right">{(count * pts).toLocaleString()}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function StrategyTab({ stats }: { stats: RegionStats }) {
  if (!stats.reasoning) {
    return (
      <p className="text-sm text-osrs-text-dim">
        No strategy analysis available for this region. Check the Strategy Guide for general tips.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {stats.tier && (
        <div className="flex items-center gap-2">
          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold ${TIER_COLORS[stats.tier]}`}>
            {stats.tier} Tier Region
          </span>
          {stats.estimatedPtsPerHour != null && stats.estimatedPtsPerHour > 0 && (
            <span className="text-xs text-osrs-text-dim">
              ~{stats.estimatedPtsPerHour} pts/hr estimated
            </span>
          )}
        </div>
      )}
      <p className="text-sm text-osrs-text-dim leading-relaxed">{stats.reasoning}</p>
    </div>
  );
}
