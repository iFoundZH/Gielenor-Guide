import type { SnowflakeProfile } from "@/types/snowflake";

const STORAGE_KEY = "gielinor-snowflake-profiles";

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

export function getSnowflakeProfiles(): SnowflakeProfile[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveProfiles(profiles: SnowflakeProfile[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(profiles));
}

export function getSnowflakeProfile(id: string): SnowflakeProfile | null {
  return getSnowflakeProfiles().find((p) => p.id === id) ?? null;
}

export function createSnowflakeProfile(partial: Partial<SnowflakeProfile> = {}): SnowflakeProfile {
  const profile: SnowflakeProfile = {
    id: generateId(),
    name: partial.name || "New Snowflake",
    accountMode: partial.accountMode || "ironman",
    allowedRegions: partial.allowedRegions || [],
    skillRestrictions: partial.skillRestrictions || [],
    customRules: partial.customRules || [],
    goals: partial.goals || [],
    notes: partial.notes || "",
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
  const profiles = getSnowflakeProfiles();
  profiles.push(profile);
  saveProfiles(profiles);
  return profile;
}

export function updateSnowflakeProfile(profile: SnowflakeProfile): void {
  const profiles = getSnowflakeProfiles();
  const idx = profiles.findIndex((p) => p.id === profile.id);
  if (idx === -1) return;
  profiles[idx] = { ...profile, updatedAt: Date.now() };
  saveProfiles(profiles);
}

export function deleteSnowflakeProfile(id: string): void {
  const profiles = getSnowflakeProfiles().filter((p) => p.id !== id);
  saveProfiles(profiles);
}

export function encodeSnowflakeProfile(profile: SnowflakeProfile): string {
  const compact = {
    n: profile.name,
    m: profile.accountMode,
    r: profile.allowedRegions,
    s: profile.skillRestrictions,
    c: profile.customRules,
  };
  return btoa(JSON.stringify(compact));
}

export function decodeSnowflakeProfile(encoded: string): Partial<SnowflakeProfile> | null {
  try {
    const compact = JSON.parse(atob(encoded));
    return {
      name: compact.n || "Imported Snowflake",
      accountMode: compact.m || "ironman",
      allowedRegions: compact.r || [],
      skillRestrictions: compact.s || [],
      customRules: compact.c || [],
    };
  } catch {
    return null;
  }
}
