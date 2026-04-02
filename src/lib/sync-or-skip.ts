/**
 * Resilient prebuild wrapper: checks wiki reachability before running syncs.
 * - Online + data exists → run syncs normally
 * - Offline + data exists → warn and skip (exit 0)
 * - Offline + no data → fail with clear message
 */
import { execSync } from "child_process";
import { existsSync } from "fs";
import { resolve } from "path";

const WIKI_URL = "https://oldschool.runescape.wiki/api.php";
const TIMEOUT_MS = 5000;

const DATA_FILES = [
  "src/data/demonic-pacts.ts",
  "src/data/raging-echoes.ts",
  "src/data/osrs-quests.ts",
  "src/data/osrs-bosses.ts",
  "src/data/guides/skills/index.ts",
];

const SYNC_COMMANDS = [
  { name: "league wiki sync", cmd: "npx tsx src/lib/wiki-sync.ts --merge" },
  { name: "guide wiki sync", cmd: "npx tsx src/lib/wiki-sync-guides.ts" },
  { name: "data wiki sync", cmd: "npx tsx src/lib/wiki-sync-data.ts --merge" },
];

async function checkWikiReachable(): Promise<boolean> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(WIKI_URL, {
      method: "HEAD",
      signal: controller.signal,
    });
    return res.ok;
  } catch {
    return false;
  } finally {
    clearTimeout(timeout);
  }
}

function dataFilesExist(): boolean {
  return DATA_FILES.every((f) => existsSync(resolve(f)));
}

async function main() {
  const online = await checkWikiReachable();

  if (!online) {
    if (dataFilesExist()) {
      console.warn(
        "\x1b[33m[sync-or-skip] Wiki unreachable — using existing data files. Build will proceed.\x1b[0m"
      );
      process.exit(0);
    } else {
      console.error(
        "\x1b[31m[sync-or-skip] Wiki unreachable and no existing data files found.\n" +
          "A fresh clone requires network access to fetch data. Connect to the internet and retry.\x1b[0m"
      );
      process.exit(1);
    }
  }

  console.log("[sync-or-skip] Wiki reachable — running syncs...");

  for (const { name, cmd } of SYNC_COMMANDS) {
    try {
      console.log(`  Running ${name}...`);
      execSync(cmd, { stdio: "inherit" });
    } catch {
      console.warn(
        `\x1b[33m[sync-or-skip] ${name} failed — continuing with existing data.\x1b[0m`
      );
      if (!dataFilesExist()) {
        console.error(
          `\x1b[31m[sync-or-skip] Critical: ${name} failed and data files are missing.\x1b[0m`
        );
        process.exit(1);
      }
    }
  }

  // Generate sync status after successful syncs
  try {
    execSync("npx tsx src/lib/sync-status.ts", { stdio: "inherit" });
  } catch {
    console.warn(
      "\x1b[33m[sync-or-skip] Sync status generation failed — non-critical, continuing.\x1b[0m"
    );
  }

  console.log("[sync-or-skip] All syncs complete.");
}

main();
