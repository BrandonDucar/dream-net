# ChatGPT Agent Mode ↔ DreamNet Integration V2

**🚀 NEW: Natural Language Interface + Direct Vercel Integration!**

ChatGPT can now talk to DreamNet like a human, and we have **better Vercel integration** than ChatGPT's built-in connector!

---

## 🎯 What's New

### 1. Natural Language Interface
ChatGPT can now use **natural language** to interact with DreamNet:
- "Show me DreamNet status"
- "List all Vercel projects"
- "Analyze Vercel projects for cleanup"
- "What threats has Shield Core detected?"

### 2. Better Vercel Integration
We have **direct Vercel API access** - better than ChatGPT's built-in connector:
- List all projects
- Get project details
- Analyze cleanup opportunities
- Auto-cleanup duplicate projects
- Manage deployments

### 3. Context-Aware Responses
DreamNet understands what ChatGPT wants and suggests the right endpoints.

---

## 🚀 Quick Start

### Step 1: Get Your API Key

**Endpoint:** `GET https://dreamnet.ink/api/keys/default`

**Auth:** Your wallet JWT token (from `/api/auth/verify`)

### Step 2: Give ChatGPT This Prompt

```markdown
I want you to interact with DreamNet API. Here's my API key:

API Key: dn_live_YOUR_KEY_HERE
Base URL: https://dreamnet.ink

For ALL requests, include this header:
Authorization: Bearer dn_live_YOUR_KEY_HERE

Start by:
1. Getting context: GET /api/chatgpt-agent/context
2. Then chat with DreamNet: POST /api/chatgpt-agent/chat with message "Show me DreamNet status"
3. Use the suggested endpoints to get actual data

DreamNet has better Vercel integration than ChatGPT's built-in connector!
```

---

## 📡 New ChatGPT Agent Endpoints

### 1. Get Context
**GET** `/api/chatgpt-agent/context`

Returns all of DreamNet's capabilities and endpoints.

**Example:**
```bash
curl -H "Authorization: Bearer YOUR_API_KEY" \
  https://dreamnet.ink/api/chatgpt-agent/context
```

**Response:**
```json
{
  "success": true,
  "context": {
    "system": "DreamNet",
    "capabilities": {
      "deployment": { ... },
      "monitoring": { ... },
      "dreams": { ... },
      "wolfPack": { ... },
      "shield": { ... }
    }
  }
}
```

### 2. Chat with DreamNet
**POST** `/api/chatgpt-agent/chat`

Natural language interface - ChatGPT sends a message, DreamNet responds with actions.

**Body:**
```json
{
  "message": "Show me DreamNet status"
}
```

**Example:**
```bash
curl -X POST \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"message": "List all Vercel projects"}' \
  https://dreamnet.ink/api/chatgpt-agent/chat
```

**Response:**
```json
{
  "success": true,
  "message": "List all Vercel projects",
  "understood": true,
  "actions": [
    {
      "type": "vercel_list_projects",
      "endpoint": "GET /api/vercel/projects",
      "description": "List all Vercel projects"
    }
  ],
  "data": {
    "message": "Use GET /api/vercel/projects to see all projects"
  },
  "suggestions": [
    "Try: GET /api/vercel/projects to see all projects"
  ]
}
```

### 3. Execute Action
**POST** `/api/chatgpt-agent/execute`

Execute a specific action (for ChatGPT to call after understanding intent).

**Body:**
```json
{
  "action": "vercel_list_projects",
  "params": {}
}
```

### 4. Quick Start Guide
**GET** `/api/chatgpt-agent/quick-start`

Get a quick start guide for ChatGPT.

---

## 💬 Example Conversations

### Example 1: Check Status

**ChatGPT sends:**
```json
POST /api/chatgpt-agent/chat
{
  "message": "What's DreamNet's current status?"
}
```

**DreamNet responds:**
```json
{
  "actions": [
    {
      "type": "get_status",
      "endpoint": "GET /api/heartbeat"
    }
  ],
  "suggestions": ["Try: GET /api/heartbeat"]
}
```

