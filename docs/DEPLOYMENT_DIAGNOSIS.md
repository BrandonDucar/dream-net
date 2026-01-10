# Deployment Diagnosis Artifact

**Status:** 🔴 CRITICAL MISALIGNMENT DETECTED

## 1. Root Cause Analysis

### Why does local deploy work but Vercel deploy fails?

**The "Split Brain" Problem:**
- **Local:** You run `pnpm install` at **Root**. This respects `pnpm-workspace.yaml` and `pnpm-lock.yaml`.
- **Vercel:** Configured with `rootDirectory: "client"`. Vercel treats `client/` as the project root.
  - It does **NOT** see the root `pnpm-lock.yaml`.
  - It does **NOT** see the root `pnpm-workspace.yaml`.
  - It tries to install dependencies for `client` in isolation.
  - Since `client` relies on the root lockfile for version consistency, Vercel generates a fresh, conflicting dependency tree (or fails if workspace links are missing).

### What exact environment mismatch is causing Vercel to ignore pnpm?

**Dual Lockfiles:**
- **Found:** `package-lock.json` (npm) AND `pnpm-lock.yaml` (pnpm) in the root directory.
- **Impact:** Vercel (and other tools) may default to `npm` if they see `package-lock.json`, ignoring `pnpm` settings.
- **Conflict:** `npm` does not respect `pnpm-workspace.yaml` or pnpm-specific overrides.

### What should we correct, remove, or lock down?

1.  **REMOVE** `package-lock.json` immediately.
2.  **CORRECT** `vercel.json` to point to Root (`.`), not `client`.
3.  **LOCK DOWN** `pnpm` using `engines` and `packageManager` fields in ALL `package.json` files.

## 2. Detailed Findings

| Finding | Severity | Location | Impact |
|---------|----------|----------|--------|
| **Dual Lockfiles** | 🔴 Critical | Root | Causes build tools to pick random package managers. |
| **Missing Workspace** | 🔴 Critical | `pnpm-workspace.yaml` | `client` is excluded from the monorepo workspace. |
| **Vercel Root Drift** | 🔴 Critical | `vercel.json` | Vercel builds in isolation, missing shared configs. |
| **Missing Engines** | 🟡 Medium | `client/package.json` | No Node version enforcement for frontend builds. |
| **Legacy Configs** | 🟡 Medium | `vercel.json` | Contains rewrites that might conflict with new routing. |

## 3. Deployment Core Analysis

- **Codebase:** `packages/deployment-core`
- **Status:** Stub implementation (`console.log` only).
- **Risk:** Low (not currently used in production path).
- **Future:** Must be updated to execute the **Canonical Build Pipeline** commands defined in the Unification Plan.

## 4. Immediate Action Items

1.  **Delete** `package-lock.json`.
2.  **Update** `pnpm-workspace.yaml` to include `client`.
3.  **Update** `vercel.json` root directory.
4.  **Run** `pnpm install --no-frozen-lockfile` to regenerate a clean, unified `pnpm-lock.yaml`.
