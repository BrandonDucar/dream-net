# Orca Pack Core - Complete Documentation

**Generated**: 2025-01-27  
**Status**: Complete System Documentation

---

## Overview

Orca Pack Core provides **communication-focused content generation and posting** for DreamNet. It manages narrative themes, post ideas, multi-channel posting plans, engagement tracking, and generates insights for communication optimization.

---

## Key Features

### Narrative Themes
- Theme management
- Tag-based organization
- Theme tracking

### Post Ideas
- Idea generation
- Content kind selection
- Theme association
- Scoring system

### Multi-Channel Posting
- 19+ channel support
- Channel-specific rendering
- Plan management
- Status tracking

### Content Kinds
- Short text posts
- Threads
- Frames
- Images
- Videos
- Replies

### Analytics & Insights
- Engagement tracking
- Pattern detection
- Recommendations
- Warnings

---

## Architecture

### Components

1. **Orca Store** (`store/orcaStore.ts`)
   - Theme storage
   - Idea storage
   - Plan storage
   - Engagement storage
   - Insight storage

2. **Orca Signal Core** (`logic/orcaSignalCore.ts`)
   - Theme seeding
   - Idea generation
   - Plan generation
   - Channel rendering

3. **Orca Poster Core** (`logic/orcaPosterCore.ts`)
   - Content posting
   - Multi-channel execution
   - Status updates
   - Failure handling

4. **Orca Analyst Core** (`logic/orcaAnalystCore.ts`)
   - Pattern analysis
   - Insight generation
   - Recommendations

5. **Orca Outreach Core** (`logic/orcaOutreachCore.ts`)
   - Outreach draft generation
   - Inbox² integration
   - Email creation

6. **Orca Scheduler** (`scheduler/orcaScheduler.ts`)
   - Cycle execution
   - Status updates

---

## API Reference

### Orchestration

#### `run(context: OrcaPackContext): Promise<OrcaPackStatus>`
Runs Orca Pack Core cycle.

#### `status(): OrcaPackStatus`
Gets Orca Pack Core status.

### Theme Management

#### `upsertTheme(theme: OrcaNarrativeTheme): OrcaNarrativeTheme`
Creates or updates a narrative theme.

**Example**:
```typescript
import { OrcaPackCore } from '@dreamnet/orca-pack-core';

const theme = OrcaPackCore.upsertTheme({
  id: 'theme-123',
  name: 'AI Innovation',
  tags: ['ai', 'innovation', 'technology'],
  createdAt: Date.now(),
  updatedAt: Date.now(),
});
```

#### `listThemes(): OrcaNarrativeTheme[]`
Lists all themes.

### Idea Management

#### `upsertIdea(idea: OrcaPostIdea): OrcaPostIdea`
Creates or updates a post idea.

**Example**:
```typescript
const idea = OrcaPackCore.upsertIdea({
  id: 'idea-123',
  kind: 'short-text',
  themeId: 'theme-123',
  title: 'AI Innovation',
  body: 'DreamNet is revolutionizing AI...',
  tags: ['ai', 'innovation'],
  createdAt: Date.now(),
  updatedAt: Date.now(),
  score: 0.8,
});
```

#### `listIdeas(): OrcaPostIdea[]`
Lists all ideas.

### Plan Management

#### `upsertPlan(plan: OrcaPostPlan): OrcaPostPlan`
Creates or updates a post plan.

#### `listPlans(): OrcaPostPlan[]`
Lists all plans.

### Insights

#### `listInsights(): OrcaInsight[]`
Lists all insights.

---

## Data Models

### OrcaChannel

```typescript
type OrcaChannel =
  | "x" | "twitter" | "farcaster" | "base"
  | "instagram" | "threads" | "youtube" | "youtube-shorts"
  | "github" | "notion" | "slack" | "discord"
  | "telegram" | "reddit" | "linkedin"
  | "tiktok" | "facebook" | "other";
```

### OrcaContentKind

