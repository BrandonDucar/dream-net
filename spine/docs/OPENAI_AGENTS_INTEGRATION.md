# OpenAI Agents SDK Integration Guide

## Overview

This guide explains how to integrate OpenAI's Agents SDK with DreamNet's Interop Spine. OpenAI offers two main integration paths:

1. **OpenAI Agents SDK** (`@openai/agents`) - For building agentic workflows
2. **OpenAI SDK** (`openai`) - Standard API client (already in use)
3. **OpenAI CLI** - Command-line interface for managing OpenAI services

## Current DreamNet OpenAI Usage

DreamNet already uses the OpenAI SDK (`openai` package) for:
- Dream title generation (`server/routes/dream-titles.ts`)
- Dream shopping intelligence (`server/routes/dream-shopping.ts`)
- SEO optimization (`server/routes/seoToolsRoutes.ts`)
- Content generation

**Environment Variable**: `OPENAI_API_KEY`

## Integration Options

### Option 1: OpenAI Agents SDK (Recommended for Agent Workflows)

The OpenAI Agents SDK (`@openai/agents`) is designed for building agentic applications with:
- Multi-agent workflows
- Tool integration
- Agent handoffs
- Streaming support
- Activity tracing

**Installation:**
```bash
pnpm add @openai/agents
```

**Basic Usage:**
```typescript
import { Agent, Runner } from '@openai/agents';

const agent = new Agent({
  name: "DreamNet Agent",
  instructions: "You are a DreamNet agent that helps users create and manage dreams.",
  tools: [
    // Add DreamNet tools here
  ]
});

const result = await Runner.run(agent, "Help me create a new dream");
```

### Option 2: OpenAI SDK (Current Approach)

The standard OpenAI SDK (`openai`) is already integrated and works well for:
- Chat completions
- Function calling
- Embeddings
- Fine-tuning

**Current Implementation:**
```typescript
import OpenAI from 'openai';

const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY 
});

const response = await openai.chat.completions.create({
  model: "gpt-4o",
  messages: [{ role: "user", content: "Hello" }]
});
```

### Option 3: OpenAI CLI

The OpenAI CLI provides command-line access to OpenAI services:

**Installation:**
```bash
npm install -g openai
# or
pip install openai
```

**Configuration:**
```bash
openai api_key set YOUR_API_KEY
```

**Usage:**
```bash
# List models
openai models list

# Chat completion
openai chat completions create \
  --model gpt-4o \
  --message "Hello, DreamNet!"

# Fine-tuning
openai fine_tuning jobs create \
  --training_file file.jsonl \
  --model gpt-4o
```

## Interop Spine Integration

The `OpenAIProvider` in `spine/agent-interop/OpenAIProvider.ts` provides a standardized interface for OpenAI integration. Here's how to implement it:

### Implementation Example

```typescript
import OpenAI from 'openai';
import type { ProviderDescriptor } from './ProviderDescriptor.js';
import type { AgentInteropRequest, AgentInteropResponse } from './AgentInteropTypes.js';

export class OpenAIProvider {
  private client: OpenAI;
  private descriptor: ProviderDescriptor;

  constructor(descriptor: ProviderDescriptor) {
    this.descriptor = descriptor;
    const apiKey = descriptor.auth?.config?.apiKey as string || process.env.OPENAI_API_KEY;
    
    if (!apiKey) {
      throw new Error("OpenAI API key required");
    }

    this.client = new OpenAI({ apiKey });
  }

  async initialize(): Promise<void> {
    // Verify API key by making a test call
    try {
      await this.client.models.list();
      console.log("✅ OpenAI provider initialized");
    } catch (error) {
      throw new Error(`OpenAI initialization failed: ${error}`);
    }
  }

  async executeTask(task: AgentInteropRequest): Promise<AgentInteropResponse> {
    try {
      const response = await this.client.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are a DreamNet agent assistant."
          },
          {
            role: "user",
            content: JSON.stringify(task.payload)
          }
        ]
      });

      return {
        requestId: task.id,
        agentId: this.descriptor.id,
        status: "success",
        payload: {
          content: response.choices[0]?.message?.content,
          model: response.model,
          usage: response.usage
        },
        timestamp: Date.now()
      };
    } catch (error: any) {
      return {
        requestId: task.id,
        agentId: this.descriptor.id,
        status: "error",
        error: {
          code: error.code || "UNKNOWN",
          message: error.message || "OpenAI API error"
        },
        timestamp: Date.now()
      };
    }
  }
}
```

