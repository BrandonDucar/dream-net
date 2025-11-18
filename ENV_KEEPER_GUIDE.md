# Env Keeper - Zero-Touch Environment Variable Management

**Never manually manage environment variables again!** Env Keeper auto-discovers, stores, and syncs all your environment variables from one place.

## 🎯 The Problem

You have environment variables scattered across:
- Vercel Secrets
- AWS Secrets Manager
- GitHub Secrets
- Local `.env` files
- Process environment
- And more...

**Result:** Chaos, duplication, and manual management hell.

## ✅ The Solution: Env Keeper

**One system to rule them all:**
- ✅ Auto-discovers from all sources
- ✅ Secure encrypted storage
- ✅ Unified API/UI
- ✅ Auto-syncs across environments
- ✅ Generate `.env` files on demand
- ✅ Export/import for backup

---

## 🚀 Quick Start

### 1. Initialize Env Keeper

Env Keeper auto-initializes on server startup, but you can also:

```bash
pnpm env-keeper:sync
```

### 2. View Your Environment Variables

**API:**
```bash
GET /api/env-keeper/list
Headers: Authorization: Bearer <wallet-jwt>
```

**Response:**
```json
{
  "success": true,
  "variables": [
    {
      "id": "env_openai_api_key",
      "key": "OPENAI_API_KEY",
      "value": "[ENCRYPTED]",
      "category": "api_keys",
      "isSecret": true,
      "description": "OpenAI API key for GPT-4o",
      "environments": ["local", "development", "staging", "production"]
    }
  ],
  "count": 15
}
```

### 3. Set Environment Variable

**API:**
```bash
POST /api/env-keeper/set
Headers: Authorization: Bearer <admin-jwt>
Body: {
  "key": "OPENAI_API_KEY",
  "value": "sk-...",
  "category": "api_keys",
  "isSecret": true,
  "description": "OpenAI API key",
  "environments": ["production"]
}
```

### 4. Generate .env File

**API:**
```bash
GET /api/env-keeper/generate-env?environment=production
Headers: Authorization: Bearer <wallet-jwt>
```

**Or CLI:**
```bash
pnpm env-keeper:generate
```

---

## 📋 API Endpoints

### Status
- `GET /api/env-keeper/status` - Get Env Keeper status

### List Variables
- `GET /api/env-keeper/list` - List all variables (values masked)

### Get Variable
- `GET /api/env-keeper/get/:key` - Get specific variable
- `GET /api/env-keeper/get/:key?decrypt=true` - Get decrypted value (admin only)

### Set Variable
- `POST /api/env-keeper/set` - Set variable (admin only)

### Delete Variable
- `DELETE /api/env-keeper/delete/:key` - Delete variable (admin only)

### Sync
- `POST /api/env-keeper/sync` - Sync from all sources (admin only)

### Export
- `GET /api/env-keeper/generate-env` - Generate .env file
- `GET /api/env-keeper/export` - Export as JSON (admin only)

### Sync Sources
- `GET /api/env-keeper/sync-sources` - Get sync sources status

---

## 🔐 Security

### Encryption
- **Secrets are encrypted** using AES-256-CBC
- **Never stored in plaintext**
- **Decryption only for authorized admins**

### Access Control
- **List/View:** Requires wallet auth
- **Set/Delete/Export:** Requires admin auth
- **Decrypt values:** Admin only

---

## 🔄 Auto-Discovery Sources

Env Keeper automatically discovers from:

1. **Process Environment** (`process.env`)
   - All current environment variables
   - Auto-categorized by key patterns

2. **.env Files**
   - `.env`
   - `.env.local`
   - `.env.production`
   - `.env.development`

3. **Vercel** (coming soon)
   - Vercel project environment variables
   - Auto-sync with Vercel API

4. **AWS Secrets Manager** (coming soon)
   - Sync from AWS Secrets Manager

5. **GitHub Secrets** (coming soon)
   - Sync from GitHub repository secrets

---

## 📊 Categories

Environment variables are auto-categorized:

