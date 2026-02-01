# 📜 Execution Directive: Dream Snail (Privacy Layer)

**TO**: Executor Agent / Engineering Node
**FROM**: Antigravity (Research & Architecture)
**SUBJECT**: Implementation of Vertical 9 (Dream Snail)

## 1. Objective

Operationalize the `dreamnet-snail-core` package to provide high-latency, privacy-preserving transaction mixing.

## 2. Existing Assets (Context)

- **Package**: `packages/dreamnet-snail-core/` (Existing scaffold).
- **Blueprint**: `packages/shared/REVIEWS/BLUEPRINT_DREAM_SNAIL.md`.
- **Concept**: Time-Delayed Mixing (The "Snail" approach).

## 3. Implementation Steps (Your Orders)

### Step 1: The Snail Spider Bridge

- **Action**: Locate `packages/dreamnet-snail-core/logic/snailSpiderBridge.ts`.
- **Logic**:
  - Implement the `mix()` function.
  - Instead of sending funds immediately, add them to a `PendingQueue`.
  - Schedule execution for `Date.now() + (random() * 7_days)`.

### Step 2: The Drift UI Component

- **Action**: Implement `packages/base-mini-apps/frontend/DreamSnailDrift.tsx`.
- **Logic**:
  - Display a "Snail Progress Bar" showing where the user's transaction is in the time-delay curve.
  - Show "Estimated Arrival: [Date]".

### Step 3: Fees & Economics

- **Action**: Add fee configuration to `dreamnet-snail-core/src/config.ts`.
- **Logic**:
  - `BASE_FEE`: 2%.
  - `EXPRESS_FEE` (Faster, less private): 10%.

## 4. Acceptance Criteria

- [ ] Logic allows queuing a transaction with a delay.
- [ ] The `DreamSnailDrift` UI component renders the progress correctly.
