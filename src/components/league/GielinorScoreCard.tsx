"use client";

import { GielinorScore, getRankInfo, getAllRanks } from "@/lib/player-score";
import { Card } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";

interface GielinorScoreCardProps {
  score: GielinorScore;
  playerName?: string;
  afkScore?: number;
}

const IMPROVEMENT_TIPS: Record<string, string> = {
  tasks: "Complete more tasks — master and elite tasks give the biggest boost.",
  completion: "Branch out — complete tasks in categories you haven't touched yet.",
  build: "Pick synergistic relics and pacts that combo together.",
  risk: "Activate more pacts — higher-tier pacts and dangerous combos score big.",
};

function getImprovementTip(breakdown: GielinorScore["breakdown"]): { axis: string; tip: string; headroom: number } | null {
  const axes = [
    { axis: "tasks", headroom: 1500 - breakdown.tasks, pct: breakdown.tasks / 1500 },
    { axis: "completion", headroom: 500 - breakdown.completion, pct: breakdown.completion / 500 },
    { axis: "build", headroom: 500 - breakdown.build, pct: breakdown.build / 500 },
    { axis: "risk", headroom: 500 - breakdown.risk, pct: breakdown.risk / 500 },
  ];

  // Find the axis with the lowest fill percentage that still has meaningful headroom
  const improvable = axes.filter((a) => a.headroom > 20).sort((a, b) => a.pct - b.pct);
  if (improvable.length === 0) return null;

  const best = improvable[0];
  return { axis: best.axis, tip: IMPROVEMENT_TIPS[best.axis], headroom: best.headroom };
}

export function GielinorScoreCard({ score, playerName, afkScore }: GielinorScoreCardProps) {
  const { color } = getRankInfo(score.total);
  const ranks = getAllRanks();
  const currentRankIdx = ranks.findIndex((r) => r.rank === score.rank);
  const nextRank = currentRankIdx > 0 ? ranks[currentRankIdx - 1] : null;
  const currentRankMin = ranks[currentRankIdx]?.min ?? 0;
  const improvement = score.total > 0 ? getImprovementTip(score.breakdown) : null;

  return (
    <Card glow="gold" className="relative overflow-hidden">
      {/* Background decoration */}
      <div
        className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-10"
        style={{ backgroundColor: color }}
      />

      <div className="relative">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xs text-osrs-text-dim uppercase tracking-wider">
              Gielinor Score
            </h3>
            {playerName && (
              <p className="text-sm text-osrs-text">{playerName}</p>
            )}
          </div>
          <div className="text-right">
            <div
              className="text-3xl font-black"
              style={{ color, fontFamily: "var(--font-runescape)" }}
            >
              {score.total.toLocaleString()}
            </div>
            <div className="text-sm font-bold" style={{ color }}>
              {score.rank}
            </div>
          </div>
        </div>

        {/* Score Breakdown */}
        <div className="space-y-2 mb-4">
          <ScoreRow label="Tasks" value={score.breakdown.tasks} max={1500} color="bg-osrs-gold" highlight={improvement?.axis === "tasks"} />
          <ScoreRow label="Completion" value={score.breakdown.completion} max={500} color="bg-osrs-green" highlight={improvement?.axis === "completion"} />
          <ScoreRow label="Build" value={score.breakdown.build} max={500} color="bg-osrs-blue" highlight={improvement?.axis === "build"} />
          <ScoreRow label="Risk" value={score.breakdown.risk} max={500} color="bg-demon-glow" highlight={improvement?.axis === "risk"} />
          {afkScore !== undefined && (
            <ScoreRow label="AFK Rating" value={afkScore} max={100} color="bg-osrs-purple" />
          )}
        </div>

        {/* Improvement Tip */}
        {improvement && (
          <div className="mb-4 px-3 py-2 rounded-lg bg-osrs-darker/60 border border-osrs-border/50">
            <p className="text-xs text-osrs-text-dim">
              <span className="text-osrs-gold font-medium">Biggest gain:</span>{" "}
              {improvement.tip}
              <span className="text-osrs-text-dim/60"> (+{improvement.headroom} possible)</span>
            </p>
          </div>
        )}

        {/* Next Rank Progress */}
        {nextRank && (
          <div className="pt-3 border-t border-osrs-border">
            <div className="flex justify-between text-xs text-osrs-text-dim mb-1">
              <span>Next: <span style={{ color: nextRank.color }}>{nextRank.rank}</span></span>
              <span>{(nextRank.min - score.total).toLocaleString()} pts to go</span>
            </div>
            <ProgressBar
              value={score.total - currentRankMin}
              max={nextRank.min - currentRankMin}
              showText={false}
              size="sm"
              color="bg-osrs-gold"
            />
          </div>
        )}

        {/* Score context */}
        <div className="mt-3 text-center">
          <span className="text-xs text-osrs-text-dim">
            {score.total} / 3,000 possible points
          </span>
        </div>
      </div>
    </Card>
  );
}

function ScoreRow({
  label,
  value,
  max,
  color,
  highlight,
}: {
  label: string;
  value: number;
  max: number;
  color: string;
  highlight?: boolean;
}) {
  return (
    <div className={`flex items-center gap-3 ${highlight ? "rounded px-1 -mx-1 bg-osrs-gold/5" : ""}`}>
      <span className={`text-xs w-20 ${highlight ? "text-osrs-gold font-medium" : "text-osrs-text-dim"}`}>{label}</span>
      <div className="flex-1">
        <ProgressBar value={value} max={max} showText={false} size="sm" color={color} />
      </div>
      <span className="text-xs text-osrs-text font-medium w-10 text-right">{value}</span>
    </div>
  );
}

/**
 * Compact version for inline display (like raider.io badge)
 */
export function GielinorScoreBadge({ score }: { score: number }) {
  const { rank, color } = getRankInfo(score);

  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-sm font-bold border"
      style={{
        color,
        borderColor: `${color}40`,
        backgroundColor: `${color}10`,
      }}
    >
      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
      {score.toLocaleString()}
      <span className="text-xs opacity-70">{rank}</span>
    </span>
  );
}
