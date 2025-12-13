# OpenAI Agent Kit Setup Guide

**Quick guide to connect OpenAI SDK and Agent Kit with DreamNet**

---

## ✅ What's Already Set Up

- ✅ OpenAI SDK (`openai` package) - Already installed
- ✅ OpenAIProvider implementation - Just completed
- ✅ Integration with DreamNet Spine - Ready to use
- ✅ Existing OpenAI usage in routes - Working

---

## 🚀 Quick Start (5 minutes)

### Step 1: Install OpenAI Agents SDK (Optional but Recommended)

```bash
pnpm add @openai/agents
```

**Note:** The standard OpenAI SDK is already installed. Agents SDK adds agentic workflow capabilities.

### Step 2: Set Environment Variable

Make sure `OPENAI_API_KEY` is set in your `.env`:

```bash
OPENAI_API_KEY=sk-your-key-here
```

### Step 3: Register OpenAI Provider

**Option A: Register in Server Startup**

Add to `server/index.ts` or wherever you initialize providers:

```typescript
import { AgentInteropRegistry } from '../spine/agent-interop';
import { OpenAIProvider } from '../spine/agent-interop/OpenAIProvider';

// Get or create registry
const registry = new AgentInteropRegistry();

// Register OpenAI provider
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
  capabilities: ["chat", "completions", "agents", "tools"],
  config: {
    model: "gpt-4o",
    useAgentsSDK: true, // Enable Agents SDK
    systemMessage: "You are a DreamNet agent assistant."
  }
});

// Initialize provider
const provider = new OpenAIProvider(registry.getProvider("openai-main")!);
await provider.initialize();
```

**Option B: Use Existing OpenAI (Simple)**

You can use OpenAI directly without the provider:

```typescript
import OpenAI from 'openai';

const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY 
});

const response = await openai.chat.completions.create({
  model: "gpt-4o",
  messages: [{ role: "user", content: "Hello DreamNet!" }]
});
```

---

## 🤖 Using OpenAI Agents SDK

### Create an Agent

```typescript
import { Agent, Runner } from '@openai/agents';
import { OpenAIProvider } from '../spine/agent-interop/OpenAIProvider';

const provider = new OpenAIProvider({
  id: "openai",
  type: "openai",
  name: "DreamNet Agent",
  auth: {
    type: "api_key",
    config: { apiKey: process.env.OPENAI_API_KEY }
  },
  config: {
    useAgentsSDK: true
  }
});

await provider.initialize();

// Create custom agent
provider.createAgent({
  name: "Dream Creator",
  instructions: "You help users create and manage dreams in DreamNet.",
  model: "gpt-4o",
  tools: [] // Add DreamNet tools here
});

// Execute task
const result = await provider.executeTask({
  id: "task-1",
  agentId: "openai",
  payload: "Create a dream about AI agents",
  timestamp: Date.now()
});
```

### Create DreamNet Tools for OpenAI Agents

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
          title: { type: "string", description: "Dream title" },
          description: { type: "string", description: "Dream description" },
          tags: { 
            type: "array", 
            items: { type: "string" },
            description: "Dream tags"
          }
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
          dreamId: { type: "string", description: "Dream ID" }
        },
        required: ["dreamId"]
      }
    }
  }
];

// Use tools with agent
provider.createAgent({
  name: "DreamNet Assistant",
  instructions: "You help users create and manage dreams.",
  tools: dreamNetTools
});
```

---

## 🔌 Integration with DreamNet Systems

### Connect to Super Spine

```typescript
import { superSpine } from '../server/core/SuperSpine';
import { OpenAIProvider } from '../spine/agent-interop/OpenAIProvider';

// Register OpenAI agent in Super Spine
superSpine.registerAgent(
  "openai-assistant",
  "OpenAI Assistant",
  ["code", "analysis", "communication"],
  {
    tier: "Standard",
    unlock: "Default",
    subscriptionRequired: false,
    metadata: {
      provider: "openai",
      model: "gpt-4o"
    }
  }
);
```

### Use in DreamNet OS

```typescript
import { dreamNetOS } from '../server/core/dreamnet-os';
import { OpenAIProvider } from '../spine/agent-interop/OpenAIProvider';

