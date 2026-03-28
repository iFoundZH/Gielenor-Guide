# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Gielenor Guide is an OSRS (Old School RuneScape) league companion web app — an interactive guide and planner for temporary league events. Currently features the "Demonic Pacts League" and "Raging Echoes League." Purely client-side with no backend; all user data persists in localStorage.

## Commands

```bash
npm run dev          # Dev server on :3000
npm run build        # Production build (static export)
npm run lint         # ESLint
npm run sync-wiki    # Sync league data from OSRS Wiki (npx tsx src/lib/wiki-sync.ts)
```

No test framework is currently configured.

## Architecture

**Next.js 16 App Router** with static export (`output: "export"` in next.config.ts). React 19, TypeScript 6, Tailwind CSS 4.

### Path alias

`@/*` maps to `./src/*` (configured in tsconfig.json).

### Source layout

- `src/app/` — Next.js App Router pages. League pages follow `/leagues/[league-slug]/` with sub-routes for `guide`, `planner`, and `tasks`.
- `src/components/` — Split into `layout/` (Header, Footer), `ui/` (Badge, Card, ProgressBar, Tabs), and `league/` (domain-specific components like RegionPicker, PactCard, RelicTierDisplay).
- `src/data/` — Static league data files. Each league (e.g. `demonic-pacts.ts`) exports a `LeagueData` object. `leagues.ts` is the index with helper lookups.
- `src/lib/` — Utilities: `build-storage.ts` (localStorage persistence for profiles/builds), `player-score.ts` (Gielinor Score calculator), `wiki-sync.ts` (OSRS Wiki API fetcher).
- `src/types/league.ts` — All shared TypeScript interfaces (`LeagueData`, `LeagueBuild`, `Region`, `Relic`, `Pact`, `LeagueTask`, etc.).

### Data flow

1. League data is statically imported from `src/data/`.
2. User state (completed tasks, builds, profiles) is stored in localStorage via `src/lib/build-storage.ts`.
3. Components use `"use client"` with React hooks (`useState`, `useEffect`) for interactivity.
4. No server-side data fetching — everything runs client-side.

### Key systems

- **Gielinor Score** (`src/lib/player-score.ts`): 4-axis scoring (0–3000) — task points, completion breadth, relic synergy, and risk from pact combos. Ranks from Unranked through Infernal.
- **Build storage** (`src/lib/build-storage.ts`): Multi-profile system with `encodeBuild`/`decodeBuild` for URL-based build sharing.
- **Region system**: Regions have types — `starting`, `auto-unlock`, `choosable`, `inaccessible` — with enforced `maxRegions` selection limits.

## Styling

OSRS-themed dark UI defined in `src/app/globals.css` using Tailwind CSS 4 custom theme variables:
- Colors: `--color-osrs-gold`, `--color-demon-glow`, `--color-osrs-dark`, etc.
- Font: Cinzel (`--font-runescape`) for headings.
- Custom animations: `ember-glow`, `flicker`, `fill-progress`.
- Custom utilities: `text-glow`, `border-glow`, `card-hover`.

## Adding a new league

1. Create a data file in `src/data/` exporting a `LeagueData` object (follow `demonic-pacts.ts` as template).
2. Register it in `src/data/leagues.ts`.
3. Add route pages under `src/app/leagues/[new-league-slug]/` (overview, guide, planner, tasks).
4. Update Header navigation dropdown in `src/components/layout/Header.tsx`.
