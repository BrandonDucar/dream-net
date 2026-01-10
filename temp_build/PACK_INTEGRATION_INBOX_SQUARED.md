# Pack Integration with Inbox² ✅

## 🎯 Overview

Inbox² has been integrated into **Wolf Pack**, **Whale Pack**, and **Orca Pack** for intelligent email outreach.

---

## 🐺 Wolf Pack Integration

### Enhanced Email Draft Engine

**Location:** `packages/wolfpack-funding-core/logic/emailDraftEngineEnhanced.ts`

**New Method:**
```typescript
import { WolfPackFundingCore } from '@dreamnet/wolfpack-funding-core';

// Use Inbox² for intelligent drafts
const draft = await WolfPackFundingCore.generateEmailDraftWithInboxSquared(
  lead,
  {
    fromName: 'DreamNet Team',
    fromEmail: 'dreamnetgmo@gmail.com',
    useInboxSquared: true // Default: true
  }
);
```

**Features:**
- ✅ All 4 Inbox² layers (Research, Relevance, Geo, Learning)
- ✅ Falls back to basic draft if Inbox² unavailable
- ✅ Enhanced personalization for funding leads
- ✅ Research facts about investors/companies
- ✅ Trending topics alignment
- ✅ Geo-aware timing

**Usage in Wolf Pack:**
- Funding lead outreach
- Grant application follow-ups
- Investor relationship building
- Partnership conversations

---

## 🐋 Whale Pack Integration

### Outreach Core

**Location:** `packages/whale-pack-core/logic/whaleOutreachCore.ts`

**New Methods:**
```typescript
import { 
  generateWhaleOutreachDraft,
  createWhaleGmailDraft 
} from '@dreamnet/whale-pack-core';

// Generate outreach for partners/influencers
const draft = await generateWhaleOutreachDraft(
  {
    email: 'influencer@example.com',
    name: 'Jane Creator',
    company: 'Creator Co',
    context: 'influencer' // or 'partnership', 'collaboration', 'sponsorship'
  },
  product, // Optional: WhaleProduct
  audience, // Optional: WhaleAudience
  {
    tone: 'casual', // Whale Pack uses casual tone
    generateVariants: true
  }
);

// Create draft in Gmail
const gmailDraftId = await createWhaleGmailDraft(draft);
```

**Features:**
- ✅ Casual tone (perfect for influencer outreach)
- ✅ Product/audience context integration
- ✅ Partnership/influencer/collaboration templates
- ✅ Gmail draft creation
- ✅ All Inbox² intelligence layers

**Use Cases:**
- Influencer partnerships
- Brand collaborations
- Product sponsorships
- Audience expansion outreach

---

## 🐋 Orca Pack Integration

### Outreach Core

**Location:** `packages/orca-pack-core/logic/orcaOutreachCore.ts`

**New Methods:**
```typescript
import { 
  generateOrcaOutreachDraft,
  createOrcaGmailDraft 
} from '@dreamnet/orca-pack-core';

// Generate outreach for community/network contacts
const draft = await generateOrcaOutreachDraft(
  {
    email: 'community@example.com',
    name: 'John Storyteller',
    organization: 'Story Network',
    context: 'community' // or 'network', 'partnership', 'collaboration'
  },
  idea, // Optional: OrcaPostIdea
  theme, // Optional: OrcaNarrativeTheme
  {
    tone: 'consultative', // Orca Pack uses consultative tone
    generateVariants: true
  }
);

// Create draft in Gmail
const gmailDraftId = await createOrcaGmailDraft(draft);
```

**Features:**
- ✅ Consultative tone (perfect for community building)
- ✅ Narrative theme/idea context integration
- ✅ Community/network/partnership templates
- ✅ Gmail draft creation
- ✅ All Inbox² intelligence layers

**Use Cases:**
- Community building outreach
- Network expansion
- Narrative collaboration
- Storytelling partnerships

---

