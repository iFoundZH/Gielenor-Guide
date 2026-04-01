"use client";

import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import Link from "next/link";

const guideCategories = [
  {
    title: "Main Game Guides",
    icon: "📚",
    guides: [
      {
        title: "Skill Training",
        description: "Training methods for all 24 skills with XP rates, level ranges, and P2P/F2P variants.",
        href: "/guides/skills",
        badge: "24 Skills",
        badgeVariant: "gold" as const,
      },
      {
        title: "Main Account Guide",
        description: "Complete progression guide from Tutorial Island to end-game. Quests, gear, bossing, and money making.",
        href: "/guides/main",
        badge: "Progression",
        badgeVariant: "gold" as const,
      },
      {
        title: "Ironman Guides",
        description: "Comprehensive guides for Standard, Hardcore, Ultimate, and Group Ironman accounts.",
        href: "/guides/ironman",
        badge: "4 Variants",
        badgeVariant: "green" as const,
      },
      {
        title: "Optimal Quest Order",
        description: "Most efficient quest order for main accounts and ironmen. Maximize rewards, minimize requirements.",
        href: "/guides/quests",
        badge: "Quest Order",
        badgeVariant: "blue" as const,
      },
      {
        title: "Achievement Diaries",
        description: "Track completion across all 12 diary areas with requirements and rewards for each tier.",
        href: "/guides/diaries",
        badge: "12 Areas",
        badgeVariant: "purple" as const,
      },
      {
        title: "Combat Achievements",
        description: "Track combat achievement tasks from Easy to Grandmaster. Filter by monster and type.",
        href: "/guides/combat-achievements",
        badge: "6 Tiers",
        badgeVariant: "red" as const,
      },
    ],
  },
  {
    title: "Snowflake Accounts",
    icon: "❄",
    guides: [
      {
        title: "Snowflake Guides",
        description: "Guides for area-locked and restriction accounts. Karamja Only, 1 Def Pure, Skiller, and more.",
        href: "/guides/snowflake",
        badge: "8 Guides",
        badgeVariant: "purple" as const,
      },
      {
        title: "Snowflake Planner",
        description: "Plan area-locked and skill-restricted accounts. See what content is available with your restrictions.",
        href: "/snowflake",
        badge: "Interactive",
        badgeVariant: "blue" as const,
      },
    ],
  },
  {
    title: "League Guides",
    icon: "🏆",
    guides: [
      {
        title: "Demonic Pacts League",
        description: "Complete guide to the Demonic Pacts League including relics, pacts, tasks, and strategies.",
        href: "/leagues/demonic-pacts",
        badge: "Current",
        badgeVariant: "red" as const,
      },
      {
        title: "Build Planner",
        description: "Interactive tool to plan your relic and pact choices with synergy analysis.",
        href: "/leagues/demonic-pacts/planner",
        badge: "Interactive",
        badgeVariant: "gold" as const,
      },
      {
        title: "Strategy Guide",
        description: "Optimized strategies for Speedrunner, PvM, and Completionist playstyles.",
        href: "/leagues/demonic-pacts/guide",
        badge: "Strategies",
        badgeVariant: "blue" as const,
      },
      {
        title: "Task Tracker",
        description: "Track your task completion, filter by difficulty and category, and monitor reward progress.",
        href: "/leagues/demonic-pacts/tasks",
        badge: "Track Progress",
        badgeVariant: "green" as const,
      },
      {
        title: "Raging Echoes League",
        description: "Complete guide to the Raging Echoes League — echo bosses, 8 relic tiers, and combat masteries.",
        href: "/leagues/raging-echoes",
        badge: "Previous",
        badgeVariant: "purple" as const,
      },
      {
        title: "Raging Echoes Planner",
        description: "Plan your relic choices across all 8 tiers for the Raging Echoes League.",
        href: "/leagues/raging-echoes/planner",
        badge: "Interactive",
        badgeVariant: "gold" as const,
      },
    ],
  },
];

export default function GuidesPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex items-center gap-2 mb-3 text-sm text-osrs-text-dim">
        <Link href="/" className="hover:text-osrs-gold">Home</Link>
        <span>/</span>
        <span className="text-osrs-gold">Guides</span>
      </div>

      <h1
        className="text-3xl font-bold text-osrs-gold text-glow-gold mb-2"
        style={{ fontFamily: "var(--font-runescape)" }}
      >
        All Guides
      </h1>
      <p className="text-osrs-text-dim mb-10">
        Comprehensive guides for every aspect of Old School RuneScape.
        All data synced with the OSRS Wiki and kept up to date.
      </p>

      <div className="space-y-12">
        {guideCategories.map((category) => (
          <div key={category.title}>
            <h2
              className="text-xl font-bold text-osrs-text mb-4 flex items-center gap-2"
              style={{ fontFamily: "var(--font-runescape)" }}
            >
              <span>{category.icon}</span>
              {category.title}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {category.guides.map((guide) => (
                <Link key={guide.title} href={guide.href}>
                  <Card hover className="h-full">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-bold text-osrs-text">{guide.title}</h3>
                      <Badge variant={guide.badgeVariant}>{guide.badge}</Badge>
                    </div>
                    <p className="text-sm text-osrs-text-dim">{guide.description}</p>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
