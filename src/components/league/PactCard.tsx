import { Pact } from "@/types/league";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import type { PactImpact } from "@/lib/selection-impact";

interface PactCardProps {
  pact: Pact;
  selected?: boolean;
  onToggle?: (pactId: string) => void;
  impact?: PactImpact;
}

const categoryColors: Record<string, "gold" | "red" | "green" | "blue" | "purple"> = {
  combat: "red",
  gathering: "green",
  production: "blue",
  prayer: "purple",
  magic: "purple",
  utility: "gold",
  exploration: "green",
};

const tierRiskColors: Record<number, string> = {
  1: "border-osrs-border",
  2: "border-osrs-gold/50",
  3: "border-demon-glow/50",
};

const tierRiskLabels: Record<number, { label: string; variant: "green" | "gold" | "red" }> = {
  1: { label: "Low Risk", variant: "green" },
  2: { label: "Medium Risk", variant: "gold" },
  3: { label: "High Risk", variant: "red" },
};

export function PactCard({ pact, selected, onToggle, impact }: PactCardProps) {
  const risk = tierRiskLabels[pact.tier] || tierRiskLabels[1];
  const riskBorder = tierRiskColors[pact.tier] || tierRiskColors[1];

  return (
    <Card
      hover={!!onToggle}
      glow={selected ? "red" : "none"}
      onClick={onToggle ? () => onToggle(pact.id) : undefined}
      className={`${onToggle ? "cursor-pointer" : ""} ${selected ? "ring-2 ring-demon-glow" : riskBorder}`}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <h4 className="font-bold text-osrs-text">{pact.name}</h4>
          <Badge variant={categoryColors[pact.category] || "default"}>
            {pact.category}
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={risk.variant}>{risk.label}</Badge>
          {selected && <Badge variant="red">Active</Badge>}
        </div>
      </div>

      <p className="text-sm text-osrs-text-dim mb-3">{pact.description}</p>

      <div className="space-y-2">
        <div className="flex items-start gap-2 text-sm">
          <span className="text-osrs-green font-bold text-xs mt-0.5">BONUS</span>
          <span className="text-osrs-green">{pact.bonus}</span>
        </div>
        <div className="flex items-start gap-2 text-sm">
          <span className="text-demon-glow font-bold text-xs mt-0.5">COST</span>
          <span className="text-demon-glow">{pact.penalty}</span>
        </div>
      </div>

      {/* Impact indicators for unselected pacts */}
      {!selected && impact && (() => {
        const hasContent = impact.gielinorScoreDelta > 0 || impact.riskDelta > 0 || impact.dangerousCombos.length > 0 || impact.newSynergies.length > 0 || impact.relicSynergies.length > 0;
        if (!hasContent) return null;
        return (
          <div className="mt-3 pt-3 border-t border-osrs-border flex flex-wrap gap-1">
            {impact.gielinorScoreDelta > 0 && (
              <Badge variant="gold">GS +{impact.gielinorScoreDelta}</Badge>
            )}
            {impact.riskDelta > 0 && (
              <Badge variant="purple">Risk +{impact.riskDelta}</Badge>
            )}
            {impact.dangerousCombos.map((c) => (
              <Badge key={c} variant="red">{c}</Badge>
            ))}
            {impact.newSynergies.map((s) => (
              <Badge key={s} variant="green">{s}</Badge>
            ))}
            {impact.relicSynergies.map((s) => (
              <Badge key={s} variant="blue">+ {s}</Badge>
            ))}
          </div>
        );
      })()}
    </Card>
  );
}
