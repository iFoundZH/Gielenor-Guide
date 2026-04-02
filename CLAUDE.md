# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Gielenor Guide is an OSRS (Old School RuneScape) league companion web app — an interactive guide and planner for temporary league events. Currently features the "Demonic Pacts League" (live Apr 15–Jun 10 2026) and "Raging Echoes League" (ended Jan 22 2025). Purely client-side with no backend; all user data persists in localStorage.

## Commands

```bash
npm run dev              # Dev server on :3000
npm run build            # Production build (static export to /out/)
npm run lint             # ESLint (Next.js defaults)
npm run test             # Run all Playwright E2E tests (167 tests, 10 spec files)
npm run test:ui          # Interactive Playwright test runner
npm run sync-wiki        # Sync league data from OSRS Wiki
npm run sync-guides      # Sync main game guides from OSRS Wiki
npm run sync-data        # Sync quest/boss data from OSRS Wiki
npm run compute-guide-stats  # Compute real region stats from task data
```

## Testing

**Playwright E2E tests** in `e2e/` directory — 167 tests across 10 spec files, Chromium only.

- Dev server on `:3000`, tests reuse existing server (`reuseExistingServer: true`)
- Global setup warms 21 pages to prevent compilation timeouts
- Single worker, 1 retry, trace on first retry

### Test conventions

- **Relic clicks**: Use `h4:has-text('RelicName')` for reliable relic selection on DP planner
- **Task rows**: Selector `div.rounded-lg.border.cursor-pointer:has-text('pts')` (not generic cursor-pointer)
- **Region cards**: Click on `h5 >> text=RegionName` to select regions
- **Analysis assertions**: Scope to `#analysis` to avoid matching relic names elsewhere
- **Exact text**: Use `getByText("X", { exact: true })` for text appearing in multiple elements
- **Click through overlays**: Use `card.evaluate(el => (el as HTMLElement).click())` to bypass sticky nav overlays
- **Filter selects**: DP has 4 selects (difficulty=0, category=1, region=2, sort=3), RE has 3 (no region filter)

### Test data counts

- DP: 43 tasks (placeholder), relic display: "X / 6" (T1,T2,T3,T4,T6,T8 have relics)
- RE: 85 tasks (representative sample; full wiki has 1,589)

## Architecture

**Next.js 16 App Router** with static export (`output: "export"` in next.config.ts). React 19, TypeScript 6, Tailwind CSS 4. GitHub Pages deployment with `basePath: "/Gielenor-Guide"` in production.

### Path alias

`@/*` maps to `./src/*` (configured in tsconfig.json).

### Source layout

- `src/app/` — App Router pages. League pages at `/leagues/[league-slug]/` with sub-routes: `guide`, `planner`, `tasks`.
- `src/components/` — Split into `layout/` (Header, Footer), `ui/` (Badge, Card, ProgressBar, Tabs), and `league/` (domain-specific components).
- `src/data/` — Static league data files. Each league exports a `LeagueData` object. `leagues.ts` is the registry.
- `src/lib/` — Utilities: scoring, storage, analysis, wiki sync, region mapping.
- `src/types/` — Shared TypeScript interfaces.

### Data flow

1. League data is statically imported from `src/data/`.
2. User state (completed tasks, builds) is stored in localStorage via `src/lib/build-storage.ts`.
3. Components use `"use client"` with React hooks for interactivity.
4. No server-side data fetching — everything runs client-side.

### Key systems

- **Gielinor Score** (`src/lib/player-score.ts`): 4-axis scoring (0–3000) — task points, completion breadth, relic synergy, and risk from pact combos. 9 ranks from Unranked through Infernal.
- **Build Analysis** (`src/lib/build-analysis.ts`): 14 analysis outputs including AFK score, power ratings, point ceiling.
- **Relic Metrics** (`src/lib/relic-metrics.ts`): AFK score (keyword-match, 0-100), power ratings (5 axes, 0-10), point ceiling.
- **Build Storage** (`src/lib/build-storage.ts`): Multi-profile system with `encodeBuild`/`decodeBuild` for URL sharing.
- **Region System**: Regions have types — `starting`, `auto-unlock`, `choosable`, `inaccessible` — with enforced `maxRegions`.

### localStorage keys

