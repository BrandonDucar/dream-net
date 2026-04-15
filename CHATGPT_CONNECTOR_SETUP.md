# 🔌 ChatGPT Connector Setup for DreamNet

## 📡 Connection Details

### Base URL
```
https://dreamnet.ink
```

### Authentication
**Bearer Token** (API Key format: `dn_live_...`)

---

## 🔑 Step 1: Get Your API Key

You have **3 options** to get your API key:

### Option A: Check Your Auth Response (If You Just Logged In)
When you connect your wallet, the `/api/auth/verify` endpoint returns your API key if it's new:
```json
{
  "token": "...",
  "walletAddress": "0x...",
  "apiKey": "dn_live_...",
  "apiKeyWarning": "⚠️ Save this API key now! It will not be shown again."
}
```

### Option B: Get Default API Key (If You Already Have One)
**Endpoint:** `GET https://dreamnet.ink/api/keys/default`

**Auth:** Your wallet JWT token (from `/api/auth/verify`)

**cURL:**
```bash
curl -H "Authorization: Bearer YOUR_WALLET_JWT_TOKEN" \
  https://dreamnet.ink/api/keys/default
```

**Response:**
```json
{
  "success": true,
  "keyInfo": {
    "id": "...",
    "keyPrefix": "dn_live_...",
    "name": "Default API Key",
    ...
  },
  "message": "You already have a default API key. Use /api/keys/create to create additional keys."
}
```

**Note:** If you already have a key, the plaintext won't be shown. You'll need to create a new one.

### Option C: Create a New API Key
**Endpoint:** `POST https://dreamnet.ink/api/keys/create`

**Auth:** Your wallet JWT token

**Body:**
```json
{
  "name": "ChatGPT Connector",
  "description": "API key for ChatGPT Agent Mode integration"
}
```

**cURL:**
```bash
curl -X POST \
  -H "Authorization: Bearer YOUR_WALLET_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name": "ChatGPT Connector", "description": "API key for ChatGPT Agent Mode"}' \
  https://dreamnet.ink/api/keys/create
```

**Response:**
```json
{
  "success": true,
  "key": "dn_live_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2",
  "keyInfo": {
    "id": "...",
    "keyPrefix": "dn_live_...",
    ...
  },
  "warning": "⚠️ Save this API key now! It will not be shown again."
}
```

---

## 🔌 Step 2: Add to ChatGPT Connectors

### In ChatGPT Connectors Settings:

1. **Name:** `DreamNet API`
2. **Base URL:** `https://dreamnet.ink`
3. **Authentication Type:** `Bearer Token`
4. **Bearer Token:** `dn_live_YOUR_ACTUAL_KEY_HERE`

### Example Configuration:
```
Name: DreamNet API
Base URL: https://dreamnet.ink
Auth: Bearer Token
Token: dn_live_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2
```

---

## ✅ Step 3: Test the Connection

Once configured, ChatGPT can test it with:

**Test Endpoint:**
```
GET https://dreamnet.ink/api/keys/validate
Headers: Authorization: Bearer dn_live_YOUR_KEY
```

**Or check heartbeat:**
```
GET https://dreamnet.ink/api/heartbeat
Headers: Authorization: Bearer dn_live_YOUR_KEY
```

---

## 📋 Quick Reference

### Base URL
```
https://dreamnet.ink
```

### Auth Header Format
```
Authorization: Bearer dn_live_YOUR_KEY_HERE
```

### Alternative Header Format
```
X-API-Key: dn_live_YOUR_KEY_HERE
```

### Key Format
- Starts with: `dn_live_`
- Length: ~64 characters total
- Example: `dn_live_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2`

---

## 🚀 What ChatGPT Can Do

Once connected, ChatGPT can:
- ✅ Check DreamNet system status (`/api/heartbeat`)
- ✅ Validate API key (`/api/keys/validate`)
- ✅ Query dreams (`/api/dreams`)
- ✅ Monitor Wolf Pack (`/api/wolf-pack/status`)
- ✅ Check Shield Core (`/api/shield/status`)
- ✅ View Spider Web threads (`/api/spider-web/threads`)
- ✅ Use natural language interface (`/api/chatgpt-agent/chat`)
- ✅ Manage Vercel deployments (`/api/vercel/*`)

---

## 💡 Pro Tips

1. **Save Your Key:** API keys are only shown once when created. Save it immediately!
2. **Use Default Key:** If you already have a default key, you can use it, but you won't see the plaintext again.
3. **Create New Key:** If you need to see the key again, create a new one specifically for ChatGPT.
4. **Test First:** Always test with `/api/keys/validate` before using in ChatGPT.

---

## 🔒 Security Notes

- API keys are hashed in the database (never stored in plaintext)
- Keys can be revoked at any time
- Rate limits: 1000 requests/hour (default)
- Some endpoints require specific permissions

---

**Ready to connect!** 🎉

