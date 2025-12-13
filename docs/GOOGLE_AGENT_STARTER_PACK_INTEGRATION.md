# Google Agent Starter Pack Integration Guide

**Integrating Google Cloud Platform's Agent Starter Pack with DreamNet**

**GitHub:** https://github.com/GoogleCloudPlatform/agent-starter-pack

---

## 🎯 What is Google Agent Starter Pack?

Google's **Agent Starter Pack** is a Python-based toolkit for building production-ready AI agents on Google Cloud. It provides:

- **Pre-built Templates**: ReAct, RAG, multi-agent systems, live API integrations
- **Vertex AI Integration**: Evaluation, experimentation, playground
- **Production Infrastructure**: Cloud Run deployment, monitoring, CI/CD
- **Evaluation Tools**: Testing and iteration tools

---

## 🏗️ Integration Options

Since DreamNet is TypeScript/Node.js and Agent Starter Pack is Python, we have 3 options:

### Option 1: Run as Separate Service (Recommended)

Run Agent Starter Pack agents as separate Python services that communicate with DreamNet via API.

### Option 2: Port Concepts to TypeScript

Adapt the patterns and templates to TypeScript/Node.js within DreamNet.

### Option 3: Hybrid Approach

Use Agent Starter Pack for complex agent workflows, DreamNet for orchestration.

---

## 🚀 Quick Start: Option 1 (Separate Service)

### Step 1: Install Agent Starter Pack

```bash
# Install globally or in a Python environment
pip install --upgrade agent-starter-pack

# Or using uv (faster)
uvx agent-starter-pack create dreamnet-agent
```

### Step 2: Create Agent Project

```bash
# Create new agent project
agent-starter-pack create dreamnet-agent

# This creates:
# - dreamnet-agent/
#   - backend/ (Python FastAPI)
#   - frontend/ (React)
#   - deployment/ (Cloud Run configs)
#   - evaluation/ (Vertex AI eval)
```

### Step 3: Configure for DreamNet Integration

**Edit `dreamnet-agent/backend/main.py`:**

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import httpx

app = FastAPI()

# Allow DreamNet to call this service
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Or specific DreamNet domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# DreamNet webhook endpoint
@app.post("/dreamnet/webhook")
async def dreamnet_webhook(request: dict):
    """
    Receive tasks from DreamNet
    """
    task = request.get("task")
    agent_type = request.get("agent_type", "react")
    
    # Process with Agent Starter Pack agent
    result = await process_with_agent(task, agent_type)
    
    return {
        "success": True,
        "result": result,
        "agent": "google-agent-starter-pack"
    }

async def process_with_agent(task: str, agent_type: str):
    # Use Agent Starter Pack to process task
    # This depends on which template you're using
    pass
```

### Step 4: Deploy to Cloud Run

```bash
cd dreamnet-agent
gcloud run deploy dreamnet-agent \
  --source . \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

### Step 5: Integrate with DreamNet

**Create `server/integrations/googleAgentStarterPack.ts`:**

```typescript
/**
 * Google Agent Starter Pack Integration
 * Connects DreamNet to Google's Agent Starter Pack agents
 */

interface GoogleAgentRequest {
  task: string;
  agent_type?: 'react' | 'rag' | 'multi-agent' | 'live-api';
  context?: Record<string, unknown>;
}

interface GoogleAgentResponse {
  success: boolean;
  result: unknown;
  agent: string;
}

export class GoogleAgentStarterPackClient {
  private baseUrl: string;

  constructor(baseUrl?: string) {
    // Get from env or use default Cloud Run URL
    this.baseUrl = baseUrl || process.env.GOOGLE_AGENT_STARTER_PACK_URL || 
                   'https://dreamnet-agent-xxxxx-ue.a.run.app';
  }

  /**
   * Execute task with Google Agent Starter Pack
   */
  async executeTask(request: GoogleAgentRequest): Promise<GoogleAgentResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/dreamnet/webhook`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          task: request.task,
          agent_type: request.agent_type || 'react',
          context: request.context || {}
        })
      });

      if (!response.ok) {
        throw new Error(`Agent Starter Pack error: ${response.statusText}`);
      }

      return await response.json();
    } catch (error: any) {
      throw new Error(`Failed to execute with Agent Starter Pack: ${error.message}`);
    }
  }

  /**
   * Use ReAct agent template
   */
  async reactAgent(task: string, context?: Record<string, unknown>): Promise<unknown> {
    return this.executeTask({
      task,
      agent_type: 'react',
      context
    });
  }

  /**
   * Use RAG agent template
   */
  async ragAgent(task: string, context?: Record<string, unknown>): Promise<unknown> {
    return this.executeTask({
      task,
      agent_type: 'rag',
      context
    });
  }

  /**
   * Use multi-agent template
   */
  async multiAgent(task: string, context?: Record<string, unknown>): Promise<unknown> {
    return this.executeTask({
      task,
      agent_type: 'multi-agent',
      context
    });
  }
}

// Export singleton instance
export const googleAgentStarterPack = new GoogleAgentStarterPackClient();
```

### Step 6: Add Route in DreamNet

**Create `server/routes/google-agent-starter.ts`:**

```typescript
import { Router } from 'express';
import { googleAgentStarterPack } from '../integrations/googleAgentStarterPack';

const router = Router();

