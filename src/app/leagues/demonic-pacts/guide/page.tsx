"use client";

import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Tabs } from "@/components/ui/Tabs";
import { EfficiencyGuideSection } from "@/components/league/EfficiencyGuideSection";
import { demonicPactsLeague } from "@/data/demonic-pacts";
import { demonicPactsRank1Guide } from "@/data/guides/efficiency";
import { encodeBuild } from "@/lib/build-storage";
import Link from "next/link";
import type { LeagueBuild } from "@/types/league";

const strategies = [
  {
    id: "speedrun",
    name: "Speedrunner",
    description: "Maximize points per hour. Rush task completion with optimal routing.",
    difficulty: "Advanced",
    relics: { t1: "Barbarian Gathering", t2: "Woodsman", t8: "Minion" },
    regions: ["Kebos & Kourend", "Morytania", "Kandarin"],
    pacts: ["Glass Cannon"],
    priorities: [
      "Rush easy and medium tasks first for fast league points",
      "Barbarian Gathering's knapsack lets you stay out longer",
      "Prioritize quests that unlock multiple task categories",
      "Evil Eye (T3) boss teleports minimize travel time between tasks",
      "Culling Spree (T6) optimizes Slayer tasks with configurable kills",
      "Complete Combat Achievements early — rewards compound with league drop multipliers",
    ],
    regionAnalysis:
      "Kebos & Kourend is the task density king — CoX, Hydra, Wintertodt, Tithe Farm, and GOTR pack the most completable tasks per hour. Morytania adds Barrows and ToB for elite/master tasks. Kandarin rounds it out with Zulrah, broad skilling, and clue-friendly geography.",
    earlyGame: [
      "Barbarian Gathering (T1): knapsack + bare-hand gathering with crystal-tier tools",
      "Woodsman (T2): instant Fletching, double Hunter loot, no-charge Quetzal Whistles",
      "Complete easy tasks across all categories",
      "Start quests for QP — Dragon Slayer I is auto-completed",
    ],
    midGame: [
      "Evil Eye (T3): teleport to any boss or raid entrance — start Barrows, GWD",
      "Conniving Clues (T4): caskets give clue contracts + 1/15 clue drop rate",
      "Nature's Accord (T5): fairy mushroom teleports + 10x farming yield",
      "Kebos: Chambers of Xeric + Hydra for elite tasks",
    ],
    lateGame: [
      "Culling Spree (T6): choose Slayer tasks, superiors drop elite clues",
      "Minion (T8): combat companion auto-loots while you kill, AoE in multi",
      "Target remaining hard/elite/master tasks",
      "Push Combat Achievements alongside boss tasks for compounding rewards",
    ],
  },
  {
    id: "pvm",
    name: "PvM Powerhouse",
    description: "Maximize combat power. Dominate every boss in the game.",
    difficulty: "Intermediate",
    relics: { t1: "Endless Harvest", t2: "Hotfoot", t8: "Minion" },
    regions: ["Asgarnia", "Morytania", "Kebos & Kourend"],
    pacts: ["Glass Cannon", "Berserker's Oath"],
    priorities: [
      "Build toward end-game PvM as fast as possible",
      "Stack pacts for maximum damage output",
      "Endless Harvest auto-banks resources for passive supply generation",
      "Hotfoot auto-cooks fish and auto-smelts ore — passive supply prep",
      "Minion companion adds extra DPS and auto-loots",
      "Asgarnia = GWD + Nex, Morytania = ToB + Barrows, Kebos = CoX + Hydra",
    ],
    regionAnalysis:
      "Asgarnia gives GWD (all four generals + Nex) and Corp Beast — the densest boss cluster in the game. Morytania adds ToB, Barrows, Nightmare, and the Slayer Tower for efficient task chaining. Kebos & Kourend completes the trio with CoX and Hydra, the two highest-value PvM encounters.",
    earlyGame: [
      "Endless Harvest (T1): resources auto-bank, nodes never deplete, 2x resources",
      "Hotfoot (T2): auto-cooks fish, auto-smelts ore, 100% success on Agility + Cooking",
      "Train combat through Slayer for task overlap",
      "Build supplies passively via Endless Harvest while training",
    ],
    midGame: [
      "Evil Eye (T3): teleport to any boss entrance — start GWD farming",
      "Start Barrows (Morytania) and God Wars bosses (Asgarnia)",
      "Activate pacts once you can handle the risk trade-offs",
      "Push Combat Achievements at every boss — rewards compound with league boosts",
    ],
    lateGame: [
      "Culling Spree (T6): optimized Slayer with chain superiors",
      "Minion (T8): companion fights + auto-loots + AoE in multi",
      "Berserker's Oath for max damage (high risk — cannot use protection prayers)",
      "Solo ToB, CoX, and push for Infernal Cape",
    ],
  },
  {
    id: "completionist",
    name: "Completionist",
    description: "Complete every task. Reach Dragon tier rewards.",
    difficulty: "Expert",
    relics: { t1: "Abundance", t2: "Woodsman", t8: "Flask of Fervour" },
    regions: ["Kebos & Kourend", "Kharidian Desert", "Morytania"],
    pacts: ["Melee Might", "Glass Cannon"],
    priorities: [
      "Balance across all task categories — don't neglect any",
      "Abundance gives +10 to all non-combat skills + coin generation",
      "Kebos (CoX, Hydra, Wintertodt), Desert (ToA), Morytania (ToB, Barrows)",
      "Complete Combat Achievements alongside PvM — rewards stack with league multipliers",
      "Target 56,000+ points for Dragon tier",
      "Unlock all diary tiers in your regions for passive bonuses",
    ],
    regionAnalysis:
      "Kebos & Kourend has the highest total task count across all categories. Kharidian Desert adds ToA (the most accessible raid with scaling difficulty) and Pyramid Plunder for Thieving tasks. Morytania rounds out PvM coverage with ToB and Barrows while adding Slayer Tower tasks.",
    earlyGame: [
      "Abundance (T1): +10 skill boost unlocks high-level content early",
      "Woodsman (T2): auto-processes logs, doubles Hunter output, instant Fletching",
      "Complete ALL easy tasks before moving on to medium",
      "Build a broad skill base — Abundance makes everything efficient",
    ],
    midGame: [
      "Evil Eye (T3): boss teleports for combat task coverage",
      "Conniving Clues (T4): clue contracts + boosted drop rate for collection log",
      "Nature's Accord (T5): fairy mushroom teleports + 10x farming yield noted",
      "Push medium + hard tasks across every category",
    ],
    lateGame: [
      "Culling Spree (T6): configurable Slayer for remaining combat tasks",
      "Flask of Fervour (T8): full HP/prayer/spec restore + AoE damage burst for survivability",
      "Rotate combat styles to cover all task requirements",
      "Target remaining elite and master tasks past 56,000 pts",
    ],
  },
  {
    id: "casual",
    name: "Casual / AFK",
    description: "Sustainable play. Maximize rewards per hour of effort, not per tick.",
    difficulty: "Beginner",
    relics: { t1: "Endless Harvest", t2: "Hotfoot", t8: "Minion" },
    regions: ["Kebos & Kourend", "Kandarin", "Kharidian Desert"],
    pacts: [],
    priorities: [
      "Endless Harvest auto-banks everything — gather while AFK",
      "Hotfoot auto-cooks fish, auto-smelts ore — zero-effort processing",
      "Avoid high-risk pacts until you're comfortable with combat mechanics",
      "Kebos: Wintertodt + GOTR are low-effort, high-reward",
      "Kandarin: broad skilling (fishing, fletching, cooking) with easy task density",
      "Do herb runs and birdhouse runs between active play sessions",
    ],
    regionAnalysis:
      "Kebos & Kourend is ideal for casual play — Wintertodt, GOTR, and Tithe Farm are semi-AFK skilling activities that also complete tasks. Kandarin offers the best fishing, fletching, and cooking spots with low-effort tasks. Kharidian Desert adds Pyramid Plunder and ToA (which scales down to very easy invocations).",
    earlyGame: [
      "Endless Harvest (T1): auto-bank + infinite nodes = zero-effort gathering",
      "Hotfoot (T2): auto-cook fish + auto-smelt ore, 100% Agility/Cooking success",
      "Complete easy tasks naturally while skilling",
      "No pacts needed — play at your own pace",
    ],
    midGame: [
      "Start Wintertodt (Kebos) and Fishing Trawler (Kandarin) for AFK task points",
      "Conniving Clues (T4): boosted clue drops make treasure trails rewarding",
      "Nature's Accord (T5): plants never die, 10x yield — low-effort herb runs",
      "Work through medium tasks in your regions at a relaxed pace",
    ],
    lateGame: [
      "Culling Spree (T6): pick comfortable Slayer tasks, skip annoying ones",
      "Minion (T8): companion handles adds and auto-loots while you focus on the boss",
      "Push into hard tasks — many are just 'reach X level' which Harvest handles naturally",
      "Consider adding a pact if you want to push for higher trophy tiers",
    ],
  },
];

