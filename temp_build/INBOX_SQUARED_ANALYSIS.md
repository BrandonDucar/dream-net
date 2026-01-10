# Inbox² Analysis & DreamNet Integration Plan

## 📋 Executive Summary

**Inbox²** is an AI-powered communication copilot that upgrades email outreach through four intelligent layers. This document analyzes Inbox²'s capabilities and provides a comprehensive integration plan for DreamNet's existing email/outreach infrastructure.

---

## 🔍 Inbox² Core Capabilities

### Four Intelligent Layers

#### 1. **Research Engine**
- Gathers 3–5 recent, credible facts about recipient or company
- Sources: News, LinkedIn, company websites, recent announcements
- Ensures factual accuracy and relevance

#### 2. **SEO + Relevance Layer**
- Finds trending topics/keywords aligned with recipient's interests
- Ensures outreach aligns with real-world relevance
- Increases open rates through topical alignment

#### 3. **Geo Awareness**
- Adds local or event-based personalization
- Considers timing, location, and cultural context
- Makes communication feel human and timely

#### 4. **Learning Loop**
- Adjusts tone and structure based on engagement/feedback
- A/B tests subject lines, CTAs, and messaging
- Continuously improves through feedback signals

### Output Features
- ✅ First-touch and follow-up sequences
- ✅ Tone variants (casual, consultative, executive)
- ✅ A/B subject lines
- ✅ Multiple CTAs
- ✅ "Content twins" (matching social/landing copy)
- ✅ Clean previews
- ✅ Mail-merge tables
- ✅ Gmail-ready text
- ✅ Opt-out lines for compliance
- ✅ Never sends emails (draft-only)
- ✅ Never guesses or fabricates facts
- ✅ Marks unclear info clearly

---

## 🔌 Current DreamNet Email Infrastructure

### Existing Systems

#### 1. **DreamNet Email System** (`server/email/DreamNetEmail.ts`)
- ✅ Basic email sending (Resend, SendGrid, SMTP, Console)
- ✅ Email history tracking
- ✅ Template-based outreach generation
- ❌ No research layer
- ❌ No SEO/relevance layer
- ❌ No geo awareness
- ❌ No learning loop

#### 2. **Wolf Pack Funding Core** (`packages/wolfpack-funding-core/`)
- ✅ Lead management
- ✅ Email draft generation (`emailDraftEngine.ts`)
- ✅ Follow-up drafts (`followUpDraftEngine.ts`)
- ✅ Send queue management
- ❌ Static templates (no personalization)
- ❌ No recipient research
- ❌ No A/B testing
- ❌ No engagement tracking

#### 3. **Grant Outreach System** (`server/routes/grants.ts`)
- ✅ Outreach record management
- ✅ Multi-channel support (Email, SMS, Form)
- ✅ Status tracking
- ❌ Basic templates only
- ❌ No intelligence layer

### Current Email Draft Example
```typescript
// Current: Static template
const body = `Hi ${lead.name},

I'm ${opts.fromName}, one of the builders behind DreamNet...

We're building a living digital organism:
- Swarm agents (Wolf Pack, FieldLayer, DreamTank)
- A DreamVault of blueprints and rituals
- An emerging Agent Exchange economy

...`;
```

**Issues:**
- No personalization beyond name
- No research about recipient
- No relevance to recipient's interests
- No geo/timing awareness
- No learning from past interactions

---

## 🚀 Integration Opportunities

### Phase 1: Research Engine Integration

**Enhancement:** Add recipient research to email draft generation

**Implementation:**
```typescript
// New: packages/wolfpack-funding-core/logic/researchEngine.ts
export async function researchRecipient(
  email: string,
  name?: string,
  company?: string
): Promise<RecipientResearch> {
  // 1. LinkedIn API / Web scraping
  // 2. Company website analysis
  // 3. Recent news/articles
  // 4. Social media activity
  // 5. Return 3-5 credible facts
}
```

**Integration Points:**
- `generateEmailDraftForLead()` → Call `researchRecipient()` first
- Store research in `FundingLead.metadata.research`
- Use facts in email body personalization

### Phase 2: SEO + Relevance Layer

**Enhancement:** Add trending topics/keywords to outreach

**Implementation:**
```typescript
// New: packages/wolfpack-funding-core/logic/relevanceEngine.ts
export async function findRelevantTopics(
  recipient: RecipientResearch,
  industry: string
): Promise<RelevantTopics> {
  // 1. Google Trends API
  // 2. Industry news aggregation
  // 3. Keyword research
  // 4. Return trending topics/keywords
}
```

