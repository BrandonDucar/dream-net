# DreamNet Licensing Protocol (DLP) - System Design

**Status**: 📋 Design Document  
**Priority**: 🔴 HIGH  
**Last Updated**: 2025-01-27

---

## Overview

The **DreamNet Licensing Protocol (DLP)** is a global, decentralized licensing engine that automatically ingests, attributes, routes, and compensates content providers. It enables creator-first economics with micro-licensing at scale and AI-driven attribution.

### Core Principles

1. **Creator-First Economics**: Payments route directly to wallets → no middlemen
2. **Micro-Licensing at Scale**: Fractions of pennies per use, but millions of uses
3. **AI-Driven Attribution**: Every piece of content gets tagged, scored, and traced back to its source
4. **Global Culture Coverage**: News + memes + on-chain events + micro-communities + creators
5. **Compliance Baked In**: No scraping. Everything is consensually licensed and signed

---

## Architecture

### System Components

```
┌─────────────────────────────────────────────────────────────┐
│                    DLP Core System                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │
│  │  Ingestion   │  │ Fingerprinting│  │ Attribution  │    │
│  │   Engine     │→ │    Engine     │→ │    Engine    │    │
│  └──────────────┘  └──────────────┘  └──────────────┘    │
│                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │
│  │   Usage      │  │   Payment     │  │   Registry  │    │
│  │  Tracking    │→ │   Routing     │→ │   & Audit   │    │
│  └──────────────┘  └──────────────┘  └──────────────┘    │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Protocol Flow

1. **Ingestion**: Content enters DreamNet through APIs, uploads, chain events, or partner feeds
2. **Fingerprinting**: DreamKeeper fingerprints the content to avoid duplication
3. **Attribution**: Neural tagging engine identifies:
   - Author
   - Origin platform
   - Theme
   - Vertical
   - Emotional tone
   - Market relevance
4. **Usage Tracking**: Every agent using content pings the ledger
5. **Payment Routing**: $DREAM / $SHEEP flows to creators automatically

---

## Supported Content Types

- Articles
- Short-form video
- Sound clips
- Posts (X, Farcaster, Instagram, TikTok, Reddit)
- NFT art
- Memes
- Livestreams
- Chain data
- Community logs
- Cultural signals

---

## Component Design

### 1. Ingestion Engine

**Purpose**: Accept content from various sources

**Input Sources**:
- API endpoints (REST, GraphQL)
- File uploads (direct uploads)
- Chain events (on-chain content)
- Partner feeds (RSS, webhooks)
- Social media APIs (X, Farcaster, etc.)

**Processing**:
```typescript
interface IngestionRequest {
  source: "api" | "upload" | "chain" | "partner" | "social";
  content: {
    type: ContentType;
    data: string | Buffer | object;
    metadata?: Record<string, any>;
  };
  license: {
    terms: string; // License terms URL or text
    signature: string; // Cryptographic signature
    wallet: string; // Creator wallet address
  };
}

interface IngestionResult {
  contentId: string; // Unique content identifier
  fingerprint: string; // Content fingerprint hash
  status: "ingested" | "duplicate" | "rejected";
  duplicateOf?: string; // If duplicate, reference original
}
```

### 2. Fingerprinting Engine

**Purpose**: Generate unique fingerprints to detect duplicates

**Algorithm**:
- **Text Content**: SHA-256 hash of normalized text
- **Images**: Perceptual hash (pHash) + SHA-256 of metadata
- **Video**: Frame sampling + audio fingerprinting
- **Audio**: Chromaprint / AcoustID
- **Mixed Media**: Composite fingerprint from all components

**Implementation**:
```typescript
interface Fingerprint {
  contentId: string;
  fingerprint: string; // Primary fingerprint
  fingerprints: {
    perceptual?: string; // For images/video
    audio?: string; // For audio/video
    text?: string; // For text content
  };
  similarity: number; // Similarity score (0-1)
  duplicates: string[]; // Array of duplicate content IDs
}
```

### 3. Attribution Engine

**Purpose**: AI-driven content attribution and tagging

**Neural Tagging**:
- Uses Neural Mesh for vector embeddings
- Identifies author patterns
- Detects origin platform signatures
- Extracts themes and verticals
- Analyzes emotional tone
- Assesses market relevance

**Output**:
```typescript
interface Attribution {
  contentId: string;
  author: {
    wallet: string;
    name?: string;
    platform?: string;
    verified: boolean;
  };
  origin: {
    platform: string;
    url?: string;
    timestamp: number;
  };
  tags: {
    themes: string[];
    vertical: string;
    emotionalTone: "positive" | "neutral" | "negative" | "mixed";
    marketRelevance: number; // 0-1
  };
  score: {
    originality: number; // 0-1
    culturalResonance: number; // 0-1
    viralityPotential: number; // 0-1
  };
}
```

### 4. Usage Tracking

**Purpose**: Track every use of licensed content

**Tracking Points**:
- Agent execution (when agents use content)
- API calls (when APIs serve content)
- Social posts (when content is shared)
- Remixes (when content is transformed)
- Downloads (when content is downloaded)

**Implementation**:
```typescript
interface UsageEvent {
  contentId: string;
  usageType: "agent" | "api" | "social" | "remix" | "download";
  agentId?: string;
  userId?: string;
  timestamp: number;
  metadata?: Record<string, any>;
}

