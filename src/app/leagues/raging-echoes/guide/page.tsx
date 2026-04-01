"use client";

import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Tabs } from "@/components/ui/Tabs";
import { EfficiencyGuideSection } from "@/components/league/EfficiencyGuideSection";
import { ragingEchoesLeague } from "@/data/raging-echoes";
import { ragingEchoesRank1Guide } from "@/data/guides/efficiency";
import { encodeBuild } from "@/lib/build-storage";
import Link from "next/link";
import type { LeagueBuild } from "@/types/league";

const strategies = [
  {
    id: "speedrun",
    name: "Speedrunner",
    description: "Maximize points per hour with fast task completion routing.",
    difficulty: "Advanced",
    relics: [
      "Animal Wrangler",
      "Dodgy Deals",
      "Clue Compass",
      "Golden God",
      "Treasure Arbiter",
      "Total Recall",
      "Grimoire",
      "Specialist",
    ],
    masteries: ["Melee Mastery"],
    regions: ["Morytania", "Kourend", "Kandarin"],
    regionAnalysis:
      "Morytania at 90 tasks gives immediate Barrows access — the fastest early boss for task points. Kourend at 200 adds CoX, Hydra, and Wintertodt for the highest task density of any region. Kandarin at 400 fills gaps with Zulrah, broad skilling, and clue-friendly geography.",
    earlyGame: [
      "Animal Wrangler (T1): enhanced fishing/hunting, auto-cook, traps never fail",
      "Dodgy Deals (T2): 100% pickpocket success, noted loot, multi-NPC targeting",
      "Rush easy + medium tasks across all skill categories",
      "Unlock first region at 90 tasks — pick Morytania for Barrows",
    ],
    midGame: [
      "Clue Compass (T3): teleport to STASH units and clue steps instantly",
      "Golden God (T4): free alchemy with 65% item preservation for GP generation",
      "Treasure Arbiter (T5): 10x clue drops + max casket rewards",
      "Mass clue completions for task points and collection log slots",
    ],
    lateGame: [
      "Total Recall (T6): save location/stats, teleport back after banking",
      "Grimoire (T7): swap spellbooks freely, unlock all prayers/spells",
      "Specialist (T8): 20% spec cost + energy on kills/misses",
      "Complete Combat Achievements alongside boss tasks — rewards compound with league boosts",
    ],
  },
  {
    id: "pvm",
    name: "PvM Destroyer",
    description: "Maximum combat power to dominate every boss in the league.",
    difficulty: "Intermediate",
    relics: [
      "Power Miner",
      "Corner Cutter",
      "Bank Heist",
      "Reloaded",
      "Slayer Master",
      "Banker's Note",
      "Grimoire",
      "Guardian",
    ],
    masteries: ["Melee Mastery", "Ranged Mastery"],
    regions: ["Morytania", "Kourend", "Asgarnia"],
    regionAnalysis:
      "Morytania first for Barrows → ToB pipeline. Kourend second for CoX + Hydra (95 Slayer — Slayer Master makes this fast). Asgarnia third for GWD — all four generals plus Nex for BiS gear. This trio covers every raid and most endgame bosses.",
    earlyGame: [
      "Power Miner (T1): auto-bank ores, auto-smelt for early gear",
      "Corner Cutter (T2): always succeed agility, double completion, free GP from marks",
      "Train combat through Slayer for task overlap",
      "Rush Barrows with first region unlock (Morytania at 90 tasks)",
    ],
    midGame: [
      "Bank Heist (T3): teleport to any bank/deposit box instantly",
      "Reloaded (T4): pick a second relic from T1-T3 for more power",
      "Slayer Master (T5): always on task, free perks, bonus XP milestones",
      "Start GWD bosses (Asgarnia) — Slayer Master makes everything count",
    ],
    lateGame: [
      "Banker's Note (T6): note/unnote items for efficient inventory management",
      "Grimoire (T7): all prayers and spells unlocked, swap books freely",
      "Guardian (T8): 30-min combat thrall with adaptive style + AoE",
      "Solo every raid and boss with Guardian + full mastery stacks",
    ],
  },
  {
    id: "completionist",
    name: "Completionist",
    description: "Touch every piece of content. Reach Dragon tier (60,000 points).",
    difficulty: "Expert",
    relics: [
      "Lumberjack",
      "Friendly Forager",
      "Fairy's Flight",
      "Equilibrium",
      "Production Master",
      "Total Recall",
      "Overgrown",
      "Last Stand",
    ],
    masteries: ["Melee Mastery", "Ranged Mastery", "Magic Mastery"],
    regions: ["Morytania", "Kourend", "Kandarin"],
    regionAnalysis:
      "Morytania + Kourend + Kandarin is the maximum task coverage trio. Together they span every skill category, all three raids (CoX in Kourend, ToB in Morytania), and enough boss variety for elite/master tasks. Kandarin's broad skilling fills gaps that pure PvM regions miss.",
    earlyGame: [
      "Lumberjack (T1): auto-bank wood, auto-burn/fletch, 50% fail recovery",
      "Friendly Forager (T2): auto-find herbs, 90% secondary preservation, 4-dose potions",
      "Complete ALL easy tasks first for fast point accumulation",
      "Build a broad skill base across every category",
    ],
    midGame: [
      "Fairy's Flight (T3): teleport to fairy rings, spirit trees, and tool leprechauns",
      "Equilibrium (T4): +10-20% of total level as bonus XP per action",
      "Production Master (T5): batch-process all crafting simultaneously",
      "Touch every task category — completion breadth matters for points",
    ],
    lateGame: [
      "Total Recall (T6): save and restore location/stats for efficient bossing loops",
      "Overgrown (T7): crops never die, auto-harvest/replant, 75% seed preservation",
      "Last Stand (T8): survive lethal damage with 255 stats for 16 ticks",
      "Push all elite/master tasks — aim for 60,000 points for Dragon tier",
    ],
  },
  {
    id: "casual",
    name: "Casual / AFK",
    description:
      "Relaxed play with gathering relics and minimal mechanical demands.",
    difficulty: "Beginner",
    relics: [
      "Power Miner",
      "Friendly Forager",
      "Bank Heist",
      "Equilibrium",
      "Production Master",
      "Banker's Note",
      "Overgrown",
      "Last Stand",
    ],
    masteries: ["Melee Mastery"],
    regions: ["Kourend", "Kandarin", "Wilderness"],
    regionAnalysis:
      "Kourend has the most AFK-friendly content: Wintertodt, GOTR, and Tithe Farm all complete tasks while semi-AFK. Kandarin adds fishing, fletching, cooking, and agility with easy task density. Wilderness is a sleeper pick — PvP is disabled in leagues, so Wilderness boss tasks are free points with no risk.",
    earlyGame: [
      "Power Miner (T1): auto-bank ores, auto-smelt — mine while AFK",
      "Friendly Forager (T2): auto-find herbs, passive Herblore XP",
      "Complete easy tasks naturally while skilling in Misthalin + Karamja",
      "Unlock Kourend at 90 tasks for Wintertodt access",
    ],
    midGame: [
      "Bank Heist (T3): instant bank teleport for convenience",
      "Equilibrium (T4): bonus XP from total level — rewards broad training",
      "Production Master (T5): batch-process crafting for fast skilling tasks",
      "Wintertodt, GOTR, and fishing are low-effort task completers",
    ],
    lateGame: [
      "Banker's Note (T6): note/unnote items anywhere for lazy inventory",
      "Overgrown (T7): fully automated farming — just plant and forget",
      "Last Stand (T8): safety net for bossing attempts",
      "Wilderness bosses are free points with PvP disabled — don't skip them",
    ],
  },
];