## 📊 What Each Pack Gets

### All Packs Get:
- ✅ **Research Engine** - 3-5 credible facts about recipients
- ✅ **Relevance Layer** - Trending topics/keywords
- ✅ **Geo Awareness** - Location/timezone optimization
- ✅ **Learning Loop** - Engagement-based improvement
- ✅ **Gmail Integration** - Draft creation and tracking
- ✅ **A/B Variants** - Multiple subject/body options
- ✅ **Fallback Support** - Works even if Inbox² unavailable

### Pack-Specific Customizations:

| Pack | Tone | Use Case | Context Integration |
|------|------|----------|---------------------|
| **Wolf Pack** | Consultative | Funding/grants | Lead type, company, stage |
| **Whale Pack** | Casual | Influencer/partnerships | Product, audience, channel |
| **Orca Pack** | Consultative | Community/network | Idea, theme, narrative |

---

## 🚀 How to Use

### 1. Wolf Pack

```typescript
import { WolfPackFundingCore } from '@dreamnet/wolfpack-funding-core';

// In your Wolf Pack cycle
const lead = WolfPackFundingCore.getLead('lead-id');
const draft = await WolfPackFundingCore.generateEmailDraftWithInboxSquared(
  lead,
  { fromName: 'DreamNet', fromEmail: 'dreamnetgmo@gmail.com' }
);
```

### 2. Whale Pack

```typescript
import { generateWhaleOutreachDraft } from '@dreamnet/whale-pack-core';

// In your Whale Pack cycle
const draft = await generateWhaleOutreachDraft(
  { email: 'partner@example.com', context: 'partnership' },
  product,
  audience
);
```

### 3. Orca Pack

```typescript
import { generateOrcaOutreachDraft } from '@dreamnet/orca-pack-core';

// In your Orca Pack cycle
const draft = await generateOrcaOutreachDraft(
  { email: 'community@example.com', context: 'community' },
  idea,
  theme
);
```

---

## 📝 API Endpoints

All packs can also use the Inbox² API directly:

```typescript
// Generate draft
POST /api/inbox-squared/generate-draft
{
  "recipientEmail": "contact@example.com",
  "recipientName": "John Doe",
  "recipientCompany": "Acme Corp",
  "options": {
    "fromName": "DreamNet Pack",
    "fromEmail": "dreamnetgmo@gmail.com",
    "tone": "consultative"
  }
}

// Create Gmail draft
POST /api/inbox-squared/create-gmail-draft
{
  "draft": { /* EmailDraft object */ }
}

// Track engagement
POST /api/inbox-squared/track-engagement
{
  "messageId": "gmail-message-id"
}
```

---

## 🔧 Configuration

### Environment Variables

All packs use the same Gmail API configuration:

```bash
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-client-secret
GMAIL_REFRESH_TOKEN=your-refresh-token
```

### Fallback Behavior

If Inbox² is unavailable:
- **Wolf Pack**: Falls back to basic email draft
- **Whale Pack**: Returns `null` (check before using)
- **Orca Pack**: Returns `null` (check before using)

---

## 📈 Benefits

### For Wolf Pack:
- **Better investor outreach** - Research-backed personalization
- **Higher reply rates** - Geo-aware timing
- **Learning from engagement** - Improve over time

### For Whale Pack:
- **Influencer partnerships** - Casual, engaging tone
- **Product promotion** - Context-aware messaging
- **Audience growth** - Relevant topic alignment

### For Orca Pack:
- **Community building** - Consultative, relationship-focused
- **Narrative collaboration** - Theme-aware outreach
- **Network expansion** - Professional yet personal

---

## ✅ Status

- ✅ Wolf Pack integrated
- ✅ Whale Pack integrated
- ✅ Orca Pack integrated
- ✅ Gmail API support
- ✅ Fallback mechanisms
- ✅ Pack-specific customizations

---

**All packs now have access to Inbox²'s intelligent email capabilities!** 🎉

