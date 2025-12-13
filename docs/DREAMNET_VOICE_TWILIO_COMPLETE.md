# DreamNet Voice Twilio - Complete Documentation

**Generated**: 2025-01-27  
**Status**: Complete System Documentation

---

## Overview

DreamNet Voice Twilio provides **SMS/voice integration** for DreamNet using Twilio. It enables sending SMS messages, routing operational events to SMS, and formatting events for SMS delivery. Part of Phase 2 "One Mouth" - single voice channel for DreamNet.

---

## Key Features

### SMS Operations
- SMS message sending
- Event routing to SMS
- Message formatting
- Message statistics

### Twilio Integration
- Twilio initialization
- Configuration management
- Phone number management
- Message tracking

### Event Routing
- Operational event routing
- Event formatting
- Priority handling
- Template support

---

## Architecture

### Components

1. **DreamNet Voice Twilio** (`index.ts`)
   - Main API
   - SMS operations
   - Event routing
   - Status management

2. **Twilio Sender** (`logic/twilioSender.ts`)
   - Twilio initialization
   - SMS sending
   - Configuration management

3. **Message Router** (`logic/messageRouter.ts`)
   - Event routing
   - Message statistics
   - Routing logic

4. **Message Formatter** (`logic/messageFormatter.ts`)
   - Event formatting
   - Template support
   - Message formatting

---

## API Reference

### Initialization

#### `init(): Promise<boolean>`
Initializes Twilio SMS sender.

**Example**:
```typescript
import { DreamNetVoiceTwilio } from '@dreamnet/dreamnet-voice-twilio';

const initialized = await DreamNetVoiceTwilio.init();
if (initialized) {
  console.log('Twilio initialized');
}
```

### SMS Operations

#### `send(message: SMSMessage): Promise<{ success: boolean; sid?: string; error?: string }>`
Sends SMS message directly.

**Example**:
```typescript
const result = await DreamNetVoiceTwilio.send({
  to: '+1234567890',
  body: 'Hello from DreamNet!',
  from: '+0987654321',
});

if (result.success) {
  console.log(`SMS sent: ${result.sid}`);
} else {
  console.error(`Error: ${result.error}`);
}
```

### Event Routing

#### `routeEvent(event: any): Promise<{ sent: boolean; reason?: string }>`
Routes operational event to SMS.

**Example**:
```typescript
const result = await DreamNetVoiceTwilio.routeEvent({
  type: 'alert',
  severity: 'critical',
  message: 'System error detected',
});

if (result.sent) {
  console.log('Event routed to SMS');
} else {
  console.log(`Not sent: ${result.reason}`);
}
```

### Message Formatting

#### `formatEvent(event: any): string`
Formats event to SMS message.

**Example**:
```typescript
const formatted = DreamNetVoiceTwilio.formatEvent({
  type: 'alert',
  severity: 'critical',
  message: 'System error',
});

console.log(`Formatted: ${formatted}`);
```

### Status and Statistics

#### `status(): VoiceStatus`
Gets status.

**Example**:
```typescript
const status = DreamNetVoiceTwilio.status();
console.log(`Enabled: ${status.enabled}`);
console.log(`Messages sent: ${status.messagesSent}`);
console.log(`Last message: ${status.lastMessageAt}`);
```

#### `getStats()`
Gets message statistics.

**Example**:
```typescript
const stats = DreamNetVoiceTwilio.getStats();
console.log(`Total messages: ${stats.totalMessages}`);
console.log(`Messages last day: ${stats.messagesLastDay}`);
```

---

## Data Models

### TwilioConfig

```typescript
interface TwilioConfig {
  accountSid: string;
  authToken: string;
  phoneNumber: string; // Your Twilio phone number
  recipientPhoneNumber: string; // Where to send messages
}
```

### SMSMessage

```typescript
interface SMSMessage {
  to: string;
  body: string;
  from?: string;
}
```

### MessageTemplate

```typescript
interface MessageTemplate {
  eventType: string;
  template: (event: any) => string;
  priority: "low" | "medium" | "high" | "critical";
  enabled: boolean;
}
```

### VoiceStatus

```typescript
interface VoiceStatus {
  enabled: boolean;
  provider: "twilio";
  messagesSent: number;
  lastMessageAt: number | null;
  configLoaded: boolean;
}
```

---

## Configuration

### Environment Variables
- `TWILIO_ACCOUNT_SID`: Twilio account SID
- `TWILIO_AUTH_TOKEN`: Twilio auth token
- `TWILIO_PHONE_NUMBER`: Twilio phone number
- `TWILIO_RECIPIENT_PHONE_NUMBER`: Recipient phone number

### Configuration Loading
- Loads from environment variables
- Validates configuration
- Stores configuration
- Provides status

---

## Event Routing Logic

### Event Types
- Alerts
- Notifications
- System events
- Operational events

### Priority Handling
- Critical: Immediate sending
- High: High priority
- Medium: Normal priority
- Low: Low priority

### Template Support
- Event-specific templates
- Custom formatting
- Priority-based formatting
- Template enablement

---

## Integration Points

### DreamNet Systems
- **DreamNet Alerts Core**: Alert routing
- **DreamNet Incident Core**: Incident notifications
- **DreamNet OS Core**: System events
- **DreamNet Health Core**: Health alerts

### External Systems
- **Twilio**: SMS provider
- **Phone Systems**: Phone number management

---

## Usage Examples

### Initialize and Send SMS

```typescript
await DreamNetVoiceTwilio.init();

const result = await DreamNetVoiceTwilio.send({
  to: '+1234567890',
  body: 'Hello from DreamNet!',
});
```

### Route Event to SMS

```typescript
await DreamNetVoiceTwilio.routeEvent({
  type: 'alert',
  severity: 'critical',
  message: 'System error',
});
```

### Get Status

```typescript
const status = DreamNetVoiceTwilio.status();
console.log(`Messages sent: ${status.messagesSent}`);
```

---

## Best Practices

1. **SMS Management**
   - Use appropriate priorities
   - Format messages clearly
   - Track message delivery
   - Handle errors gracefully

2. **Event Routing**
   - Route critical events
   - Use templates
   - Monitor statistics
   - Optimize routing

---

## Security Considerations

1. **Configuration Security**
   - Protect Twilio credentials
   - Secure phone numbers
   - Validate configuration
   - Monitor access

2. **Message Security**
   - Validate recipients
   - Sanitize messages
   - Rate limit sending
   - Audit messages

---

**Status**: ✅ Complete Documentation  
**Last Updated**: 2025-01-27

