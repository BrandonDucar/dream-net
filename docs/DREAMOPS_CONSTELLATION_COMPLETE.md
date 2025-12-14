# DreamOps Constellation - Complete Documentation

**Package**: `@dreamnet/dreamops-constellation`  
**Status**: ✅ Implemented  
**Last Updated**: 2025-01-27

---

## Overview

DreamOps Constellation coordinates **handoffs between stars** (BrainHub, DeployKeeper, DreamMemory, SocialWeaver). It orchestrates dev briefs, content briefs, deployment orders, memory storage, and social posts.

### Key Features

- **Constellation Orchestration**: Coordinate between stars
- **Dev Briefs**: Route dev briefs from BrainHub to Cursor
- **Deployment Orders**: Route deployment orders to DeployKeeper
- **Content Briefs**: Route content briefs to SocialWeaver
- **Memory Storage**: Store memories in DreamMemory
- **Event Tracking**: Track constellation events

---

## API Reference

### Types

```typescript
export interface ConstellationEvent {
  id: string;
  type: "dev-brief" | "content-brief" | "deploy-order" | "memory-store" | "social-post";
  from: "BrainHub" | "DeployKeeper" | "DreamMemory" | "SocialWeaver";
  to: "BrainHub" | "DeployKeeper" | "DreamMemory" | "SocialWeaver" | "Cursor" | "Vercel" | "Telegram";
  payload: any;
  timestamp: string;
}
```

### Classes

#### `ConstellationOrchestrator`

**Properties**:
- **`brainHub: BrainHub`**
- **`deployKeeper: DeployKeeper`**
- **`dreamMemory: DreamMemory`**
- **`socialWeaver: SocialWeaver`**

**Methods**:
- **`handleDevBrief(brief): Promise<void>`**
- **`handleDeployOrder(order): Promise<void>`**
- **`handleContentBrief(brief): Promise<void>`**

---

**Status**: ✅ Implemented

