# Tier IV Subsystems - Complete Summary

**Status**: ✅ Complete  
**Last Updated**: 2025-01-27  
**Understanding**: ✅ High

---

## 🎯 Executive Summary

This document provides a comprehensive summary of all Tier IV subsystems in DreamNet. Tier IV subsystems are the "Civilization & OS" layer - user-facing applications and services that build on top of the lower-tier infrastructure.

**Tier IV Subsystems**:
1. ✅ **DreamNet OS Core** - Top-level OS aggregator (fully documented)
2. ✅ **Civic Panel Core** - Admin dashboard (fully documented)
3. **Dream Vault** - Central repository
4. **Dream Shop** - Marketplace layer
5. **DreamBet Core** - Games + fairness engine
6. **Zen Garden Core** - Ritual + activity engine
7. **Social Hub Core** - Social feed layer
8. **Dream Tank Core** - Incubator engine
9. **Init Ritual Core** - Onboarding layer
10. **Liquidity Engine** - Liquidity pool registry
11. ✅ **Economic Engine Core** - Rewards + tokens (fully documented)
12. ✅ **Field Layer** - Global parameter fields (fully documented)

---

## 📦 Dream Vault

**Package**: `packages/dream-vault/`

**Purpose**: Central repository for blueprints, rituals, and assets.

**Key Functions**:
- **Item Management**: Upsert, get, list vault items
- **Item Search**: Search vault items by query
- **Item Indexing**: Index items for fast search
- **Item Versioning**: Track item versions

**Key Types**:
- `VaultItem`: Vault item (blueprint, ritual, asset)
- `VaultItemKind`: Item kind (blueprint, ritual, asset, template)
- `VaultSearchQuery`: Search query (tags, kind, text)
- `VaultIndexEntry`: Index entry for search

**Public API**:
```typescript
DreamVault.upsertItem(item)      // Upsert vault item
DreamVault.getItem(id)            // Get vault item
DreamVault.listAll()              // List all items
DreamVault.search(query)          // Search items
DreamVault.run(context)           // Run cycle
DreamVault.status()               // Get status
```

**Integration**:
- Runs in Orchestrator Phase 4 (User-facing subsystems)
- Feeds to DreamNet OS Core (status aggregation)
- Feeds to Civic Panel Core (vault widget)

---

## 📦 Dream Shop

**Package**: `packages/dream-shop/`

**Purpose**: Marketplace layer for buying/selling offers.

**Key Functions**:
- **Offer Management**: Upsert, get, list offers
- **Offer Recommendations**: Compute recommendations based on context
- **Offer State Management**: Track offer states (draft, active, sold, expired)
- **Price Management**: Manage price tags (tokens, credits, points)

**Key Types**:
- `DreamShopOffer`: Shop offer
- `OfferState`: Offer state (draft, active, sold, expired)
- `OfferCategory`: Offer category
- `PriceTag`: Price tag (token, credits, points)
- `OfferRecommendation`: Offer recommendation

**Public API**:
```typescript
DreamShop.upsertOffer(offer)     // Upsert offer
DreamShop.getOffer(id)            // Get offer
DreamShop.listOffers()            // List offers
DreamShop.recommend(context)      // Get recommendations
DreamShop.run(context)            // Run cycle
DreamShop.status()                // Get status
```

**Integration**:
- Runs in Orchestrator Phase 4 (User-facing subsystems)
- Feeds to DreamNet OS Core (status aggregation)
- Feeds to Civic Panel Core (shop widget)

---

## 📦 DreamBet Core

**Package**: `packages/dreambet-core/`

**Purpose**: Games + fairness engine for prediction markets and betting.

**Key Functions**:
- **Game Management**: Upsert, get, list game sessions
- **Round Management**: Upsert, list rounds for games
- **RNG Generation**: Generate random numbers (fairness)
- **Fairness Records**: Track fairness records for audit

**Key Types**:
- `GameSession`: Game session
- `GameType`: Game type (prediction, betting, etc.)
- `GameState`: Game state (pending, active, completed, cancelled)
- `GameRound`: Game round
- `RNGRequest`: RNG request
- `RNGResult`: RNG result
- `FairnessRecord`: Fairness record

