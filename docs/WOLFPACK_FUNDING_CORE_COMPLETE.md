# WolfPack Funding Core - Complete Documentation

**Generated**: 2025-01-27  
**Status**: Complete System Documentation

---

## Overview

WolfPack Funding Core provides **funding lead management and outreach** for DreamNet. It manages funding leads (VCs, angels, grants, accelerators), generates intelligent email drafts using Inbox², manages send queues, and tracks grant application drafts.

---

## Key Features

### Lead Management
- Lead tracking
- Lead type classification
- Lead stage tracking
- Scoring system (dream fit, risk, trust, priority)
- Hot lead detection
- Follow-up tracking

### Email Draft Generation
- Basic email drafts
- Enhanced drafts with Inbox²
- Research engine integration
- SEO + relevance
- Geo awareness
- Learning loop

### Send Queue Management
- Queue tracking
- Status management
- Error handling
- Rate limiting

### Grant Application Drafts
- Grant draft generation
- Application tracking
- Lead association

---

## Architecture

### Components

1. **Funding Store** (`store/fundingStore.ts`)
   - Lead storage
   - Queue storage
   - Grant draft storage

2. **Email Draft Engine** (`logic/emailDraftEngine.ts`)
   - Basic draft generation
   - Lead-based drafting

3. **Email Draft Engine Enhanced** (`logic/emailDraftEngineEnhanced.ts`)
   - Inbox² integration
   - Enhanced drafting
   - Research integration

4. **Grant Draft Engine** (`logic/grantDraftEngine.ts`)
   - Grant draft generation
   - Application creation

5. **Funding Scheduler** (`scheduler/fundingScheduler.ts`)
   - Cycle execution
   - Status updates

---

## API Reference

### Lead Management

#### `upsertLead(partial: Partial<FundingLead> & { id: string; name: string; type: LeadType }): FundingLead`
Creates or updates a funding lead.

**Example**:
```typescript
import { WolfPackFundingCore } from '@dreamnet/wolfpack-funding-core';

const lead = WolfPackFundingCore.upsertLead({
  id: 'lead-a16z',
  name: 'a16z Crypto',
  type: 'vc',
  email: 'contact@a16z.com',
  website: 'https://a16z.com',
  tags: ['crypto', 'web3'],
  dreamFitScore: 0.8,
  riskScore: 0.2,
  trustScore: 0.9,
  priorityScore: 0.85,
  stage: 'new',
  createdAt: Date.now(),
  updatedAt: Date.now(),
});
```

#### `listLeads(): FundingLead[]`
Lists all leads.

#### `getLead(id: string): FundingLead | undefined`
Gets a lead by ID.

### Send Queue

#### `listQueue(): SendQueueItem[]`
Lists send queue items.

#### `updateQueueItemStatus(id: string, status: "pending" | "sent" | "failed", error?: string): void`
Updates queue item status.

### Email Drafts

#### `generateEmailDraftForLead(lead: FundingLead, opts: { fromName: string; fromEmail: string }): EmailDraft | null`
Generates basic email draft.

**Example**:
```typescript
const draft = WolfPackFundingCore.generateEmailDraftForLead(lead, {
  fromName: 'DreamNet Team',
  fromEmail: 'hello@dreamnet.ink',
});

if (draft) {
  console.log(`Subject: ${draft.subject}`);
  console.log(`Body: ${draft.body}`);
}
```

#### `generateEmailDraftWithInboxSquared(lead: FundingLead, opts: DraftOptions): Promise<EmailDraft | null>`
Generates enhanced email draft with Inbox².

**Example**:
```typescript
const draft = await WolfPackFundingCore.generateEmailDraftWithInboxSquared(lead, {
  fromName: 'DreamNet Team',
  fromEmail: 'hello@dreamnet.ink',
  useInboxSquared: true,
});
```

### Grant Drafts

#### `listGrantDrafts(): GrantApplicationDraft[]`
Lists all grant drafts.

#### `listGrantDraftsForLead(leadId: string): GrantApplicationDraft[]`
Lists grant drafts for a lead.

#### `getGrantDraft(id: string): GrantApplicationDraft | undefined`
Gets a grant draft.

### Orchestration

#### `run(context: WolfPackFundingContext): WolfPackFundingStatus`
Runs WolfPack Funding Core cycle.

#### `status(): WolfPackFundingStatus`
Gets WolfPack Funding Core status.

---

## Data Models

### LeadType

```typescript
type LeadType =
  | "vc"
  | "angel"
  | "grant"
  | "accelerator"
  | "ecosystem-fund"
  | "dao"
  | "other";
```

### LeadStage

