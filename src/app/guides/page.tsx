"use client";

import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import Link from "next/link";

const guideCategories = [
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
        status: "live",
      },
      {
        title: "Build Planner",
        description: "Interactive tool to plan your relic and pact choices with synergy analysis.",
        href: "/leagues/demonic-pacts/planner",
        badge: "Interactive",
        badgeVariant: "gold" as const,
        status: "live",
      },
      {
        title: "Raging Echoes League",
        description: "Complete guide to the Raging Echoes League — echo bosses, 8 relic tiers, and combat masteries.",
        href: "/leagues/raging-echoes",
        badge: "Previous",
        badgeVariant: "purple" as const,
        status: "live",
      },
      {
        title: "Raging Echoes Planner",
        description: "Plan your relic choices across all 8 tiers for the Raging Echoes League.",
        href: "/leagues/raging-echoes/planner",
        badge: "Interactive",
        badgeVariant: "gold" as const,
        status: "live",
      },
    ],
  },
  {
    title: "Account Type Guides",
    icon: "⚔️",
    guides: [
      {
        title: "Main Account Progression",
        description: "Optimal progression guide for main accounts. Efficient training methods, money making, and boss progression.",
        href: "#",
        badge: "Coming Soon",
        badgeVariant: "blue" as const,
        status: "upcoming",
      },
      {
        title: "Ironman Guide",
        description: "Self-sufficient ironman progression from Tutorial Island to end-game bossing.",
        href: "#",
        badge: "Coming Soon",
        badgeVariant: "blue" as const,
        status: "upcoming",
      },
      {
        title: "Hardcore Ironman",
        description: "Safe progression routes for HCIM. Know what's dangerous and what's safe at every stage.",
        href: "#",
        badge: "Coming Soon",
        badgeVariant: "purple" as const,
        status: "upcoming",
      },
      {
        title: "Ultimate Ironman",
        description: "Inventory management, storage solutions, and progression for the ultimate challenge.",
        href: "#",
        badge: "Coming Soon",
        badgeVariant: "purple" as const,
        status: "upcoming",
      },
      {
        title: "Group Ironman",
        description: "Team coordination strategies, task splitting, and shared progression guides.",
        href: "#",
        badge: "Coming Soon",
        badgeVariant: "blue" as const,
        status: "upcoming",
      },
    ],
  },
  {
    title: "PvM Guides",
    icon: "🗡️",
    guides: [
      {
        title: "Boss Progression",
        description: "Recommended boss order from early game to end-game. Gear requirements and strategy for each boss.",
        href: "#",
        badge: "Coming Soon",
        badgeVariant: "red" as const,
        status: "upcoming",
      },
      {
        title: "Raids Guide",
        description: "Chambers of Xeric, Theatre of Blood, and Tombs of Amascut guides with role breakdowns.",
        href: "#",
        badge: "Coming Soon",
        badgeVariant: "red" as const,
        status: "upcoming",
      },
    ],
  },
  {
    title: "Skilling Guides",
    icon: "📊",
    guides: [
      {
        title: "Efficient Skilling",
        description: "Fastest training methods for each skill with cost analysis and alternatives.",
        href: "#",
        badge: "Coming Soon",
        badgeVariant: "green" as const,
        status: "upcoming",
      },
      {
        title: "Money Making",
        description: "Best money making methods at every stage of the game, sorted by requirements and GP/hr.",
        href: "#",
        badge: "Coming Soon",
        badgeVariant: "gold" as const,
        status: "upcoming",
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
              {category.guides.map((guide) => {
                const content = (
                  <Card
                    hover={guide.status === "live"}
                    className={`h-full ${guide.status === "upcoming" ? "opacity-60" : ""}`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-bold text-osrs-text">{guide.title}</h3>
                      <Badge variant={guide.badgeVariant}>{guide.badge}</Badge>
                    </div>
                    <p className="text-sm text-osrs-text-dim">{guide.description}</p>
                  </Card>
                );
                return guide.status === "live" ? (
                  <Link key={guide.title} href={guide.href}>{content}</Link>
                ) : (
                  <div key={guide.title} className="cursor-not-allowed">{content}</div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
