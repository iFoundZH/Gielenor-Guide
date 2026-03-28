"use client";

import { GielinorScore, getRankInfo, getAllRanks } from "@/lib/player-score";
import { Card } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";

interface GielinorScoreCardProps {
  score: GielinorScore;
  playerName?: string;
}

export function GielinorScoreCard({ score, playerName }: GielinorScoreCardProps) {
  const { color } = getRankInfo(score.total);
  const ranks = getAllRanks();
  const currentRankIdx = ranks.findIndex((r) => r.rank === score.rank);
  const nextRank = currentRankIdx > 0 ? ranks[currentRankIdx - 1] : null;

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
          <ScoreRow label="Tasks" value={score.breakdown.tasks} max={1500} color="bg-osrs-gold" />
          <ScoreRow label="Completion" value={score.breakdown.completion} max={500} color="bg-osrs-green" />
          <ScoreRow label="Build" value={score.breakdown.build} max={500} color="bg-osrs-blue" />
          <ScoreRow label="Risk" value={score.breakdown.risk} max={500} color="bg-demon-glow" />
        </div>

        {/* Next Rank Progress */}
        {nextRank && (
          <div className="pt-3 border-t border-osrs-border">
            <div className="flex justify-between text-xs text-osrs-text-dim mb-1">
              <span>Next: <span style={{ color: nextRank.color }}>{nextRank.rank}</span></span>
              <span>{(nextRank.min - score.total).toLocaleString()} pts to go</span>
            </div>
            <ProgressBar
              value={score.total}
              max={nextRank.min}
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
}: {
  label: string;
  value: number;
  max: number;
  color: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-osrs-text-dim w-20">{label}</span>
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
