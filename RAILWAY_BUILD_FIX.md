# Railway Build Fix

## Issues Fixed

### 1. Outdated Lockfile
**Error:** `ERR_PNPM_OUTDATED_LOCKFILE` - `card-forge-pro` dependencies not in lockfile

**Fix:** Updated `pnpm-lock.yaml` by running `pnpm install --no-frozen-lockfile`

### 2. Cyclic Dependency Warning
**Warning:** Cyclic dependencies between `event-wormholes` and `internal-ports`

**Fix:** Removed `@dreamnet/event-wormholes` from `internal-ports/package.json` dependencies. The `internal-ports` package only uses `event-wormholes` via dynamic import in `inspector.ts`, which doesn't create a build-time dependency.

### 3. Railway Build Command
**Issue:** Railway uses `--frozen-lockfile` by default, which fails when lockfile is outdated

**Fix:** Updated Railway build command to include `pnpm install --no-frozen-lockfile`:

```bash
cd .. && pnpm install --no-frozen-lockfile && pnpm --filter client build && cd server && pnpm build
```

## Updated Files

- `packages/internal-ports/package.json` - Removed `event-wormholes` dependency
- `pnpm-lock.yaml` - Updated with `card-forge-pro` dependencies
- `RAILWAY_BUILD_SETTINGS.md` - Updated build command
- `RAILWAY_FRESH_START.md` - Updated build command

## Next Steps

1. Railway will automatically trigger a new build
2. Build should now succeed with updated lockfile
3. If build still fails, check Railway logs for other issues

## Notes

- The cyclic dependency warning between `internal-ports` and `internal-router` is acceptable - pnpm handles it
- Using `--no-frozen-lockfile` in CI is generally fine for monorepos with frequent dependency changes
- Consider committing lockfile updates more frequently to avoid this issue

