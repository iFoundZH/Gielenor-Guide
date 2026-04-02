Sync data from the OSRS Wiki. Run the appropriate sync script(s) based on what needs updating.

## Steps

1. Determine what to sync based on user request:
   - **League data** (tasks, relics, pacts, regions): `npm run sync-wiki`
   - **Game guides** (skills, ironman, quests, diaries, CAs): `npm run sync-guides`
   - **Quest/boss database**: `npm run sync-data`
   - **All**: Run all three in sequence

2. Use the `--merge` flag when you want to preserve hand-curated data (tasks, pacts, rewards, region descriptions) that the wiki doesn't have. Without `--merge`, wiki data overwrites everything.

3. After syncing, run `git diff src/data/` to review what changed.

4. If task data changed significantly, run `npm run compute-guide-stats` to recompute region statistics.

5. Verify the build still works: `npm run build`

6. Run tests to confirm nothing broke: `npm run test`

## Common scenarios

- **New league announced**: Run `npm run sync-wiki` to pull new league page data
- **Wiki updated task lists**: Run `npm run sync-wiki -- --merge` to get new tasks while keeping curated pacts/rewards
- **Quest/boss data stale**: Run `npm run sync-data -- --merge`
- **Skill guides updated**: Run `npm run sync-guides`

$ARGUMENTS
