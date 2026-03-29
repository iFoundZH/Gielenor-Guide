"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Tabs } from "@/components/ui/Tabs";
import Link from "next/link";
import { questGuides } from "@/data/guides/quests";

export default function QuestGuidePage() {
  const [search, setSearch] = useState("");
  const [expandedQuest, setExpandedQuest] = useState<number | null>(null);

  const mainGuide = questGuides.find((g) => g.variant === "main");
  const ironmanGuide = questGuides.find((g) => g.variant === "ironman");

  const tabs = [
    ...(mainGuide ? [{ id: "main", label: "Main Account", count: mainGuide.entries.length }] : []),
    ...(ironmanGuide ? [{ id: "ironman", label: "Ironman", count: ironmanGuide.entries.length }] : []),
  ];

  if (tabs.length === 0) {
    tabs.push({ id: "main", label: "Main Account", count: 0 });
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex items-center gap-2 mb-3 text-sm text-osrs-text-dim">
        <Link href="/" className="hover:text-osrs-gold">Home</Link>
        <span>/</span>
        <Link href="/guides" className="hover:text-osrs-gold">Guides</Link>
        <span>/</span>
        <span className="text-osrs-gold">Optimal Quest Order</span>
      </div>

      <h1
        className="text-3xl font-bold text-osrs-gold text-glow-gold mb-2"
        style={{ fontFamily: "var(--font-runescape)" }}
      >
        Optimal Quest Order
      </h1>
      <p className="text-osrs-text-dim mb-6">
        The most efficient quest order for maximum rewards with minimum requirements.
        Data sourced from the OSRS Wiki.
      </p>

      <Card className="mb-6">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search quests..."
          className="w-full bg-osrs-darker border border-osrs-border rounded-lg px-3 py-2 text-sm text-osrs-text focus:border-osrs-gold focus:outline-none"
        />
      </Card>

      <Tabs tabs={tabs} defaultTab="main">
        {(activeTab) => {
          const guide = activeTab === "ironman" ? ironmanGuide : mainGuide;
          if (!guide) return <p className="text-osrs-text-dim">No data for this variant.</p>;

          const filtered = search
            ? guide.entries.filter((e) => e.name.toLowerCase().includes(search.toLowerCase()))
            : guide.entries;

          return (
            <div>
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-osrs-text-dim">
                  {filtered.length} quests
                  {guide.entries.length > 0 && ` | Total QP: ${guide.entries[guide.entries.length - 1]?.cumulativeQP || 0}`}
                </p>
                <a
                  href={guide.wikiUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-osrs-gold hover:underline"
                >
                  Full guide on Wiki
                </a>
              </div>

              <div className="space-y-1">
                {filtered.map((entry) => (
                  <div key={entry.order}>
                    <div
                      className="flex items-center gap-3 p-3 rounded-lg border border-osrs-border hover:border-osrs-gold/50 bg-osrs-panel cursor-pointer transition-all"
                      onClick={() => setExpandedQuest(expandedQuest === entry.order ? null : entry.order)}
                    >
                      <span className="text-xs text-osrs-text-dim w-8 text-right font-mono">
                        #{entry.order}
                      </span>
                      <span className="flex-1 font-medium text-sm text-osrs-text">{entry.name}</span>
                      {entry.questPoints > 0 && (
                        <Badge variant="gold">{entry.questPoints} QP</Badge>
                      )}
                      <span className="text-xs text-osrs-text-dim">
                        Total: {entry.cumulativeQP}
                      </span>
                    </div>
                    {expandedQuest === entry.order && (
                      <div className="ml-11 p-3 bg-osrs-darker rounded-b-lg border-x border-b border-osrs-border">
                        {entry.xpRewards.length > 0 && (
                          <div className="mb-2">
                            <span className="text-xs text-osrs-text-dim">XP Rewards: </span>
                            <span className="text-xs text-osrs-text">
                              {entry.xpRewards.map((r) => `${r.skill} ${r.xp.toLocaleString()}`).join(", ")}
                            </span>
                          </div>
                        )}
                        {entry.notes && (
                          <p className="text-xs text-osrs-text-dim">{entry.notes}</p>
                        )}
                        {!entry.xpRewards.length && !entry.notes && (
                          <p className="text-xs text-osrs-text-dim">No additional details available.</p>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        }}
      </Tabs>
    </div>
  );
}
