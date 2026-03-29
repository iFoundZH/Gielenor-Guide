"use client";

import { Suspense, useState, useEffect, useMemo, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { SnowflakeRegionPicker } from "@/components/snowflake/SnowflakeRegionPicker";
import { SkillRestrictionGrid } from "@/components/snowflake/SkillRestrictionGrid";
import { ContentAvailabilityPanel } from "@/components/snowflake/ContentAvailabilityPanel";
import {
  getSnowflakeProfile,
  updateSnowflakeProfile,
  encodeSnowflakeProfile,
} from "@/lib/snowflake-storage";
import { computeAvailability } from "@/lib/snowflake-availability";
import { osrsQuests } from "@/data/osrs-quests";
import { osrsBosses } from "@/data/osrs-bosses";
import { snowflakePresets } from "@/data/snowflake-presets";
import type { SnowflakeProfile, SkillRestriction } from "@/types/snowflake";
import Link from "next/link";

const sections = [
  { id: "regions", label: "Regions" },
  { id: "skills", label: "Skills" },
  { id: "rules", label: "Rules" },
  { id: "content", label: "Content" },
  { id: "notes", label: "Notes" },
];

export default function SnowflakePlannerPage() {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 text-osrs-text-dim">Loading...</div>}>
      <SnowflakePlanner />
    </Suspense>
  );
}

