"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import { ragingEchoesLeague } from "@/data/raging-echoes";
import { Card } from "@/components/ui/Card";
import { PathGoalSelector } from "@/components/league/PathGoalSelector";
import { ProgressionSummaryCard } from "@/components/league/ProgressionSummaryCard";
import { ProgressionPhaseCard } from "@/components/league/ProgressionPhaseCard";
import { RegionPicker } from "@/components/league/RegionPicker";
import { buildGoals, computeProgression, computeRelicSynergies } from "@/lib/optimal-path";
import type { PathGoal } from "@/types/optimal-path";
import type { LeagueBuild } from "@/types/league";

export default function ProgressionGuidePage() {
  const league = ragingEchoesLeague;
  const goals = useMemo(() => buildGoals(league), [league]);

  const [selectedGoal, setSelectedGoal] = useState<PathGoal | null>(null);
  const [goalCollapsed, setGoalCollapsed] = useState(false);
  const [mode, setMode] = useState<"import" | "standalone">("standalone");
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
  const [excludeCompleted, setExcludeCompleted] = useState(false);
  const [importedBuild, setImportedBuild] = useState<LeagueBuild | null>(null);
  const [completedTaskIds, setCompletedTaskIds] = useState<Set<string>>(new Set());
  const [selectedRelics, setSelectedRelics] = useState<Record<number, string>>({});
  const [timelineFlash, setTimelineFlash] = useState(false);

  // Load planner build and completed tasks from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("gielinor-re-build");
      if (saved) {
        const build: LeagueBuild = JSON.parse(saved);
        setImportedBuild(build);
      }
    } catch { /* ignore */ }

    try {
      const saved = localStorage.getItem("gielinor-re-tasks");
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

  const toggleRegion = useCallback((regionId: string) => {
    setSelectedRegions((prev) =>
      prev.includes(regionId)
        ? prev.filter((id) => id !== regionId)
        : prev.length < league.maxRegions
        ? [...prev, regionId]
        : prev
    );
    setTimelineFlash(true);
    setTimeout(() => setTimelineFlash(false), 300);
  }, [league.maxRegions]);

  const result = useMemo(() => {
    if (!selectedGoal) return null;
    return computeProgression(
      league,
      selectedRegions,
      selectedGoal,
      excludeCompleted ? completedTaskIds : undefined
    );
  }, [league, selectedRegions, selectedGoal, excludeCompleted, completedTaskIds]);

  const synergies = useMemo(
    () => computeRelicSynergies(Object.values(selectedRelics)),
    [selectedRelics]
  );

  const handleGoalSelect = useCallback((goal: PathGoal) => {
    setSelectedGoal(goal);
    setGoalCollapsed(true);
  }, []);

  const handleRelicSelect = useCallback((tier: number | null, relicId: string | null) => {
    if (tier == null) return;
    setSelectedRelics((prev) => {
      const next = { ...prev };
      if (relicId === null) {
        delete next[tier];
      } else {
        next[tier] = relicId;
      }
      return next;
    });
  }, []);

  const showRegionPicker = mode === "standalone" && league.maxRegions > 0;

  const phasesHeading = result?.hasRelicThresholds
    ? `Relic Progression (${result.phases.length})`
    : `Difficulty Progression (${result?.phases.length ?? 0})`;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 mb-3 text-sm text-osrs-text-dim">
        <Link href="/" className="hover:text-osrs-gold">Home</Link>
        <span>/</span>
        <Link href="/leagues/raging-echoes" className="hover:text-osrs-gold">Raging Echoes</Link>
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

      {/* Sticky goal bar + summary */}
      <div className={`${goalCollapsed && selectedGoal ? "sticky top-16 z-10 goal-bar bg-osrs-dark/95 border-b border-osrs-border/50 -mx-4 px-4 py-3 mb-6" : "mb-8"}`}>
        <PathGoalSelector
          goals={goals}
          selectedGoal={selectedGoal}
          onSelect={handleGoalSelect}
          collapsed={goalCollapsed}
          onToggle={() => setGoalCollapsed(!goalCollapsed)}
          currentPoints={result?.totalPoints ?? 0}
        />
        {goalCollapsed && result && (
          <div className="mt-2">
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
      </div>

      {selectedGoal && (
        <>
          {/* Non-sticky summary when goal not collapsed */}
          {!goalCollapsed && result && (
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

          {/* Region picker (standalone mode only) */}
          {showRegionPicker && (
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

          {/* Region recommendations (if no regions selected and regions are relevant) */}
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

          {/* Progression phases with timeline */}
          {result && result.phases.length > 0 && (
            <div>
              <h2
                className="text-xl font-bold text-osrs-gold mb-4"
                style={{ fontFamily: "var(--font-runescape)" }}
              >
                {phasesHeading}
              </h2>

              {/* Timeline container */}
              <div className="relative">
                {/* Spine line — hidden on mobile via CSS */}
                <div className={`timeline-spine ${timelineFlash ? "timeline-flash" : ""}`} />

                {result.phases.map((phase, i) => {
                  const intensity = result.phases.length > 1
                    ? i / (result.phases.length - 1)
                    : 0;
                  const isLateGame = intensity >= 0.7;
                  const tierKey = phase.targetRelicTier ?? -1;
                  const hasSelectedRelic = !!selectedRelics[tierKey];

                  return (
                    <div key={phase.phaseNumber} className="relative sm:pl-16 mb-6">
                      {/* Timeline node */}
                      <div
                        className={`timeline-node ${
                          hasSelectedRelic ? "timeline-node--filled" : ""
                        } ${isLateGame ? "timeline-node--pulse" : ""}`}
                      >
                        {phase.targetRelicTier != null ? `T${phase.targetRelicTier}` : phase.phaseNumber}
                      </div>

                      <ProgressionPhaseCard
                        phase={phase}
                        goalPoints={selectedGoal.targetPoints}
                        goalColor={selectedGoal.color}
                        phaseIntensity={intensity}
                        selectedRelicId={selectedRelics[tierKey]}
                        synergies={synergies}
                        onRelicSelect={(relicId) =>
                          handleRelicSelect(phase.targetRelicTier, relicId)
                        }
                      />
                    </div>
                  );
                })}
              </div>
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
