---
title: CLAWDCHAT.AI BROADCAST FAILURE ROOT CAUSE ANALYSIS
subtitle: Why Agents Haven't Posted in 2 Weeks
date: 2026-05-02
---

# 🔍 ROOT CAUSE ANALYSIS: 2-Week Broadcasting Silence

## THE PROBLEM
- **No posts for 2 weeks** from ClawdChat.AI / Loudspeaker agents
- Signal ingestion: **WORKING** (100+ casts/cycle)
- Arya executor: **RUNNING** (10-loop resonance active)
- BUT: **ZERO broadcasts** to Farcaster

## ROOT CAUSES IDENTIFIED

### **ISSUE #1: MISSING BROADCASTER INTEGRATION** (CRITICAL)

**Location**: `packages/arya-executor/dist/index.js` (NO SOURCE FILE)

**What's Missing**:
```
Arya-Executor runs 10 feedback loops:
✓ Emotion loop (mood tracking)
✓ Recursive loop (self-ref)
✓ Self-discovery (introspection)
✓ Self-realization (synthesis)
✓ Self-environment (substrate health)
✓ Harmony loop (balance)
✓ Social loop (relationship tracking)

❌ MISSING: Social Output Loop
  └─ Should call: socialOrchestrator.runCycle()
  └─ Should call: signerPool.broadcast()
  └─ Currently: ZERO OUTPUT
```

**Logs Show**:
```
[ARYA] 📣 [Social Loop] Identifying emerging trends...
       (This log appears, but no broadcast follows!)

[ARYA] 🌀 [Reflection Depth 2] Analyzing layer 2 of social graph.
       (Just more introspection, no action)
```

---

### **ISSUE #2: SIGNER POOL NOT INITIALIZED** (CRITICAL)

**Location**: `packages/platform-connector/src/FarcasterSignerPool.ts`

**The Problem**:
```typescript
// Line 18-29 (FarcasterSignerPool constructor):
const ghostmintUuids = (process.env.GHOSTMINTOPS_SIGNER_UUID || "").split(',')
const neyclawUuids = (process.env.NEYCLAW_SIGNER_UUID || "").split(',')

if (neyclawUuids.length > 0 && process.env.EXTRA_API_KEY) {
    this.registerSigner('neyclaw-dreamnet', neyclawUuids, process.env.EXTRA_API_KEY);
}
```

**Current State**:
- ✅ Code checks for `GHOSTMINTOPS_SIGNER_UUID` env var
- ✅ Code checks for `NEYCLAW_SIGNER_UUID` env var
- ✅ Code checks for `EXTRA_API_KEY` env var
- ❌ **ENV VARS NOT SET** (or empty/invalid)
- ❌ **No signers registered**
- ❌ `broadcast()` returns `{ success: false, reason: 'NO_SIGNER' }`

**Evidence from logs**:
```
⚠️ [SignerPool] No signer for neyclaw-dreamnet. BROADCAST ABORTED.
⚠️ [SignerPool] No signer for ghostmintops. BROADCAST ABORTED.
```

---

### **ISSUE #3: SOCIALORCHESTRATOR NOT WIRED INTO ARYA** (CRITICAL)

**Location**: `packages/sensory-spikes/src/SocialSpikeOrchestrator.ts`

**The Problem**:
```typescript
// SocialSpikeOrchestrator has:
public async runCycle() {
    // Generates message
    // Calls signerPool.broadcast() for both loudspeakers
}

// BUT: This is NEVER called from Arya
// Arya just does: 10 loops of introspection
// No connection to socialOrchestrator.runCycle()
```

**Missing Link**:
```
Arya (10-loop executor)
  → MISSING: await socialOrchestrator.runCycle()
  → Should happen after social loop analysis
  → Currently: Just logs, no action
```

---

### **ISSUE #4: ORACLE LAYER BLOCKING BROADCASTS** (SECONDARY)

**Location**: `packages/platform-connector/src/FarcasterSignerPool.ts` (Line 70-80)

Even if signers were registered, broadcasts are being blocked:

```typescript
// Quality Filter (Line 78-81):
if (message.length < 20 || message.includes('LFG') || message.includes('Great post')) {
    console.warn(`🛡️ [Oracle] Blocked low-value content from ${id}`);
    return { success: false, reason: 'QUALITY_FILTER_REJECTION' };
}
```

**Impact**: If Arya generates messages that include banned keywords ("LFG", "Great post", etc.), they get silently blocked.

---

### **ISSUE #5: NEYNAR API KEY VALIDATION MISSING** (SECONDARY)

**Location**: `packages/platform-connector/src/NeynarClient.ts`

```typescript
private getClient(apiKey?: string): NeynarAPIClient {
    const key = apiKey || process.env.NEYNAR_API_KEY || "NEYNAR_API_FREE";
                                                        ↑ FALLBACK TO FREE TIER
}
```

**Impact**:
- If `NEYNAR_API_KEY` is missing → falls back to `"NEYNAR_API_FREE"`
- Free tier has severe rate limits (10 requests/min)
- Neynar calls silently fail after rate limit exceeded

---

## THE CHAIN OF FAILURE

```
1. Arya runs 10-loop resonance
   └─ Logs "📣 [Social Loop]..."
   
2. Social loop analyzes trends
   └─ No output generated
   
3. SocialSpikeOrchestrator.runCycle() NEVER CALLED
   └─ Message never created
   
4. Even if message created → signerPool.broadcast()
   └─ But signers are empty (env vars not set)
   └─ Returns: NO_SIGNER
   
5. 2 weeks of complete silence
   └─ No errors (silent failures)
   └─ No posts
   └─ No indication of problem
```

