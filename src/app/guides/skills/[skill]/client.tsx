"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Tabs } from "@/components/ui/Tabs";
import Link from "next/link";
import { skillTrainingGuides } from "@/data/guides/skills";

type SortKey = "level" | "xp";

export function SkillGuideClient({ skill }: { skill: string }) {
  const skillSlug = skill.toLowerCase();
  const skillName = skillSlug.charAt(0).toUpperCase() + skillSlug.slice(1);

  const [sortKey, setSortKey] = useState<SortKey>("level");
  const [sortAsc, setSortAsc] = useState(true);

  const p2pGuide = skillTrainingGuides.find(
    (g) => g.skill.toLowerCase() === skillSlug && g.variant === "p2p",
  );
  const f2pGuide = skillTrainingGuides.find(
    (g) => g.skill.toLowerCase() === skillSlug && g.variant === "f2p",
  );

  const tabs = [
    { id: "p2p", label: "Pay-to-Play", count: p2pGuide?.methods.length ?? 0 },
    ...(f2pGuide ? [{ id: "f2p", label: "Free-to-Play", count: f2pGuide.methods.length }] : []),
  ];

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortAsc(!sortAsc);
    } else {
      setSortKey(key);
      setSortAsc(true);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex items-center gap-2 mb-3 text-sm text-osrs-text-dim">
        <Link href="/" className="hover:text-osrs-gold">Home</Link>
        <span>/</span>
        <Link href="/guides" className="hover:text-osrs-gold">Guides</Link>
        <span>/</span>
        <Link href="/guides/skills" className="hover:text-osrs-gold">Skills</Link>
        <span>/</span>
        <span className="text-osrs-gold">{skillName}</span>
      </div>

      <h1
        className="text-3xl font-bold text-osrs-gold text-glow-gold mb-2"
        style={{ fontFamily: "var(--font-runescape)" }}
      >
        {skillName} Training Guide
      </h1>

      {!p2pGuide && !f2pGuide ? (
        <Card className="mt-8 text-center py-8">
          <p className="text-osrs-text-dim mb-4">
            No training guide data available for {skillName} yet.
          </p>
          <a
            href={`https://oldschool.runescape.wiki/w/${skillName}_training`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-osrs-gold hover:underline"
          >
            View on OSRS Wiki
          </a>
        </Card>
      ) : (
        <Tabs tabs={tabs} defaultTab="p2p">
          {(activeTab) => {
            const guide = activeTab === "f2p" ? f2pGuide : p2pGuide;
            if (!guide) return <p className="text-osrs-text-dim">No data for this variant.</p>;

            const sorted = [...guide.methods].sort((a, b) => {
              if (sortKey === "level") {
                return sortAsc
                  ? a.levelRange[0] - b.levelRange[0]
                  : b.levelRange[0] - a.levelRange[0];
              }
              const aXp = a.xpPerHour ?? 0;
              const bXp = b.xpPerHour ?? 0;
              return sortAsc ? aXp - bXp : bXp - aXp;
            });

            return (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm text-osrs-text-dim">{sorted.length} training methods</p>
                  <a
                    href={guide.wikiUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-osrs-gold hover:underline"
                  >
                    Full article on Wiki
                  </a>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-osrs-border text-osrs-text-dim">
                        <th
                          className="text-left py-2 px-3 cursor-pointer hover:text-osrs-gold"
                          onClick={() => handleSort("level")}
                        >
                          Level Range {sortKey === "level" ? (sortAsc ? "^" : "v") : ""}
                        </th>
                        <th className="text-left py-2 px-3">Method</th>
                        <th
                          className="text-right py-2 px-3 cursor-pointer hover:text-osrs-gold"
                          onClick={() => handleSort("xp")}
                        >
                          XP/hr {sortKey === "xp" ? (sortAsc ? "^" : "v") : ""}
                        </th>
                        <th className="text-left py-2 px-3 hidden md:table-cell">Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sorted.map((method, i) => (
                        <tr key={i} className="border-b border-osrs-border/50 hover:bg-osrs-panel-hover">
                          <td className="py-2 px-3 text-osrs-gold font-medium whitespace-nowrap">
                            {method.levelRange[0]}–{method.levelRange[1]}
                          </td>
                          <td className="py-2 px-3 text-osrs-text font-medium">
                            {method.name}
                          </td>
                          <td className="py-2 px-3 text-right text-osrs-text-dim">
                            {method.xpPerHour ? method.xpPerHour.toLocaleString() : "—"}
                          </td>
                          <td className="py-2 px-3 text-osrs-text-dim text-xs hidden md:table-cell">
                            {method.description}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          }}
        </Tabs>
      )}
    </div>
  );
}
