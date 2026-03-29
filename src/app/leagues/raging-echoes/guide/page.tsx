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
    relics: ["Animal Wrangler", "Dodgy Deals", "Clue Compass", "Golden God", "Treasure Arbiter", "Total Recall", "Grimoire", "Specialist"],
    masteries: ["Melee Mastery"],
    regions: ["Morytania", "Kourend", "Kandarin"],
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
      "Target remaining elite/master tasks with overpowered combat setup",
    ],
  },
  {
    id: "pvm",
    name: "PvM Destroyer",
    description: "Maximum combat power to dominate every boss in the league.",
    difficulty: "Intermediate",
    relics: ["Power Miner", "Corner Cutter", "Bank Heist", "Reloaded", "Slayer Master", "Banker's Note", "Grimoire", "Guardian"],
    masteries: ["Melee Mastery", "Ranged Mastery"],
    regions: ["Morytania", "Kourend", "Asgarnia"],
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
    relics: ["Lumberjack", "Friendly Forager", "Fairy's Flight", "Equilibrium", "Production Master", "Total Recall", "Overgrown", "Last Stand"],
    masteries: ["Melee Mastery", "Ranged Mastery", "Magic Mastery"],
    regions: ["Morytania", "Kourend", "Kandarin"],
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

  const matchedRegionIds = strategy.regions
    .map((name) => league.regions.find((r) => r.name.toLowerCase() === name.toLowerCase())?.id)
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
      <p className="text-osrs-text-dim mb-8">Optimized strategies for every playstyle. 8 relic tiers, 3 region unlocks (Misthalin + Karamja start).</p>

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
                  <h3 className="font-bold text-osrs-blue mt-4 mb-3" style={{ fontFamily: "var(--font-runescape)" }}>
                    Region Unlocks (3 of 9)
                  </h3>
                  <div className="space-y-2">
                    {strategy.regions.map((region) => (
                      <div key={region} className="flex items-center gap-2 text-sm">
                        <span className="text-osrs-blue">&#x25C6;</span>
                        <span className="text-osrs-text">{region}</span>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-osrs-text-dim mt-2">Misthalin + Karamja always available. Regions unlock at 90/200/400 tasks.</p>
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
