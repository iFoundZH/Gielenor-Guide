/**
 * Wiki Sync Utility
 *
 * Fetches wikitext from the Old School RuneScape Wiki API, parses relic tables,
 * task templates, regions, rewards, and generates TypeScript data files.
 *
 * Usage:
 *   npm run sync-wiki                  # Fetch and write data files
 *   npm run sync-wiki -- --dry-run     # Preview without writing files
 *   npm run sync-wiki -- --merge       # Preserve hand-curated data where wiki has none
 *   npm run sync-wiki -- --merge --dry-run  # Preview merge without writing
 *   npx tsx src/lib/wiki-sync.ts       # Direct execution
 *
 * Fetches per league:
 *   - {League} (main page: dates, regions, rewards, mechanics)
 *   - {League}/Relics (relic tiers, passive effects, relic tables)
 *   - {League}/Tasks (task templates: RELTaskRow, DPLTaskRow)
 */

import * as fs from "node:fs";
import * as path from "node:path";
import {
  WIKI_API,
  WIKI_HEADERS,
  REQUEST_DELAY_MS,
  fetchWikitext,
  fetchBulkWikitext,
  fetchSections,
  fetchWikitextSection,
  sleep,
  stripWikiMarkup,
  splitTemplateParts,
  parseSkillsParam,
  isSkillName,
  VALID_SKILLS,
  DIFFICULTY_POINTS,
  slugify,
  capitalize,
  titleCase,
  escapeRegex,
  q,
} from "./wiki-parsers";

const PROJECT_ROOT = path.resolve(import.meta.dirname ?? __dirname, "../..");
const DATA_DIR = path.join(PROJECT_ROOT, "src/data");

// ---------------------------------------------------------------------------
// League definitions
// ---------------------------------------------------------------------------

interface LeagueConfig {
  /** Wiki page name, e.g. "Raging_Echoes_League" */
  wikiPage: string;
  /** Output filename without extension, e.g. "raging-echoes" */
  slug: string;
  /** Exported const name, e.g. "ragingEchoesLeague" */
  exportName: string;
  /** Human-readable name */
  displayName: string;
  /** League number */
  leagueNumber: number;
  /** Task template name, e.g. "RELTaskRow" or "DPLTaskRow" */
  taskTemplate: string;
  /** Area template prefix, e.g. "RE" or "DPL" */
  areaTemplate: string;
  /** Relic ID prefix, e.g. "re" or "relic" — generates IDs like "re-t1-1" or "relic-t1-1" */
  relicIdPrefix: string;
}

const LEAGUES: LeagueConfig[] = [
  {
    wikiPage: "Raging_Echoes_League",
    slug: "raging-echoes",
    exportName: "ragingEchoesLeague",
    displayName: "Raging Echoes League",
    leagueNumber: 5,
    taskTemplate: "RELTaskRow",
    areaTemplate: "RE",
    relicIdPrefix: "re",
  },
  {
    wikiPage: "Demonic_Pacts_League",
    slug: "demonic-pacts",
    exportName: "demonicPactsLeague",
    displayName: "Demonic Pacts League",
    leagueNumber: 6,
    taskTemplate: "DPLTaskRow",
    areaTemplate: "DPL",
    relicIdPrefix: "relic",
  },
];

// ---------------------------------------------------------------------------
// Type definitions for parsed data (mirrors @/types/league loosely)
// ---------------------------------------------------------------------------

interface ParsedRelic {
  id: string;
  name: string;
  tier: number;
  slot: number;
  description: string;
  effects: string[];
}

interface ParsedRelicTier {
  tier: number;
  pointsToUnlock?: number;
  passiveEffects: string[];
  relics: ParsedRelic[];
}

interface ParsedTask {
  id: string;
  name: string;
  description: string;
  difficulty: string;
  points: number;
  category: string;
  region?: string;
  skills: string[];
}

interface ParsedRegion {
  id: string;
  name: string;
  type: "starting" | "auto-unlock" | "choosable" | "inaccessible";
}

interface ParsedRewardTier {
  name: string;
  pointsRequired: number;
  cosmetics: { name: string; type: string }[];
}

interface ParsedMasteryTier {
  tier: number;
  effect: string;
}

interface ParsedCombatMastery {
  id: string;
  name: string;
  style: "melee" | "ranged" | "magic";
  tiers: ParsedMasteryTier[];
}

interface ParsedMasterySystem {
  maxPoints: number;
  pointSources: string[];
  universalPassives: string[];
  styles: ParsedCombatMastery[];
}

interface ParsedLeagueData {
  id: string;
  name: string;
  leagueNumber: number;
  description: string;
  startDate: string;
  endDate: string;
  wikiUrl: string;
  baseXpMultiplier: number;
  maxRegions: number;
  regions: ParsedRegion[];
  relicTiers: ParsedRelicTier[];
  masteries?: ParsedMasterySystem;
  tasks: ParsedTask[];
  rewardTiers: ParsedRewardTier[];
  mechanicChanges: string[];
  autoCompletedQuests: string[];
}

// Wiki API fetching and parsing helpers are imported from wiki-parsers.ts

// ---------------------------------------------------------------------------
// Relic parsing
// ---------------------------------------------------------------------------

/**
 * Parse the full relics page wikitext into RelicTier objects.
 *
 * Expected format:
 *   ===Tier N (X Points)===  OR  ===Tier N===
 *   '''Passive Effects:'''
 *   * bullet ...
 *   {| class="wikitable lighttable" ...
 *   !Icon !Name !Effect
 *   |- |icon |[[RelicName (League)|RelicName]] | * effect1 * effect2
 *   |}
 */
function parseRelics(wikitext: string, relicIdPrefix = "relic"): ParsedRelicTier[] {
  const tiers: ParsedRelicTier[] = [];

  // Split on tier headers: ===Tier N=== or ===Tier N (X Points)===
  // We capture the tier number and optional point threshold
  const tierPattern = /===\s*Tier\s+(\d+)(?:\s*\((\d[\d,]*)\s*Points?\))?\s*===/gi;
  const tierMatches: Array<{ index: number; tier: number; points?: number }> = [];

  let m;
  while ((m = tierPattern.exec(wikitext)) !== null) {
    tierMatches.push({
      index: m.index,
      tier: parseInt(m[1]),
      points: m[2] ? parseInt(m[2].replace(/,/g, "")) : undefined,
    });
  }

  for (let i = 0; i < tierMatches.length; i++) {
    const start = tierMatches[i].index;
    const end = i + 1 < tierMatches.length ? tierMatches[i + 1].index : wikitext.length;
    const section = wikitext.slice(start, end);

    const tier = tierMatches[i].tier;
    const pointsToUnlock = tierMatches[i].points;

    // Parse passive effects: lines starting with * after "Passive Effects:"
    const passiveEffects = parsePassiveEffects(section);

    // Parse relic table
    const relics = parseRelicTable(section, tier, relicIdPrefix);

    tiers.push({
      tier,
      ...(pointsToUnlock !== undefined ? { pointsToUnlock } : {}),
      passiveEffects,
      relics,
    });
  }

  return tiers;
}

