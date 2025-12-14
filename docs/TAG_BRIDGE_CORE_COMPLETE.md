# TAG Bridge Core - Complete Documentation

**Generated**: 2025-01-27  
**Status**: Complete System Documentation

---

## Overview

TAG Bridge Core provides **cryptographic integration** between Trusted Agent Gateway (TAG) and DreamNet. It enables cryptographic signing, verification, webhook inspection, and chain anchoring for secure, verifiable operations across DreamNet systems.

---

## Key Features

### Cryptographic Signing
- ed25519 signatures
- Dilithium signatures (post-quantum)
- Falcon signatures (post-quantum)
- Action signing
- Receipt generation

### Verification
- Signature verification
- Timestamp validation
- Nonce validation
- Header canonicalization
- Threat detection

### Three Bridges

1. **Snail Bridge**
   - Signs Dream Snail trails
   - Cryptographic receipts
   - Chain anchoring

2. **Shield Bridge**
   - Verifies request signatures
   - Threat detection
   - Request validation

3. **Webhook Bridge**
   - Inspects webhook calls
   - Signature verification
   - Canonical header ordering

### Chain Anchoring
- On-chain hash anchoring
- Postgres ledger
- Verifiable proofs
- Immutable records

---

## Architecture

### Components

1. **TAG Client** (`logic/tagClient.ts`)
   - TAG API communication
   - Signing requests
   - Verification requests
   - Ledger queries

2. **Snail Bridge** (`logic/snailBridge.ts`)
   - Dream Snail integration
   - Trail signing
   - Receipt generation

3. **Shield Bridge** (`logic/shieldBridge.ts`)
   - Request verification
   - Threat detection
   - Signature validation

4. **Webhook Bridge** (`logic/webhookBridge.ts`)
   - Webhook inspection
   - Signature verification
   - Header validation

---

## API Reference

### Initialization

#### `init(config: TagConfig): Promise<boolean>`
Initializes TAG Bridge.

**Example**:
```typescript
import { TagBridgeCore } from '@dreamnet/tag-bridge-core';

await TagBridgeCore.init({
  tagApiUrl: 'https://tag.dreamnet.ink',
  signingKey: process.env.TAG_SIGNING_KEY,
  verificationKey: process.env.TAG_VERIFICATION_KEY,
  chainAnchorEnabled: true,
  chainAnchorRpc: process.env.CHAIN_RPC,
  chainAnchorContract: process.env.CHAIN_CONTRACT,
  nonceTtl: 300,
  clockSkewTolerance: 60,
});
```

#### `status(): TagBridgeStatus`
Gets bridge status.

**Example**:
```typescript
const status = TagBridgeCore.status();
console.log(`Initialized: ${status.initialized}`);
console.log(`Receipts Signed: ${status.receiptsSigned}`);
console.log(`Receipts Verified: ${status.receiptsVerified}`);
```

### Snail Bridge

#### `signSnailTrail(trail: SnailTrail, actor: string): Promise<ProofOfActionReceipt | null>`
Signs Dream Snail trail.

**Example**:
```typescript
const receipt = await TagBridgeCore.signSnailTrail(snailTrail, 'wallet-address');
if (receipt) {
  console.log(`Receipt ID: ${receipt.id}`);
  console.log(`Chain Hash: ${receipt.chainHash}`);
}
```

### Shield Bridge

#### `verifyRequestSignature(signature: TagSignature, requestData: Record<string, unknown>, action: string): Promise<{ valid: boolean; threat?: Threat }>`
Verifies request signature.

**Example**:
```typescript
const result = await TagBridgeCore.verifyRequestSignature(
  signature,
  requestData,
  'api.request'
);

if (result.valid) {
  console.log('Signature valid');
} else {
  console.log(`Threat: ${result.threat}`);
}
```

### Webhook Bridge

#### `inspectWebhookCall(webhookEvent: WebhookEvent, signature?: string): Promise<TagWebhookInspectResponse>`
Inspects webhook call.

**Example**:
```typescript
const inspection = await TagBridgeCore.inspectWebhookCall(webhookEvent, signature);
console.log(`Valid: ${inspection.valid}`);
console.log(`Signature Valid: ${inspection.inspection.signatureValid}`);
console.log(`Timestamp Valid: ${inspection.inspection.timestampValid}`);
```

---

## Data Models

### TagConfig

```typescript
interface TagConfig {
  tagApiUrl: string;
  signingKey?: string; // ed25519 private key
  verificationKey?: string; // ed25519 public key
  chainAnchorEnabled?: boolean;
  chainAnchorRpc?: string;
  chainAnchorContract?: string;
  nonceTtl?: number; // seconds
  clockSkewTolerance?: number; // seconds
}
```

