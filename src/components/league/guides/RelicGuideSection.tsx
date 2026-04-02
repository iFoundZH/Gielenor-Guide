"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import type { RelicGuide } from "@/types/league-guides";

const rankVariant = (r: string) => r === "S" ? "gold" : r === "A" ? "blue" : "default";

export function RelicGuideSection({ guide }: { guide: RelicGuide }) {
  const [expandedTier, setExpandedTier] = useState<number | null>(null);

  return (
    <div className="space-y-6">
      <p className="text-osrs-text-dim">{guide.intro}</p>
      <div className="space-y-3">
        {guide.tiers.map((tier) => (
          <Card key={tier.tier} className="!p-4">
            <button
              onClick={() => setExpandedTier(expandedTier === tier.tier ? null : tier.tier)}
              className="w-full flex items-center gap-3 text-left"
            >
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-osrs-gold/20 flex items-center justify-center">
                <span className="text-osrs-gold font-bold text-sm">T{tier.tier}</span>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-osrs-text" style={{ fontFamily: "var(--font-runescape)" }}>
                    Tier {tier.tier}
                  </span>
                  {tier.unlockPoints !== undefined && (
                    <span className="text-xs text-osrs-text-dim">{tier.unlockPoints.toLocaleString()} pts</span>
                  )}
                  {tier.mandatory && <Badge variant="red">Mandatory</Badge>}
                  <span className="text-xs text-osrs-text-dim ml-auto">
                    {tier.relics.length} option{tier.relics.length !== 1 ? "s" : ""}
                  </span>
                </div>
                {tier.passiveEffects.length > 0 && (
                  <p className="text-xs text-osrs-text-dim mt-0.5">
                    {tier.passiveEffects[0]}
                  </p>
                )}
              </div>
              <span className="text-osrs-text-dim text-sm">{expandedTier === tier.tier ? "▲" : "▼"}</span>
            </button>
            {expandedTier === tier.tier && (
              <div className="mt-4 space-y-3 border-t border-osrs-border pt-4">
                {tier.passiveEffects.length > 1 && (
                  <div className="mb-3">
                    <h4 className="text-xs font-bold text-osrs-gold mb-1">Passive Effects</h4>
                    <ul className="space-y-1">
                      {tier.passiveEffects.map((e, i) => (
                        <li key={i} className="text-xs text-osrs-text-dim flex items-start gap-2">
                          <span className="text-osrs-gold">&#x2022;</span> {e}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {tier.relics.map((relic) => (
                  <div key={relic.name} className="bg-osrs-darker rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant={rankVariant(relic.ranking)}>{relic.ranking}</Badge>
                      <span className="font-bold text-osrs-text">{relic.name}</span>
                    </div>
                    <p className="text-sm text-osrs-text-dim mb-2">{relic.description}</p>
                    <div className="flex flex-wrap gap-1 mb-1">
                      {relic.bestFor.map((b) => (
                        <Badge key={b} variant="green" size="sm">{b}</Badge>
                      ))}
                    </div>
                    {relic.synergyWith.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        <span className="text-xs text-osrs-text-dim">Synergy:</span>
                        {relic.synergyWith.map((s) => (
                          <Badge key={s} variant="purple" size="sm">{s}</Badge>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
