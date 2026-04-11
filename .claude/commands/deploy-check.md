Run a full pre-deploy verification to make sure everything works before pushing.

## Checklist

Run these steps in order:

1. **Lint**: `npm run lint` — fix any ESLint errors.

2. **Type check**: `npx tsc --noEmit` — verify no TypeScript errors.

3. **Unit tests**: `npm run test:unit` — all 201 unit tests must pass.

4. **Build**: `npm run build` — confirm static export succeeds.

5. **E2E tests**: `npm run test` — all 36 E2E tests must pass (requires dev server on :3000).

6. **Git status**: Check for any uncommitted changes, untracked files, or files that shouldn't be committed (.env, credentials, large binaries).

7. **Report**: Summarize results — what passed, what failed, what needs attention before deploy.

## Common issues

- **Tests timeout**: Dev server may not be running. Start `npm run dev` in another terminal first.
- **Type errors in data files**: Wiki sync may have generated malformed data. Check `src/data/` for syntax issues.
- **basePath issues**: Static export uses `/Gielenor-Guide` basePath in production. Links should use relative paths or respect basePath.
- **Pre-commit hook failures**: Husky runs lint + unit tests on commit. Fix issues before committing.