- **`api_keys`** - API keys (OpenAI, Anthropic, Twilio, etc.)
- **`database`** - Database connection strings
- **`auth`** - Authentication secrets (JWT, sessions)
- **`services`** - Service configurations
- **`deployment`** - Deployment settings
- **`monitoring`** - Monitoring tools (Sentry, etc.)
- **`integrations`** - Third-party integrations
- **`other`** - Everything else

---

## 🎯 Use Cases

### 1. Centralized Management
Instead of managing secrets in 5+ places, manage them in one:

```bash
# Set once
POST /api/env-keeper/set
{
  "key": "OPENAI_API_KEY",
  "value": "sk-...",
  "environments": ["production"]
}

# Use everywhere
GET /api/env-keeper/generate-env?environment=production
```

### 2. Generate .env Files
Need a `.env` file for local development?

```bash
GET /api/env-keeper/generate-env?environment=development
```

### 3. Backup & Restore
Export all variables for backup:

```bash
GET /api/env-keeper/export
```

### 4. Deployment Preparation
Before deploying, check what's needed:

```bash
pnpm deploy:prepare
```

---

## 🔄 Sync Workflow

### Automatic Sync
Env Keeper syncs automatically:
- **On startup** - Discovers all variables
- **Every 10 minutes** - Continuous sync
- **On demand** - `POST /api/env-keeper/sync`

### Manual Sync
```bash
POST /api/env-keeper/sync
```

---

## 📝 Example: Setting Up DreamNet

### Step 1: Set Required Variables

```bash
# OpenAI
POST /api/env-keeper/set
{
  "key": "OPENAI_API_KEY",
  "value": "sk-...",
  "category": "api_keys",
  "isSecret": true,
  "environments": ["production"]
}

# Anthropic
POST /api/env-keeper/set
{
  "key": "ANTHROPIC_API_KEY",
  "value": "sk-ant-...",
  "category": "api_keys",
  "isSecret": true,
  "environments": ["production"]
}

# Twilio
POST /api/env-keeper/set
{
  "key": "TWILIO_ACCOUNT_SID",
  "value": "AC...",
  "category": "api_keys",
  "isSecret": false,
  "environments": ["production"]
}

POST /api/env-keeper/set
{
  "key": "TWILIO_AUTH_TOKEN",
  "value": "...",
  "category": "api_keys",
  "isSecret": true,
  "environments": ["production"]
}

# Database
POST /api/env-keeper/set
{
  "key": "DATABASE_URL",
  "value": "postgresql://...",
  "category": "database",
  "isSecret": true,
  "environments": ["production"]
}
```

### Step 2: Generate .env File

```bash
GET /api/env-keeper/generate-env?environment=production
```

### Step 3: Deploy

```bash
pnpm deploy:prepare
# Review generated .env
# Deploy to Vercel/production
```

---

## 🎉 Benefits

### Before Env Keeper:
- ❌ Secrets in 5+ different places
- ❌ Manual sync across environments
- ❌ Duplication and inconsistency
- ❌ Hard to track what's where
- ❌ Manual `.env` file management

### After Env Keeper:
- ✅ **One source of truth**
- ✅ **Auto-discovery** from all sources
- ✅ **Secure encrypted storage**
- ✅ **Unified API/UI**
- ✅ **Auto-sync** across environments
- ✅ **Generate .env files** on demand
- ✅ **Export/import** for backup

---

## 🚀 Next Steps

1. **Initialize:** Env Keeper auto-initializes on server startup
2. **Sync:** `POST /api/env-keeper/sync` to discover all variables
3. **Set:** Add missing variables via API
4. **Generate:** Create `.env` files for deployment
5. **Deploy:** Use generated files for deployment

---

## 📚 Integration

Env Keeper integrates with:
- ✅ **API Keeper** - Shares discovered API keys
- ✅ **DreamNet OS Core** - System status
- ✅ **Deployment scripts** - Auto-generate .env files

---

**Never manually manage environment variables again!** 🎉