function parsePassiveEffects(section: string): string[] {
  const effects: string[] = [];

  // Find the passive effects block: everything between "Passive Effects:" and the next table or heading
  const passiveMatch = section.match(/'''Passive Effects:?'''[:\s]*([\s\S]*?)(?=\{\||===|$)/i);
  if (!passiveMatch) return effects;

  const block = passiveMatch[1];

  // Check if the block just says "None" or is empty
  const stripped = stripWikiMarkup(block).trim();
  if (!stripped || /^none\.?$/i.test(stripped)) return effects;

  const lines = block.split("\n");

  for (const line of lines) {
    const trimmed = line.trim();
    // Top-level bullets only (single *)
    if (/^\*\s+/.test(trimmed) && !/^\*\*/.test(trimmed)) {
      const text = stripWikiMarkup(trimmed.replace(/^\*\s*/, ""));
      if (text && !/^none\.?$/i.test(text)) effects.push(text);
    }
  }

  return effects;
}

function parseRelicTable(section: string, tier: number, relicIdPrefix = "relic"): ParsedRelic[] {
  const relics: ParsedRelic[] = [];

  // Find wikitable in this section
  const tableMatch = section.match(/\{\|[^]*?\|\}/);
  if (!tableMatch) return relics;

  const tableText = tableMatch[0];

  // Split into rows by |-
  const rows = tableText.split(/^\|-/m);

  let relicIndex = 0;

  for (const row of rows) {
    // Skip header row and empty rows
    if (row.includes("!Icon") || row.includes("!Name") || row.trim() === "" || row.startsWith("{|")) {
      continue;
    }

    // Extract relic name from the Name column.
    // Wiki table row format: |[[File:icon.png|...]] \n |[[RelicName]] \n | * effect1 \n * effect2
    // Split row into cells by newline+pipe, then search each cell for the first non-File link.
    const cells = row.split(/\n\s*\|/).map((c) => c.trim());
    let relicName: string | null = null;
    for (const cell of cells) {
      // Skip cells that are just file links (icons)
      if (/^\[\[File:|^\[\[Image:/i.test(cell)) continue;
      // Skip empty cells and header fragments
      if (!cell || cell.startsWith("{|") || cell.startsWith("!")) continue;
      // Try to extract a wiki link from this cell
      const displayMatch = cell.match(/^\[\[(?!File:|Image:)([^|\]]+?)\|([^\]]+)\]\]/);
      const simpleMatch = cell.match(/^\[\[(?!File:|Image:)([^\]|]+)\]\]/);
      if (displayMatch) {
        relicName = displayMatch[2].trim();
        break;
      }
      if (simpleMatch) {
        relicName = simpleMatch[1].replace(/\s*\([^)]+\)\s*$/, "").trim();
        break;
      }
    }

    if (!relicName) continue;

    // Title-case the relic name if it appears all-lowercase (some wiki display names are)
    relicName = titleCase(relicName);

    // Extract effects: bullet points in the Effect cell
    // Wiki bullets can be `* text` or `*text` (no space after asterisk)
    const effectLines: string[] = [];
    const effectBullets = row.match(/^\s*\*+\s*.+$/gm);
    if (effectBullets) {
      for (const bullet of effectBullets) {
        const trimmed = bullet.trim();
        // Include both top-level (*) and sub-bullet (**) effects
        if (/^\*+\s/.test(trimmed) || /^\*+[^*\s]/.test(trimmed)) {
          const isSubBullet = /^\*\*/.test(trimmed);
          const text = stripWikiMarkup(trimmed.replace(/^\*+\s*/, ""));
          if (text) {
            effectLines.push(isSubBullet ? `  - ${text}` : text);
          }
        }
      }
    }

    // Build a short description from the first effect or the relic name
    const description = effectLines.length > 0
      ? effectLines[0].replace(/^Toggleable effect:\s*/i, "").replace(/^Grants the\s+/i, "")
      : relicName;

    relicIndex++;

    relics.push({
      id: `${relicIdPrefix}-t${tier}-${relicIndex}`,
      name: relicName,
      tier,
      slot: tier,
      description,
      effects: effectLines,
    });
  }

  return relics;
}

// ---------------------------------------------------------------------------
// Combat Mastery parsing
// ---------------------------------------------------------------------------

/**
 * Fetch and parse combat masteries from {wikiPage}/Combat_Masteries.
 * Returns null if the page doesn't exist (e.g. DP has no masteries).
 */
async function parseMasteries(wikiPage: string): Promise<ParsedMasterySystem | null> {
  const pageTitle = `${wikiPage}/Combat_Masteries`;
  console.log(`  Fetching mastery page: ${pageTitle}`);
  const wikitext = await fetchWikitext(pageTitle);
  if (!wikitext) {
    console.log(`  No mastery page found — skipping`);
    return null;
  }
  console.log(`  OK: ${wikitext.length} characters`);

  const styles: ParsedCombatMastery[] = [];
  const universalPassives: string[] = [];
  const pointSources: string[] = [];

  // Parse each combat style section
  const stylePatterns: { name: string; style: "melee" | "ranged" | "magic"; id: string }[] = [
    { name: "Melee", style: "melee", id: "re-mastery-melee" },
    { name: "Ranged", style: "ranged", id: "re-mastery-ranged" },
    { name: "Magic", style: "magic", id: "re-mastery-magic" },
  ];

  for (const sp of stylePatterns) {
    // Look for section headers like == Melee == or === Melee Mastery ===
    const sectionRegex = new RegExp(`={2,3}\\s*${sp.name}(?:\\s+Mastery)?\\s*={2,3}`, "i");
    const sectionMatch = sectionRegex.exec(wikitext);
    if (!sectionMatch) continue;

    const sectionStart = sectionMatch.index + sectionMatch[0].length;
    // Find the next section header to determine section end
    const nextSectionMatch = wikitext.slice(sectionStart).match(/\n={2,3}\s*\w/);
    const sectionEnd = nextSectionMatch ? sectionStart + nextSectionMatch.index! : wikitext.length;
    const sectionText = wikitext.slice(sectionStart, sectionEnd);

    const tiers: ParsedMasteryTier[] = [];

    // Parse tier rows from wiki tables or list items
    // Format varies: could be table rows with | Tier | Effect | or list items
    // Try table format first: look for rows like | 1 || effect text or |1||effect
    const tableRowRegex = /\|\s*(?:I{1,3}V?I{0,3}|[1-6])\s*\|\|?\s*(.+)/g;
    let tierNum = 0;
    let tableMatch;
    while ((tableMatch = tableRowRegex.exec(sectionText)) !== null) {
      tierNum++;
      const effect = stripWikiMarkup(tableMatch[1].replace(/\|\|.*/, "").trim());
      if (effect) {
        tiers.push({ tier: tierNum, effect });
      }
    }

    // If table format didn't work, try bullet list format
    if (tiers.length === 0) {
      const bulletRegex = /\*\s*(?:Tier\s+)?(?:I{1,3}V?I{0,3}|[1-6])[\s:–-]+(.+)/gi;
      tierNum = 0;
      let bulletMatch;
      while ((bulletMatch = bulletRegex.exec(sectionText)) !== null) {
        tierNum++;
        const effect = stripWikiMarkup(bulletMatch[1].trim());
        if (effect) {
          tiers.push({ tier: tierNum, effect });
        }
      }
    }

    if (tiers.length > 0) {
      styles.push({
        id: sp.id,
        name: `${sp.name} Mastery`,
        style: sp.style,
        tiers,
      });
    }
  }

  // Parse universal passives — look for "Universal" section or table
  const universalRegex = /={2,3}\s*Universal(?:\s+Passive)?s?\s*={2,3}/i;
  const universalMatch = universalRegex.exec(wikitext);
  if (universalMatch) {
    const uStart = universalMatch.index + universalMatch[0].length;
    const nextSection = wikitext.slice(uStart).match(/\n={2,3}\s*\w/);
    const uEnd = nextSection ? uStart + nextSection.index! : wikitext.length;
    const uText = wikitext.slice(uStart, uEnd);

    // Try table rows or bullet list
    const uRows = uText.match(/\|\s*(?:I{1,3}V?I{0,3}|[1-6])\s*\|\|?\s*(.+)/g);
    if (uRows) {
      for (const row of uRows) {
        const effect = stripWikiMarkup(row.replace(/^\|\s*(?:I{1,3}V?I{0,3}|[1-6])\s*\|\|?\s*/, "").replace(/\|\|.*/, "").trim());
        if (effect) universalPassives.push(effect);
      }
    }
    if (universalPassives.length === 0) {
      const bullets = uText.match(/\*\s*(.+)/g);
      if (bullets) {
        for (const b of bullets) {
          const effect = stripWikiMarkup(b.replace(/^\*\s*/, "").trim());
          if (effect) universalPassives.push(effect);
        }
      }
    }
  }

  // Parse point sources — look for how points are earned
  const pointRegex = /(?:earn|obtain|gain).*?(?:mastery|combat)\s*point/i;
  const pointMatch = pointRegex.exec(wikitext);
  if (pointMatch) {
    const pStart = Math.max(0, pointMatch.index - 200);
    const pEnd = Math.min(wikitext.length, pointMatch.index + 1000);
    const pText = wikitext.slice(pStart, pEnd);
    const bullets = pText.match(/\*\s*(.+)/g);
    if (bullets) {
      for (const b of bullets) {
        const src = stripWikiMarkup(b.replace(/^\*\s*/, "").trim());
        if (src && src.length > 5) pointSources.push(src);
      }
    }
  }

  if (styles.length === 0) {
    console.log(`  WARNING: No combat mastery styles found in wiki page`);
    return null;
  }

  console.log(`  Masteries: ${styles.length} styles, ${universalPassives.length} universal passives, ${pointSources.length} point sources`);
  for (const s of styles) {
    console.log(`    ${s.name}: ${s.tiers.length} tiers`);
  }

  return {
    maxPoints: 10,
    pointSources,
    universalPassives,
    styles,
  };
}

// ---------------------------------------------------------------------------
// Task parsing
// ---------------------------------------------------------------------------

/**
 * Parse task templates from wikitext.
 *
 * Format: {{RELTaskRow|Name|Description|s=skills|other=reqs|tier=difficulty|region=Area|id=N}}
 *     or: {{DPLTaskRow|Name|Description|s=skills|other=reqs|tier=difficulty|region=Area|id=N}}
 */
function parseTasks(wikitext: string, templateName: string): ParsedTask[] {
  const tasks: ParsedTask[] = [];

  // Use brace-counting to find all template invocations, handling nested {{}} correctly
  const marker = `{{${templateName}|`;
  let searchFrom = 0;

  while (searchFrom < wikitext.length) {
    const startIdx = wikitext.indexOf(marker, searchFrom);
    if (startIdx === -1) break;

    // Find the matching closing }} by counting brace depth
    const contentStart = startIdx + marker.length;
    let depth = 1; // We're inside the outer {{ already
    let pos = contentStart;

    while (pos < wikitext.length && depth > 0) {
      if (wikitext[pos] === "{" && pos + 1 < wikitext.length && wikitext[pos + 1] === "{") {
        depth++;
        pos += 2;
      } else if (wikitext[pos] === "}" && pos + 1 < wikitext.length && wikitext[pos + 1] === "}") {
        depth--;
        if (depth === 0) break;
        pos += 2;
      } else {
        pos++;
      }
    }

    if (depth === 0) {
      const innerContent = wikitext.slice(contentStart, pos);
      const task = parseTaskTemplate(innerContent, templateName);
      if (task) tasks.push(task);
      searchFrom = pos + 2;
    } else {
      // Malformed template, skip past the marker
      searchFrom = contentStart;
    }
  }

  return tasks;
}

function parseTaskTemplate(inner: string, _templateName: string): ParsedTask | null {
  // Split on | but respect nested {{ }}
  const parts = splitTemplateParts(inner);

  if (parts.length < 2) return null;

  const name = stripWikiMarkup(parts[0]).trim();
  const description = stripWikiMarkup(parts[1]).trim();

  if (!name) return null;

  // Parse named parameters
  const params: Record<string, string> = {};
  for (let i = 2; i < parts.length; i++) {
    const eqIndex = parts[i].indexOf("=");
    if (eqIndex !== -1) {
      const key = parts[i].slice(0, eqIndex).trim().toLowerCase();
      const value = parts[i].slice(eqIndex + 1).trim();
      params[key] = value;
    }
  }

  const tier = (params.tier || "easy").toLowerCase();
  const region = params.region || "General";
  const id = params.id || "";
  const skills = parseSkillsParam(params.s || "");

  // Map region name to a category
  const category = mapRegionToCategory(region, name, skills);

  // Sanitize: strip any skills entries containing wiki markup
  const cleanSkills = skills.filter(s => !s.includes('}}') && !s.includes('[['));

  // Sanitize: strip wiki markup from category
  const cleanCategory = (category.includes('}}') || category.includes('[[')) ? 'Diary' : category;

  return {
    id: id ? `task-${id}` : `task-${slugify(name)}`,
    name,
    description,
    difficulty: tier,
    points: DIFFICULTY_POINTS[tier] ?? 10,
    category: cleanCategory,
    region: region !== "General" ? slugify(region) : undefined,
    skills: cleanSkills,
  };
}

// splitTemplateParts imported from wiki-parsers.ts

function mapRegionToCategory(region: string, taskName: string, skills: string[]): string {
  if (region !== "General" && region !== "") {
    return region;
  }
  if (skills.length > 0) return skills[0];

  // Infer from task name keywords
  const lowerName = taskName.toLowerCase();
  if (lowerName.includes("quest")) return "Quests";
  if (lowerName.includes("clue")) return "Clues";
  if (lowerName.includes("combat") || lowerName.includes("kill") || lowerName.includes("defeat")) return "Combat";
  if (lowerName.includes("slayer")) return "Slayer";

  return "General";
}

// ---------------------------------------------------------------------------
// Region parsing
// ---------------------------------------------------------------------------

/**
 * Parse regions from the main league page's Areas section.
 *
 * Expected format uses area templates:
 *   {{RE|Misthalin}} or {{DPL|Varlamore}}
 *
 * We parse these from the Universal/Default and Unlockable sub-sections.
 */
function parseRegions(wikitext: string, areaTemplate: string, leagueSlug: string): ParsedRegion[] {
  const regions: ParsedRegion[] = [];
  const seen = new Set<string>();

  // Find the Areas section
  const areasMatch = wikitext.match(/==\s*Areas?\s*==\s*([\s\S]*?)(?=\n==\s*[^=]|$)/);
  if (!areasMatch) return regions;

  const areasSection = areasMatch[1];

  // Detect sub-sections
  const defaultMatch = areasSection.match(/===\s*(?:Default|Universal)\s*areas?\s*===\s*([\s\S]*?)(?=\n===|$)/i);
  const unlockableMatch = areasSection.match(/===\s*Unlockable\s*areas?\s*===\s*([\s\S]*?)(?=\n===|$)/i);

  // Parse default/starting areas
  if (defaultMatch) {
    const templateRegex = new RegExp(`\\{\\{${escapeRegex(areaTemplate)}\\|([^}]+)\\}\\}`, "g");
    let m;
    let isFirst = true;
    while ((m = templateRegex.exec(defaultMatch[1])) !== null) {
      const areaName = m[1].trim();
      const areaId = slugify(areaName);
      if (!seen.has(areaId)) {
        seen.add(areaId);
        // First area is "starting", others in default section are "auto-unlock"
        regions.push({
          id: areaId,
          name: areaName,
          type: isFirst ? "starting" : "auto-unlock",
        });
        isFirst = false;
      }
    }
  }

  // Parse unlockable areas
  if (unlockableMatch) {
    const templateRegex = new RegExp(`\\{\\{${escapeRegex(areaTemplate)}\\|([^}]+)\\}\\}`, "g");
    let m;
    while ((m = templateRegex.exec(unlockableMatch[1])) !== null) {
      const areaName = m[1].trim();
      const areaId = slugify(areaName);
      if (!seen.has(areaId)) {
        seen.add(areaId);
        regions.push({
          id: areaId,
          name: areaName,
          type: "choosable",
        });
      }
    }
  }

  // Check for explicitly inaccessible areas (e.g. "Misthalin is not accessible")
  const inaccessibleMatch = areasSection.match(/\[\[(\w+)\]\]\s+is\s+not\s+accessible/i);
  if (inaccessibleMatch) {
    const areaName = inaccessibleMatch[1].trim();
    const areaId = slugify(areaName);
    if (!seen.has(areaId)) {
      seen.add(areaId);
      regions.push({
        id: areaId,
        name: areaName,
        type: "inaccessible",
      });
    }
  }

  // For DP, check for Misthalin inaccessibility in general text
  if (leagueSlug === "demonic-pacts" && !seen.has("misthalin")) {
    const fullText = wikitext.toLowerCase();
    if (fullText.includes("misthalin") && (fullText.includes("not accessible") || fullText.includes("inaccessible"))) {
      regions.push({
        id: "misthalin",
        name: "Misthalin",
        type: "inaccessible",
      });
    }
  }

  return regions;
}

// ---------------------------------------------------------------------------
// Region enrichment (fills empty descriptions/keyContent from wiki area pages)
// ---------------------------------------------------------------------------

const REGION_WIKI_PAGES: Record<string, string> = {
  misthalin: "Misthalin",
  karamja: "Karamja",
  asgarnia: "Asgarnia",
  kandarin: "Kandarin",
  fremennik: "Fremennik Province",
  morytania: "Morytania",
  desert: "Kharidian Desert",
  tirannwn: "Tirannwn",
  wilderness: "Wilderness",
  kebos: "Kebos Lowlands",
  kourend: "Great Kourend",
  varlamore: "Varlamore",
  "fossil-island": "Fossil Island",
};

interface RegionEnrichment {
  description: string;
  keyContent: string[];
}

async function enrichRegionData(
  regions: ParsedRegion[],
  existingRegions?: Array<Record<string, unknown>>,
): Promise<Map<string, RegionEnrichment>> {
  const enrichments = new Map<string, RegionEnrichment>();

  // Find regions that need enrichment (empty description in existing data or no existing data)
  const needsEnrichment: { id: string; wikiPage: string }[] = [];
  for (const region of regions) {
    const existing = existingRegions?.find((r) => String(r.id) === region.id);
    const hasDescription = existing && typeof existing.description === "string" && existing.description.length > 10;
    if (!hasDescription && REGION_WIKI_PAGES[region.id]) {
      needsEnrichment.push({ id: region.id, wikiPage: REGION_WIKI_PAGES[region.id] });
    }
  }

  if (needsEnrichment.length === 0) return enrichments;

  console.log(`  Enriching ${needsEnrichment.length} regions from wiki area pages...`);

  const pageNames = needsEnrichment.map((r) => r.wikiPage);
  const wikitextMap = await fetchBulkWikitext(pageNames);

  for (const { id, wikiPage } of needsEnrichment) {
    const wikitext = wikitextMap.get(wikiPage);
    if (!wikitext) continue;

    // Extract description from page intro (first 1-2 sentences after infobox)
    let description = "";
    const introMatch = wikitext.match(
      /\}\}\s*\n(?:\s*\{\{[^{}]*\}\}\s*\n)*(?:\s*\[\[File:[^\]]*\]\]\s*\n)*([\s\S]+?)(?=\n==)/
    );
    if (introMatch) {
      const rawDesc = stripWikiMarkup(introMatch[1]).replace(/\s+/g, " ").trim();
      const sentences = rawDesc.match(/[^.!?]+[.!?]+/g);
      description = sentences ? sentences.slice(0, 2).join("").trim() : rawDesc.slice(0, 200);
    }

    // Extract keyContent from "Notable features" / "Activities" / "Locations" sections
    const keyContent: string[] = [];
    const sectionPatterns = [
      /==\s*(?:Notable\s+features?|Key\s+features?)\s*==\s*([\s\S]*?)(?=\n==|$)/i,
      /==\s*(?:Activities|Things\s+to\s+do)\s*==\s*([\s\S]*?)(?=\n==|$)/i,
      /==\s*(?:Notable\s+locations?|Locations?)\s*==\s*([\s\S]*?)(?=\n==|$)/i,
      /==\s*(?:Subregions?|Areas?)\s*==\s*([\s\S]*?)(?=\n==|$)/i,
    ];
    for (const pattern of sectionPatterns) {
      const match = wikitext.match(pattern);
      if (match) {
        // Extract wiki links as key content items
        const linkPattern = /\[\[([^\]|]+?)(?:\|[^\]]+)?\]\]/g;
        let lm;
        while ((lm = linkPattern.exec(match[1])) !== null && keyContent.length < 12) {
          const item = lm[1].trim();
          if (item.length > 2 && !item.includes("File:") && !item.includes("Category:") && !keyContent.includes(item)) {
            keyContent.push(item);
          }
        }
      }
    }

    if (description || keyContent.length > 0) {
      enrichments.set(id, { description, keyContent });
    }
  }

  console.log(`  Enriched ${enrichments.size} regions with wiki data`);
  return enrichments;
}

