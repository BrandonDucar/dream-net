# Bridge Security Hardening - Yala Exploit Lessons

**Status**: 📋 Security Guide  
**Priority**: 🟢 LOW  
**Last Updated**: 2025-01-27

---

## Overview

Lessons from the **Yala exploit** (Dec 2024) where an attacker exploited a custom bridge via compromised keys, leading to mass token over-minting. This guide implements security hardening patterns to prevent similar attacks.

### Key Lessons

1. Use canonical/audited bridges
2. Enforce short-lived keys with HSM storage
3. Require multi-sig for mint/burn operations
4. Test chain-abstraction failure modes
5. Route swaps through private order-flow

---

## Security Patterns

### 1. Canonical Bridge Usage

**Principle**: Use canonical or audited light-client bridges vs ad-hoc bridges

**Implementation**:
```typescript
class BridgeSecurity {
  private allowedBridges = [
    "layerzero", // Canonical LayerZero bridge
    "wormhole", // Audited Wormhole bridge
    "stargate" // Audited Stargate bridge
  ];
  
  async validateBridge(bridgeId: string): Promise<boolean> {
    if (!this.allowedBridges.includes(bridgeId)) {
      throw new Error(`Unauthorized bridge: ${bridgeId}`);
    }
    
    // Verify bridge is canonical
    const bridge = await this.getBridgeInfo(bridgeId);
    return bridge.canonical && bridge.audited;
  }
}
```

### 2. Short-Lived Keys with HSM

**Principle**: Enforce short-lived keys stored in HSM, with just-in-time access

**Implementation**:
```typescript
class KeyManagement {
  async generateKey(ttl: number = 3600): Promise<Key> {
    // Generate key in HSM
    const key = await HSM.generateKey({
      algorithm: "ECDSA",
      ttl, // 1 hour default
      purpose: "bridge_operation"
    });
    
    // Store metadata (not key itself)
    await KeyStore.storeMetadata({
      keyId: key.id,
      expiresAt: Date.now() + ttl * 1000,
      purpose: "bridge_operation"
    });
    
    return key;
  }
  
  async useKey(keyId: string, operation: string): Promise<string> {
    // Just-in-time key retrieval
    const key = await HSM.retrieveKey(keyId);
    
    // Verify key is still valid
    if (key.expiresAt < Date.now()) {
      throw new Error("Key expired");
    }
    
    // Use key for operation
    return await this.signOperation(key, operation);
  }
}
```

### 3. Multi-Sig Mint/Burn

**Principle**: Require mint/burn operations to be pausable and governed by on-chain guardians/multi-sig

**Implementation**:
```typescript
class MultiSigMintBurn {
  async mint(
    amount: bigint,
    recipient: string,
    signatures: Signature[]
  ): Promise<Transaction> {
    // Require multi-sig
    if (signatures.length < this.requiredSignatures) {
      throw new Error("Insufficient signatures");
    }
    
    // Verify signatures
    for (const sig of signatures) {
      if (!await this.verifySignature(sig)) {
        throw new Error("Invalid signature");
      }
    }
    
    // Check if paused
    if (await this.isPaused()) {
      throw new Error("Minting is paused");
    }
    
    // Execute mint
    return await this.executeMint(amount, recipient);
  }
  
  async pause(): Promise<void> {
    // Require guardian approval
    const approval = await Guardian.approve("pause_minting");
    
    if (!approval) {
      throw new Error("Guardian approval required");
    }
    
    await this.setPaused(true);
  }
}
```

### 4. Chain-Abstraction Failure Mode Testing

**Principle**: Test chain-abstraction failure modes; run "chaos drills" including key-compromise and bridge bypass scenarios

**Implementation**:
```typescript
class ChaosDrills {
  async runKeyCompromiseDrill(): Promise<DrillResult> {
    // Simulate key compromise
    const compromisedKey = await this.simulateKeyCompromise();
    
    // Test system response
    const response = await this.testKeyCompromiseResponse(compromisedKey);
    
    // Verify mitigation worked
    const mitigated = await this.verifyMitigation(response);
    
    return {
      scenario: "key_compromise",
      mitigated,
      responseTime: response.time,
      actions: response.actions
    };
  }
  
  async runBridgeBypassDrill(): Promise<DrillResult> {
    // Simulate bridge bypass
    const bypass = await this.simulateBridgeBypass();
    
    // Test detection
    const detected = await this.detectBypass(bypass);
    
    // Test mitigation
    const mitigated = await this.mitigateBypass(bypass);
    
    return {
      scenario: "bridge_bypass",
      detected,
      mitigated,
      responseTime: mitigated.time
    };
  }
}
```

### 5. Private Order-Flow Routing

**Principle**: Route rebalancing/swaps through private order-flow or off-chain liquidity providers

**Implementation**:
```typescript
class PrivateOrderFlow {
  async routeSwap(
    tokenIn: string,
    tokenOut: string,
    amount: bigint
  ): Promise<SwapRoute> {
    // Check liquidity depth
    const liquidity = await this.checkLiquidity(tokenIn, tokenOut);
    
    if (liquidity.depth < this.minLiquidityThreshold) {
      // Route through private order-flow
      return await this.routePrivateOrderFlow(tokenIn, tokenOut, amount);
    } else {
      // Use on-chain liquidity
      return await this.routeOnChain(tokenIn, tokenOut, amount);
    }
  }
  
  async routePrivateOrderFlow(
    tokenIn: string,
    tokenOut: string,
    amount: bigint
  ): Promise<SwapRoute> {
    // Use private liquidity providers
    const providers = await this.getPrivateProviders();
    
    // Find best route
    const route = await this.findBestRoute(providers, tokenIn, tokenOut, amount);
    
    // Execute off-chain
    return await this.executeOffChain(route);
  }
}
```

---

## Monitoring & Alerting

### On-Chain Alerting

**Purpose**: Alert on unusual mint or bridge activity

**Implementation**:
```typescript
class BridgeMonitoring {
  async monitorMintActivity(): Promise<void> {
    // Monitor mint events
    this.onMintEvent(async (event) => {
      // Check for unusual patterns
      const unusual = await this.detectUnusualMint(event);
      
      if (unusual) {
        // Alert
        await AlertsCore.alert({
          severity: "high",
          type: "unusual_mint",
          event,
          recommendation: "Investigate immediately"
        });
      }
    });
  }
  
  async detectUnusualMint(event: MintEvent): Promise<boolean> {
    // Check volume
    if (event.amount > this.normalMintThreshold * 10) {
      return true;
    }
    
    // Check frequency
    const recentMints = await this.getRecentMints(3600); // Last hour
    if (recentMints.length > this.normalMintFrequency * 5) {
      return true;
    }
    
    // Check source
    if (!await this.isKnownSource(event.source)) {
      return true;
    }
    
    return false;
  }
}
```

---

## Implementation Checklist

- [ ] Audit all bridges for canonical status
- [ ] Implement HSM key management
- [ ] Set up multi-sig for mint/burn
- [ ] Create chaos drill procedures
- [ ] Implement private order-flow routing
- [ ] Set up on-chain monitoring
- [ ] Configure alerts for unusual activity
- [ ] Document incident response procedures

---

**Status**: 📋 Complete

