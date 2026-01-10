# 🔑 How to Get Your DreamNet API Key

## Quick Answer

**I don't generate API keys** - DreamNet's server generates them automatically when you connect your wallet!

## How API Keys Work

1. **Auto-Generated**: When you connect your wallet for the first time, DreamNet automatically creates a default API key
2. **Format**: `dn_live_<64 hex characters>` (e.g., `dn_live_a1b2c3d4e5f6...`)
3. **Shown Once**: The plaintext key is only shown once - you must save it immediately!
4. **Stored Securely**: Keys are hashed (SHA-256) before storage - plaintext is never stored

---

## 🚀 Method 1: Connect Your Wallet (Easiest)

### Step 1: Connect Wallet at dreamnet.ink

1. Go to https://dreamnet.ink
2. Click "Connect Wallet"
3. Sign the SIWE (Sign-In With Ethereum) message

### Step 2: Check the Auth Response

When you connect, the `/api/auth/verify` endpoint returns:

```json
{
  "token": "jwt-token",
  "walletAddress": "0x...",
  "apiKey": "dn_live_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2",
  "apiKeyInfo": {
    "id": "key-uuid",
    "keyPrefix": "dn_live_a1b2c3d",
    "name": "Default API Key"
  },
  "apiKeyWarning": "⚠️ Save this API key now! It will not be shown again."
}
```

**⚠️ IMPORTANT**: Copy the `apiKey` value immediately - it won't be shown again!

---

## 🔄 Method 2: Get Default Key (If Already Connected)

If you already connected your wallet but need your default key:

### Option A: Via Browser Console

1. Open https://dreamnet.ink
2. Open browser console (F12)
3. Check localStorage or sessionStorage for your JWT token
4. Use the token to call:

```javascript
fetch('https://dreamnet.ink/api/keys/default', {
  headers: {
    'Authorization': `Bearer YOUR_JWT_TOKEN`
  }
})
.then(r => r.json())
.then(data => {
  if (data.key) {
    console.log('Your API Key:', data.key);
    // ⚠️ Save this immediately!
  } else {
    console.log('You already have a key. Create a new one:', data);
  }
});
```

### Option B: Via cURL

```bash
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  https://dreamnet.ink/api/keys/default
```

**Note**: If you already have a default key, it won't show the plaintext. You'll need to create a new one.

---

## ➕ Method 3: Create a New API Key

If you need a new key (or lost your default one):

### Via API

```bash
curl -X POST https://dreamnet.ink/api/keys/create \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Cursor Bridge API Key",
    "description": "For DreamNet ↔ Cursor bridge integration",
    "permissions": ["read", "write"],
    "rateLimit": 1000
  }'
```

**Response**:
```json
{
  "success": true,
  "key": "dn_live_NEW_KEY_HERE",
  "keyInfo": { ... },
  "warning": "⚠️ Save this API key now! It will not be shown again."
}
```

---

## 📋 Method 4: List Your Keys

See all your API keys (without plaintext):

```bash
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  https://dreamnet.ink/api/keys
```

This shows:
- Key prefixes (e.g., `dn_live_a1b2c3d`)
- Names and descriptions
- Permissions and rate limits
- Last used timestamps
- Status (active/revoked/expired)

---

## ✅ Once You Have Your Key

### 1. Set Environment Variable

```bash
# .env file (local development)
DREAMNET_API_KEY=dn_live_your_actual_key_here
```

### 2. Test It

```bash
# Validate your key
curl -H "Authorization: Bearer dn_live_your_key" \
  https://dreamnet.ink/api/keys/validate
```

### 3. Use in Bridge

The DreamNet ↔ Cursor bridge will automatically use it:

```typescript
// packages/dreamnet-bridge/index.ts reads from:
process.env.DREAMNET_API_KEY
```

---

## 🔍 Check If You Already Have a Key

If you're not sure if you have a key:

1. **Check your browser** - Look for any saved API keys in notes/password manager
2. **Check environment variables** - Look for `DREAMNET_API_KEY` in your `.env` files
3. **List your keys** - Use Method 4 above to see all your keys
4. **Check auth response** - If you connected your wallet before, check browser console/network logs

---

## 🛡️ Security Best Practices

1. **Never commit keys to git** - Use `.env` files (gitignored)
2. **Save keys securely** - Use a password manager
3. **Rotate keys regularly** - Create new keys, revoke old ones
4. **Use different keys** - Separate keys for dev/staging/prod
5. **Set expiration dates** - For temporary access

---

## 🚨 Troubleshooting

### "I lost my API key"

**Solution**: Create a new one using Method 3 above. The old key will still work until you revoke it.

### "I can't see my default key"

**Solution**: Default keys are only shown once when created. Create a new key if you need the plaintext.

### "My key doesn't work"

**Possible reasons**:
- Key was revoked
- Key expired
- Wrong format (must start with `dn_live_`)
- Wrong header format (use `Authorization: Bearer <key>`)

**Solution**: 
1. Validate your key: `GET /api/keys/validate`
2. Check key status: `GET /api/keys`
3. Create a new key if needed

---

## 📝 Quick Reference

| Action | Endpoint | Auth Required |
|--------|----------|---------------|
| Get default key | `GET /api/keys/default` | Wallet JWT |
| Create new key | `POST /api/keys/create` | Wallet JWT |
| List all keys | `GET /api/keys` | Wallet JWT |
| Validate key | `GET /api/keys/validate` | API Key |
| Revoke key | `DELETE /api/keys/:keyId` | Wallet JWT |

---

## 🎯 Next Steps

Once you have your API key:

1. ✅ Set `DREAMNET_API_KEY` in your environment
2. ✅ Test the bridge: `pnpm tsx scripts/dreamnet-status.ts`
3. ✅ Use it in your code via `@dreamnet/dreamnet-bridge`

---

**Remember**: API keys are generated by DreamNet's server when you connect your wallet. I (the AI assistant) don't generate them - I just help you understand how to get them! 🔑

