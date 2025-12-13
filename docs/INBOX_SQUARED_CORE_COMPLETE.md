# Inbox Squared Core - Complete Documentation

**Generated**: 2025-01-27  
**Status**: Complete System Documentation

---

## Overview

Inbox Squared Core provides **AI-powered intelligent email drafting** with four layers of intelligence: Research Engine, SEO + Relevance Layer, Geo Awareness, and Learning Loop. It generates personalized, context-aware email drafts that improve engagement through continuous learning.

---

## Key Features

### Four Intelligent Layers

1. **Research Engine**
   - Gathers 3-5 credible facts about recipients
   - Sources from multiple providers
   - Credibility scoring
   - Caching for performance

2. **SEO + Relevance Layer**
   - Finds trending topics
   - Industry-specific keywords
   - Recent news integration
   - Relevance scoring

3. **Geo Awareness**
   - Location-based personalization
   - Timezone optimization
   - Local events awareness
   - Cultural context
   - Optimal send time calculation

4. **Learning Loop**
   - Engagement tracking
   - Performance analysis
   - Continuous improvement
   - Pattern learning

### Email Draft Generation
- Intelligent subject lines
- Personalized body content
- HTML generation
- Variant generation
- Content twins (multi-platform)

### Gmail Integration
- Gmail API adapter
- Draft creation
- Engagement tracking
- Message management

---

## Architecture

### Components

1. **Research Engine** (`logic/researchEngine.ts`)
   - Recipient research
   - Fact gathering
   - Source validation
   - Caching

2. **Relevance Engine** (`logic/relevanceEngine.ts`)
   - Topic discovery
   - Trend analysis
   - News integration
   - Relevance scoring

3. **Geo Awareness** (`logic/geoAwareness.ts`)
   - Location detection
   - Timezone handling
   - Event discovery
   - Cultural context

4. **Learning Loop** (`logic/learningLoop.ts`)
   - Engagement tracking
   - Performance analysis
   - Pattern learning
   - Optimization

5. **Draft Generator** (`logic/draftGenerator.ts`)
   - Draft creation
   - Variant generation
   - Content twin generation
   - HTML rendering

6. **Gmail API Adapter** (`adapters/gmailApiAdapter.ts`)
   - Gmail integration
   - Draft management
   - Engagement tracking
   - Message handling

---

## API Reference

### Initialization

#### `new InboxSquared(config?: InboxSquaredConfig): InboxSquared`
Creates Inbox Squared instance.

**Example**:
```typescript
import { InboxSquared } from '@dreamnet/inbox-squared-core';

const inbox = new InboxSquared({
  gmail: {
    clientId: process.env.GMAIL_CLIENT_ID,
    clientSecret: process.env.GMAIL_CLIENT_SECRET,
    refreshToken: process.env.GMAIL_REFRESH_TOKEN,
  },
  research: {
    enabled: true,
    cacheHours: 24,
  },
  learning: {
    enabled: true,
    minSampleSize: 10,
  },
});
```

#### `initializeGmail(oauth2Client: any): void`
Initializes Gmail API adapter.

### Draft Generation

#### `generateDraft(recipientEmail: string, recipientName?: string, recipientCompany?: string, options?: DraftGenerationOptions): Promise<EmailDraft>`
Generates intelligent email draft.

**Example**:
```typescript
const draft = await inbox.generateDraft(
  'contact@example.com',
  'John Doe',
  'Example Corp',
  {
    fromName: 'DreamNet Team',
    fromEmail: 'hello@dreamnet.ink',
    tone: 'consultative',
    includeOptOut: true,
    generateVariants: true,
    generateContentTwins: true,
  }
);

console.log(`Subject: ${draft.subject}`);
console.log(`Body: ${draft.body}`);
console.log(`Research Facts: ${draft.research?.facts.length}`);
console.log(`Trending Topics: ${draft.topics?.trendingKeywords.length}`);
```

### Gmail Integration

#### `createGmailDraft(draft: EmailDraft): Promise<string>`
Creates draft in Gmail.

**Example**:
```typescript
const gmailDraftId = await inbox.createGmailDraft(draft);
console.log(`Gmail Draft ID: ${gmailDraftId}`);
```

#### `trackEngagement(messageId: string): Promise<EngagementMetrics>`
Tracks email engagement.

**Example**:
```typescript
const metrics = await inbox.trackEngagement('gmail-message-id');
console.log(`Opened: ${metrics.opened}`);
console.log(`Clicked: ${metrics.clicked}`);
console.log(`Replied: ${metrics.replied}`);
```

