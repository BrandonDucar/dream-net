# Gmail API Integration for Inbox²

## 🎯 Overview

DreamNet already has `dreamnetgmo@gmail.com` configured. This document outlines how to leverage **Gmail API** (instead of just SMTP) to unlock Inbox²'s full potential.

---

## ✅ Current Gmail Setup

### What's Already Working
- ✅ **Gmail Account**: `dreamnetgmo@gmail.com`
- ✅ **SMTP Sending**: Via App Password (`WOLFMAIL_SMTP_PASS`)
- ✅ **Gmail API Routes**: `server/routes/communication.ts`, `server/routes/google-integration.ts`
- ✅ **Rate Limiting**: 50/day default (500/day max)
- ✅ **Safety Limits**: Built-in protection against Gmail limits

### Current Limitations
- ❌ SMTP only - no read receipts
- ❌ No engagement tracking
- ❌ No draft management
- ❌ No thread/conversation tracking
- ❌ No learning from past emails

---

## 🚀 Gmail API Advantages for Inbox²

### 1. **Draft Management**
```typescript
// Create drafts directly in Gmail
await gmail.users.drafts.create({
  userId: 'me',
  requestBody: {
    message: {
      raw: encodedDraft,
      labelIds: ['DRAFT', 'INBOX_SQUARED']
    }
  }
});
```

**Benefits:**
- Drafts appear in Gmail UI
- Can be edited manually before sending
- Syncs across devices
- Better for Inbox²'s "never sends emails" philosophy

### 2. **Engagement Tracking**
```typescript
// Check if email was opened (read)
const message = await gmail.users.messages.get({
  userId: 'me',
  id: messageId,
  format: 'metadata'
});

const wasOpened = !message.data.labelIds?.includes('UNREAD');
```

**Benefits:**
- Real-time open tracking
- No webhooks needed
- Works with existing Gmail account
- Free (no additional cost)

### 3. **Reply Detection**
```typescript
// Track replies in conversation thread
const thread = await gmail.users.threads.get({
  userId: 'me',
  id: threadId
});

const hasReply = thread.data.messages.length > 1;
```

**Benefits:**
- Automatic reply detection
- Thread context for follow-ups
- Conversation history
- Perfect for Learning Loop

### 4. **Search & Learning**
```typescript
// Search past emails for patterns
const results = await gmail.users.messages.list({
  userId: 'me',
  q: 'subject:"DreamNet" from:dreamnetgmo@gmail.com',
  maxResults: 100
});
```

**Benefits:**
- Learn from successful emails
- Find what subject lines work
- Analyze tone patterns
- Build knowledge base

---

## 🔧 Implementation Plan

### Phase 1: Gmail API Setup

**Step 1: OAuth2 Configuration**
```typescript
// server/config/gmailOAuth.ts
import { google } from 'googleapis';

export function getGmailOAuth2Client() {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );
  
  // Use refresh token if available
  if (process.env.GMAIL_REFRESH_TOKEN) {
    oauth2Client.setCredentials({
      refresh_token: process.env.GMAIL_REFRESH_TOKEN
    });
  }
  
  return oauth2Client;
}
```

**Step 2: Gmail API Adapter**
```typescript
// packages/inbox-squared-core/adapters/gmailApiAdapter.ts
import { google } from 'googleapis';

export class GmailApiAdapter {
  private gmail: any;
  
  constructor(oauth2Client: any) {
    this.gmail = google.gmail({ version: 'v1', auth: oauth2Client });
  }
  
  async createDraft(to: string, subject: string, body: string): Promise<string> {
    const message = this.encodeMessage({
      to,
      subject,
      body,
      from: 'dreamnetgmo@gmail.com'
    });
    
    const draft = await this.gmail.users.drafts.create({
      userId: 'me',
      requestBody: {
        message: {
          raw: message,
          labelIds: ['DRAFT', 'INBOX_SQUARED']
        }
      }
    });
    
    return draft.data.id;
  }
  
  async sendDraft(draftId: string): Promise<string> {
    const draft = await this.gmail.users.drafts.get({
      userId: 'me',
      id: draftId
    });
    
    const sent = await this.gmail.users.messages.send({
      userId: 'me',
      requestBody: {
        raw: draft.data.message.raw,
        threadId: draft.data.message.threadId
      }
    });
    
    return sent.data.id;
  }
  
  async trackEngagement(messageId: string): Promise<EngagementMetrics> {
    const message = await this.gmail.users.messages.get({
      userId: 'me',
      id: messageId,
      format: 'metadata',
      metadataHeaders: ['From', 'Subject', 'Date']
    });
    
    const thread = await this.gmail.users.threads.get({
      userId: 'me',
      id: message.data.threadId,
      format: 'metadata'
    });
    
    return {
      opened: !message.data.labelIds?.includes('UNREAD'),
      replied: thread.data.messages.length > 1,
      clicked: false, // Would need click tracking links
      messageId: messageId,
      threadId: message.data.threadId
    };
  }
  
  private encodeMessage(email: { to: string; subject: string; body: string; from: string }): string {
    const message = [
      `To: ${email.to}`,
      `From: ${email.from}`,
      `Subject: ${email.subject}`,
      `Content-Type: text/html; charset=utf-8`,
      '',
      email.body
    ].join('\n');
    
    return Buffer.from(message).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }
}
```

### Phase 2: Integration with Inbox²

