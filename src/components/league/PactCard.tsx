import { Pact } from "@/types/league";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

interface PactCardProps {
  pact: Pact;
  selected?: boolean;
  onToggle?: (pactId: string) => void;
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

export function PactCard({ pact, selected, onToggle }: PactCardProps) {
  return (
    <Card
      hover={!!onToggle}
      glow={selected ? "red" : "none"}
      className={`${onToggle ? "cursor-pointer" : ""} ${selected ? "ring-2 ring-demon-glow" : ""}`}
    >
      <div onClick={() => onToggle?.(pact.id)}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <h4 className="font-bold text-osrs-text">{pact.name}</h4>
            <Badge variant={categoryColors[pact.category] || "default"}>
              {pact.category}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="default">Tier {pact.tier}</Badge>
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

      </div>
    </Card>
  );
}
