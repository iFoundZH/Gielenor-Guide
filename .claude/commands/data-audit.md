Audit DPS calculator data accuracy by cross-referencing with the OSRS Wiki.

## What to verify

Based on the user's request (or audit everything if no specific area mentioned):

### Equipment stats
- Compare `src/data/items.ts` stats against the OSRS Wiki item pages
- Check attack bonuses, strength bonuses, speed, slot assignments
- Verify echo item stats match wiki (10 echo items from DP league)

### Boss presets
- Compare `src/data/boss-presets.ts` defence levels and bonuses against wiki boss pages
- Check boss size, combat style weaknesses, special properties (isDemon, isUndead, etc.)
- Verify magic level for bosses that use magic defence

### Pact skill tree
- Compare `src/data/pacts.ts` node effects against wiki DB source (`dbrow_definitions.json`)
- Verify node connections and point costs
- Check DPS-relevant effects (damage multipliers, accuracy bonuses, level boosts)

### DPS formulas
- Run `npx tsx scripts/dps-validation.ts` to validate calculations against wiki reference
- Check for any new test failures vs the known baseline (124 pass, 17 pre-existing failures)

## Process

1. Use WebFetch to check the relevant OSRS Wiki pages
2. Compare against local data files in `src/data/`
3. Report discrepancies with specific details
4. Fix any issues found (unless user wants report-only)
5. Run `npm run test:unit` and `npm run test` to verify nothing broke

## Known limitations
- Some boss defence values are estimated (wiki doesn't always publish exact numbers)
- Pact skill tree data is sourced from weirdgloop/osrs-dps-calc DB dumps, not directly from wiki pages
- 17 DPS validation test cases have pre-existing failures (documented in MEMORY.md)

$ARGUMENTS