const regionRankings = [
  {
    name: "Kebos & Kourend",
    tier: "S",
    summary: "CoX, Hydra, Wintertodt, GOTR, Tithe Farm. Highest task density and broadest content coverage.",
  },
  {
    name: "Morytania",
    tier: "S",
    summary: "ToB, Barrows, Nightmare, Slayer Tower. Best PvM region with strong elite/master task pool.",
  },
  {
    name: "Asgarnia",
    tier: "A",
    summary: "GWD (all generals + Nex), Corp Beast, Warriors' Guild. Dense boss cluster but limited skilling.",
  },
  {
    name: "Kharidian Desert",
    tier: "A",
    summary: "ToA (scalable difficulty), KQ, Pyramid Plunder, Sophanem. Raid access + Thieving tasks.",
  },
  {
    name: "Kandarin",
    tier: "A",
    summary: "Zulrah, Seers' Village, broad skilling. Strong all-rounder with easy/medium task density.",
  },
  {
    name: "Fremennik Province",
    tier: "B",
    summary: "Vorkath, DKS, Nex (shared with Asgarnia). Strong PvM but narrow skill coverage.",
  },
  {
    name: "Tirannwn",
    tier: "B",
    summary: "Gauntlet, Zalcano, Prifddinas. High skill requirements but powerful rewards.",
  },
  {
    name: "Wilderness",
    tier: "B",
    summary: "Callisto, Venenatis, Vet'ion, Revenant Caves. PvP is disabled in leagues — free boss tasks.",
  },
];

