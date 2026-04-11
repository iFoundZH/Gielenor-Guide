Sync equipment data from the OSRS Wiki.

## Available sync

- **Equipment data**: `npm run sync:items` — fetches item stats from the OSRS Wiki API via `scripts/sync-items.py` (requires Python 3). Outputs to `src/data/equipment-db.json`.

## Steps

1. Run `npm run sync:items` to pull the latest equipment data from the wiki.

2. After syncing, review what changed: check `src/data/equipment-db.json` for new or modified items.

3. Run `npm run test:unit` to verify data integrity tests still pass (especially `data-integrity.test.ts`).

4. Run `npm run build` to confirm the build succeeds.

5. Run `npm run test` to confirm E2E tests pass.

## Notes

- The sync script fetches all equippable items with their combat stats (attack/defence bonuses, strength, prayer, speed).
- `equipment-db.json` is the raw wiki source; `items.ts` contains the curated subset used by the DPS calculator.
- If new echo items or pact-related equipment is added to the game, manually update `items.ts` after syncing.

$ARGUMENTS
