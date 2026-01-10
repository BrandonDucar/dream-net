# Failure Notes & Troubleshooting

## Common Failure Modes

### 1. "Command not found: pnpm"
**Symptom:** Vercel build log shows `sh: pnpm: command not found`.
**Fix:**
- Go to Project Settings > General > Install Command.
- Override with: `npm install -g pnpm && pnpm install --no-frozen-lockfile`
- *Note:* Vercel usually detects pnpm via `packageManager` in `package.json`, but manual override fixes edge cases.

### 2. "Module not found: @dreamnet/..."
**Symptom:** Build fails importing a local workspace package.
**Fix:**
- Ensure `pnpm install` ran successfully in the root.
- Ensure the referenced package is included in the build context (checked via `.vercelignore`).
- *Hypothesis:* If `packages/` is ignored in `.vercelignore`, the build will fail.
    - *Correction:* We ignored `packages/*/node_modules` but NOT `packages/` itself. This is correct.

### 3. "Frozen Lockfile" Error
**Symptom:** `ERR_PNPM_LOCKFILE_BREAKING_CHANGE`
**Fix:**
- We explicitly set `installCommand: "pnpm install --no-frozen-lockfile"` in `vercel.json` to prevent this.
- If it still happens, ensure Vercel is actually using our `vercel.json` config (check build logs).

### 4. API Returns HTML
**Symptom:** `/api/v1/health` returns the React app HTML.
**Fix:**
- Check `vercel.json` rewrites.
- Ensure `api.dreamnet.ink` is actually up and running.
- Verify the `source` pattern matches the request path.
