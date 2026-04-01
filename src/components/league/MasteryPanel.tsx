import type { MasterySystem } from "@/types/league";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ProgressBar } from "@/components/ui/ProgressBar";

interface MasteryPanelProps {
  masteries: MasterySystem;
  /** Array of selected mastery tier IDs like "re-mastery-melee-1", "re-mastery-ranged-3" */
  selectedTiers: string[];
  onToggleTier: (tierId: string) => void;
}

const styleColors: Record<string, { badge: "red" | "green" | "blue"; accent: string; glow: string }> = {
  melee: { badge: "red", accent: "text-demon-glow", glow: "border-demon-glow/40" },
  ranged: { badge: "green", accent: "text-osrs-green", glow: "border-osrs-green/40" },
  magic: { badge: "blue", accent: "text-osrs-blue", glow: "border-osrs-blue/40" },
};

/** Count total mastery points spent from selected tier IDs */
function countPoints(selectedTiers: string[]): number {
  return selectedTiers.length;
}

/** Get the highest unlocked tier for a given style from selected tier IDs */
function getHighestTier(selectedTiers: string[], styleId: string): number {
  let max = 0;
  for (const id of selectedTiers) {
    if (id.startsWith(styleId + "-")) {
      const tier = parseInt(id.split("-").pop()!);
      if (tier > max) max = tier;
    }
  }
  return max;
}

/** Get the highest tier reached across any style (for universal passives) */
function getHighestUniversalTier(selectedTiers: string[]): number {
  let max = 0;
  for (const id of selectedTiers) {
    const tier = parseInt(id.split("-").pop()!);
    if (tier > max) max = tier;
  }
  return max;
}

export function MasteryPanel({ masteries, selectedTiers, onToggleTier }: MasteryPanelProps) {
  const pointsUsed = countPoints(selectedTiers);
  const pointsRemaining = masteries.maxPoints - pointsUsed;
  const highestUniversalTier = getHighestUniversalTier(selectedTiers);

  return (
    <div className="space-y-6">
      {/* Points Budget */}
      <Card>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-osrs-text">Mastery Points</h3>
          <span className="text-sm">
            <span className="text-osrs-gold font-bold">{pointsUsed}</span>
            <span className="text-osrs-text-dim"> / {masteries.maxPoints}</span>
          </span>
        </div>
        <ProgressBar
          value={pointsUsed}
          max={masteries.maxPoints}
          label="Points Spent"
          color="bg-osrs-gold"
          size="sm"
        />
        {pointsRemaining === 0 && pointsUsed > 0 && (
          <p className="text-xs text-osrs-gold mt-2">All mastery points allocated!</p>
        )}
      </Card>

      {/* Combat Styles */}
      {masteries.styles.map((style) => {
        const colors = styleColors[style.style] || styleColors.melee;
        const highestTier = getHighestTier(selectedTiers, style.id);

        return (
          <Card key={style.id} className={highestTier > 0 ? colors.glow : ""}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-osrs-text">{style.name}</h4>
                <Badge variant={colors.badge}>{style.style}</Badge>
              </div>
              {highestTier > 0 && (
                <Badge variant="gold">Tier {highestTier}</Badge>
              )}
            </div>

            <div className="space-y-2">
              {style.tiers.map((tier) => {
                const tierId = `${style.id}-${tier.tier}`;
                const isSelected = selectedTiers.includes(tierId);
                const isNextUnlock = tier.tier === highestTier + 1;
                const isLocked = tier.tier > highestTier + 1;
                const canAfford = pointsRemaining > 0;
                const canSelect = isNextUnlock && canAfford;
                const canDeselect = isSelected && tier.tier === highestTier;

                return (
                  <button
                    key={tierId}
                    onClick={() => {
                      if (isSelected && canDeselect) {
                        onToggleTier(tierId);
                      } else if (!isSelected && canSelect) {
                        onToggleTier(tierId);
                      }
                    }}
                    disabled={!isSelected && !canSelect}
                    className={`w-full text-left px-3 py-2 rounded-lg border text-sm transition-all ${
                      isSelected
                        ? `bg-osrs-gold/10 border-osrs-gold/40 ${colors.accent}`
                        : isLocked
                          ? "bg-osrs-darker/50 border-osrs-border/30 text-osrs-text-dim/50 cursor-not-allowed"
                          : canSelect
                            ? "bg-osrs-darker border-osrs-border hover:border-osrs-gold/50 text-osrs-text-dim hover:text-osrs-text cursor-pointer"
                            : "bg-osrs-darker border-osrs-border text-osrs-text-dim/70 cursor-not-allowed"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-bold w-5 ${isSelected ? "text-osrs-gold" : "text-osrs-text-dim"}`}>
                        {tier.tier}
                      </span>
                      <span className="flex-1">{tier.effect}</span>
                      {isSelected && (
                        <span className="text-osrs-gold text-xs">&#10003;</span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </Card>
        );
      })}

      {/* Universal Passives */}
      {masteries.universalPassives.length > 0 && (
        <Card>
          <h4 className="font-bold text-osrs-text mb-3">Universal Passives</h4>
          <p className="text-xs text-osrs-text-dim mb-3">
            Unlocked the first time you reach each tier in any combat style.
          </p>
          <div className="space-y-2">
            {masteries.universalPassives.map((passive, i) => {
              const tierNum = i + 1;
              const isUnlocked = highestUniversalTier >= tierNum;

              return (
                <div
                  key={i}
                  className={`flex items-start gap-2 text-sm px-3 py-2 rounded-lg ${
                    isUnlocked
                      ? "bg-osrs-gold/10 border border-osrs-gold/30"
                      : "bg-osrs-darker border border-osrs-border/30 opacity-60"
                  }`}
                >
                  <span className={`text-xs font-bold w-5 mt-0.5 ${isUnlocked ? "text-osrs-gold" : "text-osrs-text-dim"}`}>
                    {tierNum}
                  </span>
                  <span className={isUnlocked ? "text-osrs-text" : "text-osrs-text-dim"}>
                    {passive}
                  </span>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* Point Sources */}
      {masteries.pointSources.length > 0 && (
        <Card>
          <h4 className="font-bold text-osrs-text mb-3">How to Earn Points</h4>
          <p className="text-xs text-osrs-text-dim mb-3">
            Complete these combat tasks to earn mastery points (1 point each):
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
            {masteries.pointSources.map((src, i) => (
              <div key={i} className="flex items-center gap-2 text-sm text-osrs-text-dim px-2 py-1">
                <span className="text-osrs-gold text-xs">&#8226;</span>
                <span>{src}</span>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
