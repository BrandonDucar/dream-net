# OpenAI SDK, Google Agent Starter Pack & ChatGPT Integration Explained

**Complete guide to how DreamNet integrates with OpenAI, Google, and ChatGPT**

---

## 🤖 Part 1: OpenAI SDK Integration

### **WHAT is OpenAI SDK?**

The **OpenAI SDK** (`openai` npm package) is the official JavaScript/TypeScript client for:
- **OpenAI API** - Standard chat completions (GPT-4, GPT-3.5)
- **Assistants API** - Persistent AI assistants with threads and tools
- **Agents SDK** (`@openai/agents`) - Framework for building agentic workflows

### **WHERE is it used?**

#### 1. **GPT Agent Factory** (`server/core/agents/gpt-agent-factory.ts`)

**What it does:**
- Reads all 52 Active Custom GPTs from `registry.json`
- Creates DreamNet agents for each GPT
- Uses **OpenAI Assistants API** to give them actual execution power

**How it works:**
```typescript
// Creates OpenAI Assistant for each GPT
const assistant = await openai.beta.assistants.create({
  name: gpt.name,                    // e.g., "Wanderweave"
  instructions: buildInstructions(gpt), // Custom instructions
  model: "gpt-4o",                   // Uses GPT-4o
  tools: getToolsForCategory(gpt.category) // Code interpreter, etc.
});

// Creates thread for conversation
const thread = await openai.beta.threads.create();

// Runs assistant
const run = await openai.beta.threads.runs.create(thread.id, {
  assistant_id: assistantId
});
```

**Why:**
- Each Custom GPT becomes a **real executable agent**
- They can maintain conversation context (threads)
- They can use tools (code interpreter, function calling)
- They're integrated into DreamNet's agent system

#### 2. **OpenAI Provider** (`spine/agent-interop/OpenAIProvider.ts`)

**What it does:**
- Integrates OpenAI with DreamNet's Interop Spine
- Supports both standard OpenAI SDK and Agents SDK
- Allows other DreamNet systems to use OpenAI

**How it works:**
```typescript
// Standard OpenAI SDK usage
const response = await openai.chat.completions.create({
  model: "gpt-4o",
  messages: [{ role: "user", content: "Hello" }]
});

// OR OpenAI Agents SDK usage
const agent = new Agent({
  name: "DreamNet Agent",
  instructions: "You are a DreamNet agent...",
  model: "gpt-4o"
});

const result = await Runner.run(agent, "Do something");
```

**Why:**
- Provides unified interface for OpenAI access
- Supports both simple chat and complex agent workflows
- Integrates with DreamNet's agent interop system

#### 3. **Direct OpenAI Agents** (`server/core/agents/openai-*.ts`)

**What they are:**
- `openai-react-agent.ts` - ReAct (Reasoning + Acting) pattern
- `openai-assistant-agent.ts` - Uses Assistants API directly
- `openai-code-agent.ts` - Specialized for code generation

**How they work:**
- Each is a DreamNet agent that wraps OpenAI functionality
- Can be called via `/api/agent` endpoint
- Use OpenAI SDK under the hood

**Why:**
- Provides specialized agent patterns
- Reusable across DreamNet
- Easy to call from anywhere

---

## 🔵 Part 2: Google Agent Starter Pack Integration

### **WHAT is Google Agent Starter Pack?**

**GitHub:** https://github.com/GoogleCloudPlatform/agent-starter-pack

A **Python-based toolkit** from Google Cloud for building production-ready AI agents. It provides:

- **Pre-built Templates:**
  - ReAct Agent (Reasoning + Acting)
  - RAG Agent (Retrieval-Augmented Generation)
  - Multi-Agent Systems
  - Live API Agents

- **Production Infrastructure:**
  - Cloud Run deployment configs
  - Monitoring and logging
  - CI/CD pipelines
  - Evaluation tools

- **Vertex AI Integration:**
  - Uses Google's Vertex AI models
  - Evaluation frameworks
  - Experimentation tools

### **WHERE is it used?**

#### 1. **Integration Client** (`server/integrations/googleAgentStarterPack.ts`)

**What it does:**
- TypeScript client that connects DreamNet to Google Agent Starter Pack
- Calls Python service running on Cloud Run
- Provides methods for each agent template

