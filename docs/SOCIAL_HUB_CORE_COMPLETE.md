# Social Hub Core - Complete Documentation

**Generated**: 2025-01-27  
**Status**: Complete System Documentation

---

## Overview

Social Hub Core provides a **social feed system** for DreamNet. It manages posts, comments, reactions, and builds personalized feeds with integration to DreamNet entities.

---

## Key Features

### Post Management
- Create and manage posts
- Multiple post types (text, media, link, system, announcement)
- Visibility controls (public, private, followers, unlisted)
- DreamNet entity references

### Comments & Reactions
- Comment threads
- Multiple reaction types (like, heart, fire, star, laugh)
- Thread management
- Reaction aggregation

### Feed System
- Personalized feed building
- Feed ranking
- Context-aware filtering
- Integration with DreamNet entities

---

## Architecture

### Components

1. **Social Store** (`store/socialStore.ts`)
   - Post storage
   - Comment storage
   - Reaction storage
   - Status tracking

2. **Feed Assembler** (`logic/feedAssembler.ts`)
   - Feed building logic
   - Ranking algorithm
   - Filtering logic

3. **Social Scheduler** (`scheduler/socialScheduler.ts`)
   - Social hub cycles
   - Feed updates
   - Integration with biomimetic systems

---

## API Reference

### Post Management

#### `createPost(params: {...}): SocialPost`
Creates a new post.

**Example**:
```typescript
const post = SocialHubCore.createPost({
  authorIdentityId: 'identity-123',
  kind: 'text',
  visibility: 'public',
  text: 'Hello DreamNet!',
  tags: ['announcement'],
  refs: [
    { type: 'dream', id: 'dream-api-platform', label: 'API Platform Dream' },
  ],
});
```

#### `upsertPost(post: Omit<SocialPost, "createdAt" | "updatedAt">): SocialPost`
Creates or updates a post.

#### `getPost(id: string): SocialPost | undefined`
Gets post by ID.

#### `listPosts(): SocialPost[]`
Lists all posts.

### Comments

#### `addComment(params: {...}): SocialComment`
Adds a comment to a post.

**Example**:
```typescript
const comment = SocialHubCore.addComment({
  postId: 'post-123',
  authorIdentityId: 'identity-456',
  text: 'Great post!',
});
```

#### `listCommentsForPost(postId: string): SocialComment[]`
Lists comments for a post.

### Reactions

#### `addReaction(params: {...}): SocialReaction`
Adds a reaction to a post.

**Example**:
```typescript
const reaction = SocialHubCore.addReaction({
  postId: 'post-123',
  reactorIdentityId: 'identity-456',
  type: 'heart',
});
```

#### `listReactionsForPost(postId: string): SocialReaction[]`
Lists reactions for a post.

### Feeds

#### `buildFeed(context: SocialHubContext, query: FeedQuery): FeedItem[]`
Builds a personalized feed.

**Example**:
```typescript
const feed = SocialHubCore.buildFeed(
  {
    identityGrid: identityGridInstance,
    reputationLattice: reputationInstance,
    fieldLayer: fieldLayerInstance,
    dreamCortex: dreamCortexInstance,
    dreamTankCore: dreamTankInstance,
    narrativeField: narrativeFieldInstance,
    neuralMesh: neuralMeshInstance,
  },
  {
    forIdentityId: 'identity-123',
    limit: 20,
  }
);

feed.forEach(item => {
  console.log(`Post: ${item.post.text}`);
  console.log(`Score: ${item.score}`);
  console.log(`Comments: ${item.comments.length}`);
  console.log(`Reactions: ${item.reactions.length}`);
});
```

### Orchestration

#### `run(context: SocialHubContext): SocialHubStatus`
Runs social hub cycle.

#### `status(): SocialHubStatus`
Gets social hub status.

---

## Data Models

### SocialPost

```typescript
interface SocialPost {
  id: string;
  authorIdentityId: string; // IdentityGrid node id
  kind: PostKind;
  visibility: PostVisibility;
  text?: string;
  mediaUrls?: string[];
  tags?: string[];
  refs?: SocialRef[]; // DreamNet entity references
  createdAt: number;
  updatedAt: number;
}
```

### PostKind

```typescript
type PostKind =
  | 'text'
  | 'media'
  | 'link'
  | 'system'
  | 'announcement';
```

### PostVisibility

```typescript
type PostVisibility =
  | 'public'
  | 'private'
  | 'followers' // Placeholder for future social logic
  | 'unlisted';
```

### SocialRef

```typescript
interface SocialRef {
  type: SocialEntityType;
  id: string; // e.g., "user:founder", "dream:dreamnet-core"
  label?: string;
}
```

### SocialEntityType

```typescript
type SocialEntityType =
  | 'identity' // IdentityGrid node
  | 'dream' // DreamCortex / DreamTank dream
  | 'token' // Ecosystem token
  | 'service' // Subsystem/service
  | 'other';
```

### SocialComment

```typescript
interface SocialComment {
  id: string;
  postId: string;
  authorIdentityId: string;
  text: string;
  createdAt: number;
  updatedAt: number;
}
```

### SocialReaction

```typescript
interface SocialReaction {
  id: string;
  postId: string;
  reactorIdentityId: string;
  type: ReactionType;
  createdAt: number;
}
```

