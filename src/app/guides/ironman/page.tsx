"use client";

import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import Link from "next/link";

const variants = [
  {
    id: "standard",
    name: "Ironman",
    description: "Self-sufficient gameplay — no trading, no Grand Exchange. The classic iron experience.",
    badge: "Standard",
    badgeVariant: "gold" as const,
  },
  {
    id: "hardcore",
    name: "Hardcore Ironman",
    description: "One life. All ironman restrictions plus permadeath — death reverts you to a standard ironman.",
    badge: "HCIM",
    badgeVariant: "red" as const,
  },
  {
    id: "ultimate",
    name: "Ultimate Ironman",
    description: "No bank access. Everything you own must be carried or stored creatively. The ultimate challenge.",
    badge: "UIM",
    badgeVariant: "purple" as const,
  },
  {
    id: "group",
    name: "Group Ironman",
    description: "Play with up to 5 friends under ironman rules. Shared storage and group prestige system.",
    badge: "GIM",
    badgeVariant: "green" as const,
  },
];

export default function IronmanGuidesIndex() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex items-center gap-2 mb-3 text-sm text-osrs-text-dim">
        <Link href="/" className="hover:text-osrs-gold">Home</Link>
        <span>/</span>
        <Link href="/guides" className="hover:text-osrs-gold">Guides</Link>
        <span>/</span>
        <span className="text-osrs-gold">Ironman Guides</span>
      </div>

      <h1
        className="text-3xl font-bold text-osrs-gold text-glow-gold mb-2"
        style={{ fontFamily: "var(--font-runescape)" }}
      >
        Ironman Guides
      </h1>
      <p className="text-osrs-text-dim mb-10">
        Comprehensive guides for all ironman account types, sourced from the OSRS Wiki.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {variants.map((v) => (
          <Link key={v.id} href={`/guides/ironman/${v.id}`}>
            <Card hover className="h-full">
              <div className="flex items-center gap-2 mb-2">
                <h2 className="text-lg font-bold text-osrs-text">{v.name}</h2>
                <Badge variant={v.badgeVariant}>{v.badge}</Badge>
              </div>
              <p className="text-sm text-osrs-text-dim">{v.description}</p>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
