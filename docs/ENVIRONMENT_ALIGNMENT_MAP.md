# Environment Alignment Map

**Objective:** Normalize all environment requirements across the DreamNet monorepo.

## 1. Current State Analysis

| Component | Node Version | pnpm Version | Workspace Status | Engines Field |
|-----------|--------------|--------------|------------------|---------------|
| **Root** | `>=20.19.0 \|\| >=22.12.0` | `10.21.0` | ✅ Defined | ✅ Present |
| **Client** | ❌ Missing | ❌ Missing | ❌ **Excluded** | ❌ Missing |
| **Server** | ❌ Missing | ❌ Missing | ✅ Included | ❌ Missing |
| **Packages** | ❌ Missing | ❌ Missing | ✅ Included | ❌ Missing |

### Critical Mismatches

1.  **Workspace Exclusion:** `client` is defined in `package.json` workspaces but **missing** from `pnpm-workspace.yaml`. This causes `pnpm` to ignore it as a workspace member, leading to "drifting" and dependency linking issues.
2.  **Engine Missing:** Only root `package.json` defines `engines`. Sub-packages (`client`, `server`) do not inherit this automatically in all tools (like Vercel), leading to default version usage (often Node 18 or 20 non-LTS).
3.  **Vercel Root:** Vercel is configured with `rootDirectory: "client"`. Combined with the missing workspace definition, Vercel treats `client` as a standalone project, ignoring the root `pnpm-lock.yaml` and workspace configuration.

## 2. Unified DreamNet Environment Matrix

| Requirement | Version / Setting | Rationale |
|-------------|-------------------|-----------|
| **Node.js** | `20.19.0` (LTS) | Match root `engines`. Ensure compatibility with Cloud Run and Vercel. |
| **pnpm** | `10.21.0` | Match root `packageManager`. Enforce via Corepack. |
| **Workspace** | `pnpm-workspace.yaml` | Must include `client`, `server`, `apps/*`, `packages/*`. |
| **Lockfile** | `pnpm-lock.yaml` | Single source of truth at **Root**. |

## 3. Remediation Steps

### Step 1: Fix Workspace Definition
**File:** `pnpm-workspace.yaml`
**Action:** Add `"client"` to the `packages` list.

```yaml
packages:
  - "apps/*"
  - "packages/*"
  - "server"
  - "client"  # <--- ADD THIS
```

### Step 2: Enforce Engines Everywhere
**Files:** `client/package.json`, `server/package.json`, `packages/*/package.json`
**Action:** Add `engines` field.

```json
"engines": {
  "node": ">=20.19.0",
  "pnpm": ">=10.21.0"
}
```

### Step 3: Vercel Configuration Alignment
**File:** `vercel.json` (Root)
**Action:** Change `rootDirectory` to `.` (Root) to expose workspace config.

```json
{
  "rootDirectory": ".",  // <--- CHANGED from "client"
  "buildCommand": "cd client && pnpm build", // <--- EXPLICIT path
  "outputDirectory": "client/dist",
  "framework": "vite",
  "rewrites": [...]
}
```

### Step 4: Local Environment Enforcement
**File:** `.npmrc`
**Action:** Ensure strict peer dependency handling and engine checking.

```ini
engine-strict=true
auto-install-peers=true
```

## 4. Platform-Specific Requirements

| Platform | Node Version | Build Command | Install Command | Root Directory |
|----------|--------------|---------------|-----------------|----------------|
| **Local** | `20.19.0` | `pnpm build` | `pnpm install` | `.` |
| **Vercel** | `20.x` | `cd client && pnpm build` | `pnpm install` | `.` |
| **Cloud Run** | `20-slim` | `pnpm build` | `pnpm install` | `.` |
