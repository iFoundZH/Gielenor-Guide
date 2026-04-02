/**
 * Wiki Guide Sync Utility
 *
 * Fetches guide content from the OSRS Wiki and generates TypeScript data files.
 *
 * Usage:
 *   npm run sync-guides                          # Fetch all guides
 *   npm run sync-guides -- --dry-run             # Preview without writing
 *   npm run sync-guides -- --content=skills      # Selective: skills only
 *   npm run sync-guides -- --content=skills,diaries
 *   npx tsx src/lib/wiki-sync-guides.ts          # Direct execution
 *
 * Content types: skills, ironman, quests, diaries, combat
 */

import * as fs from "node:fs";
import * as path from "node:path";
import {
  fetchBulkWikitext,
  fetchExpandedHtml,
  sleep,
  stripWikiMarkup,
  slugify,
  q,
  REQUEST_DELAY_MS,
  VALID_SKILLS,
  stripHtml,
} from "./wiki-parsers";

const PROJECT_ROOT = path.resolve(import.meta.dirname ?? __dirname, "../..");
const GUIDES_DIR = path.join(PROJECT_ROOT, "src/data/guides");

// ---------------------------------------------------------------------------
// Skill Training Guide Sync
// ---------------------------------------------------------------------------

const ALL_SKILLS = [...VALID_SKILLS];

interface ParsedTrainingMethod {
  name: string;
  levelRange: [number, number];
  xpPerHour: number | null;
  description: string;
  members: boolean;
}

interface ParsedSkillGuide {
  skill: string;
  variant: "p2p" | "f2p";
  methods: ParsedTrainingMethod[];
  wikiUrl: string;
}

