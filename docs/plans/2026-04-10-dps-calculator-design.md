# Demonic Pacts DPS Calculator — Design Doc

**Date:** 2026-04-10
**Status:** Approved

## Goal

Replace the existing Gielenor Guide league companion with a hyper-accurate DPS calculator and gear optimizer for the Demonic Pacts league. The calculator implements exact OSRS DPS formulas, all 130+ pact modifiers, 10 echo items, and smart gear optimization.

## Architecture

### Data Layer

**Item Database** (`src/data/items.ts`)
- Static TypeScript array, wiki-verified stats
- Fields: name, slot, regions[], 5 attack bonuses, 5 defence bonuses, melee str, ranged str, magic dmg%, prayer, speed (ticks), passive effects, notes
- ~100 items covering BIS + common alternatives per slot
- Echo items: V's helm, King's barrage, Infernal tecpatl, Fang of the hound, Shadowflame quadrant, Nature's recurve, Devil's element, Lithic sceptre, Drygore blowpipe, Crystal blessing

**Pact Database** (`src/data/pacts.ts`)
- All ~130 pacts with DPS-modifying effects as typed modifiers
- Each pact: id, name, description, condition function, effect function
- Organized by tree branch (A through N)

**Boss Presets** (`src/data/boss-presets.ts`)
- Common league bosses: def level, def bonuses, magic level, magic def, HP
- Includes echo bosses, raid bosses, GWD, DT2, slayer bosses

### DPS Engine (`src/lib/dps-engine.ts`)

Pure functions, exact OSRS formula chain:

1. Effective Level = FLOOR((baseLvl + potionBoost) × prayerMulti) + styleBonus
2. Equipment Strength = sum of gear + pact bonuses (G6: +20% STR, G7: +50% prayer)
3. Base Max Hit (melee/ranged vs magic/Shadow variants)
4. Multiplier chain: Void → Slayer/V's helm → style% → xbow+70% → Shadow+3% → halberd+4%/3tiles → TBow → Scythe
5. Attack Roll = (effLvl + 8) × (equipAtk + 64) × (1 + pactAccBonus) × voidAcc
6. Defence Roll = (enemyDefLvl + 9) × (enemyDefBonus + 64)
7. Accuracy (standard OSRS formula)
8. Double roll for crossbows: acc = 1 - (1-acc)²
9. Base DPS + always-max-hit + light weapon bonus
10. Echo cascade: rate × (1 + p/2 + p/4 + p/8)
11. Weapon passives (TBow, Scythe, Blindbag, Shadowflame, etc.)
12. Flask of Fervour flat bonus

### Gear Optimizer (`src/lib/gear-optimizer.ts`)

- Input: player stats, unlocked regions, active pacts, target boss
- Smart pruning: filter by combat style, eliminate cross-style gear
- Evaluate all valid slot combinations (~100K per style)
- Return top N builds sorted by DPS
- Runs synchronously (no web workers needed for pruned set)

### Region Filtering

Every item has `regions: RegionId[]`. Optimizer filters item pool by player's unlocked regions. Starting regions (Misthalin, Karamja) always available. Echo items locked to their boss's region.

## Pages

### `/` — Home
- Hero with league branding
- Quick-start: pick combat style → top 5 builds
- Boss selector
- Link to full calculator

### `/calculator` — Main Calculator
Three-panel layout:
1. **Left: Configuration** — Player stats, regions, pacts, target boss
2. **Center: Top Builds** — Auto-computed top 5 with full gear, DPS, max hit, accuracy. Expandable formula breakdown. Side-by-side comparison.
3. **Right: Gear Details** — Item stats on hover, alternatives, "what if" DPS delta

### `/items` — Item Database
Full item browser with slot/region/stat filtering and sorting.

### `/formulas` — Formula Reference
Complete OSRS DPS formula documentation with pact interaction details.

## Tech Stack

- Next.js 16, React 19, TypeScript 6, Tailwind CSS 4 (unchanged)
- Static export, client-side only (unchanged)
- Dark OSRS theme with Cinzel font (unchanged)
- URL sharing via encoded build params
- localStorage for saved builds

## Echo Items (Wiki-Verified 2026-04-10)

| Item | Slot | Region | Key Stats | Passive |
|------|------|--------|-----------|---------|
| V's helm | Head | Fremennik | +8 mag, +12 rng, +8 mstr, +2 rstr, +3% mdmg | Built-in slayer helm (i), 5% dmg→0 |
| King's barrage | 2H Weapon | Wilderness | +130 rng, +14 rstr, 6-tick | Always fires 2 bolts (halved max hit each), freeze |
| Infernal tecpatl | 2H Weapon | Varlamore | +72 all melee atk, +70 str, 4-tick | Hits twice per attack, 10% demonbane |
| Fang of the hound | 1H Weapon | Asgarnia | +60 stab/slash, +20 str, 3-tick | 5% Flames of Cerberus proc |
| Shadowflame quadrant | 2H Weapon | Kandarin | +60 crush, +25 mag, +50 str, +15% mdmg, 5-tick | 40% bonus spell attack, infinite runes |
| Nature's recurve | 2H Weapon | Kourend | +95 rng, +4 rstr, 4-tick | 50% chance heal 10% of damage |
| Devil's element | Off-hand | Kandarin | +20 mag, +6% mdmg, +3 prayer | +30% elemental weakness on target |
| Crystal blessing | Ammo | Tirannwn | +5 prayer | Extends crystal armour bonus to melee/magic; +2% mdmg +20 mag per crystal piece |
| Lithic sceptre | 2H Weapon | Morytania | +25 mag, 4-tick | Powered staff, stacks shatter (14 max), spec consumes stacks |
| Drygore blowpipe | 2H Weapon | Desert | +50 rng, +10 rstr, 2-tick rapid | Double accuracy roll, 25% burn |

## Removed Features

All existing pages removed:
- League overview, planner, tasks, path, guide
- General guides (skills, quests, diaries, combat achievements, ironman, snowflake)
- Snowflake planner
- Gielinor Score, build analysis, relic metrics
