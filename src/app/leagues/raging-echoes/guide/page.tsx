"use client";

import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Tabs } from "@/components/ui/Tabs";
import { ragingEchoesLeague } from "@/data/raging-echoes";
import { encodeBuild } from "@/lib/build-storage";
import Link from "next/link";
import type { LeagueBuild } from "@/types/league";

const strategies = [
  {
    id: "speedrun",
    name: "Speedrunner",
    description: "Maximize points per hour with fast task completion routing.",
    difficulty: "Advanced",
    relics: ["Trickster", "Fairy's Flight", "Infernal Gathering", "Clue Compass", "Last Recall", "Weapon Specialist", "Echo Augmentation", "Dodgy Dealings"],
    masteries: ["Melee Mastery"],
    earlyGame: [
      "Trickster (T1): instant agility shortcuts + always-succeed pickpocketing",
      "Fairy's Flight (T2): teleport to any fairy ring/spirit tree from anywhere",
      "Rush easy + medium tasks across all skill categories",
      "Quest heavily for fast QP — aim for 100 QP early",
    ],
    midGame: [
      "Infernal Gathering (T3): resources auto-process for double skill XP",
      "Clue Compass (T4): 10x clue rate + double casket loot",
      "Last Recall (T5): return to previous location after any teleport",
      "Mass clue completions for task points and unique rewards",
    ],
    lateGame: [
      "Weapon Specialist (T6): 2-tick attacks + infinite special attack",
      "Echo Augmentation (T7): halved KC thresholds + double Echo uniques",
      "Dodgy Dealings (T8): pickpocket bosses for their drop tables",
      "Target remaining elite/master tasks with overpowered setup",
    ],
  },
  {
    id: "pvm",
    name: "PvM Destroyer",
    description: "Maximum combat power to dominate every boss and Echo boss.",
    difficulty: "Intermediate",
    relics: ["Production Prodigy", "Banker's Note", "Knife's Edge", "Soul Stealer", "Last Recall", "Weapon Specialist", "Echo Augmentation", "Absolute Unit"],
    masteries: ["Melee Mastery", "Ranged Mastery"],
    earlyGame: [
      "Production Prodigy (T1): 2x faster crafting with material savings",
      "Banker's Note (T2): note/unnote any item at any banker",
      "Train combat through Slayer for task overlap",
      "Rush Barrows for early gear upgrades",
    ],
    midGame: [
      "Knife's Edge (T3): 3x damage multiplier, HP capped at 10",
      "Soul Stealer (T4): kills restore 25% prayer + 15% auto-bank drops",
      "Last Recall (T5): teleport-kill-return bossing loop",
      "Start GWD bosses — 3x damage melts them",
    ],
    lateGame: [
      "Weapon Specialist (T6): 2-tick speed + infinite spec on all weapons",
      "Echo Augmentation (T7): halved KC + double Echo boss uniques",
      "Absolute Unit (T8): +10 all combat stats, AoE melee, 20% dmg reduction",
      "Solo every raid and Echo boss with ridiculous DPS + tankiness",
    ],
  },
  {
    id: "completionist",
    name: "Completionist",
    description: "Touch every piece of content. Reach Dragon tier.",
    difficulty: "Expert",
    relics: ["Endless Harvest", "Banker's Note", "Equilibrium", "Clue Compass", "Friendly Forager", "Ruinous Powers", "Treasure Seeker", "Riftwalker"],
    masteries: ["Melee Mastery", "Ranged Mastery", "Magic Mastery"],
    earlyGame: [
      "Endless Harvest (T1): double resources that auto-bank + nodes never deplete",
      "Banker's Note (T2): note/unnote for efficient inventory management",
      "Complete ALL easy tasks first for fast point accumulation",
      "Build a broad skill base across every category",
    ],
    midGame: [
      "Equilibrium (T3): combat XP split evenly + 15% bonus — level everything",
      "Clue Compass (T4): 10x clue rate for clue task completion",
      "Friendly Forager (T5): pet companion gathers and banks resources passively",
      "Touch every task category — completion breadth matters for points",
    ],
    lateGame: [
      "Ruinous Powers (T6): stronger offensive prayers + switch without altar",
      "Treasure Seeker (T7): 3x boss unique rate + guaranteed pets at KC milestones",
      "Riftwalker (T8): place 5 permanent portals for instant travel network",
      "Push all elite/master tasks — aim for 60,000 points for Dragon tier",
    ],
  },
];

function buildPlannerUrl(strategy: typeof strategies[number]): string {
  const league = ragingEchoesLeague;
  const allRelics = league.relicTiers.flatMap((t) => t.relics);

  const matchedRelicIds = strategy.relics
    .map((name) => allRelics.find((r) => r.name.toLowerCase() === name.toLowerCase())?.id)
    .filter((id): id is string => !!id);

  const matchedMasteryIds = strategy.masteries
    .map((name) => league.pacts.find((p) => p.name.toLowerCase() === name.toLowerCase())?.id)
    .filter((id): id is string => !!id);

  const build: LeagueBuild = {
    id: "",
    name: `${strategy.name} Build`,
    accountType: "ironman",
    regions: [],
    relics: matchedRelicIds,
    pacts: matchedMasteryIds,
    completedTasks: [],
    notes: `Pre-loaded from ${strategy.name} strategy guide.`,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };

  const encoded = encodeBuild(build);
  return `/leagues/raging-echoes/planner?build=${encoded}`;
}

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
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h2 className="text-2xl font-bold text-osrs-gold" style={{ fontFamily: "var(--font-runescape)" }}>{strategy.name}</h2>
                      <Badge variant={strategy.difficulty === "Expert" ? "red" : strategy.difficulty === "Advanced" ? "purple" : "gold"}>
                        {strategy.difficulty}
                      </Badge>
                    </div>
                    <p className="text-osrs-text-dim">{strategy.description}</p>
                  </div>
                  <Link
                    href={buildPlannerUrl(strategy)}
                    className="px-4 py-2 bg-osrs-gold text-osrs-darker rounded-lg text-sm font-bold hover:bg-osrs-gold/90 transition-all whitespace-nowrap"
                  >
                    Open in Planner
                  </Link>
                </div>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

                <Card>
                  <h3 className="font-bold text-demon-glow mb-3" style={{ fontFamily: "var(--font-runescape)" }}>
                    Recommended Masteries
                  </h3>
                  <div className="space-y-2">
                    {strategy.masteries.map((mastery) => (
                      <div key={mastery} className="flex items-center gap-2 text-sm">
                        <span className="text-demon-ember">&#x2694;</span>
                        <span className="text-osrs-text">{mastery}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <PhaseCard title="Early Game" subtitle="Tiers 1-2" color="text-osrs-green" steps={strategy.earlyGame} />
                <PhaseCard title="Mid Game" subtitle="Tiers 3-5" color="text-osrs-gold" steps={strategy.midGame} />
                <PhaseCard title="Late Game" subtitle="Tiers 6-8" color="text-demon-glow" steps={strategy.lateGame} />
              </div>
            </div>
          );
        }}
      </Tabs>
    </div>
  );
}

function PhaseCard({ title, subtitle, color, steps }: { title: string; subtitle: string; color: string; steps: string[] }) {
  return (
    <Card>
      <h4 className={`font-bold ${color} mb-1`} style={{ fontFamily: "var(--font-runescape)" }}>{title}</h4>
      <p className="text-xs text-osrs-text-dim mb-3">{subtitle}</p>
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
