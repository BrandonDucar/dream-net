# Registry Proofs Core - Complete Documentation

**Package**: `@dreamnet/registry-proofs-core`  
**Status**: ✅ Implemented  
**Last Updated**: 2025-01-27

---

## Overview

Registry Proofs Core provides **on-chain KYC/KYB attestations** for RWA readiness and DIN-style node operator verification. It uses bitmap-based registry flags and integrates with KYC/KYB providers.

### Key Features

- **KYC Verification**: Verify Know Your Customer data
- **KYB Verification**: Verify Know Your Business data
- **Sanctions Checking**: Check sanctions lists
- **Registry Flags**: Bitmap-based flag storage (KYC, KYB, ACCREDITED, REGION_US, REGION_EU, SANCTIONS_CLEAR, PROFESSIONAL_INVESTOR, NODE_OPERATOR)
- **Proof Verification**: Verify registry proofs on-chain
- **Attestation Management**: Issue and manage attestations

---

## API Reference

### Types

```typescript
export type RegistryFlag = 'KYC' | 'KYB' | 'ACCREDITED' | 'REGION_US' | 'REGION_EU' | 'SANCTIONS_CLEAR' | 'PROFESSIONAL_INVESTOR' | 'NODE_OPERATOR';

export interface RegistryProof {
  account: string;
  flags: RegistryFlag[];
  attestationHash: string;
  attester: string;
  timestamp: number;
  expiryDate?: number;
}
```

### Main Export

#### `RegistryProofsCore`

**Methods**:
- **`verifyKYC(walletAddress, kycData): Promise<AttestationResult>`**
- **`verifyKYB(companyAddress, kybData): Promise<AttestationResult>`**
- **`checkSanctions(walletAddress): Promise<SanctionsCheck>`**
- **`verifyProof(account, requiredFlags): Promise<boolean>`**
- **`hasFlag(account, flag): Promise<boolean>`**
- **`getFlags(account): Promise<RegistryFlag[]>`**

---

**Status**: ✅ Implemented

