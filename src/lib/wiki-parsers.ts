/**
 * Shared wiki parsing utilities used by both league sync and guide sync.
 */

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

export const WIKI_API = "https://oldschool.runescape.wiki/api.php";

export const WIKI_HEADERS = {
  "User-Agent": "GielinorGuide/1.0 (https://github.com/zblack14/Gielenor-guide)",
  Accept: "application/json",
};

export const REQUEST_DELAY_MS = 500;

// ---------------------------------------------------------------------------
// Wiki API fetching
// ---------------------------------------------------------------------------

export async function fetchWikitext(pageTitle: string): Promise<string | null> {
  const params = new URLSearchParams({
    action: "parse",
    page: pageTitle,
    format: "json",
    prop: "wikitext",
  });

  try {
    const response = await fetch(`${WIKI_API}?${params}`, { headers: WIKI_HEADERS });
    if (!response.ok) {
      console.error(`  HTTP ${response.status} fetching "${pageTitle}"`);
      return null;
    }
    const data = await response.json();
    if (data.error) {
      console.error(`  Wiki API error for "${pageTitle}": ${data.error.info}`);
      return null;
    }
    return data.parse?.wikitext?.["*"] ?? null;
  } catch (err) {
    console.error(`  Network error fetching "${pageTitle}":`, err instanceof Error ? err.message : err);
    return null;
  }
}

export async function fetchSections(pageTitle: string): Promise<Array<{ index: string; line: string; number: string; toclevel: number }>> {
  const params = new URLSearchParams({
    action: "parse",
    page: pageTitle,
    format: "json",
    prop: "sections",
  });

  try {
    const response = await fetch(`${WIKI_API}?${params}`, { headers: WIKI_HEADERS });
    const data = await response.json();
    return data.parse?.sections ?? [];
  } catch {
    return [];
  }
}

export async function fetchWikitextSection(pageTitle: string, sectionIndex: string): Promise<string | null> {
  const params = new URLSearchParams({
    action: "parse",
    page: pageTitle,
    format: "json",
    prop: "wikitext",
    section: sectionIndex,
  });

  try {
    const response = await fetch(`${WIKI_API}?${params}`, { headers: WIKI_HEADERS });
    const data = await response.json();
    if (data.error) return null;
    return data.parse?.wikitext?.["*"] ?? null;
  } catch {
    return null;
  }
}

/**
 * Fetch expanded HTML of a wiki page (useful for transcluded templates).
 */
export async function fetchExpandedHtml(pageTitle: string): Promise<string | null> {
  const params = new URLSearchParams({
    action: "parse",
    page: pageTitle,
    format: "json",
    prop: "text",
  });

  try {
    const response = await fetch(`${WIKI_API}?${params}`, { headers: WIKI_HEADERS });
    const data = await response.json();
    if (data.error) return null;
    return data.parse?.text?.["*"] ?? null;
  } catch {
    return null;
  }
}

/**
 * Bulk-fetch wikitext for up to 50 pages per request.
 * Uses action=query with revisions prop instead of action=parse (which only does one page).
 * Returns a Map<title, wikitext> for pages that exist.
 */
