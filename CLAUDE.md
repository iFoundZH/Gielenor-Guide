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

## OSRS Domain Knowledge

This app targets OSRS (Old School RuneScape) players. Key domain concepts:

### The Game
- OSRS has **24 skills** (7 combat, 5 gathering, 7 artisan, 5 support) each capped at level 99 (200M XP). Sailing was added Nov 2025 as the first OSRS-exclusive skill.
- **Combat level** ranges 3-126. Three combat styles (melee/ranged/magic) form a combat triangle. Game runs on 0.6s ticks.
- **179 quests** (333 quest points). Critical ones: Recipe for Disaster (Barrows gloves), Dragon Slayer II (Vorkath), Song of the Elves (Prifddinas), Desert Treasure I/II (Ancient Magicks, Forgotten Four bosses).
- **Achievement Diaries**: 12 areas × 4 tiers (Easy/Medium/Hard/Elite). Reward items with passive perks.
- **Combat Achievements**: 637 tasks, 6 tiers, points-based (2,630 total points). Rewards from Ghommal.

### Account Types
- **Normal** (main), **Ironman** (self-sufficient, no trading/GE), **HCIM** (one life), **UIM** (no banking), **GIM** (team ironman).
- **Snowflake accounts**: Self-imposed restrictions — area-locked, chunk-locked, OSAAT, taskman, skillers, pures.

### Regions of Gielinor
Misthalin, Asgarnia, Kandarin, Morytania, Desert, Fremennik, Tirannwn, Wilderness, Karamja, Kourend (5 houses), Kebos, Varlamore, Fossil Island, and other areas. Each has unique bosses, quests, and skills.

### Leagues (Temporary Competitive Modes)
Separate servers, fresh accounts, boosted XP/drops, unique mechanics. Run 6-8 weeks. Six leagues so far:
1. **Twisted League** (2019) — Zeah only
2. **Trailblazer** (2020) — Region-locked, relics
3. **Shattered Relics** (2022) — Fragments, set effects
4. **Trailblazer Reloaded** (2023) — Regions + 8 relic tiers, first static trophy thresholds
5. **Raging Echoes** (2024-2025) — Combat masteries, echo bosses, 1,589 tasks
6. **Demonic Pacts** (Apr-Jun 2026) — Pact risk/reward, echo bosses, Misthalin locked

**League task points**: Easy=10, Medium=30, Hard=80, Elite=200, Master=400.
**Trophy thresholds**: Static since League IV (no more percentile-based).
**Echo bosses**: Enhanced boss variants accessed via echo orbs; one per unlockable region.

### Bosses (by location)
- **Raids**: CoX (Kourend), ToB (Morytania), ToA (Desert) — best-in-slot gear
- **GWD**: Bandos, Sara, Arma, Zamorak, Nex (Asgarnia/Fremennik)
- **Forgotten Four** (DT2): Duke Sucellus, Leviathan, Whisperer, Vardorvis — BiS rings
- **Slayer**: Hydra (95), Thermy (93), Araxxor (92), Cerberus (91), Kraken (87), Sire (85), Grotesques (75)
- **Other**: Zulrah, Vorkath, Corp, KQ, Mole, Muspah, Nightmare, Colosseum

### Key Community Terms
GP (gold), KC (kill count), PB (personal best), BiS (best in slot), DPS (damage per second), EHP (efficient hours played), RNG (luck), dry (unlucky streaks), spoon (lucky drops), tick (0.6s game cycle), prayer flicking, combo eating.

### OSRS Wiki
- Official wiki: `oldschool.runescape.wiki` (MediaWiki API at `/api.php`)
- League task template: `RELTaskRow` (params: tier, id, region, s, other)
- Equipment stats template: `Infobox Bonuses` (astab/aslash/acrush/amagic/arange/dstab/dslash/dcrush/dmagic/drange/str/rstr/mdmg/prayer/slot)
- Wiki data is authoritative for task counts, point values, relic names, and region content
