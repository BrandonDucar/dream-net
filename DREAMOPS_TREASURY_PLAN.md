# 🏦 DreamOps Treasury Module - Implementation Plan

## Overview

Autonomous treasury system using ERC-4337 account abstraction on Base with gasless execution via paymaster sponsorship.

## Architecture

### 3-Agent System

1. **Agent A (Treasury Sentinel)**: Monitors balances, thresholds, schedules
2. **Agent B (Governance Gate)**: Validates against rules, signs approvals
3. **Agent C (Executor)**: Builds UserOps, requests sponsorship, submits to bundler

### Tech Stack

- **Chain**: Base Mainnet (chainId: 8453)
- **EntryPoint**: 0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789 (v0.7)
- **Paymaster**: Base Paymaster (sponsored mode)
- **Bundler**: Coinbase CDP
- **Transfer Types**: ERC-20 + native ETH

## Module Structure

```
packages/dreamops-treasury/
  src/
    index.ts          # Main exports
    config.ts         # Configuration loader
    types.ts          # TypeScript interfaces
    policy.ts         # Policy evaluation engine
    encode.ts         # CallData encoding
    paymaster.ts      # Base Paymaster integration
    bundler.ts        # CDP bundler client
    userop.ts         # UserOperation builder
    executor.ts       # 3-agent orchestration
    eventBus.ts       # DreamNet event integration
    api/
      server.ts       # HTTP API
      routes.ts       # Endpoint handlers
  treasury.config.json  # Runtime configuration
  .env.example
```

## Configuration Schema

```json
{
  "chain": {
    "name": "base",
    "chainId": 8453,
    "rpcUrl": "https://mainnet.base.org",
    "entryPoint": "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789"
  },
  "treasury": {
    "smartAccount": "0xYOUR_ACCOUNT",
    "beneficiariesAllowlist": ["0xTO1", "0xTO2"],
    "tokensAllowlist": ["0xTOKEN1"],
    "dailyCaps": [{"token": "0xTOKEN1", "cap": "1000000000000000000000"}]
  },
  "policy": {
    "requireApproverSignature": true,
    "maxSingleTransferWei": "500000000000000000000"
  }
}
```

## Event Flow

```
TreasuryEvent → PolicyEvent → UserOpBuilt → Sponsored → Submitted → Receipt
```

## Safety Controls

- Per-token daily caps
- Beneficiary allowlists
- Approval signature requirements (TTL-based)
- Emergency kill-switch
- Replay attack protection via intent hashes

## Integration Points

- **Wolf Pack**: Funding automation for proposals
- **DreamNet Event Bus**: All actions logged to ChronoLoom
- **DreamScope UI**: Real-time treasury monitoring
- **Budget Governor**: Cost cap enforcement

## Implementation Timeline

### Week 1: Core Module

- [ ] Day 1-2: Types, config loader, policy engine
- [ ] Day 3-4: UserOp builder + paymaster integration
- [ ] Day 5: Bundler client + executor orchestration
- [ ] Day 6-7: Event bus wiring + basic API

### Week 2: Integration & Testing

- [ ] Day 1-2: Wolf Pack integration
- [ ] Day 3-4: DreamScope UI hooks
- [ ] Day 5: Base testnet deployment
- [ ] Day 6-7: Security audit + mainnet prep

## Security Considerations

- **MEV Protection**: Short TTLs on approvals, strict entrypoint checks
- **Cross-Rollup Risks**: Single-chain only (Base) to avoid finality gaps
- **Paymaster Abuse**: Rate limiting + quota monitoring
- **Signature Verification**: ECDSA validation on all approvals

## Next Steps

1. Create module scaffold
2. Implement policy engine
3. Wire Base Paymaster
4. Test on Base Sepolia
5. Deploy to mainnet with conservative limits

---

**Status**: PLANNING
**Owner**: Antigravity + Thread B
**Target**: MVP in 7 days
