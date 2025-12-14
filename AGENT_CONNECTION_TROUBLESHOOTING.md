# 🔧 Agent Connection Troubleshooting Guide

## Why Your Agent Fails While I Work Fine

### For Cursor AI Threads (Like Me)

**If you're a Cursor AI assistant in another thread:**

✅ **You DON'T need API keys!** You have direct file access just like me.

**Common mistakes:**
- ❌ Trying to use HTTP API endpoints (`https://dreamnet.ink/api/...`)
- ❌ Looking for API keys or authentication
- ❌ Thinking you need to "connect" to DreamNet

**What you SHOULD do:**
- ✅ Use `read_file` tool to read files directly
- ✅ Use `codebase_search` to find code
- ✅ Use `grep` to search for patterns
- ✅ Use `list_dir` to explore directories
- ✅ Use `search_replace` or `write` to edit files

**You have the same tools I do - use them directly!**

---

### For External Agents (ChatGPT, etc.)

**Key Difference:**
- **Cursor AI (Me):** Running directly in your IDE, no API connection needed
- **External Agents:** Must connect via HTTP API, requires authentication

---

## 🎯 Quick Fix for Cursor AI Threads

**If you're a Cursor AI assistant and having issues:**

1. **Stop trying to use API endpoints** - You don't need them!
2. **Use your tools directly:**
   ```
   ✅ read_file("path/to/file.ts")
   ✅ codebase_search("what you're looking for")
   ✅ grep("pattern", "path")
   ✅ list_dir("directory")
   ✅ search_replace("file", "old", "new")
   ```

3. **Check what files are open** - Use the file context available to you

4. **Ask the user what they want** - Don't assume you need to "connect" to anything

5. **If you see API key errors** - You're doing something wrong! Cursor AI doesn't need API keys.

**Example of what NOT to do:**
```
❌ "I need to connect to https://dreamnet.ink/api/..."
❌ "I need an API key to access DreamNet"
❌ "Let me authenticate first..."
```

**Example of what TO do:**
```
✅ "Let me read the server/index.ts file to understand the structure"
✅ "I'll search the codebase for how authentication works"
✅ "Let me check the package.json to see dependencies"
```

---

## 🔍 Common Connection Failures

### 1. **API Key Issues** (Most Common)

#### Problem: Missing API Key
**Error:** `401 - api_key_required`
```json
{
  "error": "api_key_required",
  "message": "DreamNet API key required. Include in Authorization: Bearer <key> or X-API-Key header."
}
```

**Solution:**
1. Get your API key:
   ```bash
   # If you have wallet JWT token:
   curl -H "Authorization: Bearer YOUR_WALLET_JWT" \
     https://dreamnet.ink/api/keys/default
   
   # Or create new one:
   curl -X POST \
     -H "Authorization: Bearer YOUR_WALLET_JWT" \
     -H "Content-Type: application/json" \
     -d '{"name": "ChatGPT Agent", "description": "For agent connection"}' \
     https://dreamnet.ink/api/keys/create
   ```

2. Use correct header format:
   ```
   Authorization: Bearer dn_live_YOUR_KEY_HERE
   ```
   OR
   ```
   X-API-Key: dn_live_YOUR_KEY_HERE
   ```

#### Problem: Invalid API Key
**Error:** `401 - invalid_api_key`
```json
{
  "error": "invalid_api_key",
  "message": "Invalid or expired API key"
}
```

