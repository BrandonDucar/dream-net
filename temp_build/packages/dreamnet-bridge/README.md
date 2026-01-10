# DreamNet ↔ Cursor Bridge

**Integration layer for Cursor to communicate with DreamNet's autonomous agents**

## Purpose

This bridge allows Cursor (your local AI coding assistant) to delegate specialized tasks to DreamNet's autonomous agents, rather than trying to handle everything locally.

## When to Use This Bridge

### ✅ Use DreamNet Bridge For:

- **System Status** (`dnStatus`) - Global health, multi-system monitoring, agent status
- **Economic Analysis** (`dnEconomy`) - Token liquidity, treasury flows, economic planning
- **DevOps/Infra** (`dnDevOps`) - Deployment status, infrastructure recommendations, DeployKeeper queries
- **Wallet Intelligence** (`dnWalletIntel`) - Portfolio analytics, wallet analysis (read-only)

### ❌ Use Cursor Locally For:

- **Code Editing** - Writing, refactoring, debugging code
- **Config Changes** - Updating configs, env vars, build settings
- **Documentation** - Writing docs, READMEs, guides
- **Module Wiring** - Adding imports, connecting components

## Functions

### `dnStatus()`

Get high-level DreamNet system status.

```typescript
import { dnStatus } from "@dreamnet/dreamnet-bridge";

const status = await dnStatus();
console.log(status);
```

**Use when:**
- Checking overall system health
- Monitoring multiple subsystems
- Getting agent status overview

---

### `dnEconomy(query: string)`

Query DreamNet's Economic Brain for token/liquidity analysis.

```typescript
import { dnEconomy } from "@dreamnet/dreamnet-bridge";

const analysis = await dnEconomy("What's the current DREAM/SHEEP liquidity?");
const treasury = await dnEconomy("Show me treasury balance and flows");
```

**Use when:**
- Analyzing token liquidity
- Planning economic strategies
- Checking treasury status
- Understanding token flows

---

### `dnDevOps(query: string)`

Query DeployKeeper for deployment and infrastructure insights.

```typescript
import { dnDevOps } from "@dreamnet/dreamnet-bridge";

const summary = await dnDevOps("Get deployment summary for DreamNet");
const recommendations = await dnDevOps("What infrastructure changes are recommended?");
```

**Use when:**
- Checking deployment status
- Getting infrastructure recommendations
- Understanding service health
- Planning deployment changes

---

### `dnWalletIntel(query: string)`

Query CoinSensei for wallet and portfolio analytics.

**⚠️ SECURITY: READ_ONLY - Never accepts private keys, seeds, or mnemonics**

```typescript
import { dnWalletIntel } from "@dreamnet/dreamnet-bridge";

const intel = await dnWalletIntel("Analyze portfolio for wallet 0x123...");
const pnl = await dnWalletIntel("Show P&L for wallet 0x456...");
```

**Use when:**
- Analyzing wallet portfolios
- Getting P&L summaries
- Understanding token allocations
- Portfolio health checks

**Never use for:**
- Private key operations
- Seed phrase handling
- Transaction signing
- Any write operations

---

## Setup

1. **Set Environment Variable:**

```bash
# .env or environment
DREAMNET_API_KEY=your_api_key_here
DREAMNET_API_URL=https://api.dreamnet.ink  # Optional, defaults to this
```

2. **Install:**

```bash
pnpm install
```

3. **Use in Scripts:**

```typescript
// scripts/check-status.ts
import { dnStatus } from "@dreamnet/dreamnet-bridge";

async function main() {
  try {
    const status = await dnStatus();
    console.log("DreamNet Status:", status);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

main();
```

4. **Use in Routes:**

```typescript
// server/routes/dreamnet-status.ts
import { Router } from "express";
import { dnStatus } from "@dreamnet/dreamnet-bridge";

const router = Router();

router.get("/status", async (req, res) => {
  try {
    const status = await dnStatus();
    res.json({ status });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});
```

---

## Error Handling

All functions throw errors if:
- `DREAMNET_API_KEY` is not set
- Query is empty (for query functions)
- DreamNet API is unavailable
- Network/timeout errors occur

Always wrap calls in try/catch:

```typescript
try {
  const result = await dnEconomy("query");
} catch (error) {
  console.error("DreamNet query failed:", error);
  // Fallback logic here
}
```

---

## Cost Awareness

- DreamNet agents handle heavy, recurring work (monitoring, scanning, orchestration)
- Use Cursor for surgical code changes, not endless manual checks
- Offload monitoring and analysis to DreamNet when possible

---

## Examples

### Example 1: Deployment Status Script

```typescript
// scripts/deployment-status.ts
import { dnDevOps } from "@dreamnet/dreamnet-bridge";

async function main() {
  console.log("Fetching deployment status...\n");
  const summary = await dnDevOps("Get deployment summary for DreamNet");
  console.log(summary);
}

main();
```

### Example 2: Economic Analysis Route

```typescript
// server/routes/economy.ts
import { Router } from "express";
import { dnEconomy } from "@dreamnet/dreamnet-bridge";

const router = Router();

router.post("/analyze", async (req, res) => {
  const { query } = req.body;
  if (!query) {
    return res.status(400).json({ error: "Query required" });
  }

  try {
    const analysis = await dnEconomy(query);
    res.json({ analysis });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});
```

### Example 3: Wallet Intel Integration

```typescript
// server/routes/wallet-intel.ts
import { Router } from "express";
import { dnWalletIntel } from "@dreamnet/dreamnet-bridge";

const router = Router();

router.get("/:address", async (req, res) => {
  const { address } = req.params;
  
  try {
    const intel = await dnWalletIntel(`Analyze portfolio for wallet ${address}`);
    res.json({ intel });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});
```

---

## Architecture

```
Cursor (Local)
    ↓
DreamNet Bridge (packages/dreamnet-bridge)
    ↓
DreamNet Agent Client (@dreamnet/dreamnet-agent-client)
    ↓
DreamNet API (api.dreamnet.ink)
    ↓
DreamNet Autonomous Agents (DeployKeeper, CoinSensei, Economic Brain, etc.)
```

---

**Remember:** Cursor edits code. DreamNet executes and analyzes. Use the bridge to connect them efficiently.

