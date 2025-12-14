# AI SEO Core - Complete Documentation

**Generated**: 2025-01-27  
**Status**: Complete System Documentation

---

## Overview

AI SEO Core provides **AI-powered SEO optimization** for DreamNet. It optimizes content for multiple platforms, manages keywords, creates geofences for location-based optimization, generates SEO insights, and applies platform-specific customizations.

---

## Key Features

### Content Optimization
- Multi-platform support
- Title optimization
- Description optimization
- Keyword integration
- Meta tags
- Structured data
- SEO scoring

### Keyword Management
- Keyword discovery
- Difficulty scoring
- Volume tracking
- Intent classification
- Relevance scoring
- Top keywords

### Geofencing
- Country-based geofences
- Region-based geofences
- City-based geofences
- Custom coordinate geofences
- Geofence rules
- Location-based optimization

### SEO Insights
- Opportunity identification
- Warning generation
- Recommendations
- Trend detection
- Priority scoring

---

## Architecture

### Components

1. **SEO Store** (`store/seoStore.ts`)
   - Optimization storage
   - Keyword storage
   - Geofence storage
   - Insight storage

2. **SEO Optimizer** (`logic/seoOptimizer.ts`)
   - Content optimization
   - SEO scoring
   - Keyword integration

3. **Geofencer** (`logic/geofencer.ts`)
   - Geofence creation
   - Location checking
   - Rule application

4. **SEO Insights** (`logic/seoInsights.ts`)
   - Insight generation
   - Pattern detection
   - Recommendation creation

5. **SEO Scheduler** (`scheduler/seoScheduler.ts`)
   - Cycle execution
   - Status updates

---

## API Reference

### Orchestration

#### `run(context: AISEOCoreContext): AISEOCoreStatus`
Runs AI SEO Core cycle.

#### `status(): AISEOCoreStatus`
Gets AI SEO Core status.

### Content Optimization

#### `optimizeContent(contentType: SEOContentType, contentId: string, platform: SEOPlatform, title?: string, description?: string): SEOOptimization`
Optimizes content for SEO.

**Example**:
```typescript
import { AISEOCore } from '@dreamnet/ai-seo-core';

const optimization = AISEOCore.optimizeContent(
  'page',
  'page-123',
  'web',
  'DreamNet - AI Platform',
  'DreamNet is a biomimetic AI platform...'
);

console.log(`SEO Score: ${optimization.score}`);
console.log(`Keywords: ${optimization.keywords.length}`);
```

#### `getOptimization(id: string): SEOOptimization | undefined`
Gets optimization by ID.

#### `listOptimizations(): SEOOptimization[]`
Lists all optimizations.

### Keywords

#### `getKeyword(keyword: string): SEOKeyword | undefined`
Gets keyword data.

#### `listKeywords(): SEOKeyword[]`
Lists all keywords.

#### `getTopKeywords(limit?: number): SEOKeyword[]`
Gets top keywords.

### Geofences

#### `createGeofence(name: string, type: Geofence["type"], options: GeofenceOptions): Geofence`
Creates a geofence.

**Example**:
```typescript
const geofence = AISEOCore.createGeofence(
  'US West Coast',
  'region',
  {
    regions: ['CA', 'OR', 'WA'],
    priority: 0.8,
  }
);
```

#### `getGeofence(id: string): Geofence | undefined`
Gets geofence by ID.

#### `listGeofences(): Geofence[]`
Lists all geofences.

#### `listActiveGeofences(): Geofence[]`
Lists active geofences.

#### `checkGeofence(location: Location): Geofence[]`
Checks location against geofences.

#### `ensureDefaultGeofences(): Geofence[]`
Ensures default geofences exist.

### Geofence Rules

#### `createGeofenceRule(geofenceId: string, action: GeofenceRule["action"], options?: RuleOptions): GeofenceRule`
Creates a geofence rule.

#### `applyGeofenceRules(geofenceIds: string[], contentType?: string, platform?: string): GeofenceRule[]`
Applies geofence rules.

### Insights

#### `generateInsights(): SEOInsight[]`
Generates SEO insights.

#### `listInsights(): SEOInsight[]`
Lists all insights.

#### `listRecentInsights(limit?: number): SEOInsight[]`
Lists recent insights.

---

## Data Models

### SEOContentType

