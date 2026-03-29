import type {
  SnowflakeProfile,
  OsrsQuest,
  OsrsBoss,
  ContentAvailability,
  ContentAvailabilityItem,
  ContentBlocker,
} from "@/types/snowflake";

/**
 * Compute what content is available given a snowflake profile's restrictions.
 */
export function computeAvailability(
  profile: SnowflakeProfile,
  quests: OsrsQuest[],
  bosses: OsrsBoss[],
): ContentAvailability {
  const hasRegionRestriction = profile.allowedRegions.length > 0;

  // Build skill cap map
  const skillCaps = new Map<string, number | "locked">();
  for (const restriction of profile.skillRestrictions) {
    if (restriction.restriction === "locked") {
      skillCaps.set(restriction.skill, "locked");
    } else if (restriction.restriction === "capped" && restriction.cap !== undefined) {
      skillCaps.set(restriction.skill, restriction.cap);
    }
  }

  // Pre-compute quest availability (needed for quest chain resolution)
  const questAvailability = new Map<string, { available: boolean; blockers: ContentBlocker[] }>();

  function resolveQuest(questName: string, visited: Set<string> = new Set()): { available: boolean; blockers: ContentBlocker[] } {
    if (questAvailability.has(questName)) return questAvailability.get(questName)!;
    if (visited.has(questName)) return { available: true, blockers: [] }; // Cycle protection
    visited.add(questName);

    const quest = quests.find((q) => q.name === questName);
    if (!quest) return { available: true, blockers: [] }; // Unknown quests assumed available

    const blockers: ContentBlocker[] = [];

    // Check region
    if (hasRegionRestriction && !profile.allowedRegions.includes(quest.region)) {
      blockers.push({ type: "region", description: `Requires access to ${quest.region}` });
    }

    // Check skill requirements
    for (const req of quest.skillRequirements) {
      const cap = skillCaps.get(req.skill);
      if (cap === "locked") {
        blockers.push({ type: "skill", description: `${req.skill} is locked (requires level ${req.level})` });
      } else if (typeof cap === "number" && req.level > cap) {
        blockers.push({ type: "skill", description: `${req.skill} capped at ${cap} (requires ${req.level})` });
      }
    }

    // Check quest prerequisites
    for (const prereqName of quest.questRequirements) {
      const prereq = resolveQuest(prereqName, visited);
      if (!prereq.available) {
        blockers.push({ type: "quest", description: `Requires quest: ${prereqName}` });
      }
    }

    const result = { available: blockers.length === 0, blockers };
    questAvailability.set(questName, result);
    return result;
  }

  // Resolve all quests
  const questItems: ContentAvailabilityItem[] = quests.map((quest) => {
    const result = resolveQuest(quest.name);
    return {
      id: quest.id,
      name: quest.name,
      available: result.available,
      blockers: result.blockers,
    };
  });

  // Resolve bosses
  const bossItems: ContentAvailabilityItem[] = bosses.map((boss) => {
    const blockers: ContentBlocker[] = [];

    // Check region
    if (hasRegionRestriction && !profile.allowedRegions.includes(boss.region)) {
      blockers.push({ type: "region", description: `Located in ${boss.region}` });
    }

    // Check skill requirements
    for (const req of boss.skillRequirements) {
      const cap = skillCaps.get(req.skill);
      if (cap === "locked") {
        blockers.push({ type: "skill", description: `${req.skill} is locked (requires level ${req.level})` });
      } else if (typeof cap === "number" && req.level > cap) {
        blockers.push({ type: "skill", description: `${req.skill} capped at ${cap} (requires ${req.level})` });
      }
    }

    // Check quest requirements
    for (const prereqName of boss.questRequirements) {
      const questResult = resolveQuest(prereqName);
      if (!questResult.available) {
        blockers.push({ type: "quest", description: `Requires quest: ${prereqName}` });
      }
    }

    return {
      id: boss.id,
      name: boss.name,
      available: blockers.length === 0,
      blockers,
    };
  });

  return {
    quests: questItems,
    bosses: bossItems,
    availableQuestCount: questItems.filter((q) => q.available).length,
    totalQuestCount: questItems.length,
    availableBossCount: bossItems.filter((b) => b.available).length,
    totalBossCount: bossItems.length,
  };
}