### TagSignature

```typescript
interface TagSignature {
  algorithm: "ed25519" | "dilithium" | "falcon";
  signature: string;
  publicKey: string;
  timestamp: number;
  nonce: string;
  headers: Record<string, string>; // Canonical header ordering
}
```

### ProofOfActionReceipt

```typescript
interface ProofOfActionReceipt {
  id: string;
  action: string; // e.g., "api.request", "webhook.call", "snail.trail"
  signature: TagSignature;
  timestamp: number;
  actor: string; // Wallet address or API key ID
  target?: string; // Target system/resource
  metadata: Record<string, unknown>;
  ledgerHash?: string; // Postgres ledger hash
  chainHash?: string; // On-chain anchor hash
  verified: boolean;
}
```

### TagBridgeStatus

```typescript
interface TagBridgeStatus {
  initialized: boolean;
  tagApiUrl: string;
  signingEnabled: boolean;
  verificationEnabled: boolean;
  chainAnchorEnabled: boolean;
  receiptsSigned: number;
  receiptsVerified: number;
  lastSignAt: number | null;
  lastVerifyAt: number | null;
}
```

---

## Signature Algorithms

### ed25519
- **Type**: Elliptic curve
- **Use**: Standard signing
- **Performance**: Fast
- **Security**: High

### Dilithium
- **Type**: Post-quantum
- **Use**: Future-proof signing
- **Performance**: Moderate
- **Security**: Post-quantum secure

### Falcon
- **Type**: Post-quantum
- **Use**: Future-proof signing
- **Performance**: Moderate
- **Security**: Post-quantum secure

---

## Three Bridges Explained

### Snail Bridge
- **Purpose**: Sign Dream Snail trails cryptographically
- **Input**: SnailTrail, actor
- **Output**: ProofOfActionReceipt
- **Features**: Chain anchoring, ledger hashing

### Shield Bridge
- **Purpose**: Verify request signatures
- **Input**: Signature, request data, action
- **Output**: Verification result, threat detection
- **Features**: Threat detection, timestamp validation

### Webhook Bridge
- **Purpose**: Inspect webhook calls
- **Input**: WebhookEvent, signature
- **Output**: Inspection result
- **Features**: Header validation, canonical ordering

---

## Chain Anchoring

### Purpose
- Immutable proof of actions
- On-chain verification
- Audit trail
- Compliance

### Implementation
- Postgres ledger
- On-chain hash anchoring
- Verifiable proofs
- Timestamp validation

---

## Integration Points

### DreamNet Systems
- **Dream Snail Core**: Trail signing
- **DreamNet Shields**: Request verification
- **Webhook Nervous Core**: Webhook inspection
- **DreamNet Audit Core**: Receipt logging

### External Systems
- **TAG API**: Signing, verification
- **Blockchain**: Chain anchoring
- **Postgres**: Ledger storage

---

## Usage Examples

### Initialize Bridge

```typescript
await TagBridgeCore.init({
  tagApiUrl: 'https://tag.dreamnet.ink',
  signingKey: process.env.TAG_SIGNING_KEY,
  chainAnchorEnabled: true,
});
```

### Sign Snail Trail

```typescript
const receipt = await TagBridgeCore.signSnailTrail(snailTrail, 'wallet-address');
console.log(`Receipt: ${receipt.id}`);
```

### Verify Request

```typescript
const result = await TagBridgeCore.verifyRequestSignature(
  signature,
  requestData,
  'api.request'
);
```

### Inspect Webhook

```typescript
const inspection = await TagBridgeCore.inspectWebhookCall(webhookEvent);
console.log(`Valid: ${inspection.valid}`);
```

---

## Best Practices

1. **Signing**
   - Use appropriate algorithms
   - Validate timestamps
   - Check nonces
   - Store receipts

2. **Verification**
   - Verify signatures immediately
   - Check timestamps
   - Validate nonces
   - Detect threats

3. **Chain Anchoring**
   - Anchor critical actions
   - Verify chain hashes
   - Monitor ledger
   - Audit regularly

---

## Security Considerations

1. **Cryptographic Security**
   - Protect signing keys
   - Use secure algorithms
   - Validate signatures
   - Monitor threats

2. **Key Management**
   - Secure key storage
   - Rotate keys regularly
   - Use environment variables
   - Audit key usage

3. **Chain Security**
   - Verify chain hashes
   - Monitor anchoring
   - Audit ledger
   - Protect contracts

---

**Status**: ✅ Complete Documentation  
**Last Updated**: 2025-01-27

