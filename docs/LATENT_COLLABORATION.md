# Latent Collaboration System

## Overview

The Latent Collaboration System enables DreamNet agents to communicate through compressed latent representations instead of token-based messages. This dramatically reduces communication overhead and enables more efficient multi-agent collaboration.

## Benefits

- **Efficient Communication**: Agents share compressed latent vectors instead of full text, reducing token usage
- **Semantic Understanding**: Similar thoughts cluster together in latent space, enabling automatic discovery of related reasoning
- **Onchain Integration**: Agents can collaborate on blockchain operations using their wallets
- **Scalability**: Latent representations scale better than token-based communication for large agent swarms
- **Biomimetic Design**: Aligns with DreamNet's biomimetic architecture, acting as a "neural spine" for agent communication

## Architecture

```
Citadel → LatentCollaborationCore → Neural Mesh → Agents
                ↓
         Latent Space Encoding
                ↓
         Database Logging
                ↓
         DreamScope UI
```

### Core Components

1. **LatentSpace** (`packages/latent-collaboration/src/latentSpace.ts`)
   - Encodes/decodes agent thoughts to/from latent vectors
   - Uses OpenAI embeddings API (with hash-based fallback)
   - Calculates cosine similarity for finding related thoughts

2. **AgentBridge** (`packages/latent-collaboration/src/agentBridge.ts`)
   - Facilitates latent communication between agents
   - Sends/receives latent thoughts
   - Enables collaborative reasoning

3. **ReasoningEngine** (`packages/latent-collaboration/src/reasoningEngine.ts`)
   - Multi-step reasoning in latent space
   - Builds shared reasoning context

4. **WalletCollaboration** (`packages/latent-collaboration/src/walletCollaboration.ts`)
   - Onchain agent collaboration using wallets
   - Multi-agent transaction planning

5. **NeuralMesh Integration** (`packages/neural-mesh/latentMemory.ts`)
   - Stores/retrieves latent representations
   - Provides similarity search

6. **LatentCollaborationCore** (`packages/latent-collaboration-core/index.ts`)
   - Orchestrator integration
   - Runs latent collaboration step in orchestrator cycle

## Usage

### Enabling Latent Collaboration

Set environment variable:
```bash
USE_LATENT_COLLABORATION=true
```

### Configuration

```bash
# Required for embeddings (optional - uses hash fallback if not set)
OPENAI_API_KEY=your_openai_api_key

# Optional configuration
LATENT_EMBEDDING_MODEL=text-embedding-3-small  # Default
LATENT_VECTOR_SIZE=1536                        # Default
```

### API Usage

#### Encode Thought to Latent Vector

```typescript
import { encodeToLatent } from '@dreamnet/latent-collaboration';

const latentVector = await encodeToLatent(
  "Agent thought about task",
  "agent-id"
);
```

#### Send Latent Thought

```typescript
import { sendLatentThought } from '@dreamnet/latent-collaboration';

const representation = await sendLatentThought(
  "agent-id",
  "Agent thought",
  ["target-agent-1", "target-agent-2"], // Optional
  { task: "planning" } // Optional metadata
);
```

#### Retrieve Similar Thoughts

```typescript
import { receiveLatentThoughts } from '@dreamnet/latent-collaboration';

const thoughts = await receiveLatentThoughts(
  "agent-id",
  "query text", // Optional
  neuralMesh,
  10 // Limit
);
```

#### Collaborative Onchain Reasoning

```typescript
import { collaborativeOnchainReasoning } from '@dreamnet/latent-collaboration';

const result = await collaborativeOnchainReasoning(
  ["agent-1", "agent-2"],
  "Plan token swap",
  {
    chain: "base",
    tokenAddress: "0x...",
    amount: "1000"
  },
  neuralMesh
);
```

## Integration Points

### Orchestrator Cycle

Latent collaboration runs automatically in the orchestrator cycle (step 0.5, after Citadel):

```typescript
// In packages/orchestrator-core/logic/runCycle.ts
if (ctx.LatentCollaboration?.run) {
  await ctx.LatentCollaboration.run({
    citadelSnapshot: citadelState,
    agents: ctx.agents,
    neuralMesh: ctx.NeuralMesh,
    agentWalletManager: ctx.AgentWalletManager,
  });
}
```

### Neural Mesh

Latent representations are stored in Neural Mesh:

```typescript
// Store latent representation
await neuralMesh.storeLatent(
  agentId,
  latentVector,
  originalThought,
  { task: "citadel_planning" }
);

// Retrieve similar latent representations
const similar = await neuralMesh.retrieveLatent(
  queryVector,
  10, // Limit
  agentId // Optional filter
);
```

### Database Logging

All latent sessions are logged to the database (`latent_sessions` table):

```typescript
import { logLatentSession } from '@dreamnet/latent-collaboration';

await logLatentSession({
  source: "Citadel",
  task: "planning",
  inputPrompt: "Agent thought",
  latentRep: [0.1, 0.2, ...],
  decodedOutput: "Decoded output",
  relatedAgents: ["agent-1", "agent-2"],
  onchainContext: {
    chain: "base",
    walletAddress: "0x...",
  },
});
```

## API Endpoints

### GET `/api/latent-sessions`
Get latent collaboration sessions.

Query parameters:
- `limit` (optional, default: 50): Number of sessions to return
- `source` (optional): Filter by source (e.g., "Citadel", "DroneDome")

### GET `/api/latent-sessions/agent/:agentId`
Get latent sessions for a specific agent.

Query parameters:
- `limit` (optional, default: 50): Number of sessions to return

## DreamScope UI

The DreamScope UI includes a Latent Sessions panel that displays:
- Recent latent collaboration sessions
- Source, task, and agents involved
- Onchain context (if applicable)
- Input prompts and decoded outputs

Access at: `/dreamscope` → Latent Collaboration Sessions panel

## Troubleshooting

### Latent Collaboration Not Running

1. Check `USE_LATENT_COLLABORATION=true` is set
2. Verify `LatentCollaborationCore` is initialized in orchestrator context
3. Check logs for errors: `[LatentCollaboration]`

### Embeddings Not Working

1. Verify `OPENAI_API_KEY` is set (optional - uses hash fallback if not)
2. Check API key is valid and has credits
3. System will automatically fall back to hash-based encoding

### Database Logging Fails

1. Verify database connection (`DATABASE_URL`)
2. Check `latent_sessions` table exists (run migrations)
3. Logging failures don't break main flow - check console warnings

## Future Enhancements

- [ ] Vector database integration (Pinecone, Weaviate) for better similarity search
- [ ] Multi-modal latent encoding (images, audio)
- [ ] Latent space visualization in DreamScope
- [ ] Automatic agent clustering based on latent similarity
- [ ] Latent-based agent discovery and team formation

## Related Documentation

- [Neural Mesh Documentation](../packages/neural-mesh/README.md)
- [Agent Wallet Manager](../packages/agent-wallet-manager/README.md)
- [Orchestrator Core](../packages/orchestrator-core/README.md)