// ---------------------------------------------------------------------------
// Reward tier parsing
// ---------------------------------------------------------------------------

/**
 * Parse trophy reward tiers from the Rewards/Trophies section.
 *
 * Expected format:
 *   {| class="wikitable ..."
 *   !colspan=2|Trophy !!Required points
 *   |- |{{plinkt|...trophy}} || 60,000
 *   ...
 *   |}
 */
function parseRewardTiers(wikitext: string): ParsedRewardTier[] {
  const tiers: ParsedRewardTier[] = [];

  // Find the Rewards section (broad match to capture trophies + cosmetics)
  const rewardsSection = wikitext.match(/==\s*Rewards?\s*==\s*([\s\S]*?)(?=\n==\s*[^=]|$)/i);
  if (!rewardsSection) return tiers;

  const section = rewardsSection[1];

  // Find trophy table entries: lines containing "trophy" and a point number
  // Format: |{{plinkt|Raging echoes dragon trophy}}||60,000
  const trophyPattern = /\{\{plinkt\|[^}]*?(bronze|iron|steel|mithril|adamant|rune|dragon)\s+trophy[^}]*\}\}\s*\|\|?\s*([\d,]+)/gi;

  let m;
  while ((m = trophyPattern.exec(section)) !== null) {
    const tierName = capitalize(m[1]);
    const points = parseInt(m[2].replace(/,/g, ""));
    if (!isNaN(points)) {
      tiers.push({ name: tierName, pointsRequired: points, cosmetics: [] });
    }
  }

  // Sort by points ascending (Bronze → Dragon)
  tiers.sort((a, b) => a.pointsRequired - b.pointsRequired);

  // Parse cosmetic rewards from {{plinkt|...}} patterns throughout rewards section
  // These are items like teleports, outfits, ornament kits
  const cosmeticPattern = /\{\{plinkt\|([^}]+)\}\}/gi;
  let cm;
  while ((cm = cosmeticPattern.exec(section)) !== null) {
    const itemName = cm[1].trim();
    // Skip trophies (already parsed above)
    if (/trophy/i.test(itemName)) continue;

    // Classify cosmetic type
    let type = "cosmetic";
    const lower = itemName.toLowerCase();
    if (/teleport|home\s+teleport/i.test(lower)) type = "home_teleport";
    else if (/outfit|kit\s+\(|robes?|garb|legs|top|hat|boots/i.test(lower)) type = "outfit";
    else if (/ornament\s+kit/i.test(lower)) type = "ornament_kit";
    else if (/title/i.test(lower)) type = "title";

    // Try to associate with the nearest tier by checking the surrounding context
    // Find which tier's point threshold this cosmetic falls near
    const contextBefore = section.slice(0, cm.index);
    const lastPointMatch = contextBefore.match(/(\d[\d,]*)\s*(?:points?|pts)/gi);
    if (lastPointMatch && tiers.length > 0) {
      const lastPoints = parseInt(lastPointMatch[lastPointMatch.length - 1].replace(/[,\s]/g, ""));
      const matchingTier = tiers.find((t) => t.pointsRequired === lastPoints)
        ?? tiers[tiers.length - 1];
      matchingTier.cosmetics.push({ name: itemName, type });
    } else if (tiers.length > 0) {
      // Default to last tier
      tiers[tiers.length - 1].cosmetics.push({ name: itemName, type });
    }
  }

  return tiers;
}