// Register provider
const provider = new OpenAIProvider({...});
await provider.initialize();

// Execute via DreamNet OS
const result = await dreamNetOS.runAgent("openai-assistant", {
  input: "Create a dream about AI"
});
```

---

## 📝 API Endpoint Example

Create a route to use OpenAI agents:

```typescript
// server/routes/openai-agent.ts
import { Router } from 'express';
import { OpenAIProvider } from '../spine/agent-interop/OpenAIProvider';

const router = Router();
let provider: OpenAIProvider | null = null;

// Initialize provider
(async () => {
  provider = new OpenAIProvider({
    id: "openai-api",
    type: "openai",
    name: "OpenAI API Agent",
    auth: {
      type: "api_key",
      config: { apiKey: process.env.OPENAI_API_KEY }
    },
    config: {
      useAgentsSDK: true,
      model: "gpt-4o"
    }
  });
  await provider.initialize();
})();

// POST /api/openai-agent/chat
router.post('/chat', async (req, res) => {
  try {
    if (!provider) {
      return res.status(503).json({ error: "OpenAI provider not initialized" });
    }

    const { message, useAgent = false } = req.body;

    const result = await provider.executeTask({
      id: `task-${Date.now()}`,
      agentId: "openai-api",
      payload: message,
      timestamp: Date.now()
    });

    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
```

---

## 🎯 What You Can Do Now

1. **Use Standard OpenAI SDK** - Already working in `dream-titles.ts`, `dream-shopping.ts`
2. **Use OpenAI Agents SDK** - Install `@openai/agents` and use `Agent` + `Runner`
3. **Create Custom Agents** - Use `provider.createAgent()` with custom instructions
4. **Add DreamNet Tools** - Create tools that interact with DreamNet systems
5. **Integrate with Super Spine** - Register OpenAI agents in DreamNet's agent system

---

## 📚 Examples

### Example 1: Simple Chat

```typescript
const provider = new OpenAIProvider({...});
await provider.initialize();

const result = await provider.executeTask({
  id: "1",
  agentId: "openai",
  payload: "What is DreamNet?",
  timestamp: Date.now()
});

console.log(result.payload.content);
```

### Example 2: Agent with Tools

```typescript
provider.createAgent({
  name: "Dream Helper",
  instructions: "You help users create dreams.",
  tools: dreamNetTools
});

const result = await provider.executeTaskWithAgent({
  id: "2",
  agentId: "openai",
  payload: "Create a dream about blockchain",
  timestamp: Date.now()
});
```

### Example 3: Direct SDK Usage

```typescript
const openai = provider.getClient();

const response = await openai.chat.completions.create({
  model: "gpt-4o",
  messages: [
    { role: "system", content: "You are helpful." },
    { role: "user", content: "Hello!" }
  ]
});
```

---

## ✅ Checklist

- [ ] Install `@openai/agents` (optional): `pnpm add @openai/agents`
- [ ] Set `OPENAI_API_KEY` in `.env`
- [ ] Register OpenAIProvider in your code
- [ ] Initialize provider: `await provider.initialize()`
- [ ] Test with simple task
- [ ] Create custom agents (optional)
- [ ] Add DreamNet tools (optional)
- [ ] Integrate with Super Spine (optional)

---

## 🆘 Troubleshooting

**Error: "OpenAI SDK not installed"**
```bash
pnpm add openai
```

**Error: "Agents SDK not installed"**
```bash
pnpm add @openai/agents
```

**Error: "OpenAI API key required"**
- Set `OPENAI_API_KEY` in `.env` file

**Want to use Agents SDK?**
- Set `config.useAgentsSDK: true` in provider descriptor

---

**You're all set!** OpenAI is now fully integrated with DreamNet. You can use it directly or via the provider system.

