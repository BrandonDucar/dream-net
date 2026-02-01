# DreamNet Identity Layer v1 - Phase 1.5

## Overview

This module defines the **Identity Mapping Contract** between authentication providers (passkey-based) and DreamNet's IdentityGrid system.

## Key Concepts

- **authUserId**: Stable ID from auth provider (e.g., "user_abc123" from Clerk)
- **identityId**: DreamNet IdentityGrid node ID (e.g., "user:abc123")
- **DreamNetRequestContext**: Request-scoped identity context that flows through all subsystems

## Usage

### 1. After Authentication (Phase 2+)

```typescript
import { createDreamNetContext } from "@shared/identity";

// After user logs in with passkey
const ctx = createDreamNetContext(
  authUserId,      // from auth provider
  displayName,     // optional
  email,           // optional
  meta             // optional
);

// ctx.identityId is now available for all subsystems
```

### 2. In API Routes / Server Handlers (Phase 3+)

```typescript
import { getIdentityFromContext, isValidDreamNetContext } from "@shared/identity";
import { EconomicEngineCore } from "@dreamnet/economic-engine-core";

// Extract identity from request context
const identityId = getIdentityFromContext(ctx);
if (!identityId) {
  return res.status(401).json({ error: "Unauthorized" });
}

// Use identityId in subsystems
const balance = EconomicEngineCore.getBalance(identityId, "SHEEP");
```

### 3. Agent Ownership (Phase 4+)

```typescript
import { linkIdentityToAgent, identityControlsAgent } from "@shared/identity";

// Link identity to agent
linkIdentityToAgent("user:brandon", "agent:WolfPackFunding", "controls");

// Check if identity controls agent
if (identityControlsAgent("user:brandon", "agent:WolfPackFunding")) {
  // Allow action
}
```

## Subsystem Integration

All subsystems are ready to accept `identityId`:

- ✅ **EconomicEngineCore**: Uses `identityId` in `getBalance()` and `recordRawReward()`
- ✅ **SocialHubCore**: Uses `authorIdentityId` in `createPost()`, `addComment()`, `addReaction()`
- ✅ **DreamTankCore**: Uses `ownerIdentityId` in `upsertDream()`
- ⚠️ **WolfPackFundingCore**: TODO - Add identityId for lead ownership and permissions

## Next Steps

1. **Phase 1**: Choose auth provider (Clerk, Auth.js, Supabase)
2. **Phase 2**: Wire IdentityGrid mapping on first login
3. **Phase 3**: Add session middleware to extract identity from requests
4. **Phase 4**: Implement agent ownership model
5. **Phase 5**: Build passkey UI/UX

## Helper Functions

- `authUserIdToIdentityId(authUserId)` - Convert auth ID to identity ID
- `ensureUserIdentity(authUserId, displayName?, email?)` - Create identity in IdentityGrid
- `linkIdentityToAgent(identityId, agentId, linkType?)` - Link identity to agent
- `getIdentityAgents(identityId)` - Get all agents controlled by identity
- `identityControlsAgent(identityId, agentId)` - Check agent control
- `createDreamNetContext(authUserId, ...)` - Create request context
- `getIdentityFromContext(ctx)` - Extract identity from context
- `isValidDreamNetContext(ctx)` - Validate context

