"use client";

import { getDpsRelevantPacts, getPactCategories, getPactsByCategory } from "@/data/pacts";

interface Props {
  selected: string[];
  onChange: (pacts: string[]) => void;
}

export function PactSelector({ selected, onChange }: Props) {
  const categories = getPactCategories();
  const dpsRelevant = getDpsRelevantPacts();
  const dpsCategories = [...new Set(dpsRelevant.map(p => p.category))];

  const toggle = (pactId: string) => {
    if (selected.includes(pactId)) {
      onChange(selected.filter(p => p !== pactId));
    } else {
      onChange([...selected, pactId]);
    }
  };

  const selectAllDps = () => {
    onChange(dpsRelevant.map(p => p.id));
  };

  const clearAll = () => {
    onChange([]);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-osrs-gold uppercase tracking-wider">Pacts</h3>
        <div className="flex gap-2">
          <button onClick={selectAllDps} className="text-[10px] text-osrs-gold hover:underline">All DPS</button>
          <button onClick={clearAll} className="text-[10px] text-osrs-text-dim hover:underline">Clear</button>
        </div>
      </div>
      <div className="max-h-64 overflow-y-auto space-y-3">
        {dpsCategories.map(cat => {
          const pacts = getPactsByCategory(cat).filter(p => p.dpsRelevant);
          return (
            <div key={cat}>
              <div className="text-[10px] text-osrs-text-dim uppercase tracking-wider mb-1 capitalize">{cat}</div>
              <div className="space-y-0.5">
                {pacts.map(pact => (
                  <button
                    key={pact.id}
                    onClick={() => toggle(pact.id)}
                    className={`w-full text-left px-2 py-1 rounded text-xs transition-all ${
                      selected.includes(pact.id)
                        ? "bg-demon-glow/20 text-demon-glow"
                        : "text-osrs-text-dim hover:text-osrs-text hover:bg-osrs-panel-hover"
                    }`}
                    title={pact.description}
                  >
                    <span className="font-medium">{pact.id}</span>
                    <span className="ml-1.5 opacity-70">{pact.name}</span>
                  </button>
                ))}
              </div>
            </div>
          );
        })}

        {/* Non-DPS pacts */}
        {categories.filter(c => !dpsCategories.includes(c)).map(cat => {
          const pacts = getPactsByCategory(cat);
          return (
            <div key={cat}>
              <div className="text-[10px] text-osrs-text-dim uppercase tracking-wider mb-1 capitalize opacity-50">{cat}</div>
              <div className="space-y-0.5">
                {pacts.map(pact => (
                  <div
                    key={pact.id}
                    className="px-2 py-1 rounded text-xs text-osrs-text-dim/50"
                    title={pact.description}
                  >
                    <span className="font-medium">{pact.id}</span>
                    <span className="ml-1.5 opacity-70">{pact.name}</span>
                    <span className="ml-1 text-[10px] opacity-40">(no DPS effect)</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
      <div className="text-[10px] text-osrs-text-dim">
        {selected.length} active pacts ({dpsRelevant.filter(p => selected.includes(p.id)).length} DPS-relevant)
      </div>
    </div>
  );
}