interface UsageStats {
  contentId: string;
  totalUses: number;
  usesByType: Record<string, number>;
  usesByAgent: Record<string, number>;
  lastUsed: number;
  revenueGenerated: number; // In $DREAM
}
```

### 5. Payment Routing

**Purpose**: Automatically route payments to creators

**Payment Model**:
- **Micro-Licensing**: Small payments per use (e.g., 0.001 $DREAM)
- **Tiered Pricing**: Different rates for different usage types
- **Revenue Sharing**: Platform/network takes small percentage
- **Automatic Settlement**: Payments batched and settled periodically

**Implementation**:
```typescript
interface PaymentRule {
  contentId: string;
  usageType: string;
  amount: number; // In $DREAM
  recipient: string; // Creator wallet
  platformFee: number; // Platform fee percentage
}

interface PaymentBatch {
  batchId: string;
  payments: Array<{
    recipient: string;
    amount: number;
    contentIds: string[];
  }>;
  totalAmount: number;
  transactionHash?: string;
  status: "pending" | "processing" | "completed" | "failed";
}
```

---

## Integration Points

### With DreamNet Systems

1. **Economic Engine Core**:
   - Manages $DREAM/$SHEEP token balances
   - Handles payment transactions
   - Tracks reward emissions

2. **Neural Mesh**:
   - Stores content embeddings
   - Enables similarity search
   - Powers attribution engine

3. **Agent Registry Core**:
   - Tracks agent usage of content
   - Monitors agent compliance

4. **Audit Core**:
   - Logs all licensing actions
   - Tracks payment transactions
   - Maintains compliance records

5. **Media Vault**:
   - Stores content assets
   - Manages media metadata
   - Handles content retrieval

### With External Systems

1. **Social Platforms**:
   - X (Twitter) API
   - Farcaster protocol
   - Instagram API
   - TikTok API

2. **Blockchain Networks**:
   - Base (primary network)
   - Ethereum
   - Other L2s

3. **Partner Feeds**:
   - RSS feeds
   - Webhook endpoints
   - API integrations

---

## Data Models

### Content Registry

```typescript
interface LicensedContent {
  contentId: string; // Unique identifier
  fingerprint: string; // Content fingerprint
  type: ContentType;
  
  // Licensing
  license: {
    terms: string;
    signature: string;
    wallet: string; // Creator wallet
    createdAt: number;
  };
  
  // Attribution
  attribution: Attribution;
  
  // Usage
  usage: UsageStats;
  
  // Payment
  paymentRules: PaymentRule[];
  totalRevenue: number; // In $DREAM
  
  // Metadata
  metadata: {
    title?: string;
    description?: string;
    tags: string[];
    createdAt: number;
    updatedAt: number;
  };
}
```

### License Agreement

```typescript
interface LicenseAgreement {
  agreementId: string;
  creatorWallet: string;
  terms: {
    usageTypes: string[]; // Allowed usage types
    restrictions: string[]; // Usage restrictions
    duration: "perpetual" | number; // License duration
    territory: "global" | string[]; // Geographic restrictions
  };
  pricing: {
    model: "micro" | "tiered" | "flat";
    rates: Record<string, number>; // Rates per usage type
  };
  signature: string; // Cryptographic signature
  createdAt: number;
  expiresAt?: number;
}
```

---

## API Design

### Public API

```typescript
// Ingest content
POST /api/dlp/ingest
Body: IngestionRequest
Response: IngestionResult

// Get content info
GET /api/dlp/content/:contentId
Response: LicensedContent

// Track usage
POST /api/dlp/usage
Body: UsageEvent
Response: { success: boolean }

// Get creator earnings
GET /api/dlp/earnings/:wallet
Response: {
  totalEarnings: number;
  pendingPayments: number;
  paymentHistory: PaymentBatch[];
}

// Search content
GET /api/dlp/search?q=query&type=type&vertical=vertical
Response: LicensedContent[]
```

### Internal API

```typescript
// Check license
POST /api/dlp/internal/check-license
Body: { contentId: string, usageType: string }
Response: { allowed: boolean, fee: number }

// Record usage (called by agents)
POST /api/dlp/internal/record-usage
Body: UsageEvent
Response: { success: boolean }
```

---

## Implementation Plan

### Phase 1: Core Infrastructure (Week 1-2)

1. **Create `packages/dlp-core/` package**
   - Basic structure and types
   - Ingestion engine
   - Fingerprinting engine

2. **Integrate with Economic Engine**
   - Payment routing setup
   - Token balance management

3. **Basic API endpoints**
   - Ingest endpoint
   - Content retrieval endpoint

### Phase 2: Attribution & Tracking (Week 3-4)

1. **Attribution Engine**
   - Neural Mesh integration
   - Tagging system
   - Author detection

2. **Usage Tracking**
   - Event tracking system
   - Agent integration hooks
   - Usage statistics

### Phase 3: Payment & Compliance (Week 5-6)

1. **Payment Routing**
   - Batch processing
   - Automatic settlement
   - Fee calculation

2. **Compliance System**
   - License validation
   - Signature verification
   - Audit logging

### Phase 4: Integration & Optimization (Week 7+)

1. **Social Platform Integration**
   - X API integration
   - Farcaster integration
   - Other platforms

2. **Performance Optimization**
   - Caching layer
   - Batch processing optimization
   - Database indexing

---

## Security Considerations

1. **Signature Verification**: All licenses must be cryptographically signed
2. **Duplicate Detection**: Fingerprinting prevents duplicate licensing
3. **Rate Limiting**: Prevent abuse of ingestion endpoints
4. **Access Control**: Internal APIs require authentication
5. **Audit Trail**: All actions logged for compliance

---

## Future Enhancements

1. **Smart Contracts**: On-chain license agreements
2. **NFT Integration**: License NFTs for content
3. **Multi-Chain Support**: Support multiple blockchain networks
4. **Advanced Analytics**: Creator dashboards with analytics
5. **Automated Negotiation**: AI-powered license negotiation
6. **Content Marketplace**: Built-in content marketplace

---

**Status**: 📋 Design Complete - Ready for Implementation

