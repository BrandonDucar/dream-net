# Whale Pack Core - Complete Documentation

**Generated**: 2025-01-27  
**Status**: Complete System Documentation

---

## Overview

Whale Pack Core provides **commerce-focused content generation and posting** for DreamNet. It manages products, audiences, TikTok content plans, engagement tracking, and generates insights for commerce optimization.

---

## Key Features

### Product Management
- Product tracking
- TikTok SKU management
- Margin estimation
- Tag management
- Active/inactive status

### Audience Management
- Audience definition
- Geographic targeting
- Tag-based segmentation
- Audience tracking

### Content Planning
- TikTok content plans
- Hook style selection
- Script generation
- Caption creation
- Hashtag management
- Sound hints

### Content Posting
- Plan execution
- Status tracking
- Failure handling
- Engagement collection

### Analytics & Insights
- Engagement statistics
- Pattern detection
- Recommendations
- Warnings

---

## Architecture

### Components

1. **Whale Store** (`store/whaleStore.ts`)
   - Product storage
   - Audience storage
   - Plan storage
   - Engagement storage
   - Insight storage

2. **Whale Signal Core** (`logic/whaleSignalCore.ts`)
   - Product/audience seeding
   - Content plan generation
   - Hook style selection
   - Script building

3. **Whale Poster Core** (`logic/whalePosterCore.ts`)
   - Content posting
   - Status updates
   - Engagement tracking

4. **Whale Analyst Core** (`logic/whaleAnalystCore.ts`)
   - Pattern analysis
   - Insight generation
   - Recommendations

5. **Whale Outreach Core** (`logic/whaleOutreachCore.ts`)
   - Outreach draft generation
   - Email creation

6. **Whale Scheduler** (`scheduler/whaleScheduler.ts`)
   - Cycle execution
   - Status updates

---

## API Reference

### Orchestration

#### `run(context: WhalePackContext): Promise<WhalePackStatus>`
Runs Whale Pack Core cycle.

#### `status(): WhalePackStatus`
Gets Whale Pack Core status.

### Product Management

#### `upsertProduct(product: WhaleProduct): WhaleProduct`
Creates or updates a product.

**Example**:
```typescript
import { WhalePackCore } from '@dreamnet/whale-pack-core';

const product = WhalePackCore.upsertProduct({
  id: 'product-123',
  name: 'DreamNet AI Agent',
  tikTokSku: 'SKU-123',
  marginEstimate: 0.7,
  tags: ['ai', 'agent', 'automation'],
  active: true,
  createdAt: Date.now(),
  updatedAt: Date.now(),
});
```

#### `listProducts(): WhaleProduct[]`
Lists all products.

### Audience Management

#### `upsertAudience(audience: WhaleAudience): WhaleAudience`
Creates or updates an audience.

**Example**:
```typescript
const audience = WhalePackCore.upsertAudience({
  id: 'audience-123',
  name: 'AI Dads in Florida',
  geo: 'US-FL',
  tags: ['dads', 'crypto', 'pickleball'],
  createdAt: Date.now(),
  updatedAt: Date.now(),
});
```

#### `listAudiences(): WhaleAudience[]`
Lists all audiences.

### Content Planning

#### `upsertPlan(plan: WhaleContentPlan): WhaleContentPlan`
Creates or updates a content plan.

#### `listPlans(): WhaleContentPlan[]`
Lists all content plans.

### Insights

#### `addInsight(insight: WhaleInsight): WhaleInsight`
Adds an insight.

#### `listInsights(): WhaleInsight[]`
Lists all insights.

---

## Data Models

### WhaleChannel

```typescript
type WhaleChannel = "tiktok";
```

### HookStyle

```typescript
type HookStyle =
  | "pattern-interrupt"
  | "storytime"
  | "tutorial"
  | "flex"
  | "pain-point";
```

### WhaleProduct

```typescript
interface WhaleProduct {
  id: string;
  name: string;
  tikTokSku?: string;
  marginEstimate?: number; // 0-1
  tags?: string[];
  active: boolean;
  createdAt: number;
  updatedAt: number;
}
```

### WhaleAudience

```typescript
interface WhaleAudience {
  id: string;
  name: string;
  geo?: string;
  tags?: string[];
  createdAt: number;
  updatedAt: number;
}
```

### WhaleContentPlan

```typescript
interface WhaleContentPlan {
  id: string;
  channel: WhaleChannel;
  status: WhalePlanStatus;
  productId: string;
  audienceId: string;
  hookStyle: HookStyle;
  hookLine: string;
  script: string;
  caption: string;
  hashtags: string[];
  soundHint?: string;
  scheduledAt?: number;
  postedAt?: number;
  failureReason?: string;
  createdAt: number;
  updatedAt: number;
}
```

---

## Hook Styles

### Pattern Interrupt
- Unexpected opening
- Attention-grabbing
- High engagement

### Storytime
- Narrative format
- Relatable content
- Emotional connection

### Tutorial
- Educational content
- How-to format
- Value-driven

### Flex
- Showcase product
- Highlight benefits
- Social proof

### Pain Point
- Problem identification
- Solution presentation
- Relatable struggles

---

## Integration Points

### DreamNet Systems
- **Field Layer**: Field tracking
- **Narrative Field**: Content logging
- **Economic Engine Core**: Commerce integration
- **Neural Mesh**: Pattern learning

### External Systems
- **TikTok**: Content posting
- **Analytics**: Engagement tracking
- **E-commerce**: Product management

---

## Usage Examples

### Create Product

```typescript
const product = WhalePackCore.upsertProduct({
  id: 'product-123',
  name: 'DreamNet AI Agent',
  tikTokSku: 'SKU-123',
  marginEstimate: 0.7,
  tags: ['ai', 'agent'],
  active: true,
  createdAt: Date.now(),
  updatedAt: Date.now(),
});
```

### Create Audience

```typescript
const audience = WhalePackCore.upsertAudience({
  id: 'audience-123',
  name: 'AI Dads in Florida',
  geo: 'US-FL',
  tags: ['dads', 'crypto'],
  createdAt: Date.now(),
  updatedAt: Date.now(),
});
```

### Run Cycle

```typescript
const status = await WhalePackCore.run({
  fieldLayer: fieldLayer,
  narrativeField: narrativeField,
  economicEngineCore: economicEngine,
  neuralMesh: neuralMesh,
});

console.log(`Products: ${status.productCount}`);
console.log(`Plans: ${status.planCount}`);
console.log(`Posted: ${status.postedCount}`);
```

---

## Best Practices

1. **Product Management**
   - Define clear products
   - Set margin estimates
   - Use appropriate tags
   - Track SKUs

2. **Audience Management**
   - Define target audiences
   - Use geographic targeting
   - Segment with tags
   - Track engagement

3. **Content Planning**
   - Match hook styles to audiences
   - Create compelling hooks
   - Write engaging scripts
   - Use relevant hashtags

---

## Security Considerations

1. **Content Security**
   - Validate content
   - Protect product data
   - Secure audience data
   - Audit posting

2. **Data Security**
   - Protect product information
   - Secure audience data
   - Validate plans
   - Prevent manipulation

---

**Status**: ✅ Complete Documentation  
**Last Updated**: 2025-01-27

