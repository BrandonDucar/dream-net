# DreamNet Domain Issuance System

## Vision: `.dream` TLD - DreamNet as Domain Registry 🎫🌐✨

DreamNet issues **`.dream` domain addresses** - a custom Top Level Domain (TLD) system! Just like Dream State Core issues passports, we issue domain names. Each citizen gets their own `.dream` address!

## How It Works

### 1. Domain Issuance Flow

```
User gets Dream State Passport
    ↓
System automatically issues .dream domain
    ↓
Domain tied to passport ID
    ↓
User owns their .dream address
    ↓
User can deploy apps, websites, APIs to their domain
```

### Example:
- Passport ID: `passport:alice-001`
- Issued Domain: `alice.dream`
- User can deploy websites, apps, or APIs to `alice.dream`
- Full ownership and control

### 2. Domain Types

**Tier 1: Personal .dream Domains** (Free with passport)
- Format: `{username}.dream`
- Examples: `alice.dream`, `bob.dream`, `creator.dream`
- Issued automatically with passport
- Free for all passport holders
- One per passport

**Tier 2: Custom .dream Domains** (Requires approval/tokens)
- Format: `{custom-name}.dream`
- Examples: `myproject.dream`, `studio.dream`, `gallery.dream`
- Requires verification/approval
- May require tokens (SHEEP) or reputation
- Can be purchased/traded

**Tier 3: Premium .dream Domains** (Auction/Marketplace)
- Format: `{premium-name}.dream`
- Examples: `art.dream`, `music.dream`, `ai.dream`
- Premium short names
- Auction-based or high token cost
- Transferable/tradeable

**Tier 4: External Domains** (User-provided)
- Format: `yourdomain.com`
- User provides their own domain
- DreamNet manages DNS and deployment
- Can link to .dream domain

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

## .dream TLD Implementation

### Option 1: Blockchain-Based (Like ENS/HNS)

Use blockchain for `.dream` domain registry:
- **Base Chain**: Deploy `.dream` registry contract on Base
- **Domain NFTs**: Each `.dream` domain is an NFT (ERC721)
- **Resolution**: Smart contract resolves domains to addresses/URLs
- **Ownership**: Transferable, tradeable, on-chain

### Option 2: Centralized Registry (Faster, Easier)

DreamNet manages `.dream` registry:
- **Database**: PostgreSQL table for domain registry
- **DNS**: Custom DNS server or DNS provider API
- **Resolution**: DreamNet DNS servers resolve `.dream` domains
- **Ownership**: Managed by Dream State Core

### Option 3: Hybrid Approach (Recommended)

- **Registry**: On-chain (Base) for ownership/provenance
- **Resolution**: DreamNet DNS servers for fast resolution
- **Management**: Dream State Core for issuance/governance

## Technical Implementation

### Domain Registry Schema

```typescript
interface DreamDomain {
  id: string;
  domain: string; // e.g., "alice.dream"
  owner: string; // passport ID or wallet address
  passportId?: string; // if tied to passport
  tier: 'personal' | 'custom' | 'premium';
  issuedAt: number;
  expiresAt?: number; // null for personal domains
  deploymentUrl?: string; // Where domain points
  ipAddress?: string; // DNS A record
  metadata: {
    description?: string;
    tags?: string[];
    verified?: boolean;
  };
  onChain?: {
    tokenId?: string; // NFT token ID if on-chain
    contractAddress?: string;
    chainId?: number;
  };
}
```

### Domain Issuance Service

