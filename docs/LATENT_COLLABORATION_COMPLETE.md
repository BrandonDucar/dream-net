# Latent Collaboration Complete Documentation

## Overview

Latent Collaboration enables agents to share reasoning in latent space (vector embeddings) rather than raw text. Agents encode their thoughts into latent vectors, store them in Neural Mesh, and retrieve similar thoughts from other agents for collaborative reasoning.

**Package**: `@dreamnet/latent-collaboration`  
**Core Package**: `@dreamnet/latent-collaboration-core`  
**Location**: `packages/latent-collaboration/` and `packages/latent-collaboration-core/`

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Latent Space Encoding](#latent-space-encoding)
3. [Agent Bridge](#agent-bridge)
4. [Reasoning Engine](#reasoning-engine)
5. [Wallet Collaboration](#wallet-collaboration)
6. [Usage Examples](#usage-examples)
7. [Integration Points](#integration-points)

---

## Architecture Overview

### Purpose

Latent Collaboration provides:
- **Latent Space Encoding** - Converts agent thoughts to vector embeddings
- **Agent Bridge** - Facilitates latent communication between agents
- **Reasoning Engine** - Multi-step collaborative reasoning
- **Wallet Collaboration** - Onchain agent collaboration using wallets
- **Neural Mesh Integration** - Stores and retrieves latent representations

### System Flow

```
┌─────────────────────────────────────────────────────────────┐
│              Latent Collaboration Flow                    │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  1. Agent Generates Thought                                   │
│     ├─ Agent produces reasoning text                         │
│     └─ Thought includes task context                         │
│                                                               │
│  2. Encode to Latent Space                                    │
│     ├─ OpenAI embeddings API (primary)                        │
│     ├─ Hash-based fallback (if API unavailable)              │
│     └─ Generate latent vector (1536 dimensions default)      │
│                                                               │
│  3. Store in Neural Mesh                                      │
│     ├─ Store latent vector + original thought                 │
│     ├─ Include metadata (task, related agents, onchain ctx)   │
│     └─ Enable similarity search                              │
│                                                               │
│  4. Retrieve Similar Thoughts                                  │
│     ├─ Query Neural Mesh with query vector                    │
│     ├─ Cosine similarity search                              │
│     └─ Return top N similar thoughts                          │
│                                                               │
│  5. Collaborative Reasoning                                   │
│     ├─ Multiple agents reason about same task                 │
│     ├─ Each agent stores latent thought                       │
│     └─ Generate collaborative plan                           │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

### Integration Flow

```
Orchestrator Cycle
    ↓
Citadel generates snapshot
    ↓
LatentCollaborationCore.run()
    ↓
Extract agent thoughts from Citadel
    ↓
Encode to latent vectors
    ↓
Store in Neural Mesh
    ↓
Agents retrieve similar thoughts during execution
```

---

## Latent Space Encoding

### Latent Vector Structure

```typescript
interface LatentVector {
  vector: number[];        // Vector (1536 dimensions default)
  dimension: number;      // Vector dimension
  model?: string;         // Embedding model used
}
```

### Encoding Methods

**1. OpenAI Embeddings (Primary)**:
- Model: `text-embedding-3-small` (default)
- Vector Size: 1536 dimensions (default)
- API: OpenAI embeddings API
- Circuit Breaker: Protected with circuit breaker

**2. Hash-Based Fallback**:
- Used when OpenAI API unavailable
- Generates deterministic vector from text hash
- Normalized to [0, 1] range
- Same dimension as OpenAI embeddings

### Encoding Function

```typescript
import { encodeToLatent } from '@dreamnet/latent-collaboration';

// Encode agent thought to latent representation
const latentVector = await encodeToLatent(
  "Agent reasoning about task: deploy new feature",
  "agent-wolf-pack"
);

console.log(`Vector dimension: ${latentVector.dimension}`);
console.log(`Model: ${latentVector.model}`);
```

### Similarity Search

```typescript
import { cosineSimilarity, findSimilarLatents } from '@dreamnet/latent-collaboration';

// Calculate cosine similarity between two vectors
const similarity = cosineSimilarity(vector1, vector2);
// Returns: number between -1 and 1 (1 = identical, 0 = orthogonal, -1 = opposite)

// Find similar latent thoughts
const similarThoughts = await findSimilarLatents(
  queryVector,
  candidateThoughts,
  10 // limit
);
```

---

## Agent Bridge

### Purpose

Agent Bridge facilitates latent communication between agents by encoding thoughts, storing them, and enabling retrieval.

### Send Latent Thought

```typescript
import { sendLatentThought } from '@dreamnet/latent-collaboration';

// Send latent thought to other agents
const representation = await sendLatentThought(
  "agent-wolf-pack",
  "I think we should focus on funding opportunities in DeFi",
  ["agent-whale-pack", "agent-orca-pack"], // target agents
  {
    task: "funding_strategy",
    context: { vertical: "DeFi" }
  }
);

console.log(`Latent ID: ${representation.id}`);
console.log(`Agent: ${representation.agentId}`);
console.log(`Vector dimension: ${representation.latentVector.dimension}`);
```

### Receive Latent Thoughts

```typescript
import { receiveLatentThoughts } from '@dreamnet/latent-collaboration';

// Receive related latent thoughts
const thoughts = await receiveLatentThoughts(
  "agent-wolf-pack",
  "funding opportunities", // query string
  neuralMeshInstance,
  10 // limit
);

thoughts.forEach(thought => {
  console.log(`${thought.agentId}: ${thought.thought}`);
  console.log(`Similarity: ${thought.similarity}`);
});
```

### Collaborative Reasoning

```typescript
import { collaborativeReasoning } from '@dreamnet/latent-collaboration';

// Multiple agents reason together
const result = await collaborativeReasoning(
  ["agent-wolf-pack", "agent-whale-pack", "agent-orca-pack"],
  "Plan funding strategy for Q1",
  neuralMeshInstance
);

console.log(`Plan: ${result.plan}`);
console.log(`Agents: ${result.agents.join(", ")}`);
console.log(`Confidence: ${result.confidence}`);

result.steps.forEach(step => {
  console.log(`Step ${step.step}: ${step.agentId} - ${step.thought}`);
});
```

---

## Reasoning Engine

### Multi-Step Reasoning

```typescript
import { multiStepReasoning } from '@dreamnet/latent-collaboration';

// Multi-step reasoning in latent space
const chain = await multiStepReasoning(
  ["agent-wolf-pack", "agent-whale-pack"],
  "Plan product launch",
  3, // number of steps
  neuralMeshInstance
);

console.log(`Final Plan: ${chain.finalPlan}`);
chain.steps.forEach(step => {
  console.log(`Step ${step.step}: ${step.agentId} - ${step.thought}`);
});
```

### Shared Context Building

```typescript
import { buildSharedContext } from '@dreamnet/latent-collaboration';

// Build shared reasoning context
const context = await buildSharedContext(
  ["agent-wolf-pack", "agent-whale-pack"],
  "Optimize revenue streams",
  neuralMeshInstance
);

console.log(`Task: ${context.task}`);
console.log(`Agents: ${context.agents.join(", ")}`);
console.log(`Shared Plan: ${context.sharedPlan}`);

context.latentThoughts.forEach(thought => {
  console.log(`${thought.agentId}: ${thought.thought}`);
});
```

---

## Wallet Collaboration

### Purpose

Wallet Collaboration enables onchain agent collaboration using agent wallets. Agents can reason about onchain operations and generate transaction plans.

### Collaborative Onchain Reasoning

```typescript
import { collaborativeOnchainReasoning } from '@dreamnet/latent-collaboration';

// Collaborative onchain reasoning
const result = await collaborativeOnchainReasoning(
  ["agent-wolf-pack", "agent-whale-pack"],
  "Execute token swap",
  {
    chain: "base",
    tokenAddress: "0x1234...",
    amount: "1000"
  },
  neuralMeshInstance
);

console.log(`Plan: ${result.plan}`);
console.log(`Agents: ${result.agents.join(", ")}`);

result.wallets.forEach(wallet => {
  console.log(`${wallet.agentId}: ${wallet.address} (${wallet.chain})`);
});

if (result.transactionPlan) {
  console.log(`Operations: ${result.transactionPlan.operations.length}`);
  console.log(`Required Approvals: ${result.transactionPlan.requiredApprovals}`);
}
```

### Multi-Agent Transaction Planning

```typescript
import { planMultiAgentTransaction } from '@dreamnet/latent-collaboration';

// Plan multi-agent transaction
const plan = await planMultiAgentTransaction(
  ["agent-wolf-pack", "agent-whale-pack"],
  "token_swap",
  {
    chain: "base",
    tokenAddress: "0x1234...",
    amount: "1000"
  },
  [
    { agentId: "agent-wolf-pack", address: "0xabc...", chain: "base" },
    { agentId: "agent-whale-pack", address: "0xdef...", chain: "base" }
  ]
);

plan.operations.forEach(op => {
  console.log(`${op.agentId} (${op.walletAddress}): ${op.operation}`);
  console.log(`Params:`, op.params);
});
```

---

## Usage Examples

### Example 1: Basic Latent Thought

```typescript
import { sendLatentThought } from '@dreamnet/latent-collaboration';

// Agent sends thought
const thought = await sendLatentThought(
  "agent-wolf-pack",
  "Found 5 new funding opportunities in DeFi space",
  undefined, // all agents can see it
  { task: "funding_discovery" }
);

console.log(`Thought ID: ${thought.id}`);
console.log(`Vector: ${thought.latentVector.vector.length} dimensions`);
```

### Example 2: Retrieve Similar Thoughts

```typescript
import { receiveLatentThoughts } from '@dreamnet/latent-collaboration';

// Agent retrieves similar thoughts
const similarThoughts = await receiveLatentThoughts(
  "agent-whale-pack",
  "funding opportunities", // query
  neuralMeshInstance,
  5 // limit
);

similarThoughts.forEach(thought => {
  console.log(`${thought.agentId}: ${thought.thought} (similarity: ${thought.similarity})`);
});
```

### Example 3: Collaborative Planning

```typescript
import { collaborativeReasoning } from '@dreamnet/latent-collaboration';

// Multiple agents plan together
const result = await collaborativeReasoning(
  ["agent-wolf-pack", "agent-whale-pack", "agent-orca-pack"],
  "Plan Q1 marketing campaign",
  neuralMeshInstance
);

console.log(`Collaborative Plan:\n${result.plan}`);
console.log(`Confidence: ${result.confidence}`);

result.steps.forEach(step => {
  console.log(`  ${step.agentId}: ${step.thought}`);
});
```

### Example 4: Multi-Step Reasoning

```typescript
import { multiStepReasoning } from '@dreamnet/latent-collaboration';

// Multi-step reasoning chain
const chain = await multiStepReasoning(
  ["agent-wolf-pack", "agent-whale-pack"],
  "Launch new product feature",
  4, // 4 reasoning steps
  neuralMeshInstance
);

console.log(`Final Plan:\n${chain.finalPlan}`);
console.log(`Reasoning Steps: ${chain.steps.length}`);
```

### Example 5: Onchain Collaboration

```typescript
import { collaborativeOnchainReasoning } from '@dreamnet/latent-collaboration';

// Agents collaborate on onchain operation
const result = await collaborativeOnchainReasoning(
  ["agent-wolf-pack", "agent-whale-pack"],
  "Execute liquidity provision",
  {
    chain: "base",
    tokenAddress: "0x1234...",
    amount: "5000"
  },
  neuralMeshInstance
);

console.log(`Plan: ${result.plan}`);
console.log(`Wallets:`);
result.wallets.forEach(w => {
  console.log(`  ${w.agentId}: ${w.agentId}: ${w.address}`);
});

if (result.transactionPlan) {
  console.log(`Transaction Operations:`);
  result.transactionPlan.operations.forEach(op => {
    console.log(`  ${op.agentId}: ${op.operation} via ${op.walletAddress}`);
  });
}
```

---

## Integration Points

### Latent Collaboration Core Integration

**Location**: `packages/latent-collaboration-core/index.ts`

Latent Collaboration Core runs during Orchestrator cycles:

```typescript
export class LatentCollaborationCore {
  async run(context: {
    citadelSnapshot?: any;
    agents?: any[];
    neuralMesh?: any;
    agentWalletManager?: any;
  }): Promise<void> {
    // Check if enabled
    if (process.env.USE_LATENT_COLLABORATION !== 'true') {
      return; // Skip if not enabled
    }

    // Extract agent thoughts from Citadel snapshot
    const agentThoughts = this.extractAgentThoughts(context.citadelSnapshot);
    
    // Encode to latent representations
    const latentThoughts = await Promise.all(
      agentThoughts.map(async (thought) => {
        return await sendLatentThought(
          thought.agentId,
          thought.text,
          undefined, // all agents
          { task: 'citadel_planning' }
        );
      })
    );

    // Store in Neural Mesh
    if (context.neuralMesh && latentThoughts.length > 0) {
      await Promise.all(
        latentThoughts.map(async (latent, idx) => {
          await context.neuralMesh.storeLatent(
            agentThoughts[idx].agentId,
            latent.latentVector.vector,
            agentThoughts[idx].text,
            { task: 'citadel_planning' }
          );
        })
      );
    }
  }
}
```

### Orchestrator Core Integration

Latent Collaboration runs early in Orchestrator cycle:

```typescript
// In OrchestratorCore.runSingleCycle():

// 0.5) Latent Collaboration - Agents share reasoning in latent space
if (ctx.LatentCollaboration?.run) {
  await ctx.LatentCollaboration.run({
    citadelSnapshot: citadelState,
    agents: ctx.agents,
    neuralMesh: ctx.NeuralMesh,
    agentWalletManager: ctx.AgentWalletManager,
  });
}
```

### Neural Mesh Integration

Latent Collaboration stores and retrieves latent representations:

```typescript
// Store latent representation
await neuralMesh.storeLatent(
  agentId,
  latentVector.vector,
  originalThought,
  metadata
);

// Retrieve similar latent thoughts
const similarMemories = await neuralMesh.retrieveLatent(
  queryVector,
  limit,
  agentId
);

// Get agent's latent history
const history = await neuralMesh.getAgentLatentHistory(agentId, limit);
```

### Agent Wallet Manager Integration

Wallet Collaboration uses Agent Wallet Manager:

```typescript
import { getAgentWalletManager } from '@dreamnet/agent-wallet-manager';

const walletManager = getAgentWalletManager();

// Get or create wallet for agent
const wallet = await walletManager.getOrCreateWallet(
  agentId,
  chain
);

// Use wallet address in onchain reasoning
const result = await collaborativeOnchainReasoning(
  agents,
  task,
  {
    chain: wallet.chain,
    walletAddress: wallet.address,
    // ...
  }
);
```

### Server Integration

**Location**: `server/index.ts`

Latent Collaboration Core is initialized during server startup:

```typescript
import { LatentCollaborationCore } from '@dreamnet/latent-collaboration-core';

// Initialize Latent Collaboration Core
try {
  const { LatentCollaborationCore } = await import("../packages/latent-collaboration-core");
  
  let latentCollaboration: any = null;
  if (process.env.USE_LATENT_COLLABORATION === 'true') {
    latentCollaboration = new LatentCollaborationCore();
  }

  // Pass to Runtime Bridge Core context
  RuntimeBridgeCore.initContext({
    // ... other subsystems
    LatentCollaboration: latentCollaboration ? {
      run: (context: any) => latentCollaboration.run(context),
    } : undefined,
  });
} catch (error) {
  console.warn("[Latent Collaboration] Initialization warning:", error);
}
```

---

## Configuration

### Environment Variables

```bash
# Enable latent collaboration
USE_LATENT_COLLABORATION=true

# OpenAI API key (for embeddings)
OPENAI_API_KEY=sk-...

# Embedding model (default: text-embedding-3-small)
LATENT_EMBEDDING_MODEL=text-embedding-3-small

# Vector size (default: 1536)
LATENT_VECTOR_SIZE=1536
```

### Feature Flag

Latent Collaboration is controlled by `USE_LATENT_COLLABORATION` environment variable:
- `true`: Enabled, runs during Orchestrator cycles
- `false` or unset: Disabled, skipped

---

## Summary

Latent Collaboration enables agents to share reasoning in latent space:

- **Latent Space Encoding** - Converts agent thoughts to vector embeddings (OpenAI or hash-based) ✅
- **Agent Bridge** - Facilitates latent communication between agents ✅
- **Reasoning Engine** - Multi-step collaborative reasoning ✅
- **Wallet Collaboration** - Onchain agent collaboration using wallets ✅
- **Neural Mesh Integration** - Stores and retrieves latent representations ✅
- **Orchestrator Integration** - Runs during Orchestrator cycles ✅
- **Citadel Integration** - Extracts agent thoughts from Citadel snapshots ✅
- **Agent Wallet Manager Integration** - Uses agent wallets for onchain operations ✅

**Status**: ✅ Fully implemented and integrated into Orchestrator Core and server startup.

**Usage**: Enabled via `USE_LATENT_COLLABORATION=true`, runs during Orchestrator cycles, extracts thoughts from Citadel, encodes to latent vectors, stores in Neural Mesh, enables similarity search.

**Design**: Agents encode thoughts to latent vectors (embeddings), store in Neural Mesh, retrieve similar thoughts via cosine similarity, collaborate on tasks, generate transaction plans for onchain operations.

