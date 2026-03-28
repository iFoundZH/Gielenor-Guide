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
    relic: "Barbarian Gathering",
    regions: ["Kebos & Kourend", "Morytania", "Kandarin"],
    pacts: ["Melee Might", "Glass Cannon"],
    priorities: [
      "Rush easy and medium tasks first for fast renown",
      "Barbarian Gathering's knapsack lets you stay out longer",
      "Prioritize quests that unlock multiple task categories",
      "Evil Eye (T3) teleports directly to every boss lair",
      "Glass Cannon + Melee Might for fast kills through Slayer",
      "Culling Spree (T6) optimizes Slayer tasks with configurable kills",
    ],
    earlyGame: [
      "Grab Barbarian Gathering (T1) for knapsack + bare-hand gathering",
      "Woodsman (T2) auto-unlocks: instant Fletching + double Hunter loot",
      "Complete easy tasks across all categories",
      "Start quests for QP — Dragon Slayer I is auto-completed",
    ],
    midGame: [
      "Evil Eye (T3) unlocks boss teleports — start Barrows, GWD",
      "Activate Glass Cannon for massive damage boost",
      "Start Slayer grind — 5x points, free Bigger & Badder",
      "Kebos: Chambers of Xeric + Hydra for elite tasks",
    ],
    lateGame: [
      "Culling Spree (T6): choose Slayer tasks, superiors drop elite clues",
      "Minion (T8): combat companion auto-loots while you kill",
      "Target remaining hard/elite/master tasks",
      "Push all boss tasks with Evil Eye teleports + Minion",
    ],
  },
  {
    id: "pvm",
    name: "PvM Powerhouse",
    description: "Maximize combat power. Dominate every boss in the game.",
    accountType: "Any",
    difficulty: "Intermediate",
    relic: "Endless Harvest",
    regions: ["Asgarnia", "Morytania", "Kebos & Kourend"],
    pacts: ["Melee Might", "Glass Cannon", "Berserker's Oath"],
    priorities: [
      "Build toward end-game PvM as fast as possible",
      "Glass Cannon + Berserker's Oath = insane damage but no protection prayers",
      "Endless Harvest auto-banks resources for supply generation",
      "Evil Eye boss teleports minimize travel time",
      "Minion companion adds extra DPS and auto-loots",
      "Asgarnia = GWD, Morytania = ToB, Kebos = CoX",
    ],
    earlyGame: [
      "Endless Harvest (T1): resources auto-bank, nodes never deplete",
      "Woodsman (T2): Hunter loot doubled, instant Fletching for gear",
      "Train combat through Slayer for task overlap",
      "Build supplies passively via Endless Harvest",
    ],
    midGame: [
      "Evil Eye (T3): teleport to any boss — start GWD farming",
      "Activate Melee Might + Glass Cannon for massive DPS",
      "Start Barrows (Morytania) and God Wars bosses (Asgarnia)",
      "Vampiric Touch optional for lifesteal sustain",
    ],
    lateGame: [
      "Culling Spree (T6): optimized Slayer with chain superiors",
      "Minion (T8): companion fights + auto-loots + AoE in multi",
      "Berserker's Oath for max damage (no protection prayers!)",
      "Solo ToB, CoX, and push for Infernal Cape",
    ],
  },
  {
    id: "completionist",
    name: "Completionist",
    description: "Complete every task. Reach Dragon tier rewards.",
    accountType: "Main",
    difficulty: "Expert",
    relic: "Abundance",
    regions: ["Kebos & Kourend", "Desert", "Morytania"],
    pacts: ["Melee Might", "Ranged Fury", "Magic Surge", "Vampiric Touch"],
    priorities: [
      "Balance across all task categories — don't neglect any",
      "Abundance gives +10 to all non-combat skills + coin generation",
      "All three combat pacts cover every style for task versatility",
      "Vampiric Touch for sustain — reduced prayer but heals on hit",
      "Kebos (CoX, Hydra, Wintertodt), Desert (ToA), Morytania (ToB, Barrows)",
      "Target 56,000+ points for Dragon tier",
    ],
    earlyGame: [
      "Abundance (T1): +10 skill boost unlocks high-level content early",
      "Woodsman (T2): auto-processes logs, doubles Hunter output",
      "Complete ALL easy tasks before moving on to medium",
      "Build a broad skill base — Abundance makes everything efficient",
    ],
    midGame: [
      "Evil Eye (T3): boss teleports for combat task coverage",
      "Activate multiple combat pacts for versatility across styles",
      "Coins from Abundance's XP generation fund supplies",
      "Push medium + hard tasks across every category",
    ],
    lateGame: [
      "Culling Spree (T6): configurable Slayer for remaining combat tasks",
      "Minion (T8): companion assists while you push final tasks",
      "All three combat pacts let you switch styles for any task",
      "Target remaining elite and master tasks past 56,000 pts",
    ],
  },
  {
    id: "ironman",
    name: "Ironman Optimized",
    description: "Self-sufficient strategies for ironman accounts.",
    accountType: "Ironman",
    difficulty: "Advanced",
    relic: "Endless Harvest",
    regions: ["Kebos & Kourend", "Kandarin", "Fremennik Province"],
    pacts: ["Melee Might", "Vampiric Touch"],
    priorities: [
      "Self-sufficiency is key — Endless Harvest auto-banks everything",
      "Woodsman doubles Hunter loot and auto-processes logs",
      "Vampiric Touch provides lifesteal without needing food",
      "Kebos (CoX, GOTR, Wintertodt) + Kandarin (Zulrah, fishing)",
      "Fremennik (Vorkath, Nex, DKs) for endgame PvM",
      "Evil Eye boss teleports save tons of travel time",
    ],
    earlyGame: [
      "Endless Harvest (T1): double resources auto-bank immediately",
      "Woodsman (T2): Hunter traps drop herb/tree seeds for Farming",
      "Focus on gathering skills to build resource base",
      "Complete quests for useful unlocks",
    ],
    midGame: [
      "Evil Eye (T3): boss teleports for efficient bossing",
      "Melee Might for combat task efficiency",
      "Vampiric Touch for lifesteal sustain without food",
      "Start Slayer — 5x points + free Bigger & Badder",
    ],
    lateGame: [
      "Culling Spree (T6): optimized Slayer + chain superiors",
      "Minion (T8): companion fights and auto-loots kills",
      "Focus on tasks that align with your resource base",
      "Target boss tasks — Vorkath, Zulrah, CoX with full setup",
    ],
  },
];

