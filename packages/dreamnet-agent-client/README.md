# DreamNet Agent Client

Official TypeScript/JavaScript and Python clients for interacting with DreamNet API.

## Installation

### TypeScript/JavaScript

```bash
npm install @dreamnet/dreamnet-agent-client
# or
pnpm add @dreamnet/dreamnet-agent-client
```

### Python

```bash
pip install requests
# Copy dreamnet_agent.py to your project
```

## Quick Start

### TypeScript/JavaScript

```typescript
import { DreamNetAgent } from "@dreamnet/dreamnet-agent-client";

const agent = new DreamNetAgent({
  apiKey: process.env.DREAMNET_API_KEY!,
});

// Natural language interface
const response = await agent.autonomousQuery("Show me DreamNet status");

// Structured calls
const status = await agent.checkSystemStatus();
const projects = await agent.listVercelProjects();
```

### Python

```python
from dreamnet_agent import DreamNetAgent

agent = DreamNetAgent()  # reads DREAMNET_API_KEY from env

# Natural language interface
response = agent.autonomous_query("Show me DreamNet status")

# Structured calls
status = agent.check_system_status()
projects = agent.list_vercel_projects()
```

## Features

- ✅ Natural language interface (`autonomousQuery`)
- ✅ Auto-retry with exponential backoff
- ✅ Rate limit handling (429)
- ✅ Timeout support
- ✅ TypeScript types
- ✅ All DreamNet endpoints mapped

## API Reference

See `dreamnet-agent.ts` (TypeScript) or `dreamnet_agent.py` (Python) for full API documentation.

## Environment Variables

- `DREAMNET_API_KEY` - Your DreamNet API key (required)

## License

Private - DreamNet internal use only







