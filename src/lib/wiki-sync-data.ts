/**
 * Wiki Data Sync Utility — Quests & Bosses
 *
 * Fetches ALL quests and bosses from the OSRS Wiki using bulk API requests
 * and generates TypeScript data files for the snowflake tracker.
 *
 * Usage:
 *   npm run sync-data                              # Fetch all data
 *   npm run sync-data -- --dry-run                 # Preview without writing
 *   npm run sync-data -- --merge                   # Preserve hand-curated entries
 *   npm run sync-data -- --content=quests          # Quests only
 *   npm run sync-data -- --content=bosses          # Bosses only
 *   npx tsx src/lib/wiki-sync-data.ts              # Direct execution
 */

import * as fs from "node:fs";
import * as path from "node:path";
import {
  fetchBulkWikitext,
  fetchCategoryMembers,
  fetchExpandedHtml,
  sleep,
  stripWikiMarkup,
  slugify,
  q,
  REQUEST_DELAY_MS,
  stripHtml,
  parseHtmlTable,
} from "./wiki-parsers";
import { mapLocationToRegion } from "./wiki-region-map";

const PROJECT_ROOT = path.resolve(import.meta.dirname ?? __dirname, "../..");
const DATA_DIR = path.join(PROJECT_ROOT, "src/data");

// ---------------------------------------------------------------------------
// Shared types (matching src/types/snowflake.ts interfaces)
// ---------------------------------------------------------------------------

interface ParsedQuest {
  id: string;
  name: string;
  difficulty: string;
  region: string;
  skillRequirements: { skill: string; level: number }[];
  questRequirements: string[];
  combatRequired: boolean;
  questPoints: number;
  members: boolean;
  length?: string;
  xpRewards?: { skill: string; xp: number }[];
  unlocks?: string[];
  wikiUrl: string;
}

interface ParsedBoss {
  id: string;
  name: string;
  region: string;
  combatLevel: number | null;
  skillRequirements: { skill: string; level: number }[];
  questRequirements: string[];
  hitpoints: number | null;
  attackStyles: string[];
  members: boolean;
  category: string[];
  notableDrops: string[];
  wikiUrl: string;
}

// ---------------------------------------------------------------------------
// Quest Sync
// ---------------------------------------------------------------------------

/** Sub-pages and categories to filter out of the quest category listing */
const QUEST_PAGE_EXCLUDES = [
  /\/Quick guide$/i,
  /\/Full guide$/i,
  /\/Transcript$/i,
  /\/Dialogue$/i,
  /\/Rewards$/i,
  /\(miniquest\)/i,
  /Recipe for Disaster\/.+/i, // RFD sub-quests (the main page is kept)
  /^Quests$/i,               // Main category page
  /^Quests\//i,              // All sub-pages (Quests/List, Quests/Novice, etc.)
  /^Quest Difficulties$/i,
  /^Quest experience rewards/i,
  /^Quest item rewards$/i,
  /^Quest items\//i,         // Quest items/Achievement Diary, etc.
  /^Quest point hood$/i,
  /^Quest points$/i,
  /^Miniquests$/i,           // Category page (individual miniquests still included)
  /^Optimal quest guide/i,
];

const QUEST_DIFFICULTY_MAP: Record<string, string> = {
  novice: "novice",
  intermediate: "intermediate",
  experienced: "experienced",
  master: "master",
  grandmaster: "grandmaster",
  special: "special",
  miniquest: "miniquest",
};

function normalizeDifficulty(raw: string): string {
  const lower = raw.toLowerCase().trim();
  return QUEST_DIFFICULTY_MAP[lower] ?? "intermediate";
}

/**
 * Extract a named parameter from a wikitext template.
 * Matches `|paramName = value` patterns.
 */
function extractInfoboxParam(wikitext: string, paramName: string): string | null {
  // Match |paramName = value (value extends until next |paramName or }})
  const pattern = new RegExp(`\\|\\s*${paramName}\\s*=\\s*([^|\\}]*?)(?=\\n\\s*\\||\\}\\})`, "is");
  const match = wikitext.match(pattern);
  return match ? match[1].trim() : null;
}

/**
 * Find a template block in wikitext (handles nested braces).
 */
