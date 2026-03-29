"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Tabs } from "@/components/ui/Tabs";
import Link from "next/link";
import { combatAchievements } from "@/data/guides/combat-achievements";
import type { CombatAchievementTierName } from "@/types/guides";

const STORAGE_KEY = "gielinor-combat-achievements";

const TIER_COLORS: Record<CombatAchievementTierName, "green" | "blue" | "gold" | "purple" | "red" | "default"> = {
  easy: "green",
  medium: "blue",
  hard: "gold",
  elite: "purple",
  master: "red",
  grandmaster: "red",
};

export default function CombatAchievementsPage() {
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState("");

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setCompleted(new Set(JSON.parse(raw)));
    } catch { /* ignore */ }
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

  const totalTasks = combatAchievements.tiers.reduce((sum, t) => sum + t.tasks.length, 0);
  const tabs = combatAchievements.tiers.map((t) => ({
    id: t.tier,
    label: t.tier.charAt(0).toUpperCase() + t.tier.slice(1),
    count: t.tasks.length,
  }));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex items-center gap-2 mb-3 text-sm text-osrs-text-dim">
        <Link href="/" className="hover:text-osrs-gold">Home</Link>
        <span>/</span>
        <Link href="/guides" className="hover:text-osrs-gold">Guides</Link>
        <span>/</span>
        <span className="text-osrs-gold">Combat Achievements</span>
      </div>

      <h1
        className="text-3xl font-bold text-osrs-gold text-glow-gold mb-2"
        style={{ fontFamily: "var(--font-runescape)" }}
      >
        Combat Achievements
      </h1>

      <Card className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-osrs-text">Overall Progress</h3>
          <span className="text-sm text-osrs-gold font-bold">{completed.size} / {totalTasks} tasks</span>
        </div>
        <ProgressBar value={completed.size} max={totalTasks} color="bg-osrs-gold" />
        <div className="mt-3 flex flex-wrap gap-3">
          {combatAchievements.tiers.map((tier) => {
            const tierDone = tier.tasks.filter((t) => completed.has(t.id)).length;
            return (
              <div key={tier.tier} className="text-xs">
                <Badge variant={TIER_COLORS[tier.tier]}>{tier.tier}</Badge>
                <span className="ml-1 text-osrs-text-dim">{tierDone}/{tier.tasks.length}</span>
              </div>
            );
          })}
        </div>
      </Card>

      <Card className="mb-6">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search tasks or monsters..."
          className="w-full bg-osrs-darker border border-osrs-border rounded-lg px-3 py-2 text-sm text-osrs-text focus:border-osrs-gold focus:outline-none"
        />
      </Card>

      <Tabs tabs={tabs} defaultTab="easy">
        {(activeTab) => {
          const tier = combatAchievements.tiers.find((t) => t.tier === activeTab);
          if (!tier) return null;

          const filtered = search
            ? tier.tasks.filter((t) =>
                t.name.toLowerCase().includes(search.toLowerCase()) ||
                t.description.toLowerCase().includes(search.toLowerCase()) ||
                t.monster.toLowerCase().includes(search.toLowerCase()),
              )
            : tier.tasks;

          return (
            <div className="space-y-2">
              {filtered.map((task) => {
                const isDone = completed.has(task.id);
                return (
                  <div
                    key={task.id}
                    onClick={() => toggleTask(task.id)}
                    className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                      isDone
                        ? "bg-osrs-green/5 border-osrs-green/20 opacity-70"
                        : "bg-osrs-panel border-osrs-border hover:border-osrs-gold/50"
                    }`}
                  >
                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${
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
                        {task.monster && <Badge variant="default">{task.monster}</Badge>}
                        {task.type && <Badge variant="gold" size="sm">{task.type}</Badge>}
                      </div>
                      <p className="text-xs text-osrs-text-dim mt-0.5">{task.description}</p>
                    </div>
                  </div>
                );
              })}
              {filtered.length === 0 && (
                <Card className="text-center py-4">
                  <p className="text-osrs-text-dim text-sm">No tasks match your search.</p>
                </Card>
              )}
            </div>
          );
        }}
      </Tabs>
    </div>
  );
}
