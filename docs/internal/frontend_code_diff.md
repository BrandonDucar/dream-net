# Code Diff Artifact - Frontend Deployment Surgeon

## 1. `vercel.json`
**Rationale:** Added `installCommand` to explicitly use `pnpm install --no-frozen-lockfile`. This is crucial for monorepos where lockfiles might not always be perfectly in sync with the root, or when Vercel's default behavior (often `npm install`) isn't desired.

```diff
  {
    "version": 2,
    "rootDirectory": "client",
    "buildCommand": "pnpm run build",
+   "installCommand": "pnpm install --no-frozen-lockfile",
    "outputDirectory": "dist",
    "framework": null,
    "rewrites": [
```

## 2. `.vercelignore` (NEW)
**Rationale:** Created to prevent uploading massive unnecessary directories (like `server/`, `docs/`, `node_modules`) to Vercel's build environment context for the frontend project. This speeds up the upload step significantly.

```diff
+ # Development
+ node_modules
+ .env.local
+ .env.*.local
+ 
+ # Build artifacts
+ dist
+ .cache
+ 
+ # Server-only directories
+ server/
+ packages/*/node_modules
+ apps/
+ 
+ # Documentation
+ docs/
+ *.md
+ !README.md
+ 
+ # Git
+ .git
+ .github
```
