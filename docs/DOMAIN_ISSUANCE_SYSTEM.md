# DreamNet Domain Issuance System

## Vision: Domains as Digital Passports 🎫🌐

Just like Dream State Core issues passports, we can issue **domain names** as part of the identity system. Each passport holder gets their own subdomain!

## How It Works

### 1. Domain Issuance Flow

```
User gets Dream State Passport
    ↓
System automatically issues subdomain
    ↓
Domain tied to passport ID
    ↓
User can deploy apps to their domain
```

### Example:
- Passport ID: `passport:alice-001`
- Issued Domain: `alice.dreamnet.ink`
- User can deploy websites, apps, or APIs to their domain

### 2. Domain Types

**Tier 1: Personal Subdomains**
- Format: `{username}.dreamnet.ink`
- Issued automatically with passport
- Free for all passport holders

**Tier 2: Custom Domains**
- Format: `{custom-name}.dreamnet.ink`
- Requires verification/approval
- May require tokens or reputation

**Tier 3: External Domains**
- Format: `yourdomain.com`
- User provides their own domain
- DreamNet manages DNS and deployment

### 3. Integration with Dream State Core

```typescript
// When passport is issued
const passport = DreamStateCore.issuePassport({
  identityId: "user:alice",
  citizenship: "dreamnet",
  // ... other passport data
});

// Automatically issue domain
const domain = DomainIssuance.issueDomain({
  passportId: passport.id,
  requestedSubdomain: "alice", // or auto-generated
  tier: "personal",
});

// Domain is now tied to passport
// alice.dreamnet.ink → passport:alice-001
```

### 4. Domain Management Features

**Domain Registry:**
- Track all issued domains
- Link domains to passports/identities
- Manage DNS records automatically

**Deployment Integration:**
- Deploy websites to user's domain
- Auto-configure SSL certificates
- Manage routing and rewrites

**Domain Marketplace:**
- Trade domains (like NFT domains)
- Transfer ownership
- Lease domains

## Technical Implementation

### Domain Issuance Service

```typescript
// server/services/DomainIssuance.ts
export class DomainIssuance {
  // Issue domain when passport is created
  static async issueDomainForPassport(passportId: string) {
    const passport = await DreamStateCore.getPassport(passportId);
    const subdomain = this.generateSubdomain(passport.identityId);
    
    // Create DNS record
    await DNSProvider.createRecord({
      type: 'CNAME',
      name: subdomain,
      value: 'railway.dreamnet.ink', // or Railway's domain
    });
    
    // Register in domain registry
    await DomainRegistry.register({
      domain: `${subdomain}.dreamnet.ink`,
      passportId,
      owner: passport.identityId,
      issuedAt: Date.now(),
    });
    
    return { domain: `${subdomain}.dreamnet.ink` };
  }
  
  // Deploy app to user's domain
  static async deployToDomain(domain: string, deployment: DeploymentConfig) {
    // Use Railway API or our deployment platform
    // Configure domain routing
    // Set up SSL
  }
}
```

### Integration Points

1. **Dream State Core** - Issue domains with passports
2. **DomainKeeper** - Manage DNS records
3. **Deployment Platform** - Deploy to user domains
4. **Identity Grid** - Link domains to identities

## Benefits

✅ **No Vercel Needed** - Deploy directly to user domains via Railway
✅ **Identity-Based** - Domains tied to Dream State passports
✅ **Automatic Management** - DNS, SSL, routing handled automatically
✅ **User-Owned** - Users control their domains
✅ **Tradeable** - Domains can be transferred or traded

## Roadmap

**Phase 1: Basic Issuance**
- Auto-issue subdomains with passports
- Basic DNS management
- Deploy to Railway

**Phase 2: Custom Domains**
- User-requested subdomains
- Domain verification
- Custom domain support

**Phase 3: Domain Marketplace**
- Domain trading
- Domain leasing
- Domain NFTs

**Phase 4: External Domains**
- User-provided domains
- Full DNS management
- Multi-provider support

## Example Use Cases

1. **Personal Portfolio**: `alice.dreamnet.ink` - Alice's portfolio site
2. **Project Site**: `myproject.dreamnet.ink` - Project documentation
3. **API Endpoint**: `api.alice.dreamnet.ink` - Alice's API
4. **App Deployment**: `app.alice.dreamnet.ink` - Deployed app

## Next Steps

1. Create `DomainIssuance` service
2. Integrate with Dream State Core passport issuance
3. Add domain registry database
4. Build domain management UI
5. Integrate with deployment platform

