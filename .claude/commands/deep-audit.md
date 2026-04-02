Comprehensive data integrity audit: fresh wiki sync, cross-reference validation, missing page detection, content drift analysis, and site consistency check. This is a thorough, long-running operation.

$ARGUMENTS

---

## Overview

This audit ensures every piece of data displayed on Gielenor Guide is accurate, complete, and current. It pulls the latest wiki data, compares it against local files, detects missing pages, finds content drift, and validates the full data pipeline from sync through display.

**Time estimate**: 5-10 minutes depending on wiki responsiveness.

**Key principle**: Report findings, don't auto-fix unless the user explicitly requests fixes. Present the full report first.

---

## Phase 1: Fresh Wiki Sync + Baseline Capture

Run all sync scripts to pull the absolute latest data. This must complete before any comparison phases.

### Step 1a: Capture pre-sync state

```bash
git stash --include-untracked -m "deep-audit-pre-sync" 2>/dev/null || true
```

Wait — actually, do NOT stash. Instead just capture the current state for diffing:

```bash
git diff --stat src/data/
```

Note any uncommitted changes already present.

### Step 1b: Run all 3 sync scripts (sequentially — they share the wiki API)

```bash
npm run sync-wiki -- --merge
npm run sync-guides
npm run sync-data -- --merge
```

Capture stdout/stderr from each. Watch for:
- HTTP errors or timeouts (wiki API issues)
- "0 tasks parsed" warnings (parsing failures)
- "Skipping overwrite" messages (merge protection triggered)
- Template name mismatches (wiki changed task template names)
- Redirect chains (skill guide pages that moved)

### Step 1c: Regenerate sync status

```bash
npx tsx src/lib/sync-status.ts
```

### Step 1d: Capture post-sync diff

```bash
git diff --stat src/data/
git diff src/data/ > /tmp/deep-audit-diff.txt
```

Report:
- Which files changed and a summary of what changed
- New items added (tasks, quests, bosses, guides)
- Items removed or modified
- Any sync errors or warnings from script output
- Size of the diff (lines added/removed)

### Step 1e: Run the existing data audit script

```bash
npx tsx src/lib/data-audit.ts
```

Capture its OK/WARN/FAIL results as the baseline.

---

## Phase 2: Live Wiki Cross-Reference

**Run Phases 2-5 in parallel using the Task tool with subagent_type="general-purpose".** Each phase is an independent agent.

Fetch live wiki pages via WebFetch and compare against local data. For every check, note the specific local file, the wiki URL, and the exact discrepancy found.

### 2a. League Task Counts

For each league, fetch the task page and count tasks:

- **RE**: `https://oldschool.runescape.wiki/w/Raging_Echoes_League/Tasks`
  - Expected: 1,589 total (224 easy / 536 medium / 437 hard / 345 elite / 47 master)
  - Read `src/data/raging-echoes.ts` and count actual tasks per difficulty
  - Report any mismatch with exact numbers

- **DP**: `https://oldschool.runescape.wiki/w/Demonic_Pacts_League/Tasks`
  - Pre-launch (before Apr 15 2026): placeholder data OK, just note current count
  - Post-launch: compare task counts per difficulty against local data
  - Read `src/data/demonic-pacts.ts` for the local count

### 2b. Relic Verification

Fetch relic pages and verify names, tiers, and effects:

- **RE**: `https://oldschool.runescape.wiki/w/Raging_Echoes_League/Relics`
  - 23 relics expected across 8 tiers
  - Verify every relic name matches exactly (case-sensitive)
  - Check passive effects text

- **DP**: `https://oldschool.runescape.wiki/w/Demonic_Pacts_League/Relics`
  - Known relics: Endless Harvest, Barbarian Gathering, Abundance (T1), Woodsman (T2), Evil Eye (T3), Conniving Clues (T4), Culling Spree (T6), Minion (T8)
  - Check if wiki has added new relics not yet in local data

### 2c. Region Verification

- Fetch the main league pages:
  - `https://oldschool.runescape.wiki/w/Raging_Echoes_League`
  - `https://oldschool.runescape.wiki/w/Demonic_Pacts_League`