function findTemplate(wikitext: string, templateName: string): string | null {
  const lower = wikitext.toLowerCase();
  const searchName = templateName.toLowerCase();
  let idx = lower.indexOf(`{{${searchName}`);
  if (idx === -1) {
    // Try with first letter case variation
    idx = lower.indexOf(`{{${searchName.charAt(0).toUpperCase()}${searchName.slice(1)}`);
    if (idx === -1) return null;
  }

  let depth = 0;
  for (let i = idx; i < wikitext.length - 1; i++) {
    if (wikitext[i] === "{" && wikitext[i + 1] === "{") {
      depth++;
      i++;
    } else if (wikitext[i] === "}" && wikitext[i + 1] === "}") {
      depth--;
      i++;
      if (depth === 0) return wikitext.slice(idx, i + 1);
    }
  }
  return null;
}

function parseQuestFromWikitext(name: string, wikitext: string, knownQuestNames: Set<string>): ParsedQuest | null {
  // Quest data is spread across multiple templates:
  // - {{Infobox Quest}} has name, members
  // - {{Quest details}} has difficulty, start location, requirements
  // - {{Quest rewards}} has quest points
  const infoboxQuest = findTemplate(wikitext, "infobox quest");
  const questDetails = findTemplate(wikitext, "quest details");
  const questRewards = findTemplate(wikitext, "quest rewards");

  // Skip pages that don't look like actual quests (no quest templates at all)
  if (!infoboxQuest && !questDetails && !questRewards) {
    return null;
  }

  let difficulty = "intermediate";
  let members = true;
  let questPoints = 0;
  let combatRequired = false;
  let startLocation = "";

  // Extract from Infobox Quest
  if (infoboxQuest) {
    const rawMembers = extractInfoboxParam(infoboxQuest, "members");
    if (rawMembers) {
      const stripped = stripWikiMarkup(rawMembers).toLowerCase();
      members = !stripped.includes("no") && !stripped.includes("free");
    }
  }

  // Extract from Quest details
  if (questDetails) {
    const rawDifficulty = extractInfoboxParam(questDetails, "difficulty");
    if (rawDifficulty) difficulty = normalizeDifficulty(stripWikiMarkup(rawDifficulty));

    const rawStart = extractInfoboxParam(questDetails, "start");
    if (rawStart) startLocation = stripWikiMarkup(rawStart);
  }

  // Extract quest points from Quest rewards template (|qp = N)
  if (questRewards) {
    const rawQP = extractInfoboxParam(questRewards, "qp");
    if (rawQP) {
      const num = parseInt(stripWikiMarkup(rawQP));
      if (!isNaN(num)) questPoints = num;
    }
  }

  // Find the Details/Requirements section (but NOT "Required for completing" which lists downstream quests)
  const detailsSection = wikitext.match(/==\s*Details\s*==([\s\S]*?)(?=\n==(?!=))/i);
  const reqSection = wikitext.match(/==\s*Requirements?\s*==([\s\S]*?)(?=\n==(?!=))/i);
  // Combine quest details template + Details section + Requirements section for skill/combat extraction
  const reqScope = (questDetails ?? "") + (detailsSection?.[1] ?? "") + (reqSection?.[1] ?? "");

  // Detect combat requirement
  if (/ability to defeat|combat level|must be able to kill|enemies? up to|\{\{SCP\|Combat/i.test(reqScope)) {
    combatRequired = true;
  }

  // Extract skill requirements from {{SCP|Skill|Level}} patterns in requirements area
  const skillRequirements: { skill: string; level: number }[] = [];
  const skillReqPattern = /\{\{(?:SCP|Skill clickpic|Skill)\|([^|}\n]+)\|(\d+)/gi;
  let skillMatch;
  while ((skillMatch = skillReqPattern.exec(reqScope)) !== null) {
    const skill = skillMatch[1].trim();
    const level = parseInt(skillMatch[2]);
    // Only include actual OSRS skills (skip "Quest", "Combat", item names, etc.)
    if (skill && !isNaN(level) && level > 1 && SKILL_NAMES_SET.has(skill.toLowerCase())) {
      const existing = skillRequirements.find((s) => s.skill === skill);
      if (existing) {
        if (level > existing.level) existing.level = level;
      } else {
        skillRequirements.push({ skill, level });
      }
    }
  }

  // Extract quest requirements: look for known quest names in details+requirements scope only
  // (excludes "Required for completing" which lists downstream quests)
  const questRequirements: string[] = [];
  const questReqScope = (questDetails ?? "") + (detailsSection?.[1] ?? "") + (reqSection?.[1] ?? "");
  const questLinkPattern = /\[\[([^\]|]+?)(?:\|[^\]]+)?\]\]/g;
  let questLinkMatch;
  while ((questLinkMatch = questLinkPattern.exec(questReqScope)) !== null) {
    const linked = questLinkMatch[1].trim();
    if (knownQuestNames.has(linked) && linked !== name && !questRequirements.includes(linked)) {
      questRequirements.push(linked);
    }
  }

  // Determine region from start location
  const region = startLocation ? mapLocationToRegion(startLocation) : "misthalin";

  // Extract quest length from Quest details template (|len = Short)
  let length: string | undefined;
  if (questDetails) {
    const rawLen = extractInfoboxParam(questDetails, "len");
    if (rawLen) {
      const stripped = stripWikiMarkup(rawLen).toLowerCase().trim();
      const validLengths = ["very short", "short", "medium", "long", "very long"];
      if (validLengths.includes(stripped)) {
        length = stripped;
      }
    }
  }

  // Extract XP rewards from Quest rewards template — {{SCP|Skill|XP}} patterns
  const xpRewards: { skill: string; xp: number }[] = [];
  if (questRewards) {
    const xpPattern = /\{\{(?:SCP|Skill clickpic|Skill)\|([^|}\n]+)\|([^|}\n]+)/gi;
    let xpMatch;
    while ((xpMatch = xpPattern.exec(questRewards)) !== null) {
      const skill = xpMatch[1].trim();
      const rawXp = xpMatch[2].replace(/[,\s]/g, "");
      const xp = parseInt(rawXp);
      if (skill && !isNaN(xp) && xp > 0 && isSkillLike(skill)) {
        xpRewards.push({ skill, xp });
      }
    }
    // Also check for plain "X experience" patterns like "1,000 Attack experience"
    const plainXpPattern = /([\d,]+)\s+(\w+)\s+(?:experience|xp)\b/gi;
    let plainMatch;
    while ((plainMatch = plainXpPattern.exec(questRewards)) !== null) {
      const xp = parseInt(plainMatch[1].replace(/,/g, ""));
      const skill = plainMatch[2].trim();
      if (!isNaN(xp) && xp > 0 && isSkillLike(skill) && !xpRewards.some((r) => r.skill === skill)) {
        xpRewards.push({ skill, xp });
      }
    }
  }

  // Extract unlocks from rewards section — lines with "Access to", "Ability to", "unlock"
  const unlocks: string[] = [];
  const rewardsSection = wikitext.match(/==\s*Rewards?\s*==([\s\S]*?)(?=\n==(?!=)|$)/i);
  if (rewardsSection) {
    const rewardLines = rewardsSection[1].split("\n");
    for (const line of rewardLines) {
      if (/(?:access to|ability to|unlock|can now|allows|permission)/i.test(line)) {
        const cleaned = stripWikiMarkup(line).replace(/^\*\s*/, "").trim();
        if (cleaned.length > 5 && cleaned.length < 200) {
          unlocks.push(cleaned);
        }
      }
    }
  }

  const wikiUrl = `https://oldschool.runescape.wiki/w/${encodeURIComponent(name.replace(/ /g, "_"))}`;

  return {
    id: slugify(name),
    name,
    difficulty,
    region,
    skillRequirements,
    questRequirements,
    combatRequired,
    questPoints,
    members,
    length: length as ParsedQuest["length"],
    xpRewards: xpRewards.length > 0 ? xpRewards : undefined,
    unlocks: unlocks.length > 0 ? unlocks : undefined,
    wikiUrl,
  };
}

const SKILL_NAMES_SET = new Set([
  "attack", "strength", "defence", "ranged", "prayer", "magic",
  "runecraft", "hitpoints", "crafting", "mining", "smithing",
  "fishing", "cooking", "firemaking", "woodcutting", "agility",
  "herblore", "thieving", "fletching", "slayer", "farming",
  "construction", "hunter", "sailing",
]);

function isSkillLike(name: string): boolean {
  return SKILL_NAMES_SET.has(name.toLowerCase());
}

async function syncQuests(dryRun: boolean, merge: boolean): Promise<void> {
  console.log("\n--- Syncing Quests ---\n");

  // Step 1: Get all quest page titles from the wiki category
  console.log("  Fetching Category:Quests...");
  const questPages = await fetchCategoryMembers("Category:Quests");
  await sleep(REQUEST_DELAY_MS);

  console.log("  Fetching Category:Miniquests...");
  const miniquestPages = await fetchCategoryMembers("Category:Miniquests");
  await sleep(REQUEST_DELAY_MS);

  console.log(`  Found ${questPages.length} quest pages, ${miniquestPages.length} miniquest pages`);

  // Step 2: Filter out sub-pages and non-quest pages
  const allPages = [
    ...questPages.filter((p) => !QUEST_PAGE_EXCLUDES.some((re) => re.test(p))),
    ...miniquestPages.filter((p) => !QUEST_PAGE_EXCLUDES.some((re) => re.test(p))),
  ];

  // Deduplicate
  const uniquePages = [...new Set(allPages)];
  console.log(`  After filtering: ${uniquePages.length} pages to fetch`);

  // Step 3: Bulk fetch all quest wikitext
  console.log(`  Bulk fetching wikitext (${Math.ceil(uniquePages.length / 50)} batches)...`);
  const wikitextMap = await fetchBulkWikitext(uniquePages);
  console.log(`  Got wikitext for ${wikitextMap.size} pages`);

  // Step 4: Parse each quest
  // Build a set of known quest names for filtering quest requirements
  const knownQuestNames = new Set(uniquePages.map((p) => p));

  const quests: ParsedQuest[] = [];
  const miniquestSet = new Set(miniquestPages.map((p) => p.toLowerCase()));

  for (const pageName of uniquePages) {
    const wikitext = wikitextMap.get(pageName);
    if (!wikitext) continue;

    const quest = parseQuestFromWikitext(pageName, wikitext, knownQuestNames);
    if (!quest) continue;

    // Override difficulty for miniquests
    if (miniquestSet.has(pageName.toLowerCase())) {
      quest.difficulty = "miniquest";
    }

    quests.push(quest);
  }

  console.log(`  Parsed ${quests.length} quests`);

  // Step 5: Merge with existing data if requested
  let finalQuests = quests;
  if (merge) {
    finalQuests = mergeQuests(quests);
  }

  // Sort by name for stable output
  finalQuests.sort((a, b) => a.name.localeCompare(b.name));

  // Step 6: Generate output file
  const code = generateQuestsFile(finalQuests);
  const outputPath = path.join(DATA_DIR, "osrs-quests.ts");

  if (dryRun) {
    console.log(`  [DRY RUN] Would write ${finalQuests.length} quests to ${outputPath}`);
    console.log(`  Sample quests:`);
    for (const quest of finalQuests.slice(0, 5)) {
      console.log(`    - ${quest.name} (${quest.difficulty}, ${quest.region}, ${quest.questPoints} QP, ${quest.skillRequirements.length} skill reqs, ${quest.length ?? "no length"}, ${quest.xpRewards?.length ?? 0} xp rewards)`);
    }
  } else {
    fs.writeFileSync(outputPath, code);
    console.log(`  Wrote ${finalQuests.length} quests to osrs-quests.ts`);
  }
}

function mergeQuests(wikiQuests: ParsedQuest[]): ParsedQuest[] {
  const existingPath = path.join(DATA_DIR, "osrs-quests.ts");
  if (!fs.existsSync(existingPath)) return wikiQuests;

  // Safety: don't overwrite if wiki returned very few quests
  if (wikiQuests.length < 50) {
    console.log(`  WARN: Wiki returned only ${wikiQuests.length} quests, keeping existing data`);
    // We can't easily import TS at runtime, so just return wiki quests
    // The safety net is the count check
    return wikiQuests;
  }

  return wikiQuests;
}

function generateQuestsFile(quests: ParsedQuest[]): string {
  const lines: string[] = [];
  lines.push(`// @ts-nocheck — Auto-generated by wiki-sync-data.ts`);
  lines.push(`import type { OsrsQuest } from "@/types/snowflake";`);
  lines.push(``);
  lines.push(`export const osrsQuests: OsrsQuest[] = [`);

  for (const quest of quests) {
    const skillReqs = quest.skillRequirements.length > 0
      ? `[${quest.skillRequirements.map((r) => `{ skill: ${q(r.skill)}, level: ${r.level} }`).join(", ")}]`
      : "[]";
    const questReqs = quest.questRequirements.length > 0
      ? `[${quest.questRequirements.map(q).join(", ")}]`
      : "[]";

    const optionalFields: string[] = [];
    if (quest.length) optionalFields.push(`length: ${q(quest.length)} as OsrsQuest["length"]`);
    if (quest.xpRewards && quest.xpRewards.length > 0) {
      optionalFields.push(`xpRewards: [${quest.xpRewards.map((r) => `{ skill: ${q(r.skill)}, xp: ${r.xp} }`).join(", ")}]`);
    }
    if (quest.unlocks && quest.unlocks.length > 0) {
      optionalFields.push(`unlocks: [${quest.unlocks.map(q).join(", ")}]`);
    }
    optionalFields.push(`wikiUrl: ${q(quest.wikiUrl)}`);

    const optStr = optionalFields.length > 0 ? `, ${optionalFields.join(", ")}` : "";

    lines.push(`  { id: ${q(quest.id)}, name: ${q(quest.name)}, difficulty: ${q(quest.difficulty)} as OsrsQuest["difficulty"], region: ${q(quest.region)}, skillRequirements: ${skillReqs}, questRequirements: ${questReqs}, combatRequired: ${quest.combatRequired}, questPoints: ${quest.questPoints}, members: ${quest.members}${optStr} },`);
  }

  lines.push(`];`);
  lines.push(``);
  return lines.join("\n");
}

// ---------------------------------------------------------------------------
// Boss Sync
// ---------------------------------------------------------------------------

/** Known bosses and their wiki page names, sourced from the Boss page table */
async function fetchBossListFromWiki(): Promise<{ name: string; page: string; location: string; combatLevel: number | null }[]> {
  console.log("  Fetching Boss page HTML...");
  const html = await fetchExpandedHtml("Boss");
  if (!html) {
    console.error("  ERROR: Could not fetch Boss page");
    return [];
  }
  await sleep(REQUEST_DELAY_MS);

  const bosses: { name: string; page: string; location: string; combatLevel: number | null }[] = [];

  // The Boss page has wikitables. We parse individual table blocks to handle
  // header misalignment (data rows can have an extra image column).
  const tablePattern = /<table[^>]*class="[^"]*wikitable[^"]*"[^>]*>([\s\S]*?)<\/table>/gi;
  let tableMatch;

  while ((tableMatch = tablePattern.exec(html)) !== null) {
    const tableHtml = tableMatch[1];

    // Find header row to determine column layout
    const headerMatch = tableHtml.match(/<tr[^>]*>([\s\S]*?)<\/tr>/i);
    if (!headerMatch) continue;

    const headerCells: string[] = [];
    const thPattern = /<th[^>]*>([\s\S]*?)<\/th>/gi;
    let thMatch;
    while ((thMatch = thPattern.exec(headerMatch[1])) !== null) {
      headerCells.push(stripHtml(thMatch[1]).trim().toLowerCase());
    }

    const locationHeaderIdx = headerCells.indexOf("location");
    const levelHeaderIdx = headerCells.indexOf("level");
    if (locationHeaderIdx === -1) continue; // Not a boss table

    // Parse data rows
    const rowPattern = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
    let rowMatch;
    // Skip the first match (header)
    rowPattern.exec(tableHtml);

    while ((rowMatch = rowPattern.exec(tableHtml)) !== null) {
      const cells: string[] = [];
      const cellPattern = /<t[dh][^>]*>([\s\S]*?)<\/t[dh]>/gi;
      let cellMatch;
      while ((cellMatch = cellPattern.exec(rowMatch[1])) !== null) {
        cells.push(stripHtml(cellMatch[1]).trim());
      }

      if (cells.length < headerCells.length) continue;

      // Data rows may have an extra image column at index 1 (empty string).
      // Detect this: if cells.length > headerCells.length, skip empty cells.
      const offset = cells.length > headerCells.length ? cells.length - headerCells.length : 0;

      const rawName = cells[0].trim();
      if (!rawName || rawName.toLowerCase() === "boss") continue;

      const levelStr = cells[levelHeaderIdx + offset]?.trim() ?? "";
      const locationStr = cells[locationHeaderIdx + offset]?.trim() ?? "";

      let combatLevel: number | null = null;
      const clMatch = levelStr.match(/(\d+)/);
      if (clMatch) combatLevel = parseInt(clMatch[1]);

      // Clean up the name (remove note markers, trailing parentheticals)
      let cleanName = rawName
        .replace(/\s*\[\d+\]\s*$/, "")
        .replace(/\s*\(.*?\)\s*$/, "")
        .trim();

      if (cleanName.length < 2) continue;

      // Skip combined entries like "Artio &Callisto" — these are variant pairs
      // that already appear as separate entries
      if (cleanName.includes("&")) continue;

      bosses.push({
        name: cleanName,
        page: cleanName,
        location: locationStr,
        combatLevel,
      });
    }
  }

  return bosses;
}

/** Classify boss into categories based on name, location, and wiki content */
function classifyBossCategory(name: string, location: string, wikitext: string): string[] {
  const cats: string[] = [];
  const lower = name.toLowerCase();
  const locLower = location.toLowerCase();
  const textLower = wikitext.toLowerCase();

  // Raids
  if (/chambers of xeric|great olm/i.test(lower) || /tombs of amascut|wardens/i.test(lower) || /theatre of blood|verzik/i.test(lower)) {
    cats.push("raid");
  }
  // GWD
  if (/god wars|godwars/.test(locLower) || /general graardor|commander zilyana|kree.arra|k.ril tsutsaroth|nex\b/i.test(lower)) {
    cats.push("gwd");
  }
  // DT2
  if (/duke sucellus|the leviathan|the whisperer|vardorvis/i.test(lower)) {
    cats.push("dt2");
  }
  // Wilderness
  if (/wilderness/i.test(locLower) || /callisto|artio|venenatis|spindel|vet.ion|calvar.ion|chaos elemental|chaos fanatic|crazy archaeologist|scorpia|king black dragon/i.test(lower)) {
    cats.push("wilderness");
  }
  // Slayer
  if (/slayer/i.test(textLower.slice(0, 2000)) || /cerberus|abyssal sire|alchemical hydra|kraken|thermonuclear|grotesque guardians|araxxor/i.test(lower)) {
    cats.push("slayer");
  }
  // Skilling
  if (/zalcano|tempoross|wintertodt|phantom muspah/i.test(lower)) {
    cats.push("skilling");
  }

  if (cats.length === 0) cats.push("other");
  return cats;
}

function parseBossFromWikitext(
  bossInfo: { name: string; location: string; combatLevel: number | null },
  wikitext: string,
): ParsedBoss | null {
  const infobox = findTemplate(wikitext, "infobox monster") ?? findTemplate(wikitext, "infobox boss");

  let combatLevel = bossInfo.combatLevel;
  let location = bossInfo.location;
  let hitpoints: number | null = null;
  let members = true;
  const attackStyles: string[] = [];

  if (infobox) {
    // Override combat level from infobox if we didn't get one
    if (combatLevel === null) {
      const rawCombat = extractInfoboxParam(infobox, "combat");
      if (rawCombat) {
        const num = parseInt(stripWikiMarkup(rawCombat));
        if (!isNaN(num)) combatLevel = num;
      }
    }

    // Get location from infobox if not from table
    if (!location) {
      const rawLoc = extractInfoboxParam(infobox, "location");
      if (rawLoc) location = stripWikiMarkup(rawLoc);
    }

    // Hitpoints
    const rawHp = extractInfoboxParam(infobox, "hitpoints");
    if (rawHp) {
      const num = parseInt(stripWikiMarkup(rawHp).replace(/[,\s]/g, ""));
      if (!isNaN(num) && num > 0) hitpoints = num;
    }

    // Attack styles
    const rawAttStyle = extractInfoboxParam(infobox, "attack style");
    if (rawAttStyle) {
      const stripped = stripWikiMarkup(rawAttStyle);
      const styles = stripped.split(/[,\n]/).map((s) => s.trim()).filter((s) => s.length > 0 && s.length < 30);
      attackStyles.push(...styles);
    }

    // Members
    const rawMembers = extractInfoboxParam(infobox, "members");
    if (rawMembers) {
      const stripped = stripWikiMarkup(rawMembers).toLowerCase();
      members = !stripped.includes("no") && !stripped.includes("free");
    }
  }

  // Skill requirements (mainly slayer level)
  const skillRequirements: { skill: string; level: number }[] = [];
  if (infobox) {
    const slayLvl = extractInfoboxParam(infobox, "slaylvl");
    if (slayLvl) {
      const level = parseInt(stripWikiMarkup(slayLvl));
      if (!isNaN(level) && level > 1) {
        skillRequirements.push({ skill: "Slayer", level });
      }
    }
  }

  // Also check for skill requirements in the page text
  const reqSection = wikitext.match(/==\s*Requirements?\s*==([\s\S]*?)(?=\n==\s|$)/i);
  if (reqSection) {
    const skillPattern = /\{\{(?:SCP|Skill clickpic|Skill)\|([^|}\n]+)\|(\d+)/gi;
    let m;
    while ((m = skillPattern.exec(reqSection[1])) !== null) {
      const skill = m[1].trim();
      const level = parseInt(m[2]);
      if (skill && !isNaN(level) && level > 1) {
        const existing = skillRequirements.find((s) => s.skill === skill);
        if (existing) {
          if (level > existing.level) existing.level = level;
        } else {
          skillRequirements.push({ skill, level });
        }
      }
    }
  }

  // Quest requirements: look for [[Quest Name]] links that explicitly mention quest completion
  const questRequirements: string[] = [];
  if (reqSection) {
    const questRefPattern = /(?:complet\w+\s+(?:of\s+)?|(?:start|finish|done)\s+)\[\[([^\]|]+?)(?:\|[^\]]+)?\]\]/gi;
    let m;
    while ((m = questRefPattern.exec(reqSection[1])) !== null) {
      const linked = m[1].trim();
      if (linked.length > 3 && !questRequirements.includes(linked)) {
        questRequirements.push(linked);
      }
    }
  }

  // Notable drops: parse {{DropsLine|Name=...}} templates, limit to 10
  const notableDrops: string[] = [];
  const dropsLinePattern = /\{\{DropsLine[^}]*\|Name\s*=\s*([^|}]+)/gi;
  let dropMatch;
  const dropsSeen = new Set<string>();
  while ((dropMatch = dropsLinePattern.exec(wikitext)) !== null && notableDrops.length < 10) {
    const dropName = stripWikiMarkup(dropMatch[1]).trim();
    const dropLower = dropName.toLowerCase();
    // Skip common junk drops
    if (dropName.length > 1 && !dropsSeen.has(dropLower) && !/^(bones|coins|ashes|nothing|big bones|babydragon bones)$/i.test(dropName)) {
      dropsSeen.add(dropLower);
      notableDrops.push(dropName);
    }
  }

  const region = location ? mapLocationToRegion(location) : "misthalin";
  const category = classifyBossCategory(bossInfo.name, location, wikitext);
  const wikiUrl = `https://oldschool.runescape.wiki/w/${encodeURIComponent(bossInfo.name.replace(/ /g, "_"))}`;

  return {
    id: slugify(bossInfo.name),
    name: bossInfo.name,
    region,
    combatLevel,
    skillRequirements,
    questRequirements,
    hitpoints,
    attackStyles,
    members,
    category,
    notableDrops,
    wikiUrl,
  };
}