```typescript
// server/services/DomainIssuance.ts
export class DomainIssuance {
  // Issue .dream domain when passport is created
  static async issueDomainForPassport(passportId: string) {
    const passport = await DreamStateCore.getPassport(passportId);
    const domainName = this.generateDomainName(passport.identityId);
    
    // Register .dream domain in DreamNet Domain Registry
    const domain = await DomainRegistry.register({
      domain: `${domainName}.dream`,
      passportId,
      owner: passport.identityId,
      tier: 'personal',
      issuedAt: Date.now(),
      expiresAt: null, // Personal domains don't expire
    });
    
    // Create DNS record for .dream resolution
    await DNSProvider.createRecord({
      type: 'A', // or CNAME to Railway
      name: domainName,
      tld: 'dream',
      value: 'railway.dreamnet.ink', // Points to Railway infrastructure
    });
    
    // Set up SSL certificate for .dream domain
    await SSLProvider.issueCertificate(`${domainName}.dream`);
    
    return { domain: `${domainName}.dream` };
  }
  
  // Request custom .dream domain
  static async requestCustomDomain(requestedName: string, passportId: string) {
    // Check availability
    if (await DomainRegistry.isTaken(`${requestedName}.dream`)) {
      throw new Error('Domain already taken');
    }
    
    // Check requirements (tokens, reputation, etc.)
    const passport = await DreamStateCore.getPassport(passportId);
    const canRequest = await this.checkDomainRequirements(passport, 'custom');
    
    if (!canRequest.allowed) {
      throw new Error(canRequest.reason);
    }
    
    // Register domain
    const domain = await DomainRegistry.register({
      domain: `${requestedName}.dream`,
      passportId,
      owner: passport.identityId,
      tier: 'custom',
      issuedAt: Date.now(),
      cost: canRequest.cost, // SHEEP tokens
    });
    
    return { domain: `${requestedName}.dream` };
  }
  
  // Deploy app to user's .dream domain
  static async deployToDomain(domain: string, deployment: DeploymentConfig) {
    // Use Railway API or our deployment platform
    // Configure domain routing for .dream
    // Set up SSL for .dream domain
    // Update DNS records
  }
  
  // Resolve .dream domain (DNS resolution)
  static async resolveDomain(domain: string): Promise<string> {
    // Check DreamNet Domain Registry
    const record = await DomainRegistry.getDomain(domain);
    if (!record) {
      throw new Error('Domain not found');
    }
    
    // Return deployment URL or IP
    return record.deploymentUrl || record.ipAddress;
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

**Phase 1: Basic .dream Issuance** ✅
- Auto-issue `.dream` domains with passports
- Database registry for domains
- Basic DNS management
- Deploy to Railway

**Phase 2: Domain Resolution** 🔄
- DreamNet DNS resolver
- Browser extension for .dream resolution
- Proxy service for .dream domains

**Phase 3: On-Chain Registry** 📋
- Deploy `.dream` registry contract on Base
- Domain NFTs (ERC721)
- On-chain ownership/provenance

**Phase 4: Domain Marketplace** 🛒
- Domain trading marketplace
- Domain auctions
- Domain leasing
- Transfer ownership

**Phase 5: Custom Domains** 🌐
- User-requested .dream names
- Domain verification
- Premium domain tiers

**Phase 6: ICANN Application** 🚀 (Long-term)
- Apply for official `.dream` TLD
- Full internet-wide support
- Standard DNS resolution everywhere

## Example Use Cases

1. **Personal Portfolio**: `alice.dream` - Alice's portfolio site
2. **Project Site**: `myproject.dream` - Project documentation  
3. **API Endpoint**: `api.alice.dream` - Alice's API
4. **App Deployment**: `app.alice.dream` - Deployed app
5. **Creator Hub**: `creator.dream` - Creator's hub
6. **Studio Site**: `studio.dream` - Creative studio
7. **Gallery**: `gallery.dream` - Art gallery
8. **Marketplace**: `shop.dream` - E-commerce site

## DNS Resolution for .dream Domains

### How Users Access .dream Domains

**Option 1: Browser Extension**
- DreamNet browser extension intercepts `.dream` domains
- Resolves via DreamNet DNS API
- Redirects to actual deployment URL

**Option 2: Custom DNS Server**
- Run DreamNet DNS servers
- Users configure DNS to use DreamNet resolvers
- Standard DNS resolution works

**Option 3: Proxy Service**
- `dreamnet.ink` acts as proxy
- `alice.dream` → `alice.dream.dreamnet.ink`
- DreamNet resolves and proxies requests

**Option 4: ICANN Application** (Long-term)
- Apply for `.dream` TLD with ICANN
- Full internet-wide support
- Requires significant investment/process

## Next Steps

1. Create `DomainIssuance` service
2. Integrate with Dream State Core passport issuance
3. Add domain registry database
4. Build domain management UI
5. Integrate with deployment platform