// ---------------------------------------------------------------------------
// Mechanic changes parsing
// ---------------------------------------------------------------------------

function parseMechanicChanges(wikitext: string): string[] {
  const changes: string[] = [];
  const seen = new Set<string>();

  // Prefer specific sub-sections; only fall back to the broad "Rules" section
  // if the specific ones yield nothing.
  const specificPatterns = [
    /===\s*Game\s+mechanic\s+changes?\s*===\s*([\s\S]*?)(?=\n===|$)/i,
    /===\s*Boss\s+and\s+drop\s+changes?\s*===\s*([\s\S]*?)(?=\n===|$)/i,
    /===\s*Player\s+restrictions?\s*===\s*([\s\S]*?)(?=\n===|$)/i,
    /===\s*Changes\s+from\s+previous\s+Leagues?\s*===\s*([\s\S]*?)(?=\n===|$)/i,
    /===\s*Accommodations\s+due\s+to\s+region\s+locking\s*===\s*([\s\S]*?)(?=\n===|$)/i,
  ];

  function extractBullets(block: string): void {
    const lines = block.split("\n");
    for (const line of lines) {
      const trimmed = line.trim();
      // Skip sub-section headings
      if (trimmed.startsWith("===")) continue;
      // Top-level bullets only
      if (/^\*\s+/.test(trimmed) && !/^\*\*/.test(trimmed)) {
        const text = stripWikiMarkup(trimmed.replace(/^\*\s*/, ""));
        // Filter out very short entries (likely fragments) and quest names
        if (text && text.length > 15 && !seen.has(text)) {
          seen.add(text);
          changes.push(text);
        }
      }
    }
  }

  for (const pattern of specificPatterns) {
    const match = wikitext.match(pattern);
    if (match) extractBullets(match[1]);
  }

  // If we found nothing from specific sections, try the broad "Rules" section
  if (changes.length === 0) {
    const rulesMatch = wikitext.match(/==\s*Rules?\s*==\s*([\s\S]*?)(?=\n==\s*[^=]|$)/i);
    if (rulesMatch) extractBullets(rulesMatch[1]);
  }

  return changes;
}

// ---------------------------------------------------------------------------
// Auto-completed quests parsing
// ---------------------------------------------------------------------------

function parseAutoCompletedQuests(wikitext: string): string[] {
  const quests: string[] = [];

  // Look for "Auto-completed quests" section
  const match = wikitext.match(/===?\s*Auto[- ]completed\s+quests?\s*===?\s*([\s\S]*?)(?=\n===?\s*[^=]|$)/i);
  if (!match) return quests;

  const block = match[1];

  // Parse bullet points with quest names (often wiki links)
  const linkPattern = /\[\[([^\]|]+?)(?:\|[^\]]+)?\]\]/g;
  let m;
  while ((m = linkPattern.exec(block)) !== null) {
    const questName = m[1].trim();
    if (questName && !questName.includes("File:") && !questName.includes("Category:")) {
      quests.push(questName);
    }
  }

  // Also parse plain bullet items that aren't links
  const lines = block.split("\n");
  for (const line of lines) {
    const trimmed = line.trim();
    if (/^\*\s+/.test(trimmed)) {
      const text = stripWikiMarkup(trimmed.replace(/^\*\s*/, ""));
      if (text && !quests.includes(text) && text.length > 3) {
        quests.push(text);
      }
    }
  }

  return quests;
}

// ---------------------------------------------------------------------------
// Infobox parsing (dates, description)
// ---------------------------------------------------------------------------

interface InfoboxData {
  startDate: string;
  endDate: string;
  description: string;
}

