"use client";

import { BuildAnalysis } from "@/lib/build-analysis";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { useState } from "react";

interface BuildAnalysisPanelProps {
  analysis: BuildAnalysis;
}

export function BuildAnalysisPanel({ analysis }: BuildAnalysisPanelProps) {
  const [expandedSection, setExpandedSection] = useState<string | null>("archetype");

  const toggle = (key: string) =>
    setExpandedSection((prev) => (prev === key ? null : key));

  return (
    <div className="space-y-4">
      <h2
        className="text-2xl font-bold text-osrs-gold"
        style={{ fontFamily: "var(--font-runescape)" }}
      >
        Build Analysis
      </h2>

      {/* Archetype Banner */}
      <Card glow={analysis.archetype.name === "Demonlord" ? "red" : "gold"}>
        <div className="flex items-center gap-4">
          <div className="text-4xl">{analysis.archetype.icon}</div>
          <div>
            <h3
              className="text-lg font-bold text-osrs-gold"
              style={{ fontFamily: "var(--font-runescape)" }}
            >
              {analysis.archetype.name}
            </h3>
            <p className="text-sm text-osrs-text-dim">
              {analysis.archetype.description}
            </p>
          </div>
        </div>
      </Card>

      {/* Warnings */}
      {analysis.warnings.length > 0 && (
        <AnalysisSection
          title="Warnings & Tips"
          icon="⚠️"
          count={analysis.warnings.length}
          sectionKey="warnings"
          expanded={expandedSection}
          onToggle={toggle}
        >
          <div className="space-y-2">
            {analysis.warnings.map((w, i) => (
              <div
                key={i}
                className={`flex items-start gap-3 p-3 rounded-lg ${
                  w.severity === "critical"
                    ? "bg-demon-glow/10 border border-demon-glow/20"
                    : w.severity === "caution"
                    ? "bg-osrs-gold/10 border border-osrs-gold/20"
                    : "bg-osrs-blue/10 border border-osrs-blue/20"
                }`}
              >
                <span className="text-lg flex-shrink-0">
                  {w.severity === "critical"
                    ? "🚨"
                    : w.severity === "caution"
                    ? "⚠️"
                    : "💡"}
                </span>
                <p className="text-sm text-osrs-text">{w.message}</p>
              </div>
            ))}
          </div>
        </AnalysisSection>
      )}

      {/* Build Balance Radar */}
      <AnalysisSection
        title="Build Balance"
        icon="📊"
        badge={analysis.buildBalance.label}
        sectionKey="balance"
        expanded={expandedSection}
        onToggle={toggle}
      >
        <div className="space-y-3">
          <BalanceBar
            label="Combat"
            value={analysis.buildBalance.combat}
            color="bg-demon-glow"
          />
          <BalanceBar
            label="Gathering"
            value={analysis.buildBalance.gathering}
            color="bg-osrs-green"
          />
          <BalanceBar
            label="Production"
            value={analysis.buildBalance.production}
            color="bg-osrs-blue"
          />
          <BalanceBar
            label="Utility"
            value={analysis.buildBalance.utility}
            color="bg-osrs-purple"
          />
          <BalanceBar
            label="Slayer"
            value={analysis.buildBalance.slayer}
            color="bg-osrs-gold"
          />
        </div>
      </AnalysisSection>

      {/* Active Synergies */}
      {analysis.synergies.length > 0 && (
        <AnalysisSection
          title="Active Synergies"
          icon="🔗"
          count={analysis.synergies.length}
          sectionKey="synergies"
          expanded={expandedSection}
          onToggle={toggle}
        >
          <div className="space-y-3">
            {analysis.synergies.map((syn, i) => (
              <div
                key={i}
                className="p-3 rounded-lg bg-osrs-green/5 border border-osrs-green/20"
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-sm text-osrs-green">
                    {syn.name}
                  </span>
                  <Badge
                    variant={
                      syn.strength === "strong"
                        ? "gold"
                        : syn.strength === "moderate"
                        ? "blue"
                        : "default"
                    }
                  >
                    {syn.strength}
                  </Badge>
                </div>
                <p className="text-xs text-osrs-text-dim mb-2">
                  {syn.description}
                </p>
                <div className="flex flex-wrap gap-1">
                  {syn.components.map((c, j) => (
                    <span
                      key={j}
                      className="text-xs bg-osrs-darker rounded px-2 py-0.5 text-osrs-text"
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </AnalysisSection>
      )}

      {/* Missed Synergies */}
      {analysis.missedSynergies.length > 0 && (
        <AnalysisSection
          title="Missed Synergies"
          icon="🔓"
          count={analysis.missedSynergies.length}
          sectionKey="missedSynergies"
          expanded={expandedSection}
          onToggle={toggle}
        >
          <div className="space-y-3">
            {analysis.missedSynergies.map((syn, i) => (
              <div
                key={i}
                className="p-3 rounded-lg bg-osrs-gold/5 border border-osrs-gold/20"
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-sm text-osrs-gold">
                    {syn.name}
                  </span>
                  <Badge variant="gold">{syn.strength}</Badge>
                </div>
                <p className="text-xs text-osrs-text-dim mb-2">
                  {syn.description}
                </p>
                <div className="flex flex-wrap gap-1">
                  {syn.components.map((c, j) => (
                    <span
                      key={j}
                      className={`text-xs rounded px-2 py-0.5 ${
                        c.includes("not selected")
                          ? "bg-osrs-gold/10 text-osrs-gold border border-osrs-gold/20"
                          : "bg-osrs-darker text-osrs-text"
                      }`}
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </AnalysisSection>
      )}

      {/* Boss Access */}
      <AnalysisSection
        title="Boss Access"
        icon="💀"
        badge={`${analysis.bossAccess.filter((b) => b.accessible).length}/${analysis.bossAccess.length}`}
        sectionKey="bosses"
        expanded={expandedSection}
        onToggle={toggle}
      >
        <div className="space-y-1">
          {(["endgame", "high", "mid"] as const).map((diff) => {
            const bosses = analysis.bossAccess.filter(
              (b) => b.difficulty === diff,
            );
            if (bosses.length === 0) return null;
            return (
              <div key={diff} className="mb-3">
                <h5 className="text-xs font-bold text-osrs-text-dim uppercase tracking-wider mb-2">
                  {diff === "endgame"
                    ? "Endgame"
                    : diff === "high"
                    ? "High-Level"
                    : "Mid-Level"}
                </h5>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                  {bosses.map((boss) => (
                    <div
                      key={boss.name}
                      className={`flex items-center gap-2 text-sm px-2.5 py-1.5 rounded ${
                        boss.accessible
                          ? "text-osrs-text bg-osrs-green/5"
                          : "text-osrs-text-dim bg-osrs-darker/50 line-through opacity-60"
                      }`}
                    >
                      <span
                        className={`w-2 h-2 rounded-full flex-shrink-0 ${
                          boss.accessible ? "bg-osrs-green" : "bg-demon-glow"
                        }`}
                      />
                      {boss.name}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </AnalysisSection>

      {/* Task Accessibility */}
      <AnalysisSection
        title="Task Accessibility"
        icon="📋"
        badge={`${analysis.taskAccess.accessible}/${analysis.taskAccess.total}`}
        sectionKey="tasks"
        expanded={expandedSection}
        onToggle={toggle}
      >
        <div className="space-y-3">
          <ProgressBar
            value={analysis.taskAccess.accessible}
            max={analysis.taskAccess.total}
            label="Accessible Tasks"
            color="bg-osrs-green"
            size="md"
          />
          <ProgressBar
            value={analysis.taskAccess.accessiblePoints}
            max={analysis.taskAccess.totalPoints}
            label="Accessible Points"
            color="bg-osrs-gold"
            size="md"
          />
          {analysis.taskAccess.inaccessible > 0 && (
            <div className="space-y-1.5 mt-3">
              <h5 className="text-xs font-bold text-osrs-text-dim uppercase tracking-wider">
                By Region
              </h5>
              {analysis.taskAccess.byRegion.map((r) => (
                <div
                  key={r.regionName}
                  className="flex items-center justify-between text-sm"
                >
                  <span
                    className={
                      r.accessible ? "text-osrs-text" : "text-osrs-text-dim line-through"
                    }
                  >
                    {r.regionName}
                  </span>
                  <span
                    className={`text-xs font-medium ${
                      r.accessible ? "text-osrs-green" : "text-demon-glow"
                    }`}
                  >
                    {r.tasks} tasks {r.accessible ? "✓" : "✗"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </AnalysisSection>

      {/* Missed Content */}
      {analysis.missedContent.regions.length > 0 && (
        <AnalysisSection
          title="Missed Content"
          icon="🚫"
          badge={`${analysis.missedContent.totalKeyContentMissed} items`}
          sectionKey="missed"
          expanded={expandedSection}
          onToggle={toggle}
        >
          <div className="space-y-3">
            {analysis.missedContent.regions.map((r) => (
              <div key={r.region.id} className="p-3 rounded-lg bg-osrs-darker/50">
                <h5 className="font-bold text-sm text-osrs-text-dim mb-1.5">
                  {r.region.name}
                </h5>
                <div className="flex flex-wrap gap-1">
                  {r.notableLosses.map((loss, i) => (
                    <span
                      key={i}
                      className="text-xs bg-demon-glow/10 text-demon-glow/80 rounded px-2 py-0.5 border border-demon-glow/10"
                    >
                      {loss}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </AnalysisSection>
      )}

      {/* Pact Tradeoffs */}
      {analysis.pactTradeoffs.length > 0 && (
        <AnalysisSection
          title="Pact Risk Assessment"
          icon="⚖️"
          sectionKey="pacts"
          expanded={expandedSection}
          onToggle={toggle}
        >
          <div className="space-y-2">
            {analysis.pactTradeoffs.map((pt) => (
              <div
                key={pt.pactName}
                className="p-3 rounded-lg bg-osrs-darker/50 border border-osrs-border"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-sm text-osrs-text">
                    {pt.pactName}
                  </span>
                  <Badge
                    variant={
                      pt.riskLevel === "extreme"
                        ? "red"
                        : pt.riskLevel === "high"
                        ? "red"
                        : pt.riskLevel === "medium"
                        ? "gold"
                        : "green"
                    }
                  >
                    {pt.riskLevel} risk
                  </Badge>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-osrs-green">+ {pt.gain}</span>
                  </div>
                  <div>
                    <span className="text-demon-glow">- {pt.cost}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </AnalysisSection>
      )}

      {/* XP/Drop Timeline */}
      <AnalysisSection
        title="Multiplier Progression"
        icon="📈"
        sectionKey="multipliers"
        expanded={expandedSection}
        onToggle={toggle}
      >
        <div className="flex items-end gap-1 h-32">
          {analysis.multiplierTimeline.map((mt) => {
            const maxXp = Math.max(
              ...analysis.multiplierTimeline.map((t) => t.xpMultiplier),
            );
            const height = (mt.xpMultiplier / maxXp) * 100;
            return (
              <div
                key={mt.tier}
                className="flex-1 flex flex-col items-center gap-1"
              >
                <span className="text-xs text-osrs-gold font-bold">
                  {mt.xpMultiplier}x
                </span>
                <div
                  className="w-full bg-gradient-to-t from-osrs-gold/60 to-osrs-gold rounded-t transition-all duration-500"
                  style={{ height: `${height}%` }}
                />
                <span className="text-xs text-osrs-text-dim">T{mt.tier}</span>
              </div>
            );
          })}
        </div>
        <div className="mt-3 flex items-center justify-between text-xs text-osrs-text-dim">
          <span>
            XP: {analysis.multiplierTimeline[0]?.xpMultiplier}x →{" "}
            {analysis.multiplierTimeline[analysis.multiplierTimeline.length - 1]?.xpMultiplier}x
          </span>
          <span>
            Drops: {analysis.multiplierTimeline[0]?.dropMultiplier}x →{" "}
            {analysis.multiplierTimeline[analysis.multiplierTimeline.length - 1]?.dropMultiplier}x
          </span>
        </div>
      </AnalysisSection>
    </div>
  );
}

// ─── Collapsible Section ────────────────────────────────────────────────

function AnalysisSection({
  title,
  icon,
  badge,
  count,
  sectionKey,
  expanded,
  onToggle,
  children,
}: {
  title: string;
  icon: string;
  badge?: string;
  count?: number;
  sectionKey: string;
  expanded: string | null;
  onToggle: (key: string) => void;
  children: React.ReactNode;
}) {
  const isOpen = expanded === sectionKey;

  return (
    <Card>
      <button
        onClick={() => onToggle(sectionKey)}
        className="w-full flex items-center justify-between"
      >
        <div className="flex items-center gap-2">
          <span className="text-lg">{icon}</span>
          <h4 className="font-bold text-osrs-text text-sm">{title}</h4>
          {badge && <Badge variant="default">{badge}</Badge>}
          {count !== undefined && (
            <Badge variant="gold">{count}</Badge>
          )}
        </div>
        <svg
          className={`w-4 h-4 text-osrs-text-dim transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
      {isOpen && <div className="mt-4">{children}</div>}
    </Card>
  );
}

// ─── Balance Bar ────────────────────────────────────────────────────────

function BalanceBar({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-osrs-text-dim w-20">{label}</span>
      <div className="flex-1 h-3 bg-osrs-darker rounded-full overflow-hidden">
        <div
          className={`h-full ${color} rounded-full transition-all duration-500`}
          style={{ width: `${value}%` }}
        />
      </div>
      <span className="text-xs text-osrs-text font-medium w-8 text-right">
        {value}
      </span>
    </div>
  );
}
