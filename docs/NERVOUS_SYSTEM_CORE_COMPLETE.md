# Nervous System Core - Complete Documentation

**Package**: `@dreamnet/nervous-system-core`  
**Status**: ✅ Implemented  
**Last Updated**: 2025-01-27

---

## Overview

Nervous System Core is DreamNet's **modular architecture** connecting Citadel, Drone Dome, Shared Memory, and Message Bus. It serves as the central nervous system for the entire DreamNet ecosystem.

### Key Features

- **Message Bus**: Topic-based message routing (Spinal Cord)
- **Shared Memory**: Three-layer memory system (Hippocampus)
- **Citadel Integration**: Planning and orchestration (Prefrontal Cortex)
- **Drone Dome Integration**: World scanning and telemetry (Sensory Cortex)
- **Role-Based Routing**: Messages filtered by role (sensor, orchestrator, worker, system)
- **Topic Subscriptions**: Subscribe to specific topics

---

## Architecture

### How It Works

```
Message → Message Bus → Topic Router → Subscribers → Shared Memory → Neural Mesh
```

1. **Message Publishing**: Components publish messages to the bus
2. **Topic Routing**: Messages routed by topic to subscribers
3. **Shared Memory**: KV, Document, and Vector storage
4. **Neural Mesh Integration**: Vector operations use Neural Mesh
5. **Citadel/Drone Dome**: Integration with planning and sensing systems

### Why This Design

- **Biomimetic**: Mirrors biological nervous system architecture
- **Modular**: Separate concerns (messaging, memory, orchestration)
- **Scalable**: Topic-based routing scales to millions of messages
- **Flexible**: Role-based filtering enables fine-grained control

---

## API Reference

### Types

```typescript
export type Role = 'sensor' | 'orchestrator' | 'worker' | 'system';

export type Topic = 
  | 'intel.snapshot' 
  | 'task.plan' 
  | 'task.exec' 
  | 'alert' 
  | 'telemetry' 
  | 'state.delta';

export interface NervousMessage<T = unknown> {
  id: string;        // ULID
  ts: number;        // epoch ms
  role: Role;
  topic: Topic;
  key?: string;      // routing key (wallet, appId)
  corr?: string;     // correlation id
  ttlMs?: number;    // optional expiry
  priority?: 1|2|3;  // 1=high, 2=medium, 3=low
  payload: T;
  sig?: string;      // optional signed envelope
}

export interface SharedMemoryKV {
  get<T>(key: string): Promise<T|null>;
  put<T>(key: string, value: T, ttlSec?: number): Promise<void>;
  del(key: string): Promise<void>;
}

export interface SharedMemoryDoc {
  read(id: string): Promise<Record<string,any>|null>;
  upsert(id: string, doc: Record<string,any>): Promise<void>;
  query(q: Record<string,any>): Promise<Record<string,any>[]>;
}

export interface SharedMemoryVec {
  upsert(id: string, embedding: number[], meta?: Record<string,any>): Promise<void>;
  search(embedding: number[], k: number, filter?: Record<string,any>): Promise<Array<{id:string,score:number,meta:any}>>;
}

export interface SharedMemory {
  kv: SharedMemoryKV;
  doc: SharedMemoryDoc;
  vec: SharedMemoryVec;
}
```

### Main Export

#### `NervousSystemCore`

**Methods**:
- **`getMessageBus(): NervousMessageBus`**
- **`getSharedMemory(): SharedMemory`**
- **`status(): NervousSystemStatus`**

### Functions

- **`nervousMessageBus`: NervousMessageBus instance**
- **`sharedMemory`: SharedMemory instance**
- **`runCitadelWithMessageBus()`**: Run Citadel with message bus integration
- **`runDroneDomeWithMessageBus()`**: Run Drone Dome with message bus integration

---

**Status**: ✅ Implemented