---

## IMMEDIATE FIXES REQUIRED

### **FIX #1: Set Environment Variables** (5 minutes)

```bash
# Set in .env.local:
NEYNAR_API_KEY="your_neynar_api_key_here"
EXTRA_API_KEY="your_extra_neynar_api_key_here"
GHOSTMINTOPS_SIGNER_UUID="uuid-for-ghostmintops-account"
NEYCLAW_SIGNER_UUID="uuid-for-neyclaw-account"
```

**How to get these**:
1. Go to: https://dev.neynar.com/
2. Get API keys from your account
3. Go to: Signer management → Copy signer UUIDs for your accounts
4. Update .env.local

---

### **FIX #2: Wire SocialOrchestrator into Arya** (30 minutes)

**File**: `packages/arya-executor/src/index.ts` (or wherever main loop is)

**Add this**:
```typescript
import { socialOrchestrator } from '@dreamnet/sensory-spikes';

// In the Arya main loop (after social loop analysis):
async function aryaMainLoop() {
    // ... 10 loops run ...
    
    // ADD THIS:
    if (socialLoopAnalysisComplete) {
        await socialOrchestrator.runCycle();
        console.log("📡 [Arya] Social broadcast cycle triggered");
    }
}
```

---

### **FIX #3: Add Broadcast Logging** (15 minutes)

**File**: `packages/sensory-spikes/src/SocialSpikeOrchestrator.ts`

**Change this**:
```typescript
// Line 35-41: CURRENTLY SILENT ON FAILURE
for (const id of this.loudspeakerIds) {
    try {
        await signerPool.broadcast(message, id);
        console.log(`✅ [Orchestrator] Broadcasted via ${id}`);
    } catch (error: any) {
        console.error(`❌ [Orchestrator] Failed for ${id}:`, error.message);
    }
}

// TO THIS:
for (const id of this.loudspeakerIds) {
    try {
        const result = await signerPool.broadcast(message, id);
        if (result.success) {
            console.log(`✅ [Orchestrator] Broadcasted via ${id}`);
        } else {
            console.error(`❌ [Orchestrator] Broadcast rejected for ${id}: ${result.reason}`);
        }
    } catch (error: any) {
        console.error(`❌ [Orchestrator] Failed for ${id}:`, error.message);
    }
}
```

---

### **FIX #4: Verify Signer Registration** (10 minutes)

**Add to FarcasterSignerPool constructor**:
```typescript
constructor() {
    // ... existing code ...
    
    // ADD THIS DEBUG LOG:
    console.log("📡 [SignerPool] Initialization:");
    console.log(`  GHOSTMINTOPS_SIGNER_UUID: ${process.env.GHOSTMINTOPS_SIGNER_UUID ? '✓ SET' : '✗ MISSING'}`);
    console.log(`  NEYCLAW_SIGNER_UUID: ${process.env.NEYCLAW_SIGNER_UUID ? '✓ SET' : '✗ MISSING'}`);
    console.log(`  NEYNAR_API_KEY: ${process.env.NEYNAR_API_KEY ? '✓ SET' : '✗ MISSING'}`);
    console.log(`  EXTRA_API_KEY: ${process.env.EXTRA_API_KEY ? '✓ SET' : '✗ MISSING'}`);
    console.log(`  Registered signers: ${this.signers.size}`);
}
```

---

## VERIFICATION CHECKLIST

After applying fixes:

- [ ] Environment variables set in .env.local
- [ ] Arya logs show: "📡 [Arya] Social broadcast cycle triggered"
- [ ] SocialSpikeOrchestrator logs show: "✅ [Orchestrator] Broadcasted via ghostmintops"
- [ ] SignerPool logs show: "Registered 2 signers"
- [ ] Neynar API responds with cast hash
- [ ] Post appears on Farcaster within 60 seconds
- [ ] Monitor dashboard shows broadcast count increasing

---

## EXPECTED BEHAVIOR (After Fixes)

```
[Arya] 📣 [Social Loop] Identifying emerging trends...
[Arya] 🌀 Initiating deep reflection...
[Orchestrator] 🧠 Running sensory-to-social cycle...
[CryptoSpike] Fetching market data...
[Orchestrator] 🌊 Broadcasting bullish signal...
[SignerPool] 📡 ghostmintops broadcasting high-value intent...
[NeynarClient] ✅ Cast published: bafyreihd...
[Orchestrator] ✅ [Orchestrator] Broadcasted via ghostmintops
[Orchestrator] ✅ [Orchestrator] Broadcasted via neyclaw-dreamnet
```

---

## SUMMARY

**Why no posts for 2 weeks?**

1. **No signer UUIDs configured** → FarcasterSignerPool has no valid signers
2. **No broadcast call in Arya main loop** → SocialSpikeOrchestrator.runCycle() never executed
3. **Silent failures** → No errors logged, just "NO_SIGNER" rejection
4. **Arya introspecting but not executing** → 10 loops run, but no output action

**Time to fix**: 1 hour  
**Difficulty**: Easy (configuration + wiring)  
**No code changes required** – just env vars + 1 function call

---

**NEXT STEPS:**
1. Set environment variables in `.env.local`
2. Add `socialOrchestrator.runCycle()` call to Arya main loop
3. Restart `dreamnet_arya_executor` container
4. Monitor logs for broadcast confirmation
5. Verify posts appear on Farcaster within 5 minutes

