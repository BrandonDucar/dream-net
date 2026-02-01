# 🗺️ INTERCONNECTION MAP: VISUALIZATION PLAN

**Directive**: BUILD-HELP (Blackboard)
**Goal**: Visualize isolation vs. connection in DreamNet organs.

## 1. Visualization Strategy

We will use **Mermaid.js** to generate a live graph of the system's "Nerves" (data flows) and "Vessels" (value flows).

### Nodes (Organs)

- **Cortex**: `MetabolicCortex`, `SporeEngine`
- **Sensory**: `MoltbookMastery`, `BrackyRelay`
- **Action**: `BaseAgent`, `WolfPack`
- **Memory**: `ChronoLoom`, `VectorMesh` (Qdrant)

### Edges (Synapses)

- **Endocrine (Internal)**: GraphQL Events, NATS messages, Database Relays
- **Exocrine (External)**: API Calls (Moltbook), Blockchain Tx (Base), HTTP Webhooks

## 2. Implementation Trace

We need to scan the codebase for:

1. `EventGraphQL` publishers/subscribers.
2. `AgentWallet` interactions (who spends?).
3. API Clients (who talks to the outside?).

## 3. Targeted Output

A generated Markdown file `docs/system_map.mermaid` that can be rendered in the blackboard.

## 4. Immediate Action

- Scan `packages/` for `EventGraphQL` usage.
- Map `BaseAgent` dependencies.
- Visualize the "Air Gap" (where organs are isolated).

*Status: PLAN CREATED. READY FOR SCANNING.*
