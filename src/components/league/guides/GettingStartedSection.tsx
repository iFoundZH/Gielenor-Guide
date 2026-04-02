"use client";

import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import type { GettingStartedGuide } from "@/types/league-guides";

export function GettingStartedSection({ guide }: { guide: GettingStartedGuide }) {
  return (
    <div className="space-y-6">
      <p className="text-osrs-text-dim">{guide.intro}</p>
      <div className="space-y-4">
        {guide.steps.map((step, i) => (
          <Card key={i}>
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-osrs-gold/20 flex items-center justify-center">
                <span className="text-osrs-gold font-bold text-sm">{i + 1}</span>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold text-osrs-text" style={{ fontFamily: "var(--font-runescape)" }}>
                    {step.title}
                  </h3>
                  <Badge variant="default">{step.timeframe}</Badge>
                </div>
                <div className="mb-3">
                  <h4 className="text-xs font-bold text-osrs-gold mb-1">Objectives</h4>
                  <ul className="space-y-1">
                    {step.objectives.map((obj, j) => (
                      <li key={j} className="flex items-start gap-2 text-sm text-osrs-text-dim">
                        <span className="text-osrs-green mt-0.5 flex-shrink-0">&#x2726;</span>
                        {obj}
                      </li>
                    ))}
                  </ul>
                </div>
                {step.tips.length > 0 && (
                  <div>
                    <h4 className="text-xs font-bold text-osrs-blue mb-1">Tips</h4>
                    <ul className="space-y-1">
                      {step.tips.map((tip, j) => (
                        <li key={j} className="flex items-start gap-2 text-xs text-osrs-text-dim">
                          <span className="text-osrs-blue mt-0.5 flex-shrink-0">&#x25B8;</span>
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