export async function fetchBulkWikitext(pageTitles: string[]): Promise<Map<string, string>> {
  const results = new Map<string, string>();
  const BATCH_SIZE = 50;

  for (let i = 0; i < pageTitles.length; i += BATCH_SIZE) {
    const batch = pageTitles.slice(i, i + BATCH_SIZE);

    const params = new URLSearchParams({
      action: "query",
      titles: batch.join("|"),
      prop: "revisions",
      rvprop: "content",
      rvslots: "main",
      format: "json",
      formatversion: "2",
      redirects: "1",
    });

    try {
      const response = await fetch(`${WIKI_API}?${params}`, { headers: WIKI_HEADERS });
      if (!response.ok) {
        console.error(`  HTTP ${response.status} fetching bulk batch ${i / BATCH_SIZE + 1}`);
        continue;
      }
      const data = await response.json();

      // Build normalization map (wiki may normalize titles, e.g. underscores → spaces)
      const normalizedMap = new Map<string, string>();
      if (data.query?.normalized) {
        for (const n of data.query.normalized) {
          normalizedMap.set(n.to, n.from);
        }
      }

      // Build redirect map: target → [sources] (multiple pages can redirect to same target)
      const redirectMap = new Map<string, string[]>();
      if (data.query?.redirects) {
        for (const r of data.query.redirects) {
          const existing = redirectMap.get(r.to) ?? [];
          existing.push(r.from);
          redirectMap.set(r.to, existing);
        }
      }

      if (data.query?.pages) {
        for (const page of data.query.pages) {
          if (page.missing) continue;
          const content = page.revisions?.[0]?.slots?.main?.content;
          if (!content) continue;

          // Store under the final resolved title
          results.set(page.title, content);

          // Also store under the original title (before normalization)
          const originalTitle = normalizedMap.get(page.title) ?? page.title;
          if (originalTitle !== page.title) {
            results.set(originalTitle, content);
          }

          // Also store under all redirect source titles (before redirect)
          const redirectSources = redirectMap.get(page.title) ?? [];
          for (const source of redirectSources) {
            results.set(source, content);
            // And under the pre-normalization form of the redirect source
            const preNormRedirect = normalizedMap.get(source);
            if (preNormRedirect) {
              results.set(preNormRedirect, content);
            }
          }
        }
      }
    } catch (err) {
      console.error(`  Network error fetching bulk batch ${i / BATCH_SIZE + 1}:`, err instanceof Error ? err.message : err);
    }

    // Sleep between batches (not after the last one)
    if (i + BATCH_SIZE < pageTitles.length) {
      await sleep(REQUEST_DELAY_MS);
    }
  }

  return results;
}

/**
 * Fetch all page titles in a MediaWiki category, handling pagination.
 */
export async function fetchCategoryMembers(categoryTitle: string): Promise<string[]> {
  const titles: string[] = [];
  let cmcontinue: string | undefined;

  do {
    const params = new URLSearchParams({
      action: "query",
      list: "categorymembers",
      cmtitle: categoryTitle,
      cmlimit: "500",
      cmtype: "page",
      format: "json",
      formatversion: "2",
    });
    if (cmcontinue) params.set("cmcontinue", cmcontinue);

    try {
      const response = await fetch(`${WIKI_API}?${params}`, { headers: WIKI_HEADERS });
      if (!response.ok) {
        console.error(`  HTTP ${response.status} fetching category ${categoryTitle}`);
        break;
      }
      const data = await response.json();

      if (data.query?.categorymembers) {
        for (const member of data.query.categorymembers) {
          titles.push(member.title);
        }
      }

      cmcontinue = data.continue?.cmcontinue;
      if (cmcontinue) await sleep(REQUEST_DELAY_MS);
    } catch (err) {
      console.error(`  Network error fetching category ${categoryTitle}:`, err instanceof Error ? err.message : err);
      break;
    }
  } while (cmcontinue);

  return titles;
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ---------------------------------------------------------------------------
// Wikitext parsing helpers
// ---------------------------------------------------------------------------

/**
 * Strip MediaWiki markup from a string:
 *  - [[Link|Display]] -> Display
 *  - [[Link]] -> Link
 *  - {{Template|...}} -> ""  (templates removed)
 *  - <ref>...</ref> -> ""
 *  - '''bold''' -> bold
 *  - ''italic'' -> italic
 */
export function stripWikiMarkup(text: string): string {
  let result = text;

  // Remove <ref>...</ref> and self-closing <ref/>
  result = result.replace(/<ref[^>]*>[\s\S]*?<\/ref>/g, "");
  result = result.replace(/<ref[^/>]*\/>/g, "");

  // Iteratively strip templates from inside out (handles nesting)
  let prev = "";
  while (prev !== result) {
    prev = result;
    result = result.replace(/\{\{[^{}]*\}\}/g, "");
  }

  // Remove [[File:...|...|...]] and [[Image:...|...|...]] entirely
  result = result.replace(/\[\[(?:File|Image):[^\]]*\]\]/gi, "");
  // Convert [[Link|Display]] -> Display
  result = result.replace(/\[\[(?:[^\]|]*\|)([^\]]*)\]\]/g, "$1");
  // Convert [[Link]] -> Link
  result = result.replace(/\[\[([^\]]*)\]\]/g, "$1");
  // Bold and italic
  result = result.replace(/'''(.*?)'''/g, "$1");
  result = result.replace(/''(.*?)''/g, "$1");
  // Strip HTML tags
  result = result.replace(/<[^>]+>/g, "");
  // Clean up fragment remnants from malformed templates
  result = result.replace(/\{\{[^}]*$/g, "");  // trailing unclosed {{
  result = result.replace(/\]\]/g, "");         // stray ]]

  return result.trim();
}

