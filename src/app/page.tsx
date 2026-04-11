import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { BOSS_PRESETS } from "@/data/boss-presets";

const FEATURED_BOSSES = [
  "graardor", "zilyana", "kreearra", "kril", "nex",
  "duke", "leviathan", "whisperer", "vardorvis",
  "vorkath", "zulrah", "hydra",
];

const FEATURES = [
  { title: "Gear Optimizer", desc: "Brute-force search across all valid gear combos to find the highest DPS loadout for any boss.", badge: "Auto", variant: "gold" as const },
  { title: "Pact Modifiers", desc: "All DPS-relevant pacts modeled — accuracy, damage, speed, echo cascade, and weapon-specific effects.", badge: "130+", variant: "red" as const },
  { title: "Build Sharing", desc: "Save builds to localStorage, share via URL. Compare loadouts side by side.", badge: "Share", variant: "blue" as const },
];

export default function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-demon-dark via-osrs-dark to-osrs-dark" />
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-1/4 w-96 h-96 bg-demon-glow/20 rounded-full blur-3xl ember-glow" />
          <div className="absolute top-40 right-1/4 w-64 h-64 bg-demon-ember/20 rounded-full blur-3xl ember-glow" style={{ animationDelay: "1s" }} />
        </div>

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 py-20 sm:py-28 text-center">
          <Badge variant="red" size="md">Demonic Pacts League</Badge>
          <h1
            className="mt-6 text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight"
            style={{ fontFamily: "var(--font-runescape)" }}
          >
            <span className="fire-text">DPS Calculator</span>
          </h1>
          <p className="mt-6 text-lg text-osrs-text-dim max-w-2xl mx-auto">
            Exact OSRS combat formulas. Every pact modifier. Smart gear optimizer.
            Find your best-in-slot loadout before league day one.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/calculator"
              className="inline-flex items-center justify-center px-8 py-3.5 rounded-xl bg-gradient-to-r from-demon-glow to-demon-ember text-white font-bold text-lg shadow-lg shadow-demon-glow/25 hover:shadow-demon-glow/40 transition-all hover:scale-105"
            >
              Open Calculator
              <svg className="ml-2 w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <Link
              href="/formulas"
              className="inline-flex items-center justify-center px-8 py-3.5 rounded-xl border-2 border-osrs-gold text-osrs-gold font-bold text-lg hover:bg-osrs-gold/10 transition-all"
            >
              View Formulas
            </Link>
          </div>
        </div>
      </section>

      {/* Quick-Start: 3 Combat Style Cards */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 -mt-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {(["melee", "ranged", "magic"] as const).map(style => (
            <Link key={style} href={`/calculator`}>
              <Card hover className="text-center">
                <div className="text-2xl mb-2">
                  {style === "melee" ? "\u2694\ufe0f" : style === "ranged" ? "\ud83c\udff9" : "\u2728"}
                </div>
                <h3 className="text-lg font-bold text-osrs-gold capitalize" style={{ fontFamily: "var(--font-runescape)" }}>
                  {style}
                </h3>
                <p className="text-xs text-osrs-text-dim mt-1">
                  {style === "melee" ? "Scythe, Tecpatl, Fang" : style === "ranged" ? "T-Bow, ZCB, Drygore" : "Shadow, Shadowflame, Sang"}
                </p>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Boss Grid */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
        <h2 className="text-2xl font-bold text-osrs-gold mb-6 text-center" style={{ fontFamily: "var(--font-runescape)" }}>
          Popular Bosses
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {FEATURED_BOSSES.map(bossId => {
            const boss = BOSS_PRESETS.find(b => b.id === bossId);
            if (!boss) return null;
            return (
              <Link key={boss.id} href={`/calculator`}>
                <Card hover className="text-center py-3">
                  <div className="text-sm font-medium text-osrs-text">{boss.name}</div>
                  <div className="text-[10px] text-osrs-text-dim mt-0.5">
                    Def: {boss.defenceLevel} | HP: {boss.hp}
                  </div>
                  {boss.region && (
                    <Badge variant="default" size="sm">{boss.region}</Badge>
                  )}
                </Card>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Features */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {FEATURES.map(f => (
            <Card key={f.title}>
              <div className="flex items-center gap-2 mb-2">
                <h3 className="font-bold text-osrs-text">{f.title}</h3>
                <Badge variant={f.variant}>{f.badge}</Badge>
              </div>
              <p className="text-sm text-osrs-text-dim">{f.desc}</p>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
