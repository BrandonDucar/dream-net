# Chat RocketChat - Complete Documentation

**Generated**: 2025-01-27  
**Status**: Complete System Documentation

---

## Overview

Chat RocketChat provides **self-hosted chat integration** for DreamNet's Pods vertical. It integrates with Rocket.Chat API for team communication, enabling self-hosted chat rooms, direct messages, and team collaboration within DreamNet pods.

---

## Key Features

### Chat Operations
- Room management
- Message sending
- User authentication
- Room types (channel, private, direct, livechat)

### API Integration
- Rocket.Chat API integration
- Self-hosted server support
- Authentication handling
- Error handling

---

## Architecture

### Components

1. **RocketChat Client** (`RocketChatClient.ts`)
   - API client wrapper
   - Chat operations
   - Authentication management

---

## API Reference

### Initialization

#### `new RocketChatClient(config: RocketChatConfig): RocketChatClient`
Creates RocketChat client instance.

**Example**:
```typescript
import { RocketChatClient } from '@dreamnet/chat-rocketchat';

const client = new RocketChatClient({
  serverUrl: 'https://chat.example.com',
  userId: 'user-id',
  authToken: 'auth-token',
});
```

### Authentication

#### `login(username: string, password: string): Promise<{ success: boolean; error?: string }>`
Logs in to Rocket.Chat.

**Example**:
```typescript
const result = await client.login('username', 'password');
if (result.success) {
  console.log('Logged in successfully');
}
```

### Room Operations

#### `getRooms(): Promise<RocketChatRoom[]>`
Gets list of rooms.

**Example**:
```typescript
const rooms = await client.getRooms();
rooms.forEach(room => {
  console.log(`${room.name}: ${room.t}`);
});
```

#### `sendMessage(roomId: string, message: string): Promise<{ success: boolean; messageId?: string; error?: string }>`
Sends message to room.

**Example**:
```typescript
const result = await client.sendMessage('room-id', 'Hello!');
if (result.success) {
  console.log(`Message sent: ${result.messageId}`);
}
```

---

## Data Models

### RocketChatConfig

```typescript
interface RocketChatConfig {
  serverUrl: string;
  userId?: string;
  authToken?: string;
}
```

### RocketChatRoom

```typescript
interface RocketChatRoom {
  _id: string;
  name?: string;
  t: "c" | "p" | "d" | "l"; // channel, private, direct, livechat
  usernames?: string[];
  topic?: string;
  description?: string;
}
```

### RocketChatMessage

```typescript
interface RocketChatMessage {
  _id: string;
  rid: string;
  msg: string;
  ts: string;
  u: {
    _id: string;
    username: string;
    name?: string;
  };
  editedAt?: string;
}
```

---

## Room Types

### Channel (c)
Public channels visible to all users.

### Private (p)
Private groups with invited members.

### Direct (d)
One-on-one direct messages.

### Livechat (l)
Customer support live chat rooms.

---

## Integration Points

### DreamNet Systems
- **Pods Vertical**: Pod communication
- **Social Hub Core**: Social integration
- **Identity Grid**: User mapping
- **DreamNet RBAC Core**: Permission management

---

## Usage Examples

### Login and Send Message

```typescript
const client = new RocketChatClient({
  serverUrl: 'https://chat.example.com',
});

await client.login('username', 'password');
await client.sendMessage('room-id', 'Hello DreamNet!');
```

---

## Best Practices

1. **Chat Management**
   - Use appropriate room types
   - Manage room memberships
   - Handle errors gracefully
   - Cache room data

2. **Authentication**
   - Store tokens securely
   - Handle token expiration
   - Refresh tokens as needed
   - Monitor auth failures

---

## Security Considerations

1. **Authentication Security**
   - Secure credentials
   - Use HTTPS
   - Validate tokens
   - Monitor access

2. **Message Security**
   - Validate message content
   - Sanitize inputs
   - Control access
   - Audit messages

---

**Status**: ✅ Complete Documentation  
**Last Updated**: 2025-01-27