**Public API**:
```typescript
DreamBetCore.upsertGame(game)           // Upsert game
DreamBetCore.getGame(id)                 // Get game
DreamBetCore.listGames()                 // List games
DreamBetCore.upsertRound(round)          // Upsert round
DreamBetCore.listRoundsForGame(gameId)   // List rounds
DreamBetCore.generateRNG(req)            // Generate RNG
DreamBetCore.rngToUnit(resultHex)        // Convert RNG to unit [0, 1]
DreamBetCore.rngToInt(resultHex, n)     // Convert RNG to int [0, n)
DreamBetCore.run(context)                // Run cycle
DreamBetCore.status()                    // Get status
```

**Integration**:
- Runs in Orchestrator Phase 4 (User-facing subsystems)
- Feeds to Economic Engine Core (win/participation rewards)
- Feeds to DreamNet OS Core (status aggregation)
- Feeds to Civic Panel Core (dreambet widget)

---

## 📦 Zen Garden Core

**Package**: `packages/zen-garden-core/`

**Purpose**: Ritual + activity engine for peaceful activities and meditation.

**Key Functions**:
- **Session Management**: Upsert, get, list zen sessions
- **Activity Management**: Upsert, list activities for sessions
- **Reward Computation**: Compute rewards for sessions
- **Activity Tracking**: Track activity kinds (meditation, breathing, etc.)

**Key Types**:
- `ZenSession`: Zen session
- `SessionState`: Session state (active, completed, paused)
- `ActivityRecord`: Activity record
- `ActivityKind`: Activity kind (meditation, breathing, etc.)
- `RewardRecommendation`: Reward recommendation

**Public API**:
```typescript
ZenGardenCore.upsertSession(session)              // Upsert session
ZenGardenCore.getSession(id)                      // Get session
ZenGardenCore.listSessions()                      // List sessions
ZenGardenCore.upsertActivity(record)              // Upsert activity
ZenGardenCore.listActivitiesForSession(sessionId) // List activities
ZenGardenCore.computeRewardsForSession(context, session) // Compute rewards
ZenGardenCore.run(context)                        // Run cycle
ZenGardenCore.status()                            // Get status
```

**Integration**:
- Runs in Orchestrator Phase 4 (User-facing subsystems)
- Feeds to Economic Engine Core (activity rewards → ZEN_POINTS, SHEEP)
- Feeds to DreamNet OS Core (status aggregation)
- Feeds to Civic Panel Core (zen garden widget)

---

## 📦 Social Hub Core

**Package**: `packages/social-hub-core/`

**Purpose**: Social feed layer for posts, comments, and reactions.

**Key Functions**:
- **Post Management**: Create, upsert, get, list posts
- **Comment Management**: Add, list comments for posts
- **Reaction Management**: Add, list reactions for posts
- **Feed Building**: Build social feed with scoring

**Key Types**:
- `SocialPost`: Social post
- `PostKind`: Post kind (text, image, video, link)
- `PostVisibility`: Post visibility (public, friends, private)
- `SocialComment`: Social comment
- `SocialReaction`: Social reaction
- `ReactionType`: Reaction type (like, love, etc.)
- `FeedItem`: Feed item
- `FeedQuery`: Feed query

**Public API**:
```typescript
SocialHubCore.createPost(params)              // Create post
SocialHubCore.upsertPost(post)                // Upsert post
SocialHubCore.getPost(id)                     // Get post
SocialHubCore.listPosts()                     // List posts
SocialHubCore.addComment(params)               // Add comment
SocialHubCore.listCommentsForPost(postId)      // List comments
SocialHubCore.addReaction(params)              // Add reaction
SocialHubCore.listReactionsForPost(postId)     // List reactions
SocialHubCore.buildFeed(context, query)        // Build feed
SocialHubCore.run(context)                     // Run cycle
SocialHubCore.status()                         // Get status
```

**Integration**:
- Runs in Orchestrator Phase 4 (User-facing subsystems)
- Feeds to Economic Engine Core (contribution rewards → ZEN_POINTS)
- Feeds to DreamNet OS Core (status aggregation)
- Feeds to Civic Panel Core (social hub widget)
- Uses Identity Grid (authorIdentityId for posts/comments/reactions)

---

## 📦 Dream Tank Core

**Package**: `packages/dream-tank-core/`

