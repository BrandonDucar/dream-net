# Sync Tech Implementation Plan (CRDTs & Replicache)

## Overview

Implement collaborative sync technology for DreamNet using CRDTs (Automerge 3.0, Yjs) and Replicache for transactional flows.

## Architecture Decisions

### Use CRDTs (Automerge or Yjs) When:
- Offline capture and later merge (dream drafts, note pads, storyboards)
- Causal histories/timelines (dream evolution chains, remix lineages)
- Local-first creators' tools (canvas editors, rich text, moodboards)

### Prefer Yjs Over Automerge When:
- Snappiest real-time editing in big docs/canvases needed
- Need existing editor integrations (ProseMirror/TipTap, Slate, Quill, Monaco, Codemirror)

### Prefer Automerge 3.0 When:
- Full document history as first-class artifact (Dream "memory fabric")
- New 3.0 footprint makes it practical

### Use Replicache When:
- Strict invariants (credits, quotas, inventory, leaderboard ranks)
- On-chain or wallet-signed actions (mint, tip, gate, redeem)
- Payments or abuse-resistant counters (no double-spend/replay)
- Clean optimistic UX with server-validated results

## Implementation Phases

### Phase 1: Yjs Integration for Rich Editors

**Files to create:**
- `packages/sync-yjs-core/src/YjsProvider.ts` - Yjs provider wrapper
- `packages/sync-yjs-core/src/YjsStorage.ts` - IndexedDB persistence adapter
- `packages/sync-yjs-core/src/YjsTipTap.ts` - TipTap integration
- `packages/sync-yjs-core/src/YjsCanvas.ts` - Canvas/Perfect-Freehand integration

**Dependencies:**
```json
{
  "yjs": "^13.6.0",
  "y-indexeddb": "^10.0.0",
  "y-prosemirror": "^2.0.0",
  "@tiptap/core": "^2.0.0",
  "perfect-freehand": "^2.0.0"
}
```

**Integration points:**
- Dream editor pages (`client/src/pages/DreamEditor.tsx`)
- Storyboard/moodboard components
- Collaborative note-taking features

### Phase 2: Automerge 3.0 for Memory Fabric

**Files to create:**
- `packages/sync-automerge-core/src/AutomergeProvider.ts` - Automerge provider
- `packages/sync-automerge-core/src/AutomergeSnapshotter.ts` - Periodic snapshot logic
- `packages/sync-automerge-core/src/AutomergeLineage.ts` - Remix/lineage tracking

**Dependencies:**
```json
{
  "@automerge/automerge": "^3.0.0"
}
```

**Integration points:**
- Dream evolution chains
- Remix lineage visualization
- Long-term history storage

### Phase 3: Replicache for Transactional Core

**Files to create:**
- `packages/sync-replicache-core/src/ReplicacheServer.ts` - Replicache server
- `packages/sync-replicache-core/src/mutators.ts` - Mutator definitions
  - `mintCard`, `redeem`, `vote`, `tip`, `joinTeam`
- `packages/sync-replicache-core/src/ReplicacheClient.ts` - Client wrapper

**Dependencies:**
```json
{
  "replicache": "^14.0.0"
}
```

**Integration points:**
- Credit/quota management
- Payment flows
- On-chain actions (wallet signatures)
- Leaderboards and rankings

### Phase 4: DreamNet Tri-Stack Pattern

**Implementation:**
1. Yjs + TipTap editor for Dream pages
2. Automerge snapshotter for lineage
3. Replicache mutator for redeemValue() with wallet signature

**Files:**
- `packages/sync-dreamnet-core/src/DreamSyncStack.ts` - Unified sync stack
- `packages/sync-dreamnet-core/src/DreamEditor.tsx` - Combined editor component
- `packages/sync-dreamnet-core/src/DreamCommerce.ts` - Replicache commerce layer

## Guardrails

- Don't use CRDTs for balances or globally-correct data → use Replicache/server
- For large docs: chunk storage (Yjs persistence), prune Automerge history snapshots
- Standardize identities: same user ID across CRDT docs and Replicache

## Success Criteria

- Rich text editing with Yjs + TipTap working
- Canvas editing with Yjs + Perfect-Freehand working
- Automerge snapshots creating lineage chains
- Replicache mutators handling payments with wallet signatures
- Offline-first editing with later merge working
- Remix/lineage visualization showing evolution chains

