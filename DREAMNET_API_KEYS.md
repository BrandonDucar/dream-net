# DreamNet API Keys

DreamNet automatically generates API keys for users when they connect their wallet. Users can also create additional keys with custom permissions and rate limits.

## 🔑 Key Format

API keys follow the format: `dn_live_<64 hex characters>`

Example: `dn_live_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2`

## 🚀 Quick Start

### Automatic Key Generation

**When you connect your wallet for the first time**, DreamNet automatically generates a default API key for you!

**Endpoint:** `POST /api/auth/verify` (wallet authentication)

**Response includes:**
```json
{
  "token": "jwt-token",
  "walletAddress": "0x...",
  "isAdmin": false,
  "apiKey": "dn_live_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2",
  "apiKeyInfo": {
    "id": "key-uuid",
    "keyPrefix": "dn_live_a1b2c3d",
    "name": "Default API Key"
  },
  "apiKeyWarning": "⚠️ Save this API key now! It will not be shown again."
}
```

**⚠️ Important:** The plaintext key is only shown once! Save it immediately.

### Get Your Default Key

If you already connected your wallet but need your default key:

**Endpoint:** `GET /api/keys/default`

**Authentication:** Wallet (SIWE)

**Response:**
```json
{
  "success": true,
  "key": "dn_live_...",  // Only if new key created
  "keyInfo": {
    "id": "key-uuid",
    "keyPrefix": "dn_live_a1b2c3d",
    "name": "Default API Key",
    "permissions": ["read", "write"],
    "rateLimit": 1000
  }
}
```

### Use Your API Key

Include your API key in requests using one of these methods:

**Option 1: Authorization Header (Recommended)**
```bash
curl -H "Authorization: Bearer dn_live_..." https://dreamnet.ink/api/...
```

**Option 2: X-API-Key Header**
```bash
curl -H "X-API-Key: dn_live_..." https://dreamnet.ink/api/...
```

## 📋 API Endpoints

### Auto-Generated on Wallet Connect
- **POST** `/api/auth/verify` - Wallet authentication (auto-generates default key)

### Get Default Key
- **GET** `/api/keys/default` - Get or create default API key

### Create Additional Key
- **POST** `/api/keys/create` - Create custom API key
- **Body:** `{ name, description?, permissions?, rateLimit?, expiresInDays? }`

### List Your Keys
- **GET** `/api/keys` - List all your API keys

### Revoke a Key
- **DELETE** `/api/keys/:keyId` - Revoke an API key

### Validate Key
- **GET** `/api/keys/validate` - Validate your API key

## 🔐 Security Features

### Key Storage
- **Never stored in plaintext** - Keys are hashed using SHA-256 before storage
- **Only shown once** - Plaintext key is only returned when created
- **Key prefix** - First 8 characters shown for identification (`dn_live_a1b2c3d`)

### Validation
- Keys are validated on every request
- Expired keys are automatically rejected
- Revoked keys cannot be used
- Last used timestamp is updated automatically

### Permissions
API keys support permission-based access control:

```json
{
  "permissions": ["read", "write", "admin", "*"]
}
```

- `read` - Read-only access
- `write` - Read and write access
- `admin` - Administrative access
- `*` - All permissions (wildcard)

### Rate Limiting
Each key has a configurable rate limit (default: 1000 requests/hour).

## 🎯 How It Works

1. **First Wallet Connection:**
   - User connects wallet via SIWE
   - DreamNet automatically generates a default API key
   - Key is returned in the auth response (only shown once!)

2. **Subsequent Connections:**
   - User gets JWT token for session
   - Default API key already exists (not shown again)
   - User can create additional keys via `/api/keys/create`

3. **Using API Keys:**
   - Include key in `Authorization: Bearer` header
   - DreamNet validates key on every request
   - Permissions and rate limits are enforced

## 🛡️ Using API Keys in Your Code

### JavaScript/TypeScript
```typescript
const apiKey = "dn_live_...";

// Using fetch
const response = await fetch("https://dreamnet.ink/api/dreams", {
  headers: {
    "Authorization": `Bearer ${apiKey}`,
  },
});

// Using axios
import axios from "axios";
const response = await axios.get("https://dreamnet.ink/api/dreams", {
  headers: {
    "Authorization": `Bearer ${apiKey}`,
  },
});
```

### cURL
```bash
curl -H "Authorization: Bearer dn_live_..." \
  https://dreamnet.ink/api/dreams
```

### Python
```python
import requests

headers = {
    "Authorization": f"Bearer dn_live_..."
}

response = requests.get(
    "https://dreamnet.ink/api/dreams",
    headers=headers
)
```

## 🔄 Migration

To add the API keys table to your database:

```bash
pnpm db:push
```

This will create the `dreamnet_api_keys` table with all required fields.

## 🎯 Integration with Dream State

API keys can be linked to Dream State passports for enhanced permissions:

- **Citizen** tier: Basic API access
- **Builder** tier: Enhanced API access
- **Architect** tier: Full API access

## 📊 Rate Limiting

Rate limits are enforced per API key:
- Default: 1000 requests/hour
- Configurable per key
- Headers returned:
  - `X-RateLimit-Limit`: Maximum requests per hour
  - `X-RateLimit-Remaining`: Remaining requests
  - `X-RateLimit-Reset`: Reset timestamp

## 🚨 Best Practices

1. **Never commit keys to version control**
2. **Use environment variables** for key storage
3. **Rotate keys regularly** (create new, revoke old)
4. **Use different keys** for different environments (dev/staging/prod)
5. **Set expiration dates** for temporary access
6. **Monitor key usage** via the `/api/keys` endpoint

## 🔍 Troubleshooting

### "api_key_required"
- Include API key in `Authorization: Bearer <key>` or `X-API-Key` header

### "invalid_api_key"
- Key may be revoked or expired
- Check key format (must start with `dn_live_`)
- Verify key hasn't been revoked

### "insufficient_permissions"
- Key doesn't have required permission
- Check key permissions via `/api/keys/validate`

## 📝 Example: Full Workflow

```bash
# 1. Connect wallet (auto-generates default API key)
curl -X POST https://dreamnet.ink/api/auth/verify \
  -H "Content-Type: application/json" \
  -d '{
    "message": "...",
    "signature": "..."
  }'

# Response includes apiKey - SAVE IT!

# 2. Use key to access API
curl -H "Authorization: Bearer dn_live_..." \
  https://dreamnet.ink/api/dreams

# 3. Get default key if needed
curl -H "Authorization: Bearer <wallet-jwt>" \
  https://dreamnet.ink/api/keys/default

# 4. Create additional key
curl -X POST https://dreamnet.ink/api/keys/create \
  -H "Authorization: Bearer <wallet-jwt>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Production API Key",
    "permissions": ["read", "write"],
    "rateLimit": 5000
  }'

# 5. List all keys
curl -H "Authorization: Bearer <wallet-jwt>" \
  https://dreamnet.ink/api/keys

# 6. Revoke key when done
curl -X DELETE \
  -H "Authorization: Bearer <wallet-jwt>" \
  https://dreamnet.ink/api/keys/<keyId>
```

## 🎉 You're Ready!

Every user gets an API key automatically when they connect their wallet. Start building! 🚀
