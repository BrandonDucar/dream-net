# DreamNet ↔ Cursor Bridge Setup Complete ✅

## What Was Created

### 1. Bridge Package (`packages/dreamnet-bridge/`)

A lightweight integration layer that wraps `@dreamnet/dreamnet-agent-client` and exposes four focused functions:

- **`dnStatus()`** - System status and health monitoring
- **`dnEconomy(query)`** - Economic analysis and token intelligence  
- **`dnDevOps(query)`** - DevOps and deployment management
- **`dnWalletIntel(query)`** - Wallet and portfolio analytics (read-only)

### 2. Example Scripts (`scripts/`)

Three ready-to-use scripts demonstrating bridge usage:

- **`dreamnet-status.ts`** - Get system status
- **`dreamnet-devops.ts`** - Query DeployKeeper
- **`dreamnet-economy.ts`** - Economic analysis

### 3. Documentation

- **`packages/dreamnet-bridge/README.md`** - Complete usage guide
- **`CURSOR_SYSTEM_PROMPT_UPDATE.md`** - Instructions for updating Cursor's system prompt

---

## Quick Start

### 1. Set Environment Variable

```bash
# .env or environment
DREAMNET_API_KEY=your_api_key_here
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Test the Bridge

```bash
# System status
pnpm tsx scripts/dreamnet-status.ts

# DevOps query
pnpm tsx scripts/dreamnet-devops.ts "Get deployment summary"

# Economic analysis
pnpm tsx scripts/dreamnet-economy.ts "What's the current DREAM/SHEEP liquidity?"
```

---

## How It Works

```
┌─────────────────┐
│   Cursor (You)  │
└────────┬────────┘
         │
         │ Uses bridge functions
         ▼
┌─────────────────────────┐
│  DreamNet Bridge        │
│  (packages/dreamnet-    │
│   bridge/index.ts)      │
└────────┬────────────────┘
         │
         │ Calls DreamNetAgent
         ▼
┌─────────────────────────┐
│  DreamNet Agent Client  │
│  (@dreamnet/dreamnet-   │
│   agent-client)         │
└────────┬────────────────┘
         │
         │ HTTP API calls
         ▼
┌─────────────────────────┐
│  DreamNet API           │
│  (api.dreamnet.ink)     │
└────────┬────────────────┘
         │
         │ Routes to agents
         ▼
┌─────────────────────────┐
│  DreamNet Agents        │
│  - DeployKeeper         │
│  - CoinSensei           │
│  - Economic Brain       │
│  - System Monitor       │
└─────────────────────────┘
```

---

## Usage Examples

### In Scripts

```typescript
// scripts/my-script.ts
import { dnStatus, dnEconomy } from "@dreamnet/dreamnet-bridge";

async function main() {
  const status = await dnStatus();
  console.log(status);
  
  const liquidity = await dnEconomy("Show DREAM liquidity");
  console.log(liquidity);
}

main();
```

### In Server Routes

```typescript
// server/routes/dreamnet.ts
import { Router } from "express";
import { dnStatus, dnDevOps } from "@dreamnet/dreamnet-bridge";

const router = Router();

router.get("/status", async (req, res) => {
  try {
    const status = await dnStatus();
    res.json({ status });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/devops", async (req, res) => {
  const { query } = req.body;
  try {
    const result = await dnDevOps(query);
    res.json({ result });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});
```

### In Cursor Commands

After updating Cursor's system prompt (see `CURSOR_SYSTEM_PROMPT_UPDATE.md`), you can say:

```
"Check DreamNet system status"
```

Cursor will:
1. Recognize this needs the bridge
2. Create/use a script that calls `dnStatus()`
3. Execute it or show you how to run it

---

## When to Use Bridge vs Cursor

### ✅ Use Bridge For:

- **System Monitoring** - Health checks, status overviews
- **Economic Analysis** - Token liquidity, treasury flows
- **DevOps Queries** - Deployment status, infrastructure recommendations
- **Wallet Intelligence** - Portfolio analytics (read-only)

### ✅ Use Cursor For:

- **Code Editing** - Writing, refactoring, debugging
- **Config Changes** - Updating configs, env vars
- **Documentation** - Writing docs, READMEs
- **Module Wiring** - Adding imports, connecting components

---

## Security Notes

### Wallet Intelligence (`dnWalletIntel`)

- **READ_ONLY** - Never accepts private keys, seeds, or mnemonics
- Only accepts public wallet addresses
- Returns analytics only, no transaction capabilities

### API Key

- Store `DREAMNET_API_KEY` in environment variables
- Never commit API keys to git
- Use `.env` file (gitignored) for local development

---

## Next Steps

1. **Update Cursor System Prompt**
   - Follow instructions in `CURSOR_SYSTEM_PROMPT_UPDATE.md`
   - Add collaboration rules block to top of system prompt

2. **Test the Bridge**
   - Run example scripts
   - Verify API key is set correctly
   - Check API connectivity

3. **Create Custom Scripts**
   - Use bridge functions in your own scripts
   - Integrate into server routes as needed
   - Wire into CI/CD pipelines if desired

4. **Monitor Usage**
   - Track API calls to DreamNet
   - Monitor costs/credits
   - Optimize query frequency

---

## Troubleshooting

### Error: "DREAMNET_API_KEY environment variable is required"

**Solution:** Set the environment variable:
```bash
export DREAMNET_API_KEY=your_key_here
# or in .env file
DREAMNET_API_KEY=your_key_here
```

### Error: "DreamNet request failed"

**Solution:** 
- Check API key is valid
- Verify `api.dreamnet.ink` is accessible
- Check network connectivity
- Review API rate limits

### Error: "Query cannot be empty"

**Solution:** Provide a non-empty query string:
```typescript
// ❌ Wrong
await dnEconomy("");

// ✅ Correct
await dnEconomy("Show me liquidity");
```

---

## Files Created

```
packages/dreamnet-bridge/
├── index.ts              # Bridge implementation
├── package.json          # Package config
├── tsconfig.json         # TypeScript config
└── README.md             # Usage documentation

scripts/
├── dreamnet-status.ts    # System status script
├── dreamnet-devops.ts    # DevOps query script
└── dreamnet-economy.ts   # Economic analysis script

docs/
└── CURSOR_SYSTEM_PROMPT_UPDATE.md  # System prompt guide
```

---

**Status**: ✅ Bridge created and ready to use

**Next**: Update Cursor system prompt and start using the bridge!