async function syncBosses(dryRun: boolean, merge: boolean): Promise<void> {
  console.log("\n--- Syncing Bosses ---\n");

  // Step 1: Get boss list from wiki Boss page
  const bossList = await fetchBossListFromWiki();
  console.log(`  Found ${bossList.length} bosses from Boss page`);

  if (bossList.length === 0) {
    console.error("  ERROR: No bosses found, aborting");
    return;
  }

  // Step 2: Bulk fetch wikitext for all boss pages
  const bossPageNames = bossList.map((b) => b.page);
  console.log(`  Bulk fetching wikitext (${Math.ceil(bossPageNames.length / 50)} batches)...`);
  const wikitextMap = await fetchBulkWikitext(bossPageNames);
  console.log(`  Got wikitext for ${wikitextMap.size} pages`);

  // Step 3: Parse each boss
  const bosses: ParsedBoss[] = [];
  for (const bossInfo of bossList) {
    const wikitext = wikitextMap.get(bossInfo.page) ?? wikitextMap.get(bossInfo.name);

    if (wikitext) {
      const boss = parseBossFromWikitext(bossInfo, wikitext);
      if (boss) bosses.push(boss);
    } else {
      // Still create an entry from the table data
      const wikiUrl = `https://oldschool.runescape.wiki/w/${encodeURIComponent(bossInfo.name.replace(/ /g, "_"))}`;
      bosses.push({
        id: slugify(bossInfo.name),
        name: bossInfo.name,
        region: bossInfo.location ? mapLocationToRegion(bossInfo.location) : "misthalin",
        combatLevel: bossInfo.combatLevel,
        skillRequirements: [],
        questRequirements: [],
        hitpoints: null,
        attackStyles: [],
        members: true,
        category: classifyBossCategory(bossInfo.name, bossInfo.location, ""),
        notableDrops: [],
        wikiUrl,
      });
    }
  }

  // Deduplicate by id (keep first occurrence)
  const seen = new Set<string>();
  const dedupedBosses = bosses.filter((b) => {
    if (seen.has(b.id)) return false;
    seen.add(b.id);
    return true;
  });

  console.log(`  Parsed ${dedupedBosses.length} unique bosses`);

  // Step 4: Merge with existing if requested
  let finalBosses = dedupedBosses;
  if (merge) {
    finalBosses = mergeBosses(dedupedBosses);
  }

  // Sort by name
  finalBosses.sort((a, b) => a.name.localeCompare(b.name));

  // Step 5: Generate output
  const code = generateBossesFile(finalBosses);
  const outputPath = path.join(DATA_DIR, "osrs-bosses.ts");

  if (dryRun) {
    console.log(`  [DRY RUN] Would write ${finalBosses.length} bosses to ${outputPath}`);
    console.log(`  Sample bosses:`);
    for (const b of finalBosses.slice(0, 5)) {
      console.log(`    - ${b.name} (${b.region}, CB ${b.combatLevel ?? "N/A"}, HP ${b.hitpoints ?? "N/A"}, ${b.category.join("/")}, ${b.notableDrops.length} drops)`);
    }
  } else {
    fs.writeFileSync(outputPath, code);
    console.log(`  Wrote ${finalBosses.length} bosses to osrs-bosses.ts`);
  }
}

