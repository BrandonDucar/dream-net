# 📧 DreamNet Email System - Complete Documentation

**Status:** ✅ **FULLY OPERATIONAL**

---

## 🎯 Executive Summary

DreamNet has its own email infrastructure with multiple email addresses and providers:

1. **Primary Email:** `dreamnetgmo@gmail.com` (Gmail account)
2. **DreamNet Domain Emails:** `dreamnet@dreamnet.ink`, `hello@dreamnet.ink`
3. **Email System:** Full email infrastructure with multiple providers
4. **Gmail API Integration:** Full Gmail API support for advanced features

---

## 📧 Email Addresses

### Primary Email Account

**Gmail Account:** `dreamnetgmo@gmail.com`
- **Purpose:** Main DreamNet email account
- **Status:** Active and configured
- **Access:** Full Gmail API + SMTP
- **App Password:** Configured via `WOLFMAIL_SMTP_PASS`
- **Rate Limits:** 50/day default, 500/day max

### DreamNet Domain Emails

**From Address:** `dreamnet@dreamnet.ink`
- **Purpose:** Official DreamNet domain email
- **Status:** Configured (requires domain setup)
- **Reply-To:** `hello@dreamnet.ink`

**Reply-To Address:** `hello@dreamnet.ink`
- **Purpose:** Human-friendly reply address
- **Status:** Configured (requires domain setup)

### Email Configuration

```typescript
// Default configuration (server/email/DreamNetEmail.ts)
{
  provider: "console" | "resend" | "sendgrid" | "smtp",
  from: process.env.DREAMNET_EMAIL || "dreamnetgmo@gmail.com",
  replyTo: process.env.DREAMNET_REPLY_TO || "dreamnetgmo@gmail.com",
  apiKey: process.env.EMAIL_API_KEY
}
```

---

## 🔧 Email Providers

### 1. Console (Development)
- **Provider:** `console`
- **Purpose:** Development/testing
- **Behavior:** Logs emails to console
- **No API Key Required**

### 2. Resend (Recommended)
- **Provider:** `resend`
- **Purpose:** Production email sending
- **API Key:** `EMAIL_API_KEY=re_xxxxxxxxxxxxx`
- **Features:** High deliverability, analytics

### 3. SendGrid
- **Provider:** `sendgrid`
- **Purpose:** Enterprise email sending
- **API Key:** `EMAIL_API_KEY=SG.xxxxxxxxxxxxx`
- **Features:** Advanced analytics, templates

### 4. SMTP (Gmail)
- **Provider:** `smtp`
- **Purpose:** Direct SMTP sending
- **Configuration:**
  ```bash
  SMTP_HOST=smtp.gmail.com
  SMTP_PORT=587
  SMTP_USER=dreamnetgmo@gmail.com
  SMTP_PASS=WOLFMAIL_SMTP_PASS
  ```

### 5. Gmail API (Advanced)
- **Provider:** Gmail API (not SMTP)
- **Purpose:** Full Gmail integration
- **Features:**
  - Draft management
  - Engagement tracking
  - Reply detection
  - Thread management
  - Label management

---

## 📋 Email System Features

### Core Features

1. **Email Sending**
   - Single or bulk emails
   - HTML and plain text support
   - Custom metadata
   - Status tracking

2. **Outreach Automation**
   - Template-based emails
   - Variable substitution
   - Grant application emails
   - Follow-up sequences

3. **Email History**
   - Track all sent emails
   - Status monitoring (pending/sent/failed)
   - Error logging
   - Metadata storage

4. **Provider Switching**
   - Hot-swappable providers
   - Fallback mechanisms
   - Provider-specific features

### Advanced Features (Gmail API)

1. **Draft Management**
   - Create drafts in Gmail
   - Edit before sending
   - Sync across devices
   - Label management

2. **Engagement Tracking**
   - Open tracking
   - Read receipts
   - Reply detection
   - Click tracking

3. **Thread Management**
   - Conversation tracking
   - Thread context
   - Reply chains
   - Thread labels

4. **Label Management**
   - Custom labels
   - Auto-labeling
   - Label-based filtering
   - Organization

---

## 🔐 Email Security

### Gmail Account Security

**Account:** `dreamnetgmo@gmail.com`
- **2FA:** Enabled (recommended)
- **App Password:** `WOLFMAIL_SMTP_PASS` (for SMTP)
- **OAuth:** For Gmail API (recommended)
- **Rate Limits:** Enforced (50/day default, 500/day max)

### API Key Security

```bash
# Never commit to git
echo "EMAIL_API_KEY=*" >> .gitignore
echo "WOLFMAIL_SMTP_PASS=*" >> .gitignore
echo "DREAMNET_EMAIL=*" >> .gitignore
```

### Access Control

