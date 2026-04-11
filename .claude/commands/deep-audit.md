Comprehensive data integrity audit for the DPS calculator: equipment stats validation, boss preset verification, pact skill tree cross-reference, and DPS formula validation against wiki sources.

$ARGUMENTS

---

## Overview

This audit ensures every piece of data in the DPS calculator is accurate and current. It validates equipment stats, boss presets, pact skill tree data, and DPS formulas against authoritative wiki sources.

**Key principle**: Report findings, don't auto-fix unless the user explicitly requests fixes. Present the full report first.

---

## Phase 1: Equipment Data Validation

Compare `src/data/items.ts` against wiki sources.

### Step 1a: Sync latest equipment data

```bash
npm run sync:items
```

### Step 1b: Compare curated items against wiki DB

Read `src/data/items.ts` and `src/data/equipment-db.json`. For each item in `items.ts`, verify:
- Attack bonuses match wiki
- Strength/ranged str/magic dmg% match wiki
- Attack speed matches wiki
- Slot assignment is correct
- Special properties (is2h, etc.) are correct

### Step 1c: Echo items

The 10 echo items have wiki-verified stats. Cross-reference each against:
- OSRS Wiki item pages (use WebFetch)
- `equipment-db.json` synced data

Report any discrepancies with exact values.

---

## Phase 2: Boss Preset Validation

Compare `src/data/boss-presets.ts` against wiki boss pages.

For each boss preset, verify:
- Defence level
- Defence bonuses (stab/slash/crush/magic/ranged)
- Magic level (used for magic defence roll)
- Size (affects scythe hits: 1=1hit, 2=2hits, 3+=3hits)
- Boolean flags: isDemon, isUndead, isDragon, isKalphite, etc.
- Elemental weakness (if any)

Use WebFetch to check wiki pages for bosses. Prioritize DT2 bosses, GWD bosses, and raid bosses.

---

## Phase 3: Pact Skill Tree Validation

Compare `src/data/pacts.ts` against the authoritative source: `dbrow_definitions.json` from weirdgloop/osrs-dps-calc.

Verify:
- All ~85 nodes are present
- Node connections (adjacency) are correct
- Point costs match
- DPS-relevant effects have correct values (damage %, accuracy %, level boosts)
- Unsupported effects are properly flagged

---

## Phase 4: DPS Formula Validation

### Step 4a: Run the validation script

```bash
npx tsx scripts/dps-validation.ts
```

### Step 4b: Analyze results

- Baseline: 124 pass, 17 pre-existing failures
- If new failures appear, investigate the specific formula that changed
- Cross-reference against `PlayerVsNPCCalc.ts` from weirdgloop/osrs-dps-calc

### Step 4c: Unit tests

```bash
npm run test:unit
```

All 201 unit tests should pass. Report any failures.

---

## Phase 5: Cross-Cutting Validation

### Step 5a: Run data integrity tests

The `src/data/__tests__/data-integrity.test.ts` file validates internal consistency:
- All items have valid stat ranges
- All boss presets have required fields
- All pact nodes have valid connections

### Step 5b: Build verification

```bash
npm run build
```

Confirm static export succeeds with no TypeScript errors.

### Step 5c: E2E smoke test

```bash
npm run test
```

All 36 E2E tests should pass.

---

## Phase 6: Report

Compile findings into a structured report:

1. **Equipment**: X items checked, Y discrepancies found
2. **Bosses**: X presets checked, Y discrepancies found
3. **Pacts**: X nodes checked, Y discrepancies found
4. **Formulas**: X/124 passing (vs baseline), new failures: [list]
5. **Recommendations**: Priority fixes ordered by impact on DPS accuracy