function parseInfobox(wikitext: string): InfoboxData {
  const result: InfoboxData = {
    startDate: "",
    endDate: "",
    description: "",
  };

  // Extract dates from Infobox
  // |open = [[27 November]] [[2024]]  OR  |open = 15 April 2026
  const openMatch = wikitext.match(/\|\s*open\s*=\s*(.+)/i);
  if (openMatch) {
    result.startDate = parseWikiDate(openMatch[1].trim());
  }

  const endMatch = wikitext.match(/\|\s*end\s*=\s*(.+)/i);
  if (endMatch) {
    result.endDate = parseWikiDate(endMatch[1].trim());
  }

  // Extract first substantial paragraph as description.
  // Strategy: find the text block between the infobox/guide templates and the first section heading.
  // We work on the full text (not line-by-line) to handle multi-line templates like {{CiteTwitter}}.

  // Find where the infobox ends (last }} before actual text)
  // Look for the first line of real text after any standalone templates
  const descBlockMatch = wikitext.match(
    /\}\}\s*\n(?:\s*\{\{[A-Z][^{}]*\}\}\s*\n)*(?:\s*\[\[File:[^\]]*\]\]\s*\n)*([\s\S]+?)(?=\n==)/
  );

  if (descBlockMatch) {
    // Strip all wiki markup from the captured block (handles multi-line templates)
    let rawDesc = stripWikiMarkup(descBlockMatch[1]);
    rawDesc = rawDesc.replace(/\s+/g, " ").trim();

    // Take the first 2-3 sentences to keep it concise
    const sentences = rawDesc.match(/[^.!?]+[.!?]+/g);
    if (sentences && sentences.length > 3) {
      result.description = sentences.slice(0, 3).join("").trim();
    } else {
      result.description = rawDesc;
    }
  }

  return result;
}

/**
 * Parse wiki date formats:
 *  "[[27 November]] [[2024]]" → "2024-11-27"
 *  "15 April 2026" → "2026-04-15"
 *  "22 January 2025" → "2025-01-22"
 */
function parseWikiDate(raw: string): string {
  const cleaned = stripWikiMarkup(raw).trim();
  if (!cleaned) return "";

  const monthNames: Record<string, string> = {
    january: "01", february: "02", march: "03", april: "04",
    may: "05", june: "06", july: "07", august: "08",
    september: "09", october: "10", november: "11", december: "12",
  };

  // Try "DD Month YYYY" or "Month DD, YYYY"
  const match1 = cleaned.match(/(\d{1,2})\s+(\w+)\s+(\d{4})/);
  if (match1) {
    const day = match1[1].padStart(2, "0");
    const month = monthNames[match1[2].toLowerCase()];
    const year = match1[3];
    if (month) return `${year}-${month}-${day}`;
  }

  const match2 = cleaned.match(/(\w+)\s+(\d{1,2}),?\s+(\d{4})/);
  if (match2) {
    const month = monthNames[match2[1].toLowerCase()];
    const day = match2[2].padStart(2, "0");
    const year = match2[3];
    if (month) return `${year}-${month}-${day}`;
  }

  return cleaned;
}

// ---------------------------------------------------------------------------
// Max regions heuristic
// ---------------------------------------------------------------------------

function parseMaxRegions(wikitext: string): number {
  // "Up to three other areas" or "A maximum of three additional regions"
  const match = wikitext.match(/(?:up\s+to|maximum\s+of)\s+(\w+)\s+(?:other|additional)\s+(?:areas?|regions?)/i);
  if (match) {
    const wordToNum: Record<string, number> = {
      one: 1, two: 2, three: 3, four: 4, five: 5,
      six: 6, seven: 7, eight: 8, nine: 9,
    };
    const word = match[1].toLowerCase();
    return wordToNum[word] ?? (parseInt(word) || 3);
  }

  // "all areas are unlocked" or "all regions accessible"
  if (/all\s+(?:areas?|regions?)\s+(?:are\s+)?(?:unlocked|accessible)/i.test(wikitext)) {
    return 0;
  }

  return 3; // default
}

// ---------------------------------------------------------------------------
// XP multiplier parsing
// ---------------------------------------------------------------------------

function parseBaseXpMultiplier(wikitext: string): number {
  // Look for "XP multiplier is 5x" or "5x XP rates" in tier 1 passive effects
  const match = wikitext.match(/(?:XP\s+multiplier\s+is\s+|^|\s)(\d+)x(?:\s+XP)?/im);
  return match ? parseInt(match[1]) : 5;
}

// ---------------------------------------------------------------------------
// Code generation
// ---------------------------------------------------------------------------

