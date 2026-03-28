"use client";

import { LeagueData } from "@/types/league";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Tabs } from "@/components/ui/Tabs";
import { RelicTierDisplay } from "@/components/league/RelicTierDisplay";
import { PactCard } from "@/components/league/PactCard";
import { RewardTierDisplay } from "@/components/league/RewardTierDisplay";
import { RegionPicker } from "@/components/league/RegionPicker";
import Link from "next/link";

interface LeagueOverviewProps {
  league: LeagueData;
  basePath: string;
  otherLeaguePath?: string;
  otherLeagueName?: string;
}

export function LeagueOverview({ league, basePath, otherLeaguePath, otherLeagueName }: LeagueOverviewProps) {
  const allRelics = league.relicTiers.flatMap((t) => t.relics);
  const hasRegions = league.regions.length > 1;
  const hasMechanics = league.mechanicChanges.length > 0;

  const tabs = [
    { id: "overview", label: "Overview" },
    ...(hasRegions ? [{ id: "regions", label: "Regions", count: league.regions.filter((r) => r.type !== "inaccessible").length }] : []),
    { id: "relics", label: "Relics", count: allRelics.length },
    ...(league.pacts.length > 0 ? [{ id: "pacts", label: league.id === "demonic-pacts" ? "Pacts" : "Masteries", count: league.pacts.length }] : []),
    { id: "rewards", label: "Rewards", count: league.rewardTiers.length },
    ...(hasMechanics ? [{ id: "mechanics", label: "Mechanics" }] : []),
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      {/* Page Header */}
      <div className="mb-10">
        <div className="flex items-center gap-2 mb-3 text-sm text-osrs-text-dim">
          <Link href="/" className="hover:text-osrs-gold">Home</Link>
          <span>/</span>
          <span className="text-osrs-gold">{league.name}</span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-3xl sm:text-4xl font-bold text-osrs-gold text-glow-gold" style={{ fontFamily: "var(--font-runescape)" }}>
                {league.name}
              </h1>
              <Badge variant="red">League #{league.leagueNumber}</Badge>
            </div>
            <p className="text-osrs-text-dim mt-1">{league.startDate} — {league.endDate}</p>
          </div>
          <div className="flex gap-2 sm:ml-auto flex-wrap">
            <Link href={`${basePath}/planner`} className="px-4 py-2 bg-gradient-to-r from-demon-glow to-demon-ember text-white rounded-lg text-sm font-bold hover:shadow-lg transition-all">
              Open Planner
            </Link>
            <Link href={`${basePath}/tasks`} className="px-4 py-2 border border-osrs-gold text-osrs-gold rounded-lg text-sm font-bold hover:bg-osrs-gold/10 transition-all">
              Track Tasks
            </Link>
            {otherLeaguePath && (
              <Link href={otherLeaguePath} className="px-4 py-2 border border-osrs-border text-osrs-text-dim rounded-lg text-sm hover:border-osrs-gold hover:text-osrs-gold transition-all">
                {otherLeagueName || "Other League"} →
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Wiki Sync Notice */}
      <div className="mb-6 flex items-center gap-2 text-xs text-osrs-text-dim bg-osrs-panel rounded-lg px-4 py-2 border border-osrs-border">
        <span className="w-2 h-2 rounded-full bg-osrs-green" />
        Data synced from OSRS Wiki — Last updated: {league.lastSynced}
        <a href={league.wikiUrl} target="_blank" rel="noopener noreferrer" className="ml-auto text-osrs-gold hover:underline">
          View on Wiki →
        </a>
      </div>

      <Tabs tabs={tabs}>
        {(activeTab) => (
          <>
            {activeTab === "overview" && (
              <div className="space-y-8">
                <Card>
                  <h2 className="text-xl font-bold text-osrs-gold mb-4" style={{ fontFamily: "var(--font-runescape)" }}>About</h2>
                  <p className="text-osrs-text-dim leading-relaxed mb-6">{league.description}</p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <StatBox label="Relic Tiers" value={league.relicTiers.length.toString()} />
                    <StatBox label="Named Relics" value={allRelics.length.toString()} />
                    <StatBox label="Tasks" value={league.tasks.length.toString()} />
                    <StatBox label="Base XP" value={`${league.baseXpMultiplier}x`} />
                  </div>
                </Card>

                <Card>
                  <h2 className="text-xl font-bold text-osrs-gold mb-4" style={{ fontFamily: "var(--font-runescape)" }}>Point Breakdown</h2>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-osrs-border">
                          <th className="text-left py-2 text-osrs-text-dim">Difficulty</th>
                          <th className="text-right py-2 text-osrs-text-dim">Pts Each</th>
                          <th className="text-right py-2 text-osrs-text-dim">Tasks</th>
                          <th className="text-right py-2 text-osrs-text-dim">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(["easy", "medium", "hard", "elite", "master"] as const).map((diff) => {
                          const tasks = league.tasks.filter((t) => t.difficulty === diff);
                          const pts = tasks[0]?.points || 0;
                          return (
                            <tr key={diff} className="border-b border-osrs-border/50">
                              <td className="py-2"><Badge variant={diff === "easy" ? "green" : diff === "medium" ? "blue" : diff === "hard" ? "gold" : diff === "elite" ? "purple" : "red"}>{diff}</Badge></td>
                              <td className="text-right py-2">{pts}</td>
                              <td className="text-right py-2">{tasks.length}</td>
                              <td className="text-right py-2 text-osrs-gold font-bold">{(tasks.length * pts).toLocaleString()}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </Card>
              </div>
            )}

            {activeTab === "regions" && hasRegions && (
              <RegionPicker regions={league.regions} maxRegions={league.maxRegions} selectedRegions={[]} />
            )}

            {activeTab === "relics" && (
              <div className="space-y-8">
                {league.relicTiers.map((rt) => (
                  <RelicTierDisplay key={rt.tier} relicTier={rt} />
                ))}
              </div>
            )}

            {activeTab === "pacts" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {league.pacts.map((pact) => (
                  <PactCard key={pact.id} pact={pact} />
                ))}
              </div>
            )}

            {activeTab === "rewards" && <RewardTierDisplay tiers={league.rewardTiers} />}

            {activeTab === "mechanics" && hasMechanics && (
              <div className="space-y-6">
                <Card>
                  <h3 className="text-lg font-bold text-osrs-gold mb-4" style={{ fontFamily: "var(--font-runescape)" }}>Key Changes</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {league.mechanicChanges.map((change, i) => (
                      <div key={i} className="flex items-start gap-2 text-sm">
                        <span className="text-osrs-gold mt-0.5">•</span>
                        <span className="text-osrs-text-dim">{change}</span>
                      </div>
                    ))}
                  </div>
                </Card>
                {league.autoCompletedQuests.length > 0 && (
                  <Card>
                    <h3 className="text-lg font-bold text-osrs-gold mb-4" style={{ fontFamily: "var(--font-runescape)" }}>Auto-Completed Quests</h3>
                    <div className="flex flex-wrap gap-2">
                      {league.autoCompletedQuests.map((quest, i) => (
                        <Badge key={i} variant="blue">{quest}</Badge>
                      ))}
                    </div>
                  </Card>
                )}
              </div>
            )}
          </>
        )}
      </Tabs>
    </div>
  );
}

function StatBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-center bg-osrs-darker/50 rounded-lg p-4">
      <div className="text-2xl font-bold text-osrs-gold">{value}</div>
      <div className="text-xs text-osrs-text-dim mt-1">{label}</div>
    </div>
  );
}
