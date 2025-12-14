# Registry Proofs System - Complete Documentation

**Generated:** 2025-01-27  
**Status:** Complete Documentation & Implementation Plan

---

## Overview

Registry Proofs System provides on-chain KYC/KYB attestations for RWA (Real-World Asset) readiness and DIN-style node operator verification. This enables compliance with financial regulations while maintaining decentralized infrastructure security.

---

## Architecture

### Components

1. **On-Chain Registry Contract** (`DreamRegistry.sol`)
   - Bitmap-based flags (KYC, KYB, ACCREDITED, REGION_US, etc.)
   - Attester management
   - Proof verification

2. **Attester Adapter** (`attester.ts`)
   - Integrates with KYC/KYB providers (Sumsub, Onfido, etc.)
   - Issues on-chain attestations
   - Updates registry flags

3. **Proof Verifier** (`verifier.ts`)
   - Verifies registry proofs
   - Checks flag combinations
   - Validates attestations

4. **RWA Token Integration** (`DreamRWAToken.sol`)
   - Transfer hooks for compliance
   - Registry checks before transfers
   - Whitelist management

---

## Registry Flags (Bitmap)

### Flag Definitions

```solidity
uint8 constant KYC = 0;                    // Know Your Customer verified
uint8 constant KYB = 1;                    // Know Your Business verified
uint8 constant ACCREDITED = 2;             // Accredited investor
uint8 constant REGION_US = 3;              // US region verified
uint8 constant REGION_EU = 4;              // EU region verified
uint8 constant SANCTIONS_CLEAR = 5;        // Sanctions screening passed
uint8 constant PROFESSIONAL_INVESTOR = 6; // Professional investor status
uint8 constant NODE_OPERATOR = 7;          // DIN-style operator verification
```

### Flag Combinations

**Basic User**:
- KYC (bit 0)

**Accredited Investor**:
- KYC (bit 0) + ACCREDITED (bit 2)

**US Institutional**:
- KYB (bit 1) + ACCREDITED (bit 2) + REGION_US (bit 3) + SANCTIONS_CLEAR (bit 5)

**Node Operator**:
- KYC (bit 0) + NODE_OPERATOR (bit 7)

---

## On-Chain Registry Contract

### DreamRegistry.sol

**Features**:
- Bitmap-based flag storage (uint256)
- Attester management (who can set flags)
- Proof verification
- Event emission for attestations

**Functions**:
```solidity
function setFlag(address account, uint8 flagBit, bool value) external onlyAttester;
function hasFlag(address account, uint8 flagBit) external view returns (bool);
function getFlags(address account) external view returns (uint256);
function addAttester(address attester) external onlyOwner;
function removeAttester(address attester) external onlyOwner;
```

**Events**:
```solidity
event FlagSet(address indexed account, uint8 flagBit, bool value, address indexed attester);
event AttesterAdded(address indexed attester);
event AttesterRemoved(address indexed attester);
```

---

## Attester Adapter

### Integration with KYC/KYB Providers

**Supported Providers**:
- Sumsub (KYC/KYB)
- Onfido (KYC)
- Chainalysis (AML/Sanctions)
- Elliptic (AML/Sanctions)

**Flow**:
```
User Submits KYC
    ↓
Attester Adapter Calls Provider API
    ↓
Provider Verifies Identity
    ↓
Attester Adapter Issues On-Chain Attestation
    ↓
Registry Contract Sets Flag
    ↓
Proof Available On-Chain
```

### Attester Functions

```typescript
async verifyKYC(walletAddress: string, kycData: KYCData): Promise<AttestationResult>
async verifyKYB(companyAddress: string, kybData: KYBData): Promise<AttestationResult>
async checkSanctions(walletAddress: string): Promise<SanctionsCheck>
async issueAttestation(account: string, flag: RegistryFlag, proof: string): Promise<void>
```

---

## Proof Verification

### Verification Logic

```typescript
function verifyProof(
  account: string,
  requiredFlags: RegistryFlag[],
  registry: DreamRegistry
): boolean {
  for (const flag of requiredFlags) {
    if (!registry.hasFlag(account, flag)) {
      return false;
    }
  }
  return true;
}
```

### Use Cases

1. **RWA Token Transfer**
   - Check KYC + ACCREDITED before transfer
   - Block transfer if flags missing

2. **High-Value Transaction**
   - Check KYC + SANCTIONS_CLEAR
   - Require REGION_US for US transactions

3. **Node Operator Registration**
   - Check KYC + NODE_OPERATOR
   - Verify performance history

---

## RWA Token Integration

### DreamRWAToken.sol

**Features**:
- ERC20-compatible token
- Transfer hooks for compliance
- Registry checks before transfers
- Whitelist management

**Transfer Hook**:
```solidity
function _beforeTokenTransfer(
    address from,
    address to,
    uint256 amount
) internal override {
    // Check registry flags
    require(
        registry.hasFlag(to, KYC) && registry.hasFlag(to, ACCREDITED),
        "Recipient must be KYC'd and accredited"
    );
    
    // Check sanctions
    require(
        registry.hasFlag(to, SANCTIONS_CLEAR),
        "Recipient must pass sanctions check"
    );
    
    super._beforeTokenTransfer(from, to, amount);
}
```

---

## Integration with DreamNet Systems

### Identity Grid

- Links registry flags to Identity Grid nodes
- Updates identity metadata with compliance status
- Tracks compliance history

### Dream State

- Passport tiers map to registry flags
- Higher tiers require more flags
- Governance proposals can update flags

### Base Mini-Apps

- Mini-apps check registry flags for access
- RWA-compliant mini-apps require ACCREDITED flag
- Transfer restrictions based on flags

---

## Implementation Plan

### Phase 5.1: On-Chain Registry Contract
- [ ] Deploy `DreamRegistry.sol` to Base testnet
- [ ] Implement flag management
- [ ] Add attester management
- [ ] Test flag setting/getting

### Phase 5.2: Attester Adapter
- [ ] Implement Sumsub integration
- [ ] Implement Onfido integration
- [ ] Implement Chainalysis integration
- [ ] Implement Elliptic integration
- [ ] Create unified attester interface

### Phase 5.3: Proof Verifier
- [ ] Implement proof verification logic
- [ ] Add flag combination checks
- [ ] Create verification utilities

### Phase 5.4: RWA Token
- [ ] Deploy `DreamRWAToken.sol`
- [ ] Implement transfer hooks
- [ ] Test compliance checks

### Phase 5.5: Integration
- [ ] Integrate with Identity Grid
- [ ] Integrate with Dream State
- [ ] Integrate with Base Mini-Apps
- [ ] Add to Nervous System Core

---

## Security Considerations

1. **Attester Security**
   - Only authorized attesters can set flags
   - Attester rotation mechanism
   - Multi-sig for critical flags

2. **Flag Integrity**
   - Flags cannot be removed without governance
   - Expiration dates for time-bound flags
   - Audit trail for all flag changes

3. **Privacy**
   - Flags are public (on-chain)
   - Sensitive data stored off-chain
   - Zero-knowledge proofs for private verification (future)

---

## Success Criteria

- ✅ On-chain registry deployed and operational
- ✅ Attester adapter integrates with KYC/KYB providers
- ✅ Proof verification works for all flag combinations
- ✅ RWA token enforces compliance
- ✅ Integration with Identity Grid and Dream State
- ✅ Mini-apps use registry flags for access control

---

## Next Steps

1. Deploy DreamRegistry.sol contract
2. Implement attester adapter
3. Create proof verifier
4. Deploy RWA token
5. Integrate with existing systems