function buildPlannerUrl(strategy: (typeof strategies)[number]): string {
  const league = demonicPactsLeague;
  const allRelics = league.relicTiers.flatMap((t) => t.relics);

  const matchedRelicIds = Object.values(strategy.relics)
    .map(
      (name) =>
        allRelics.find((r) => r.name.toLowerCase() === name.toLowerCase())?.id,
    )
    .filter((id): id is string => !!id);

  const matchedPactIds = strategy.pacts
    .map(
      (name) =>
        league.pacts.find((p) => p.name.toLowerCase() === name.toLowerCase())
          ?.id,
    )
    .filter((id): id is string => !!id);

  const matchedRegionIds = strategy.regions
    .map(
      (name) =>
        league.regions.find((r) => r.name.toLowerCase() === name.toLowerCase())
          ?.id,
    )
    .filter((id): id is string => !!id);

  const build: LeagueBuild = {
    id: "",
    name: `${strategy.name} Build`,
    accountType: "ironman",
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
  const tabs = [
    { id: "rank1", label: "Rank 1 Guide" },
    ...strategies.map((s) => ({
      id: s.id,
      label: s.name,
    })),
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex items-center gap-2 mb-3 text-sm text-osrs-text-dim">
        <Link href="/" className="hover:text-osrs-gold">
          Home
        </Link>
        <span>/</span>
        <Link
          href="/leagues/demonic-pacts"
          className="hover:text-osrs-gold"
        >
          Demonic Pacts
        </Link>
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
        Optimized strategies for different playstyles. Each guide includes
        recommended relics, pacts, regions, and a phased progression plan.
      </p>

      <Card className="mb-8 border-demon-ember/30 bg-demon-ember/5">
        <div className="flex items-start gap-3">
          <span className="text-demon-ember text-lg mt-0.5">&#x26A0;</span>
          <div>
            <h3
              className="font-bold text-demon-ember mb-1"
              style={{ fontFamily: "var(--font-runescape)" }}
            >
              Pact Details TBD
            </h3>
            <p className="text-sm text-osrs-text-dim">
              Jagex is keeping pact mechanics secret until launch (April 15).
              The pact names below are from data-mined league data, but
              their exact effects and trade-offs are unconfirmed.
              Recommendations marked &quot;Expected:&quot; are based on
              relic naming patterns and may change.
            </p>
          </div>
        </div>
      </Card>

      <Tabs tabs={tabs}>
        {(activeTab) => {
          if (activeTab === "rank1") {
            return <EfficiencyGuideSection guide={demonicPactsRank1Guide} />;
          }

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
                      <Badge
                        variant={
                          strategy.difficulty === "Expert"
                            ? "red"
                            : strategy.difficulty === "Advanced"
                              ? "purple"
                              : strategy.difficulty === "Beginner"
                                ? "green"
                                : "gold"
                        }
                      >
                        {strategy.difficulty}
                      </Badge>
                    </div>
                    <p className="text-osrs-text-dim">
                      {strategy.description}
                    </p>
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
                    Relic Choices
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-osrs-gold text-xs font-bold">T1</span>
                      <span className="text-osrs-text">{strategy.relics.t1}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-osrs-gold text-xs font-bold">T2</span>
                      <span className="text-osrs-text">{strategy.relics.t2}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-osrs-gold text-xs font-bold">T8</span>
                      <span className="text-osrs-text">{strategy.relics.t8}</span>
                    </div>
                  </div>
                  <p className="text-xs text-osrs-text-dim mt-2">
                    T3 Evil Eye, T4 Conniving Clues, T5 Nature&apos;s Accord,
                    T6 Culling Spree are the only option at their tier.
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
                      <div
                        key={region}
                        className="flex items-center gap-2 text-sm"
                      >
                        <span className="text-osrs-blue">&#x25C6;</span>
                        <span className="text-osrs-text">{region}</span>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-osrs-text-dim mt-2">
                    Varlamore (start) + Karamja (auto-unlock) always
                    available. Misthalin is inaccessible.
                  </p>
                </Card>

                <Card>
                  <h3
                    className="font-bold text-demon-glow mb-3"
                    style={{ fontFamily: "var(--font-runescape)" }}
                  >
                    Recommended Pacts
                  </h3>
                  {strategy.pacts.length > 0 ? (
                    <div className="space-y-2">
                      {strategy.pacts.map((pact) => (
                        <div
                          key={pact}
                          className="flex items-center gap-2 text-sm"
                        >
                          <span className="text-demon-ember">&#x1F525;</span>
                          <span className="text-osrs-text">{pact}</span>
                        </div>
                      ))}
                      <p className="text-xs text-osrs-text-dim mt-2">
                        Exact pact effects will be revealed at launch.
                      </p>
                    </div>
                  ) : (
                    <p className="text-sm text-osrs-text-dim">
                      No pacts recommended for this strategy. Play without
                      risk trade-offs and add pacts later if you want to push
                      for higher tiers.
                    </p>
                  )}
                </Card>
              </div>

              {strategy.regionAnalysis && (
                <Card>
                  <h3
                    className="font-bold text-osrs-blue mb-2"
                    style={{ fontFamily: "var(--font-runescape)" }}
                  >
                    Why These Regions?
                  </h3>
                  <p className="text-sm text-osrs-text-dim">
                    {strategy.regionAnalysis}
                  </p>
                </Card>
              )}

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
                      <span className="text-osrs-green mt-0.5">
                        &#x2726;
                      </span>
                      <span className="text-osrs-text-dim">{p}</span>
                    </div>
                  ))}
                </div>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <PhaseCard
                  title="Early Game"
                  subtitle="0-2,500 League Points"
                  color="text-osrs-green"
                  steps={strategy.earlyGame}
                />
                <PhaseCard
                  title="Mid Game"
                  subtitle="2,500-10,000 League Points"
                  color="text-osrs-gold"
                  steps={strategy.midGame}
                />
                <PhaseCard
                  title="Late Game"
                  subtitle="10,000+ League Points"
                  color="text-demon-glow"
                  steps={strategy.lateGame}
                />
              </div>
            </div>
          );
        }}
      </Tabs>

      <div className="mt-12">
        <h2
          className="text-2xl font-bold text-osrs-gold mb-4"
          style={{ fontFamily: "var(--font-runescape)" }}
        >
          Region Comparison
        </h2>
        <p className="text-sm text-osrs-text-dim mb-6">
          You can choose 3 of 8 regions. Varlamore (start) and Karamja
          (auto-unlock) are always available. Misthalin is inaccessible.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {regionRankings.map((region) => (
            <Card key={region.name}>
              <div className="flex items-start gap-3">
                <Badge
                  variant={
                    region.tier === "S"
                      ? "gold"
                      : region.tier === "A"
                        ? "blue"
                        : "default"
                  }
                >
                  {region.tier}
                </Badge>
                <div>
                  <h4
                    className="font-bold text-osrs-text mb-1"
                    style={{ fontFamily: "var(--font-runescape)" }}
                  >
                    {region.name}
                  </h4>
                  <p className="text-sm text-osrs-text-dim">
                    {region.summary}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
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
            <span className="text-osrs-text-dim text-xs mt-0.5 w-4 flex-shrink-0">
              {i + 1}.
            </span>
            <span className="text-osrs-text-dim">{step}</span>
          </li>
        ))}
      </ol>
    </Card>
  );
}
