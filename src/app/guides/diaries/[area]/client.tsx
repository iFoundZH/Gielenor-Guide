"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Tabs } from "@/components/ui/Tabs";
import Link from "next/link";
import { achievementDiaries } from "@/data/guides/diaries";
import type { DiaryTier } from "@/types/guides";

const TIER_COLORS: Record<DiaryTier, "green" | "blue" | "gold" | "purple"> = {
  easy: "green",
  medium: "blue",
  hard: "gold",
  elite: "purple",
};

export function DiaryAreaClient({ areaId }: { areaId: string }) {
  const diary = achievementDiaries.find((d) => d.id === areaId);

  const STORAGE_KEY = `gielinor-diaries-${areaId}`;
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const [showMissingReqs, setShowMissingReqs] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setCompleted(new Set(JSON.parse(raw)));
    } catch { /* ignore */ }
  }, [STORAGE_KEY]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...completed]));
  }, [completed, STORAGE_KEY]);

  const toggleTask = (taskId: string) => {
    setCompleted((prev) => {
      const next = new Set(prev);
      if (next.has(taskId)) next.delete(taskId); else next.add(taskId);
      return next;
    });
  };

  if (!diary) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <Card className="text-center py-8">
          <p className="text-osrs-text-dim">Diary area not found: {areaId}</p>
          <Link href="/guides/diaries" className="text-osrs-gold hover:underline mt-2 inline-block">
            Back to Diaries
          </Link>
        </Card>
      </div>
    );
  }

  const totalTasks = diary.tiers.reduce((sum, t) => sum + t.tasks.length, 0);
  const tabs = diary.tiers.map((t) => ({
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
        <Link href="/guides/diaries" className="hover:text-osrs-gold">Diaries</Link>
        <span>/</span>
        <span className="text-osrs-gold">{diary.name}</span>
      </div>

      <h1
        className="text-3xl font-bold text-osrs-gold text-glow-gold mb-2"
        style={{ fontFamily: "var(--font-runescape)" }}
      >
        {diary.name} Diary
      </h1>

      <Card className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-osrs-text">Overall Progress</h3>
          <span className="text-sm text-osrs-gold font-bold">{completed.size} / {totalTasks} tasks</span>
        </div>
        <ProgressBar value={completed.size} max={totalTasks} color="bg-osrs-gold" />
        <div className="mt-3 flex gap-4">
          {diary.tiers.map((t) => {
            const tierDone = t.tasks.filter((task) => completed.has(task.id)).length;
            return (
              <div key={t.tier} className="text-xs">
                <Badge variant={TIER_COLORS[t.tier]}>{t.tier}</Badge>
                <span className="ml-1 text-osrs-text-dim">{tierDone}/{t.tasks.length}</span>
              </div>
            );
          })}
        </div>
      </Card>

      <div className="flex items-center gap-3 mb-4">
        <label className="flex items-center gap-2 text-sm text-osrs-text-dim cursor-pointer">
          <input
            type="checkbox"
            checked={showMissingReqs}
            onChange={(e) => setShowMissingReqs(e.target.checked)}
            className="rounded"
          />
          Show requirements
        </label>
        <a
          href={diary.wikiUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-osrs-gold hover:underline ml-auto"
        >
          Full article on Wiki
        </a>
      </div>

      <Tabs tabs={tabs} defaultTab="easy">
        {(activeTab) => {
          const tier = diary.tiers.find((t) => t.tier === activeTab);
          if (!tier) return null;

          return (
            <div>
              {tier.rewards.length > 0 && (
                <Card className="mb-4">
                  <h4 className="text-sm font-bold text-osrs-text mb-2">Rewards</h4>
                  <div className="space-y-1">
                    {tier.rewards.map((rew, i) => (
                      <div key={i} className="text-xs text-osrs-text-dim">
                        <span className="text-osrs-gold">{rew.itemName}:</span>{" "}
                        {rew.effects.join("; ")}
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              <div className="space-y-2">
                {tier.tasks.map((task) => {
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
                        <p className={`text-sm ${isDone ? "line-through text-osrs-text-dim" : "text-osrs-text"}`}>
                          {task.description}
                        </p>
                        {showMissingReqs && task.requirements.length > 0 && (
                          <div className="mt-1 flex flex-wrap gap-1">
                            {task.requirements.map((req, i) => (
                              <Badge key={i} variant={req.type === "skill" ? "gold" : "default"} size="sm">
                                {req.description}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        }}
      </Tabs>
    </div>
  );
}
