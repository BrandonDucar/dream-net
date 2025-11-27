# OpenAI Integration Quickstart

## Quick Setup (5 minutes)

### 1. Install Dependencies

```bash
pnpm add openai @openai/agents
```

### 2. Set Environment Variable

Add to `.env`:
```bash
OPENAI_API_KEY=sk-your-key-here
```

### 3. Basic Usage (Standard SDK)

```typescript
import OpenAI from 'openai';

const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY 
});

const response = await openai.chat.completions.create({
  model: "gpt-4o",
  messages: [{ role: "user", content: "Hello DreamNet!" }]
});

console.log(response.choices[0].message.content);
```

### 4. Basic Usage (Agents SDK)

```typescript
import { Agent, Runner } from '@openai/agents';

const agent = new Agent({
  name: "DreamNet Agent",
  instructions: "You help users create dreams.",
  model: "gpt-4o"
});

const result = await Runner.run(agent, "Create a dream about AI");
console.log(result);
```

### 5. Register in Interop Spine

```typescript
import { AgentInteropRegistry } from '@dreamnet/spine/agent-interop';
import { OpenAIProvider } from '@dreamnet/spine/agent-interop/OpenAIProvider';

const registry = new AgentInteropRegistry();

registry.registerProvider({
  id: "openai",
  type: "openai",
  name: "OpenAI",
  auth: {
    type: "api_key",
    config: { apiKey: process.env.OPENAI_API_KEY }
  }
});

const provider = new OpenAIProvider(registry.getProvider("openai")!);
await provider.initialize();
```

## Integration Checklist

- [ ] Install `openai` and/or `@openai/agents` packages
- [ ] Set `OPENAI_API_KEY` in environment
- [ ] Implement `OpenAIProvider.initialize()`
- [ ] Implement `OpenAIProvider.executeTask()`
- [ ] Register provider in Interop Registry
- [ ] Test with simple chat completion
- [ ] Add DreamNet-specific tools (optional)
- [ ] Integrate with Super Spine (optional)

## Next Steps

See detailed guides:
- `OPENAI_AGENTS_INTEGRATION.md` - Full integration guide
- `OPENAI_CLI_INTEGRATION.md` - CLI usage guide