- Verify region names and types match local data
- Check `maxRegions` and unlock thresholds
- DP-specific: Varlamore=starting, Karamja=auto-unlock, Misthalin=inaccessible, 9 choosable

### 2d. Reward Tier Verification

From the main league pages, extract trophy thresholds:
- RE expected: 2000/4000/10000/20000/30000/45000/60000
- DP expected: 2500/5000/10000/18000/28000/42000/56000 (may be placeholder)
- Compare against `league.rewardTiers` in each data file

### 2e. Quest Count Verification

- Fetch `https://oldschool.runescape.wiki/w/Quests/List`
- Count total quests listed on wiki
- Read `src/data/osrs-quests.ts` and count local quests
- Report the gap (expected: 170+ local, wiki has ~203)
- Look for recently added quests that might be missing locally

### 2f. Boss List Verification

- Fetch `https://oldschool.runescape.wiki/w/Boss`
- Count bosses on wiki
- Read `src/data/osrs-bosses.ts` and count local bosses
- Cross-reference known missing bosses: TzTok-Jad, TzKal-Zuk, Sol Heredit, Nightmare/Phosani, Great Olm, Verzik, ToA bosses (Tumeken's Warden, etc.), Gauntlet (Crystalline/Corrupted Hunllef)
- Check if any previously missing bosses now appear in synced data
- Look for newly added bosses on wiki not in local data

---

## Phase 3: Missing Page Detection

Systematically check for wiki pages that should be synced but aren't covered.

### 3a. Skill Guide Coverage Matrix

Read `src/data/guides/skills/index.ts` and build a matrix:

For each of the 24 skills (Attack, Strength, Defence, Hitpoints, Ranged, Prayer, Magic, Cooking, Woodcutting, Fletching, Fishing, Firemaking, Crafting, Smithing, Mining, Herblore, Agility, Thieving, Slayer, Farming, Runecraft, Hunter, Construction, Sailing):
- Does a P2P guide exist? Does it have >0 training methods?
- Does a F2P guide exist? Does it have >0 training methods?
- Are any guides just empty stubs (file exists but 0 methods)?

Check `SKILL_PAGE_ALTERNATES` in `src/lib/wiki-sync-guides.ts` for known redirect issues.
Known issue: F2P Hitpoints guide may be missing.

### 3b. Diary Area Coverage

Read `src/data/guides/diaries/index.ts`:
- Verify all 12 areas present: Ardougne, Desert, Falador, Fremennik, Kandarin, Karamja, Kourend & Kebos, Lumbridge & Draynor, Morytania, Varlamore, Western Provinces, Wilderness
- Each area should have 4 tiers (easy/medium/hard/elite) with tasks
- Flag any area with 0 tasks in any tier

### 3c. Combat Achievement Coverage

Read `src/data/guides/combat-achievements.ts`:
- Verify all 6 tiers: easy, medium, hard, elite, master, grandmaster
- Wiki has 637 total CA tasks — compare our count
- Flag any tier with surprisingly low task count

### 3d. Missing Boss Entries

Read `src/data/osrs-bosses.ts` and check for these known-missing bosses:
- TzTok-Jad (Fight Caves), TzKal-Zuk (Inferno)
- Sol Heredit (Fortis Colosseum — Varlamore)
- Nightmare/Phosani's Nightmare
- Great Olm (Chambers of Xeric)
- Verzik Vitur (Theatre of Blood)
- Tumeken's Warden (Tombs of Amascut)
- Crystalline/Corrupted Hunllef (Gauntlet)
- Check if any new bosses were added to the game since last sync

### 3e. Missing Quest Entries

- Read `src/data/osrs-quests.ts` and get the list of quest names
- Fetch `Category:Quests` from wiki API (or use WebFetch on the quest list page)
- Find quests on wiki but missing locally
- Specifically check for new quests added in 2025-2026

### 3f. League Sub-Pages

Check for any new league wiki sub-pages that the sync doesn't cover:
- `{League}/Areas/*` (individual area pages with detailed content)
- `{League}/Rewards` (if separate from main page)
- `{League}/Strategies` (community strategy pages)
- Any new sub-pages added since last sync

---

## Phase 4: Content Drift Analysis

Check for places where local data has drifted from wiki data.

### 4a. Region Mapping Accuracy

Read `src/lib/wiki-region-map.ts`:
- Count total keyword mappings (expect ~290)
- Check the DT2 boss league classifications are still correct:
  - Duke Sucellus → fremennik
  - The Leviathan → desert
  - The Whisperer → asgarnia
  - Vardorvis → varlamore
- Check for obvious missing locations (new dungeons, new areas, Varlamore expansion)
- Verify the misthalin fallback isn't causing over-representation:
  - Read RE tasks, count tasks per region, calculate misthalin % (should be <30%)
  - Read DP tasks (if post-launch), same check

### 4b. Guide Content Freshness (Sample Check)

Pick 5 skill guides at random and for each:
- Fetch the wiki P2P training page
- Count the number of training method sections on wiki
- Compare against local method count in `src/data/guides/skills/{skill}-p2p.ts`
- Flag if wiki has significantly more methods than local
- Check if level ranges still make sense

### 4c. Quest Data Drift (Sample Check)

Pick 10 quests at random from `src/data/osrs-quests.ts` and for each:
- Fetch the wiki quest page (use quest name)
- Verify: quest points, skill requirements, quest requirements
- Check if start location → region mapping is correct
- Known issue: ~50 quests map to misthalin due to NPC name in `|start=` field

### 4d. Boss Data Drift (Sample Check)

Pick 10 bosses at random from `src/data/osrs-bosses.ts` and for each:
- Fetch the wiki boss page
- Verify: combat level, location, region mapping
- Check if boss category is correct (raid, gwd, dt2, wilderness, slayer, skilling, other)
- Known issues: Corp=asgarnia (not wilderness), Nex=asgarnia (GWD, not fremennik)

### 4e. Fabricated Number Detection (CRITICAL)

This project has had recurring issues with fabricated statistics. Scan these files for any specific numerical claims that aren't computed from real data:

Read and scan for suspicious fabricated numbers in:
- `src/data/guides/efficiency/*.ts` — GP/hr, XP/hr, pts/hr claims
- `src/data/guides/league/*.ts` — task counts per region, time estimates
- `src/data/guides/main.ts` — any specific numerical claims
- `src/data/guides/snowflake/*.ts` — kill rates, percentages, time estimates
- `src/components/league/EfficiencyGuideSection.tsx` — hardcoded numbers

Flag ANY instance of:
- Specific GP/hr or XP/hr numbers (unless computed from game data)
- "X tasks in Y region" counts (unless computed from task data)
- Time estimates like "takes ~X hours"
- Kill rate claims or DPS percentages
- Drop rate claims that don't match wiki

These MUST be qualitative descriptions or computed from real data, never invented.

---

## Phase 5: Site Consistency Check

Verify that all data consumed by the UI is consistent and complete.

### 5a. League Data Integrity

For each league, verify by reading the data file:
- All task IDs are unique (no duplicates)
- All task point values match difficulty tier: Easy=10, Medium=30, Hard=80, Elite=200, Master=400
- All tasks have valid difficulty values (one of the 5 tiers)
- All tasks have either a region assignment or intentionally blank region
- Relic tiers are numbered sequentially (T1, T2, T3...)
- Reward tier point thresholds are strictly ascending
- Point totals are mathematically correct: sum of (task count * difficulty points) should equal total

### 5b. Cross-Reference Integrity

Check that data used across multiple files is consistent:
- Boss regions in `src/data/osrs-bosses.ts` are valid region IDs that match the 14 canonical regions
- Quest regions in `src/data/osrs-quests.ts` are valid region IDs
- Region IDs used in league tasks match region IDs in the league's region list
- Relic names in `src/lib/relic-metrics.ts` POWER_RATINGS match relic names in league data exactly
- Relic names in `src/lib/player-score.ts` synergy/archetype definitions match league data

### 5c. Build System Health

Run these checks (sequentially):
```bash
npm run lint
npx tsc --noEmit
```

Report any lint errors or type errors. These indicate data files that may have been corrupted by sync.

### 5d. Guide Completeness Matrix

Build a comprehensive matrix showing coverage status:

| Category | Expected | Actual | Status |
|----------|----------|--------|--------|
| Skills (P2P) | 24 | ? | OK/WARN |
| Skills (F2P) | 24 | ? | OK/WARN |
| Diary areas | 12 | ? | OK/WARN |
| Diary tiers per area | 4 | ? | OK/WARN |
| CA tiers | 6 | ? | OK/WARN |
| CA total tasks | 637 | ? | OK/WARN |
| Ironman variants | 4 | ? | OK/WARN |
| Quest guides | 2 | ? | OK/WARN |
| Quests in DB | 170+ | ? | OK/WARN |
| Bosses in DB | 50+ | ? | OK/WARN |

### 5e. Sync Status JSON Validation

Read `src/data/sync-status.json` and verify:
- `generatedAt` is recent (within last hour, since we just regenerated)
- All league entries have non-zero taskCount
- All league entries have lastSynced date
- Guide counts are reasonable (skillGuideCount > 40, diaryAreaCount = 12, etc.)

---

## Phase 6: Report Generation

After ALL phases complete, compile a single comprehensive report.

### Report Format

```
# Deep Audit Report — {date}

## Executive Summary
- Overall health: X OK / Y WARN / Z FAIL
- Data freshness: {time since last sync per source}
- Total coverage: {items per category}
- Key finding: {most important issue found}

## Phase 1: Wiki Sync Results
- Files changed: {count}
- New items: {list}
- Removed items: {list}
- Sync errors: {any}
- Data audit baseline: {OK/WARN/FAIL counts}

## Phase 2: Wiki Cross-Reference
### Task Counts
| League | Wiki | Local | Match? |
|--------|------|-------|--------|
| RE     |      |       |        |
| DP     |      |       |        |

### Relics
- {relic mismatches if any}

### Regions
- {region mismatches if any}

### Reward Tiers
- {threshold mismatches if any}

### Quests
- Wiki count: X, Local count: Y, Gap: Z

### Bosses
- Wiki count: X, Local count: Y, Gap: Z
- Still missing: {list}

## Phase 3: Missing Pages
### Coverage Matrix
{skill guide matrix}
{diary matrix}
{CA matrix}

### Missing Items
- {list of specific missing pages/entries}

## Phase 4: Content Drift
### Region Mapping
- Total mappings: X
- Misthalin over-representation: X%
- DT2 classifications: {correct/incorrect}

### Sampled Guides
- {findings from 5 skill guide checks}

### Sampled Quests
- {findings from 10 quest checks}

### Sampled Bosses
- {findings from 10 boss checks}

### Fabricated Number Scan
- {any fabricated numbers found with file:line references}

## Phase 5: Site Consistency
### Data Integrity
- {task ID duplicates}
- {point value mismatches}
- {cross-reference issues}

### Build Health
- Lint: {pass/fail}
- TypeScript: {pass/fail}

### Completeness Matrix
{full matrix table}

## Recommendations
### Critical (FAIL)
1. {most urgent fixes}

### Important (WARN)
1. {should fix soon}

### Nice to Have
1. {low priority improvements}

### Whether to Re-Deploy
- {yes/no with rationale}
```

---

## Important Rules

1. **Never fabricate data.** If you can't verify something from wiki, say "could not verify" explicitly.
2. **Use --merge flag** on sync-wiki and sync-data to preserve hand-curated content.
3. **DP pre-launch awareness** (launches Apr 15 2026). Before that date, placeholder data is expected. After that date, expect 1000+ tasks.
4. **Wiki is authoritative** for task counts, point values, relic names, region content.
5. **Report don't fix** unless the user explicitly asks for fixes. Present the full report first.
6. **Parallelize Phases 2-5** using the Task tool with separate agents. Phase 1 must complete first. Phase 6 compiles results from all.
7. **Check MEMORY.md** for known gotchas before flagging false positives (quest region mapping, missing bosses, etc.)
8. **Sample-based verification** is OK for large datasets — check 5-10 items rather than exhaustive.
9. **Include file:line references** for every issue found so the user can navigate directly.
10. **Flag regressions** — if something was OK in the data-audit baseline but is now broken, that's a critical finding.
