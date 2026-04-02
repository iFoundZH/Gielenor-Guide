Audit league data accuracy by cross-referencing with the OSRS Wiki.

## What to verify

Based on the user's request (or audit everything if no specific area mentioned):

### Task data
- Fetch the league wiki page and count tasks per difficulty tier
- Compare with local data in `src/data/[league].ts`
- Verify point values match: Easy=10, Medium=30, Hard=80, Elite=200, Master=400
- Check total point calculations

### Relic data
- Verify relic names match wiki exactly
- Check tier assignments
- Verify relic effects/descriptions

### Region data
- Verify region types (starting, choosable, inaccessible)
- Check maxRegions and unlock thresholds
- Verify region content (bosses, quests, skills listed)

### Reward tiers
- Compare trophy thresholds with wiki
- Verify reward names and descriptions

## Process

1. Use WebFetch to check the relevant OSRS Wiki pages
2. Compare against local data files in `src/data/`
3. Report discrepancies with specific line numbers
4. Fix any issues found (unless user wants report-only)
5. If data was changed, run `npm run test` to verify nothing broke

## Known limitations
- Quest region mapping: ~50 quests incorrectly map to misthalin because wiki `|start=` uses NPC names
- DP data is placeholder until league launch (Apr 15 2026)
- Boss list is missing some entries (TzTok-Jad, Great Olm, Verzik, etc.)

$ARGUMENTS
