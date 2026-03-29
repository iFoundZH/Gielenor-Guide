"use client";

import { Badge } from "@/components/ui/Badge";
import type { SkillRestriction, SkillRestrictionType } from "@/types/snowflake";
import type { SkillName } from "@/types/league";

const ALL_SKILLS: SkillName[] = [
  "Attack", "Strength", "Defence", "Ranged", "Prayer", "Magic",
  "Runecraft", "Hitpoints", "Crafting", "Mining", "Smithing",
  "Fishing", "Cooking", "Firemaking", "Woodcutting", "Agility",
  "Herblore", "Thieving", "Fletching", "Slayer", "Farming",
  "Construction", "Hunter",
];

interface SkillRestrictionGridProps {
  restrictions: SkillRestriction[];
  onChange: (restrictions: SkillRestriction[]) => void;
}

export function SkillRestrictionGrid({ restrictions, onChange }: SkillRestrictionGridProps) {
  const getRestriction = (skill: SkillName): SkillRestriction => {
    return restrictions.find((r) => r.skill === skill) || { skill, restriction: "none" };
  };

  const setRestriction = (skill: SkillName, restriction: SkillRestrictionType, cap?: number) => {
    const filtered = restrictions.filter((r) => r.skill !== skill);
    if (restriction !== "none") {
      filtered.push({ skill, restriction, ...(cap !== undefined ? { cap } : {}) });
    }
    onChange(filtered);
  };

  const lockedCount = restrictions.filter((r) => r.restriction === "locked").length;
  const cappedCount = restrictions.filter((r) => r.restriction === "capped").length;

  return (
    <div>
      <div className="flex items-center gap-3 mb-3 text-sm text-osrs-text-dim">
        <span>{lockedCount} locked</span>
        <span>{cappedCount} capped</span>
        <span>{23 - lockedCount - cappedCount} unrestricted</span>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
        {ALL_SKILLS.map((skill) => {
          const r = getRestriction(skill);
          return (
            <div
              key={skill}
              className={`p-2 rounded-lg border text-sm ${
                r.restriction === "locked"
                  ? "bg-demon-glow/10 border-demon-glow/30"
                  : r.restriction === "capped"
                  ? "bg-osrs-gold/10 border-osrs-gold/30"
                  : "bg-osrs-panel border-osrs-border"
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium text-osrs-text">{skill}</span>
                {r.restriction === "locked" && <Badge variant="red" size="sm">Locked</Badge>}
                {r.restriction === "capped" && <Badge variant="gold" size="sm">Cap: {r.cap}</Badge>}
              </div>
              <select
                value={r.restriction}
                onChange={(e) => {
                  const val = e.target.value as SkillRestrictionType;
                  setRestriction(skill, val, val === "capped" ? (r.cap || 1) : undefined);
                }}
                className="w-full bg-osrs-darker border border-osrs-border rounded px-1 py-0.5 text-xs text-osrs-text"
              >
                <option value="none">No restriction</option>
                <option value="locked">Locked</option>
                <option value="capped">Level cap</option>
              </select>
              {r.restriction === "capped" && (
                <input
                  type="number"
                  min={1}
                  max={99}
                  value={r.cap || 1}
                  onChange={(e) => setRestriction(skill, "capped", Math.max(1, Math.min(99, parseInt(e.target.value) || 1)))}
                  className="w-full mt-1 bg-osrs-darker border border-osrs-border rounded px-1 py-0.5 text-xs text-osrs-text"
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
