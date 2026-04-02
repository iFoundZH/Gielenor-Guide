Run E2E tests and analyze results. Handle test failures by investigating and fixing root causes.

## Running tests

- **All tests**: `npm run test`
- **Specific file**: `npx playwright test e2e/[filename].spec.ts`
- **Specific test**: `npx playwright test -g "test name pattern"`
- **Interactive UI**: `npm run test:ui`
- **With trace**: Tests already capture trace on first retry

## Test files (10 specs, ~167 tests)

| File | Coverage |
|------|----------|
| `demonic-pacts.spec.ts` | DP guide, planner, overview |
| `raging-echoes.spec.ts` | RE guide, planner, overview, masteries |
| `build-planner.spec.ts` | Cross-league planner mechanics |
| `task-tracker.spec.ts` | Task filtering, completion, sorting |
| `build-analysis.spec.ts` | Analysis panel outputs |
| `guides.spec.ts` | Main game guide pages |
| `snowflake.spec.ts` | Snowflake account mode |
| `navigation.spec.ts` | Nav links, routing |
| `homepage.spec.ts` | Homepage content |

## If tests fail

1. Read the error output carefully — look for selector mismatches, timeout issues, or data changes.
2. Check if the failure is a flaky test (sticky nav overlay, timing) vs a real bug.
3. For overlay issues: use `element.evaluate(el => el.click())` instead of `.click()`.
4. For timing issues: add `waitForTimeout(300)` after state changes or use proper `waitFor` assertions.
5. For data changes: update test assertions to match current data (check `src/data/` files).

## Writing new tests

Follow patterns in existing specs. Key conventions:
- Scope analysis assertions to `#analysis` section
- Use `h4:has-text('Name')` for relic clicks
- Use `h5 >> text=Name` for region clicks
- Use task row selector: `div.rounded-lg.border.cursor-pointer:has-text('pts')`
- Add new pages to `e2e/global-setup.ts` warm-up list

$ARGUMENTS
