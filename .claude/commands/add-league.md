Add a new OSRS league to Gielenor Guide. The user will provide the league name and any known details.

## Steps

1. **Research**: Check the OSRS Wiki for the new league page. Use `npm run sync-wiki` to attempt pulling data, or manually check `oldschool.runescape.wiki/w/Leagues/[LeagueName]`.

2. **Create data file**: Create `src/data/[league-slug].ts` exporting a `LeagueData` object. Use `src/data/demonic-pacts.ts` as the template. Include:
   - League metadata (name, slug, dates, description)
   - Regions (with types: starting, auto-unlock, choosable, inaccessible)
   - Relics (organized by tier)
   - Pacts (if applicable)
   - Tasks (from wiki sync or placeholder)
   - Reward tiers
   - Mechanic changes

3. **Register**: Add the league to `src/data/leagues.ts` registry.

4. **Create pages**: Add route pages under `src/app/leagues/[league-slug]/`:
   - `page.tsx` — Overview (copy from demonic-pacts, update data import)
   - `planner/page.tsx` — Build planner
   - `guide/page.tsx` — Strategy guide
   - `tasks/page.tsx` — Task tracker

5. **Update navigation**: Add to Header dropdown in `src/components/layout/Header.tsx`.

6. **Add metrics**: Add relic power ratings to `POWER_RATINGS` in `src/lib/relic-metrics.ts`.

7. **Add scoring**: Add synergies and archetypes to `src/lib/player-score.ts`.

8. **Add efficiency guide**: Create `src/data/guides/efficiency/[league-slug]-rank1.ts`.

9. **Warm tests**: Add new pages to `e2e/global-setup.ts` page list.

10. **Write E2E tests**: Create `e2e/[league-slug].spec.ts` covering overview, planner, guide, and task tracker.

11. **Verify**: Run `npm run build` and `npm run test`.

$ARGUMENTS
