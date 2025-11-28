# Stablecoin/CCTP V2 Architecture Implementation Plan

## Overview

Implement CCTP V2-native stablecoin rails with Proof-of-Reserve, compliance gates, and custody attestation for institutional-grade stablecoin flows in DreamNet.

## Architecture Components

### CCTP V2 (Cross-Chain Transfer Protocol)
- **Primary:** Native USDC burn-and-mint across chains
- **Hooks:** Automated logic on cross-chain settlement
- **Fallback:** V1 support for legacy chains

### Proof-of-Reserve (Chainlink)
- **Real-time:** Oracle-delivered reserve data
- **Circuit breaker:** On-chain pause if reserves < supply
- **Transparency:** Public reserve attestation

### Compliance & Gating
- **On-ramps:** Regulated providers (KYC)
- **Geofencing:** Per-asset jurisdiction flags
- **QP filters:** Qualified party routing

### Custody
- **SOC-audited:** Regulated custodians
- **Attestation links:** Public provenance
- **UX integration:** Surface in logs/UI

## Implementation Phases

### Phase 1: CCTP V2 Integration

**Files to create:**
- `packages/stablecoin-core/src/CCTPV2Client.ts` - CCTP V2 client
- `packages/stablecoin-core/src/CCTPV2Hooks.ts` - Hook implementation
- `packages/stablecoin-core/src/CCTPV1Fallback.ts` - V1 fallback

**Dependencies:**
```json
{
  "@circle-fin/cctp-sdk": "^2.0.0",
  "ethers": "^6.15.0"
}
```

**Features:**
- Native USDC transfers (no wrapped tokens)
- Hook execution on settlement
- Automatic V1 fallback for unsupported chains
- Treasury flow automation

### Phase 2: Proof-of-Reserve Integration

**Files to create:**
- `packages/stablecoin-core/src/ChainlinkPoR.ts` - Chainlink PoR client
- `packages/stablecoin-core/src/CircuitBreaker.ts` - On-chain circuit breaker
- `packages/stablecoin-core/src/ReserveMonitor.ts` - Reserve monitoring

**Dependencies:**
```json
{
  "@chainlink/contracts": "^1.0.0"
}
```

**Smart contracts:**
- `contracts/ReserveCircuitBreaker.sol` - Circuit breaker contract
- `contracts/ReserveVerifier.sol` - Reserve verification

**Features:**
- Real-time reserve verification before mint/redemption
- Automatic pause if reserve-to-supply delta > threshold
- Public reserve attestation links

### Phase 3: Compliance & Gating

**Files to create:**
- `packages/stablecoin-core/src/OnRampProvider.ts` - Regulated on-ramp integration
- `packages/stablecoin-core/src/GeofenceGate.ts` - Per-asset geofencing
- `packages/stablecoin-core/src/KYCProvider.ts` - KYC integration
- `packages/stablecoin-core/src/QPFilter.ts` - Qualified party filter

**Integration points:**
- On-ramp providers (Circle, Coinbase, etc.)
- KYC services
- Geolocation APIs
- QP verification services

**Features:**
- Dynamic gating based on user jurisdiction
- KYC flow integration
- QP verification before high-value operations
- Embedded on-ramp UX

### Phase 4: Custody & Attestation

**Files to create:**
- `packages/stablecoin-core/src/CustodyProvider.ts` - Custody abstraction
- `packages/stablecoin-core/src/AttestationService.ts` - Attestation link management
- `packages/stablecoin-core/src/CustodyMonitor.ts` - Custody health monitoring

**Features:**
- SOC report integration
- Public attestation link surfacing
- Custody health checks
- Audit trail generation

### Phase 5: Smart Contract Integration

**Files to create:**
- `contracts/StablecoinMinter.sol` - Minting contract with PoR
- `contracts/StablecoinRedeemer.sol` - Redemption contract with PoR
- `contracts/ComplianceGate.sol` - On-chain compliance checks

**Features:**
- Mint only if reserves ≥ supply (PoR check)
- Redemption with reserve verification
- On-chain geofencing/KYC checks
- Circuit breaker integration

### Phase 6: DreamNet Integration

**Integration points:**
- **Payment flows:** Use CCTP V2 for cross-chain payments
- **Treasury:** Native USDC for treasury operations
- **Dream tokens:** Stablecoin backing for dream tokens
- **Compliance:** Gating for regulated dream features

**Files to update:**
- `packages/dreamnet-control-core/src/PaymentProcessor.ts` - Add CCTP V2
- `packages/dreamnet-control-core/src/TreasuryManager.ts` - Native USDC support
- `server/routes/payments.ts` - Payment route updates

### Phase 7: UX & Transparency

**Files to create:**
- `client/src/components/ReserveAttestation.tsx` - Reserve display component
- `client/src/components/CustodyStatus.tsx` - Custody status display
- `client/src/components/ComplianceGate.tsx` - Compliance gating UI

**Features:**
- Public reserve attestation links in UI
- Custody status indicators
- Compliance gate messaging
- On-ramp flow integration

## Success Criteria

- CCTP V2 transfers working (native USDC)
- Proof-of-Reserve verification before mint/redemption
- Circuit breaker pausing on reserve shortfall
- Compliance gates enforcing KYC/geofencing
- Custody attestation links surfaced in UX
- Smart contracts deployed and verified
- Integration with DreamNet payment flows

## Regulatory Compliance

- **Reserve transparency:** Public PoR feeds
- **Custody:** SOC-audited providers
- **KYC/AML:** Regulated on-ramp integration
- **Geofencing:** Per-jurisdiction asset gating
- **Audit trails:** Full transaction logging

## Risk Mitigation

- **Reserve runs:** Circuit breaker + PoR monitoring
- **Over-issuance:** PoR checks before mint
- **Compliance violations:** Gating before operations
- **Custody failures:** Health monitoring + alerts