```typescript
type OrcaContentKind =
  | "short-text"
  | "thread"
  | "frame"
  | "image"
  | "video"
  | "reply";
```

### OrcaNarrativeTheme

```typescript
interface OrcaNarrativeTheme {
  id: string;
  name: string;
  tags?: string[];
  createdAt: number;
  updatedAt: number;
}
```

### OrcaPostIdea

```typescript
interface OrcaPostIdea {
  id: string;
  kind: OrcaContentKind;
  themeId: string;
  title?: string;
  body: string;
  tags?: string[];
  createdAt: number;
  updatedAt: number;
  score?: number;
}
```

### OrcaPostPlan

```typescript
interface OrcaPostPlan {
  id: string;
  ideaId: string;
  channel: OrcaChannel;
  status: OrcaPlanStatus;
  scheduledAt?: number;
  postedAt?: number;
  failureReason?: string;
  renderedTitle?: string;
  renderedBody?: string;
  renderedMeta?: Record<string, any>;
  createdAt: number;
  updatedAt: number;
}
```

---

## Supported Channels

### Social Media
- X (Twitter)
- Farcaster
- Instagram
- Threads
- TikTok
- Facebook
- LinkedIn
- Reddit

### Video Platforms
- YouTube
- YouTube Shorts

### Developer Platforms
- GitHub
- Base

### Communication
- Slack
- Discord
- Telegram

### Other
- Notion
- Other platforms

---

## Content Kinds

### Short Text
- Brief posts
- Quick updates
- Status messages

### Thread
- Multi-part posts
- Storytelling
- Detailed explanations

### Frame
- Farcaster frames
- Interactive content
- Rich media

### Image
- Visual content
- Infographics
- Memes

### Video
- Video content
- Tutorials
- Demonstrations

### Reply
- Responses
- Comments
- Engagement

---

## Integration Points

### DreamNet Systems
- **Field Layer**: Field tracking
- **Narrative Field**: Content logging
- **Economic Engine Core**: Commerce integration
- **Neural Mesh**: Pattern learning
- **Inbox Squared Core**: Outreach integration

### External Systems
- **Social Platforms**: Content posting
- **Analytics**: Engagement tracking
- **Media Aggregator**: Media collection

---

## Usage Examples

### Create Theme

```typescript
const theme = OrcaPackCore.upsertTheme({
  id: 'theme-123',
  name: 'AI Innovation',
  tags: ['ai', 'innovation'],
  createdAt: Date.now(),
  updatedAt: Date.now(),
});
```

### Create Idea

```typescript
const idea = OrcaPackCore.upsertIdea({
  id: 'idea-123',
  kind: 'short-text',
  themeId: 'theme-123',
  body: 'DreamNet is revolutionizing AI...',
  createdAt: Date.now(),
  updatedAt: Date.now(),
});
```

### Run Cycle

```typescript
const status = await OrcaPackCore.run({
  fieldLayer: fieldLayer,
  narrativeField: narrativeField,
  economicEngineCore: economicEngine,
  neuralMesh: neuralMesh,
});

console.log(`Themes: ${status.themeCount}`);
console.log(`Ideas: ${status.ideaCount}`);
console.log(`Plans: ${status.planCount}`);
console.log(`Posted: ${status.postedCount}`);
```

---

## Best Practices

1. **Theme Management**
   - Define clear themes
   - Use appropriate tags
   - Track theme performance
   - Organize themes

2. **Idea Generation**
   - Generate diverse ideas
   - Match content kinds
   - Score ideas appropriately
   - Track idea performance

3. **Multi-Channel Posting**
   - Adapt content per channel
   - Use channel-specific features
   - Track engagement per channel
   - Optimize timing

---

## Security Considerations

1. **Content Security**
   - Validate content
   - Protect theme data
   - Secure idea data
   - Audit posting

2. **Data Security**
   - Protect theme information
   - Secure idea data
   - Validate plans
   - Prevent manipulation

---

**Status**: ✅ Complete Documentation  
**Last Updated**: 2025-01-27

