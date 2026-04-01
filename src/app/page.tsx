import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { demonicPactsLeague } from "@/data/demonic-pacts";

function getLeagueStatus(startDate: string, endDate: string): { label: string; variant: "red" | "green" | "gold" } {
  const now = new Date();
  const start = new Date(startDate);
  const end = new Date(endDate);
  if (now < start) return { label: `${demonicPactsLeague.name} — Coming Soon`, variant: "red" };
  if (now <= end) return { label: `${demonicPactsLeague.name} — Live Now`, variant: "green" };
  return { label: `${demonicPactsLeague.name} — Ended`, variant: "gold" };
}

export default function HomePage() {
  const league = demonicPactsLeague;
  const totalTasks = league.tasks.length;
  const totalRelics = league.relicTiers.flatMap((t) => t.relics).length;
  const totalPacts = league.pacts.length;
  const leagueStatus = getLeagueStatus(league.startDate, league.endDate);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-demon-dark via-osrs-dark to-osrs-dark" />
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-1/4 w-96 h-96 bg-demon-glow/20 rounded-full blur-3xl ember-glow" />
          <div className="absolute top-40 right-1/4 w-64 h-64 bg-demon-ember/20 rounded-full blur-3xl ember-glow" style={{ animationDelay: "1s" }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-20 sm:py-32">
          <div className="text-center max-w-3xl mx-auto">
            <Badge variant={leagueStatus.variant} size="md">{leagueStatus.label}</Badge>
            <h1
              className="mt-6 text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight"
              style={{ fontFamily: "var(--font-runescape)" }}
            >
              <span className="text-osrs-text">Your </span>
              <span className="fire-text">Ultimate</span>
              <br />
              <span className="text-osrs-gold text-glow-gold">OSRS Companion</span>
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-osrs-text-dim max-w-2xl mx-auto leading-relaxed">
              Interactive build planners, real-time wiki-synced guides, and task
              trackers for leagues, special events, and every account type.
              Plan your adventure before it begins.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/leagues/demonic-pacts/planner"
                className="inline-flex items-center justify-center px-8 py-3.5 rounded-xl bg-gradient-to-r from-demon-glow to-demon-ember text-white font-bold text-lg shadow-lg shadow-demon-glow/25 hover:shadow-demon-glow/40 transition-all hover:scale-105"
              >
                Open Build Planner
                <svg className="ml-2 w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <Link
                href="/leagues/demonic-pacts"
                className="inline-flex items-center justify-center px-8 py-3.5 rounded-xl border-2 border-osrs-gold text-osrs-gold font-bold text-lg hover:bg-osrs-gold/10 transition-all"
              >
                League Overview
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* What is a League? */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 -mt-4 mb-4 relative z-10">
        <div className="text-center text-sm text-osrs-text-dim max-w-2xl mx-auto">
          <span className="text-osrs-gold font-bold">New to Leagues?</span> Leagues are temporary OSRS game modes with boosted XP, unique abilities called Relics, and exclusive cosmetic rewards.
          Pick regions, choose powerful relics, and complete tasks to earn points. Plan your strategy here before launch day.
        </div>
      </section>

      {/* Featured League Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 -mt-0 relative z-10">
        <Card glow="red" className="bg-parchment">
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-demon-glow to-demon-ember flex items-center justify-center text-2xl">
                  🔥
                </div>
                <div>
                  <h2
                    className="text-2xl font-bold text-osrs-gold"
                    style={{ fontFamily: "var(--font-runescape)" }}
                  >
                    {league.name}
                  </h2>
                  <p className="text-xs text-osrs-text-dim">
                    {league.startDate} — {league.endDate}
                  </p>
                </div>
              </div>
              <p className="text-osrs-text-dim leading-relaxed">
                {league.description}
              </p>
            </div>

            <div className="grid grid-cols-3 gap-4 lg:w-80">
              <StatBox label="Relics" value={totalRelics} />
              <StatBox label="Pacts" value={totalPacts} />
              <StatBox label="Tasks" value={totalTasks} />
            </div>
          </div>
        </Card>
      </section>

      {/* Quick Links Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <h2
          className="text-3xl font-bold text-osrs-gold mb-8 text-center"
          style={{ fontFamily: "var(--font-runescape)" }}
        >
          Get Started
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <FeatureCard
            href="/leagues/demonic-pacts/planner"
            icon="⚔️"
            title="Build Planner"
            description="Plan your relic and pact choices. Compare synergies, calculate power levels, and share your build with friends."
            badge="Interactive"
            badgeVariant="gold"
          />
          <FeatureCard
            href="/leagues/demonic-pacts/tasks"
            icon="📋"
            title="Task Tracker"
            description="Track your task completion across all difficulty tiers. Filter by skill, category, and calculate your league points."
            badge="Track Progress"
            badgeVariant="green"
          />
          <FeatureCard
            href="/leagues/demonic-pacts/guide"
            icon="📖"
            title="Strategy Guide"
            description="Optimal strategies for different playstyles — speedrunning, completionist, PvM focused, and skilling routes."
            badge="Wiki-Synced"
            badgeVariant="blue"
          />
          <FeatureCard
            href="/leagues/demonic-pacts"
            icon="🔥"
            title="Pacts Browser"
            description="Explore all Demonic Pacts with their bonuses, penalties, and synergies with relics. Know the cost before you sign."
            badge="Demonic"
            badgeVariant="red"
          />
          <FeatureCard
            href="/leagues/demonic-pacts"
            icon="🏆"
            title="League Overview"
            description="Everything about the Demonic Pacts League — regions, relics, pacts, rewards, and mechanic changes."
            badge="Reference"
            badgeVariant="purple"
          />
          <FeatureCard
            href="/guides/skills"
            icon="📚"
            title="Skill Guides"
            description="Training methods for all 24 skills with XP rates. P2P and F2P variants sourced from the OSRS Wiki."
            badge="24 Skills"
            badgeVariant="blue"
          />
          <FeatureCard
            href="/guides/diaries"
            icon="📋"
            title="Achievement Diaries"
            description="Track completion across all 12 diary areas. Checklist with requirements and reward summaries."
            badge="12 Areas"
            badgeVariant="purple"
          />
          <FeatureCard
            href="/snowflake"
            icon="❄"
            title="Snowflake Tracker"
            description="Plan area-locked and skill-restricted accounts. See what quests and bosses are available with your restrictions."
            badge="New"
            badgeVariant="blue"
          />
        </div>
      </section>

      {/* Account Types Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-16">
        <Card className="text-center">
          <h2
            className="text-2xl font-bold text-osrs-gold mb-3"
            style={{ fontFamily: "var(--font-runescape)" }}
          >
            Built For Every Account Type
          </h2>
          <p className="text-osrs-text-dim mb-8 max-w-xl mx-auto">
            Whether you&apos;re a main grinding for efficiency, an ironman planning
            self-sufficiency, or a league veteran min-maxing points — we&apos;ve got you.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {["Main", "Ironman", "Hardcore Ironman", "Ultimate Ironman", "Group Ironman"].map((type) => (
              <Badge key={type} variant="gold" size="md">
                {type}
              </Badge>
            ))}
          </div>
        </Card>
      </section>
    </div>
  );
}

function StatBox({ label, value }: { label: string; value: number }) {
  return (
    <div className="text-center bg-osrs-darker/50 rounded-lg p-3">
      <div className="text-2xl font-bold text-osrs-gold">{value}</div>
      <div className="text-xs text-osrs-text-dim">{label}</div>
    </div>
  );
}

function FeatureCard({
  href,
  icon,
  title,
  description,
  badge,
  badgeVariant,
}: {
  href: string;
  icon: string;
  title: string;
  description: string;
  badge: string;
  badgeVariant: "gold" | "red" | "green" | "blue" | "purple";
}) {
  return (
    <Link href={href}>
      <Card hover className="h-full">
        <div className="flex items-start gap-3">
          <span className="text-2xl">{icon}</span>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-bold text-osrs-text">{title}</h3>
              <Badge variant={badgeVariant}>{badge}</Badge>
            </div>
            <p className="text-sm text-osrs-text-dim leading-relaxed">{description}</p>
          </div>
        </div>
      </Card>
    </Link>
  );
}