function generateTypeScriptFile(data: ParsedLeagueData, config: LeagueConfig): string {
  const lines: string[] = [];
  const indent = "  ";

  // Add @ts-nocheck for large task arrays — TS chokes on 1000+ object literal unions
  if (data.tasks.length > 100) {
    lines.push(`// @ts-nocheck — generated file with ${data.tasks.length} tasks exceeds TS union limit`);
  }
  lines.push(`import type { LeagueData, LeagueTask } from "@/types/league";`);
  lines.push(``);

  // Emit tasks as a separate typed array to avoid TS union complexity with large arrays
  if (data.tasks.length > 100) {
    lines.push(`const tasks: LeagueTask[] = [`);
    for (const task of data.tasks) {
      lines.push(`${indent}{`);
      lines.push(`${indent}${indent}id: ${q(task.id)},`);
      lines.push(`${indent}${indent}name: ${q(task.name)},`);
      lines.push(`${indent}${indent}description: ${q(task.description)},`);
      lines.push(`${indent}${indent}difficulty: ${q(task.difficulty)},`);
      lines.push(`${indent}${indent}points: ${task.points},`);
      lines.push(`${indent}${indent}category: ${q(task.category)},`);
      if (task.region) {
        lines.push(`${indent}${indent}region: ${q(task.region)},`);
      }
      if (task.skills.length > 0) {
        lines.push(`${indent}${indent}skills: [${task.skills.map(q).join(", ")}],`);
      }
      lines.push(`${indent}},`);
    }
    lines.push(`];`);
    lines.push(``);
  }

  lines.push(`export const ${config.exportName}: LeagueData = {`);
  lines.push(`${indent}id: ${q(data.id)},`);
  lines.push(`${indent}name: ${q(data.name)},`);
  lines.push(`${indent}leagueNumber: ${data.leagueNumber},`);
  lines.push(`${indent}description:`);
  lines.push(`${indent}${indent}${q(data.description)},`);
  lines.push(`${indent}startDate: ${q(data.startDate)},`);
  lines.push(`${indent}endDate: ${q(data.endDate)},`);
  lines.push(`${indent}wikiUrl: ${q(data.wikiUrl)},`);
  lines.push(`${indent}lastSynced: ${q(new Date().toISOString().split("T")[0])},`);
  lines.push(`${indent}baseXpMultiplier: ${data.baseXpMultiplier},`);
  lines.push(`${indent}baseDropMultiplier: 2,`);
  lines.push(`${indent}maxRegions: ${data.maxRegions},`);
  lines.push(``);

  // Regions — use existing full regions if wiki found none, otherwise use wiki regions enriched with existing descriptions
  const existingRegions = (data as unknown as Record<string, unknown>).existingRegions as Array<Record<string, unknown>> | undefined;
  if (existingRegions && existingRegions.length > 0) {
    // Whole regions preserved from existing file
    lines.push(`${indent}regions: [`);
    for (const region of existingRegions) {
      lines.push(`${indent}${indent}{`);
      lines.push(`${indent}${indent}${indent}id: ${q(String(region.id))},`);
      lines.push(`${indent}${indent}${indent}name: ${q(String(region.name))},`);
      lines.push(`${indent}${indent}${indent}description: ${q(String(region.description ?? ""))},`);
      lines.push(`${indent}${indent}${indent}type: ${q(String(region.type))},`);
      if (region.tasksToUnlock !== undefined) {
        lines.push(`${indent}${indent}${indent}tasksToUnlock: ${Number(region.tasksToUnlock)},`);
      }
      const kc = Array.isArray(region.keyContent) ? region.keyContent.map(String) : [];
      lines.push(`${indent}${indent}${indent}keyContent: [${kc.map(q).join(", ")}],`);
      if (region.echoBoss) {
        lines.push(`${indent}${indent}${indent}echoBoss: ${q(String(region.echoBoss))},`);
      }
      lines.push(`${indent}${indent}},`);
    }
    lines.push(`${indent}],`);
  } else {
    lines.push(`${indent}regions: [`);
    for (const region of data.regions) {
      lines.push(`${indent}${indent}{`);
      lines.push(`${indent}${indent}${indent}id: ${q(region.id)},`);
      lines.push(`${indent}${indent}${indent}name: ${q(region.name)},`);
      lines.push(`${indent}${indent}${indent}description: "",`);
      lines.push(`${indent}${indent}${indent}type: ${q(region.type)},`);
      lines.push(`${indent}${indent}${indent}keyContent: [],`);
      lines.push(`${indent}${indent}},`);
    }
    lines.push(`${indent}],`);
  }
  lines.push(``);

  // Relic tiers — use existing if wiki found none
  const existingRelicTiers = (data as unknown as Record<string, unknown>).existingRelicTiers as Array<Record<string, unknown>> | undefined;
  if (existingRelicTiers && existingRelicTiers.length > 0 && data.relicTiers.length === 0) {
    // Preserve existing relic tiers verbatim — re-serialize from runtime objects
    lines.push(`${indent}relicTiers: [`);
    for (const tier of existingRelicTiers) {
      lines.push(`${indent}${indent}{`);
      lines.push(`${indent}${indent}${indent}tier: ${Number(tier.tier)},`);
      if (tier.pointsToUnlock !== undefined) {
        lines.push(`${indent}${indent}${indent}pointsToUnlock: ${Number(tier.pointsToUnlock)},`);
      }
      const passives = Array.isArray(tier.passiveEffects) ? tier.passiveEffects.map(String) : [];
      lines.push(`${indent}${indent}${indent}passiveEffects: [`);
      for (const effect of passives) {
        lines.push(`${indent}${indent}${indent}${indent}${q(effect)},`);
      }
      lines.push(`${indent}${indent}${indent}],`);
      const relics = Array.isArray(tier.relics) ? tier.relics as Record<string, unknown>[] : [];
      lines.push(`${indent}${indent}${indent}relics: [`);
      for (const relic of relics) {
        lines.push(`${indent}${indent}${indent}${indent}{`);
        lines.push(`${indent}${indent}${indent}${indent}${indent}id: ${q(String(relic.id))},`);
        lines.push(`${indent}${indent}${indent}${indent}${indent}name: ${q(String(relic.name))},`);
        lines.push(`${indent}${indent}${indent}${indent}${indent}tier: ${Number(relic.tier)},`);
        lines.push(`${indent}${indent}${indent}${indent}${indent}slot: ${Number(relic.slot)},`);
        lines.push(`${indent}${indent}${indent}${indent}${indent}description: ${q(String(relic.description))},`);
        const effects = Array.isArray(relic.effects) ? relic.effects.map(String) : [];
        lines.push(`${indent}${indent}${indent}${indent}${indent}effects: [`);
        for (const effect of effects) {
          lines.push(`${indent}${indent}${indent}${indent}${indent}${indent}${q(effect)},`);
        }
        lines.push(`${indent}${indent}${indent}${indent}${indent}],`);
        if (Array.isArray(relic.synergies) && relic.synergies.length > 0) {
          lines.push(`${indent}${indent}${indent}${indent}${indent}synergies: [${relic.synergies.map((s: unknown) => q(String(s))).join(", ")}],`);
        }
        lines.push(`${indent}${indent}${indent}${indent}},`);
      }
      lines.push(`${indent}${indent}${indent}],`);
      lines.push(`${indent}${indent}},`);
    }
    lines.push(`${indent}],`);
    lines.push(``);
  } else {

  lines.push(`${indent}relicTiers: [`);
  for (const tier of data.relicTiers) {
    lines.push(`${indent}${indent}{`);
    lines.push(`${indent}${indent}${indent}tier: ${tier.tier},`);
    if (tier.pointsToUnlock !== undefined) {
      lines.push(`${indent}${indent}${indent}pointsToUnlock: ${tier.pointsToUnlock},`);
    }
    lines.push(`${indent}${indent}${indent}passiveEffects: [`);
    for (const effect of tier.passiveEffects) {
      lines.push(`${indent}${indent}${indent}${indent}${q(effect)},`);
    }
    lines.push(`${indent}${indent}${indent}],`);
    lines.push(`${indent}${indent}${indent}relics: [`);
    for (const relic of tier.relics) {
      lines.push(`${indent}${indent}${indent}${indent}{`);
      lines.push(`${indent}${indent}${indent}${indent}${indent}id: ${q(relic.id)},`);
      lines.push(`${indent}${indent}${indent}${indent}${indent}name: ${q(relic.name)},`);
      lines.push(`${indent}${indent}${indent}${indent}${indent}tier: ${relic.tier},`);
      lines.push(`${indent}${indent}${indent}${indent}${indent}slot: ${relic.slot},`);
      lines.push(`${indent}${indent}${indent}${indent}${indent}description: ${q(relic.description)},`);
      lines.push(`${indent}${indent}${indent}${indent}${indent}effects: [`);
      for (const effect of relic.effects) {
        lines.push(`${indent}${indent}${indent}${indent}${indent}${indent}${q(effect)},`);
      }
      lines.push(`${indent}${indent}${indent}${indent}${indent}],`);
      lines.push(`${indent}${indent}${indent}${indent}},`);
    }
    lines.push(`${indent}${indent}${indent}],`);
    lines.push(`${indent}${indent}},`);
  }
  lines.push(`${indent}],`);
  lines.push(``);
  } // end else for existingRelicTiers

  // Masteries — emit if present (from wiki parse or existing data)
  const existingMasteries = (data as unknown as Record<string, unknown>).existingMasteries as Record<string, unknown> | undefined;
  const masteriesData = data.masteries ?? (existingMasteries as unknown as ParsedMasterySystem | undefined);
  if (masteriesData && masteriesData.styles.length > 0) {
    lines.push(`${indent}masteries: {`);
    lines.push(`${indent}${indent}maxPoints: ${masteriesData.maxPoints},`);
    lines.push(`${indent}${indent}pointSources: [`);
    for (const src of masteriesData.pointSources) {
      lines.push(`${indent}${indent}${indent}${q(src)},`);
    }
    lines.push(`${indent}${indent}],`);
    lines.push(`${indent}${indent}universalPassives: [`);
    for (const passive of masteriesData.universalPassives) {
      lines.push(`${indent}${indent}${indent}${q(passive)},`);
    }
    lines.push(`${indent}${indent}],`);
    lines.push(`${indent}${indent}styles: [`);
    for (const style of masteriesData.styles) {
      lines.push(`${indent}${indent}${indent}{`);
      lines.push(`${indent}${indent}${indent}${indent}id: ${q(style.id)},`);
      lines.push(`${indent}${indent}${indent}${indent}name: ${q(style.name)},`);
      lines.push(`${indent}${indent}${indent}${indent}style: ${q(style.style)},`);
      lines.push(`${indent}${indent}${indent}${indent}tiers: [`);
      for (const tier of style.tiers) {
        lines.push(`${indent}${indent}${indent}${indent}${indent}{ tier: ${tier.tier}, effect: ${q(tier.effect)} },`);
      }
      lines.push(`${indent}${indent}${indent}${indent}],`);
      lines.push(`${indent}${indent}${indent}},`);
    }
    lines.push(`${indent}${indent}],`);
    lines.push(`${indent}},`);
    lines.push(``);
  }

  // Pacts — use existing if available (wiki doesn't output structured pact data)
  const existingPacts = (data as unknown as Record<string, unknown>).existingPacts as Array<Record<string, unknown>> | undefined;
  if (existingPacts && existingPacts.length > 0) {
    lines.push(`${indent}pacts: [`);
    for (const pact of existingPacts) {
      lines.push(`${indent}${indent}{`);
      lines.push(`${indent}${indent}${indent}id: ${q(String(pact.id))},`);
      lines.push(`${indent}${indent}${indent}name: ${q(String(pact.name))},`);
      lines.push(`${indent}${indent}${indent}tier: ${Number(pact.tier)},`);
      lines.push(`${indent}${indent}${indent}category: ${q(String(pact.category))},`);
      lines.push(`${indent}${indent}${indent}description: ${q(String(pact.description))},`);
      lines.push(`${indent}${indent}${indent}bonus: ${q(String(pact.bonus))},`);
      lines.push(`${indent}${indent}${indent}penalty: ${q(String(pact.penalty))},`);
      lines.push(`${indent}${indent}},`);
    }
    lines.push(`${indent}],`);
  } else {
    lines.push(`${indent}pacts: [],`);
  }
  lines.push(``);

  // Tasks
  if (data.tasks.length > 100) {
    // Reference the pre-declared typed array
    lines.push(`${indent}tasks,`);
  } else {
    lines.push(`${indent}tasks: [`);
    for (const task of data.tasks) {
      lines.push(`${indent}${indent}{`);
      lines.push(`${indent}${indent}${indent}id: ${q(task.id)},`);
      lines.push(`${indent}${indent}${indent}name: ${q(task.name)},`);
      lines.push(`${indent}${indent}${indent}description: ${q(task.description)},`);
      lines.push(`${indent}${indent}${indent}difficulty: ${q(task.difficulty)},`);
      lines.push(`${indent}${indent}${indent}points: ${task.points},`);
      lines.push(`${indent}${indent}${indent}category: ${q(task.category)},`);
      if (task.region) {
        lines.push(`${indent}${indent}${indent}region: ${q(task.region)},`);
      }
      if (task.skills.length > 0) {
        lines.push(`${indent}${indent}${indent}skills: [${task.skills.map(q).join(", ")}],`);
      }
      lines.push(`${indent}${indent}},`);
    }
    lines.push(`${indent}],`);
  }
  lines.push(``);

  // Reward tiers — use existing if wiki found none
  const existingRewardTiers = (data as unknown as Record<string, unknown>).existingRewardTiers as Array<Record<string, unknown>> | undefined;
  if (existingRewardTiers && existingRewardTiers.length > 0 && data.rewardTiers.length === 0) {
    lines.push(`${indent}rewardTiers: [`);
    for (const tier of existingRewardTiers) {
      lines.push(`${indent}${indent}{`);
      lines.push(`${indent}${indent}${indent}name: ${q(String(tier.name))},`);
      lines.push(`${indent}${indent}${indent}pointsRequired: ${Number(tier.pointsRequired)},`);
      lines.push(`${indent}${indent}${indent}color: ${q(String(tier.color))},`);
      const rewards = Array.isArray(tier.rewards) ? tier.rewards as Record<string, unknown>[] : [];
      lines.push(`${indent}${indent}${indent}rewards: [`);
      for (const rew of rewards) {
        lines.push(`${indent}${indent}${indent}${indent}{ id: ${q(String(rew.id))}, name: ${q(String(rew.name))}, description: ${q(String(rew.description))}, type: ${q(String(rew.type))} },`);
      }
      lines.push(`${indent}${indent}${indent}],`);
      lines.push(`${indent}${indent}},`);
    }
    lines.push(`${indent}],`);
  } else {
    lines.push(`${indent}rewardTiers: [`);
    const tierColors: Record<string, string> = {
      Bronze: "#cd7f32",
      Iron: "#a8a8a8",
      Steel: "#71797E",
      Mithril: "#4a5d8a",
      Adamant: "#2e8b57",
      Rune: "#00b4d8",
      Dragon: "#dc2626",
    };
    for (const tier of data.rewardTiers) {
      const color = tierColors[tier.name] ?? "#ffffff";
      lines.push(`${indent}${indent}{`);
      lines.push(`${indent}${indent}${indent}name: ${q(tier.name)},`);
      lines.push(`${indent}${indent}${indent}pointsRequired: ${tier.pointsRequired},`);
      lines.push(`${indent}${indent}${indent}color: ${q(color)},`);
      lines.push(`${indent}${indent}${indent}rewards: [`);
      lines.push(`${indent}${indent}${indent}${indent}{ id: ${q(`rew-${slugify(tier.name)}`)}, name: ${q(`${data.name} Trophy (${tier.name})`)}, description: ${q(`A ${tier.name.toLowerCase()} trophy for your POH`)}, type: "trophy" },`);
      // Emit cosmetic rewards parsed from wiki
      for (const cosmetic of tier.cosmetics) {
        lines.push(`${indent}${indent}${indent}${indent}{ id: ${q(`rew-${slugify(cosmetic.name)}`)}, name: ${q(cosmetic.name)}, description: ${q(`Cosmetic reward: ${cosmetic.name}`)}, type: ${q(cosmetic.type)} },`);
      }
      lines.push(`${indent}${indent}${indent}],`);
      lines.push(`${indent}${indent}},`);
    }
    lines.push(`${indent}],`);
  }
  lines.push(``);

  // Auto-completed quests
  lines.push(`${indent}autoCompletedQuests: [`);
  for (const quest of data.autoCompletedQuests) {
    lines.push(`${indent}${indent}${q(quest)},`);
  }
  lines.push(`${indent}],`);
  lines.push(``);

  // Mechanic changes
  lines.push(`${indent}mechanicChanges: [`);
  for (const change of data.mechanicChanges) {
    lines.push(`${indent}${indent}${q(change)},`);
  }
  lines.push(`${indent}],`);

  lines.push(`};`);
  lines.push(``);

  return lines.join("\n");
}