const regionRankings = [
  {
    name: "Kourend",
    tier: "S",
    summary:
      "CoX, Hydra, Wintertodt, GOTR, Tithe Farm. Highest task density, broadest content. The default first or second pick.",
  },
  {
    name: "Morytania",
    tier: "S",
    summary:
      "ToB, Barrows, Nightmare, Slayer Tower. Best early PvM unlock at 90 tasks. Strong elite/master task pool.",
  },
  {
    name: "Asgarnia",
    tier: "A",
    summary:
      "GWD (all generals + Nex), Corp Beast, Warriors' Guild. Dense boss cluster but limited skilling.",
  },
  {
    name: "Kandarin",
    tier: "A",
    summary:
      "Zulrah, Seers' Village, Catherby, Piscatoris. Strong all-rounder with broad skilling and clue support.",
  },
  {
    name: "Desert",
    tier: "A",
    summary:
      "ToA (scalable difficulty), KQ, Pyramid Plunder. Raid access with Thieving/Agility tasks.",
  },
  {
    name: "Fremennik",
    tier: "B",
    summary:
      "Vorkath, DKS. Strong PvM but narrow skill coverage. Best paired with a skilling region.",
  },
  {
    name: "Wilderness",
    tier: "B",
    summary:
      "Callisto, Venenatis, Vet'ion, Revenant Caves. PvP disabled in leagues = free boss tasks.",
  },
  {
    name: "Tirannwn",
    tier: "B",
    summary:
      "Gauntlet, Zalcano, Prifddinas. Powerful but requires high skill levels and Song of the Elves.",
  },
  {
    name: "Varlamore",
    tier: "C",
    summary:
      "Newer content with less task density. Colosseum is mechanically demanding for limited points.",
  },
];