```typescript
type SEOContentType = "page" | "post" | "product" | "agent" | "pack" | "dream" | "other";
```

### SEOPlatform

```typescript
type SEOPlatform = "web" | "twitter" | "farcaster" | "instagram" | "tiktok" | "youtube" | "linkedin";
```

### SEOOptimization

```typescript
interface SEOOptimization {
  id: string;
  contentType: SEOContentType;
  contentId: string;
  platform: SEOPlatform;
  title?: string;
  description?: string;
  keywords: SEOKeyword[];
  metaTags?: string[];
  structuredData?: Record<string, any>;
  score: number; // 0-100
  optimizedAt: number;
  lastUpdated: number;
}
```

### Geofence

```typescript
interface Geofence {
  id: string;
  name: string;
  type: "country" | "region" | "city" | "custom";
  coordinates?: { lat: number; lng: number; radius?: number };
  countries?: string[];
  regions?: string[];
  cities?: string[];
  active: boolean;
  priority: number; // 0-1
  createdAt: number;
  updatedAt: number;
}
```

---

## Content Types

### Page
- Web pages
- Landing pages
- Static content

### Post
- Blog posts
- Articles
- Dynamic content

### Product
- Product pages
- E-commerce
- Marketplace items

### Agent
- Agent profiles
- Agent pages
- Agent documentation

### Pack
- Pack profiles
- Pack pages
- Pack documentation

### Dream
- Dream pages
- Dream profiles
- Dream content

---

## Platforms

### Web
- Standard web SEO
- Search engines
- Meta tags
- Structured data

### Twitter
- Twitter optimization
- Character limits
- Hashtags
- Engagement

### Farcaster
- Farcaster optimization
- Social signals
- Community engagement

### Instagram
- Visual optimization
- Hashtags
- Captions
- Stories

### TikTok
- Video optimization
- Trends
- Hashtags
- Engagement

### YouTube
- Video SEO
- Titles
- Descriptions
- Tags

### LinkedIn
- Professional optimization
- B2B focus
- Networking
- Content sharing

---

## Integration Points

### DreamNet Systems
- **Spider Web Core**: Signal routing
- **Orca Pack Core**: Communication
- **Whale Pack Core**: Commerce
- **Narrative Field**: Content logging
- **Neural Mesh**: Pattern learning

### External Systems
- **Search Engines**: SEO indexing
- **Social Platforms**: Platform APIs
- **Analytics**: SEO analytics

---

## Usage Examples

### Optimize Content

```typescript
const optimization = AISEOCore.optimizeContent(
  'page',
  'page-123',
  'web',
  'DreamNet - AI Platform',
  'DreamNet is a biomimetic AI platform...'
);

console.log(`SEO Score: ${optimization.score}`);
optimization.keywords.forEach(kw => {
  console.log(`${kw.keyword}: ${kw.difficulty} difficulty`);
});
```

### Create Geofence

```typescript
const geofence = AISEOCore.createGeofence(
  'US West Coast',
  'region',
  {
    regions: ['CA', 'OR', 'WA'],
    priority: 0.8,
  }
);
```

### Check Geofence

```typescript
const matchingGeofences = AISEOCore.checkGeofence({
  country: 'US',
  region: 'CA',
  city: 'San Francisco',
});

matchingGeofences.forEach(gf => {
  console.log(`Matched: ${gf.name}`);
});
```

### Generate Insights

```typescript
const insights = AISEOCore.generateInsights();
insights.forEach(insight => {
  console.log(`${insight.title}: ${insight.description}`);
  console.log(`Priority: ${insight.priority}`);
});
```

---

## Best Practices

1. **Content Optimization**
   - Optimize for target platform
   - Use relevant keywords
   - Include meta tags
   - Add structured data

2. **Keyword Management**
   - Track keyword difficulty
   - Monitor search volume
   - Classify intent
   - Score relevance

3. **Geofencing**
   - Create appropriate geofences
   - Set correct priorities
   - Apply rules correctly
   - Monitor location matches

---

## Security Considerations

1. **SEO Security**
   - Validate content
   - Protect keyword data
   - Secure geofences
   - Audit optimizations

2. **Data Security**
   - Protect SEO data
   - Secure insights
   - Validate locations
   - Prevent manipulation

---

**Status**: ✅ Complete Documentation  
**Last Updated**: 2025-01-27