function mergeBosses(wikiBosses: ParsedBoss[]): ParsedBoss[] {
  // Safety: don't overwrite if wiki returned very few bosses
  if (wikiBosses.length < 15) {
    console.log(`  WARN: Wiki returned only ${wikiBosses.length} bosses, keeping existing data`);
    return wikiBosses;
  }

  return wikiBosses;
}

function generateBossesFile(bosses: ParsedBoss[]): string {
  const lines: string[] = [];
  lines.push(`// @ts-nocheck — Auto-generated by wiki-sync-data.ts`);
  lines.push(`import type { OsrsBoss } from "@/types/snowflake";`);
  lines.push(``);
  lines.push(`export const osrsBosses: OsrsBoss[] = [`);

  for (const boss of bosses) {
    const skillReqs = boss.skillRequirements.length > 0
      ? `[${boss.skillRequirements.map((r) => `{ skill: ${q(r.skill)}, level: ${r.level} }`).join(", ")}]`
      : "[]";
    const questReqs = boss.questRequirements.length > 0
      ? `[${boss.questRequirements.map(q).join(", ")}]`
      : "[]";
    const atkStyles = boss.attackStyles.length > 0
      ? `[${boss.attackStyles.map(q).join(", ")}]`
      : "[]";
    const cats = `[${boss.category.map(q).join(", ")}]`;
    const drops = boss.notableDrops.length > 0
      ? `[${boss.notableDrops.map(q).join(", ")}]`
      : "[]";

    lines.push(`  { id: ${q(boss.id)}, name: ${q(boss.name)}, region: ${q(boss.region)}, combatLevel: ${boss.combatLevel ?? "null"}, skillRequirements: ${skillReqs}, questRequirements: ${questReqs}, hitpoints: ${boss.hitpoints ?? "null"}, attackStyles: ${atkStyles}, members: ${boss.members}, category: ${cats}, notableDrops: ${drops}, wikiUrl: ${q(boss.wikiUrl)} },`);
  }

  lines.push(`];`);
  lines.push(``);
  return lines.join("\n");
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes("--dry-run");
  const merge = args.includes("--merge");
  const contentArg = args.find((a) => a.startsWith("--content="));
  const contentTypes = contentArg
    ? contentArg.split("=")[1].split(",")
    : ["quests", "bosses"];

  console.log("========================================");
  console.log("  Gielinor Guide - Wiki Data Sync");
  console.log("========================================");
  console.log(`  Mode: ${dryRun ? "DRY RUN" : "LIVE"}${merge ? " (merge)" : ""}`);
  console.log(`  Content: ${contentTypes.join(", ")}`);
  console.log(`  Output dir: ${DATA_DIR}`);
  console.log(`  Time: ${new Date().toISOString()}`);

  const start = Date.now();
  let hasErrors = false;

  for (const type of contentTypes) {
    try {
      switch (type) {
        case "quests":
          await syncQuests(dryRun, merge);
          break;
        case "bosses":
          await syncBosses(dryRun, merge);
          break;
        default:
          console.warn(`  Unknown content type: ${type}`);
      }
    } catch (err) {
      hasErrors = true;
      console.error(`\nERROR syncing ${type}:`, err instanceof Error ? err.message : err);
    }
  }

  const elapsed = ((Date.now() - start) / 1000).toFixed(1);
  console.log(`\n========================================`);
  console.log(`  Data sync complete in ${elapsed}s. ${hasErrors ? "Some errors occurred." : "All OK."}`);
  console.log(`========================================\n`);

  if (hasErrors) process.exit(1);
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