function buildPlannerUrl(strategy: (typeof strategies)[number]): string {
  const league = ragingEchoesLeague;
  const allRelics = league.relicTiers.flatMap((t) => t.relics);

  const matchedRelicIds = strategy.relics
    .map(
      (name) =>
        allRelics.find((r) => r.name.toLowerCase() === name.toLowerCase())?.id,
    )
    .filter((id): id is string => !!id);

  const matchedMasteryIds = strategy.masteries
    .map(
      (name) =>
        league.masteries?.styles.find((s) => s.name.toLowerCase() === name.toLowerCase())
          ?.id,
    )
    .filter((id): id is string => !!id)
    .flatMap((id) => [`${id}-1`]);

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
  const tabs = [
    { id: "rank1", label: "Rank 1 Guide" },
    ...strategies.map((s) => ({ id: s.id, label: s.name })),
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex items-center gap-2 mb-3 text-sm text-osrs-text-dim">
        <Link href="/" className="hover:text-osrs-gold">
          Home
        </Link>
        <span>/</span>
        <Link
          href="/leagues/raging-echoes"
          className="hover:text-osrs-gold"
        >
          Raging Echoes
        </Link>
        <span>/</span>
        <span className="text-osrs-gold">Strategy Guide</span>
      </div>

      <h1
        className="text-3xl font-bold text-osrs-gold text-glow-gold mb-2"
        style={{ fontFamily: "var(--font-runescape)" }}
      >
        Raging Echoes Strategy Guide
      </h1>
      <p className="text-osrs-text-dim mb-8">
        Optimized strategies for every playstyle. 8 relic tiers, 3 region
        unlocks (Misthalin + Karamja start). 1,589 tasks, 141,080 total
        points available.
      </p>

      <Card className="mb-8">
        <h3
          className="font-bold text-demon-glow mb-2"
          style={{ fontFamily: "var(--font-runescape)" }}
        >
          Combat Masteries Explained
        </h3>
        <p className="text-sm text-osrs-text-dim mb-3">
          RE introduced combat masteries — 3 styles (Melee, Ranged, Magic)
          with 6 tiers each. You earn mastery points by hitting combat
          milestones (10 milestones total across all styles). Each tier
          unlocks stronger passives and universal bonuses.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <h4 className="text-sm font-bold text-osrs-text mb-1">
              Melee Mastery
            </h4>
            <p className="text-xs text-osrs-text-dim">
              Highest DPS ceiling. Echo chaining is multiplicative — each
              echo boss kill amplifies the next. Melee&apos;s high base damage
              makes this scaling the strongest. Best for speed and boss
              farming.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-bold text-osrs-text mb-1">
              Ranged Mastery
            </h4>
            <p className="text-xs text-osrs-text-dim">
              Safest option. Range lets you kite bosses while echo passives
              stack. Specialist (T8) makes spec weapons extremely efficient.
              Best for learning bosses and consistent kills.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-bold text-osrs-text mb-1">
              Magic Mastery
            </h4>
            <p className="text-xs text-osrs-text-dim">
              Most versatile with Grimoire (T7) unlocking all spellbooks.
              Blood Barrage sustain + magic passives make AoE dominant.
              Best for Slayer tasks and multi-combat areas.
            </p>
          </div>
        </div>
      </Card>

      <Tabs tabs={tabs}>
        {(activeTab) => {
          if (activeTab === "rank1") {
            return <EfficiencyGuideSection guide={ragingEchoesRank1Guide} />;
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <h3
                    className="font-bold text-osrs-gold mb-3"
                    style={{ fontFamily: "var(--font-runescape)" }}
                  >
                    Recommended Relics (All 8 Tiers)
                  </h3>
                  <div className="space-y-2">
                    {strategy.relics.map((relic, i) => (
                      <div
                        key={relic}
                        className="flex items-center gap-2 text-sm"
                      >
                        <span className="text-osrs-gold text-xs font-bold w-6">
                          T{i + 1}
                        </span>
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
                    Recommended Masteries
                  </h3>
                  <div className="space-y-2">
                    {strategy.masteries.map((mastery) => (
                      <div
                        key={mastery}
                        className="flex items-center gap-2 text-sm"
                      >
                        <span className="text-demon-ember">&#x2694;</span>
                        <span className="text-osrs-text">{mastery}</span>
                      </div>
                    ))}
                  </div>
                  <h3
                    className="font-bold text-osrs-blue mt-4 mb-3"
                    style={{ fontFamily: "var(--font-runescape)" }}
                  >
                    Region Unlocks (3 of 9)
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
                    Misthalin + Karamja always available. Regions unlock at
                    90/200/400 tasks.
                  </p>
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

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <PhaseCard
                  title="Early Game"
                  subtitle="Tiers 1-2"
                  color="text-osrs-green"
                  steps={strategy.earlyGame}
                />
                <PhaseCard
                  title="Mid Game"
                  subtitle="Tiers 3-5"
                  color="text-osrs-gold"
                  steps={strategy.midGame}
                />
                <PhaseCard
                  title="Late Game"
                  subtitle="Tiers 6-8"
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
          Region Tier List
        </h2>
        <p className="text-sm text-osrs-text-dim mb-6">
          You choose 3 of 9 regions (unlocked at 90/200/400 tasks completed).
          Misthalin + Karamja are always available.
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
                        : region.tier === "C"
                          ? "default"
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