function buildPlannerUrl(strategy: typeof strategies[number]): string {
  const league = demonicPactsLeague;
  const allRelics = league.relicTiers.flatMap((t) => t.relics);

  const matchedRelicIds = [strategy.relic]
    .map((name) => allRelics.find((r) => r.name.toLowerCase() === name.toLowerCase())?.id)
    .filter((id): id is string => !!id);

  const matchedPactIds = strategy.pacts
    .map((name) => league.pacts.find((p) => p.name.toLowerCase() === name.toLowerCase())?.id)
    .filter((id): id is string => !!id);

  const matchedRegionIds = strategy.regions
    .map((name) => league.regions.find((r) => r.name.toLowerCase() === name.toLowerCase())?.id)
    .filter((id): id is string => !!id);

  const build: LeagueBuild = {
    id: "",
    name: `${strategy.name} Build`,
    accountType: strategy.accountType === "Ironman" ? "ironman" : "main",
    regions: matchedRegionIds,
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
        relics, pacts, regions, and a phased progression plan.
      </p>

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
                    Open in Planner
                  </Link>
                </div>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <h3
                    className="font-bold text-osrs-gold mb-3"
                    style={{ fontFamily: "var(--font-runescape)" }}
                  >
                    T1 Relic Choice
                  </h3>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-osrs-gold text-xs font-bold">T1</span>
                    <span className="text-osrs-text">{strategy.relic}</span>
                  </div>
                  <p className="text-xs text-osrs-text-dim mt-2">
                    T2 Woodsman, T3 Evil Eye, T6 Culling Spree, T8 Minion are auto-selected (only one option per tier).
                  </p>
                </Card>

                <Card>
                  <h3
                    className="font-bold text-osrs-blue mb-3"
                    style={{ fontFamily: "var(--font-runescape)" }}
                  >
                    Regions (3 of 8)
                  </h3>
                  <div className="space-y-2">
                    {strategy.regions.map((region) => (
                      <div key={region} className="flex items-center gap-2 text-sm">
                        <span className="text-osrs-blue">&#x25C6;</span>
                        <span className="text-osrs-text">{region}</span>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-osrs-text-dim mt-2">Varlamore (start) + Karamja (auto-unlock) always available.</p>
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
                        <span className="text-demon-ember">&#x1F525;</span>
                        <span className="text-osrs-text">{pact}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>

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
                      <span className="text-osrs-green mt-0.5">&#x2726;</span>
                      <span className="text-osrs-text-dim">{p}</span>
                    </div>
                  ))}
                </div>
              </Card>

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