function SnowflakePlanner() {
  const searchParams = useSearchParams();
  const profileId = searchParams.get("profile");

  const [profile, setProfile] = useState<SnowflakeProfile | null>(null);
  const [copied, setCopied] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState(false);

  useEffect(() => {
    if (profileId) {
      const loaded = getSnowflakeProfile(profileId);
      if (loaded) setProfile(loaded);
    }
  }, [profileId]);

  useEffect(() => {
    if (profile) updateSnowflakeProfile(profile);
  }, [profile]);

  const availability = useMemo(() => {
    if (!profile) return null;
    return computeAvailability(profile, osrsQuests, osrsBosses);
  }, [profile]);

  const toggleRegion = useCallback((regionId: string) => {
    setProfile((prev) => {
      if (!prev) return prev;
      const regions = prev.allowedRegions.includes(regionId)
        ? prev.allowedRegions.filter((id) => id !== regionId)
        : [...prev.allowedRegions, regionId];
      return { ...prev, allowedRegions: regions };
    });
  }, []);

  const setRestrictions = useCallback((restrictions: SkillRestriction[]) => {
    setProfile((prev) => prev ? { ...prev, skillRestrictions: restrictions } : prev);
  }, []);

  const applyPreset = (presetId: string) => {
    const preset = snowflakePresets.find((p) => p.id === presetId);
    if (!preset || !profile) return;
    setProfile({
      ...profile,
      allowedRegions: preset.allowedRegions,
      skillRestrictions: preset.skillRestrictions,
      customRules: preset.customRules,
    });
  };

  const handleShare = async () => {
    if (!profile) return;
    const encoded = encodeSnowflakeProfile(profile);
    const url = `${window.location.origin}/snowflake/planner?build=${encoded}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
    } catch { /* ignore */ }
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExportText = () => {
    if (!profile) return;
    const lines = [
      `# ${profile.name}`,
      `Account: ${profile.accountMode}`,
      "",
      `## Regions`,
      profile.allowedRegions.length === 0
        ? "No restrictions (all regions)"
        : profile.allowedRegions.join(", "),
      "",
      `## Skill Restrictions`,
      ...profile.skillRestrictions.map((r) =>
        r.restriction === "locked" ? `${r.skill}: LOCKED` : `${r.skill}: Cap ${r.cap}`,
      ),
      ...(profile.skillRestrictions.length === 0 ? ["None"] : []),
      "",
      `## Custom Rules`,
      ...profile.customRules.map((r) => `- ${r}`),
      ...(profile.customRules.length === 0 ? ["None"] : []),
    ];
    navigator.clipboard.writeText(lines.join("\n"));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  if (!profile) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 text-center">
        <Card className="py-8">
          <p className="text-osrs-text-dim mb-4">No profile selected.</p>
          <Link href="/snowflake" className="text-osrs-blue hover:underline">
            Go to Snowflake Tracker
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex items-center gap-2 mb-3 text-sm text-osrs-text-dim">
        <Link href="/" className="hover:text-osrs-gold">Home</Link>
        <span>/</span>
        <Link href="/snowflake" className="hover:text-osrs-blue">Snowflake</Link>
        <span>/</span>
        <span className="text-osrs-blue">Planner</span>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1 space-y-8">
          <div>
            <h1
              className="text-3xl font-bold text-osrs-blue mb-1"
              style={{ fontFamily: "var(--font-runescape)", textShadow: "0 0 10px rgba(59, 130, 246, 0.5)" }}
            >
              Restriction Planner
            </h1>
            <p className="text-osrs-text-dim text-sm">Configure your account restrictions and see what content is available.</p>
          </div>

          {/* Sticky Nav */}
          <nav className="sticky top-14 z-20 -mx-4 sm:-mx-6 px-4 sm:px-6 py-2 bg-osrs-dark/95 backdrop-blur-sm border-b border-osrs-border">
            <div className="flex gap-1 overflow-x-auto">
              {sections.map((s) => (
                <button
                  key={s.id}
                  onClick={() => scrollToSection(s.id)}
                  className="px-3 py-1.5 text-xs font-medium rounded-lg text-osrs-text-dim hover:text-osrs-blue hover:bg-osrs-blue/10 transition-all whitespace-nowrap"
                >
                  {s.label}
                </button>
              ))}
            </div>
          </nav>

          {/* Profile Config */}
          <Card>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <label className="block text-xs text-osrs-text-dim mb-1">Profile Name</label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  className="w-full bg-osrs-darker border border-osrs-border rounded-lg px-3 py-2 text-sm text-osrs-text focus:border-osrs-blue focus:outline-none"
                />
              </div>
              <div className="flex items-end gap-2">
                <button onClick={handleShare} className="px-4 py-2 bg-osrs-blue text-white rounded-lg text-sm font-bold hover:bg-osrs-blue/90">
                  {copied ? "Copied!" : "Share"}
                </button>
                <button onClick={handleExportText} className="px-4 py-2 border border-osrs-border text-osrs-text-dim rounded-lg text-sm hover:border-osrs-blue">
                  Export Text
                </button>
              </div>
            </div>
            {copied && <div className="mt-3 p-2 bg-osrs-blue/10 border border-osrs-blue/30 rounded-lg text-xs text-osrs-blue text-center">Copied to clipboard!</div>}

            {/* Quick-apply presets */}
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="text-xs text-osrs-text-dim self-center">Quick presets:</span>
              {snowflakePresets.slice(0, 6).map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => applyPreset(preset.id)}
                  className="px-2 py-1 text-xs border border-osrs-border rounded text-osrs-text-dim hover:border-osrs-blue hover:text-osrs-blue"
                >
                  {preset.name}
                </button>
              ))}
            </div>
          </Card>

          {/* Regions */}
          <div id="regions" className="scroll-mt-24">
            <h2 className="text-2xl font-bold text-osrs-blue mb-4" style={{ fontFamily: "var(--font-runescape)" }}>
              Allowed Regions
            </h2>
            <SnowflakeRegionPicker
              selectedRegions={profile.allowedRegions}
              onToggle={toggleRegion}
            />
          </div>

          {/* Skills */}
          <div id="skills" className="scroll-mt-24">
            <h2 className="text-2xl font-bold text-osrs-blue mb-4" style={{ fontFamily: "var(--font-runescape)" }}>
              Skill Restrictions
            </h2>
            <SkillRestrictionGrid
              restrictions={profile.skillRestrictions}
              onChange={setRestrictions}
            />
          </div>

          {/* Custom Rules */}
          <div id="rules" className="scroll-mt-24">
            <h2 className="text-2xl font-bold text-osrs-blue mb-4" style={{ fontFamily: "var(--font-runescape)" }}>
              Custom Rules
            </h2>
            <Card>
              <div className="space-y-2">
                {profile.customRules.map((rule, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={rule}
                      onChange={(e) => {
                        const rules = [...profile.customRules];
                        rules[i] = e.target.value;
                        setProfile({ ...profile, customRules: rules });
                      }}
                      className="flex-1 bg-osrs-darker border border-osrs-border rounded-lg px-3 py-1.5 text-sm text-osrs-text focus:border-osrs-blue focus:outline-none"
                    />
                    <button
                      onClick={() => setProfile({ ...profile, customRules: profile.customRules.filter((_, j) => j !== i) })}
                      className="text-osrs-text-dim hover:text-demon-glow text-sm px-2"
                    >
                      x
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => setProfile({ ...profile, customRules: [...profile.customRules, ""] })}
                  className="text-sm text-osrs-blue hover:underline"
                >
                  + Add rule
                </button>
              </div>
            </Card>
          </div>

          {/* Content Availability */}
          <div id="content" className="scroll-mt-24">
            <h2 className="text-2xl font-bold text-osrs-blue mb-4" style={{ fontFamily: "var(--font-runescape)" }}>
              Content Availability
            </h2>
            {availability && <ContentAvailabilityPanel availability={availability} />}
          </div>

          {/* Notes */}
          <div id="notes" className="scroll-mt-24">
            <Card>
              <h3 className="font-bold text-osrs-text mb-2">Notes</h3>
              <textarea
                value={profile.notes}
                onChange={(e) => setProfile({ ...profile, notes: e.target.value })}
                placeholder="Strategy notes, gear goals, account plans..."
                className="w-full bg-osrs-darker border border-osrs-border rounded-lg px-3 py-2 text-sm text-osrs-text focus:border-osrs-blue focus:outline-none resize-y min-h-24"
                rows={4}
              />
            </Card>
          </div>
        </div>

        {/* Desktop Sidebar */}
        <div className="hidden lg:block lg:w-80">
          <div className="sticky top-20 space-y-4">
            <Card glow="blue">
              <h3
                className="text-lg font-bold text-osrs-blue mb-4"
                style={{ fontFamily: "var(--font-runescape)" }}
              >
                Restriction Summary
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-osrs-text-dim">Regions</span>
                  <span className="text-osrs-text">
                    {profile.allowedRegions.length === 0 ? "All" : `${profile.allowedRegions.length} allowed`}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-osrs-text-dim">Locked Skills</span>
                  <span className="text-osrs-text">
                    {profile.skillRestrictions.filter((r) => r.restriction === "locked").length}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-osrs-text-dim">Capped Skills</span>
                  <span className="text-osrs-text">
                    {profile.skillRestrictions.filter((r) => r.restriction === "capped").length}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-osrs-text-dim">Custom Rules</span>
                  <span className="text-osrs-text">{profile.customRules.length}</span>
                </div>
              </div>
            </Card>

            {availability && (
              <Card>
                <h4 className="text-sm font-bold text-osrs-text mb-3">Availability</h4>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-xs text-osrs-text-dim mb-1">
                      <span>Quests</span>
                      <span>{availability.availableQuestCount}/{availability.totalQuestCount}</span>
                    </div>
                    <ProgressBar value={availability.availableQuestCount} max={availability.totalQuestCount} size="sm" color="bg-osrs-blue" showText={false} />
                  </div>
                  <div>
                    <div className="flex justify-between text-xs text-osrs-text-dim mb-1">
                      <span>Bosses</span>
                      <span>{availability.availableBossCount}/{availability.totalBossCount}</span>
                    </div>
                    <ProgressBar value={availability.availableBossCount} max={availability.totalBossCount} size="sm" color="bg-osrs-blue" showText={false} />
                  </div>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Mobile floating summary bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-30">
        <button
          onClick={() => setMobileExpanded(!mobileExpanded)}
          className="w-full bg-osrs-darker border-t border-osrs-border px-4 py-3 flex items-center justify-between"
        >
          <div className="flex items-center gap-4 text-xs">
            <span className="text-osrs-blue font-bold">{profile.name}</span>
            <span className="text-osrs-text-dim">R {profile.allowedRegions.length || "All"}</span>
            <span className="text-osrs-text-dim">S {profile.skillRestrictions.length}</span>
            {availability && (
              <span className="text-osrs-text-dim">Q {availability.availableQuestCount}/{availability.totalQuestCount}</span>
            )}
          </div>
          <span className="text-osrs-text-dim text-xs">{mobileExpanded ? "v" : "^"}</span>
        </button>
      </div>
    </div>
  );
}
