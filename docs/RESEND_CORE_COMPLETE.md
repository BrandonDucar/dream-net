# Resend Core - Complete Documentation

**Package**: `@dreamnet/resend-core`  
**Status**: ✅ Implemented  
**Last Updated**: 2025-01-27

---

## Overview

Resend Core provides **modern email API integration** for transactional emails using Resend's email service. It enables sending emails with HTML/text content, tags, and batch operations.

### Key Features

- **Email Sending**: Send transactional emails
- **HTML/Text Support**: Support for HTML and plain text emails
- **Batch Operations**: Send multiple emails in batch
- **Tags**: Tag emails for tracking and analytics
- **CC/BCC/Reply-To**: Full email header support

---

## API Reference

### Types

```typescript
export interface ResendEmailOptions {
  from: string;
  to: string | string[];
  subject: string;
  html?: string;
  text?: string;
  cc?: string | string[];
  bcc?: string | string[];
  replyTo?: string | string[];
  tags?: Array<{ name: string; value: string }>;
}

export interface ResendEmailResponse {
  id: string;
}
```

### Classes

#### `ResendClient`

**Methods**:
- **`sendEmail(options): Promise<ResendEmailResponse>`**
- **`sendBatch(emails): Promise<ResendEmailResponse[]>`**

### Functions

- **`createResendClient(): ResendClient | null`**
- **`getResendClient(): ResendClient | null`**

**Environment Variables**: `RESEND_API_KEY`

---

**Status**: ✅ Implemented

