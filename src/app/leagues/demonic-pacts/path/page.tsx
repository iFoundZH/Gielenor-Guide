"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { demonicPactsLeague } from "@/data/demonic-pacts";
import { Card } from "@/components/ui/Card";
import { PathGoalSelector } from "@/components/league/PathGoalSelector";
import { ProgressionSummaryCard } from "@/components/league/ProgressionSummaryCard";
import { ProgressionPhaseCard } from "@/components/league/ProgressionPhaseCard";
import { RegionPicker } from "@/components/league/RegionPicker";
import { buildGoals, computeProgression } from "@/lib/optimal-path";
import type { PathGoal } from "@/types/optimal-path";
import type { LeagueBuild } from "@/types/league";

export default function ProgressionGuidePage() {
  const league = demonicPactsLeague;
  const goals = useMemo(() => buildGoals(league), [league]);

  const [selectedGoal, setSelectedGoal] = useState<PathGoal | null>(null);
  const [mode, setMode] = useState<"import" | "standalone">("standalone");
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
  const [excludeCompleted, setExcludeCompleted] = useState(false);
  const [importedBuild, setImportedBuild] = useState<LeagueBuild | null>(null);
  const [completedTaskIds, setCompletedTaskIds] = useState<Set<string>>(new Set());

  // Load planner build and completed tasks from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("gielinor-dp-build");
      if (saved) {
        const build: LeagueBuild = JSON.parse(saved);
        setImportedBuild(build);
      }
    } catch { /* ignore */ }

    try {
      const saved = localStorage.getItem("gielinor-dp-tasks");
      if (saved) {
        const ids: string[] = JSON.parse(saved);
        setCompletedTaskIds(new Set(ids));
      }
    } catch { /* ignore */ }
  }, []);

  // When switching to import mode, use imported build's regions
  useEffect(() => {
    if (mode === "import" && importedBuild) {
      setSelectedRegions(importedBuild.regions);
    }
  }, [mode, importedBuild]);

  const hasImportData = importedBuild !== null && importedBuild.regions.length > 0;

  const toggleRegion = (regionId: string) => {
    setSelectedRegions((prev) =>
      prev.includes(regionId)
        ? prev.filter((id) => id !== regionId)
        : prev.length < league.maxRegions
        ? [...prev, regionId]
        : prev
    );
  };

  const result = useMemo(() => {
    if (!selectedGoal) return null;
    return computeProgression(
      league,
      selectedRegions,
      selectedGoal,
      excludeCompleted ? completedTaskIds : undefined
    );
  }, [league, selectedRegions, selectedGoal, excludeCompleted, completedTaskIds]);

  const phasesHeading = result?.hasRelicThresholds
    ? `Relic Progression (${result.phases.length})`
    : `Difficulty Progression (${result?.phases.length ?? 0})`;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 mb-3 text-sm text-osrs-text-dim">
        <Link href="/" className="hover:text-osrs-gold">Home</Link>
        <span>/</span>
        <Link href="/leagues/demonic-pacts" className="hover:text-osrs-gold">Demonic Pacts</Link>
        <span>/</span>
        <span className="text-osrs-gold">Progression Guide</span>
      </div>

      <h1
        className="text-3xl font-bold text-osrs-gold text-glow-gold mb-2"
        style={{ fontFamily: "var(--font-runescape)" }}
      >
        Progression Guide
      </h1>
      <p className="text-osrs-text-dim mb-8">
        A relic-tier progression guide to reach your league goal.
      </p>

      {/* Goal selector */}
      <div className="mb-8">
        <PathGoalSelector goals={goals} selectedGoal={selectedGoal} onSelect={setSelectedGoal} />
      </div>

      {selectedGoal && (
        <>
          {/* Summary + controls */}
          {result && (
            <div className="mb-6">
              <ProgressionSummaryCard
                result={result}
                mode={mode}
                onModeChange={setMode}
                excludeCompleted={excludeCompleted}
                onExcludeCompletedChange={setExcludeCompleted}
                hasImportData={hasImportData}
              />
            </div>
          )}

          {/* Region picker (standalone mode only, and only if maxRegions > 0) */}
          {mode === "standalone" && league.maxRegions > 0 && (
            <div className="mb-8">
              <Card>
                <h3
                  className="text-lg font-bold text-osrs-gold mb-3"
                  style={{ fontFamily: "var(--font-runescape)" }}
                >
                  Select Regions
                </h3>
                <p className="text-xs text-osrs-text-dim mb-4">
                  Pick up to {league.maxRegions} regions. Tasks are filtered to accessible content.
                </p>
                <RegionPicker
                  regions={league.regions}
                  maxRegions={league.maxRegions}
                  selectedRegions={selectedRegions}
                  onToggle={toggleRegion}
                  tasks={league.tasks}
                />
              </Card>
            </div>
          )}

          {/* Region recommendations (if no regions selected) */}
          {result && selectedRegions.length === 0 && league.maxRegions > 0 && (
            <div className="mb-6">
              <Card>
                <h3 className="text-sm font-bold text-osrs-gold mb-2">
                  Recommended Regions
                </h3>
                <div className="space-y-1.5">
                  {result.recommendedRegions.slice(0, 5).map((rec) => (
                    <div key={rec.regionId} className="flex items-center justify-between text-sm">
                      <span className="text-osrs-text">
                        #{rec.rank} {rec.regionName}
                        {rec.hasEchoBoss && (
                          <span className="ml-1.5 text-xs text-purple-400">echo boss</span>
                        )}
                      </span>
                      <span className="text-osrs-text-dim text-xs">
                        {rec.accessibleTasks} tasks &middot; {rec.accessiblePoints.toLocaleString()} pts
                      </span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          )}

          {/* Progression phases */}
          {result && result.phases.length > 0 && (
            <div className="space-y-4">
              <h2
                className="text-xl font-bold text-osrs-gold"
                style={{ fontFamily: "var(--font-runescape)" }}
              >
                {phasesHeading}
              </h2>
              {result.phases.map((phase) => (
                <ProgressionPhaseCard
                  key={phase.phaseNumber}
                  phase={phase}
                  goalPoints={selectedGoal.targetPoints}
                  goalColor={selectedGoal.color}
                />
              ))}
            </div>
          )}

          {result && result.phases.length === 0 && (
            <Card>
              <p className="text-center text-osrs-text-dim py-4">
                No tasks available. Select regions to see your progression guide.
              </p>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