## Using OpenAI Agents SDK with DreamNet

### Step 1: Install Dependencies

```bash
pnpm add @openai/agents openai
```

### Step 2: Register Provider in Interop Registry

```typescript
import { AgentInteropRegistry } from '@dreamnet/spine/agent-interop';
import { OpenAIProvider } from '@dreamnet/spine/agent-interop/OpenAIProvider';

const registry = new AgentInteropRegistry();

registry.registerProvider({
  id: "openai-main",
  type: "openai",
  name: "OpenAI Main",
  auth: {
    type: "api_key",
    config: {
      apiKey: process.env.OPENAI_API_KEY
    }
  },
  capabilities: ["chat", "completions", "embeddings", "function_calling"]
});

const provider = new OpenAIProvider(registry.getProvider("openai-main")!);
await provider.initialize();
```

### Step 3: Create DreamNet Tools for OpenAI Agents

```typescript
import { Tool } from '@openai/agents';

export const dreamNetTools: Tool[] = [
  {
    type: "function",
    function: {
      name: "create_dream",
      description: "Create a new dream in DreamNet",
      parameters: {
        type: "object",
        properties: {
          title: { type: "string" },
          description: { type: "string" },
          tags: { type: "array", items: { type: "string" } }
        },
        required: ["title", "description"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "get_dream_status",
      description: "Get the status of a dream",
      parameters: {
        type: "object",
        properties: {
          dreamId: { type: "string" }
        },
        required: ["dreamId"]
      }
    }
  }
];
```

### Step 4: Create DreamNet Agent

```typescript
import { Agent } from '@openai/agents';
import { dreamNetTools } from './dreamNetTools';

export const dreamNetAgent = new Agent({
  name: "DreamNet Assistant",
  instructions: `You are a DreamNet agent that helps users create, manage, and deploy dreams.
  
DreamNet is a biomimetic agent orchestration platform where users submit "dreams" (ideas/projects)
that become mini-apps with on-chain contracts.

Use the available tools to interact with DreamNet systems.`,
  tools: dreamNetTools,
  model: "gpt-4o"
});
```

## Integration with Super Spine

Connect OpenAI agents to DreamNet's Super Spine:

```typescript
import { superSpine } from '@/server/core/SuperSpine';
import { AgentInteropRegistry } from '@dreamnet/spine/agent-interop';

// Register OpenAI provider
const registry = new AgentInteropRegistry();
registry.registerProvider({
  id: "openai-super-spine",
  type: "openai",
  name: "OpenAI Super Spine Bridge",
  capabilities: ["agent_orchestration", "task_routing"]
});

// Bridge OpenAI agents to Super Spine
superSpine.registerAgent("openai-assistant", {
  name: "OpenAI Assistant",
  capabilities: ["code", "analysis", "communication"],
  metadata: {
    provider: "openai",
    model: "gpt-4o"
  }
});
```

## Environment Setup

Add to `.env`:
```bash
OPENAI_API_KEY=sk-...
```

## Best Practices

1. **Use Agents SDK for Complex Workflows**: Use `@openai/agents` for multi-step agentic workflows
2. **Use Standard SDK for Simple Tasks**: Use `openai` SDK for simple chat completions
3. **Register in Interop Spine**: Always register OpenAI providers in the Interop Registry
4. **Error Handling**: Implement proper error handling and fallbacks
5. **Rate Limiting**: Implement rate limiting to respect OpenAI API limits
6. **Cost Tracking**: Track API usage and costs

## Next Steps

1. Implement `OpenAIProvider` with full functionality
2. Create DreamNet-specific tools for OpenAI agents
3. Integrate with Super Spine for agent orchestration
4. Add streaming support for real-time responses
5. Implement agent handoffs between OpenAI and DreamNet agents

