Run tests and analyze results. Handle test failures by investigating and fixing root causes.

## Running tests

- **All E2E**: `npm run test`
- **All unit**: `npm run test:unit`
- **Specific E2E file**: `npx playwright test e2e/[filename].spec.ts`
- **Specific E2E test**: `npx playwright test -g "test name pattern"`
- **Interactive UI**: `npm run test:ui`
- **Unit watch mode**: `npm run test:unit:watch`

## E2E test files (5 specs, 36 tests)

| File | Tests | Coverage |
|------|-------|----------|
| `calculator.spec.ts` | 14 | DPS calculator, gear selection, boss presets, pact effects |
| `homepage.spec.ts` | 7 | Homepage content and layout |
| `items.spec.ts` | 7 | Items database page |
| `navigation.spec.ts` | 4 | Nav links, routing between pages |
| `formulas.spec.ts` | 4 | Formula reference page |

## Unit test files (5 files, 201 tests)

| File | Tests | Coverage |
|------|-------|----------|
| `src/lib/__tests__/dps-engine.test.ts` | 80 | Core DPS formula calculations |
| `src/data/__tests__/data-integrity.test.ts` | 58 | Item stats, boss presets, pact data validation |
| `src/lib/__tests__/pact-effects.test.ts` | 41 | Pact skill tree aggregation |
| `src/lib/__tests__/gear-optimizer.test.ts` | 14 | Optimizer correctness |
| `src/lib/__tests__/build-storage.test.ts` | 8 | Save/load/encode/decode builds |

## If tests fail

1. Read the error output carefully — look for selector mismatches, timeout issues, or data changes.
2. Check if the failure is a flaky test (sticky nav overlay, timing) vs a real bug.
3. For overlay issues: use `element.evaluate(el => el.click())` instead of `.click()`.
4. For timing issues: add `waitForTimeout(300)` after state changes or use proper `waitFor` assertions.
5. For data changes: update test assertions to match current data (check `src/data/` files).
6. For unit test failures: check if `src/types/dps.ts` types changed — pact-effects and dps-engine tests are sensitive to type changes.

## Writing new tests

### E2E conventions
- Scope selectors: use `page.locator("header")` or `page.locator("footer")` to avoid multi-element matches
- DPS value: use `page.getByTestId("dps-value")` for the DPS result number
- Equipment slots: use `getByRole("button", { name: "Weapon Empty" })` for gear grid buttons
- Combat style tabs: use `page.locator("button:has-text('melee')").first()` to avoid footer matches
- Boss selector: use `page.getByPlaceholder("Search bosses...")` then click a result
- Add new pages to `e2e/global-setup.ts` warm-up list

### Unit test conventions
- Co-locate with source: `src/lib/__tests__/` and `src/data/__tests__/`
- Use vitest `describe`/`it` blocks
- DPS engine tests should validate against wiki reference values

$ARGUMENTS
