# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Gielinor Guide is a **DPS Calculator** for the OSRS Demonic Pacts League (live Apr 15–Jun 10 2026). Implements exact OSRS combat formulas, a pact skill tree (132 nodes sourced from wiki DB), a smart gear optimizer, boss presets, and 10 echo items with wiki-verified stats. Purely client-side with no backend; builds are saved in localStorage.

## Commands

```bash
npm run dev              # Dev server on :3000
npm run build            # Production build (static export to /out/)
npm run lint             # ESLint (flat config: TS, React hooks, Next.js rules)
npm run test             # Run all Playwright E2E tests (36 tests, 5 spec files)
npm run test:ui          # Interactive Playwright test runner
npm run test:unit        # Run Vitest unit tests (363 tests, 6 test files)
npm run test:unit:watch  # Vitest in watch mode
npm run sync:items       # Sync equipment data from wiki (requires Python 3)
npm run sync:bosses      # Sync boss data from wiki monsters.json (requires Python 3)
```

## Testing

### Playwright E2E tests

In `e2e/` directory — 36 tests across 5 spec files, Chromium only.

- Dev server on `:3000`, tests reuse existing server (`reuseExistingServer: true`)
- Global setup warms 4 pages (/, /calculator, /items, /formulas)
- Single worker, 1 retry, trace on first retry

### Vitest unit tests

In `src/lib/__tests__/` and `src/data/__tests__/` — 359 tests across 6 files.

- `dps-engine.test.ts` (126 tests) — core DPS formula coverage + special attack DPS
- `pact-effects.test.ts` (56 tests) — pact skill tree aggregation
- `data-integrity.test.ts` (80 tests) — validates all items, bosses, pacts, spec attacks
- `gear-optimizer.test.ts` (52 tests) — optimizer correctness
- `build-storage.test.ts` (8 tests) — save/load/encode/decode
- `wiki-compare.test.ts` (2 tests) — wiki data comparison

Pre-commit hook runs `npm run test:unit` automatically via husky.

### Test conventions

- **Scope selectors**: Use `page.locator("header")` or `page.locator("footer")` to avoid multi-element matches
- **DPS value**: Use `page.getByTestId("dps-value")` for the DPS result number
- **Equipment slots**: Use `getByRole("button", { name: "Weapon Empty" })` for gear grid buttons
- **Combat style tabs**: Use `page.locator("button:has-text('melee')").first()` to avoid footer matches
- **Boss selector**: Use `page.getByPlaceholder("Search bosses...")` then click a result

## Architecture

**Next.js 16 App Router** with static export (`output: "export"` in next.config.ts). React 19, TypeScript 6, Tailwind CSS 4. GitHub Pages deployment with `basePath: "/Gielenor-Guide"` in production.

### Path alias

`@/*` maps to `./src/*` (configured in tsconfig.json).

### Source layout

- `src/app/` — App Router pages: `/` (home), `/calculator`, `/items`, `/formulas`
- `src/components/layout/` — Header, Footer
- `src/components/ui/` — Badge, Card, ProgressBar, Tabs (reusable OSRS-themed components)
- `src/components/calculator/` — Calculator-specific: PlayerConfigPanel, BossSelector, RegionSelector, PactSkillTree, GearGrid, ItemPicker, DpsResultCard, DpsBreakdown, TopBuildsPanel
- `src/data/` — Static data: `items.ts` (dynamic from wiki DB + 14 manual), `pacts.ts` (132 skill tree nodes), `boss-presets.ts` (41 bosses from boss-db.json), `spec-attacks.ts` (40+ weapon special attacks), `equipment-db.json` (wiki-synced equipment), `boss-db.json` (wiki-synced boss stats)
- `src/lib/` — Core logic: `dps-engine.ts`, `gear-optimizer.ts`, `build-storage.ts`, `pact-effects.ts` (skill tree aggregation), `wiki-compare.ts` (wiki data comparison)
- `scripts/` — `sync-items.py` (wiki equipment sync), `sync-bosses.py` (wiki boss sync), `dps-validation.ts` (formula validation vs wiki reference)
- `src/types/dps.ts` — All TypeScript type definitions

### Data flow

1. Item/pact/boss data is statically imported from `src/data/`.
2. Calculator state managed by `useReducer` in the calculator page.
3. DPS computed reactively via `useMemo` calling `calculateDps()`.
4. Builds saved to localStorage via `src/lib/build-storage.ts`.
5. No server-side data fetching — everything runs client-side.

