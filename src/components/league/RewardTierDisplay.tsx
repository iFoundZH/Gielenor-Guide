import { RewardTier } from "@/types/league";
import { Card } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";

interface RewardTierDisplayProps {
  tiers: RewardTier[];
  currentPoints?: number;
}

export function RewardTierDisplay({ tiers, currentPoints = 0 }: RewardTierDisplayProps) {
  const maxPoints = tiers[tiers.length - 1]?.pointsRequired || 0;

  return (
    <div className="space-y-4">
      {currentPoints > 0 && (
        <div className="mb-6">
          <ProgressBar
            value={currentPoints}
            max={maxPoints}
            label="Your Progress"
            color="bg-gradient-to-r from-osrs-gold to-demon-ember"
            size="lg"
          />
        </div>
      )}

      {tiers.map((tier) => {
        const unlocked = currentPoints >= tier.pointsRequired;
        return (
          <Card
            key={tier.name}
            glow={unlocked ? "gold" : "none"}
            className={unlocked ? "" : "opacity-80"}
          >
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex items-center gap-3 sm:w-48">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm"
                  style={{
                    backgroundColor: `${tier.color}20`,
                    color: tier.color,
                    border: `2px solid ${tier.color}40`,
                  }}
                >
                  {unlocked ? "✓" : tier.name[0]}
                </div>
                <div>
                  <h4 className="font-bold" style={{ color: tier.color }}>
                    {tier.name}
                  </h4>
                  <p className="text-xs text-osrs-text-dim">
                    {tier.pointsRequired.toLocaleString()} points
                  </p>
                </div>
              </div>

              <div className="flex-1">
                <div className="flex flex-wrap gap-3">
                  {tier.rewards.map((reward) => (
                    <div
                      key={reward.id}
                      className="bg-osrs-darker/50 rounded-lg px-3 py-2 text-sm"
                    >
                      <span className="text-osrs-text">{reward.name}</span>
                      <span className="block text-xs text-osrs-text-dim mt-0.5">
                        {reward.description}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
