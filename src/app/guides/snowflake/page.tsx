"use client";

import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import Link from "next/link";
import { snowflakeGuides } from "@/data/guides/snowflake";

export default function SnowflakeGuidesPage() {
  const areaLocked = snowflakeGuides.filter((g) => g.category === "area-locked");
  const restrictions = snowflakeGuides.filter((g) => g.category === "restriction");

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex items-center gap-2 mb-3 text-sm text-osrs-text-dim">
        <Link href="/" className="hover:text-osrs-gold">Home</Link>
        <span>/</span>
        <Link href="/guides" className="hover:text-osrs-gold">Guides</Link>
        <span>/</span>
        <span className="text-osrs-gold">Snowflake Guides</span>
      </div>

      <h1
        className="text-3xl font-bold text-osrs-gold text-glow-gold mb-2"
        style={{ fontFamily: "var(--font-runescape)" }}
      >
        Snowflake Account Guides
      </h1>
      <p className="text-osrs-text-dim mb-4">
        Guides for area-locked and restriction-based accounts. Each covers available content, progression paths, and tips.
      </p>
      <div className="mb-10">
        <Link
          href="/snowflake"
          className="inline-flex items-center gap-2 text-sm text-osrs-gold hover:underline"
        >
          Looking for the interactive Snowflake Planner? Click here →
        </Link>
      </div>

      <div className="space-y-12">
        <div>
          <h2
            className="text-xl font-bold text-osrs-text mb-4"
            style={{ fontFamily: "var(--font-runescape)" }}
          >
            Area-Locked Accounts
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {areaLocked.map((guide) => (
              <Link key={guide.id} href={`/guides/snowflake/${guide.id}`}>
                <Card hover className="h-full">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-bold text-osrs-text">{guide.name}</h3>
                    <Badge variant="blue">Area</Badge>
                  </div>
                  <p className="text-sm text-osrs-text-dim">{guide.description}</p>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h2
            className="text-xl font-bold text-osrs-text mb-4"
            style={{ fontFamily: "var(--font-runescape)" }}
          >
            Restriction Accounts
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {restrictions.map((guide) => (
              <Link key={guide.id} href={`/guides/snowflake/${guide.id}`}>
                <Card hover className="h-full">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-bold text-osrs-text">{guide.name}</h3>
                    <Badge variant="purple">Restriction</Badge>
                  </div>
                  <p className="text-sm text-osrs-text-dim">{guide.description}</p>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
