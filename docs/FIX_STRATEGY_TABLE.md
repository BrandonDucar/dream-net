# Fix Strategy Table

**Objective:** Atomic fixes to align DreamNet deployment. **NO Code Changes Yet.**

## Phase 1: Critical Alignment (Immediate)

| ID | Description | Root Cause | Risk | Owner | Fix Action | Affected Systems |
|----|-------------|------------|------|-------|------------|------------------|
| **F-01** | **Delete `package-lock.json`** | Dual lockfiles causing PM confusion | Low | Supervisor | `rm package-lock.json` | Local, Vercel, Cloud Run |
| **F-02** | **Add `client` to Workspace** | Missing from `pnpm-workspace.yaml` | Medium | Supervisor | Edit `pnpm-workspace.yaml` | Local, Vercel |
| **F-03** | **Fix Vercel Root** | `vercel.json` points to `client` | Medium | Supervisor | Edit `vercel.json`: `rootDirectory: "."` | Vercel |
| **F-04** | **Unify Lockfile** | Workspace drift | Medium | Supervisor | `pnpm install --no-frozen-lockfile` | All |

## Phase 2: Hardening (Post-Alignment)

| ID | Description | Root Cause | Risk | Owner | Fix Action | Affected Systems |
|----|-------------|------------|------|-------|------------|------------------|
| **F-05** | **Enforce Engines** | Missing `engines` in sub-packages | Low | Supervisor | Add `engines` to `client/package.json` | Vercel, Cloud Run |
| **F-06** | **Strict npmrc** | Loose dependency handling | Low | Supervisor | Add `engine-strict=true` to `.npmrc` | All |
| **F-07** | **Clean Vercel Rewrites** | Legacy routing rules | Low | Supervisor | Review/Simplify `vercel.json` rewrites | Vercel |

## Phase 3: Deployment Core (Future)

| ID | Description | Root Cause | Risk | Owner | Fix Action | Affected Systems |
|----|-------------|------------|------|-------|------------|------------------|
| **F-08** | **Implement Deploy Core** | Stub implementation | High | Antigravity | Implement `deploy()` using canonical cmds | Deployment Core |

## Execution Sequence

1.  **F-01** (Delete npm lock)
2.  **F-02** (Fix workspace)
3.  **F-03** (Fix Vercel config)
4.  **F-04** (Regenerate pnpm lock)
5.  **F-05** (Add engines)
6.  **Validate** (Run build)