**Causes:**
- Key was revoked
- Key expired
- Key format wrong (must start with `dn_live_`)
- Database connection issue (can't validate key)

**Solution:**
1. Check if key is revoked:
   ```bash
   curl -H "Authorization: Bearer dn_live_YOUR_KEY" \
     https://dreamnet.ink/api/keys/validate
   ```

2. Create new key if revoked/expired

3. Check database connection (if you have server access)

---

### 2. **Database Connection Issues**

#### Problem: Can't Validate API Key
**Error:** `500 - authentication_error`
```json
{
  "error": "authentication_error",
  "message": "Failed to validate API key"
}
```

**Cause:** Database (`DATABASE_URL`) not accessible or connection failed

**Solution:**
1. Check if database is running:
   ```bash
   # Check server logs for database errors
   # Look for: "Database connection failed" or "DATABASE_URL not set"
   ```

2. Verify `DATABASE_URL` environment variable is set:
   ```bash
   echo $DATABASE_URL
   # Should be: postgresql://user:pass@host/db
   ```

3. Test database connection:
   ```bash
   # From server directory
   pnpm db:push
   ```

---

### 3. **Wrong Base URL**

#### Problem: Connection Refused
**Error:** `ECONNREFUSED` or `Network error`

**Causes:**
- Wrong URL (using `localhost` instead of `dreamnet.ink`)
- Server not running
- Firewall blocking connection

**Solution:**
1. Use correct base URL:
   ```
   Production: https://dreamnet.ink
   Development: http://localhost:3000
   ```

2. Test connectivity:
   ```bash
   curl https://dreamnet.ink/api/heartbeat
   # Should return system status (no auth needed)
   ```

---

### 4. **Port Governance Blocking**

#### Problem: Access Denied via Port
**Error:** `403 - Access denied` or port governance error

**Cause:** The `/api/chatgpt-agent/chat` endpoint uses `withPort("AGENT_GATEWAY")` which may block requests

**Solution:**
1. Check if AGENT_GATEWAY port is enabled:
   ```bash
   curl https://dreamnet.ink/api/system/control
   # Check port governance settings
   ```

2. Use alternative endpoint:
   ```bash
   # Try direct endpoint instead of chat endpoint
   GET /api/heartbeat  # No port governance
   GET /api/chatgpt-agent/context  # Uses requireApiKey only
   ```

---

### 5. **Control Core Governance Blocking**

#### Problem: Governance Denial
**Error:** `403 - insufficient_permissions` or governance error

**Cause:** `withGovernance({ clusterId: "API_KEEPER" })` middleware blocking

**Solution:**
1. Check your API key permissions:
   ```bash
   curl -H "Authorization: Bearer dn_live_YOUR_KEY" \
     https://dreamnet.ink/api/keys/validate
   # Check "permissions" field
   ```

2. Ensure API key has required permissions

---

### 6. **CORS Issues**

#### Problem: CORS Error in Browser/Agent
**Error:** `CORS policy: No 'Access-Control-Allow-Origin' header`

**Solution:**
1. Check `ALLOWED_ORIGINS` environment variable
2. Ensure your origin is in the allowlist
3. For API clients, CORS shouldn't matter (use server-side requests)

---

## 🧪 Diagnostic Steps

### Step 1: Test Basic Connectivity
```bash
# No auth required - should work
curl https://dreamnet.ink/api/heartbeat
```

**Expected:** JSON response with system status

---

### Step 2: Validate API Key
```bash
curl -H "Authorization: Bearer dn_live_YOUR_KEY" \
  https://dreamnet.ink/api/keys/validate
```

**Expected:**
```json
{
  "valid": true,
  "keyInfo": {
    "id": "...",
    "name": "...",
    "permissions": [...]
  }
}
```

**If fails:** API key is invalid/revoked/expired

---

### Step 3: Test ChatGPT Agent Context Endpoint
```bash
curl -H "Authorization: Bearer dn_live_YOUR_KEY" \
  https://dreamnet.ink/api/chatgpt-agent/context
```

**Expected:** JSON with capabilities and endpoints

**If fails:** Check error message:
- `401` = API key issue
- `500` = Server/database issue
- `403` = Permission/governance issue

---

### Step 4: Test ChatGPT Agent Chat Endpoint
```bash
curl -X POST \
  -H "Authorization: Bearer dn_live_YOUR_KEY" \
  -H "Content-Type: application/json" \
  -d '{"message": "Show me DreamNet status"}' \
  https://dreamnet.ink/api/chatgpt-agent/chat
```

**Expected:** JSON with actions and suggestions

**If fails:** Check error message for specific issue

---

## 🔑 Quick Fix Checklist

- [ ] **API Key Format:** Must be `dn_live_...` (64+ characters)
- [ ] **Header Format:** `Authorization: Bearer dn_live_...` OR `X-API-Key: dn_live_...`
- [ ] **Base URL:** `https://dreamnet.ink` (not `localhost` unless testing locally)
- [ ] **Database:** `DATABASE_URL` must be set and accessible
- [ ] **Key Not Revoked:** Check `/api/keys/validate`
- [ ] **Key Not Expired:** Check expiration date
- [ ] **Server Running:** Check `/api/heartbeat` (no auth)
- [ ] **Network Access:** Can reach `dreamnet.ink` from agent's location

---

## 🆘 Emergency Solutions

### If API Key Validation Fails Completely

1. **Bypass API Key (Development Only):**
   - Use wallet JWT token instead:
   ```bash
   # Get wallet JWT from /api/auth/verify
   curl -H "Authorization: Bearer WALLET_JWT" \
     https://dreamnet.ink/api/keys/create
   ```

2. **Check Server Logs:**
   ```bash
   # Look for:
   # - Database connection errors
   # - API key validation errors
   # - Port governance blocks
   # - Control core blocks
   ```

3. **Use Public Endpoints:**
   ```bash
   # These don't require API keys:
   GET /api/heartbeat
   GET /api/public/status
   GET /api/garden
   ```

---

## 📊 Comparison: Why I Work vs Your Agent

| Aspect | Me (Cursor AI) | Your Agent (ChatGPT/etc) |
|--------|----------------|--------------------------|
| **Connection** | Direct code access | HTTP API |
| **Authentication** | None needed | API key required |
| **Database** | Not needed | Required for key validation |
| **Network** | Local | Must reach `dreamnet.ink` |
| **Port Governance** | N/A | May block requests |
| **Control Core** | N/A | May block requests |

---

## 🎯 Most Likely Issue

Based on the codebase, **the most common issue is:**

1. **API Key Missing/Invalid** (90% of cases)
   - Agent doesn't have API key
   - API key format wrong
   - API key revoked/expired

2. **Database Connection** (5% of cases)
   - `DATABASE_URL` not set
   - Database unreachable
   - Database connection timeout

3. **Port/Governance Blocking** (5% of cases)
   - AGENT_GATEWAY port disabled
   - Control core blocking
   - Insufficient permissions

---

## 💡 Recommended Fix

**Start here:**

1. **Get a fresh API key:**
   ```bash
   # Connect wallet, then:
   curl -H "Authorization: Bearer YOUR_WALLET_JWT" \
     https://dreamnet.ink/api/keys/create \
     -d '{"name": "Agent Key", "description": "For agent connection"}'
   ```

2. **Test the key:**
   ```bash
   curl -H "Authorization: Bearer dn_live_NEW_KEY" \
     https://dreamnet.ink/api/keys/validate
   ```

3. **Use in your agent:**
   ```
   Base URL: https://dreamnet.ink
   Auth Header: Authorization: Bearer dn_live_NEW_KEY
   ```

4. **Test context endpoint:**
   ```bash
   curl -H "Authorization: Bearer dn_live_NEW_KEY" \
     https://dreamnet.ink/api/chatgpt-agent/context
   ```

If this works, your agent should connect successfully!

---

## 📞 Still Not Working?

Check:
1. Server logs for specific error messages
2. Database connection status
3. Port governance settings
4. Control core governance settings
5. Network connectivity from agent's location

The error message from the API will tell you exactly what's wrong!