---

## Data Models

### EmailDraft

```typescript
interface EmailDraft {
  id: string;
  leadId?: string;
  toEmail: string;
  subject: string;
  body: string;
  html?: string;
  variants?: EmailVariant[];
  research?: RecipientResearch;
  topics?: RelevantTopics;
  geoContext?: GeoContext;
  gmailDraftId?: string;
  gmailMessageId?: string;
  createdAt: number;
  metadata?: Record<string, unknown>;
}
```

### RecipientResearch

```typescript
interface RecipientResearch {
  email: string;
  name?: string;
  company?: string;
  facts: ResearchFact[];
  sources: string[];
  cachedAt: number;
  expiresAt: number;
}
```

### RelevantTopics

```typescript
interface RelevantTopics {
  trendingKeywords: string[];
  industryTopics: string[];
  recentNews: NewsItem[];
  relevanceScore: number;
}
```

### GeoContext

```typescript
interface GeoContext {
  location?: string;
  timezone?: string;
  localEvents?: LocalEvent[];
  culturalContext?: string[];
  optimalSendTime?: Date;
}
```

### EngagementMetrics

```typescript
interface EngagementMetrics {
  messageId: string;
  threadId?: string;
  opened: boolean;
  openedAt?: string;
  clicked: boolean;
  clickedAt?: string;
  replied: boolean;
  repliedAt?: string;
  bounced: boolean;
  unsubscribed: boolean;
}
```

---

## Four Layers Explained

### Layer 1: Research Engine
- **Purpose**: Gather credible facts about recipients
- **Output**: 3-5 facts with sources
- **Credibility**: High/Medium/Low scoring
- **Caching**: 24-hour cache by default

### Layer 2: SEO + Relevance
- **Purpose**: Find trending topics and keywords
- **Output**: Trending keywords, industry topics, recent news
- **Relevance**: 0-1 scoring
- **Sources**: News APIs, trend APIs

### Layer 3: Geo Awareness
- **Purpose**: Add location-based personalization
- **Output**: Location, timezone, events, cultural context
- **Optimization**: Optimal send time calculation
- **Sources**: Geo APIs, event APIs

### Layer 4: Learning Loop
- **Purpose**: Improve drafts based on engagement
- **Input**: Engagement metrics
- **Output**: Optimized drafts
- **Learning**: Pattern recognition, A/B testing

---

## Integration Points

### DreamNet Systems
- **WolfPack Funding Core**: Enhanced email drafts
- **Orca Pack Core**: Outreach integration
- **Neural Mesh**: Pattern learning
- **Narrative Field**: Draft logging

### External Systems
- **Gmail API**: Draft creation, engagement tracking
- **Research APIs**: Fact gathering
- **News APIs**: Trend discovery
- **Geo APIs**: Location services

---

## Usage Examples

### Basic Draft Generation

```typescript
const draft = await inbox.generateDraft(
  'contact@example.com',
  'John Doe',
  'Example Corp'
);
```

### Enhanced Draft with Options

```typescript
const draft = await inbox.generateDraft(
  'contact@example.com',
  'John Doe',
  'Example Corp',
  {
    tone: 'executive',
    includeOptOut: true,
    generateVariants: true,
    generateContentTwins: true,
  }
);
```

### Gmail Integration

```typescript
inbox.initializeGmail(oauth2Client);
const draft = await inbox.generateDraft('contact@example.com');
const gmailDraftId = await inbox.createGmailDraft(draft);
```

### Engagement Tracking

```typescript
const metrics = await inbox.trackEngagement('gmail-message-id');
if (metrics.replied) {
  console.log('Recipient replied!');
}
```

---

## Best Practices

1. **Research**
   - Use cached research when available
   - Validate fact credibility
   - Update research regularly
   - Track research sources

2. **Relevance**
   - Match topics to recipient interests
   - Use trending keywords appropriately
   - Include recent news when relevant
   - Score relevance accurately

3. **Geo Awareness**
   - Respect timezones
   - Use local events appropriately
   - Consider cultural context
   - Optimize send times

4. **Learning**
   - Track engagement metrics
   - Analyze performance patterns
   - Optimize based on data
   - Test variants regularly

---

## Security Considerations

1. **Data Security**
   - Protect recipient data
   - Secure Gmail credentials
   - Encrypt cached research
   - Audit draft generation

2. **Privacy**
   - Respect opt-out requests
   - Protect email addresses
   - Secure engagement data
   - Comply with regulations

---

**Status**: ✅ Complete Documentation  
**Last Updated**: 2025-01-27

