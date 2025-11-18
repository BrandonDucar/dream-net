# ChatGPT Agent Mode ↔ DreamNet Integration

**YES!** ChatGPT Agent Mode can now communicate directly with DreamNet using API keys! 🎉

## 🚀 Quick Setup

### Step 1: Get Your API Key

When you connect your wallet to DreamNet, you automatically get an API key. If you already connected, get it:

**Endpoint:** `GET https://dreamnet.ink/api/keys/default`

**Auth:** Your wallet JWT token (from `/api/auth/verify`)

### Step 2: Give ChatGPT Your API Key

**Copy this prompt and paste it into ChatGPT:**

```
I want you to interact with DreamNet API. Here's my API key:

API Key: dn_live_YOUR_KEY_HERE
Base URL: https://dreamnet.ink

For ALL requests to DreamNet, include this header:
Authorization: Bearer dn_live_YOUR_KEY_HERE

Or alternatively:
X-API-Key: dn_live_YOUR_KEY_HERE

Start by validating the key, then check DreamNet's status.
```

## 📡 Available Endpoints for ChatGPT

### ✅ Public/Read Endpoints (No Auth Required)
- `GET /api/heartbeat` - **DreamNet system status** (perfect starting point!)
- `GET /api/public/status` - Public status
- `GET /api/garden` - Public garden feed
- `GET /api/garden-feed` - Garden feed with metadata

### 🔐 API Key Required Endpoints

#### System Status
- `GET /api/keys/validate` - Validate your API key
- `GET /api/heartbeat` - Full system status
- `GET /api/system/state` - System state
- `GET /api/system/spider` - Spider Web status
- `GET /api/system/shields` - Shield Core status
- `GET /api/system/control` - Control Plane status

#### Dreams
- `GET /api/dreams` - List dreams
- `GET /api/dreams/:id` - Get specific dream
- `POST /api/dreams` - Create dream (requires write permission)

#### Wolf Pack (Funding)
- `GET /api/wolf-pack/status` - Wolf Pack status
- `GET /api/wolf-pack/leads` - Hot leads

#### Shield Core
- `GET /api/shield/status` - Shield status
- `GET /api/shield/threats` - Recent threats

#### Spider Web
- `GET /api/spider-web/threads` - Spider Web threads

## 💬 Example ChatGPT Prompts

### Basic Status Check
```
Use my DreamNet API key (dn_live_YOUR_KEY) to check DreamNet's status:
1. Validate the key
2. Get heartbeat status
3. Tell me what systems are running
```

### Monitor DreamNet
```
Monitor DreamNet for me:
- Check heartbeat
- Check Shield Core threats
- Check Wolf Pack leads
- Check Spider Web threads
- Give me a full status report
```

### Create a Dream
```
Use my DreamNet API key to create a new dream:
- Name: "AI Agent Integration"
- Description: "A dream about ChatGPT communicating with DreamNet"
- Tags: ["ai", "integration", "chatgpt"]
```

### Query Dreams
```
Use my DreamNet API key to:
1. List all dreams
2. Show me the top 5 dreams by score
3. Tell me what's trending
```

## 🔧 How ChatGPT Should Make Requests

ChatGPT Agent Mode has web access, so it can make HTTP requests. Here's the format:

### JavaScript/Fetch Example
```javascript
const response = await fetch('https://dreamnet.ink/api/heartbeat', {
  headers: {
    'Authorization': 'Bearer dn_live_YOUR_KEY_HERE'
  }
});
const data = await response.json();
```

### cURL Example (ChatGPT can use this)
```bash
curl -H "Authorization: Bearer dn_live_YOUR_KEY_HERE" \
  https://dreamnet.ink/api/heartbeat
```

### Python Example
```python
import requests

headers = {
    'Authorization': 'Bearer dn_live_YOUR_KEY_HERE'
}

response = requests.get(
    'https://dreamnet.ink/api/heartbeat',
    headers=headers
)
```

## 🎯 What ChatGPT Can Do

✅ **Read System Status**
- Check if DreamNet is running
- Monitor all subsystems
- View active alerts

✅ **Query Dreams**
- List all dreams
- Get dream details
- Search dreams

✅ **Monitor Operations**
- Check Wolf Pack leads
- View Shield Core threats
- Read Spider Web threads

✅ **Create Content** (with write permission)
- Create new dreams
- Update dreams
- Interact with DreamNet

## 🚫 Limitations

- Some endpoints require specific permissions (`read`, `write`, `admin`)
- Rate limits: 1000 requests/hour (default)
- Some endpoints require Dream State passport tiers

## 📋 Full Example Conversation

**You:**
```
ChatGPT, I have a DreamNet API key: dn_live_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2

Use this to check DreamNet's status and tell me what's happening.
```

**ChatGPT (should):**
```
I'll check DreamNet's status using your API key.

1. First, validating your API key...
   GET https://dreamnet.ink/api/keys/validate
   Headers: Authorization: Bearer dn_live_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2
   
   ✅ Key validated successfully!

2. Getting DreamNet heartbeat status...
   GET https://dreamnet.ink/api/heartbeat
   
   [Shows full system status]
```

## 🔐 Authentication Format

ChatGPT needs to include the API key in **every request**:

**Method 1: Authorization Header (Recommended)**
```
Authorization: Bearer dn_live_YOUR_KEY_HERE
```

**Method 2: X-API-Key Header**
```
X-API-Key: dn_live_YOUR_KEY_HERE
```

## 🎉 Ready to Use!

ChatGPT Agent Mode can now:
- ✅ Authenticate with DreamNet
- ✅ Read system status
- ✅ Query dreams
- ✅ Monitor operations
- ✅ Create content (with permissions)

**Start with this prompt:**
```
ChatGPT, use this DreamNet API key to check the system:
Key: dn_live_YOUR_KEY_HERE
Base URL: https://dreamnet.ink

Check the heartbeat endpoint and tell me what's running.
```

## 📚 API Documentation

Full API docs: See `DREAMNET_API_KEYS.md`

Key endpoints:
- `/api/heartbeat` - System status
- `/api/keys/validate` - Validate key
- `/api/dreams` - Dreams CRUD
- `/api/wolf-pack/status` - Wolf Pack status
- `/api/shield/status` - Shield Core status

## 💡 Pro Tips

1. **Start Simple**: Begin with `/api/heartbeat` to verify connectivity
2. **Validate First**: Always validate your key with `/api/keys/validate`
3. **Check Permissions**: Some endpoints need specific permissions
4. **Handle Errors**: 401 = invalid key, 403 = no permission, 429 = rate limit

---

**You're all set!** ChatGPT can now communicate directly with DreamNet! 🚀