**Integration Points:**
- Enhance subject lines with trending keywords
- Add relevance hooks in email body
- Track which topics drive engagement

### Phase 3: Geo Awareness

**Enhancement:** Add location/event-based personalization

**Implementation:**
```typescript
// New: packages/wolfpack-funding-core/logic/geoAwareness.ts
export async function getGeoContext(
  recipient: RecipientResearch
): Promise<GeoContext> {
  // 1. Extract location from LinkedIn/profile
  // 2. Check for local events/conferences
  // 3. Timezone-aware scheduling
  // 4. Cultural context (holidays, local trends)
}
```

**Integration Points:**
- Schedule emails based on timezone
- Reference local events/conferences
- Adjust tone for cultural context

### Phase 4: Learning Loop

**Enhancement:** Track engagement and improve drafts

**Implementation:**
```typescript
// New: packages/wolfpack-funding-core/logic/learningLoop.ts
export interface EngagementMetrics {
  opened: boolean;
  clicked: boolean;
  replied: boolean;
  bounced: boolean;
  unsubscribed: boolean;
}

export function learnFromEngagement(
  draft: EmailDraft,
  metrics: EngagementMetrics
): void {
  // 1. Track which subject lines work
  // 2. Track which CTAs drive clicks
  // 3. Track which tones get replies
  // 4. Update templates based on success patterns
}
```

**Integration Points:**
- ⭐ **Gmail API** - Use `gmail.users.messages.list()` to track sent emails
- ⭐ **Gmail API** - Use `gmail.users.messages.get()` to check read status
- ⭐ **Gmail API** - Use `gmail.users.threads.list()` to track replies
- Store metrics in `EmailDraft.metrics`
- Use ML/analytics to improve future drafts

**Gmail API Implementation:**
```typescript
// packages/inbox-squared-core/adapters/gmailApiAdapter.ts
import { google } from 'googleapis';

export class GmailApiAdapter {
  private gmail: any;
  
  constructor(oauth2Client: any) {
    this.gmail = google.gmail({ version: 'v1', auth: oauth2Client });
  }
  
  async trackEmailEngagement(messageId: string): Promise<EngagementMetrics> {
    // Check if email was opened (Gmail API)
    const message = await this.gmail.users.messages.get({
      userId: 'me',
      id: messageId,
      format: 'metadata',
      metadataHeaders: ['X-Google-Original-Message-ID']
    });
    
    // Check for replies in thread
    const thread = await this.gmail.users.threads.get({
      userId: 'me',
      id: message.threadId
    });
    
    return {
      opened: message.labelIds?.includes('UNREAD') === false,
      replied: thread.messages.length > 1,
      clicked: this.detectClicks(message), // Parse email for click tracking
    };
  }
}
```

---

## 🏗️ Proposed Architecture

### New Package: `@dreamnet/inbox-squared-core`

```
packages/inbox-squared-core/
├── index.ts                    # Main export
├── types.ts                    # TypeScript types
├── logic/
│   ├── researchEngine.ts       # Layer 1: Research
│   ├── relevanceEngine.ts      # Layer 2: SEO/Relevance
│   ├── geoAwareness.ts         # Layer 3: Geo Awareness
│   ├── learningLoop.ts         # Layer 4: Learning
│   └── draftGenerator.ts       # Enhanced draft generation
├── store/
│   └── researchStore.ts        # Cache research results
└── adapters/
    ├── linkedinAdapter.ts      # LinkedIn API integration
    ├── trendsAdapter.ts         # Google Trends API
    └── emailProviderAdapter.ts # Email provider webhooks
```

### Enhanced Email Draft Flow

```typescript
// Before (Current)
generateEmailDraftForLead(lead, opts) → Static template → Draft

// After (Inbox² Enhanced)
generateEmailDraftForLead(lead, opts) →
  1. Research Engine → Gather 3-5 facts
  2. Relevance Engine → Find trending topics
  3. Geo Awareness → Get location/event context
  4. Draft Generator → Create personalized draft
  5. A/B Variants → Generate multiple options
  6. Learning Loop → Check past performance
  → Enhanced Draft with variants
```

---

## 📊 Integration with Existing Systems

### 1. Wolf Pack Funding Core

**Enhancement:** Upgrade `emailDraftEngine.ts`

