# Vercel Output Directory Setting

## Current Configuration

**Root Directory:** `.` (repo root)  
**Output Directory:** `client/dist`

## Why `client/dist`?

Since we're building from the repo root using:
```bash
pnpm --filter client run build
```

The build command runs from the repo root, and the output goes to `client/dist/` (relative to repo root).

## Settings Summary

| Setting | Value | Why |
|---------|-------|-----|
| **Root Directory** | `.` (or empty) | We're working from repo root |
| **Output Directory** | `client/dist` | Build output is in `client/dist/` relative to root |
| **Install Command** | `corepack enable pnpm && corepack prepare pnpm@10.21.0 --activate && pnpm --filter client... install` | Installs from repo root |
| **Build Command** | `pnpm --filter client run build` | Builds from repo root |

## Alternative Configuration

If you set **Root Directory** to `client`, then:
- **Output Directory** would be: `dist` (just "dist")
- **Install Command** would be: `pnpm install` (no filter needed)
- **Build Command** would be: `pnpm build` (no filter needed)

But our current setup (root = `.`, output = `client/dist`) is correct for the monorepo structure.

---

## Answer: Use `client/dist`

Not just `dist` - use `client/dist` because we're building from the repo root.