// POST /api/google-agent-starter/execute
router.post('/execute', async (req, res) => {
  try {
    const { task, agent_type, context } = req.body;

    if (!task) {
      return res.status(400).json({ error: 'Task is required' });
    }

    const result = await googleAgentStarterPack.executeTask({
      task,
      agent_type,
      context
    });

    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/google-agent-starter/react
router.post('/react', async (req, res) => {
  try {
    const { task, context } = req.body;
    const result = await googleAgentStarterPack.reactAgent(task, context);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/google-agent-starter/rag
router.post('/rag', async (req, res) => {
  try {
    const { task, context } = req.body;
    const result = await googleAgentStarterPack.ragAgent(task, context);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
```

### Step 7: Register Route

**Add to `server/index.ts`:**

```typescript
import googleAgentStarterRouter from './routes/google-agent-starter';

// ... existing code ...

app.use('/api/google-agent-starter', googleAgentStarterRouter);
```

---

## 🔧 Option 2: Port Templates to TypeScript

If you want to use Agent Starter Pack patterns directly in DreamNet:

### ReAct Agent Pattern

**Create `packages/agent-react-core/ReActAgent.ts`:**

```typescript
/**
 * ReAct Agent - Ported from Google Agent Starter Pack
 * Reasoning + Acting pattern
 */

export class ReActAgent {
  private model: any; // OpenAI or Vertex AI client
  private tools: Map<string, Function> = new Map();

  constructor(model: any) {
    this.model = model;
  }

  registerTool(name: string, tool: Function): void {
    this.tools.set(name, tool);
  }

  async execute(task: string): Promise<string> {
    // ReAct loop: Think → Act → Observe → Repeat
    let thought = `Task: ${task}`;
    let action = '';
    let observation = '';

    for (let i = 0; i < 10; i++) { // Max iterations
      // Think: Generate reasoning
      const reasoning = await this.think(thought, action, observation);
      
      // Act: Decide on action
      const actionResult = await this.act(reasoning);
      
      if (actionResult.done) {
        return actionResult.result;
      }

      // Observe: Get result from action
      observation = await this.observe(actionResult);
      thought = reasoning;
      action = actionResult.action;
    }

    return "Max iterations reached";
  }

  private async think(thought: string, action: string, observation: string): Promise<string> {
    const prompt = `
Thought: ${thought}
Action: ${action}
Observation: ${observation}

What should I think about next?
`;
    
    const response = await this.model.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }]
    });

    return response.choices[0].message.content || '';
  }

  private async act(reasoning: string): Promise<{ action: string; done: boolean; result?: string }> {
    // Parse reasoning to determine action
    // Check if task is complete or needs tool call
    return { action: "continue", done: false };
  }

  private async observe(actionResult: { action: string }): Promise<string> {
    // Execute tool or get observation
    return "Observation result";
  }
}
```

---

## 📋 Environment Variables

Add to `.env`:

```bash
# Google Agent Starter Pack Service URL
GOOGLE_AGENT_STARTER_PACK_URL=https://dreamnet-agent-xxxxx-ue.a.run.app

# Google Cloud Project (for Vertex AI)
GCP_PROJECT_ID=your-project-id
GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account.json
```

---

## 🎯 Available Agent Templates

From Agent Starter Pack:

1. **ReAct Agent** - Reasoning + Acting pattern
2. **RAG Agent** - Retrieval-Augmented Generation
3. **Multi-Agent** - Multiple agents working together
4. **Live API Agent** - Real-time API integration

---

## 🔌 Integration with DreamNet Systems

### Connect to Super Spine

```typescript
import { superSpine } from '../server/core/SuperSpine';
import { googleAgentStarterPack } from '../integrations/googleAgentStarterPack';

// Register Google Agent Starter Pack agent
superSpine.registerAgent(
  "google-react-agent",
  "Google ReAct Agent",
  ["code", "analysis", "reasoning"],
  {
    tier: "Standard",
    unlock: "Default",
    metadata: {
      provider: "google-agent-starter-pack",
      template: "react"
    }
  }
);
```

### Use in DreamNet OS

```typescript
import { dreamNetOS } from '../server/core/dreamnet-os';
import { googleAgentStarterPack } from '../integrations/googleAgentStarterPack';

// Execute via Google Agent Starter Pack
const result = await googleAgentStarterPack.reactAgent(
  "Analyze this codebase and suggest improvements"
);
```

---

## 📚 Resources

- **GitHub**: https://github.com/GoogleCloudPlatform/agent-starter-pack
- **Documentation**: https://googlecloudplatform.github.io/agent-starter-pack/
- **Templates**: See `agent-starter-pack/templates/` directory

---

## ✅ Checklist

- [ ] Install Agent Starter Pack: `pip install agent-starter-pack`
- [ ] Create agent project: `agent-starter-pack create dreamnet-agent`
- [ ] Configure webhook endpoint in Python backend
- [ ] Deploy to Cloud Run
- [ ] Create `googleAgentStarterPack.ts` client
- [ ] Add route in DreamNet
- [ ] Test integration
- [ ] Register in Super Spine (optional)

---

## 🆘 Troubleshooting

**Python not installed?**
```bash
# Install Python 3.10+
python --version

# Or use uv (faster)
pip install uv
uvx agent-starter-pack create dreamnet-agent
```

**Cloud Run deployment fails?**
- Check `deployment/cloud-run.yaml` config
- Verify GCP credentials
- Check Cloud Run quotas

**Can't connect from DreamNet?**
- Verify `GOOGLE_AGENT_STARTER_PACK_URL` is set
- Check CORS settings in Python backend
- Verify Cloud Run allows unauthenticated requests

---

**Ready to integrate!** Choose Option 1 (separate service) for quickest integration, or Option 2 (port to TypeScript) for tighter integration.

