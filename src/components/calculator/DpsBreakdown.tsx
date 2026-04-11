"use client";

import { useState } from "react";
import type { DpsBreakdown as DpsBreakdownType } from "@/types/dps";

interface Props {
  breakdown: DpsBreakdownType | null;
}

export function DpsBreakdown({ breakdown }: Props) {
  const [expanded, setExpanded] = useState(false);

  if (!breakdown) return null;

  return (
    <div className="space-y-2">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-2 text-xs text-osrs-text-dim hover:text-osrs-gold transition-colors"
      >
        <svg
          className={`w-3 h-3 transition-transform ${expanded ? "rotate-90" : ""}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
        Formula Breakdown
      </button>

      {expanded && (
        <div className="bg-osrs-darker rounded-lg border border-osrs-border p-3 space-y-2 text-xs font-mono">
          <Row label="Effective Level" value={breakdown.effectiveLevel} />
          <Row label="Equipment Strength" value={breakdown.equipmentStrength} />
          <Row label="Base Max Hit" value={breakdown.baseMaxHit} />

          {breakdown.multiplierChain.length > 0 && (
            <div className="border-t border-osrs-border pt-2">
              <div className="text-osrs-text-dim mb-1">Multiplier Chain:</div>
              {breakdown.multiplierChain.map((step, i) => (
                <div key={i} className="pl-3 text-osrs-text-dim">
                  x{step.factor.toFixed(3)} <span className="text-osrs-gold-dim">{step.name}</span>
                </div>
              ))}
            </div>
          )}

          <Row label="Final Max Hit" value={breakdown.finalMaxHit} highlight />
          <div className="border-t border-osrs-border pt-2" />
          <Row label="Attack Roll" value={breakdown.attackRoll.toLocaleString()} />
          <Row label="Defence Roll" value={breakdown.defenceRoll.toLocaleString()} />
          <Row label="Base Accuracy" value={`${(breakdown.baseAccuracy * 100).toFixed(2)}%`} />
          <Row label="Final Accuracy" value={`${(breakdown.finalAccuracy * 100).toFixed(2)}%`} highlight />
          <div className="border-t border-osrs-border pt-2" />
          <Row label="Attack Speed" value={`${breakdown.attackSpeed}t`} />
          <Row label="Base DPS" value={breakdown.baseDps.toFixed(3)} />
          {breakdown.echoDps > 0 && <Row label="Echo DPS" value={`+${breakdown.echoDps.toFixed(3)}`} />}
          {breakdown.bonusDps > 0 && <Row label="Bonus DPS" value={`+${breakdown.bonusDps.toFixed(3)}`} />}
          <Row
            label="Total DPS"
            value={(breakdown.baseDps + breakdown.echoDps + breakdown.bonusDps).toFixed(3)}
            highlight
          />
        </div>
      )}
    </div>
  );
}

function Row({ label, value, highlight }: { label: string; value: string | number; highlight?: boolean }) {
  return (
    <div className="flex justify-between">
      <span className="text-osrs-text-dim">{label}</span>
      <span className={highlight ? "text-osrs-gold font-semibold" : "text-osrs-text"}>{value}</span>
    </div>
  );
}
