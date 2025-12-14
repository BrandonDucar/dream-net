# Domain Issuance Core - Complete Documentation

**Generated**: 2025-01-27  
**Status**: Complete System Documentation

---

## Overview

Domain Issuance Core provides **domain issuance** for DreamNet users, issuing `.dream` and `.sheep` domains tied to Dream State Passports. It enables personalized domain names, domain resolution, and external domain linking.

---

## Key Features

### Domain TLDs
- **.dream**: Primary DreamNet domain
- **.sheep**: Alternative DreamNet domain

### Domain Tiers
- **Personal**: Standard personal domains
- **Custom**: Custom-named domains
- **Premium**: Premium domains
- **External**: External domain linking

### Domain Management
- Domain issuance
- Domain resolution
- Domain lookup
- External domain linking

---

## Architecture

### Components

1. **Domain Issuance Core** (`index.ts`)
   - Domain registry
   - Domain issuance
   - Domain resolution
   - Domain management

---

## API Reference

### Domain Issuance

#### `issueDreamDomain(params: IssueDomainParams): IssuedDomain`
Issues a .dream domain to a passport holder.

**Example**:
```typescript
import { issueDreamDomain } from '@dreamnet/domain-issuance-core';

const domain = issueDreamDomain({
  passportId: 'passport:alice-001',
  walletAddress: '0x123...',
  requestedName: 'alice',
  tier: 'personal',
});

console.log(`Issued domain: ${domain.domain}`);
```

#### `issueSheepDomain(params: IssueDomainParams): IssuedDomain`
Issues a .sheep domain to a passport holder.

**Example**:
```typescript
import { issueSheepDomain } from '@dreamnet/domain-issuance-core';

const domain = issueSheepDomain({
  passportId: 'passport:alice-001',
  walletAddress: '0x123...',
  requestedName: 'alice',
  tier: 'personal',
});

console.log(`Issued domain: ${domain.domain}`);
```

### Domain Lookup

#### `getDomain(domain: string): IssuedDomain | null`
Gets domain by name.

**Example**:
```typescript
const domain = getDomain('alice.dream');
if (domain) {
  console.log(`Passport: ${domain.passportId}`);
  console.log(`Wallet: ${domain.walletAddress}`);
}
```

#### `resolveDomain(domain: string): DomainResolution | null`
Resolves domain to passport/wallet.

**Example**:
```typescript
const resolution = resolveDomain('alice.dream');
if (resolution) {
  console.log(`Passport: ${resolution.passportId}`);
  console.log(`Wallet: ${resolution.walletAddress}`);
  console.log(`Tier: ${resolution.tier}`);
}
```

### Domain Queries

#### `getDomainsForPassport(passportId: string): IssuedDomain[]`
Gets all domains for a passport.

**Example**:
```typescript
const domains = getDomainsForPassport('passport:alice-001');
domains.forEach(domain => {
  console.log(`Domain: ${domain.domain}`);
});
```

#### `getDomainsForWallet(walletAddress: string): IssuedDomain[]`
Gets all domains for a wallet.

**Example**:
```typescript
const domains = getDomainsForWallet('0x123...');
domains.forEach(domain => {
  console.log(`Domain: ${domain.domain}`);
});
```

#### `listAllDomains(): IssuedDomain[]`
Lists all issued domains.

**Example**:
```typescript
const allDomains = listAllDomains();
console.log(`Total domains: ${allDomains.length}`);
```

### External Domain Linking

#### `linkExternalDomain(dreamDomain: string, externalDomain: string): void`
Links external domain to .dream domain.

**Example**:
```typescript
linkExternalDomain('alice.dream', 'alice.com');
console.log('External domain linked');
```

---

## Data Models

### IssuedDomain

```typescript
interface IssuedDomain {
  domain: string; // e.g., "alice.dream" or "alice.sheep"
  passportId: string; // e.g., "passport:alice-001"
  walletAddress: string;
  tier: DomainTier;
  issuedAt: number;
  expiresAt?: number; // Optional expiration
  metadata?: {
    customName?: string;
    purpose?: string;
    linkedDomains?: string[]; // External domains linked to this
  };
}
```

### DomainTier

```typescript
type DomainTier = 'personal' | 'custom' | 'premium' | 'external';
```

---

## Domain Tiers Explained

### Personal
- Standard personal domains
- Auto-generated from passport
- Basic features
- Default tier

### Custom
- Custom-named domains
- User-requested names
- Personalized branding
- Custom features

### Premium
- Premium domains
- Enhanced features
- Priority support
- Advanced capabilities

### External
- External domain linking
- Third-party domains
- Domain aliasing
- Integration support

---

## Integration Points

### DreamNet Systems
- **Dream State Core**: Passport integration
- **Identity Grid**: Identity mapping
- **Namecheap API Core**: External domain management
- **DreamNet Audit Core**: Domain audit

### External Systems
- **DNS Providers**: Domain resolution
- **Domain Registrars**: External domains

---

## Usage Examples

### Issue Dream Domain

```typescript
const domain = issueDreamDomain({
  passportId: 'passport:alice-001',
  walletAddress: '0x123...',
  requestedName: 'alice',
});
```

### Issue Sheep Domain

```typescript
const domain = issueSheepDomain({
  passportId: 'passport:alice-001',
  walletAddress: '0x123...',
  requestedName: 'alice',
});
```

### Resolve Domain

```typescript
const resolution = resolveDomain('alice.dream');
if (resolution) {
  console.log(`Wallet: ${resolution.walletAddress}`);
}
```

### Link External Domain

```typescript
linkExternalDomain('alice.dream', 'alice.com');
```

---

## Best Practices

1. **Domain Issuance**
   - Use appropriate tiers
   - Validate passport IDs
   - Check domain availability
   - Track issuance

2. **Domain Management**
   - Resolve domains properly
   - Link external domains
   - Monitor expiration
   - Update metadata

---

## Security Considerations

1. **Domain Security**
   - Validate passport ownership
   - Secure domain registry
   - Prevent domain hijacking
   - Audit domain changes

2. **Resolution Security**
   - Validate resolutions
   - Secure lookups
   - Protect privacy
   - Monitor access

---

**Status**: ✅ Complete Documentation  
**Last Updated**: 2025-01-27