**Update Email Draft Engine:**
```typescript
// packages/wolfpack-funding-core/logic/emailDraftEngine.ts
import { GmailApiAdapter } from '@dreamnet/inbox-squared-core';
import { getGmailOAuth2Client } from '../../../server/config/gmailOAuth';

export async function generateEmailDraftForLead(
  lead: FundingLead,
  opts: { fromName: string; fromEmail: string }
): Promise<EmailDraft | null> {
  // ... existing research/relevance/geo logic ...
  
  // Create draft in Gmail instead of just returning object
  const gmailAdapter = new GmailApiAdapter(getGmailOAuth2Client());
  const gmailDraftId = await gmailAdapter.createDraft(
    lead.email!,
    subject,
    body
  );
  
  return {
    id: draftId,
    leadId: lead.id,
    toEmail: lead.email,
    subject,
    body,
    gmailDraftId, // ⭐ New: Gmail draft ID
    createdAt: now,
  };
}
```

### Phase 3: Engagement Tracking

**Poll Gmail API for Engagement:**
```typescript
// packages/inbox-squared-core/logic/engagementTracker.ts
export class EngagementTracker {
  private gmailAdapter: GmailApiAdapter;
  
  async trackAllSentEmails(): Promise<void> {
    // Get all sent emails from today
    const sentEmails = await this.gmailAdapter.listSentEmails({
      after: new Date(Date.now() - 24 * 60 * 60 * 1000) // Last 24 hours
    });
    
    for (const email of sentEmails) {
      const metrics = await this.gmailAdapter.trackEngagement(email.id);
      await this.recordMetrics(email.id, metrics);
    }
  }
  
  async recordMetrics(messageId: string, metrics: EngagementMetrics): Promise<void> {
    // Store in database for learning loop
    await db.insert(email_engagement).values({
      gmail_message_id: messageId,
      opened: metrics.opened,
      replied: metrics.replied,
      clicked: metrics.clicked,
      tracked_at: new Date()
    });
  }
}

// Run every 5 minutes
setInterval(() => {
  tracker.trackAllSentEmails();
}, 5 * 60 * 1000);
```

---

## 📊 Gmail API vs SMTP Comparison

| Feature | SMTP (Current) | Gmail API (Inbox²) |
|---------|----------------|---------------------|
| **Sending** | ✅ Yes | ✅ Yes |
| **Draft Management** | ❌ No | ✅ Yes |
| **Open Tracking** | ❌ No | ✅ Yes |
| **Reply Detection** | ❌ No | ✅ Yes |
| **Thread Tracking** | ❌ No | ✅ Yes |
| **Search Past Emails** | ❌ No | ✅ Yes |
| **Labels/Organization** | ❌ No | ✅ Yes |
| **Learning Loop** | ❌ No | ✅ Yes |
| **Cost** | Free | Free |
| **Rate Limit** | 500/day | 1B quota/day |

---

## 🔐 Gmail API Setup Steps

### 1. Enable Gmail API
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create/select project
3. Enable Gmail API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI

### 2. Get Refresh Token
```typescript
// One-time setup script
import { google } from 'googleapis';

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  'http://localhost:3000/oauth2callback'
);

const authUrl = oauth2Client.generateAuthUrl({
  access_type: 'offline',
  scope: [
    'https://www.googleapis.com/auth/gmail.send',
    'https://www.googleapis.com/auth/gmail.readonly',
    'https://www.googleapis.com/auth/gmail.modify'
  ]
});

console.log('Authorize this app by visiting:', authUrl);
// After authorization, save refresh_token to .env
```

### 3. Environment Variables
```bash
# .env
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-client-secret
GMAIL_REFRESH_TOKEN=your-refresh-token
GMAIL_USER=dreamnetgmo@gmail.com
```

---

## 🎯 Hybrid Approach

**Best of Both Worlds:**
- **SMTP** for simple, bulk sends (current system)
- **Gmail API** for Inbox² features (drafts, tracking, learning)

**Implementation:**
```typescript
// Smart email sender
export async function sendEmail(message: EmailMessage): Promise<EmailMessage> {
  if (message.metadata?.useGmailApi) {
    // Use Gmail API for tracking-enabled emails
    return await sendViaGmailAPI(message);
  } else {
    // Use SMTP for simple sends
    return await sendViaSMTP(message);
  }
}
```

---

## 📈 Expected Improvements

### With Gmail API + Inbox²:
- **Open Rate Tracking**: Know exactly which emails are opened
- **Reply Detection**: Automatic follow-up triggers
- **Learning**: Improve drafts based on real engagement
- **Draft Management**: Review/edit before sending
- **Thread Context**: Better follow-up sequences

### Metrics We Can Now Track:
- ✅ Open rate per subject line variant
- ✅ Reply rate per tone/style
- ✅ Best time to send (based on opens)
- ✅ Most effective CTAs
- ✅ Optimal email length

---

## 🚨 Migration Path

### Phase 1: Add Gmail API (Week 1)
- Set up OAuth2
- Create Gmail API adapter
- Test draft creation

### Phase 2: Hybrid Sending (Week 2)
- Add Gmail API option to email system
- Keep SMTP as fallback
- Test both methods

### Phase 3: Engagement Tracking (Week 3)
- Implement engagement polling
- Store metrics in database
- Build dashboard

### Phase 4: Learning Loop (Week 4)
- Analyze engagement patterns
- Improve draft generation
- A/B test variants

---

## ✅ Next Steps

1. **Set up Gmail API credentials** in Google Cloud Console
2. **Get refresh token** for `dreamnetgmo@gmail.com`
3. **Create Gmail API adapter** in `@dreamnet/inbox-squared-core`
4. **Integrate with existing email system**
5. **Add engagement tracking**
6. **Build learning loop**

---

**Status:** 📋 Ready to Implement  
**Priority:** 🔥 High - Unlocks full Inbox² potential  
**Account:** `dreamnetgmo@gmail.com` ✅ Already configured