**Purpose**: Incubator engine for dream development and growth.

**Key Functions**:
- **Dream Management**: Upsert, get, list dream incubations
- **Milestone Management**: Upsert, list milestones for dreams
- **Dream Evaluation**: Evaluate dreams (health-check, growth-check, etc.)
- **Health Tracking**: Track dream health and stages

**Key Types**:
- `DreamIncubation`: Dream incubation
- `DreamStage`: Dream stage (seedling, sprouting, growing, mature)
- `DreamHealth`: Dream health (healthy, at-risk, critical)
- `DreamMilestone`: Dream milestone
- `MilestoneState`: Milestone state (pending, achieved, failed)
- `DreamEvaluation`: Dream evaluation
- `EvaluationKind`: Evaluation kind (health-check, growth-check, etc.)

**Public API**:
```typescript
DreamTankCore.upsertDream(dream)              // Upsert dream
DreamTankCore.getDream(id)                    // Get dream
DreamTankCore.listDreams()                    // List dreams
DreamTankCore.upsertMilestone(milestone)      // Upsert milestone
DreamTankCore.listMilestonesForDream(dreamId) // List milestones
DreamTankCore.evaluateDream(context, dream, kind) // Evaluate dream
DreamTankCore.run(context)                    // Run cycle
DreamTankCore.status()                        // Get status
```

**Integration**:
- Runs in Orchestrator Phase 4 (User-facing subsystems)
- Feeds to Economic Engine Core (milestone rewards → DREAM)
- Feeds to DreamNet OS Core (status aggregation)
- Feeds to Civic Panel Core (dream tank widget)
- Uses Identity Grid (ownerIdentityId for dreams)

---

## 📦 Init Ritual Core

**Package**: `packages/init-ritual-core/`

**Purpose**: Onboarding layer for new users/identities.

**Key Functions**:
- **Template Management**: Upsert, list init flow templates
- **Identity State Management**: Get or create identity init state
- **Flow Control**: Advance identity through init flow
- **Step Completion**: Complete init steps for identity

**Key Types**:
- `InitFlowTemplate`: Init flow template
- `InitStage`: Init stage (welcome, setup, verification, complete)
- `InitStep`: Init step
- `InitStepType`: Step type (info, action, verification)
- `IdentityInitState`: Identity init state

**Public API**:
```typescript
InitRitualCore.ensureDefaultTemplateSeeded()        // Seed default template
InitRitualCore.upsertTemplate(template)             // Upsert template
InitRitualCore.listTemplates()                       // List templates
InitRitualCore.getOrCreateIdentityState(id, templateId) // Get or create state
InitRitualCore.getIdentityState(id)                  // Get identity state
InitRitualCore.advanceIdentity(context, id, templateId) // Advance identity
InitRitualCore.completeStep(id, stepId)             // Complete step
InitRitualCore.run(context)                          // Run cycle
InitRitualCore.status()                              // Get status
```

**Integration**:
- Runs in Orchestrator Phase 4 (User-facing subsystems)
- Feeds to Economic Engine Core (completion rewards → ZEN_POINTS)
- Feeds to DreamNet OS Core (status aggregation)
- Uses Identity Grid (identityId for init state)

---

## 📦 Liquidity Engine

**Package**: `packages/liquidity-engine/`

**Purpose**: Liquidity pool registry for token liquidity management.

**Key Functions**:
- **Pool Config Management**: Upsert, get, list pool configs
- **Pool Status Management**: Get, list pool statuses
- **Pool Deployment**: Mark pools as deployed
- **Pool Activation**: Mark pools as active

**Key Types**:
- `LiquidityPoolConfig`: Pool configuration
- `LiquidityPoolStatus`: Pool status
- `PoolState`: Pool state (planned, deployed, active, paused)
- `PoolHealth`: Pool health (healthy, low-liquidity, critical)
- `ChainId`: Chain ID
- `TokenSide`: Token side (token0, token1)

**Public API**:
```typescript
LiquidityEngine.initConfigs()                    // Initialize configs
LiquidityEngine.upsertConfig(config)              // Upsert config
LiquidityEngine.getConfig(id)                    // Get config
LiquidityEngine.listConfigs()                    // List configs
LiquidityEngine.getStatus(configId)              // Get status
LiquidityEngine.listStatuses()                   // List statuses
LiquidityEngine.markPoolDeployed(configId, pairAddress) // Mark deployed
LiquidityEngine.markPoolActive(configId)         // Mark active
LiquidityEngine.run(context)                     // Run cycle
LiquidityEngine.status()                         // Get status
```