### ReactionType

```typescript
type ReactionType =
  | 'like'
  | 'heart'
  | 'fire'
  | 'star'
  | 'laugh';
```

### FeedItem

```typescript
interface FeedItem {
  post: SocialPost;
  comments: SocialComment[];
  reactions: SocialReaction[];
  score: number; // Feed ranking score
}
```

### FeedQuery

```typescript
interface FeedQuery {
  forIdentityId?: string;
  forDreamId?: string;
  limit?: number;
}
```

---

## Post Types

### Text
- Plain text posts
- Markdown support
- Tag support

### Media
- Image/video posts
- Media URLs
- Media metadata

### Link
- Link sharing
- Link previews
- Link metadata

### System
- System-generated posts
- Automated announcements
- System notifications

### Announcement
- Official announcements
- Important updates
- Community news

---

## Feed Ranking

### Factors

1. **Recency**
   - Recent posts ranked higher
   - Time decay factor
   - Freshness bonus

2. **Engagement**
   - Comments boost score
   - Reactions boost score
   - High engagement = higher rank

3. **Author Reputation**
   - Higher reputation = higher rank
   - Trust score consideration
   - Reputation multiplier

4. **Relevance**
   - Entity references boost score
   - Tag matching
   - Context awareness

### Scoring Formula

```
Score = (recency × 0.3) + (engagement × 0.3) + (reputation × 0.2) + (relevance × 0.2)
```

---

## Integration Points

### DreamNet Systems
- **Identity Grid**: User identity
- **Reputation Lattice**: Author reputation
- **Field Layer**: Trust scores
- **Dream Cortex**: Dream references
- **Dream Tank Core**: Dream references
- **Narrative Field**: Social activity logging
- **Neural Mesh**: Pattern memory

### External Systems
- **Media Storage**: Media URLs
- **Link Previews**: Link metadata
- **Analytics**: Engagement analytics

---

## Usage Examples

### Create Post

```typescript
const post = SocialHubCore.createPost({
  authorIdentityId: 'identity-123',
  kind: 'text',
  visibility: 'public',
  text: 'Just launched my new dream! 🚀',
  tags: ['announcement', 'launch'],
  refs: [
    { type: 'dream', id: 'dream-api-platform', label: 'API Platform Dream' },
  ],
});
```

### Add Comment

```typescript
const comment = SocialHubCore.addComment({
  postId: post.id,
  authorIdentityId: 'identity-456',
  text: 'Congratulations! Looking forward to seeing it grow.',
});
```

### Add Reaction

```typescript
const reaction = SocialHubCore.addReaction({
  postId: post.id,
  reactorIdentityId: 'identity-789',
  type: 'fire',
});
```

### Build Feed

```typescript
const feed = SocialHubCore.buildFeed(
  {
    identityGrid: identityGridInstance,
    reputationLattice: reputationInstance,
    fieldLayer: fieldLayerInstance,
    dreamCortex: dreamCortexInstance,
    dreamTankCore: dreamTankInstance,
    narrativeField: narrativeFieldInstance,
    neuralMesh: neuralMeshInstance,
  },
  {
    forIdentityId: 'identity-123',
    limit: 20,
  }
);

feed.forEach(item => {
  console.log(`\nPost: ${item.post.text}`);
  console.log(`Author: ${item.post.authorIdentityId}`);
  console.log(`Score: ${item.score.toFixed(2)}`);
  console.log(`Comments: ${item.comments.length}`);
  console.log(`Reactions: ${item.reactions.length}`);
  
  const reactionCounts = item.reactions.reduce((acc, r) => {
    acc[r.type] = (acc[r.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  console.log(`Reaction breakdown:`, reactionCounts);
});
```

### Run Social Hub Cycle

```typescript
const status = SocialHubCore.run({
  identityGrid: identityGridInstance,
  reputationLattice: reputationInstance,
  fieldLayer: fieldLayerInstance,
  dreamCortex: dreamCortexInstance,
  dreamTankCore: dreamTankInstance,
  narrativeField: narrativeFieldInstance,
  neuralMesh: neuralMeshInstance,
});

console.log(`Posts: ${status.postCount}`);
console.log(`Comments: ${status.commentCount}`);
console.log(`Reactions: ${status.reactionCount}`);
```

---

## Best Practices

1. **Post Creation**
   - Use appropriate post types
   - Set correct visibility
   - Include relevant tags
   - Link to DreamNet entities

2. **Engagement**
   - Respond to comments
   - Acknowledge reactions
   - Build community
   - Share updates

3. **Feed Optimization**
   - Use entity references
   - Include relevant tags
   - Engage with content
   - Build reputation

4. **Content Quality**
   - Clear and concise
   - Relevant to community
   - Valuable information
   - Respectful communication

---

## Security Considerations

1. **Identity Verification**
   - Verify identity exists
   - Check identity status
   - Track identity changes

2. **Content Moderation**
   - Validate content
   - Sanitize user input
   - Filter inappropriate content

3. **Privacy**
   - Respect visibility settings
   - Protect private posts
   - Audit access logs

---

**Status**: ✅ Complete Documentation  
**Last Updated**: 2025-01-27