```typescript
type LeadStage =
  | "new"
  | "qualified"
  | "contacted"
  | "replied"
  | "hot"
  | "dead";
```

### FundingLead

```typescript
interface FundingLead {
  id: string;
  name: string;
  type: LeadType;
  email?: string;
  website?: string;
  tags?: string[];
  notes?: string;
  dreamFitScore?: number; // 0-1
  riskScore?: number; // 0-1
  trustScore?: number; // 0-1
  priorityScore?: number; // 0-1
  hotScore?: number; // 0-1
  isHot?: boolean;
  lastContactedAt?: number;
  lastReplyAt?: number;
  nextFollowUpAt?: number;
  contactCount?: number;
  stage: LeadStage;
  createdAt: number;
  updatedAt: number;
}
```

### EmailDraft

```typescript
interface EmailDraft {
  id: string;
  leadId: string;
  toEmail: string;
  subject: string;
  body: string;
  createdAt: number;
}
```

### SendQueueItem

```typescript
interface SendQueueItem {
  id: string;
  leadId: string;
  toEmail: string;
  subject: string;
  body: string;
  createdAt: number;
  status: "pending" | "sent" | "failed";
  lastError?: string;
}
```

---

## Lead Types

### VC
- Venture capital firms
- Series A+ funding
- Institutional investors

### Angel
- Angel investors
- Early-stage funding
- Individual investors

### Grant
- Grant programs
- Non-dilutive funding
- Research grants

### Accelerator
- Startup accelerators
- Program-based funding
- Mentorship programs

### Ecosystem Fund
- Ecosystem funds
- Chain-specific funds
- Platform funds

### DAO
- DAO treasuries
- Community funding
- Governance-based

---

## Lead Stages

### New
- Initial discovery
- Not yet qualified
- Awaiting qualification

### Qualified
- Qualified lead
- Ready for outreach
- High potential

### Contacted
- Initial contact made
- Awaiting response
- Follow-up scheduled

### Replied
- Lead responded
- Active conversation
- High engagement

### Hot
- High priority
- Strong interest
- Fast-tracked

### Dead
- No longer viable
- Closed opportunity
- Archive status

---

## Inbox² Integration

### Research Engine
- Gathers 3-5 credible facts
- Lead research
- Context building

### SEO + Relevance
- Finds trending topics
- Relevance scoring
- SEO optimization

### Geo Awareness
- Location personalization
- Event awareness
- Regional context

### Learning Loop
- Engagement-based improvement
- Pattern learning
- Optimization

---

## Integration Points

### DreamNet Systems
- **Reputation Lattice**: Reputation scoring
- **Field Layer**: Field tracking
- **Dream Tank Core**: Dream tracking
- **Economic Engine Core**: Economic integration
- **Narrative Field**: Outreach logging
- **Agent Registry Core**: Agent integration
- **Neural Mesh**: Pattern learning
- **Inbox Squared Core**: Enhanced drafting

### External Systems
- **Email Services**: Email sending
- **CRM Systems**: Lead management
- **Analytics**: Outreach analytics

---

## Usage Examples

### Create Lead

```typescript
const lead = WolfPackFundingCore.upsertLead({
  id: 'lead-a16z',
  name: 'a16z Crypto',
  type: 'vc',
  email: 'contact@a16z.com',
  dreamFitScore: 0.8,
  stage: 'new',
  createdAt: Date.now(),
  updatedAt: Date.now(),
});
```

### Generate Email Draft

```typescript
const draft = await WolfPackFundingCore.generateEmailDraftWithInboxSquared(lead, {
  fromName: 'DreamNet Team',
  fromEmail: 'hello@dreamnet.ink',
  useInboxSquared: true,
});
```

### Get Status

```typescript
const status = WolfPackFundingCore.status();
console.log(`Leads: ${status.leadCount}`);
console.log(`Queue: ${status.queueCount}`);
console.log(`Hot Leads: ${status.hotLeadCount}`);
```

---

## Best Practices

1. **Lead Management**
   - Score leads accurately
   - Track stages properly
   - Monitor hot leads
   - Follow up timely

2. **Email Drafting**
   - Use Inbox² for enhanced drafts
   - Personalize content
   - Research leads thoroughly
   - Optimize timing

3. **Queue Management**
   - Monitor queue status
   - Handle errors gracefully
   - Rate limit appropriately
   - Track success rates

---

## Security Considerations

1. **Lead Security**
   - Protect lead data
   - Secure contact information
   - Validate lead sources
   - Audit lead changes

2. **Email Security**
   - Validate email addresses
   - Protect draft content
   - Secure sending
   - Prevent spam

---

**Status**: ✅ Complete Documentation  
**Last Updated**: 2025-01-27