```typescript
import { researchRecipient } from '@dreamnet/inbox-squared-core';
import { findRelevantTopics } from '@dreamnet/inbox-squared-core';
import { getGeoContext } from '@dreamnet/inbox-squared-core';

export async function generateEmailDraftForLead(
  lead: FundingLead,
  opts: { fromName: string; fromEmail: string }
): Promise<EmailDraft | null> {
  // Layer 1: Research
  const research = await researchRecipient(lead.email, lead.name, lead.company);
  
  // Layer 2: Relevance
  const topics = await findRelevantTopics(research, lead.type);
  
  // Layer 3: Geo Awareness
  const geoContext = await getGeoContext(research);
  
  // Generate personalized draft using all layers
  const draft = generatePersonalizedDraft(lead, research, topics, geoContext, opts);
  
  return draft;
}
```

### 2. DreamNet Email System

**Enhancement:** Add Gmail API engagement tracking

```typescript
// server/email/DreamNetEmail.ts
export interface EmailMessage {
  // ... existing fields
  gmailMessageId?: string; // ⭐ Gmail API message ID
  metrics?: {
    opened?: boolean;
    openedAt?: string;
    clicked?: boolean;
    clickedAt?: string;
    replied?: boolean;
    repliedAt?: string;
  };
}

// ⭐ Use Gmail API instead of webhooks
import { GmailApiAdapter } from '@dreamnet/inbox-squared-core';

// After sending via Gmail API
const gmailResponse = await gmail.users.messages.send({
  userId: 'me',
  requestBody: { raw: encodedMessage }
});

message.gmailMessageId = gmailResponse.data.id;

// Track engagement via Gmail API polling
setInterval(async () => {
  const metrics = await gmailAdapter.trackEmailEngagement(message.gmailMessageId);
  await learningLoop.recordEngagement(message.id, metrics);
}, 60000); // Check every minute
```

### 3. Grant Outreach System

**Enhancement:** Add Inbox² intelligence to grant outreach

```typescript
// server/routes/grants.ts
router.post('/grants/outreach/:id/generate', async (req, res) => {
  const outreach = await getOutreachRecord(id);
  const enhancedDraft = await inboxSquared.generateDraft({
    recipient: outreach.toAddr,
    context: 'grant_application',
    opportunity: outreach.oppId
  });
  res.json({ draft: enhancedDraft });
});
```

---

## 🎯 Implementation Roadmap

### Phase 1: Foundation (Week 1-2)
- [ ] Create `@dreamnet/inbox-squared-core` package
- [ ] Implement basic research engine (LinkedIn scraping/API)
- [ ] Integrate with `emailDraftEngine.ts`
- [ ] Add research caching layer

### Phase 2: Intelligence Layers (Week 3-4)
- [ ] Implement SEO/Relevance engine (Google Trends API)
- [ ] Implement Geo Awareness (location detection, timezone)
- [ ] Add A/B variant generation
- [ ] Create content twin generator (social/landing copy)

### Phase 3: Learning Loop (Week 5-6)
- [ ] Set up email provider webhooks
- [ ] Implement engagement tracking
- [ ] Build analytics dashboard
- [ ] Create learning algorithm for improvement

### Phase 4: Integration & Polish (Week 7-8)
- [ ] Integrate with Grant Outreach system
- [ ] Add UI components for draft review
- [ ] Create admin dashboard for metrics
- [ ] Documentation and testing

---

## 🔧 Technical Requirements

### External APIs Needed
1. **LinkedIn API** - Recipient research
2. **Google Trends API** - Trending topics
3. **News API** - Recent articles/announcements
4. **Timezone API** - Geo awareness
5. **Gmail API** ⭐ **ALREADY AVAILABLE** - Full email management, engagement tracking, draft management
   - Account: `dreamnetgmo@gmail.com`
   - Current: SMTP sending via App Password
   - Upgrade: Gmail API for advanced features

### New Dependencies
```json
{
  "dependencies": {
    "@dreamnet/inbox-squared-core": "workspace:*",
    "googleapis": "^128.0.0", // ⭐ Already available - Gmail API
    "puppeteer": "^21.0.0", // Web scraping fallback
    "google-trends-api": "^4.9.0",
    "newsapi": "^2.4.0",
    "timezone-lookup": "^1.0.0"
  }
}
```

### Gmail API Integration ⭐ **ADVANTAGE**

**Current Setup:**
- ✅ Gmail account: `dreamnetgmo@gmail.com`
- ✅ SMTP sending via App Password (`WOLFMAIL_SMTP_PASS`)
- ✅ Gmail API routes exist (`server/routes/communication.ts`, `server/routes/google-integration.ts`)
- ✅ Rate limiting (50/day default, 500/day max)

