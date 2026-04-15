# Legacy DreamOps Client (Archived)

The original `client/` React app powered the DreamOps control panel. It depended on a large bundle of shadcn components, home‑grown hooks, and schema exports that no longer align with the current monorepo.

Key notes:
- The code remains in the repository for reference but is **not** part of the active pnpm workspace.
- All `pnpm` scripts for `client` now emit a warning via `scripts/legacy-warning.js` so builds don’t fail.
- The modern frontend lives at `apps/site` and is the only project deployed to Vercel (`dreamnet.ink`).

If you ever need to revive the legacy console:
1. Restore the workspace by re-adding `client` to `package.json` / `pnpm-workspace.yaml`.
2. Bring back the missing components and hooks (see `client/src/components` for TODO markers).
3. Update imports to use shared TypeScript paths or extract utilities into `packages/`.

Until then, the preferred path is to migrate any still-relevant UI into the new site or mini-apps.