**How it works:**
```typescript
// Calls Python service deployed on Cloud Run
const response = await fetch(`${baseUrl}/dreamnet/webhook`, {
  method: 'POST',
  body: JSON.stringify({
    task: "Analyze this codebase",
    agent_type: 'react'  // or 'rag', 'multi-agent', 'live-api'
  })
});
```

**Why:**
- Google's Agent Starter Pack is **Python-based**
- DreamNet is **TypeScript/Node.js**
- We run it as a **separate service** and call it via HTTP

#### 2. **How We Implement It**

**Step 1: Deploy Python Service**
```bash
# Install Agent Starter Pack
pip install agent-starter-pack

# Create agent project
agent-starter-pack create dreamnet-agent

# Deploy to Cloud Run
gcloud run deploy dreamnet-agent --source .
```

**Step 2: Configure Webhook**
The Python service exposes `/dreamnet/webhook` endpoint that:
- Receives tasks from DreamNet
- Processes with Agent Starter Pack templates
- Returns results

**Step 3: Use from DreamNet**
```typescript
import { googleAgentStarterPack } from './integrations/googleAgentStarterPack';

// Use ReAct agent
const result = await googleAgentStarterPack.reactAgent(
  "Analyze this codebase"
);

// Use RAG agent
const result = await googleAgentStarterPack.ragAgent(
  "Search DreamNet documentation"
);
```

**Why this approach:**
- ✅ Keeps Python and TypeScript separate
- ✅ Can scale independently
- ✅ Uses Google's production-ready templates
- ✅ Easy to deploy and maintain

---

## 💬 Part 3: ChatGPT Desktop Integration

### **YES! You can log into ChatGPT Desktop and talk to everything!**

### **HOW it works:**

#### **Method 1: ChatGPT Agent Mode (Recommended)**

**What is Agent Mode?**
- ChatGPT feature that gives ChatGPT **web access**
- Can make HTTP requests to APIs
- Can browse the web
- Can execute code

**How to set it up:**

1. **Get your DreamNet API key:**
   ```bash
   # Via API
   GET https://dreamnet.ink/api/keys/default
   # Returns: dn_live_YOUR_KEY_HERE
   ```

2. **Give ChatGPT your API key:**
   ```
   Copy this prompt into ChatGPT Agent Mode:
   
   I want you to interact with DreamNet API. Here's my API key:
   
   API Key: dn_live_YOUR_KEY_HERE
   Base URL: https://dreamnet.ink
   
   For ALL requests to DreamNet, include this header:
   Authorization: Bearer dn_live_YOUR_KEY_HERE
   
   Start by validating the key, then check DreamNet's status.
   ```

3. **ChatGPT can now:**
   - ✅ Check DreamNet status
   - ✅ Query all dreams
   - ✅ Monitor Shield Core threats
   - ✅ Check Wolf Pack leads
   - ✅ Manage Vercel deployments
   - ✅ Use natural language interface
   - ✅ Execute actions autonomously

#### **Method 2: Custom GPT Integration**

**What are Custom GPTs?**
- Your 52 Custom GPTs (Wanderweave, Code Pilot Studio, etc.)
- Each is a specialized ChatGPT instance
- Can be accessed via ChatGPT web/desktop

**How they connect:**
- Each Custom GPT can be configured with **Actions** (API integrations)
- They can call DreamNet APIs
- They can use DreamNet's natural language interface

**Example:**
```
You: "Wanderweave, plan a trip to Tokyo"

Wanderweave GPT:
1. Calls DreamNet API: POST /api/chatgpt-agent/chat
   Body: { "message": "Plan a trip to Tokyo" }
2. DreamNet responds with suggestions
3. Wanderweave uses DreamNet's travel data
4. Returns comprehensive travel plan
```

### **WHAT ChatGPT can talk to:**

#### ✅ **All DreamNet Systems:**

1. **Core Systems:**
   - DreamNet OS status
   - Spider Web Core (events)
   - Shield Core (security)
   - Dream State (governance)

2. **Agents:**
   - All 52 Custom GPT agents
   - DreamKeeper, DeployKeeper, RelayBot
   - OpenAI agents (ReAct, Code, Assistant)

3. **Data:**
   - All dreams
   - Wolf Pack leads
   - Shield threats
   - System metrics