function parseTrainingMethods(wikitext: string, members: boolean): ParsedTrainingMethod[] {
  const methods: ParsedTrainingMethod[] = [];

  // Split by section headers (==, ===, ====)
  const sectionPattern = /^(={2,4})\s*(.+?)\s*\1/gm;
  const sectionStarts: { index: number; title: string; level: number }[] = [];
  let m;
  while ((m = sectionPattern.exec(wikitext)) !== null) {
    // Clean title: strip wiki markup and any residual = signs
    const title = stripWikiMarkup(m[2]).replace(/^=+\s*/, "").replace(/\s*=+$/, "").trim();
    if (title) sectionStarts.push({ index: m.index, title, level: m[1].length });
  }

  for (let i = 0; i < sectionStarts.length; i++) {
    const start = sectionStarts[i].index;
    const end = i + 1 < sectionStarts.length ? sectionStarts[i + 1].index : wikitext.length;
    const section = wikitext.slice(start, end);
    const title = sectionStarts[i].title;

    // Try to extract level range from section title (handles "Levels 1-30", "Levels 1 to 30", "Level 50-70")
    const levelMatch = title.match(/[Ll]evels?\s+(\d+)\s*[-–to/]+\s*(\d+)/);
    if (!levelMatch) continue;

    const levelLow = parseInt(levelMatch[1]);
    const levelHigh = parseInt(levelMatch[2]);
    if (isNaN(levelLow) || isNaN(levelHigh)) continue;

    // Extract the method name from the title (strip the level range prefix)
    const methodNameFromTitle = title.replace(/[Ll]evels?\s+\d+\s*[-–to/]+\s*\d+\s*[-–:,]*\s*/, "").trim();

    // Extract XP/hr from section text — check bullets, paragraphs, and {{Formatnum}} wrappers
    function extractXpRate(text: string): number | null {
      // Pattern: "N xp/hr", "N experience per hour", "N xp per hour"
      const patterns = [
        /([\d,]+)\s*(?:xp|experience)\s*(?:per\s*hour|\/\s*h(?:our)?|ph)/i,
        /\{\{Formatnum[:|](\d+)\}\}\s*(?:xp|experience)\s*(?:per\s*hour|\/\s*h(?:our)?|ph)/i,
        /approximately\s+([\d,]+)\s*(?:xp|experience)/i,
        /around\s+([\d,]+)\s*(?:xp|experience)\s*per\s*hour/i,
      ];
      for (const pat of patterns) {
        const match = text.match(pat);
        if (match) return parseInt(match[1].replace(/,/g, ""));
      }
      return null;
    }

    // Extract methods from bullet points or the first paragraph
    const bullets = section.match(/^\*\s+.+$/gm);
    if (bullets && bullets.length > 0) {
      for (const bullet of bullets.slice(0, 5)) {
        const text = stripWikiMarkup(bullet.replace(/^\*\s*/, ""));
        if (text.length < 5) continue;
        const xpPerHour = extractXpRate(text);
        const name = text.split(/[-–:.]/).at(0)?.trim() || text.slice(0, 60);

        methods.push({
          name: name.length > 80 ? name.slice(0, 77) + "..." : name,
          levelRange: [levelLow, levelHigh],
          xpPerHour,
          description: text.length > 200 ? text.slice(0, 197) + "..." : text,
          members,
        });
      }
    } else {
      // Use section title as a single method
      const sectionBody = section.split("\n").filter((l) => l.trim() && !l.startsWith("=")).slice(0, 5).join(" ");
      const description = stripWikiMarkup(sectionBody);
      const xpPerHour = extractXpRate(sectionBody);
      methods.push({
        name: methodNameFromTitle || title,
        levelRange: [levelLow, levelHigh],
        xpPerHour,
        description: description.length > 200 ? description.slice(0, 197) + "..." : description,
        members,
      });
    }
  }

  // Fallback: if no methods with level ranges found, extract methods from subsection headers
  if (methods.length === 0) {
    for (let i = 0; i < sectionStarts.length; i++) {
      const start = sectionStarts[i].index;
      const end = i + 1 < sectionStarts.length ? sectionStarts[i + 1].index : wikitext.length;
      const section = wikitext.slice(start, end);
      // Clean title: strip any residual = signs from sub-headers
      const title = sectionStarts[i].title.replace(/^=+\s*/, "").replace(/\s*=+$/, "").trim();

      // Skip meta/navigation sections
      if (/^(see also|references|external links|navigation|notes|equipment|recommended|general|contents|changes|trivia|gallery)$/i.test(title)) continue;
      if (title.length < 3 || title.length > 80) continue;

      // Try to extract a level from section body (e.g., "requires level 60" or {{SCP|Skill|60}})
      const bodyLevelMatch = section.match(/(?:requires?\s+(?:level\s+)?|at\s+level\s+|level\s+)(\d+)/i);
      const scpLevelMatch = section.match(/\{\{SCP\|[^|]+\|(\d+)/);
      const level = bodyLevelMatch ? parseInt(bodyLevelMatch[1]) : (scpLevelMatch ? parseInt(scpLevelMatch[1]) : 1);

      // Extract description from body text, skipping wiki headers, table markup, and empty lines
      const sectionBody = section.split("\n")
        .filter((l) => {
          const t = l.trim();
          return t && !t.startsWith("=") && !t.startsWith("{|") && !t.startsWith("|}") && !t.startsWith("!");
        })
        .slice(0, 5)
        .join(" ");
      const description = stripWikiMarkup(sectionBody);
      if (description.length < 10) continue;
      // Skip if description is still wiki table junk
      if (/class\s*=\s*"|wikitable|rowspan|colspan/i.test(description)) continue;

      function extractXpRateFallback(text: string): number | null {
        const patterns = [
          /([\d,]+)\s*(?:xp|experience)\s*(?:per\s*hour|\/\s*h(?:our)?|ph)/i,
          /approximately\s+([\d,]+)\s*(?:xp|experience)/i,
        ];
        for (const pat of patterns) {
          const match = text.match(pat);
          if (match) return parseInt(match[1].replace(/,/g, ""));
        }
        return null;
      }

      methods.push({
        name: title.length > 80 ? title.slice(0, 77) + "..." : title,
        levelRange: [level, 99],
        xpPerHour: extractXpRateFallback(sectionBody),
        description: description.length > 200 ? description.slice(0, 197) + "..." : description,
        members,
      });
    }
  }

  return methods;
}

// Skills that don't have their own Pay-to-play_X_training page, or where
// that page redirects to a combined/generic training page.
// Map skill → alternate page name(s) to try.
const SKILL_PAGE_ALTERNATES: Record<string, string[]> = {
  Attack: ["Pay-to-play_melee_training", "melee_training"],
  Strength: ["Pay-to-play_melee_training", "melee_training"],
  Defence: ["Pay-to-play_melee_training", "melee_training"],
  Hitpoints: ["Hitpoints_training"],
  Prayer: ["Prayer_training"],
  Agility: ["Agility_training"],
  Herblore: ["Herblore_training"],
  Thieving: ["Thieving_training"],
  Fletching: ["Fletching_training"],
  Slayer: ["Slayer_training"],
  Farming: ["Farming_training"],
  Construction: ["Construction_training"],
  Hunter: ["Hunter_training"],
  Sailing: ["Sailing_training"],
};

async function syncSkillGuides(dryRun: boolean): Promise<void> {
  console.log("\n--- Syncing Skill Training Guides ---\n");
  const outputDir = path.join(GUIDES_DIR, "skills");
  fs.mkdirSync(outputDir, { recursive: true });

  const allGuides: ParsedSkillGuide[] = [];

  // Build all page names upfront for bulk fetch
  const pageNames = new Set<string>();
  for (const skill of ALL_SKILLS) {
    pageNames.add(`Pay-to-play_${skill}_training`);
    pageNames.add(`Free-to-play_${skill}_training`);
    pageNames.add(`${skill}_training`);
    // Add alternate pages for combined skills
    const alts = SKILL_PAGE_ALTERNATES[skill];
    if (alts) for (const alt of alts) pageNames.add(alt);
  }

  const allPageNames = [...pageNames];
  console.log(`  Bulk fetching ${allPageNames.length} skill guide pages...`);
  const wikitextMap = await fetchBulkWikitext(allPageNames);
  console.log(`  Got wikitext for ${wikitextMap.size} pages`);

  for (const skill of ALL_SKILLS) {
    for (const variant of ["p2p", "f2p"] as const) {
      const primaryName = variant === "p2p"
        ? `Pay-to-play_${skill}_training`
        : `Free-to-play_${skill}_training`;

      let wikitext = wikitextMap.get(primaryName) ?? null;
      let usedPage = primaryName;

      // Skip redirect pages (they start with #REDIRECT)
      if (wikitext && /^#REDIRECT/i.test(wikitext.trim())) {
        wikitext = null;
      }

      // Try alternate page names if primary doesn't exist or was a redirect
      if (!wikitext) {
        const alternates = [
          ...(SKILL_PAGE_ALTERNATES[skill] ?? []),
          `${skill}_training`,
        ];
        for (const alt of alternates) {
          const candidate = wikitextMap.get(alt) ?? null;
          if (candidate && !/^#REDIRECT/i.test(candidate.trim())) {
            wikitext = candidate;
            usedPage = alt;
            break;
          }
        }
      }

      if (!wikitext) {
        if (variant === "f2p") continue;
        console.log(`    SKIP: ${skill} (${variant}) — no page found`);
        continue;
      }

      const methods = parseTrainingMethods(wikitext, variant === "p2p");
      if (methods.length === 0) continue;

      allGuides.push({
        skill,
        variant,
        methods,
        wikiUrl: `https://oldschool.runescape.wiki/w/${usedPage}`,
      });
      console.log(`    ${skill} (${variant}): ${methods.length} methods${usedPage !== primaryName ? ` (${usedPage})` : ""}`);
    }
  }

  // Generate output files
  const indexImports: string[] = [];
  const indexExports: string[] = [];

  for (const guide of allGuides) {
    const fileName = `${slugify(guide.skill)}-${guide.variant}`;
    const exportName = `${guide.skill.toLowerCase().replace(/\s+/g, "")}${guide.variant === "p2p" ? "P2p" : "F2p"}Guide`;
    const code = generateSkillGuideFile(guide, exportName);

    if (!dryRun) {
      fs.writeFileSync(path.join(outputDir, `${fileName}.ts`), code);
    }
    indexImports.push(`import { ${exportName} } from "./${fileName}";`);
    indexExports.push(exportName);
  }

  // Write index file
  const indexCode = [
    `import type { SkillTrainingGuide } from "@/types/guides";`,
    ``,
    ...indexImports,
    ``,
    `export const skillTrainingGuides: SkillTrainingGuide[] = [`,
    ...indexExports.map((e) => `  ${e},`),
    `];`,
    ``,
    `export function getSkillGuide(skill: string, variant: "p2p" | "f2p" = "p2p"): SkillTrainingGuide | undefined {`,
    `  return skillTrainingGuides.find((g) => g.skill.toLowerCase() === skill.toLowerCase() && g.variant === variant);`,
    `}`,
    ``,
    `export function getSkillsWithGuides(): string[] {`,
    `  return [...new Set(skillTrainingGuides.map((g) => g.skill))];`,
    `}`,
    ``,
  ].join("\n");

  if (!dryRun) {
    fs.writeFileSync(path.join(outputDir, "index.ts"), indexCode);
  }
  console.log(`  Wrote ${allGuides.length} skill guide files + index`);
}

function generateSkillGuideFile(guide: ParsedSkillGuide, exportName: string): string {
  const lines: string[] = [];
  lines.push(`import type { SkillTrainingGuide } from "@/types/guides";`);
  lines.push(``);
  lines.push(`export const ${exportName}: SkillTrainingGuide = {`);
  lines.push(`  skill: ${q(guide.skill)} as SkillTrainingGuide["skill"],`);
  lines.push(`  variant: ${q(guide.variant)},`);
  lines.push(`  wikiUrl: ${q(guide.wikiUrl)},`);
  lines.push(`  methods: [`);
  for (const method of guide.methods) {
    lines.push(`    {`);
    lines.push(`      name: ${q(method.name)},`);
    lines.push(`      levelRange: [${method.levelRange[0]}, ${method.levelRange[1]}],`);
    lines.push(`      xpPerHour: ${method.xpPerHour ?? "null"},`);
    lines.push(`      description: ${q(method.description)},`);
    lines.push(`      members: ${method.members},`);
    lines.push(`    },`);
  }
  lines.push(`  ],`);
  lines.push(`};`);
  lines.push(``);
  return lines.join("\n");
}

// ---------------------------------------------------------------------------
// Ironman Guide Sync
// ---------------------------------------------------------------------------

interface ParsedGuideSection {
  title: string;
  level: number;
  content: string;
  subsections: ParsedGuideSection[];
}

const IRONMAN_PAGES: Record<string, string> = {
  standard: "Ironman_guide",
  hardcore: "Hardcore_ironman_guide",
  ultimate: "Ultimate_Ironman_Guide",
  group: "Group_ironman_guide",
};

function parseGuideSections(wikitext: string): ParsedGuideSection[] {
  const lines = wikitext.split("\n");
  const root: ParsedGuideSection[] = [];
  const stack: { level: number; section: ParsedGuideSection }[] = [];
  let currentContent: string[] = [];

  for (const line of lines) {
    const headerMatch = line.match(/^(={2,4})\s*(.+?)\s*\1\s*$/);
    if (headerMatch) {
      // Flush current content to the current section
      if (stack.length > 0) {
        const cleaned = stripWikiMarkup(currentContent.join("\n")).trim();
        if (cleaned) stack[stack.length - 1].section.content = cleaned.slice(0, 2000);
      }
      currentContent = [];

      const level = headerMatch[1].length;
      const title = stripWikiMarkup(headerMatch[2]);

      // Skip meta sections
      if (/^(see also|references|external links|navigation|notes)$/i.test(title)) continue;

      const newSection: ParsedGuideSection = { title, level, content: "", subsections: [] };

      // Pop stack to find correct parent
      while (stack.length > 0 && stack[stack.length - 1].level >= level) {
        stack.pop();
      }

      if (stack.length === 0) {
        root.push(newSection);
      } else {
        stack[stack.length - 1].section.subsections.push(newSection);
      }

      stack.push({ level, section: newSection });
    } else {
      currentContent.push(line);
    }
  }

  // Flush remaining content
  if (stack.length > 0) {
    const cleaned = stripWikiMarkup(currentContent.join("\n")).trim();
    if (cleaned) stack[stack.length - 1].section.content = cleaned.slice(0, 2000);
  }

  return root;
}

async function syncIronmanGuides(dryRun: boolean): Promise<void> {
  console.log("\n--- Syncing Ironman Guides ---\n");
  const outputDir = path.join(GUIDES_DIR, "ironman");
  fs.mkdirSync(outputDir, { recursive: true });

  const indexImports: string[] = [];
  const indexExports: string[] = [];

  // Bulk fetch all ironman guide pages
  const pageNames = Object.values(IRONMAN_PAGES);
  console.log(`  Bulk fetching ${pageNames.length} ironman guide pages...`);
  const wikitextMap = await fetchBulkWikitext(pageNames);
  console.log(`  Got wikitext for ${wikitextMap.size} pages`);

  for (const [variant, pageName] of Object.entries(IRONMAN_PAGES)) {
    const wikitext = wikitextMap.get(pageName) ?? null;

    if (!wikitext) {
      console.log(`    SKIP: Could not fetch ${pageName}`);
      continue;
    }

    const sections = parseGuideSections(wikitext);
    if (sections.length === 0) {
      console.log(`    SKIP: No sections parsed`);
      continue;
    }

    const exportName = `${variant}IronmanGuide`;
    const code = generateIronmanGuideFile(variant, sections, pageName, exportName);

    if (!dryRun) {
      fs.writeFileSync(path.join(outputDir, `${variant}.ts`), code);
    }
    indexImports.push(`import { ${exportName} } from "./${variant}";`);
    indexExports.push(exportName);
    console.log(`    OK: ${sections.length} top-level sections`);
  }

  const indexCode = [
    `import type { IronmanGuide } from "@/types/guides";`,
    ``,
    ...indexImports,
    ``,
    `export const ironmanGuides: IronmanGuide[] = [`,
    ...indexExports.map((e) => `  ${e},`),
    `];`,
    ``,
    `export function getIronmanGuide(variant: string): IronmanGuide | undefined {`,
    `  return ironmanGuides.find((g) => g.variant === variant);`,
    `}`,
    ``,
  ].join("\n");

  if (!dryRun) {
    fs.writeFileSync(path.join(outputDir, "index.ts"), indexCode);
  }
  console.log(`  Wrote ${indexExports.length} ironman guide files + index`);
}

function generateIronmanGuideFile(variant: string, sections: ParsedGuideSection[], pageName: string, exportName: string): string {
  const lines: string[] = [];
  lines.push(`import type { IronmanGuide } from "@/types/guides";`);
  lines.push(``);
  lines.push(`export const ${exportName}: IronmanGuide = {`);
  lines.push(`  variant: ${q(variant)} as IronmanGuide["variant"],`);
  lines.push(`  wikiUrl: ${q(`https://oldschool.runescape.wiki/w/${pageName}`)},`);
  lines.push(`  sections: [`);
  for (const section of sections) {
    emitSection(lines, section, 2);
  }
  lines.push(`  ],`);
  lines.push(`};`);
  lines.push(``);
  return lines.join("\n");
}

function emitSection(lines: string[], section: ParsedGuideSection, indent: number): void {
  const pad = "  ".repeat(indent);
  lines.push(`${pad}{`);
  lines.push(`${pad}  title: ${q(section.title)},`);
  lines.push(`${pad}  level: ${section.level},`);
  lines.push(`${pad}  content: ${q(section.content)},`);
  lines.push(`${pad}  subsections: [`);
  for (const sub of section.subsections) {
    emitSection(lines, sub, indent + 2);
  }
  lines.push(`${pad}  ],`);
  lines.push(`${pad}},`);
}

// ---------------------------------------------------------------------------
// Optimal Quest Order Sync
// ---------------------------------------------------------------------------

interface ParsedQuestEntry {
  order: number;
  name: string;
  questPoints: number;
  cumulativeQP: number;
  xpRewards: { skill: string; xp: number }[];
  notes: string;
}

async function syncQuestGuides(dryRun: boolean): Promise<void> {
  console.log("\n--- Syncing Quest Order Guides ---\n");
  const outputDir = path.join(GUIDES_DIR, "quests");
  fs.mkdirSync(outputDir, { recursive: true });

  const variants: { name: string; page: string; file: string; exportName: string }[] = [
    { name: "main", page: "Optimal_quest_guide", file: "optimal-quest-guide", exportName: "mainQuestGuide" },
    { name: "ironman", page: "Optimal_quest_guide/Ironman", file: "optimal-quest-guide-ironman", exportName: "ironmanQuestGuide" },
  ];

  // Bulk fetch both quest guide pages
  const pageNames = variants.map((v) => v.page);
  console.log(`  Bulk fetching ${pageNames.length} quest guide pages...`);
  const wikitextMap = await fetchBulkWikitext(pageNames);
  console.log(`  Got wikitext for ${wikitextMap.size} pages`);

  for (const v of variants) {
    const wikitext = wikitextMap.get(v.page) ?? null;

    if (!wikitext) {
      console.log(`    SKIP: Could not fetch ${v.page}`);
      continue;
    }

    const entries = parseQuestTable(wikitext);
    console.log(`    OK: ${entries.length} quests parsed`);

    const code = generateQuestGuideFile(v.name, entries, v.page, v.exportName);

    if (!dryRun) {
      fs.writeFileSync(path.join(outputDir, `${v.file}.ts`), code);
    }
  }

  // Write index
  const indexCode = [
    `import type { OptimalQuestGuide } from "@/types/guides";`,
    ``,
    `export { mainQuestGuide } from "./optimal-quest-guide";`,
    `export { ironmanQuestGuide } from "./optimal-quest-guide-ironman";`,
    ``,
    `import { mainQuestGuide } from "./optimal-quest-guide";`,
    `import { ironmanQuestGuide } from "./optimal-quest-guide-ironman";`,
    ``,
    `export const questGuides: OptimalQuestGuide[] = [mainQuestGuide, ironmanQuestGuide];`,
    ``,
    `export function getQuestGuide(variant: "main" | "ironman" = "main"): OptimalQuestGuide {`,
    `  return variant === "ironman" ? ironmanQuestGuide : mainQuestGuide;`,
    `}`,
    ``,
  ].join("\n");

  if (!dryRun) {
    fs.writeFileSync(path.join(outputDir, "index.ts"), indexCode);
  }
}

function parseQuestTable(wikitext: string): ParsedQuestEntry[] {
  const entries: ParsedQuestEntry[] = [];

  // The wiki uses |- data-rowid="QuestName" row delimiters with cells on separate lines:
  //   |- data-rowid="Cook's Assistant"
  //   |[[Cook's Assistant]]
  //   |[[Cook's Assistant/Quick guide|QG]]
  //   |{{Optimal quest|cooking=300}}
  //   |{{Optimal quest/qp|1}}
  //   |Notes text
  //   |[[Location]]
  const rows = wikitext.split(/\n\|-\s*(?:data-rowid|style)/);

  let order = 0;
  let cumulativeQP = 0;

  for (const row of rows) {
    // Extract quest name from first [[Quest Name]] link in the row
    const nameMatch = row.match(/\|\s*(?:data-sort-value="[^"]*"\|)?\[\[([^\]|]+?)(?:\|[^\]]+)?\]\]/);
    if (!nameMatch) continue;

    const rawName = nameMatch[1].trim();
    // Skip non-quest entries like "Stronghold of Security" unlock activities
    // and the Quick Guide links (they appear as second cell)
    if (rawName.endsWith("/Quick guide")) continue;

    order++;

    // Extract XP rewards from {{Optimal quest|skill=xp}} templates
    const xpRewards: { skill: string; xp: number }[] = [];
    const xpPattern = /\{\{Optimal quest\|([^=}]+)=([^|}]+)/g;
    let xpMatch;
    while ((xpMatch = xpPattern.exec(row)) !== null) {
      const skill = xpMatch[1].trim();
      const xp = parseInt(xpMatch[2].replace(/[,\s]/g, ""));
      if (skill && !isNaN(xp) && xp > 0) xpRewards.push({ skill, xp });
    }

    // Extract quest points from {{Optimal quest/qp|N}}
    let questPoints = 0;
    const qpMatch = row.match(/\{\{Optimal quest\/qp\|(\d+)/);
    if (qpMatch) questPoints = parseInt(qpMatch[1]);
    cumulativeQP += questPoints;

    // Extract notes: take cell text after the QP/XP template cells
    // Split on cell boundaries (lines starting with |)
    const cellLines = row.split(/\n\|/).filter((c) => c.trim());
    // Notes are usually in the "Additional info" cell (cell index 5 of 7)
    // Skip cells that contain templates, links to Quick Guide, or locations
    let notes = "";
    for (let i = 3; i < cellLines.length; i++) {
      const cell = cellLines[i].trim();
      if (/\{\{Optimal quest/.test(cell)) continue;
      if (/\/Quick guide/.test(cell)) continue;
      if (cell.startsWith("[[") && !cell.includes("]]")) continue;
      // Skip cells that are just a location link
      if (/^\[\[[^\]]+\]\]\s*$/.test(cell)) continue;
      const cleaned = stripWikiMarkup(cell).trim();
      if (cleaned.length > 5 && !notes) {
        notes = cleaned.length > 300 ? cleaned.slice(0, 297) + "..." : cleaned;
      }
    }

    entries.push({
      order,
      name: rawName,
      questPoints,
      cumulativeQP,
      xpRewards,
      notes,
    });
  }

  return entries;
}

function generateQuestGuideFile(variant: string, entries: ParsedQuestEntry[], pageName: string, exportName: string): string {
  const lines: string[] = [];
  lines.push(`import type { OptimalQuestGuide } from "@/types/guides";`);
  lines.push(``);
  lines.push(`export const ${exportName}: OptimalQuestGuide = {`);
  lines.push(`  variant: ${q(variant)} as OptimalQuestGuide["variant"],`);
  lines.push(`  wikiUrl: ${q(`https://oldschool.runescape.wiki/w/${pageName}`)},`);
  lines.push(`  entries: [`);
  for (const entry of entries) {
    lines.push(`    {`);
    lines.push(`      order: ${entry.order},`);
    lines.push(`      name: ${q(entry.name)},`);
    lines.push(`      questPoints: ${entry.questPoints},`);
    lines.push(`      cumulativeQP: ${entry.cumulativeQP},`);
    if (entry.xpRewards.length > 0) {
      lines.push(`      xpRewards: [${entry.xpRewards.map((r) => `{ skill: ${q(r.skill)}, xp: ${r.xp} }`).join(", ")}],`);
    } else {
      lines.push(`      xpRewards: [],`);
    }
    lines.push(`      notes: ${q(entry.notes)},`);
    lines.push(`    },`);
  }
  lines.push(`  ],`);
  lines.push(`};`);
  lines.push(``);
  return lines.join("\n");
}

// ---------------------------------------------------------------------------
// Achievement Diary Sync
// ---------------------------------------------------------------------------

const DIARY_AREAS = [
  "Ardougne_Diary", "Desert_Diary", "Falador_Diary", "Fremennik_Diary",
  "Kandarin_Diary", "Karamja_Diary", "Kourend_&_Kebos_Diary",
  "Lumbridge_&_Draynor_Diary", "Morytania_Diary", "Varrock_Diary",
  "Western_Provinces_Diary", "Wilderness_Diary",
];

interface ParsedDiaryTask {
  id: string;
  description: string;
  requirements: { type: "skill" | "quest" | "other"; description: string; skill?: string; level?: number }[];
}

interface ParsedDiaryTier {
  tier: string;
  tasks: ParsedDiaryTask[];
  rewards: { itemName: string; effects: string[] }[];
}

interface ParsedDiary {
  id: string;
  name: string;
  tiers: ParsedDiaryTier[];
  wikiUrl: string;
}

function parseDiaryTasks(wikitext: string, areaSlug: string): ParsedDiaryTier[] {
  const tiers: ParsedDiaryTier[] = [];

  for (const tierName of ["Easy", "Medium", "Hard", "Elite"]) {
    // Find the section for this tier — stop at next tier, rewards, trivia, changes, see also, etc.
    const pattern = new RegExp(
      `==\\s*${tierName}\\s*==\\s*([\\s\\S]*?)(?=\\n==\\s*(?:Easy|Medium|Hard|Elite|Reward|See also|References|Navigation|Trivia|Changes|Gallery)\\s*==|$)`,
      "i",
    );
    const match = wikitext.match(pattern);
    if (!match) continue;

    const section = match[1];
    const tasks: ParsedDiaryTask[] = [];
    let taskIdx = 0;

    // The wiki uses wikitable format with |- row delimiters:
    //   |-
    //   |1. Task description text
    //   |
    //   *{{SCP|Skill|Level|link=y}}
    // Split on |- to get individual rows
    const tableRows = section.split(/\n\|-/);
    for (const row of tableRows) {
      const trimmedRow = row.trim();
      // Skip header rows, empty rows, and wiki table markup
      if (!trimmedRow || /^[!\s]/.test(trimmedRow)) continue;
      if (/\{\|/.test(trimmedRow)) continue;            // Wiki table opening {|
      if (/class\s*=\s*".*wikitable/.test(trimmedRow)) continue; // Table class attr
      if (/data-diary-/.test(trimmedRow)) continue;     // Diary table data attrs

      // Split row into cells on lines starting with |
      const cells = row.split(/\n\|/).filter((c) => c.trim());
      if (cells.length < 1) continue;

      // First cell is the task description (e.g., "1. Have Wizard Cromperty...")
      const rawTaskCell = cells[0];

      // Skip cells that are wiki table markup (not task descriptions)
      if (/\{\|/.test(rawTaskCell) || /class\s*=\s*"/.test(rawTaskCell)) continue;

      // Extract description, stripping leading number prefix
      const descRaw = rawTaskCell.replace(/^\s*\d+\.\s*/, "");
      const description = stripWikiMarkup(descRaw).replace(/^\s*\d+\.\s*/, "").trim();
      if (!description || description.length < 5) continue;
      // Skip if this looks like a table header or wiki formatting junk
      if (/^Task$|^Requirements?$/i.test(description)) continue;
      if (/^style=|^width:|^mw-collapsible/i.test(description)) continue;

      taskIdx++;
      const requirements: ParsedDiaryTask["requirements"] = [];

      // Extract requirements from the second cell (if present)
      const reqCell = cells.length >= 2 ? cells[1] : "";

      // Parse {{SCP|Skill|Level}} patterns for skill requirements
      const scpPattern = /\{\{SCP\|([^|]+)\|(\d+)/g;
      let scpMatch;
      while ((scpMatch = scpPattern.exec(reqCell)) !== null) {
        const skill = scpMatch[1].trim();
        const level = parseInt(scpMatch[2]);
        if (skill && !isNaN(level) && level > 0) {
          requirements.push({
            type: "skill",
            description: `${skill} level ${level}`,
            skill,
            level,
          });
        }
      }

      // Parse quest requirements from {{SCP|Quest}} Completion of [[QuestName]] patterns
      const questReqPattern = /Completion of\s*\[\[([^\]|]+)/g;
      let qrMatch;
      while ((qrMatch = questReqPattern.exec(reqCell)) !== null) {
        requirements.push({
          type: "quest",
          description: `Completion of ${qrMatch[1].trim()}`,
        });
      }

      tasks.push({
        id: `diary-${areaSlug}-${tierName.toLowerCase()}-${taskIdx}`,
        description,
        requirements,
      });
    }

    // Fallback: try bullet point format if wikitable didn't work
    if (tasks.length === 0) {
      const lines = section.split("\n");
      for (const line of lines) {
        const trimmed = line.trim();
        if (!/^\*\s+/.test(trimmed) || /^\*\*/.test(trimmed)) continue;

        const rawTask = trimmed.replace(/^\*\s*/, "");
        const description = stripWikiMarkup(rawTask).trim();
        if (!description || description.length < 5) continue;

        taskIdx++;
        const requirements: ParsedDiaryTask["requirements"] = [];
        const scpPattern = /\{\{SCP\|([^|]+)\|(\d+)/g;
        let scpMatch;
        while ((scpMatch = scpPattern.exec(rawTask)) !== null) {
          requirements.push({
            type: "skill",
            description: `${scpMatch[1]} level ${scpMatch[2]}`,
            skill: scpMatch[1],
            level: parseInt(scpMatch[2]),
          });
        }

        tasks.push({
          id: `diary-${areaSlug}-${tierName.toLowerCase()}-${taskIdx}`,
          description,
          requirements,
        });
      }
    }

    // Parse rewards section (may be == or ===)
    const rewardPattern = new RegExp(
      `===?\\s*${tierName}\\s*(?:rewards?|diary)\\s*===?\\s*([\\s\\S]*?)(?=\\n===?\\s|$)`,
      "i",
    );
    const rewardMatch = wikitext.match(rewardPattern);
    const rewards: ParsedDiaryTier["rewards"] = [];
    if (rewardMatch) {
      const rewardBullets = rewardMatch[1].match(/^\*\s+.+$/gm);
      if (rewardBullets) {
        for (const bullet of rewardBullets) {
          const text = stripWikiMarkup(bullet.replace(/^\*\s*/, ""));
          rewards.push({ itemName: text.split(/[-–:]/).at(0)?.trim() || text, effects: [text] });
        }
      }
    }

    tiers.push({ tier: tierName.toLowerCase(), tasks, rewards });
  }

  return tiers;
}

async function syncDiaryGuides(dryRun: boolean): Promise<void> {
  console.log("\n--- Syncing Achievement Diary Guides ---\n");
  const outputDir = path.join(GUIDES_DIR, "diaries");
  fs.mkdirSync(outputDir, { recursive: true });

  const diaries: ParsedDiary[] = [];

  // Bulk fetch all diary pages in one call
  console.log(`  Bulk fetching ${DIARY_AREAS.length} diary pages...`);
  const wikitextMap = await fetchBulkWikitext(DIARY_AREAS);
  console.log(`  Got wikitext for ${wikitextMap.size} pages`);

  for (const pageName of DIARY_AREAS) {
    const wikitext = wikitextMap.get(pageName) ?? null;

    if (!wikitext) {
      console.log(`    SKIP: Could not fetch ${pageName}`);
      continue;
    }

    const displayName = pageName.replace(/_/g, " ").replace(" Diary", "");
    const areaSlug = slugify(displayName);
    const tiers = parseDiaryTasks(wikitext, areaSlug);
    const totalTasks = tiers.reduce((sum, t) => sum + t.tasks.length, 0);

    if (totalTasks === 0) {
      console.log(`    SKIP: No tasks parsed`);
      continue;
    }

    diaries.push({
      id: areaSlug,
      name: displayName,
      tiers,
      wikiUrl: `https://oldschool.runescape.wiki/w/${pageName}`,
    });

    console.log(`    OK: ${totalTasks} tasks across ${tiers.length} tiers`);
  }

  // Generate individual diary files
  const indexImports: string[] = [];
  const indexExports: string[] = [];

  for (const diary of diaries) {
    const fileName = diary.id;
    const exportName = diary.id.replace(/-/g, "_") + "Diary";
    const code = generateDiaryFile(diary, exportName);

    if (!dryRun) {
      fs.writeFileSync(path.join(outputDir, `${fileName}.ts`), code);
    }
    indexImports.push(`import { ${exportName} } from "./${fileName}";`);
    indexExports.push(exportName);
  }

  const indexCode = [
    `import type { AchievementDiaryArea } from "@/types/guides";`,
    ``,
    ...indexImports,
    ``,
    `export const achievementDiaries: AchievementDiaryArea[] = [`,
    ...indexExports.map((e) => `  ${e},`),
    `];`,
    ``,
    `export function getDiary(areaId: string): AchievementDiaryArea | undefined {`,
    `  return achievementDiaries.find((d) => d.id === areaId);`,
    `}`,
    ``,
    `export function getDiaryAreas(): { id: string; name: string }[] {`,
    `  return achievementDiaries.map((d) => ({ id: d.id, name: d.name }));`,
    `}`,
    ``,
  ].join("\n");

  if (!dryRun) {
    fs.writeFileSync(path.join(outputDir, "index.ts"), indexCode);
  }
  console.log(`  Wrote ${diaries.length} diary files + index`);
}

function generateDiaryFile(diary: ParsedDiary, exportName: string): string {
  const lines: string[] = [];
  lines.push(`import type { AchievementDiaryArea } from "@/types/guides";`);
  lines.push(``);
  lines.push(`export const ${exportName}: AchievementDiaryArea = {`);
  lines.push(`  id: ${q(diary.id)},`);
  lines.push(`  name: ${q(diary.name)},`);
  lines.push(`  wikiUrl: ${q(diary.wikiUrl)},`);
  lines.push(`  tiers: [`);
  for (const tier of diary.tiers) {
    lines.push(`    {`);
    lines.push(`      tier: ${q(tier.tier)} as AchievementDiaryArea["tiers"][number]["tier"],`);
    lines.push(`      tasks: [`);
    for (const task of tier.tasks) {
      lines.push(`        {`);
      lines.push(`          id: ${q(task.id)},`);
      lines.push(`          description: ${q(task.description)},`);
      lines.push(`          requirements: [`);
      for (const req of task.requirements) {
        const skillPart = req.skill ? `, skill: ${q(req.skill)}` : "";
        const levelPart = req.level ? `, level: ${req.level}` : "";
        lines.push(`            { type: ${q(req.type)}, description: ${q(req.description)}${skillPart}${levelPart} },`);
      }
      lines.push(`          ],`);
      lines.push(`        },`);
    }
    lines.push(`      ],`);
    lines.push(`      rewards: [`);
    for (const rew of tier.rewards) {
      lines.push(`        { itemName: ${q(rew.itemName)}, effects: [${rew.effects.map(q).join(", ")}] },`);
    }
    lines.push(`      ],`);
    lines.push(`    },`);
  }
  lines.push(`  ],`);
  lines.push(`};`);
  lines.push(``);
  return lines.join("\n");
}

// ---------------------------------------------------------------------------
// Combat Achievement Sync
// ---------------------------------------------------------------------------

const CA_TIERS = ["Easy", "Medium", "Hard", "Elite", "Master", "Grandmaster"];

interface ParsedCATier {
  tier: string;
  tasks: { id: string; name: string; description: string; monster: string; type: string }[];
}

async function syncCombatAchievements(dryRun: boolean): Promise<void> {
  console.log("\n--- Syncing Combat Achievements ---\n");

  const tiers: ParsedCATier[] = [];

  // Pre-fetch all CA tier wikitext in bulk (used as fallback if HTML parsing fails)
  const caPages = CA_TIERS.map((t) => `Combat_Achievements/${t}`);
  console.log(`  Bulk fetching ${caPages.length} CA tier pages (wikitext fallback)...`);
  const wikitextMap = await fetchBulkWikitext(caPages);

  // Fetch individual tier HTML pages (fetchExpandedHtml is single-page only)
  for (const tierName of CA_TIERS) {
    console.log(`  Fetching HTML: Combat_Achievements/${tierName}`);
    const html = await fetchExpandedHtml(`Combat_Achievements/${tierName}`);
    await sleep(REQUEST_DELAY_MS);

    const tasks: ParsedCATier["tasks"] = [];

    if (html) {
      // Parse HTML tables for combat achievement tasks
      // Wiki columns: Monster | Name | Description | Type | Comp%
      const tablePattern = /<table[^>]*class="[^"]*wikitable[^"]*"[^>]*>([\s\S]*?)<\/table>/gi;
      let tableMatch;
      while ((tableMatch = tablePattern.exec(html)) !== null) {
        const rows = tableMatch[1].split(/<tr[^>]*>/gi).slice(1); // skip first empty split
        for (const row of rows) {
          const cells: string[] = [];
          const cellPattern = /<td[^>]*>([\s\S]*?)<\/td>/gi;
          let cellMatch;
          while ((cellMatch = cellPattern.exec(row)) !== null) {
            cells.push(stripHtml(cellMatch[1]).trim());
          }
          if (cells.length >= 3) {
            // Correct column mapping: Monster(0), Name(1), Description(2), Type(3)
            const monster = cells[0];
            const name = cells[1];
            const description = cells[2];
            const type = cells.length >= 4 ? cells[3] : "";
            if (name && description) {
              tasks.push({
                id: `ca-${slugify(tierName)}-${slugify(name)}`,
                name,
                description,
                monster,
                type,
              });
            }
          }
        }
      }
    }

    // Fallback: use pre-fetched wikitext
    if (tasks.length === 0) {
      const wikitext = wikitextMap.get(`Combat_Achievements/${tierName}`) ?? null;
      if (wikitext) {
        const bullets = wikitext.match(/^\*\s+'''([^']+)'''[:\s]*(.+)$/gm);
        if (bullets) {
          for (const bullet of bullets) {
            const nameMatch = bullet.match(/'''([^']+)'''/);
            const rest = bullet.replace(/^\*\s+'''[^']+'''[:\s]*/, "");
            if (nameMatch) {
              tasks.push({
                id: `ca-${slugify(tierName)}-${slugify(nameMatch[1])}`,
                name: nameMatch[1],
                description: stripWikiMarkup(rest),
                monster: "",
                type: "",
              });
            }
          }
        }
      }
    }

    tiers.push({ tier: tierName.toLowerCase(), tasks });
    console.log(`    ${tierName}: ${tasks.length} tasks`);
  }

  const code = generateCombatAchievementsFile(tiers);

  if (!dryRun) {
    fs.mkdirSync(GUIDES_DIR, { recursive: true });
    fs.writeFileSync(path.join(GUIDES_DIR, "combat-achievements.ts"), code);
  }
  console.log(`  Wrote combat-achievements.ts`);
}

function generateCombatAchievementsFile(tiers: ParsedCATier[]): string {
  const lines: string[] = [];
  lines.push(`import type { CombatAchievementData } from "@/types/guides";`);
  lines.push(``);
  lines.push(`export const combatAchievements: CombatAchievementData = {`);
  lines.push(`  wikiUrl: "https://oldschool.runescape.wiki/w/Combat_Achievements",`);
  lines.push(`  tiers: [`);
  for (const tier of tiers) {
    lines.push(`    {`);
    lines.push(`      tier: ${q(tier.tier)} as CombatAchievementData["tiers"][number]["tier"],`);
    lines.push(`      tasks: [`);
    for (const task of tier.tasks) {
      lines.push(`        { id: ${q(task.id)}, name: ${q(task.name)}, description: ${q(task.description)}, monster: ${q(task.monster)}, type: ${q(task.type)} },`);
    }
    lines.push(`      ],`);
    lines.push(`    },`);
  }
  lines.push(`  ],`);
  lines.push(`};`);
  lines.push(``);
  return lines.join("\n");
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes("--dry-run");
  const contentArg = args.find((a) => a.startsWith("--content="));
  const contentTypes = contentArg
    ? contentArg.split("=")[1].split(",")
    : ["skills", "ironman", "quests", "diaries", "combat"];

  console.log("========================================");
  console.log("  Gielinor Guide - Wiki Guide Sync");
  console.log("========================================");
  console.log(`  Mode: ${dryRun ? "DRY RUN" : "LIVE"}`);
  console.log(`  Content: ${contentTypes.join(", ")}`);
  console.log(`  Output dir: ${GUIDES_DIR}`);
  console.log(`  Time: ${new Date().toISOString()}`);

  let hasErrors = false;

  for (const type of contentTypes) {
    try {
      switch (type) {
        case "skills":
          await syncSkillGuides(dryRun);
          break;
        case "ironman":
          await syncIronmanGuides(dryRun);
          break;
        case "quests":
          await syncQuestGuides(dryRun);
          break;
        case "diaries":
          await syncDiaryGuides(dryRun);
          break;
        case "combat":
          await syncCombatAchievements(dryRun);
          break;
        default:
          console.warn(`  Unknown content type: ${type}`);
      }
    } catch (err) {
      hasErrors = true;
      console.error(`\nERROR syncing ${type}:`, err instanceof Error ? err.message : err);
    }
  }

  console.log(`\n========================================`);
  console.log(`  Guide sync complete. ${hasErrors ? "Some errors occurred." : "All OK."}`);
  console.log(`========================================\n`);

  if (hasErrors) process.exit(1);
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
