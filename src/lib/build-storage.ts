import { LeagueBuild, CharacterProfile, AccountType } from "@/types/league";

const STORAGE_KEY = "gielinor-guide-profiles";

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

export function getProfiles(): CharacterProfile[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveProfiles(profiles: CharacterProfile[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(profiles));
}

export function createProfile(name: string, accountType: AccountType): CharacterProfile {
  const profile: CharacterProfile = {
    id: generateId(),
    name,
    accountType,
    builds: [],
    createdAt: Date.now(),
  };
  const profiles = getProfiles();
  profiles.push(profile);
  saveProfiles(profiles);
  return profile;
}

export function createBuild(
  profileId: string,
  name: string,
  accountType: AccountType
): LeagueBuild | null {
  const profiles = getProfiles();
  const profile = profiles.find((p) => p.id === profileId);
  if (!profile) return null;

  const build: LeagueBuild = {
    id: generateId(),
    name,
    accountType,
    regions: [],
    relics: [],
    pacts: [],
    completedTasks: [],
    notes: "",
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
  profile.builds.push(build);
  saveProfiles(profiles);
  return build;
}

export function updateBuild(profileId: string, build: LeagueBuild) {
  const profiles = getProfiles();
  const profile = profiles.find((p) => p.id === profileId);
  if (!profile) return;

  const idx = profile.builds.findIndex((b) => b.id === build.id);
  if (idx === -1) return;

  profile.builds[idx] = { ...build, updatedAt: Date.now() };
  saveProfiles(profiles);
}

export function deleteBuild(profileId: string, buildId: string) {
  const profiles = getProfiles();
  const profile = profiles.find((p) => p.id === profileId);
  if (!profile) return;

  profile.builds = profile.builds.filter((b) => b.id !== buildId);
  saveProfiles(profiles);
}

export function deleteProfile(profileId: string) {
  const profiles = getProfiles().filter((p) => p.id !== profileId);
  saveProfiles(profiles);
}

// Encode a build into a shareable URL parameter
export function encodeBuild(build: LeagueBuild): string {
  const compact = {
    n: build.name,
    a: build.accountType,
    g: build.regions,
    r: build.relics,
    p: build.pacts,
    t: build.completedTasks,
  };
  return btoa(JSON.stringify(compact));
}

// Decode a build from a URL parameter
export function decodeBuild(encoded: string): Partial<LeagueBuild> | null {
  try {
    const compact = JSON.parse(atob(encoded));
    return {
      name: compact.n || "Imported Build",
      accountType: compact.a || "ironman",
      regions: compact.g || [],
      relics: compact.r || [],
      pacts: compact.p || [],
      completedTasks: compact.t || [],
    };
  } catch {
    return null;
  }
}
