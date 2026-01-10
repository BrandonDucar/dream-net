# Deployment Unification Plan

**Objective:** Define a clean, unified deploy pipeline across Local → Vercel → Cloud Run.

## 1. Canonical Build Pipeline

The **Single Source of Truth** for building DreamNet is the **Repo Root**.

**Canonical Command:**
```bash
pnpm install --no-frozen-lockfile  # (Local/Fix)
# OR
pnpm install --frozen-lockfile     # (CI/Production)

pnpm build                         # Builds EVERYTHING (Client + Server)
```

### Why Root?
- **Monorepo Integrity:** `client` and `server` share dependencies and potentially local packages. Building from root ensures all workspace links are valid.
- **Single Lockfile:** `pnpm-lock.yaml` at root governs all versions. Building from a subdirectory (like `client/`) without root context risks "phantom dependencies" or version drift.

## 2. Environment-Specific Commands

| Environment | Platform | Root Directory | Install Command | Build Command | Output Directory |
|-------------|----------|----------------|-----------------|---------------|------------------|
| **Local Dev** | Windows/Mac | `.` (Root) | `pnpm install` | `pnpm dev` | N/A (Dev Server) |
| **Local Prod** | Windows/Mac | `.` (Root) | `pnpm install` | `pnpm build` | `client/dist`, `server/dist` |
| **Vercel** | Vercel | `.` (Root) | `pnpm install` | `cd client && pnpm build` | `client/dist` |
| **Cloud Run** | Docker (Linux) | `.` (Root) | `pnpm install` | `pnpm build` | `server/dist` (serves client) |

### Key Changes Required
1.  **Vercel Root:** Must be changed from `client` to `.` (Root).
2.  **Vercel Build:** Must be explicit: `cd client && pnpm build`. This ensures Vercel sees the root `pnpm-lock.yaml` but only builds the frontend artifacts it needs.
3.  **Cloud Run:** Already uses root Dockerfile. No change needed.

## 3. npm vs pnpm & Overrides

DreamNet uses **pnpm**.

**Conflict Prevention:**
- **Do NOT use npm.** Mixing package managers creates `package-lock.json` which conflicts with `pnpm-lock.yaml`.
- **Overrides:** Defined in root `package.json` under `"overrides"`. pnpm honors these.
- **Enforcement:** Add `preinstall` script: `"npx only-allow pnpm"`.

## 4. Deployment Core Integration

The `deployment-core` package is the internal engine for deployment.

**Current State:** Stub implementation.
**Target State:** Wrapper around canonical commands.

### Interface Definition

```typescript
interface DeploymentStrategy {
  build(context: 'client' | 'server' | 'all'): Promise<void>;
  deploy(target: 'vercel' | 'cloud-run'): Promise<DeploymentResult>;
}
```

### Implementation Plan
When `deployment-core` executes a build:
1.  It MUST run from Repo Root.
2.  It MUST use `pnpm`.
3.  It MUST NOT try to reinvent the build logic (e.g., don't manually run `vite`). It should spawn `pnpm build` or `pnpm --filter client build`.

## 5. Implementation Checklist

- [ ] **Vercel Config:** Update `vercel.json` to use root directory.
- [ ] **Workspace Fix:** Add `client` to `pnpm-workspace.yaml`.
- [ ] **Engine Strictness:** Add `.npmrc` rules.
- [ ] **CI Pipeline:** Update GitHub Actions / Cloud Build to use canonical commands.
- [ ] **Lockfile Fix:** Run `pnpm install --no-frozen-lockfile` once to unify lockfile, then commit.
