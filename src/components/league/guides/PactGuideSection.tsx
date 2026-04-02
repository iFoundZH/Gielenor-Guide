"use client";

import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import type { PactGuide } from "@/types/league-guides";

const rankVariant = (r: string) => r === "S" ? "gold" : r === "A" ? "blue" : "default";

export function PactGuideSection({ guide }: { guide: PactGuide }) {
  return (
    <div className="space-y-6">
      <Card className="border-demon-ember/30 bg-demon-ember/5">
        <div className="flex items-start gap-3">
          <span className="text-demon-ember text-lg mt-0.5">&#x26A0;</span>
          <p className="text-sm text-osrs-text-dim">{guide.intro}</p>
        </div>
      </Card>

      <div>
        <h3 className="font-bold text-demon-glow mb-4" style={{ fontFamily: "var(--font-runescape)" }}>
          Pact Rankings
        </h3>
        <div className="space-y-3">
          {guide.pacts.map((pact) => (
            <Card key={pact.name} className="!p-4">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant={rankVariant(pact.ranking)}>{pact.ranking}</Badge>
                <span className="font-bold text-osrs-text">{pact.name}</span>
                <Badge variant="default" size="sm">Tier {pact.tier}</Badge>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2 text-xs">
                <div>
                  <span className="text-osrs-green font-bold">Bonus: </span>
                  <span className="text-osrs-text-dim">{pact.bonus}</span>
                </div>
                <div>
                  <span className="text-demon-glow font-bold">Penalty: </span>
                  <span className="text-osrs-text-dim">{pact.penalty}</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-1 mb-1">
                {pact.bestFor.map((b) => (
                  <Badge key={b} variant="green" size="sm">{b}</Badge>
                ))}
              </div>
              <p className="text-xs text-osrs-text-dim">
                <span className="text-demon-glow">Avoid if: </span>{pact.avoidIf}
              </p>
            </Card>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-bold text-demon-ember mb-4" style={{ fontFamily: "var(--font-runescape)" }}>
          Pact Combinations
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {guide.combos.map((combo) => (
            <Card key={combo.name}>
              <h4 className="font-bold text-osrs-text mb-2" style={{ fontFamily: "var(--font-runescape)" }}>
                {combo.name}
              </h4>
              <div className="flex flex-wrap gap-1 mb-2">
                {combo.pacts.map((p) => (
                  <Badge key={p} variant="red" size="sm">{p}</Badge>
                ))}
              </div>
              <div className="space-y-1 text-xs">
                <p><span className="text-osrs-gold font-bold">Synergy: </span><span className="text-osrs-text-dim">{combo.synergy}</span></p>
                <p><span className="text-demon-glow font-bold">Risk: </span><span className="text-osrs-text-dim">{combo.risk}</span></p>
                <p><span className="text-osrs-green font-bold">Best for: </span><span className="text-osrs-text-dim">{combo.bestFor}</span></p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
