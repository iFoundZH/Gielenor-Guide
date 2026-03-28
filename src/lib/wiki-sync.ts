/**
 * Wiki Sync Utility
 *
 * Fetches data from the Old School RuneScape Wiki API to keep
 * league data, task lists, and game content up to date.
 *
 * Usage:
 *   npm run sync-wiki
 *
 * This can be run on a schedule (e.g., daily cron job, GitHub Action)
 * to automatically pull the latest data from the wiki.
 *
 * The OSRS Wiki uses MediaWiki API:
 *   https://oldschool.runescape.wiki/api.php
 *
 * Key endpoints:
 *   - parse: Get rendered page content
 *   - query: Search for pages, get categories
 *   - opensearch: Autocomplete search
 */

const WIKI_API = "https://oldschool.runescape.wiki/api.php";

const WIKI_HEADERS = {
  "User-Agent": "GielinorGuide/1.0 (https://github.com/zblack14/Gielenor-guide)",
  Accept: "application/json",
};

interface WikiPage {
  title: string;
  content: string;
  lastModified: string;
}

interface WikiSyncResult {
  pages: WikiPage[];
  syncedAt: string;
  errors: string[];
}

/**
 * Fetch a wiki page's parsed content
 */
async function fetchWikiPage(title: string): Promise<WikiPage | null> {
  const params = new URLSearchParams({
    action: "parse",
    page: title,
    format: "json",
    prop: "wikitext|revid",
  });

  try {
    const response = await fetch(`${WIKI_API}?${params}`, {
      headers: WIKI_HEADERS,
    });
    const data = await response.json();

    if (data.error) {
      console.error(`Wiki error for "${title}":`, data.error.info);
      return null;
    }

    return {
      title: data.parse.title,
      content: data.parse.wikitext?.["*"] || "",
      lastModified: new Date().toISOString(),
    };
  } catch (error) {
    console.error(`Failed to fetch "${title}":`, error);
    return null;
  }
}

/**
 * Parse wiki tables from wikitext into structured data.
 * Handles the common MediaWiki table format used on the OSRS Wiki.
 */
function parseWikiTable(wikitext: string): Record<string, string>[] {
  const rows: Record<string, string>[] = [];
  const tableMatch = wikitext.match(/\{\|[^]*?\|\}/);
  if (!tableMatch) return rows;

  const tableText = tableMatch[0];
  const lines = tableText.split("\n");

  let headers: string[] = [];
  let currentRow: Record<string, string> = {};
  let colIndex = 0;

  for (const line of lines) {
    if (line.startsWith("!")) {
      // Header row
      const headerCells = line.replace(/^!/, "").split("!!");
      headers = headerCells.map((h) => h.replace(/\[\[.*?\|(.*?)\]\]/g, "$1").trim());
    } else if (line.startsWith("|-")) {
      // New row
      if (Object.keys(currentRow).length > 0) {
        rows.push(currentRow);
      }
      currentRow = {};
      colIndex = 0;
    } else if (line.startsWith("|") && !line.startsWith("|}")) {
      // Data cell
      const cellContent = line.replace(/^\|/, "").trim();
      if (headers[colIndex]) {
        currentRow[headers[colIndex]] = cellContent
          .replace(/\[\[(.*?\|)?(.*?)\]\]/g, "$2")
          .replace(/\{\{.*?\}\}/g, "")
          .trim();
      }
      colIndex++;
    }
  }

  if (Object.keys(currentRow).length > 0) {
    rows.push(currentRow);
  }

  return rows;
}

/**
 * Sync all league-related pages from the wiki
 */
async function syncLeagueData(leagueName: string): Promise<WikiSyncResult> {
  const pages = [
    leagueName,
    `${leagueName}/Relics`,
    `${leagueName}/Tasks`,
    `${leagueName}/Pacts`,
    `${leagueName}/Rewards`,
  ];

  const results: WikiPage[] = [];
  const errors: string[] = [];

  for (const page of pages) {
    console.log(`Fetching: ${page}...`);
    const result = await fetchWikiPage(page);
    if (result) {
      results.push(result);
      console.log(`  ✓ Got ${result.content.length} chars`);
    } else {
      errors.push(`Failed to fetch: ${page}`);
      console.log(`  ✗ Failed`);
    }
    // Rate limit: be nice to the wiki
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  return {
    pages: results,
    syncedAt: new Date().toISOString(),
    errors,
  };
}

/**
 * Check if a wiki page has been modified since a given date
 */
async function checkForUpdates(title: string, since: string): Promise<boolean> {
  const params = new URLSearchParams({
    action: "query",
    titles: title,
    prop: "revisions",
    rvprop: "timestamp",
    rvlimit: "1",
    format: "json",
  });

  try {
    const response = await fetch(`${WIKI_API}?${params}`, {
      headers: WIKI_HEADERS,
    });
    const data = await response.json();
    const pages = data.query?.pages || {};
    const page = Object.values(pages)[0] as { revisions?: Array<{ timestamp: string }> };

    if (page?.revisions?.[0]?.timestamp) {
      const lastEdit = new Date(page.revisions[0].timestamp);
      const sinceDate = new Date(since);
      return lastEdit > sinceDate;
    }
    return false;
  } catch {
    return false;
  }
}

// Main entry point when run as a script
async function main() {
  console.log("=== Gielinor Guide Wiki Sync ===\n");
  console.log("Checking for updates to Demonic Pacts League...\n");

  const hasUpdates = await checkForUpdates(
    "Demonic_Pacts_League",
    "2026-03-28T00:00:00Z"
  );

  if (hasUpdates) {
    console.log("Updates found! Syncing...\n");
    const result = await syncLeagueData("Demonic_Pacts_League");
    console.log(`\nSync complete: ${result.pages.length} pages fetched`);

    if (result.errors.length > 0) {
      console.log("Errors:", result.errors);
    }

    // In production, this would write to the data files
    console.log("\nTo update the data files, process the wiki content");
    console.log("and update src/data/demonic-pacts.ts");
  } else {
    console.log("No updates found. Data is current.");
  }
}

main().catch(console.error);

export { fetchWikiPage, parseWikiTable, syncLeagueData, checkForUpdates };