// q() imported from wiki-parsers.ts

// Utility helpers (slugify, capitalize, titleCase, escapeRegex) imported from wiki-parsers.ts

// ---------------------------------------------------------------------------
// Main orchestrator
// ---------------------------------------------------------------------------

async function loadExistingData(config: LeagueConfig): Promise<Record<string, unknown> | null> {
  const filePath = path.join(DATA_DIR, `${config.slug}.ts`);
  if (!fs.existsSync(filePath)) return null;

  try {
    const mod = await import(filePath);
    const data = mod[config.exportName];
    if (data && typeof data === "object") return data as Record<string, unknown>;
  } catch (err) {
    console.warn(`  Could not import existing data for ${config.slug}: ${err instanceof Error ? err.message : err}`);
  }
  return null;
}

function mergeWithExisting(
  parsed: ParsedLeagueData,
  existing: Record<string, unknown>,
  config: LeagueConfig,
): ParsedLeagueData {
  const merged = { ...parsed };

  // Tasks: keep existing if wiki returned none
  if (parsed.tasks.length === 0 && Array.isArray(existing.tasks) && existing.tasks.length > 0) {
    console.log(`  [merge] Keeping ${existing.tasks.length} existing tasks (wiki had none)`);
    merged.tasks = existing.tasks.map((t: Record<string, unknown>) => ({
      id: String(t.id ?? ""),
      name: String(t.name ?? ""),
      description: String(t.description ?? ""),
      difficulty: String(t.difficulty ?? "easy"),
      points: Number(t.points ?? 10),
      category: String(t.category ?? "General"),
      region: t.region ? String(t.region) : undefined,
      skills: Array.isArray(t.skills) ? t.skills.map(String) : [],
    }));
  }

  // Pacts: keep existing if wiki returned none (generated file always outputs empty pacts)
  if (Array.isArray(existing.pacts) && existing.pacts.length > 0) {
    console.log(`  [merge] Keeping ${existing.pacts.length} existing pacts`);
    // Pacts aren't in ParsedLeagueData — we'll handle this in code generation
    (merged as unknown as Record<string, unknown>).existingPacts = existing.pacts;
  }

  // Masteries: keep existing if wiki returned none
  if (!parsed.masteries && existing.masteries && typeof existing.masteries === "object") {
    console.log(`  [merge] Keeping existing masteries`);
    (merged as unknown as Record<string, unknown>).existingMasteries = existing.masteries;
  }

  // Reward tiers: keep existing if wiki returned none
  if (parsed.rewardTiers.length === 0 && Array.isArray(existing.rewardTiers) && existing.rewardTiers.length > 0) {
    console.log(`  [merge] Keeping ${existing.rewardTiers.length} existing reward tiers (wiki had none)`);
    (merged as unknown as Record<string, unknown>).existingRewardTiers = existing.rewardTiers;
  }

  // Relic tiers: keep existing if wiki returned none
  if (parsed.relicTiers.length === 0 && Array.isArray(existing.relicTiers) && existing.relicTiers.length > 0) {
    console.log(`  [merge] Keeping ${existing.relicTiers.length} existing relic tiers (wiki had none)`);
    (merged as unknown as Record<string, unknown>).existingRelicTiers = existing.relicTiers;
  }

  // Regions: keep existing regions if they have curated descriptions and there are enough of them.
  // If wiki returned more regions than existing, prefer wiki data (e.g. when existing had a placeholder "All Areas" region).
  if (Array.isArray(existing.regions) && existing.regions.length > 0) {
    const existingRegions = existing.regions as Record<string, unknown>[];
    const hasDescriptions = existingRegions.some(
      (r) => typeof r.description === "string" && r.description.length > 0,
    );
    const wikiHasMore = parsed.regions.length > existingRegions.length;
    if (hasDescriptions && !wikiHasMore) {
      console.log(`  [merge] Keeping ${existingRegions.length} existing regions (have curated descriptions)`);
      (merged as unknown as Record<string, unknown>).existingRegions = existing.regions;
    } else if (wikiHasMore) {
      console.log(`  [merge] Using ${parsed.regions.length} wiki regions (more than ${existingRegions.length} existing)`);
    }
  }

  // Mechanic changes: keep existing if wiki returned none
  if (parsed.mechanicChanges.length === 0 && Array.isArray(existing.mechanicChanges) && existing.mechanicChanges.length > 0) {
    console.log(`  [merge] Keeping ${existing.mechanicChanges.length} existing mechanic changes (wiki had none)`);
    merged.mechanicChanges = existing.mechanicChanges.map(String);
  }

  // Auto-completed quests: keep existing if wiki returned none
  if (parsed.autoCompletedQuests.length === 0 && Array.isArray(existing.autoCompletedQuests) && existing.autoCompletedQuests.length > 0) {
    console.log(`  [merge] Keeping ${existing.autoCompletedQuests.length} existing auto-completed quests (wiki had none)`);
    merged.autoCompletedQuests = existing.autoCompletedQuests.map(String);
  }

  // Description: keep existing if wiki returned generic fallback
  if (parsed.description.includes("is league #") && typeof existing.description === "string" && existing.description.length > 0) {
    console.log(`  [merge] Keeping existing description (wiki had no infobox description)`);
    merged.description = existing.description;
  }

  // Dates: keep existing if wiki returned empty
  if (!parsed.startDate && typeof existing.startDate === "string") {
    merged.startDate = existing.startDate;
  }
  if (!parsed.endDate && typeof existing.endDate === "string") {
    merged.endDate = existing.endDate;
  }

  return merged;
}

