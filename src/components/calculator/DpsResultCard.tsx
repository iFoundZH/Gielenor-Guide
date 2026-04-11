"use client";

import type { DpsResult } from "@/types/dps";

interface Props {
  result: DpsResult | null;
}

export function DpsResultCard({ result }: Props) {
  if (!result) {
    return (
      <div className="bg-osrs-darker rounded-xl border border-osrs-border p-4 text-center">
        <div className="text-osrs-text-dim text-sm">Configure your build to see DPS</div>
      </div>
    );
  }

  return (
    <div className="bg-osrs-darker rounded-xl border border-osrs-gold/30 p-4 border-glow-gold">
      <div className="text-center mb-3">
        <div data-testid="dps-value" className="text-3xl font-bold text-osrs-gold text-glow-gold" style={{ fontFamily: "var(--font-runescape)" }}>
          {result.dps.toFixed(2)}
        </div>
        <div className="text-xs text-osrs-text-dim">DPS (damage per second)</div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <StatBlock label="Max Hit" value={result.maxHit.toString()} />
        <StatBlock label="Accuracy" value={`${(result.accuracy * 100).toFixed(1)}%`} />
        <StatBlock label="Speed" value={`${result.speed}t (${(result.speed * 0.6).toFixed(1)}s)`} />
        <StatBlock label="Echo DPS" value={result.echoDps > 0 ? `+${result.echoDps.toFixed(2)}` : "—"} />
      </div>

      <div className="mt-2 text-center">
        <a
          href="https://tools.runescape.wiki/osrs-dps/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[10px] text-osrs-text-dim hover:text-osrs-gold transition-colors"
        >
          Compare with Wiki DPS Calculator &rarr;
        </a>
      </div>
    </div>
  );
}

function StatBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-osrs-panel rounded-lg px-3 py-2">
      <div className="text-[10px] text-osrs-text-dim">{label}</div>
      <div className="text-sm font-medium text-osrs-text">{value}</div>
    </div>
  );
}
