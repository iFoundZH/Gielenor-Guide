"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { demonicPactsLeague } from "@/data/demonic-pacts";
import { Card } from "@/components/ui/Card";
import { RelicTierDisplay } from "@/components/league/RelicTierDisplay";
import { PactCard } from "@/components/league/PactCard";
import { RegionPicker } from "@/components/league/RegionPicker";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { encodeBuild, decodeBuild } from "@/lib/build-storage";
import { calculateGielinorScore } from "@/lib/player-score";
import { GielinorScoreCard } from "@/components/league/GielinorScoreCard";
import { BuildAnalysisPanel } from "@/components/league/BuildAnalysisPanel";
import { analyzeBuild } from "@/lib/build-analysis";
import type { LeagueBuild } from "@/types/league";
import Link from "next/link";

const sections = [
  { id: "regions", label: "Regions" },
  { id: "relics", label: "Relics" },
  { id: "pacts", label: "Pacts" },
  { id: "analysis", label: "Analysis" },
  { id: "notes", label: "Notes" },
];

export default function BuildPlanner() {
  const league = demonicPactsLeague;

  const [build, setBuild] = useState<LeagueBuild>({
    id: "",
    name: "My Demonic Pacts Build",
    accountType: "ironman",
    regions: [],
    relics: [],
    pacts: [],
    completedTasks: [],
    notes: "",
    createdAt: Date.now(),
    updatedAt: Date.now(),
  });

  const [copied, setCopied] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const buildParam = params.get("build");
    if (buildParam) {
      const decoded = decodeBuild(buildParam);
      if (decoded) setBuild((prev) => ({ ...prev, ...decoded }));
    } else {
      const saved = localStorage.getItem("gielinor-dp-build");
      if (saved) try { setBuild(JSON.parse(saved)); } catch { /* ignore */ }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("gielinor-dp-build", JSON.stringify(build));
  }, [build]);

  const allRelics = useMemo(() => league.relicTiers.flatMap((t) => t.relics), [league.relicTiers]);

  const toggleRelic = useCallback((relicId: string) => {
    setBuild((prev) => {
      const relic = allRelics.find((r) => r.id === relicId);
      if (!relic) return prev;
      const otherRelics = prev.relics.filter((id) => {
        const r = allRelics.find((rl) => rl.id === id);
        return r && r.tier !== relic.tier;
      });
      if (prev.relics.includes(relicId)) return { ...prev, relics: otherRelics };
      return { ...prev, relics: [...otherRelics, relicId] };
    });
  }, [allRelics]);

  const togglePact = useCallback((pactId: string) => {
    setBuild((prev) => ({
      ...prev,
      pacts: prev.pacts.includes(pactId)
        ? prev.pacts.filter((id) => id !== pactId)
        : [...prev.pacts, pactId],
    }));
  }, []);

  const toggleRegion = useCallback((regionId: string) => {
    setBuild((prev) => ({
      ...prev,
      regions: prev.regions.includes(regionId)
        ? prev.regions.filter((id) => id !== regionId)
        : prev.regions.length < league.maxRegions
        ? [...prev.regions, regionId]
        : prev.regions,
    }));
  }, [league.maxRegions]);

  const selectedRelics = useMemo(() => allRelics.filter((r) => build.relics.includes(r.id)), [build.relics, allRelics]);
  const selectedPacts = useMemo(() => league.pacts.filter((p) => build.pacts.includes(p.id)), [build.pacts, league.pacts]);
  const gielinorScore = useMemo(() => calculateGielinorScore(build, league), [build, league]);
  const buildAnalysis = useMemo(() => analyzeBuild(build, league), [build, league]);

  const handleShare = async () => {
    const encoded = encodeBuild(build);
    const url = `${window.location.origin}${window.location.pathname}?build=${encoded}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
    } catch {
      setCopied(false);
    }
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    if (!window.confirm("Are you sure you want to reset? This will clear all your selections.")) return;
    setBuild({
      id: "", name: "My Demonic Pacts Build", accountType: "ironman", regions: [],
      relics: [], pacts: [], completedTasks: [], notes: "", createdAt: Date.now(), updatedAt: Date.now(),
    });
  };

  const relicTiersWithChoices = league.relicTiers.filter((t) => t.relics.length > 0).length;
  const isEmpty = build.regions.length === 0 && build.relics.length === 0 && build.pacts.length === 0;

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex items-center gap-2 mb-3 text-sm text-osrs-text-dim">
        <Link href="/" className="hover:text-osrs-gold">Home</Link>
        <span>/</span>
        <Link href="/leagues/demonic-pacts" className="hover:text-osrs-gold">Demonic Pacts</Link>
        <span>/</span>
        <span className="text-osrs-gold">Build Planner</span>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1 space-y-8">
          <div>
            <h1 className="text-3xl font-bold text-osrs-gold text-glow-gold" style={{ fontFamily: "var(--font-runescape)" }}>
              Build Planner
            </h1>
            <p className="text-osrs-text-dim mt-1">
              Plan your regions, relics, and pacts. Share via URL.
            </p>
          </div>

          {/* Sticky Section Nav */}
          <nav className="sticky top-14 z-20 -mx-4 sm:-mx-6 px-4 sm:px-6 py-2 bg-osrs-dark/95 backdrop-blur-sm border-b border-osrs-border">
            <div className="flex gap-1 overflow-x-auto">
              {sections.map((s) => (
                <button
                  key={s.id}
                  onClick={() => scrollToSection(s.id)}
                  className="px-3 py-1.5 text-xs font-medium rounded-lg text-osrs-text-dim hover:text-osrs-gold hover:bg-osrs-gold/10 transition-all whitespace-nowrap"
                >
                  {s.label}
                </button>
              ))}
            </div>
          </nav>

          {/* Build Config */}
          <Card>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <label className="block text-xs text-osrs-text-dim mb-1">Build Name</label>
                <input type="text" value={build.name}
                  onChange={(e) => setBuild((prev) => ({ ...prev, name: e.target.value }))}
                  className="w-full bg-osrs-darker border border-osrs-border rounded-lg px-3 py-2 text-sm text-osrs-text focus:border-osrs-gold focus:outline-none"
                />
              </div>
              <div className="flex items-end gap-2">
                <button onClick={handleShare} className="px-4 py-2 bg-osrs-gold text-osrs-darker rounded-lg text-sm font-bold hover:bg-osrs-gold/90 transition-all">
                  {copied ? "Copied!" : "Share Build"}
                </button>
                <button onClick={handleReset} className="px-4 py-2 border border-osrs-border text-osrs-text-dim rounded-lg text-sm hover:border-demon-glow hover:text-demon-glow transition-all">
                  Reset
                </button>
              </div>
            </div>
            {copied && <div className="mt-3 p-2 bg-osrs-green/10 border border-osrs-green/30 rounded-lg text-xs text-osrs-green text-center">Link copied to clipboard!</div>}
          </Card>

          {/* Empty State Guidance */}
          {isEmpty && (
            <Card glow="gold">
              <div className="text-center py-4">
                <h3 className="text-lg font-bold text-osrs-gold mb-2" style={{ fontFamily: "var(--font-runescape)" }}>
                  Ready to plan your build?
                </h3>
                <p className="text-sm text-osrs-text-dim mb-4 max-w-lg mx-auto">
                  Start by choosing 3 regions below, then pick a relic for each tier, and activate your pacts.
                  Your Gielinor Score and build analysis update in real-time.
                </p>
                <Link
                  href="/leagues/demonic-pacts/guide"
                  className="inline-flex items-center gap-2 text-sm text-osrs-gold hover:underline"
                >
                  Not sure where to start? Check the Strategy Guide →
                </Link>
              </div>
            </Card>
          )}

          {/* Region Selection */}
          <div id="regions" className="scroll-mt-24">
            <h2 className="text-2xl font-bold text-osrs-gold mb-4" style={{ fontFamily: "var(--font-runescape)" }}>
              Choose Your Regions
            </h2>
            <RegionPicker
              regions={league.regions}
              maxRegions={league.maxRegions}
              selectedRegions={build.regions}
              onToggle={toggleRegion}
            />
          </div>

          {/* Relic Selection */}
          <div id="relics" className="scroll-mt-24">
            <h2 className="text-2xl font-bold text-osrs-gold mb-6" style={{ fontFamily: "var(--font-runescape)" }}>
              Choose Your Relics
            </h2>
            <div className="space-y-8">
              {league.relicTiers.map((rt) => (
                <RelicTierDisplay
                  key={rt.tier}
                  relicTier={rt}
                  selectedRelicId={build.relics.find((id) => rt.relics.some((r) => r.id === id))}
                  onSelect={toggleRelic}
                />
              ))}
            </div>
          </div>

          {/* Pact Selection */}
          <div id="pacts" className="scroll-mt-24">
            <h2 className="text-2xl font-bold text-osrs-gold mb-2" style={{ fontFamily: "var(--font-runescape)" }}>
              Demonic Pacts
            </h2>
            <p className="text-sm text-osrs-text-dim mb-6">
              Combat-focused pacts. Full details TBD before launch. Click to activate.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {league.pacts.map((pact) => (
                <PactCard key={pact.id} pact={pact} selected={build.pacts.includes(pact.id)} onToggle={togglePact} />
              ))}
            </div>
          </div>

          {/* Build Analysis */}
          <div id="analysis" className="scroll-mt-24">
            <BuildAnalysisPanel analysis={buildAnalysis} />
          </div>

          {/* Notes */}
          <div id="notes" className="scroll-mt-24">
            <Card>
              <h3 className="font-bold text-osrs-text mb-2">Build Notes</h3>
              <textarea value={build.notes}
                onChange={(e) => setBuild((prev) => ({ ...prev, notes: e.target.value }))}
                placeholder="Strategy notes, gear goals, boss priorities..."
                className="w-full bg-osrs-darker border border-osrs-border rounded-lg px-3 py-2 text-sm text-osrs-text focus:border-osrs-gold focus:outline-none resize-y min-h-24"
                rows={4}
              />
            </Card>
          </div>
        </div>

        {/* Sidebar — desktop only */}
        <div className="hidden lg:block lg:w-80">
          <div className="sticky top-20 space-y-4">
            <GielinorScoreCard score={gielinorScore} playerName={build.name} />

            <Card glow="gold">
              <h3 className="text-lg font-bold text-osrs-gold mb-4" style={{ fontFamily: "var(--font-runescape)" }}>Build Summary</h3>
              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-osrs-text-dim">Regions</span>
                  <span className="text-osrs-text">{build.regions.length} / {league.maxRegions}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-osrs-text-dim">Relics</span>
                  <span className="text-osrs-text">{selectedRelics.length} / {relicTiersWithChoices}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-osrs-text-dim">Pacts</span>
                  <span className="text-osrs-text">{selectedPacts.length}</span>
                </div>
              </div>
              <ProgressBar value={selectedRelics.length} max={relicTiersWithChoices} label="Relics Selected" color="bg-osrs-gold" size="sm" />
            </Card>

            {build.regions.length > 0 && (
              <Card>
                <h4 className="text-sm font-bold text-osrs-text mb-3">Selected Regions</h4>
                <div className="space-y-1">
                  {build.regions.map((regionId) => {
                    const region = league.regions.find((r) => r.id === regionId);
                    return region ? (
                      <div key={regionId} className="text-sm text-osrs-text">{region.name}</div>
                    ) : null;
                  })}
                </div>
              </Card>
            )}

            {selectedRelics.length > 0 && (
              <Card>
                <h4 className="text-sm font-bold text-osrs-text mb-3">Selected Relics</h4>
                <div className="space-y-2">
                  {selectedRelics.sort((a, b) => a.tier - b.tier).map((relic) => (
                    <div key={relic.id} className="flex items-center gap-2 text-sm">
                      <span className="text-osrs-gold text-xs">T{relic.tier}</span>
                      <span className="text-osrs-text">{relic.name}</span>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {selectedPacts.length > 0 && (
              <Card>
                <h4 className="text-sm font-bold text-osrs-text mb-3">Active Pacts</h4>
                <div className="space-y-3">
                  {selectedPacts.map((pact) => (
                    <div key={pact.id} className="text-sm">
                      <div className="font-medium text-osrs-text">{pact.name}</div>
                      <div className="text-xs text-osrs-green">+ {pact.bonus}</div>
                      <div className="text-xs text-demon-glow">- {pact.penalty}</div>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Mobile floating summary bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-30">
        {mobileExpanded && (
          <div className="bg-osrs-dark border-t border-osrs-border px-4 py-3 max-h-64 overflow-y-auto">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-osrs-text-dim">Regions</span>
                <span className="text-osrs-text">{build.regions.map((id) => league.regions.find((r) => r.id === id)?.name).filter(Boolean).join(", ") || "None"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-osrs-text-dim">Relics</span>
                <span className="text-osrs-text">{selectedRelics.map((r) => `T${r.tier} ${r.name}`).join(", ") || "None"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-osrs-text-dim">Pacts</span>
                <span className="text-osrs-text">{selectedPacts.map((p) => p.name).join(", ") || "None"}</span>
              </div>
              {buildAnalysis.warnings.length > 0 && (
                <div className="pt-2 border-t border-osrs-border">
                  {buildAnalysis.warnings.slice(0, 3).map((w, i) => (
                    <div key={i} className={`text-xs ${w.severity === "critical" ? "text-demon-glow" : "text-osrs-gold"}`}>
                      {w.severity === "critical" ? "!!" : "!"} {w.message}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
        <button
          onClick={() => setMobileExpanded(!mobileExpanded)}
          className="w-full bg-osrs-darker border-t border-osrs-border px-4 py-3 flex items-center justify-between"
        >
          <div className="flex items-center gap-4 text-xs">
            <span className="text-osrs-gold font-bold">{gielinorScore.total} pts</span>
            <span className="text-osrs-text-dim">R {build.regions.length}/{league.maxRegions}</span>
            <span className="text-osrs-text-dim">T {selectedRelics.length}/{relicTiersWithChoices}</span>
            <span className="text-osrs-text-dim">P {selectedPacts.length}</span>
          </div>
          <span className="text-osrs-text-dim text-xs">{mobileExpanded ? "▼" : "▲"}</span>
        </button>
      </div>
    </div>
  );
}
