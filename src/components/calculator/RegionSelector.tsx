"use client";

const ALL_REGIONS = [
  { id: "varlamore", name: "Varlamore", type: "starting" as const },
  { id: "karamja", name: "Karamja", type: "starting" as const },
  { id: "asgarnia", name: "Asgarnia", type: "choosable" as const },
  { id: "fremennik", name: "Fremennik", type: "choosable" as const },
  { id: "kandarin", name: "Kandarin", type: "choosable" as const },
  { id: "morytania", name: "Morytania", type: "choosable" as const },
  { id: "desert", name: "Desert", type: "choosable" as const },
  { id: "tirannwn", name: "Tirannwn", type: "choosable" as const },
  { id: "kourend", name: "Kourend", type: "choosable" as const },
  { id: "wilderness", name: "Wilderness", type: "choosable" as const },
];

interface Props {
  selected: string[];
  onChange: (regions: string[]) => void;
  maxChoosable?: number;
  requiredRegion?: string;
}

export function RegionSelector({ selected, onChange, maxChoosable = 3, requiredRegion }: Props) {
  const startingRegions = ALL_REGIONS.filter(r => r.type === "starting");
  const choosableRegions = ALL_REGIONS.filter(r => r.type === "choosable");
  const isRequired = (id: string) => requiredRegion === id && choosableRegions.some(r => r.id === id);
  const choosableSelected = selected.filter(r => choosableRegions.some(cr => cr.id === r));

  const toggle = (regionId: string) => {
    const region = ALL_REGIONS.find(r => r.id === regionId);
    if (!region || region.type === "starting") return;
    if (isRequired(regionId)) return; // Can't deselect boss region

    if (selected.includes(regionId)) {
      onChange(selected.filter(r => r !== regionId));
    } else if (choosableSelected.length < maxChoosable) {
      onChange([...selected, regionId]);
    }
  };

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold text-osrs-gold uppercase tracking-wider">
        Regions <span className="text-osrs-text-dim font-normal">({choosableSelected.length}/{maxChoosable})</span>
      </h3>

      <div className="space-y-1">
        {startingRegions.map(r => (
          <div key={r.id} className="px-3 py-1.5 rounded-lg text-xs bg-osrs-gold/10 text-osrs-gold/70 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-osrs-gold/50" />
            {r.name}
            <span className="text-[10px] opacity-60 ml-auto">start</span>
          </div>
        ))}
        {choosableRegions.map(r => {
          const isSelected = selected.includes(r.id);
          const locked = isRequired(r.id);
          return (
            <button
              key={r.id}
              onClick={() => toggle(r.id)}
              className={`w-full text-left px-3 py-1.5 rounded-lg text-xs transition-all flex items-center gap-2 ${
                locked
                  ? "bg-demon-glow/15 text-demon-glow border border-demon-glow/30 cursor-default"
                  : isSelected
                    ? "bg-osrs-gold/20 text-osrs-gold border border-osrs-gold/30"
                    : "text-osrs-text-dim hover:text-osrs-text hover:bg-osrs-panel-hover"
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${
                locked ? "bg-demon-glow" : isSelected ? "bg-osrs-gold" : "bg-osrs-border"
              }`} />
              {r.name}
              {locked && <span className="text-[10px] opacity-60 ml-auto">boss</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}