4. **Actions:**
   - Create dreams
   - Manage deployments
   - Monitor security
   - Query data

### **Example Conversation:**

**You (in ChatGPT Desktop):**
```
"Check DreamNet status and show me all active threats"
```

**ChatGPT:**
```
I'll check DreamNet's status and security threats for you.

1. Validating API key... ✅
2. Getting system status... ✅
3. Checking Shield Core threats... ✅

DreamNet Status:
- System: ✅ Healthy
- Shield Core: 🛡️ Active (3 layers)
- Active Threats: 2 detected
  - Threat #1: Suspicious API call pattern
  - Threat #2: Rate limit violation attempt

Would you like me to investigate these threats further?
```

---

## 🔄 How Everything Connects

```
┌─────────────────────────────────────────────────────────┐
│                    ChatGPT Desktop                      │
│  (You log in, give API key, chat with DreamNet)        │
└────────────────────┬────────────────────────────────────┘
                     │
                     │ HTTP Requests
                     │ Authorization: Bearer dn_live_...
                     │
┌────────────────────▼────────────────────────────────────┐
│                  DreamNet API                           │
│  (https://dreamnet.ink/api/*)                          │
│  - /api/heartbeat                                       │
│  - /api/dreams                                          │
│  - /api/chatgpt-agent/chat                              │
└────────────────────┬────────────────────────────────────┘
                     │
        ┌────────────┼────────────┐
        │            │            │
┌───────▼──────┐ ┌──▼──────────┐ ┌▼──────────────────┐
│ OpenAI SDK   │ │ Google      │ │ DreamNet Agents   │
│              │ │ Agent       │ │                   │
│ - Assistants │ │ Starter     │ │ - 52 GPT Agents   │
│ - Agents SDK │ │ Pack        │ │ - Core Agents     │
│ - Chat API   │ │ (Python)    │ │ - OpenAI Agents   │
└──────────────┘ └─────────────┘ └───────────────────┘
```

---

## 📋 Summary

### **OpenAI SDK:**
- **WHAT:** Official JavaScript client for OpenAI APIs
- **WHERE:** `gpt-agent-factory.ts`, `OpenAIProvider.ts`, `openai-*.ts`
- **HOW:** Creates Assistants API instances for each Custom GPT
- **WHY:** Makes Custom GPTs executable agents with conversation context

### **Google Agent Starter Pack:**
- **WHAT:** Python toolkit for production AI agents
- **WHERE:** `googleAgentStarterPack.ts` (TypeScript client)
- **HOW:** Runs as separate Python service on Cloud Run, called via HTTP
- **WHY:** Provides production-ready agent templates (ReAct, RAG, multi-agent)

### **ChatGPT Desktop:**
- **WHAT:** ChatGPT with Agent Mode enabled
- **WHERE:** Your desktop app, web browser, or mobile
- **HOW:** Give ChatGPT your DreamNet API key, it makes HTTP requests
- **WHY:** You can chat with ChatGPT and it talks to ALL DreamNet systems

---

## 🚀 Quick Start

### **1. Set up OpenAI SDK:**
```bash
pnpm add openai @openai/agents
export OPENAI_API_KEY=sk-your-key-here
```

### **2. Set up Google Agent Starter Pack:**
```bash
pip install agent-starter-pack
agent-starter-pack create dreamnet-agent
# Deploy to Cloud Run
export GOOGLE_AGENT_STARTER_PACK_URL=https://your-service.run.app
```

### **3. Connect ChatGPT Desktop:**
```bash
# Get your API key
curl https://dreamnet.ink/api/keys/default \
  -H "Authorization: Bearer YOUR_WALLET_JWT"

# Give to ChatGPT:
# "Use this DreamNet API key: dn_live_YOUR_KEY"
```

---

## ✅ You Can Now:

1. ✅ **Log into ChatGPT Desktop**
2. ✅ **Give it your DreamNet API key**
3. ✅ **Chat with ChatGPT**
4. ✅ **ChatGPT talks to ALL DreamNet systems**
5. ✅ **Use all 52 Custom GPTs**
6. ✅ **Access OpenAI agents**
7. ✅ **Use Google Agent Starter Pack agents**
8. ✅ **Monitor everything**
9. ✅ **Execute actions**
10. ✅ **Full autonomous control**

**Everything is connected! 🎉**

