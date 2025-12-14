# Jamsocket Core - Complete Documentation

**Package**: `@dreamnet/jamsocket-core`  
**Status**: ✅ Implemented  
**Last Updated**: 2025-01-27

---

## Overview

Jamsocket Core provides **real-time session backend integration** for DreamNet using Jamsocket's platform. It enables creating, managing, and connecting to real-time rooms with WebSocket support.

### Key Features

- **Room Management**: Create, list, suspend, resume, and delete rooms
- **Backend Management**: Create and manage backends
- **WebSocket Support**: Get WebSocket URLs for real-time connections
- **Environment Variables**: Support for per-room environment configuration
- **Suspend/Resume**: Suspend inactive rooms to save resources

---

## API Reference

### Types

```typescript
export interface JamsocketRoom {
  id: string;
  backend: string;
  status: 'active' | 'inactive';
  createdAt: string;
}

export interface JamsocketBackend {
  name: string;
  image: string;
  env?: Record<string, string>;
}
```

### Classes

#### `JamsocketClient`

**Methods**:
- **`createRoom(backend, options?): Promise<JamsocketRoom>`**
- **`getRoom(roomId): Promise<JamsocketRoom>`**
- **`listRooms(): Promise<JamsocketRoom[]>`**
- **`suspendRoom(roomId): Promise<void>`**
- **`resumeRoom(roomId): Promise<void>`**
- **`deleteRoom(roomId): Promise<void>`**
- **`getBackend(backendName): Promise<JamsocketBackend>`**
- **`listBackends(): Promise<JamsocketBackend[]>`**
- **`createBackend(backend): Promise<JamsocketBackend>`**
- **`getWebSocketUrl(roomId): string`**

**Environment Variables**: `JAMSOCKET_API_KEY`

---

**Status**: ✅ Implemented

