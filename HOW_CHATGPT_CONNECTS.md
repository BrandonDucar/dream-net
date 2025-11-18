# 🔌 How ChatGPT Connects to DreamNet

## ✅ You're Right - The Routes Handle Everything!

The ChatGPT agent routes we created (`/api/chatgpt-agent/*`) **DO handle everything**. Here's how it works:

## 🎯 Two Ways to Connect

### Option 1: ChatGPT Connectors (Recommended - Auto-Discovery)

**Setup:**
1. Get your API key (see below)
2. In ChatGPT → Settings → Connectors → Add:
   - **Name:** `DreamNet API`
   - **Base URL:** `https://dreamnet.ink`
   - **Auth Type:** `Bearer Token`
   - **Token:** `dn_live_YOUR_KEY_HERE`

**What Happens:**
- ChatGPT automatically discovers endpoints via `/api/chatgpt-agent/context`
- ChatGPT can use `/api/chatgpt-agent/chat` for natural language
- **No manual action setup needed!** ChatGPT discovers everything automatically

### Option 2: System Prompt (If Connectors Don't Work)

Only use the system prompt (`CHATGPT_AGENT_SYSTEM_PROMPT.md`) if:
- ChatGPT Connectors aren't working
- You want to give ChatGPT explicit instructions
- You're using ChatGPT in a way that doesn't support Connectors

---

## 🔑 Getting Your API Key

### Method 1: Check Auth Response (If You Just Connected Wallet)

When you connect your wallet, check the `/api/auth/verify` response. If you're new, it includes:
```json
{
  "apiKey": "dn_live_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2",
  "apiKeyWarning": "⚠️ Save this API key now! It will not be shown again."
}
```

### Method 2: Get Default Key (If You Already Have One)

**Endpoint:** `GET https://dreamnet.ink/api/keys/default`

**Auth:** Your wallet JWT token (from `/api/auth/verify`)

**cURL:**
```bash
curl -H "Authorization: Bearer YOUR_WALLET_JWT_TOKEN" \
  https://dreamnet.ink/api/keys/default
```

**Note:** If you already have a key, the plaintext won't be shown. You'll need to create a new one.

### Method 3: Create New Key

**Endpoint:** `POST https://dreamnet.ink/api/keys/create`

**Auth:** Your wallet JWT token

**Body:**
```json
{
  "name": "ChatGPT Connector",
  "description": "API key for ChatGPT Agent Mode"
}
```

**cURL:**
```bash
curl -X POST \
  -H "Authorization: Bearer YOUR_WALLET_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name": "ChatGPT Connector", "description": "For ChatGPT Agent Mode"}' \
  https://dreamnet.ink/api/keys/create
```

**Response:**
```json
{
  "success": true,
  "key": "dn_live_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2",
  "keyInfo": { ... },
  "warning": "⚠️ Save this API key now! It will not be shown again."
}
```

---

## 🚀 How It All Works Together

### The Flow:

1. **You configure ChatGPT Connectors** with base URL + API key
2. **ChatGPT calls `/api/chatgpt-agent/context`** → Gets all capabilities
3. **You ask ChatGPT:** "Show me DreamNet status"
4. **ChatGPT calls `/api/chatgpt-agent/chat`** → Gets suggested endpoints
5. **ChatGPT calls `/api/heartbeat`** → Gets actual data
6. **ChatGPT reports results** → You see the status

### The Routes Handle:
- ✅ Understanding natural language queries
- ✅ Suggesting the right endpoints
- ✅ Providing context about capabilities
- ✅ Executing actions

### ChatGPT Connectors Handle:
- ✅ Authentication (Bearer token)
- ✅ Base URL configuration
- ✅ Auto-discovery of endpoints

### You Don't Need:
- ❌ Manual action configuration
- ❌ System prompt (unless Connectors don't work)
- ❌ Custom code

---

## 🎯 Quick Setup

1. **Get API Key:**
   ```bash
   # Connect wallet, then:
   curl -H "Authorization: Bearer YOUR_WALLET_JWT" \
     https://dreamnet.ink/api/keys/default
   ```

2. **Configure ChatGPT Connectors:**
   - Base URL: `https://dreamnet.ink`
   - Auth: Bearer Token
   - Token: `dn_live_YOUR_KEY`

3. **Done!** ChatGPT will auto-discover everything via `/api/chatgpt-agent/context`

---

## 💡 Why Two Options?

- **ChatGPT Connectors** = Auto-discovery, no manual setup
- **System Prompt** = Fallback if Connectors don't work, or for explicit instructions

**You only need ONE of them!** Connectors is easier, so use that first.

---

**TL;DR:** Configure ChatGPT Connectors with your API key → ChatGPT auto-discovers everything → No manual setup needed! 🎉





