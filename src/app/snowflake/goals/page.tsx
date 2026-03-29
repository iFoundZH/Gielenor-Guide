"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { GoalTracker } from "@/components/snowflake/GoalTracker";
import { getSnowflakeProfile, updateSnowflakeProfile } from "@/lib/snowflake-storage";
import type { SnowflakeProfile, SnowflakeGoal } from "@/types/snowflake";
import Link from "next/link";

export default function SnowflakeGoalsPage() {
  return (
    <Suspense fallback={<div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 text-osrs-text-dim">Loading...</div>}>
      <GoalsContent />
    </Suspense>
  );
}

function GoalsContent() {
  const searchParams = useSearchParams();
  const profileId = searchParams.get("profile");
  const [profile, setProfile] = useState<SnowflakeProfile | null>(null);

  useEffect(() => {
    if (profileId) {
      const loaded = getSnowflakeProfile(profileId);
      if (loaded) setProfile(loaded);
    }
  }, [profileId]);

  useEffect(() => {
    if (profile) updateSnowflakeProfile(profile);
  }, [profile]);

  const handleGoalsChange = (goals: SnowflakeGoal[]) => {
    if (!profile) return;
    setProfile({ ...profile, goals });
  };

  if (!profile) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 text-center">
        <Card className="py-8">
          <p className="text-osrs-text-dim mb-4">No profile selected.</p>
          <Link href="/snowflake" className="text-osrs-blue hover:underline">
            Go to Snowflake Tracker
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex items-center gap-2 mb-3 text-sm text-osrs-text-dim">
        <Link href="/" className="hover:text-osrs-gold">Home</Link>
        <span>/</span>
        <Link href="/snowflake" className="hover:text-osrs-blue">Snowflake</Link>
        <span>/</span>
        <span className="text-osrs-blue">Goals</span>
      </div>

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1
            className="text-3xl font-bold text-osrs-blue"
            style={{ fontFamily: "var(--font-runescape)", textShadow: "0 0 10px rgba(59, 130, 246, 0.5)" }}
          >
            Goal Tracker
          </h1>
          <p className="text-sm text-osrs-text-dim mt-1">{profile.name}</p>
        </div>
        <Link
          href={`/snowflake/planner?profile=${profile.id}`}
          className="px-4 py-2 border border-osrs-border text-osrs-text-dim rounded-lg text-sm hover:border-osrs-blue"
        >
          Back to Planner
        </Link>
      </div>

      <GoalTracker goals={profile.goals} onChange={handleGoalsChange} />
    </div>
  );
}
