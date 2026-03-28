"use client";

import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Tabs } from "@/components/ui/Tabs";
import Link from "next/link";

const strategies = [
  {
    id: "speedrun",
    name: "Speedrunner",
    description: "Maximize points per hour with fast task completion routing.",
    difficulty: "Advanced",
    relics: ["Trickster", "Fairy's Flight", "Infernal Gathering", "Clue Compass", "Last Recall", "Weapon Specialist", "Echo Augmentation", "Dodgy Dealings"],
    earlyGame: ["Grab Trickster for instant agility/thieving", "Rush easy + medium tasks", "Quest heavily for fast QP"],
    midGame: ["Fairy's Flight for instant travel", "Clue Compass for mass clue completions", "Start Slayer grind"],
    lateGame: ["Last Recall for zero-downtime bossing", "Weapon Specialist for instant kills", "Echo Augmentation for guaranteed uniques"],
  },
  {
    id: "pvm",
    name: "PvM Destroyer",
    description: "Maximum combat power to dominate every boss and Echo boss.",
    difficulty: "Intermediate",
    relics: ["Production Prodigy", "Banker's Note", "Knife's Edge", "Soul Stealer", "Last Recall", "Weapon Specialist", "Echo Augmentation", "Absolute Unit"],
    earlyGame: ["Production Prodigy for fast gear crafting", "Train combat through Slayer", "Rush Barrows"],
    midGame: ["Knife's Edge for 3x damage at 10 HP", "Soul Stealer for prayer sustain", "Start GWD bosses"],
    lateGame: ["Weapon Specialist: 2-tick weapons + infinite spec", "Absolute Unit for AoE + tankiness", "Solo everything including Echo bosses"],
  },
  {
    id: "completionist",
    name: "Completionist",
    description: "Touch every piece of content. Reach Dragon tier.",
    difficulty: "Expert",
    relics: ["Endless Harvest", "Banker's Note", "Equilibrium", "Clue Compass", "Friendly Forager", "Ruinous Powers", "Treasure Seeker", "Riftwalker"],
    earlyGame: ["Endless Harvest for double resources", "Complete ALL easy tasks first", "Build broad skill base"],
    midGame: ["Equilibrium to level all combat evenly", "Clue Compass for 10x clue rate", "Friendly Forager for passive gathering"],
    lateGame: ["Treasure Seeker for 3x boss uniques", "Riftwalker for optimal portal placement", "Push all elite/master tasks"],
  },
];

export default function RagingEchoesGuide() {
  const tabs = strategies.map((s) => ({ id: s.id, label: s.name }));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex items-center gap-2 mb-3 text-sm text-osrs-text-dim">
        <Link href="/" className="hover:text-osrs-gold">Home</Link>
        <span>/</span>
        <Link href="/leagues/raging-echoes" className="hover:text-osrs-gold">Raging Echoes</Link>
        <span>/</span>
        <span className="text-osrs-gold">Strategy Guide</span>
      </div>

      <h1 className="text-3xl font-bold text-osrs-gold text-glow-gold mb-2" style={{ fontFamily: "var(--font-runescape)" }}>
        Raging Echoes Strategy Guide
      </h1>
      <p className="text-osrs-text-dim mb-8">Optimized strategies for every playstyle. 8 relic tiers, all areas open.</p>

      <Tabs tabs={tabs}>
        {(activeTab) => {
          const strategy = strategies.find((s) => s.id === activeTab);
          if (!strategy) return null;

          return (
            <div className="space-y-6">
              <Card glow="gold">
                <div className="flex items-center gap-2 mb-2">
                  <h2 className="text-2xl font-bold text-osrs-gold" style={{ fontFamily: "var(--font-runescape)" }}>{strategy.name}</h2>
                  <Badge variant={strategy.difficulty === "Expert" ? "red" : strategy.difficulty === "Advanced" ? "purple" : "gold"}>
                    {strategy.difficulty}
                  </Badge>
                </div>
                <p className="text-osrs-text-dim">{strategy.description}</p>
              </Card>

              <Card>
                <h3 className="font-bold text-osrs-gold mb-3" style={{ fontFamily: "var(--font-runescape)" }}>
                  Recommended Relics (All 8 Tiers)
                </h3>
                <div className="space-y-2">
                  {strategy.relics.map((relic, i) => (
                    <div key={relic} className="flex items-center gap-2 text-sm">
                      <span className="text-osrs-gold text-xs font-bold w-6">T{i + 1}</span>
                      <span className="text-osrs-text">{relic}</span>
                    </div>
                  ))}
                </div>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <PhaseCard title="Early Game" color="text-osrs-green" steps={strategy.earlyGame} />
                <PhaseCard title="Mid Game" color="text-osrs-gold" steps={strategy.midGame} />
                <PhaseCard title="Late Game" color="text-demon-glow" steps={strategy.lateGame} />
              </div>
            </div>
          );
        }}
      </Tabs>
    </div>
  );
}

function PhaseCard({ title, color, steps }: { title: string; color: string; steps: string[] }) {
  return (
    <Card>
      <h4 className={`font-bold ${color} mb-3`} style={{ fontFamily: "var(--font-runescape)" }}>{title}</h4>
      <ol className="space-y-2">
        {steps.map((step, i) => (
          <li key={i} className="flex items-start gap-2 text-sm">
            <span className="text-osrs-text-dim text-xs mt-0.5 w-4 flex-shrink-0">{i + 1}.</span>
            <span className="text-osrs-text-dim">{step}</span>
          </li>
        ))}
      </ol>
    </Card>
  );
}