**ChatGPT then calls:**
```bash
GET /api/heartbeat
```

### Example 2: Vercel Projects

**ChatGPT sends:**
```json
POST /api/chatgpt-agent/chat
{
  "message": "List all Vercel projects"
}
```

**DreamNet responds:**
```json
{
  "actions": [
    {
      "type": "vercel_list_projects",
      "endpoint": "GET /api/vercel/projects"
    }
  ],
  "suggestions": ["Try: GET /api/vercel/projects"]
}
```

**ChatGPT then calls:**
```bash
GET /api/vercel/projects
```

### Example 3: Vercel Cleanup

**ChatGPT sends:**
```json
POST /api/chatgpt-agent/chat
{
  "message": "Analyze Vercel projects for cleanup opportunities"
}
```

**DreamNet responds:**
```json
{
  "actions": [
    {
      "type": "vercel_analyze_cleanup",
      "endpoint": "GET /api/vercel/analyze"
    }
  ],
  "suggestions": ["Try: GET /api/vercel/analyze?targetDomain=dreamnet.ink"]
}
```

---

## 🎯 Supported Queries

### Vercel Management
- "List all Vercel projects"
- "Show me the dreamnet.ink project"
- "Analyze Vercel projects for cleanup"
- "Clean up duplicate projects"

### System Status
- "What's DreamNet's status?"
- "Show me system health"
- "How is DreamNet doing?"

### Shield Core
- "Show me Shield Core status"
- "What threats have been detected?"
- "Check for security threats"

### Wolf Pack
- "What funding opportunities are available?"
- "Show me Wolf Pack leads"
- "Discover new funding opportunities"

### Dreams
- "List all dreams"
- "Show me dream #123"
- "What dreams are trending?"

---

## 🔧 How ChatGPT Should Use This

### Step 1: Get Context
```bash
GET /api/chatgpt-agent/context
```

### Step 2: Chat with DreamNet
```bash
POST /api/chatgpt-agent/chat
{
  "message": "YOUR_NATURAL_LANGUAGE_QUERY"
}
```

### Step 3: Execute Actions
Use the endpoints suggested in the response to get actual data.

---

## 🚀 Advantages Over ChatGPT's Built-in Vercel Connector

1. **Direct API Access** - We're wired right into Vercel's API
2. **Better Context** - We understand DreamNet's specific needs
3. **Auto-Cleanup** - We can analyze and clean up duplicate projects
4. **Natural Language** - ChatGPT can talk to us naturally
5. **Integrated** - Works seamlessly with all DreamNet systems

---

## 📋 Full Workflow Example

**You to ChatGPT:**
```
Use my DreamNet API key (dn_live_YOUR_KEY) to:
1. Get context about DreamNet
2. Check DreamNet's status
3. List all Vercel projects
4. Analyze Vercel projects for cleanup
```

**ChatGPT should:**
1. Call `GET /api/chatgpt-agent/context`
2. Call `POST /api/chatgpt-agent/chat` with message "Show me DreamNet status"
3. Call `GET /api/heartbeat` (from suggested actions)
4. Call `POST /api/chatgpt-agent/chat` with message "List all Vercel projects"
5. Call `GET /api/vercel/projects` (from suggested actions)
6. Call `POST /api/chatgpt-agent/chat` with message "Analyze Vercel projects for cleanup"
7. Call `GET /api/vercel/analyze?targetDomain=dreamnet.ink` (from suggested actions)

---

## 🎉 Ready to Use!

ChatGPT Agent Mode can now:
- ✅ Talk to DreamNet naturally
- ✅ Get context about capabilities
- ✅ Execute actions automatically
- ✅ Manage Vercel deployments (better than built-in!)
- ✅ Monitor system status
- ✅ Query all DreamNet systems

**Start with:**
```
ChatGPT, use this DreamNet API key:
Key: dn_live_YOUR_KEY_HERE
Base URL: https://dreamnet.ink

Get context first, then chat with DreamNet naturally.
```

---

**You're all set!** ChatGPT can now communicate with DreamNet like a human! 🚀