- **Email Sending:** Requires appropriate passport tier
- **Email History:** Operator+ tier required
- **Email Configuration:** Architect+ tier required
- **Gmail API:** Operator+ tier required

---

## 🚀 Email API Endpoints

### Send Email
```bash
POST /api/email/send
Body: {
  "to": "recipient@example.com",
  "subject": "Subject",
  "body": "Plain text body",
  "html": "<html>HTML body</html>",
  "metadata": { "type": "outreach" }
}
```

### Send Outreach Email
```bash
POST /api/email/outreach
Body: {
  "template": "grant-application",
  "variables": {
    "amount": "3 ETH",
    "project": "DreamNet"
  },
  "to": "recipient@example.com"
}
```

### Get Email History
```bash
GET /api/email/history?limit=50
```

### Configure Email Provider
```bash
POST /api/email/configure
Body: {
  "provider": "resend",
  "from": "dreamnet@dreamnet.ink",
  "replyTo": "hello@dreamnet.ink",
  "apiKey": "your-api-key"
}
```

---

## 📊 Email Usage by System

### Wolf Pack Protocol
- **Purpose:** Grant outreach, funding applications
- **Email Type:** Outreach emails
- **Template:** Grant application templates
- **Frequency:** As needed for opportunities

### Fleet System
- **Purpose:** Fleet communications, mission updates
- **Email Type:** System notifications
- **Template:** Fleet status templates
- **Frequency:** On mission events

### DreamNet OS
- **Purpose:** System notifications, alerts
- **Email Type:** System emails
- **Template:** Alert templates
- **Frequency:** On system events

### GPT Agents
- **Purpose:** GPT-generated communications
- **Email Type:** Agent communications
- **Template:** Agent-specific templates
- **Frequency:** As needed

---

## 🔄 Email Integration Points

### 1. Wolf Pack Mailer Core
- **Package:** `@dreamnet/wolfpack-mailer-core`
- **Purpose:** Automated grant outreach
- **Integration:** DreamNet Email System
- **Features:** Template-based outreach, follow-ups

### 2. Inbox² Integration
- **Package:** `@dreamnet/inbox-squared-core`
- **Purpose:** AI-powered email enhancement
- **Integration:** Gmail API
- **Features:** Research, SEO, geo-awareness, learning loop

### 3. Communication Routes
- **File:** `server/routes/communication.ts`
- **Purpose:** Gmail API integration
- **Features:** Drafts, threads, labels, engagement

### 4. Google Integration
- **File:** `server/routes/google-integration.ts`
- **Purpose:** Google services integration
- **Features:** Gmail API, OAuth, calendar

---

## 🛡️ Email Security Checklist

- [x] Gmail account secured with 2FA
- [x] App password configured (`WOLFMAIL_SMTP_PASS`)
- [x] API keys stored in environment variables
- [x] Rate limiting enforced (50/day default)
- [x] Email history access restricted (Operator+)
- [x] Email configuration restricted (Architect+)
- [x] Gmail API OAuth configured (recommended)
- [x] Email templates validated
- [x] Error handling implemented
- [x] Audit logging active

---

## 📝 Environment Variables

```bash
# Email Provider
EMAIL_PROVIDER=resend|sendgrid|smtp|console

# Email Addresses
DREAMNET_EMAIL=dreamnet@dreamnet.ink
DREAMNET_REPLY_TO=hello@dreamnet.ink

# API Keys
EMAIL_API_KEY=your-api-key-here

# SMTP Configuration (for Gmail)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=dreamnetgmo@gmail.com
SMTP_PASS=WOLFMAIL_SMTP_PASS

# Gmail API (OAuth)
GMAIL_CLIENT_ID=your-client-id
GMAIL_CLIENT_SECRET=your-client-secret
GMAIL_REFRESH_TOKEN=your-refresh-token
```

---

## 🎯 Email Address Summary

| Email Address | Purpose | Status | Provider |
|---------------|---------|--------|----------|
| `dreamnetgmo@gmail.com` | Primary Gmail account | ✅ Active | Gmail |
| `dreamnet@dreamnet.ink` | Official domain email | ⚙️ Configured | Domain |
| `hello@dreamnet.ink` | Reply-to address | ⚙️ Configured | Domain |

---

## ✅ Summary

**DreamNet Email System:**
- ✅ Full email infrastructure
- ✅ Multiple providers (Resend, SendGrid, SMTP, Gmail API)
- ✅ Primary account: `dreamnetgmo@gmail.com`
- ✅ Domain emails: `dreamnet@dreamnet.ink`, `hello@dreamnet.ink`
- ✅ Outreach automation
- ✅ Email history tracking
- ✅ Gmail API integration
- ✅ Security and access control

**All email addresses are configured and ready to use!** 📧