- `gielinor-dp-build` / `gielinor-re-build` — Build planner state
- `gielinor-dp-tasks` / `gielinor-re-tasks` — Completed tasks
- `gielinor-diaries-{area}` — Achievement diary completion
- `gielinor-combat-achievements` — Combat achievement completion
- `gielinor-snowflake-profiles` — Snowflake account profiles

## Wiki Sync System

Three sync scripts fetch data from `oldschool.runescape.wiki` (MediaWiki API):

1. **`wiki-sync.ts`** — League data: tasks, relics, pacts, regions. Uses `--merge` flag to preserve hand-curated data.
2. **`wiki-sync-guides.ts`** — Main game guides: skills, ironman, quests, diaries, combat achievements.
3. **`wiki-sync-data.ts`** — Quest/boss databases. Uses `--merge` flag.

Shared utilities in `wiki-parsers.ts`: `fetchBulkWikitext()` (batches of 50, 500ms delay), `fetchCategoryMembers()`.

**CI/CD**: Weekly cron sync (Monday 06:00 UTC) via `.github/workflows/wiki-sync.yml`. Creates PR if `src/data/` changed. Deploy workflow runs `sync-wiki --merge` before build.

**Important**: `prebuild` script runs all three sync scripts, making `npm run build` network-dependent.

## Styling

OSRS-themed dark UI in `src/app/globals.css` using Tailwind CSS 4 custom theme:
- Colors: `--color-osrs-gold`, `--color-demon-glow`, `--color-osrs-dark`
- Font: Cinzel (`--font-runescape`) for headings
- Animations: `ember-glow`, `flicker`, `fill-progress`
- Utilities: `text-glow`, `border-glow`, `card-hover`

## Adding a new league

1. Create a data file in `src/data/` exporting a `LeagueData` object (follow `demonic-pacts.ts` as template).
2. Register it in `src/data/leagues.ts`.
3. Add route pages under `src/app/leagues/[new-league-slug]/` (overview, guide, planner, tasks).
4. Update Header nav dropdown in `src/components/layout/Header.tsx`.
5. Add relic entries to `POWER_RATINGS` in `src/lib/relic-metrics.ts`.
6. Add synergies/archetypes to `src/lib/player-score.ts`.
7. Add E2E tests in `e2e/` and warm new pages in `e2e/global-setup.ts`.

## Data accuracy rules

- **Wiki data is authoritative** for task counts, point values, relic names, and region content.
- **Task point values**: Easy=10, Medium=30, Hard=80, Elite=200, Master=400 (from wiki RELTaskRow).
- **Custom scoring is our value-add**: Gielinor Score, synergies, archetypes, power ratings — we analyze raw wiki data.
- **DP placeholder data**: Pacts, tasks (43), and reward tiers are speculative until league launches Apr 15.
- **Never fabricate specific numbers** (pts/hr, DPS %, task counts per region) — use qualitative language or compute from real data.
- **Region mapping** (`wiki-region-map.ts`): ~290 keyword→region mappings. DT2 bosses use league classifications, not geographic.

## OSRS Domain Knowledge

This app targets OSRS (Old School RuneScape) players. Key domain concepts:

### The Game
- 24 skills (7 combat, 5 gathering, 7 artisan, 5 support) each capped at level 99 (200M XP). Sailing added Nov 2025.
- Combat level 3-126. Three combat styles (melee/ranged/magic). Game runs on 0.6s ticks.
- 179 quests (333 quest points). 12 achievement diary areas x 4 tiers. 637 combat achievements, 6 tiers.

### Leagues (Temporary Competitive Modes)
Six leagues: Twisted → Trailblazer → Shattered Relics → Trailblazer Reloaded → Raging Echoes → Demonic Pacts.
- Separate servers, fresh accounts, boosted XP/drops, unique mechanics, 6-8 weeks.
- Static trophy thresholds since League IV (no percentile).
- Echo bosses: enhanced boss variants via echo orbs, one per unlockable region.
- Combat achievements exist in leagues — same rewards, compound with boosted rates.

### OSRS Wiki
- Official wiki: `oldschool.runescape.wiki` (MediaWiki API at `/api.php`)
- League task template: `RELTaskRow` (params: tier, id, region, s, other)
- Wiki data is authoritative for task counts, point values, relic names, and region content
