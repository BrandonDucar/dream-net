# SignalGrid Core - Complete Documentation

**Package**: `@dreamnet/signalgrid-core`  
**Status**: ✅ Implemented  
**Last Updated**: 2025-01-27

---

## Overview

SignalGrid Core provides **intent-driven routing** with geo/SEO awareness. It routes intents to solvers based on domain, region, language, and search impact potential.

### Key Features

- **Intent Routing**: Route intents to optimal solvers
- **Geo/SEO Awareness**: Route based on geographic regions and SEO keywords
- **Solver Matching**: Match intents to solver capabilities
- **Search Impact Tracking**: Track search impact metrics
- **Job Management**: Manage jobs and assignments
- **Quality Scoring**: Score solver quality and job outputs

---

## API Reference

### Types

```typescript
export type IntentDomain = 'content' | 'ai_training' | 'defi' | 'gaming' | 'nft' | 'social' | 'governance' | 'infrastructure' | 'other';

export interface Intent {
  id: string;
  creatorId: string;
  domain: IntentDomain;
  title: string;
  description: string;
  geoSEO: GeoSEOMetadata;
  status: IntentStatus;
  // ... more fields
}

export interface SolverProfile {
  id: string;
  type: SolverType;
  capabilities: SolverCapabilities;
  reputation: SolverReputation;
  // ... more fields
}
```

### Functions

- **`runIntentGridRouter(payload): Promise<RoutingResult>`**

---

**Status**: ✅ Implemented

