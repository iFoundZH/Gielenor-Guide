"use client";

import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Tabs } from "@/components/ui/Tabs";
import { demonicPactsLeague } from "@/data/demonic-pacts";
import { encodeBuild } from "@/lib/build-storage";
import Link from "next/link";
import type { LeagueBuild } from "@/types/league";

const strategies = [
  {
    id: "speedrun",
    name: "Speedrunner",
    description: "Maximize points per hour. Rush task completion with optimal routing.",
    accountType: "Any",
    difficulty: "Advanced",
    relics: ["Trickster", "Infernal Gathering", "Eternal Jewel", "Last Recall", "Globetrotter"],
    pacts: ["Speed Demon", "XP Demon"],
    priorities: [
      "Rush easy and medium tasks first for fast renown",
      "Prioritize quests that unlock multiple task categories",
      "Use Trickster for instant agility shortcuts and thieving tasks",
      "Infernal Gathering + resource tasks = 2-for-1 skill XP",
      "Last Recall for zero-downtime bossing",
      "Speed Demon eliminates travel time entirely",
    ],
    earlyGame: [
      "Complete tutorial and grab starting relic (Trickster)",
      "Pickpocket men/women for starting cash",
      "Complete Waterfall Quest for combat levels",
      "Rush easy quests: Cook's Assistant, Sheep Shearer, etc.",
      "Hit 500 renown ASAP for Infernal Gathering",
    ],
    midGame: [
      "Focus on medium task categories you haven't touched",
      "Start Slayer for combat task overlap",
      "Complete Dragon Slayer, Monkey Madness, etc.",
      "Grab Eternal Jewel at 2000 renown for unlimited teleports",
      "Begin clue scroll hunting",
    ],
    lateGame: [
      "Boss rushing with Last Recall",
      "Elite and Master clue completions",
      "GWD, Zulrah, Vorkath for combat tasks",
      "Push for 99s in efficient skills",
      "Target remaining hard/elite tasks",
    ],
  },
  {
    id: "pvm",
    name: "PvM Powerhouse",
    description: "Maximize combat power. Dominate every boss in the game.",
    accountType: "Any",
    difficulty: "Intermediate",
    relics: ["Production Master", "Knife's Edge", "Bottomless Quiver", "Soul Stealer", "Weapon Specialist"],
    pacts: ["Glass Cannon", "Ranged Fury", "Risk & Reward"],
    priorities: [
      "Build toward end-game PvM as fast as possible",
      "Knife's Edge + Glass Cannon = insane damage output",
      "Bottomless Quiver for infinite ammo on ranged builds",
      "Weapon Specialist makes every weapon attack at dart speed",
      "Soul Stealer for prayer sustain during bossing",
    ],
    earlyGame: [
      "Get Production Master for fast gear crafting",
      "Train combat through Slayer for task overlap",
      "Rush Barrows for early gear upgrades",
      "Complete combat-related quests",
    ],
    midGame: [
      "Grab Knife's Edge at tier 2 — embrace the 10 HP life",
      "Start GWD bosses with 3x damage",
      "Bottomless Quiver at tier 3 for ranged dominance",
      "Activate Glass Cannon for +50% damage",
    ],
    lateGame: [
      "Weapon Specialist: every weapon attacks at 2-tick speed",
      "Solo Corp, ToB, CoX with ridiculous DPS",
      "Risk & Reward for 2x drops (deaths are costly though)",
      "Push for Inferno cape with overpowered damage",
    ],
  },
  {
    id: "completionist",
    name: "Completionist",
    description: "Complete every task. Reach Dragon tier rewards.",
    accountType: "Main",
    difficulty: "Expert",
    relics: ["Endless Harvest", "Equilibrium", "Clue Compass", "Demonic Resilience", "Treasure Seeker"],
    pacts: ["Gathering Fury", "Artisan's Deal", "XP Demon", "Speed Demon"],
    priorities: [
      "Balance across all task categories — don't neglect any",
      "Demonic Resilience halves all pact penalties",
      "Stack 4+ pacts with reduced penalties",
      "Clue Compass for 10x clue drop rate",
      "Treasure Seeker for guaranteed boss uniques",
    ],
    earlyGame: [
      "Endless Harvest for gathering tasks",
      "Complete ALL easy tasks before moving on",
      "Quest broadly to unlock regions and skills",
      "Build a solid base in every skill",
    ],
    midGame: [
      "Equilibrium to level all combat evenly",
      "Activate Gathering Fury + Artisan's Deal for skill coverage",
      "Clue Compass for mass clue completions",
      "Push for Demonic Resilience at 5000 renown",
    ],
    lateGame: [
      "Stack all 4 pacts with Demonic Resilience",
      "XP Demon + Speed Demon for maximum efficiency",
      "Target remaining elite and master tasks",
      "Treasure Seeker for boss collection log",
      "Push past 56,000 points for Dragon tier",
    ],
  },
  {
    id: "ironman",
    name: "Ironman Optimized",
    description: "Self-sufficient strategies for ironman accounts.",
    accountType: "Ironman",
    difficulty: "Advanced",
    relics: ["Endless Harvest", "Infernal Gathering", "Eternal Jewel", "Demonic Resilience", "Globetrotter"],
    pacts: ["Gathering Fury", "Artisan's Deal"],
    priorities: [
      "Self-sufficiency is key — Endless Harvest + Infernal Gathering",
      "Resources auto-process: mine ore, get bars automatically",
      "Gathering Fury for 3x gathering speed",
      "Artisan's Deal for 2x production XP",
      "Globetrotter eliminates travel issues",
    ],
    earlyGame: [
      "Endless Harvest immediately for double resources",
      "Focus on gathering skills to build resource base",
      "Complete quests for useful unlocks (Fairy Rings, etc.)",
      "Start Farming runs early",
    ],
    midGame: [
      "Infernal Gathering: ores auto-smelt, logs auto-burn",
      "This combo essentially gives you 4 skills at once",
      "Eternal Jewel for infinite teleport charges",
      "Begin Slayer for alchables and combat training",
    ],
    lateGame: [
      "Demonic Resilience to stack more pacts safely",
      "Globetrotter for instant access to everything",
      "Focus on tasks that align with your resource base",
      "Target boss tasks with self-made supplies",
    ],
  },
];

