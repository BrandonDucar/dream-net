# WolfPack Mailer Core - Complete Documentation

**Generated**: 2025-01-27  
**Status**: Complete System Documentation

---

## Overview

WolfPack Mailer Core provides **email sending capabilities** for WolfPack Funding operations. It creates mailers from environment configuration, sends emails, processes send queues, and implements rate limiting to prevent spam and ensure deliverability.

---

## Key Features

### Mailer Configuration
- SMTP configuration
- Gmail-compatible
- Secure connections
- App password support

### Email Sending
- Direct email sending
- Queue processing
- Status tracking
- Error handling

### Rate Limiting
- Per-email rate limits
- Cooldown periods
- Spam prevention
- Deliverability optimization

### Queue Processing
- Batch processing
- Status updates
- Error recovery
- Retry logic

---

## Architecture

### Components

1. **Mailer** (`logic/mailer.ts`)
   - Mailer creation
   - Email sending
   - Configuration management

2. **Send Loop** (`logic/sendLoop.ts`)
   - Queue processing
   - Batch execution
   - Status management

3. **Rate Limiter** (`logic/rateLimiter.ts`)
   - Rate limit tracking
   - Cooldown management
   - Spam prevention

---

## API Reference

### Mailer Creation

#### `createMailerFromEnv(): Mailer`
Creates mailer from environment variables.

**Example**:
```typescript
import { WolfPackMailerCore } from '@dreamnet/wolfpack-mailer-core';

const mailer = WolfPackMailerCore.createMailerFromEnv();
```

### Email Sending

#### `sendMail(config: MailerConfig, to: string, subject: string, body: string): Promise<MailSendResult>`
Sends an email.

**Example**:
```typescript
const result = await WolfPackMailerCore.sendMail(
  {
    fromName: 'DreamNet Team',
    fromEmail: 'hello@dreamnet.ink',
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    user: 'hello@dreamnet.ink',
    pass: process.env.SMTP_PASSWORD,
  },
  'contact@a16z.com',
  'DreamNet Funding Opportunity',
  'Hello, we would like to discuss...'
);

if (result.success) {
  console.log('Email sent successfully');
} else {
  console.error(`Error: ${result.error}`);
}
```

### Queue Processing

#### `processSendQueueOnce(): Promise<void>`
Processes send queue once.

**Example**:
```typescript
await WolfPackMailerCore.processSendQueueOnce();
```

### Rate Limiter

#### `rateLimiter.checkRateLimit(email: string): { allowed: boolean; remaining?: number; resetAt?: number }`
Checks rate limit for an email.

#### `rateLimiter.recordSend(email: string): void`
Records email send.

#### `rateLimiter.getRateLimitStatus(email: string): RateLimitStatus`
Gets rate limit status.

---

## Data Models

### MailerConfig

```typescript
interface MailerConfig {
  fromName: string;
  fromEmail: string;
  host: string; // e.g. "smtp.gmail.com"
  port: number; // e.g. 465 or 587
  secure: boolean; // true for 465, false for 587
  user: string; // SMTP username
  pass: string; // SMTP password or app password
}
```

### MailSendResult

```typescript
interface MailSendResult {
  success: boolean;
  error?: string;
}
```

---

## SMTP Configuration

### Gmail Configuration
- **Host**: `smtp.gmail.com`
- **Port**: `465` (SSL) or `587` (TLS)
- **Secure**: `true` for 465, `false` for 587
- **User**: Gmail address
- **Pass**: App password (not regular password)

### Other Providers
- Compatible with any SMTP server
- Standard SMTP configuration
- SSL/TLS support
- Authentication required

---

## Rate Limiting

### Purpose
- Prevent spam
- Ensure deliverability
- Protect sender reputation
- Comply with provider limits

### Implementation
- Per-email tracking
- Cooldown periods
- Limit enforcement
- Status monitoring

---

## Integration Points

### DreamNet Systems
- **WolfPack Funding Core**: Email queue
- **DreamNet Alerts Core**: Error alerts
- **DreamNet Audit Core**: Email audit

### External Systems
- **SMTP Servers**: Email delivery
- **Email Providers**: Gmail, etc.
- **Analytics**: Send tracking

---

## Usage Examples

### Create Mailer

```typescript
const mailer = WolfPackMailerCore.createMailerFromEnv();
```

### Send Email

```typescript
const result = await WolfPackMailerCore.sendMail(
  {
    fromName: 'DreamNet Team',
    fromEmail: 'hello@dreamnet.ink',
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    user: 'hello@dreamnet.ink',
    pass: process.env.SMTP_PASSWORD,
  },
  'contact@a16z.com',
  'DreamNet Funding Opportunity',
  'Hello, we would like to discuss...'
);
```

### Process Queue

```typescript
await WolfPackMailerCore.processSendQueueOnce();
```

### Check Rate Limit

```typescript
const check = WolfPackMailerCore.rateLimiter.checkRateLimit('contact@a16z.com');
if (check.allowed) {
  // Send email
  WolfPackMailerCore.rateLimiter.recordSend('contact@a16z.com');
} else {
  console.log(`Rate limited. Reset at: ${check.resetAt}`);
}
```

---

## Best Practices

1. **Configuration**
   - Use app passwords for Gmail
   - Secure SMTP credentials
   - Use environment variables
   - Test configuration

2. **Email Sending**
   - Check rate limits first
   - Handle errors gracefully
   - Track send status
   - Monitor deliverability

3. **Queue Processing**
   - Process queues regularly
   - Handle failures
   - Retry failed sends
   - Monitor queue size

---

## Security Considerations

1. **SMTP Security**
   - Protect credentials
   - Use secure connections
   - Rotate passwords
   - Monitor access

2. **Email Security**
   - Validate recipients
   - Sanitize content
   - Prevent spam
   - Audit sends

---

**Status**: ✅ Complete Documentation  
**Last Updated**: 2025-01-27

