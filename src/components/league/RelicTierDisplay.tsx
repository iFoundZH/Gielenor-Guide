import { RelicTier } from "@/types/league";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import type { RelicPowerRating } from "@/lib/relic-metrics";

interface RelicTierDisplayProps {
  relicTier: RelicTier;
  selectedRelicId?: string;
  onSelect?: (relicId: string) => void;
  powerRatings?: Record<string, RelicPowerRating>;
}

const tierColors: Record<number, string> = {
  1: "text-osrs-green",
  2: "text-osrs-blue",
  3: "text-osrs-gold",
  4: "text-osrs-purple",
  5: "text-osrs-purple",
  6: "text-demon-ember",
  7: "text-demon-ember",
  8: "text-demon-glow",
};

const AXIS_COLORS: Record<string, string> = {
  DPS: "bg-demon-glow/20 text-demon-glow",
  Skill: "bg-osrs-green/20 text-osrs-green",
  QoL: "bg-osrs-blue/20 text-osrs-blue",
  Pts: "bg-osrs-gold/20 text-osrs-gold",
  AFK: "bg-osrs-purple/20 text-osrs-purple",
};

export function RelicTierDisplay({ relicTier, selectedRelicId, onSelect, powerRatings }: RelicTierDisplayProps) {
  const { tier, passiveEffects, relics } = relicTier;
  const hasRelicChoices = relics.length > 0;

  return (
    <div>
      <h3
        className={`text-lg font-bold mb-2 ${tierColors[tier] || "text-osrs-text"}`}
        style={{ fontFamily: "var(--font-runescape)" }}
      >
        Tier {tier}
      </h3>

      {/* Passive effects */}
      {passiveEffects.length > 0 && (
        <div className="mb-4 bg-osrs-darker/50 rounded-lg p-3">
          <span className="text-xs font-bold text-osrs-text-dim uppercase tracking-wider">Passive Unlocks</span>
          <div className="mt-1.5 space-y-1">
            {passiveEffects.map((effect, i) => (
              <div key={i} className="flex items-start gap-2 text-sm">
                <span className="text-osrs-gold mt-0.5">★</span>
                <span className="text-osrs-text-dim">{effect}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Relic choices */}
      {hasRelicChoices ? (
        <div className={`grid grid-cols-1 ${relics.length > 1 ? "md:grid-cols-3" : "md:grid-cols-1 max-w-xl"} gap-4`}>
          {relics.map((relic) => {
            const isSelected = selectedRelicId === relic.id;
            return (
              <Card
                key={relic.id}
                hover={!!onSelect}
                glow={isSelected ? "gold" : "none"}
                onClick={onSelect ? () => onSelect(relic.id) : undefined}
                className={`relative ${onSelect ? "cursor-pointer" : ""} ${
                  isSelected ? "ring-2 ring-osrs-gold" : ""
                }`}
              >
                {isSelected && (
                  <div className="absolute top-3 right-3">
                    <Badge variant="gold">Selected</Badge>
                  </div>
                )}
                <h4 className="font-bold text-osrs-text mb-1">{relic.name}</h4>
                <p className="text-sm text-osrs-text-dim mb-3">{relic.description}</p>
                <div className="space-y-1.5">
                  {relic.effects.map((effect, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs">
                      <span className="text-osrs-green mt-0.5">✦</span>
                      <span className="text-osrs-text-dim">{effect}</span>
                    </div>
                  ))}
                </div>
                {powerRatings?.[relic.id] && (() => {
                  const pr = powerRatings[relic.id];
                  const axes: [string, number][] = [
                    ["DPS", pr.dps], ["Skill", pr.skilling], ["QoL", pr.qol], ["Pts", pr.pointGen], ["AFK", pr.afk],
                  ];
                  const visible = axes.filter(([, v]) => v > 0);
                  if (visible.length === 0) return null;
                  return (
                    <div className="mt-3 pt-3 border-t border-osrs-border flex flex-wrap gap-1">
                      {visible.map(([label, val]) => (
                        <span key={label} className={`inline-flex items-center gap-1 text-xs font-medium rounded px-1.5 py-0.5 ${AXIS_COLORS[label] || "bg-osrs-darker text-osrs-text"}`}>
                          {label} {val}
                        </span>
                      ))}
                    </div>
                  );
                })()}
                {relic.synergies && relic.synergies.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-osrs-border flex flex-wrap gap-1">
                    {relic.synergies.map((s, i) => (
                      <Badge key={i} variant="blue">{s}</Badge>
                    ))}
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="text-sm text-osrs-text-dim italic bg-osrs-panel border border-osrs-border rounded-lg p-4">
          Passive tier only — no relic choice. Effects are unlocked automatically.
        </div>
      )}
    </div>
  );
}
