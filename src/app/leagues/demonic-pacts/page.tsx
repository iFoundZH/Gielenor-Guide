"use client";

import { demonicPactsLeague } from "@/data/demonic-pacts";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Tabs } from "@/components/ui/Tabs";
import { RelicTierDisplay } from "@/components/league/RelicTierDisplay";
import { PactCard } from "@/components/league/PactCard";
import { RewardTierDisplay } from "@/components/league/RewardTierDisplay";
import { RegionPicker } from "@/components/league/RegionPicker";
import Link from "next/link";

export default function DemonicPactsOverview() {
  const league = demonicPactsLeague;

  const allRelics = league.relicTiers.flatMap((t) => t.relics);
  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "regions", label: "Regions", count: league.regions.filter((r) => r.type !== "inaccessible").length },
    { id: "relics", label: "Relics", count: allRelics.length },
    { id: "pacts", label: "Pacts", count: league.pacts.length },
    { id: "rewards", label: "Rewards", count: league.rewardTiers.length },
    { id: "mechanics", label: "Mechanics" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      {/* Page Header */}
      <div className="mb-10">
        <div className="flex items-center gap-2 mb-3 text-sm text-osrs-text-dim">
          <Link href="/" className="hover:text-osrs-gold">Home</Link>
          <span>/</span>
          <Link href="/leagues/demonic-pacts" className="hover:text-osrs-gold">Leagues</Link>
          <span>/</span>
          <span className="text-osrs-gold">Demonic Pacts</span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1
                className="text-3xl sm:text-4xl font-bold text-osrs-gold text-glow-gold"
                style={{ fontFamily: "var(--font-runescape)" }}
              >
                {league.name}
              </h1>
              <Badge variant="red">League #{league.leagueNumber}</Badge>
            </div>
            <p className="text-osrs-text-dim mt-1">{league.startDate} — {league.endDate}</p>
          </div>
          <div className="flex gap-2 sm:ml-auto">
            <Link
              href="/leagues/demonic-pacts/planner"
              className="px-4 py-2 bg-gradient-to-r from-demon-glow to-demon-ember text-white rounded-lg text-sm font-bold hover:shadow-lg transition-all"
            >
              Open Planner
            </Link>
            <Link
              href="/leagues/demonic-pacts/tasks"
              className="px-4 py-2 border border-osrs-gold text-osrs-gold rounded-lg text-sm font-bold hover:bg-osrs-gold/10 transition-all"
            >
              Track Tasks
            </Link>
            <Link
              href="/leagues/raging-echoes"
              className="px-4 py-2 border border-osrs-border text-osrs-text-dim rounded-lg text-sm hover:border-osrs-gold hover:text-osrs-gold transition-all"
            >
              Previous League →
            </Link>
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
                  <h2 className="text-xl font-bold text-osrs-gold mb-4" style={{ fontFamily: "var(--font-runescape)" }}>
                    About the League
                  </h2>
                  <p className="text-osrs-text-dim leading-relaxed mb-6">{league.description}</p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <OverviewStat label="Relic Tiers" value={league.relicTiers.length.toString()} />
                    <OverviewStat label="Named Relics" value={allRelics.length.toString()} />
                    <OverviewStat label="Tasks" value={league.tasks.length.toString()} />
                    <OverviewStat label="Regions" value={`${league.maxRegions} + 2`} />
                  </div>
                </Card>

                <Card>
                  <h2 className="text-xl font-bold text-osrs-gold mb-4" style={{ fontFamily: "var(--font-runescape)" }}>
                    How It Works
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <MechanicCard icon="🗺️" title="Regions" description={`Start in Varlamore, Karamja auto-unlocks. Choose ${league.maxRegions} more from 8 options. Misthalin is completely inaccessible.`} />
                    <MechanicCard icon="⚡" title="Relics" description={`8 tiers of relics with passive XP scaling (5x → 16x) and named relic choices that define your playstyle.`} />
                    <MechanicCard icon="🔥" title="Pacts" description="Combat-focused demonic pacts return with less linear progression. Stack bonuses at a cost." />
                    <MechanicCard icon="📋" title="Tasks" description="Complete tasks across all skills and regions for League Points and to unlock higher relic tiers." />
                  </div>
                </Card>

                <Card>
                  <h2 className="text-xl font-bold text-osrs-gold mb-4" style={{ fontFamily: "var(--font-runescape)" }}>
                    XP & Drop Rate Scaling
                  </h2>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-osrs-border">
                          <th className="text-left py-2 text-osrs-text-dim">Tier</th>
                          <th className="text-right py-2 text-osrs-text-dim">XP Rate</th>
                          <th className="text-right py-2 text-osrs-text-dim">Drop Rate</th>
                          <th className="text-right py-2 text-osrs-text-dim">Minigame Pts</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-osrs-border/50">
                          <td className="py-2">Tier 1 (Start)</td>
                          <td className="text-right py-2 text-osrs-gold font-bold">5x</td>
                          <td className="text-right py-2 text-osrs-gold font-bold">2x</td>
                          <td className="text-right py-2 text-osrs-gold font-bold">4x</td>
                        </tr>
                        <tr className="border-b border-osrs-border/50">
                          <td className="py-2">Tier 2</td>
                          <td className="text-right py-2 text-osrs-gold font-bold">8x</td>
                          <td className="text-right py-2">2x</td>
                          <td className="text-right py-2">4x</td>
                        </tr>
                        <tr className="border-b border-osrs-border/50">
                          <td className="py-2">Tier 3</td>
                          <td className="text-right py-2">8x</td>
                          <td className="text-right py-2">2x</td>
                          <td className="text-right py-2">4x</td>
                        </tr>
                        <tr className="border-b border-osrs-border/50">
                          <td className="py-2">Tier 4</td>
                          <td className="text-right py-2">8x</td>
                          <td className="text-right py-2 text-osrs-gold font-bold">5x</td>
                          <td className="text-right py-2 text-osrs-gold font-bold">8x</td>
                        </tr>
                        <tr className="border-b border-osrs-border/50">
                          <td className="py-2">Tier 5</td>
                          <td className="text-right py-2 text-osrs-gold font-bold">12x</td>
                          <td className="text-right py-2">5x</td>
                          <td className="text-right py-2">8x</td>
                        </tr>
                        <tr className="border-b border-osrs-border/50">
                          <td className="py-2">Tier 7</td>
                          <td className="text-right py-2 text-osrs-gold font-bold">16x</td>
                          <td className="text-right py-2">5x</td>
                          <td className="text-right py-2">8x</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </Card>

                <Card>
                  <h2 className="text-xl font-bold text-osrs-gold mb-4" style={{ fontFamily: "var(--font-runescape)" }}>
                    Point Breakdown by Difficulty
                  </h2>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-osrs-border">
                          <th className="text-left py-2 text-osrs-text-dim">Difficulty</th>
                          <th className="text-right py-2 text-osrs-text-dim">Points Each</th>
                          <th className="text-right py-2 text-osrs-text-dim">Tasks</th>
                          <th className="text-right py-2 text-osrs-text-dim">Total Points</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(["easy", "medium", "hard", "elite", "master"] as const).map((diff) => {
                          const tasks = league.tasks.filter((t) => t.difficulty === diff);
                          const pts = tasks[0]?.points || 0;
                          return (
                            <tr key={diff} className="border-b border-osrs-border/50">
                              <td className="py-2 capitalize">
                                <Badge variant={diff === "easy" ? "green" : diff === "medium" ? "blue" : diff === "hard" ? "gold" : diff === "elite" ? "purple" : "red"}>
                                  {diff}
                                </Badge>
                              </td>
                              <td className="text-right py-2 text-osrs-text">{pts}</td>
                              <td className="text-right py-2 text-osrs-text">{tasks.length}</td>
                              <td className="text-right py-2 text-osrs-gold font-bold">{(tasks.length * pts).toLocaleString()}</td>
                            </tr>
                          );
                        })}
                        <tr className="font-bold">
                          <td className="py-2 text-osrs-text">Total</td>
                          <td className="text-right py-2">—</td>
                          <td className="text-right py-2 text-osrs-text">{league.tasks.length}</td>
                          <td className="text-right py-2 text-osrs-gold">{league.tasks.reduce((sum, t) => sum + t.points, 0).toLocaleString()}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </Card>
              </div>
            )}

            {activeTab === "regions" && (
              <div className="space-y-6">
                <p className="text-osrs-text-dim">
                  Start in Varlamore with Karamja auto-unlocking. Choose up to {league.maxRegions} additional
                  regions. Each region has unique bosses, skills, and tasks. Misthalin is completely
                  inaccessible — a first for OSRS leagues.
                </p>
                <RegionPicker regions={league.regions} maxRegions={league.maxRegions} selectedRegions={[]} />
              </div>
            )}

            {activeTab === "relics" && (
              <div className="space-y-8">
                <p className="text-osrs-text-dim mb-4">
                  8 tiers of relics. Each tier unlocks passive bonuses, and some offer named relic choices
                  that permanently shape your playstyle. XP rates scale from 5x to 16x through passive tiers.
                </p>
                {league.relicTiers.map((rt) => (
                  <RelicTierDisplay key={rt.tier} relicTier={rt} />
                ))}
              </div>
            )}

            {activeTab === "pacts" && (
              <div>
                <p className="text-osrs-text-dim mb-6">
                  Demonic Pacts are combat-focused bonuses from dealing with Yama. They return from previous
                  leagues with a less linear progression system. Full pact details will be revealed closer to launch.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {league.pacts.map((pact) => (
                    <PactCard key={pact.id} pact={pact} />
                  ))}
                </div>
              </div>
            )}

            {activeTab === "rewards" && (
              <RewardTierDisplay tiers={league.rewardTiers} />
            )}

            {activeTab === "mechanics" && (
              <div className="space-y-6">
                <Card>
                  <h3 className="text-lg font-bold text-osrs-gold mb-4" style={{ fontFamily: "var(--font-runescape)" }}>
                    Key Mechanic Changes
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {league.mechanicChanges.map((change, i) => (
                      <div key={i} className="flex items-start gap-2 text-sm">
                        <span className="text-osrs-gold mt-0.5">•</span>
                        <span className="text-osrs-text-dim">{change}</span>
                      </div>
                    ))}
                  </div>
                </Card>

                <Card>
                  <h3 className="text-lg font-bold text-osrs-gold mb-4" style={{ fontFamily: "var(--font-runescape)" }}>
                    Auto-Completed Quests
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {league.autoCompletedQuests.map((quest, i) => (
                      <Badge key={i} variant="blue">{quest}</Badge>
                    ))}
                  </div>
                </Card>
              </div>
            )}
          </>
        )}
      </Tabs>
    </div>
  );
}

function OverviewStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-center bg-osrs-darker/50 rounded-lg p-4">
      <div className="text-2xl font-bold text-osrs-gold">{value}</div>
      <div className="text-xs text-osrs-text-dim mt-1">{label}</div>
    </div>
  );
}

function MechanicCard({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <div className="bg-osrs-darker/50 rounded-lg p-5">
      <span className="text-3xl">{icon}</span>
      <h3 className="text-lg font-bold text-osrs-text mt-2 mb-1">{title}</h3>
      <p className="text-sm text-osrs-text-dim leading-relaxed">{description}</p>
    </div>
  );
}