**Integration**:
- Runs in Orchestrator Phase 4 (User-facing subsystems)
- Feeds to DreamNet OS Core (status aggregation)
- Feeds to Civic Panel Core (liquidity widget)

---

## 🔗 Integration Summary

### Orchestrator Integration

All Tier IV subsystems run in **Orchestrator Phase 4** (User-facing "civilization" subsystems):

```typescript
// Phase 4: User-facing subsystems
if (ctx.ZenGardenCore?.run) { /* ... */ }
if (ctx.DreamBetCore?.run) { /* ... */ }
if (ctx.SocialHubCore?.run) { /* ... */ }
if (ctx.DreamShop?.run) { /* ... */ }
if (ctx.DreamVault?.run) { /* ... */ }
if (ctx.LiquidityEngine?.run) { /* ... */ }
```

### DreamNet OS Core Integration

All Tier IV subsystems feed status to **DreamNet OS Core**:
- DreamNet OS Core aggregates status from all subsystems
- Creates subsystem summaries (ok, warn, error, unknown)
- Calculates global health scores

### Civic Panel Core Integration

All Tier IV subsystems feed widgets to **Civic Panel Core**:
- Civic Panel Core creates widgets from subsystem statuses
- Widgets displayed in admin dashboard
- Widgets include metrics and sample data

### Economic Engine Integration

Several Tier IV subsystems feed rewards to **Economic Engine Core**:
- **Zen Garden** → Activity rewards (ZEN_POINTS, SHEEP)
- **DreamBet** → Win/participation rewards (PLAY_TOKENS, SHEEP)
- **Social Hub** → Contribution rewards (ZEN_POINTS)
- **Dream Tank** → Milestone rewards (DREAM)
- **Init Ritual** → Completion rewards (ZEN_POINTS)

### Identity Grid Integration

Several Tier IV subsystems use **Identity Grid**:
- **Social Hub** → Uses `authorIdentityId` for posts/comments/reactions
- **Dream Tank** → Uses `ownerIdentityId` for dreams
- **Init Ritual** → Uses `identityId` for init state

---

## 📊 Common Patterns

### Store Pattern

All Tier IV subsystems use in-memory stores:
- `Map<string, Entity>` for entity storage
- `Array<Entity>` for list storage
- `status()` method for status retrieval

### Scheduler Pattern

All Tier IV subsystems use schedulers:
- `runXCycle(context)` for cycle execution
- `XStatus` interface for status
- `lastRunAt` tracking

### Context Pattern

All Tier IV subsystems receive context:
- `XContext` interface with optional subsystem dependencies
- Graceful degradation (missing subsystems don't break)
- Optional Neural Mesh integration

---

## ✅ Summary

Tier IV subsystems are DreamNet's user-facing application layer:

1. **DreamNet OS Core** ✅ - Top-level OS aggregator (fully documented)
2. **Civic Panel Core** ✅ - Admin dashboard (fully documented)
3. **Dream Vault** - Central repository for blueprints/rituals/assets
4. **Dream Shop** - Marketplace for buying/selling offers
5. **DreamBet Core** - Games + fairness engine
6. **Zen Garden Core** - Ritual + activity engine
7. **Social Hub Core** - Social feed layer
8. **Dream Tank Core** - Incubator engine
9. **Init Ritual Core** - Onboarding layer
10. **Liquidity Engine** - Liquidity pool registry
11. **Economic Engine Core** ✅ - Rewards + tokens (fully documented)
12. **Field Layer** ✅ - Global parameter fields (fully documented)

**Common Characteristics**:
- All run in Orchestrator Phase 4
- All feed status to DreamNet OS Core
- All feed widgets to Civic Panel Core
- Many feed rewards to Economic Engine Core
- Many use Identity Grid for identity resolution

**Understanding**: ✅ High - Complete understanding of Tier IV subsystem purposes, APIs, and integration patterns.

---

**Last Updated**: 2025-01-27  
**Status**: ✅ Complete Summary