async function syncLeague(config: LeagueConfig, dryRun: boolean, merge: boolean): Promise<void> {
  console.log(`\n${"=".repeat(60)}`);
  console.log(`  Syncing: ${config.displayName}`);
  console.log(`  Wiki page: ${config.wikiPage}`);
  console.log(`${"=".repeat(60)}\n`);

  // Step 1: Fetch main page
  console.log(`[1/3] Fetching main page: ${config.wikiPage}`);
  const mainPageText = await fetchWikitext(config.wikiPage);
  if (!mainPageText) {
    console.error(`  FAILED: Could not fetch main page. Skipping league.`);
    return;
  }
  console.log(`  OK: ${mainPageText.length} characters`);

  await sleep(REQUEST_DELAY_MS);

  // Step 2: Fetch relics page
  console.log(`[2/3] Fetching relics page: ${config.wikiPage}/Relics`);
  const relicsPageText = await fetchWikitext(`${config.wikiPage}/Relics`);
  if (!relicsPageText) {
    console.warn(`  WARNING: Could not fetch relics page. Will try inline relics from main page.`);
  } else {
    console.log(`  OK: ${relicsPageText.length} characters`);
  }

  await sleep(REQUEST_DELAY_MS);

  // Step 3: Fetch tasks page
  console.log(`[3/3] Fetching tasks page: ${config.wikiPage}/Tasks`);
  const tasksPageText = await fetchWikitext(`${config.wikiPage}/Tasks`);
  if (!tasksPageText) {
    console.warn(`  WARNING: Could not fetch tasks page. Tasks list will be empty.`);
  } else {
    console.log(`  OK: ${tasksPageText.length} characters`);
  }

  // --- Parse everything ---

  console.log(`\nParsing data...`);

  // Parse infobox for dates and description
  const infobox = parseInfobox(mainPageText);
  console.log(`  Dates: ${infobox.startDate} to ${infobox.endDate}`);

  // Parse regions from main page
  const regions = parseRegions(mainPageText, config.areaTemplate, config.slug);
  console.log(`  Regions: ${regions.length} found`);
  for (const r of regions) {
    console.log(`    - ${r.name} (${r.type})`);
  }

  // Parse relics from dedicated page or main page fallback
  const relicsSource = relicsPageText ?? mainPageText;
  const relicTiers = parseRelics(relicsSource, config.relicIdPrefix);
  const totalRelics = relicTiers.reduce((sum, t) => sum + t.relics.length, 0);
  console.log(`  Relic tiers: ${relicTiers.length}, total relics: ${totalRelics}`);
  for (const tier of relicTiers) {
    const relicNames = tier.relics.map((r) => r.name).join(", ") || "(none)";
    const points = tier.pointsToUnlock !== undefined ? ` (${tier.pointsToUnlock} pts)` : "";
    console.log(`    Tier ${tier.tier}${points}: ${tier.passiveEffects.length} passives, relics: ${relicNames}`);
  }

  // Parse tasks
  const tasks = tasksPageText ? parseTasks(tasksPageText, config.taskTemplate) : [];
  console.log(`  Tasks: ${tasks.length} parsed`);
  if (tasks.length > 0) {
    const byDifficulty: Record<string, number> = {};
    for (const t of tasks) {
      byDifficulty[t.difficulty] = (byDifficulty[t.difficulty] || 0) + 1;
    }
    for (const [diff, count] of Object.entries(byDifficulty)) {
      console.log(`    ${diff}: ${count}`);
    }
  }

  // Parse reward tiers (trophies)
  const rewardTiers = parseRewardTiers(mainPageText);
  console.log(`  Reward tiers: ${rewardTiers.length}`);
  for (const rt of rewardTiers) {
    console.log(`    ${rt.name}: ${rt.pointsRequired.toLocaleString()} pts`);
  }

  // Parse mechanic changes
  const mechanicChanges = parseMechanicChanges(mainPageText);
  console.log(`  Mechanic changes: ${mechanicChanges.length}`);

  // Parse auto-completed quests
  const autoCompletedQuests = parseAutoCompletedQuests(mainPageText);
  console.log(`  Auto-completed quests: ${autoCompletedQuests.length}`);

  // Parse max regions
  const maxRegions = parseMaxRegions(mainPageText);
  console.log(`  Max choosable regions: ${maxRegions}`);

  // Parse base XP multiplier
  const baseXpMultiplier = relicsSource ? parseBaseXpMultiplier(relicsSource) : 5;
  console.log(`  Base XP multiplier: ${baseXpMultiplier}x`);

  // Parse combat masteries (only some leagues have them)
  await sleep(REQUEST_DELAY_MS);
  const masteries = await parseMasteries(config.wikiPage);

  // --- Assemble parsed data ---

  let parsedData: ParsedLeagueData = {
    id: config.slug,
    name: config.displayName,
    leagueNumber: config.leagueNumber,
    description: infobox.description || `The ${config.displayName} is league #${config.leagueNumber} in Old School RuneScape.`,
    startDate: infobox.startDate,
    endDate: infobox.endDate,
    wikiUrl: `https://oldschool.runescape.wiki/w/${config.wikiPage}`,
    baseXpMultiplier,
    maxRegions,
    regions,
    relicTiers,
    masteries: masteries ?? undefined,
    tasks,
    rewardTiers,
    mechanicChanges,
    autoCompletedQuests,
  };

  // --- Merge with existing data if requested ---

  if (merge) {
    console.log(`\nMerge mode: loading existing data...`);
    const existing = await loadExistingData(config);
    if (existing) {
      console.log(`  Found existing data for ${config.slug}`);
      parsedData = mergeWithExisting(parsedData, existing, config);

      // Enrich regions with empty descriptions from wiki area pages
      const existingRegions = (parsedData as unknown as Record<string, unknown>).existingRegions as Array<Record<string, unknown>> | undefined;
      if (existingRegions) {
        const enrichments = await enrichRegionData(regions, existingRegions);
        for (const region of existingRegions) {
          const enrichment = enrichments.get(String(region.id));
          if (enrichment) {
            if (!region.description || String(region.description).length < 10) {
              region.description = enrichment.description;
            }
            if (!Array.isArray(region.keyContent) || region.keyContent.length === 0) {
              region.keyContent = enrichment.keyContent;
            }
          }
        }
      }
    } else {
      console.log(`  No existing data found — writing fresh`);
    }
  }

  // --- Generate TypeScript ---

  const tsCode = generateTypeScriptFile(parsedData, config);
  const outputPath = path.join(DATA_DIR, `${config.slug}.ts`);

  if (dryRun) {
    console.log(`\n--- DRY RUN: Would write to ${outputPath} ---`);
    console.log(`--- File size: ${tsCode.length} characters, ${tsCode.split("\n").length} lines ---`);
    console.log(`\n--- First 80 lines preview ---\n`);
    const previewLines = tsCode.split("\n").slice(0, 80);
    for (const line of previewLines) {
      console.log(line);
    }
    console.log(`\n... (${tsCode.split("\n").length - 80} more lines)`);
  } else {
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.writeFileSync(outputPath, tsCode, "utf-8");
    console.log(`\nWrote: ${outputPath} (${tsCode.length} chars, ${tsCode.split("\n").length} lines)`);
  }
}

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes("--dry-run");
  const merge = args.includes("--merge");
  const leagueFilter = args.find((a) => !a.startsWith("--"));

  console.log("========================================");
  console.log("  Gielinor Guide - Wiki Sync");
  console.log("========================================");
  console.log(`  Mode: ${dryRun ? "DRY RUN (no files written)" : "LIVE (will write files)"}`);
  if (merge) console.log(`  Merge: ON (preserving hand-curated data)`);
  console.log(`  Target: ${leagueFilter ?? "all leagues"}`);
  console.log(`  Output dir: ${DATA_DIR}`);
  console.log(`  Time: ${new Date().toISOString()}`);

  const targetLeagues = leagueFilter
    ? LEAGUES.filter((l) => l.slug === leagueFilter || l.wikiPage === leagueFilter)
    : LEAGUES;

  if (targetLeagues.length === 0) {
    console.error(`\nNo league found matching "${leagueFilter}".`);
    console.error(`Available leagues: ${LEAGUES.map((l) => l.slug).join(", ")}`);
    process.exit(1);
  }

  let hasErrors = false;

  for (const league of targetLeagues) {
    try {
      await syncLeague(league, dryRun, merge);
    } catch (err) {
      hasErrors = true;
      console.error(`\nERROR syncing ${league.displayName}:`);
      console.error(err instanceof Error ? err.message : err);
    }

    // Pause between leagues
    if (targetLeagues.indexOf(league) < targetLeagues.length - 1) {
      await sleep(REQUEST_DELAY_MS * 2);
    }
  }

  console.log(`\n========================================`);
  console.log(`  Sync complete. ${hasErrors ? "Some errors occurred." : "All OK."}`);
  console.log(`========================================\n`);

  if (hasErrors) process.exit(1);
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});

export {
  parseRelics,
  parseTasks,
  parseRegions,
  parseRewardTiers,
  parseInfobox,
  parseMechanicChanges,
  parseAutoCompletedQuests,
  parseWikiDate,
};

// Re-export shared utilities for consumers that imported from wiki-sync
export { fetchWikitext, stripWikiMarkup } from "./wiki-parsers";
