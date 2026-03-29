"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ProgressBar } from "@/components/ui/ProgressBar";
import Link from "next/link";
import { achievementDiaries } from "@/data/guides/diaries";

export default function DiaryIndexPage() {
  const [completedTasks, setCompletedTasks] = useState<Record<string, Set<string>>>({});

  useEffect(() => {
    const loaded: Record<string, Set<string>> = {};
    for (const diary of achievementDiaries) {
      try {
        const raw = localStorage.getItem(`gielinor-diaries-${diary.id}`);
        if (raw) loaded[diary.id] = new Set(JSON.parse(raw));
      } catch { /* ignore */ }
    }
    setCompletedTasks(loaded);
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex items-center gap-2 mb-3 text-sm text-osrs-text-dim">
        <Link href="/" className="hover:text-osrs-gold">Home</Link>
        <span>/</span>
        <Link href="/guides" className="hover:text-osrs-gold">Guides</Link>
        <span>/</span>
        <span className="text-osrs-gold">Achievement Diaries</span>
      </div>

      <h1
        className="text-3xl font-bold text-osrs-gold text-glow-gold mb-2"
        style={{ fontFamily: "var(--font-runescape)" }}
      >
        Achievement Diaries
      </h1>
      <p className="text-osrs-text-dim mb-10">
        Track your progress across all {achievementDiaries.length} achievement diary areas.
        Complete tasks to unlock area-specific rewards.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {achievementDiaries.map((diary) => {
          const totalTasks = diary.tiers.reduce((sum, t) => sum + t.tasks.length, 0);
          const doneCount = completedTasks[diary.id]?.size || 0;
          return (
            <Link key={diary.id} href={`/guides/diaries/${diary.id}`}>
              <Card hover className="h-full">
                <h2 className="text-lg font-bold text-osrs-gold mb-2">{diary.name}</h2>
                <div className="flex flex-wrap gap-1 mb-3">
                  {diary.tiers.map((tier) => (
                    <Badge
                      key={tier.tier}
                      variant={tier.tier === "easy" ? "green" : tier.tier === "medium" ? "blue" : tier.tier === "hard" ? "gold" : "purple"}
                    >
                      {tier.tier}: {tier.tasks.length}
                    </Badge>
                  ))}
                </div>
                <ProgressBar
                  value={doneCount}
                  max={totalTasks}
                  size="sm"
                  color="bg-osrs-gold"
                />
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
