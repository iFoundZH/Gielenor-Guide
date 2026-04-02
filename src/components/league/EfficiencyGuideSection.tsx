"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ProgressBar } from "@/components/ui/ProgressBar";
import type { EfficiencyGuide, RegionAnalysis } from "@/types/efficiency-guide";

const tierColors: Record<string, "gold" | "red" | "green" | "blue" | "purple" | "default"> = {
  S: "gold",
  A: "blue",
  B: "default",
  C: "default",
};

type SortKey = "tier" | "points" | "tasks";

export function EfficiencyGuideSection({ guide }: { guide: EfficiencyGuide }) {
  const [regionSort, setRegionSort] = useState<SortKey>("tier");
  const [expandedMilestone, setExpandedMilestone] = useState<number | null>(null);

  const sortedRegions = [...guide.regionAnalysis].sort((a, b) => {
    if (regionSort === "tier") {
      const order = { S: 0, A: 1, B: 2, C: 3 };
      return (order[a.tier] ?? 4) - (order[b.tier] ?? 4);
    }
    if (regionSort === "points") return (b.totalPoints ?? 0) - (a.totalPoints ?? 0);
    return (b.totalTasks ?? 0) - (a.totalTasks ?? 0);
  });

  const maxTierPoints = guide.tierProjections.length > 0
    ? guide.tierProjections[guide.tierProjections.length - 1].pointsRequired
    : 60000;

  return (
    <div className="space-y-8">
      {/* Summary Card */}
      <Card glow="gold">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <h2
              className="text-2xl font-bold text-osrs-gold mb-2"
              style={{ fontFamily: "var(--font-runescape)" }}
            >
              Rank 1 Efficiency Guide
            </h2>
            <p className="text-xs text-osrs-text-dim/60 italic mb-2">
              Task counts, points/hr, and time estimates are community analysis based on game knowledge, not exact wiki data.
            </p>
            <p className="text-sm text-osrs-text-dim mb-3">{guide.summary.keyInsight}</p>
            <div className="flex flex-wrap gap-3">
              <div className="text-sm">
                <span className="text-osrs-text-dim">Target: </span>
                <span className="text-osrs-gold font-bold">
                  {guide.summary.targetPoints.toLocaleString()} pts
                </span>
              </div>
              <div className="text-sm">
                <span className="text-osrs-text-dim">Regions: </span>
                <span className="text-osrs-text font-medium">
                  {guide.summary.optimalRegions.join(", ")}
                </span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Region Analysis */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3
            className="text-xl font-bold text-osrs-gold"
            style={{ fontFamily: "var(--font-runescape)" }}
          >
            Region Analysis
          </h3>
          <select
            value={regionSort}
            onChange={(e) => setRegionSort(e.target.value as SortKey)}
            className="bg-osrs-darker border border-osrs-border rounded-lg px-3 py-1.5 text-sm text-osrs-text"
          >
            <option value="tier">Sort: Tier</option>
            <option value="points">Sort: Total Points</option>
            <option value="tasks">Sort: Task Count</option>
          </select>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sortedRegions.map((region) => (
            <RegionCard key={region.regionId} region={region} />
          ))}
        </div>
      </div>

      {/* Optimal Region Pick */}
      <Card>
        <h3
          className="text-xl font-bold text-osrs-blue mb-3"
          style={{ fontFamily: "var(--font-runescape)" }}
        >
          Optimal Region Selection
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <h4 className="text-sm font-bold text-osrs-gold mb-2">Primary Pick</h4>
            <div className="space-y-1">
              {guide.optimalRegionPick.primary.map((r, i) => (
                <div key={r} className="flex items-center gap-2 text-sm">
                  <span className="text-osrs-gold font-bold w-4">{i + 1}.</span>
                  <span className="text-osrs-text">{r}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-sm font-bold text-osrs-text-dim mb-2">Alternative</h4>
            <div className="space-y-1">
              {guide.optimalRegionPick.alternative.map((r, i) => (
                <div key={r} className="flex items-center gap-2 text-sm">
                  <span className="text-osrs-text-dim font-bold w-4">{i + 1}.</span>
                  <span className="text-osrs-text-dim">{r}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <p className="text-xs text-osrs-text-dim">{guide.optimalRegionPick.mathJustification}</p>
        {guide.optimalRegionPick.unlockOrder.length > 0 && (
          <div className="mt-3">
            <h4 className="text-xs font-bold text-osrs-text-dim mb-1">Unlock Order</h4>
            <div className="flex flex-wrap gap-2">
              {guide.optimalRegionPick.unlockOrder.map((r, i) => (
                <Badge key={r} variant={i === 0 ? "gold" : i === 1 ? "blue" : "default"}>
                  {i + 1}. {r}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </Card>

      {/* Relic Path */}
      <div>
        <h3
          className="text-xl font-bold text-osrs-gold mb-4"
          style={{ fontFamily: "var(--font-runescape)" }}
        >
          Relic Path
        </h3>
        <div className="space-y-3">
          {guide.relicPath.map((tier) => (
            <Card key={tier.tier} className="!p-4">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-osrs-gold/20 flex items-center justify-center">
                  <span className="text-osrs-gold font-bold text-sm">T{tier.tier}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-osrs-text">{tier.recommended}</span>
                    {tier.alternatives.length === 0 && (
                      <Badge variant="default" size="sm">Only option</Badge>
                    )}
                  </div>
                  <p className="text-xs text-osrs-text-dim mb-1">{tier.reasoning}</p>
                  {tier.synergyNotes && (
                    <p className="text-xs text-osrs-blue">{tier.synergyNotes}</p>
                  )}
                  {tier.alternatives.length > 0 && (
                    <p className="text-xs text-osrs-text-dim mt-1">
                      Alternatives: {tier.alternatives.join(", ")}
                    </p>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Task Routing */}
      <div>
        <h3
          className="text-xl font-bold text-osrs-gold mb-4"
          style={{ fontFamily: "var(--font-runescape)" }}
        >
          Task Routing
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {guide.taskRouting.map((phase, i) => (
            <Card key={phase.name}>
              <h4
                className={`font-bold mb-1 ${
                  i === 0 ? "text-osrs-green" : i === 1 ? "text-osrs-gold" : "text-demon-glow"
                }`}
                style={{ fontFamily: "var(--font-runescape)" }}
              >
                {phase.name}
              </h4>
              <p className="text-xs text-osrs-text-dim mb-2">{phase.pointRange}</p>
              <p className="text-sm text-osrs-text-dim">{phase.strategy}</p>
            </Card>
          ))}
        </div>
      </div>

      {/* Tier Projections */}
      <Card>
        <h3
          className="text-xl font-bold text-osrs-gold mb-4"
          style={{ fontFamily: "var(--font-runescape)" }}
        >
          Tier Progression Timeline
        </h3>
        <div className="space-y-3">
          {guide.tierProjections.map((tier) => (
            <div key={tier.tierName} className="flex items-center gap-3">
              <div className="w-20 flex-shrink-0">
                <Badge
                  variant={
                    tier.tierName === "Dragon" ? "red"
                      : tier.tierName === "Rune" ? "blue"
                        : tier.tierName === "Adamant" ? "green"
                          : "default"
                  }
                  size="sm"
                >
                  {tier.tierName}
                </Badge>
              </div>
              <div className="flex-1">
                <ProgressBar
                  value={tier.pointsRequired}
                  max={maxTierPoints}
                  showText={false}
                  size="sm"
                  color={
                    tier.tierName === "Dragon" ? "bg-red-500"
                      : tier.tierName === "Rune" ? "bg-cyan-500"
                        : tier.tierName === "Adamant" ? "bg-green-500"
                          : "bg-osrs-gold"
                  }
                />
              </div>
              <div className="w-24 flex-shrink-0 text-right text-xs">
                <span className="text-osrs-gold font-bold">{tier.pointsRequired.toLocaleString()}</span>
                <span className="text-osrs-text-dim"> pts</span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Daily Milestones */}
      <div>
        <h3
          className="text-xl font-bold text-osrs-gold mb-4"
          style={{ fontFamily: "var(--font-runescape)" }}
        >
          Daily Milestones
        </h3>
        <div className="space-y-2">
          {guide.dailyMilestones.map((milestone) => (
            <Card
              key={milestone.day}
              className="!p-3 cursor-pointer"
              onClick={() =>
                setExpandedMilestone(
                  expandedMilestone === milestone.day ? null : milestone.day,
                )
              }
            >
              <div className="flex items-center gap-3">
                <div className="w-14 flex-shrink-0">
                  <span className="text-sm font-bold text-osrs-gold">
                    Day {milestone.day}
                  </span>
                </div>
                <div className="flex-1">
                  <span className="text-sm text-osrs-text">
                    {milestone.targetPoints.toLocaleString()} pts
                  </span>
                  <span className="text-xs text-osrs-text-dim ml-2">
                    {milestone.targetTier}
                  </span>
                </div>
                <span className="text-osrs-text-dim text-xs">
                  {expandedMilestone === milestone.day ? "▲" : "▼"}
                </span>
              </div>
              {expandedMilestone === milestone.day && (
                <div className="mt-2 pt-2 border-t border-osrs-border">
                  <ul className="space-y-1">
                    {milestone.keyActivities.map((activity, i) => (
                      <li key={i} className="text-xs text-osrs-text-dim flex items-start gap-2">
                        <span className="text-osrs-gold mt-0.5">&#x2022;</span>
                        {activity}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </Card>
          ))}
        </div>
      </div>

      {/* Pact Optimization (DP only) */}
      {guide.pactOptimization && (
        <div>
          <h3
            className="text-xl font-bold text-demon-glow mb-4"
            style={{ fontFamily: "var(--font-runescape)" }}
          >
            Pact Strategy
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            {guide.pactOptimization.profiles.map((profile) => (
              <Card
                key={profile.name}
                className={
                  profile.riskLevel === "aggressive"
                    ? "border-demon-glow/30"
                    : profile.riskLevel === "balanced"
                      ? "border-osrs-gold/30"
                      : ""
                }
              >
                <div className="flex items-center gap-2 mb-2">
                  <h4
                    className="font-bold text-osrs-text"
                    style={{ fontFamily: "var(--font-runescape)" }}
                  >
                    {profile.name}
                  </h4>
                  <Badge
                    variant={
                      profile.riskLevel === "aggressive"
                        ? "red"
                        : profile.riskLevel === "balanced"
                          ? "gold"
                          : "green"
                    }
                  >
                    {profile.riskLevel}
                  </Badge>
                </div>
                <p className="text-xs text-osrs-text-dim mb-2">{profile.description}</p>
                {profile.pacts.length > 0 && (
                  <div className="space-y-1">
                    {profile.pacts.map((pact) => (
                      <div key={pact} className="text-xs text-osrs-text flex items-center gap-1">
                        <span className="text-demon-ember">&#x1F525;</span> {pact}
                      </div>
                    ))}
                  </div>
                )}
                <p className="text-xs text-osrs-text-dim mt-2">{profile.reasoning}</p>
              </Card>
            ))}
          </div>
          {guide.pactOptimization.comboAnalysis.length > 0 && (
            <Card>
              <h4
                className="font-bold text-demon-ember mb-3"
                style={{ fontFamily: "var(--font-runescape)" }}
              >
                Pact Combo Analysis
              </h4>
              <div className="space-y-3">
                {guide.pactOptimization.comboAnalysis.map((combo, i) => (
                  <div
                    key={i}
                    className="border-b border-osrs-border last:border-0 pb-2 last:pb-0"
                  >
                    <div className="flex flex-wrap gap-1 mb-1">
                      {combo.combo.map((p) => (
                        <Badge key={p} variant="red" size="sm">{p}</Badge>
                      ))}
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div>
                        <span className="text-osrs-text-dim">Synergy: </span>
                        <span className="text-osrs-text">{combo.synergy}</span>
                      </div>
                      <div>
                        <span className="text-osrs-text-dim">Risk: </span>
                        <span className="text-demon-glow">{combo.risk}</span>
                      </div>
                      <div>
                        <span className="text-osrs-text-dim">Reward: </span>
                        <span className="text-osrs-green">{combo.reward}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      )}

      {/* Mastery Allocation (RE only) */}
      {guide.masteryAllocation && (
        <Card>
          <h3
            className="text-xl font-bold text-demon-glow mb-3"
            style={{ fontFamily: "var(--font-runescape)" }}
          >
            Combat Mastery Allocation
          </h3>
          <p className="text-sm text-osrs-text mb-3">
            Primary style: <span className="text-osrs-gold font-bold">{guide.masteryAllocation.primaryStyle}</span>
          </p>
          <div className="space-y-2">
            {guide.masteryAllocation.distribution.map((d) => (
              <div key={d.style} className="flex items-start gap-3">
                <div className="w-20 flex-shrink-0">
                  <Badge variant={d.style === guide.masteryAllocation!.primaryStyle ? "gold" : "default"}>
                    {d.style} ({d.points})
                  </Badge>
                </div>
                <p className="text-xs text-osrs-text-dim">{d.reasoning}</p>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Echo Boss Strategy */}
      {guide.echoBossStrategy && guide.echoBossStrategy.length > 0 && (
        <div>
          <h3
            className="text-xl font-bold text-osrs-gold mb-4"
            style={{ fontFamily: "var(--font-runescape)" }}
          >
            Echo Boss Strategy
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {guide.echoBossStrategy.map((boss) => (
              <Card key={boss.boss}>
                <h4
                  className="font-bold text-osrs-text mb-1"
                  style={{ fontFamily: "var(--font-runescape)" }}
                >
                  {boss.boss}
                </h4>
                <p className="text-xs text-osrs-text-dim mb-2">{boss.region}</p>
                <p className="text-sm text-osrs-text-dim">{boss.strategy}</p>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function RegionCard({ region }: { region: RegionAnalysis }) {
  return (
    <Card>
      <div className="flex items-start gap-3">
        <Badge variant={tierColors[region.tier] ?? "default"}>{region.tier}</Badge>
        <div className="flex-1 min-w-0">
          <h4
            className="font-bold text-osrs-text mb-1"
            style={{ fontFamily: "var(--font-runescape)" }}
          >
            {region.regionName}
          </h4>
          {(region.totalTasks != null || region.totalPoints != null) && (
            <div className="flex flex-wrap gap-3 text-xs mb-2">
              {region.totalTasks != null && (
                <span>
                  <span className="text-osrs-text-dim">Tasks: </span>
                  <span className="text-osrs-text font-bold">{region.totalTasks}</span>
                </span>
              )}
              {region.totalPoints != null && (
                <span>
                  <span className="text-osrs-text-dim">Points: </span>
                  <span className="text-osrs-gold font-bold">
                    {region.totalPoints.toLocaleString()}
                  </span>
                </span>
              )}
            </div>
          )}
          {region.uniqueBosses.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-2">
              {region.uniqueBosses.map((boss) => (
                <Badge key={boss} variant="default" size="sm">{boss}</Badge>
              ))}
            </div>
          )}
          <p className="text-xs text-osrs-text-dim">{region.reasoning}</p>
        </div>
      </div>
    </Card>
  );
}