**Gmail API Capabilities for Inbox²:**
1. **Draft Management** - Create/save drafts directly in Gmail
2. **Send Tracking** - Track sent emails via Gmail API
3. **Read Receipts** - Detect when emails are opened (via Gmail API)
4. **Thread Management** - Track conversations and replies
5. **Labels & Filters** - Organize outreach campaigns
6. **Search** - Find past emails for learning loop
7. **History API** - Track all email interactions

**Upgrade Path:**
- Keep SMTP for simple sends (current system)
- Add Gmail API for advanced features (Inbox²)
- Hybrid approach: SMTP for bulk, Gmail API for tracking

### Database Schema Additions
```sql
-- Research cache
CREATE TABLE recipient_research (
  id UUID PRIMARY KEY,
  email TEXT UNIQUE,
  name TEXT,
  company TEXT,
  facts JSONB, -- Array of 3-5 facts
  sources JSONB, -- Source URLs
  cached_at TIMESTAMP,
  expires_at TIMESTAMP
);

-- Engagement metrics
CREATE TABLE email_engagement (
  id UUID PRIMARY KEY,
  email_draft_id UUID REFERENCES email_drafts(id),
  opened BOOLEAN DEFAULT FALSE,
  opened_at TIMESTAMP,
  clicked BOOLEAN DEFAULT FALSE,
  clicked_at TIMESTAMP,
  replied BOOLEAN DEFAULT FALSE,
  replied_at TIMESTAMP,
  bounced BOOLEAN DEFAULT FALSE
);

-- Learning patterns
CREATE TABLE email_patterns (
  id UUID PRIMARY KEY,
  pattern_type TEXT, -- 'subject_line', 'cta', 'tone'
  pattern_value TEXT,
  success_rate DECIMAL,
  sample_size INTEGER,
  last_updated TIMESTAMP
);
```

---

## 💡 Key Enhancements Over Current System

| Feature | Current | With Inbox² |
|---------|---------|-------------|
| Personalization | Name only | 3-5 researched facts |
| Relevance | None | Trending topics/keywords |
| Timing | Immediate | Geo/timezone aware |
| Learning | None | Engagement-based improvement |
| Variants | Single draft | A/B variants |
| Content Twins | None | Social/landing copy |
| Compliance | Basic | Opt-out lines, fact-checking |

---

## 🎨 UI/UX Enhancements

### New Mini-App: `InboxSquaredMini.tsx`

**Features:**
- Draft preview with research facts highlighted
- A/B variant comparison
- Engagement metrics dashboard
- Learning insights visualization
- Content twin generator

**Location:** `packages/base-mini-apps/frontend/InboxSquaredMini.tsx`

---

## 📈 Expected Outcomes

### Metrics to Track
- **Open Rate**: Target 40%+ (vs current ~20%)
- **Reply Rate**: Target 15%+ (vs current ~5%)
- **Click Rate**: Target 10%+ (vs current ~3%)
- **Bounce Rate**: Target <2% (vs current ~5%)

### Business Impact
- **More qualified leads** through better targeting
- **Higher conversion** through personalization
- **Time savings** through automation
- **Better compliance** through fact-checking

---

## 🚨 Risks & Mitigations

### Risk 1: API Rate Limits
**Mitigation:** Implement caching layer, batch requests

### Risk 2: Data Privacy
**Mitigation:** Only use public data, respect GDPR/CCPA

### Risk 3: Fact Accuracy
**Mitigation:** Source verification, mark unclear info

### Risk 4: Cost
**Mitigation:** Tiered usage, caching, free tier limits

---

## 📝 Next Steps

1. **Review & Approve** this integration plan
2. **Set up** external API accounts (LinkedIn, Google Trends, etc.)
3. **Create** `@dreamnet/inbox-squared-core` package structure
4. **Implement** Phase 1 (Research Engine)
5. **Test** with existing Wolf Pack leads
6. **Iterate** based on feedback

---

## 🔗 Related Documentation

- `WOLF_PACK_LIVE.md` - Current Wolf Pack system
- `server/routes/wolf-pack.ts` - Wolf Pack API routes
- `packages/wolfpack-funding-core/` - Funding core logic
- `server/email/DreamNetEmail.ts` - Email infrastructure

---

**Status:** 📋 Analysis Complete - Ready for Implementation  
**Priority:** 🔥 High - Directly enhances core outreach capabilities  
**Estimated Impact:** 🚀 High - Significant improvement in email effectiveness