function buildPlannerUrl(strategy: typeof strategies[number]): string {
  const league = demonicPactsLeague;
  const allRelics = league.relicTiers.flatMap((t) => t.relics);

  const matchedRelicIds = strategy.relics
    .map((name) => allRelics.find((r) => r.name.toLowerCase() === name.toLowerCase())?.id)
    .filter((id): id is string => !!id);

  const matchedPactIds = strategy.pacts
    .map((name) => league.pacts.find((p) => p.name.toLowerCase() === name.toLowerCase())?.id)
    .filter((id): id is string => !!id);

  const build: LeagueBuild = {
    id: "",
    name: `${strategy.name} Build`,
    accountType: strategy.accountType === "Ironman" ? "ironman" : "main",
    regions: [],
    relics: matchedRelicIds,
    pacts: matchedPactIds,
    completedTasks: [],
    notes: `Pre-loaded from ${strategy.name} strategy guide.`,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };

  const encoded = encodeBuild(build);
  return `/leagues/demonic-pacts/planner?build=${encoded}`;
}

export default function StrategyGuide() {
  const tabs = strategies.map((s) => ({
    id: s.id,
    label: s.name,
  }));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-3 text-sm text-osrs-text-dim">
        <Link href="/" className="hover:text-osrs-gold">Home</Link>
        <span>/</span>
        <Link href="/leagues/demonic-pacts" className="hover:text-osrs-gold">Demonic Pacts</Link>
        <span>/</span>
        <span className="text-osrs-gold">Strategy Guide</span>
      </div>

      <h1
        className="text-3xl font-bold text-osrs-gold text-glow-gold mb-2"
        style={{ fontFamily: "var(--font-runescape)" }}
      >
        Strategy Guide
      </h1>
      <p className="text-osrs-text-dim mb-8">
        Optimized strategies for different playstyles. Each guide includes recommended
        relics, pacts, and a phased progression plan.
      </p>

      <Tabs tabs={tabs}>
        {(activeTab) => {
          const strategy = strategies.find((s) => s.id === activeTab);
          if (!strategy) return null;

          return (
            <div className="space-y-6">
              {/* Strategy Header */}
              <Card glow="gold">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h2
                        className="text-2xl font-bold text-osrs-gold"
                        style={{ fontFamily: "var(--font-runescape)" }}
                      >
                        {strategy.name}
                      </h2>
                      <Badge variant="blue">{strategy.accountType}</Badge>
                      <Badge variant={
                        strategy.difficulty === "Expert" ? "red" :
                        strategy.difficulty === "Advanced" ? "purple" : "gold"
                      }>
                        {strategy.difficulty}
                      </Badge>
                    </div>
                    <p className="text-osrs-text-dim">{strategy.description}</p>
                  </div>
                  <Link
                    href={buildPlannerUrl(strategy)}
                    className="px-4 py-2 bg-osrs-gold text-osrs-darker rounded-lg text-sm font-bold hover:bg-osrs-gold/90 transition-all whitespace-nowrap"
                  >
                    Open in Planner →
                  </Link>
                </div>
              </Card>

              {/* Recommended Setup */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <h3
                    className="font-bold text-osrs-gold mb-3"
                    style={{ fontFamily: "var(--font-runescape)" }}
                  >
                    Recommended Relics
                  </h3>
                  <div className="space-y-2">
                    {strategy.relics.map((relic, i) => (
                      <div key={relic} className="flex items-center gap-2 text-sm">
                        <span className="text-osrs-gold text-xs font-bold">T{i + 1}</span>
                        <span className="text-osrs-text">{relic}</span>
                      </div>
                    ))}
                  </div>
                </Card>

                <Card>
                  <h3
                    className="font-bold text-demon-glow mb-3"
                    style={{ fontFamily: "var(--font-runescape)" }}
                  >
                    Recommended Pacts
                  </h3>
                  <div className="space-y-2">
                    {strategy.pacts.map((pact) => (
                      <div key={pact} className="flex items-center gap-2 text-sm">
                        <span className="text-demon-ember">🔥</span>
                        <span className="text-osrs-text">{pact}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>

              {/* Priorities */}
              <Card>
                <h3
                  className="font-bold text-osrs-gold mb-3"
                  style={{ fontFamily: "var(--font-runescape)" }}
                >
                  Key Priorities
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {strategy.priorities.map((p, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm">
                      <span className="text-osrs-green mt-0.5">✦</span>
                      <span className="text-osrs-text-dim">{p}</span>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Phased Guide */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <PhaseCard
                  title="Early Game"
                  subtitle="0-2,000 Renown"
                  color="text-osrs-green"
                  steps={strategy.earlyGame}
                />
                <PhaseCard
                  title="Mid Game"
                  subtitle="2,000-10,000 Renown"
                  color="text-osrs-gold"
                  steps={strategy.midGame}
                />
                <PhaseCard
                  title="Late Game"
                  subtitle="10,000+ Renown"
                  color="text-demon-glow"
                  steps={strategy.lateGame}
                />
              </div>
            </div>
          );
        }}
      </Tabs>
    </div>
  );
}

function PhaseCard({
  title,
  subtitle,
  color,
  steps,
}: {
  title: string;
  subtitle: string;
  color: string;
  steps: string[];
}) {
  return (
    <Card>
      <h4
        className={`font-bold ${color} mb-1`}
        style={{ fontFamily: "var(--font-runescape)" }}
      >
        {title}
      </h4>
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