### Key systems

- **DPS Engine** (`src/lib/dps-engine.ts`): Exact OSRS combat formulas — effective level, max hit, accuracy, attack/defence rolls, multiplier chain, echo cascade, weapon passives, special attack blended DPS. Exported: `calculateDps`, `calculateMaxHit`, `calculateAccuracy`, `calculateAttackRoll`, `calculateDefenceRoll`, `getMultiplierChain`.
- **Spec Attacks** (`src/data/spec-attacks.ts`): Declarative data for 40+ weapon special attacks — energy cost, acc/dmg multipliers, cascade types (dragon claws), guaranteed hits. `getSpecAttack(id)`, `hasSpecAttack(id)`.
- **Gear Optimizer** (`src/lib/gear-optimizer.ts`): Brute-force search with dominated-item pruning, weapon-first enumeration, locked slot support, top-N heap. `optimizeGear(config) → OptimizerResult[]`.
- **Build Storage** (`src/lib/build-storage.ts`): `getBuilds`/`saveBuild`/`deleteBuild` for localStorage. `encodeBuild`/`decodeBuild` for URL sharing via base64.
- **Pact Effects** (`src/lib/pact-effects.ts`): Aggregation layer that sums all active skill tree node effects into a single `PactEffects` object consumed by the DPS engine. Called once per DPS calculation.

### localStorage keys

- `gielinor-dps-builds` — Saved DPS calculator builds

## DPS Formula Chain

1. Effective Level = FLOOR((base + potion) × prayer) + styleBonus
2. Equipment Strength = sum gear str + pact additive (G6, G7)
3. Base Max Hit (melee/ranged vs magic/powered-staff formulas)
4. Multiplier chain: Void → Slayer Helm → Style Pacts → K8 → Shadow 3x → Halberd → TBow → Shadowflame → Arclight → Devil's Element
5. Attack Roll, Defence Roll (magic uses magicLevel; ranged uses light/standard/heavy split by weapon category)
6. Accuracy (standard OSRS formula, with double-roll for Fang/N7/Drygore)
7. DPS = (maxHit/2 × accuracy) / (ticks × 0.6)
8. Bonus hits (D2 light, D3 heavy), echo cascade (K3), weapon passives
9. Special attack blended DPS: spec on cooldown + normal attacks during regen (500-tick cycle)

## Styling

OSRS-themed dark UI in `src/app/globals.css` using Tailwind CSS 4 custom theme:
- Colors: `--color-osrs-gold`, `--color-demon-glow`, `--color-osrs-dark`
- Font: Cinzel (`--font-runescape`) for headings
- Animations: `ember-glow`, `flicker`, `fill-progress`
- Utilities: `text-glow-gold`, `text-glow-red`, `border-glow-gold`, `border-glow-red`, `border-glow-blue`, `card-hover`, `fire-text`

## Data accuracy rules

- **Every decision that CAN be data-driven MUST be data-driven.** Before writing any value — item stat, boss property, formula coefficient, region assignment, drop source, effect magnitude — look it up from a primary source. Cite the source inline (wiki page, repo file, API response) so it can be verified. "I think" or "it should be" is never acceptable when a lookup is possible. If no source exists, say so explicitly rather than guessing.
- **Wiki data is authoritative** for item stats, boss defence values, and combat formulas.
- **Never fabricate specific numbers** — all DPS values are computed from formulas.
- **10 echo items** have wiki-verified stats from Apr 10 2026 reveal.
- **Pact skill tree** nodes are sourced from wiki DB (`dbrow_definitions.json`) with exact effect values.

## OSRS Domain Knowledge

This app targets OSRS (Old School RuneScape) players. Key domain concepts:

### Combat
- Three styles: melee, ranged, magic. Game runs on 0.6s ticks.
- DPS = (max hit / 2 × accuracy) / (attack speed in ticks × 0.6)
- Equipment bonuses: 5 attack, 5 defence, melee str, ranged str, magic dmg%, prayer.

### Demonic Pacts League
- Leagues VI. Separate servers, boosted XP/drops, pact skill tree.
- Pact skill tree: 132 interconnected nodes (40 point budget), sourced from wiki DB. ~25 nodes are DPS-relevant.
- Echo items: 10 powerful items tied to specific regions.
- Regions: Varlamore + Karamja start, 3 choosable from 8. Misthalin is completely inaccessible.
