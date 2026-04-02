"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import type { CombatMasteryGuide } from "@/types/league-guides";

const styleColor = (s: string) => s === "melee" ? "text-demon-glow" : s === "ranged" ? "text-osrs-green" : "text-osrs-blue";

export function CombatMasterySection({ guide }: { guide: CombatMasteryGuide }) {
  const [expandedStyle, setExpandedStyle] = useState<string | null>(guide.styles[0]?.style ?? null);

  return (
    <div className="space-y-6">
      <p className="text-osrs-text-dim">{guide.intro}</p>

      {/* Point Sources */}
      <Card>
        <h3 className="font-bold text-osrs-gold mb-3" style={{ fontFamily: "var(--font-runescape)" }}>
          Mastery Point Sources
        </h3>
        <p className="text-xs text-osrs-text-dim mb-2">Earn up to 10 mastery points from combat milestones. Distribute them across the 3 styles.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {guide.pointSources.map((source, i) => (
            <div key={i} className="flex items-start gap-2 text-sm">
              <span className="text-osrs-gold font-bold w-5 flex-shrink-0">{i + 1}.</span>
              <span className="text-osrs-text-dim">{source}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Universal Passives */}
      <Card>
        <h3 className="font-bold text-osrs-blue mb-3" style={{ fontFamily: "var(--font-runescape)" }}>
          Universal Passives
        </h3>
        <p className="text-xs text-osrs-text-dim mb-2">Unlocked through mastery progression, applied to all combat styles.</p>
        <ul className="space-y-1">
          {guide.universalPassives.map((passive, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-osrs-text-dim">
              <span className="text-osrs-blue mt-0.5">&#x2726;</span>
              {passive}
            </li>
          ))}
        </ul>
      </Card>

      {/* Combat Styles */}
      <div>
        <h3 className="font-bold text-osrs-gold mb-4" style={{ fontFamily: "var(--font-runescape)" }}>
          Combat Styles
        </h3>
        <div className="space-y-3">
          {guide.styles.map((style) => (
            <Card key={style.style} className="!p-4">
              <button
                onClick={() => setExpandedStyle(expandedStyle === style.style ? null : style.style)}
                className="w-full flex items-center gap-3 text-left"
              >
                <h4 className={`font-bold ${styleColor(style.style)}`} style={{ fontFamily: "var(--font-runescape)" }}>
                  {style.name}
                </h4>
                <div className="flex gap-1 ml-auto mr-2">
                  {style.bestFor.map((b) => (
                    <Badge key={b} variant="default" size="sm">{b}</Badge>
                  ))}
                </div>
                <span className="text-osrs-text-dim text-sm">{expandedStyle === style.style ? "▲" : "▼"}</span>
              </button>
              {expandedStyle === style.style && (
                <div className="mt-3 border-t border-osrs-border pt-3 space-y-3">
                  <div>
                    <h5 className="text-xs font-bold text-osrs-text mb-1">Strengths</h5>
                    <div className="flex flex-wrap gap-1">
                      {style.strengths.map((s) => (
                        <Badge key={s} variant="green" size="sm">{s}</Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-osrs-text mb-2">Tier Effects</h5>
                    <div className="space-y-2">
                      {style.tiers.map((tier) => (
                        <div key={tier.tier} className="flex items-start gap-3 bg-osrs-darker rounded-lg p-2">
                          <Badge variant={tier.tier >= 5 ? "gold" : tier.tier >= 3 ? "blue" : "default"} size="sm">
                            T{tier.tier}
                          </Badge>
                          <span className="text-xs text-osrs-text-dim">{tier.effect}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
      </div>

      {/* Distribution Recommendations */}
      <div>
        <h3 className="font-bold text-osrs-gold mb-4" style={{ fontFamily: "var(--font-runescape)" }}>
          Recommended Distributions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {guide.distributions.map((dist) => (
            <Card key={dist.name}>
              <h4 className="font-bold text-osrs-text mb-1" style={{ fontFamily: "var(--font-runescape)" }}>
                {dist.name}
              </h4>
              <p className="text-xs text-osrs-text-dim mb-2">{dist.description}</p>
              <div className="flex gap-3 mb-2">
                {dist.allocation.map((a) => (
                  <div key={a.style} className="text-center">
                    <div className="text-lg font-bold text-osrs-gold">{a.points}</div>
                    <div className="text-xs text-osrs-text-dim capitalize">{a.style}</div>
                  </div>
                ))}
              </div>
              <p className="text-xs text-osrs-green">{dist.bestFor}</p>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
