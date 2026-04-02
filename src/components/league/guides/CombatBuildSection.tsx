"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import type { CombatBuildGuide } from "@/types/league-guides";

const styleVariant = (s: string) => s === "Melee" ? "red" : s === "Ranged" ? "green" : s === "Magic" ? "blue" : "purple";
const diffVariant = (d: string) => d === "Expert" ? "red" : d === "Advanced" ? "purple" : d === "Beginner" ? "green" : "gold";

export function CombatBuildSection({ guide }: { guide: CombatBuildGuide }) {
  const [expanded, setExpanded] = useState<string | null>(guide.builds[0]?.id ?? null);

  return (
    <div className="space-y-6">
      <p className="text-osrs-text-dim">{guide.intro}</p>
      <div className="space-y-4">
        {guide.builds.map((build) => (
          <Card key={build.id}>
            <button
              onClick={() => setExpanded(expanded === build.id ? null : build.id)}
              className="w-full text-left"
            >
              <div className="flex items-center gap-2 mb-1">
                <Badge variant={styleVariant(build.style)}>{build.style}</Badge>
                <h3 className="font-bold text-osrs-text" style={{ fontFamily: "var(--font-runescape)" }}>
                  {build.name}
                </h3>
                <Badge variant={diffVariant(build.difficulty)}>{build.difficulty}</Badge>
                <span className="text-osrs-text-dim text-sm ml-auto">{expanded === build.id ? "▲" : "▼"}</span>
              </div>
              <p className="text-sm text-osrs-text-dim">{build.description}</p>
            </button>
            {expanded === build.id && (
              <div className="mt-4 space-y-4 border-t border-osrs-border pt-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Regions */}
                  <div>
                    <h4 className="text-xs font-bold text-osrs-blue mb-2">Regions</h4>
                    <div className="space-y-1">
                      {build.regions.map((r) => (
                        <div key={r} className="flex items-center gap-2 text-sm">
                          <span className="text-osrs-blue">&#x25C6;</span>
                          <span className="text-osrs-text-dim">{r}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  {/* Relics */}
                  <div>
                    <h4 className="text-xs font-bold text-osrs-gold mb-2">Relics</h4>
                    <div className="space-y-1">
                      {build.relics.map((r) => (
                        <div key={r.name} className="flex items-center gap-2 text-sm">
                          <span className="text-osrs-gold text-xs font-bold w-6">T{r.tier}</span>
                          <span className="text-osrs-text-dim">{r.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  {/* Masteries or Pacts */}
                  <div>
                    {build.mastery && build.mastery.length > 0 && (
                      <>
                        <h4 className="text-xs font-bold text-demon-glow mb-2">Masteries</h4>
                        <div className="space-y-1">
                          {build.mastery.map((m) => (
                            <div key={m} className="flex items-center gap-2 text-sm">
                              <span className="text-demon-ember">&#x2694;</span>
                              <span className="text-osrs-text-dim">{m}</span>
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                    {build.pacts && build.pacts.length > 0 && (
                      <>
                        <h4 className="text-xs font-bold text-demon-glow mb-2 mt-2">Pacts</h4>
                        <div className="space-y-1">
                          {build.pacts.map((p) => (
                            <div key={p} className="flex items-center gap-2 text-sm">
                              <span className="text-demon-ember">&#x1F525;</span>
                              <span className="text-osrs-text-dim">{p}</span>
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                </div>
                {/* Gear Progression */}
                <div>
                  <h4 className="text-xs font-bold text-osrs-gold mb-2">Gear Progression</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {build.gearProgression.map((phase) => (
                      <div key={phase.phase} className="bg-osrs-darker rounded-lg p-3">
                        <h5 className="text-xs font-bold text-osrs-text mb-1">{phase.phase}</h5>
                        <ul className="space-y-1">
                          {phase.items.map((item, i) => (
                            <li key={i} className="text-xs text-osrs-text-dim">&#x2022; {item}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
                {/* Strengths & Weaknesses */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-xs font-bold text-osrs-green mb-2">Strengths</h4>
                    <ul className="space-y-1">
                      {build.strengths.map((s, i) => (
                        <li key={i} className="text-xs text-osrs-text-dim flex items-start gap-2">
                          <span className="text-osrs-green">+</span> {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-demon-glow mb-2">Weaknesses</h4>
                    <ul className="space-y-1">
                      {build.weaknesses.map((w, i) => (
                        <li key={i} className="text-xs text-osrs-text-dim flex items-start gap-2">
                          <span className="text-demon-glow">-</span> {w}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
