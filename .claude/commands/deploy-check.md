Run a full pre-deploy verification to make sure everything works before pushing.

## Checklist

Run these steps in order:

1. **Lint**: `npm run lint` — fix any ESLint errors.

2. **Type check**: `npx tsc --noEmit` — verify no TypeScript errors.

3. **Build**: `npm run build` — confirm static export succeeds. Note: this runs wiki sync via prebuild, so it requires network access. If offline, temporarily rename the prebuild script.

4. **Tests**: `npm run test` — all 169 E2E tests must pass.

5. **Git status**: Check for any uncommitted changes, untracked files, or files that shouldn't be committed (.env, credentials, large binaries).

6. **Report**: Summarize results — what passed, what failed, what needs attention before deploy.

## Common issues

- **Build fails on wiki sync**: Network issue. Check if OSRS Wiki API is reachable. Can skip prebuild for offline development.
- **Tests timeout**: Dev server may not be running. Start `npm run dev` in another terminal first.
- **Type errors in data files**: Wiki sync may have generated malformed data. Check `src/data/` for syntax issues.
- **basePath issues**: Static export uses `/Gielenor-Guide` basePath in production. Links should use relative paths or respect basePath.
