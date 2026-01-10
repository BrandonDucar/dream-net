# Supervisor Execution Plan: Phase 2

**Mission:** Unify Deployment & Activate Spine
**Timeline:** Immediate (Next 3-5 Missions)

## 1. Top 5 Deploy Fixes (Ranked)

1.  **[Critical] Unify Environment:**
    - Delete `package-lock.json`.
    - Add `client` to `pnpm-workspace.yaml`.
    - Run `pnpm install --no-frozen-lockfile`.
2.  **[Critical] Fix Vercel Config:**
    - Update `vercel.json` to use `rootDirectory: "."`.
    - Set build command to `cd client && pnpm build`.
3.  **[High] Enforce Engines:**
    - Add `engines` (Node 20, pnpm 10) to `client/package.json` and `server/package.json`.
4.  **[Medium] Clean Scripts:**
    - Audit and remove conflicting `build` scripts in root `package.json`.
5.  **[Low] CI/CD Pipeline:**
    - Update GitHub Actions to use the Canonical Build Pipeline.

## 2. Top 5 Spine Enhancements (Ranked)

1.  **[Critical] Locate/Scaffold Spine:**
    - Confirm existence or create `packages/spine`.
2.  **[High] Define Interfaces:**
    - Create `packages/spine/src/types.ts` for Agent-to-System communication.
3.  **[High] Message Bus Stub:**
    - Implement basic Event Emitter pattern in Spine.
4.  **[Medium] Registry Integration:**
    - Connect Spine to `agent-registry-core` (types only).
5.  **[Medium] Deployment Core Bridge:**
    - Allow `deployment-core` to emit events to Spine.

## 3. Top 5 Structural Improvements

1.  **Monorepo Hygiene:** Run `pnpm -r exec rm -rf node_modules` and fresh install.
2.  **Type Check:** Run `pnpm -r run typecheck` to catch cross-package errors.
3.  **Linting:** Unify ESLint config across workspace.
4.  **Documentation:** Update `README.md` with new Canonical Build commands.
5.  **Dev Experience:** Create a `pnpm dev:all` script that runs client, server, and spine in parallel.

## 4. Execution Timeline

### Mission 1: The Great Alignment (Current)
- **Goal:** Fix Vercel & Local builds.
- **Tasks:** F-01, F-02, F-03, F-04.
- **Outcome:** `pnpm build` works everywhere. Vercel deploys successfully.

### Mission 2: Spine Activation
- **Goal:** Establish the Interop Spine.
- **Tasks:** Scaffold `@dreamnet/spine`. Define core types.
- **Outcome:** Spine package exists and is linked.

### Mission 3: Deployment Core Upgrade
- **Goal:** Make `deployment-core` functional.
- **Tasks:** Implement `deploy()` using `exec` calls to canonical commands.
- **Outcome:** `deployment-core` can trigger builds.

---

**Next Step:** Approve this plan and authorize the **Fix Strategy** (Phase 1).
