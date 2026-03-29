"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import Link from "next/link";
import { snowflakePresets } from "@/data/snowflake-presets";
import {
  getSnowflakeProfiles,
  createSnowflakeProfile,
  deleteSnowflakeProfile,
} from "@/lib/snowflake-storage";
import type { SnowflakeProfile } from "@/types/snowflake";

export default function SnowflakeLanding() {
  const router = useRouter();
  const [profiles, setProfiles] = useState<SnowflakeProfile[]>([]);
  const [newName, setNewName] = useState("");

  useEffect(() => {
    setProfiles(getSnowflakeProfiles());
  }, []);

  const handleCreateFromPreset = (presetId: string) => {
    const preset = snowflakePresets.find((p) => p.id === presetId);
    if (!preset) return;
    const profile = createSnowflakeProfile({
      name: preset.name,
      allowedRegions: preset.allowedRegions,
      skillRestrictions: preset.skillRestrictions,
      customRules: preset.customRules,
    });
    setProfiles(getSnowflakeProfiles());
    router.push(`/snowflake/planner?profile=${profile.id}`);
  };

  const handleCreateCustom = () => {
    const profile = createSnowflakeProfile({ name: newName || "Custom Snowflake" });
    setProfiles(getSnowflakeProfiles());
    setNewName("");
    router.push(`/snowflake/planner?profile=${profile.id}`);
  };

  const handleDelete = (id: string) => {
    if (!window.confirm("Delete this profile?")) return;
    deleteSnowflakeProfile(id);
    setProfiles(getSnowflakeProfiles());
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex items-center gap-2 mb-3 text-sm text-osrs-text-dim">
        <Link href="/" className="hover:text-osrs-gold">Home</Link>
        <span>/</span>
        <span className="text-osrs-blue">Snowflake Tracker</span>
      </div>

      <h1
        className="text-3xl font-bold text-osrs-blue mb-2"
        style={{ fontFamily: "var(--font-runescape)", textShadow: "0 0 10px rgba(59, 130, 246, 0.5)" }}
      >
        Snowflake Account Tracker
      </h1>
      <p className="text-osrs-text-dim mb-10 max-w-2xl">
        Plan self-restricted accounts with area locks, skill caps, and custom rules.
        See exactly what content is available with your chosen restrictions.
      </p>

      {/* Saved Profiles */}
      {profiles.length > 0 && (
        <div className="mb-10">
          <h2
            className="text-xl font-bold text-osrs-text mb-4"
            style={{ fontFamily: "var(--font-runescape)" }}
          >
            Your Profiles
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {profiles.map((profile) => (
              <Card key={profile.id} glow="blue">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-bold text-osrs-text">{profile.name}</h3>
                  <button
                    onClick={() => handleDelete(profile.id)}
                    className="text-xs text-osrs-text-dim hover:text-demon-glow"
                  >
                    Delete
                  </button>
                </div>
                <div className="flex flex-wrap gap-1 mb-3">
                  {profile.allowedRegions.length > 0 && (
                    <Badge variant="blue">{profile.allowedRegions.length} regions</Badge>
                  )}
                  {profile.skillRestrictions.length > 0 && (
                    <Badge variant="gold">{profile.skillRestrictions.length} skill restrictions</Badge>
                  )}
                  {profile.goals.length > 0 && (
                    <Badge variant="green">{profile.goals.filter((g) => g.completed).length}/{profile.goals.length} goals</Badge>
                  )}
                </div>
                <div className="flex gap-2">
                  <Link
                    href={`/snowflake/planner?profile=${profile.id}`}
                    className="px-3 py-1.5 bg-osrs-blue text-white rounded-lg text-xs font-bold hover:bg-osrs-blue/90"
                  >
                    Edit
                  </Link>
                  <Link
                    href={`/snowflake/goals?profile=${profile.id}`}
                    className="px-3 py-1.5 border border-osrs-border text-osrs-text-dim rounded-lg text-xs hover:border-osrs-blue"
                  >
                    Goals
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Create Custom */}
      <div className="mb-10">
        <h2
          className="text-xl font-bold text-osrs-text mb-4"
          style={{ fontFamily: "var(--font-runescape)" }}
        >
          Create Custom Profile
        </h2>
        <Card>
          <div className="flex gap-3">
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCreateCustom()}
              placeholder="Profile name..."
              className="flex-1 bg-osrs-darker border border-osrs-border rounded-lg px-3 py-2 text-sm text-osrs-text focus:border-osrs-blue focus:outline-none"
            />
            <button
              onClick={handleCreateCustom}
              className="px-6 py-2 bg-osrs-blue text-white rounded-lg text-sm font-bold hover:bg-osrs-blue/90"
            >
              Create
            </button>
          </div>
        </Card>
      </div>

      {/* Presets */}
      <div>
        <h2
          className="text-xl font-bold text-osrs-text mb-4"
          style={{ fontFamily: "var(--font-runescape)" }}
        >
          Quick Start Presets
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {snowflakePresets.map((preset) => (
            <Card key={preset.id} hover>
              <h3 className="font-bold text-osrs-text mb-1">{preset.name}</h3>
              <p className="text-xs text-osrs-text-dim mb-3">{preset.description}</p>
              <div className="flex flex-wrap gap-1 mb-3">
                {preset.allowedRegions.length > 0 && (
                  <Badge variant="blue">{preset.allowedRegions.length} regions</Badge>
                )}
                {preset.skillRestrictions.length > 0 && (
                  <Badge variant="gold">{preset.skillRestrictions.length} skills</Badge>
                )}
                {preset.customRules.length > 0 && (
                  <Badge variant="default">{preset.customRules.length} rules</Badge>
                )}
              </div>
              <button
                onClick={() => handleCreateFromPreset(preset.id)}
                className="w-full px-3 py-1.5 bg-osrs-blue/20 text-osrs-blue rounded-lg text-xs font-bold hover:bg-osrs-blue/30 border border-osrs-blue/30"
              >
                Use This Preset
              </button>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