/**
 * Split template inner content on | while respecting nested {{ }} and [[ ]].
 */
export function splitTemplateParts(text: string): string[] {
  const parts: string[] = [];
  let current = "";
  let braceDepth = 0;
  let bracketDepth = 0;

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    const next = text[i + 1] ?? "";

    if (ch === "{" && next === "{") {
      braceDepth++;
      current += "{{";
      i++;
    } else if (ch === "}" && next === "}") {
      braceDepth--;
      current += "}}";
      i++;
    } else if (ch === "[" && next === "[") {
      bracketDepth++;
      current += "[[";
      i++;
    } else if (ch === "]" && next === "]") {
      bracketDepth--;
      current += "]]";
      i++;
    } else if (ch === "|" && braceDepth === 0 && bracketDepth === 0) {
      parts.push(current);
      current = "";
    } else {
      current += ch;
    }
  }

  if (current) parts.push(current);
  return parts;
}

/**
 * Extract the "s=" skill parameter from a task template.
 */
export function parseSkillsParam(raw: string): string[] {
  if (!raw || raw.trim() === "") return [];

  const skills: string[] = [];

  const scpPattern = /\{\{SCP\|([^|]+)/g;
  let match;
  while ((match = scpPattern.exec(raw)) !== null) {
    const skill = match[1].trim();
    if (skill) skills.push(skill);
  }

  if (skills.length === 0) {
    const linkPattern = /\[\[([^\]|]+)/g;
    while ((match = linkPattern.exec(raw)) !== null) {
      const linked = match[1].trim();
      if (isSkillName(linked)) skills.push(linked);
    }
  }

  return [...new Set(skills)];
}

export const VALID_SKILLS = new Set([
  "Attack", "Strength", "Defence", "Ranged", "Prayer", "Magic",
  "Runecraft", "Hitpoints", "Crafting", "Mining", "Smithing",
  "Fishing", "Cooking", "Firemaking", "Woodcutting", "Agility",
  "Herblore", "Thieving", "Fletching", "Slayer", "Farming",
  "Construction", "Hunter", "Sailing",
]);

export function isSkillName(s: string): boolean {
  return VALID_SKILLS.has(s);
}

export const DIFFICULTY_POINTS: Record<string, number> = {
  easy: 10,
  medium: 30,
  hard: 80,
  elite: 200,
  master: 400,
};

// ---------------------------------------------------------------------------
// Utility helpers
// ---------------------------------------------------------------------------

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/['']/g, "")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
}

export function titleCase(s: string): string {
  if (s !== s.toLowerCase()) return s;
  const smallWords = new Set(["of", "the", "and", "in", "on", "at", "to", "a", "an", "or", "for", "nor", "but"]);
  return s.split(/\s+/).map((word, i) => {
    if (i > 0 && smallWords.has(word.toLowerCase())) return word.toLowerCase();
    return word.charAt(0).toUpperCase() + word.slice(1);
  }).join(" ");
}

export function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** Quote a string for TypeScript output, escaping special chars. */
export function q(s: string): string {
  return `"${s.replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\n/g, "\\n")}"`;
}

/**
 * Strip HTML tags from a string (for parsing expanded wiki HTML).
 */
export function stripHtml(html: string): string {
  let text = html.replace(/<[^>]+>/g, "");
  // Decode numeric HTML entities (&#91; → [, &#39; → ', etc.)
  text = text.replace(/&#(\d+);/g, (_, n) => String.fromCharCode(parseInt(n)));
  // Decode named HTML entities
  text = text.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"').replace(/&nbsp;/g, " ").replace(/&apos;/g, "'");
  return text.trim();
}

/**
 * Extract text content from simple HTML table cells.
 */
export function parseHtmlTable(html: string): string[][] {
  const rows: string[][] = [];
  const rowPattern = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
  let rowMatch;
  while ((rowMatch = rowPattern.exec(html)) !== null) {
    const cells: string[] = [];
    const cellPattern = /<t[dh][^>]*>([\s\S]*?)<\/t[dh]>/gi;
    let cellMatch;
    while ((cellMatch = cellPattern.exec(rowMatch[1])) !== null) {
      cells.push(stripHtml(cellMatch[1]).trim());
    }
    if (cells.length > 0) rows.push(cells);
  }
  return rows;
}
