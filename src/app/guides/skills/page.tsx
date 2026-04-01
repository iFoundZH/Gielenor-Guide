"use client";

import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import Link from "next/link";

const ALL_SKILLS = [
  "Attack", "Strength", "Defence", "Ranged", "Prayer", "Magic",
  "Runecraft", "Hitpoints", "Crafting", "Mining", "Smithing",
  "Fishing", "Cooking", "Firemaking", "Woodcutting", "Agility",
  "Herblore", "Thieving", "Fletching", "Slayer", "Farming",
  "Construction", "Hunter", "Sailing",
];

const SKILL_CATEGORIES: Record<string, string[]> = {
  Combat: ["Attack", "Strength", "Defence", "Ranged", "Prayer", "Magic", "Hitpoints"],
  Gathering: ["Mining", "Fishing", "Woodcutting", "Farming", "Hunter", "Sailing"],
  Artisan: ["Smithing", "Cooking", "Crafting", "Fletching", "Herblore", "Construction", "Firemaking", "Runecraft"],
  Support: ["Agility", "Thieving", "Slayer"],
};

export default function SkillGuidesIndex() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex items-center gap-2 mb-3 text-sm text-osrs-text-dim">
        <Link href="/" className="hover:text-osrs-gold">Home</Link>
        <span>/</span>
        <Link href="/guides" className="hover:text-osrs-gold">Guides</Link>
        <span>/</span>
        <span className="text-osrs-gold">Skill Training</span>
      </div>

      <h1
        className="text-3xl font-bold text-osrs-gold text-glow-gold mb-2"
        style={{ fontFamily: "var(--font-runescape)" }}
      >
        Skill Training Guides
      </h1>
      <p className="text-osrs-text-dim mb-10">
        Training methods for all 24 skills, sourced from the OSRS Wiki.
        Each guide includes P2P and F2P methods with XP rates and level ranges.
      </p>

      <div className="space-y-10">
        {Object.entries(SKILL_CATEGORIES).map(([category, skills]) => (
          <div key={category}>
            <h2
              className="text-xl font-bold text-osrs-text mb-4"
              style={{ fontFamily: "var(--font-runescape)" }}
            >
              {category} Skills
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {skills.map((skill) => (
                <Link key={skill} href={`/guides/skills/${skill.toLowerCase()}`}>
                  <Card hover className="text-center h-full">
                    <div className="text-lg font-bold text-osrs-gold mb-1">{skill}</div>
                    <Badge variant="gold">Guide</Badge>
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
