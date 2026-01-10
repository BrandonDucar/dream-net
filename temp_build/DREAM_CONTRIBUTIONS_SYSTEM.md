# 💫 Dream Contributions System

## Overview

The **Dream Contributions** mini app is a consumer-facing Base app that allows users to support dreams as they evolve through the DreamNet lifecycle. This fills a critical gap in the dream evolution process by enabling community engagement through multiple contribution types.

## Features

### 1. **Financial Contributions**

#### Full Sponsorship 💎
- Complete funding for a dream
- Large amounts (typically 10+ DREAM/ETH)
- Grants significant XP boost to the dream
- Recognized as primary sponsor

#### Partial Sponsorship 💰
- Significant support (typically 1-10 DREAM/ETH)
- Helps dreams reach milestones
- Moderate XP boost
- Listed as major contributor

#### Tips 💸
- Small contributions (any amount)
- "Throw a couple bucks" at a dream
- Encourages micro-contributions
- Builds community support

**Supported Tokens:**
- ETH (native)
- DREAM (on-chain)
- SHEEP (on-chain)

### 2. **Skill Contributions** ⚡

Users can offer their expertise:
- 💻 Coding/Development
- 🎨 Design/UI/UX
- 📢 Marketing/Promotion
- ✍️ Writing/Content
- 🧠 Strategy/Planning
- 👥 Community Building
- ✨ Other

**How it works:**
- User selects their skill
- Automatically assigned appropriate role (Coder, Artist, Promoter, Visionary, Builder)
- Added to dream's contributors list
- Dream creator can reach out for collaboration

### 3. **Service Contributions** 🛠️

Users can offer specific services:
- "I can help with smart contract development"
- "I'll create promotional graphics"
- "I can write documentation"
- Custom service descriptions

**How it works:**
- User describes the service they're offering
- Added to dream's contributors list
- Dream creator can contact for details

## Integration Points

### Database Schema
- Uses existing `dreams.blessings` field for financial contributions
- Uses existing `dreams.contributors` field for skill/service contributions
- Awards XP based on contribution type and amount

### API Endpoints

**POST `/api/dreams/:id/contribute`**
```json
{
  "type": "financial" | "skill" | "service",
  "amount": "1.0",           // For financial
  "token": "DREAM",         // For financial
  "skill": "coding",         // For skill
  "service": "I can...",     // For service
  "message": "Optional message"
}
```

**GET `/api/dreams/:id/contributions`**
Returns all contributions (financial + contributors)

### XP Rewards
- Financial: `amount * 10` XP
- Skill/Service: `50` XP
- Encourages both types of contributions

## User Flow

1. **Browse Dreams**
   - View all active dreams
   - See current contributors and funding
   - Filter by status, level, etc.

2. **Select Contribution Type**
   - Full Sponsor (complete funding)
   - Partial Sponsor (significant support)
   - Tip (small contribution)
   - Offer Skill
   - Offer Service

3. **Complete Contribution**
   - Financial: Enter amount, select token, optional message
   - Skill: Select skill type, optional message
   - Service: Describe service, optional message

4. **On-Chain Transaction** (for financial)
   - ETH: Direct transfer to dream creator
   - DREAM/SHEEP: Token contract interaction (future)

5. **Record Contribution**
   - Stored in database
   - Dream XP updated
   - Creator notified
   - Contributor added to list

## Base App Integration

### Manifest
- **File**: `apps/site/public/.well-known/farcaster-contributions.json`
- **Category**: Social
- **Tags**: contributions, sponsorship, community, funding, base

### Discovery
- Listed in Base App directory
- Searchable by "contributions", "sponsor", "fund"
- Featured in "Community" category

## Benefits

### For Dream Creators
- ✅ Multiple funding sources
- ✅ Access to skilled contributors
- ✅ Community engagement
- ✅ Accelerated dream evolution

### For Contributors
- ✅ Easy way to support dreams
- ✅ Flexible contribution options
- ✅ Recognition in dream ecosystem
- ✅ XP rewards for contributions

### For DreamNet Ecosystem
- ✅ Increased community engagement
- ✅ Faster dream evolution
- ✅ More active dreams
- ✅ Stronger network effects

## Future Enhancements

1. **Contribution Goals**
   - Set funding goals for dreams
   - Progress tracking
   - Milestone unlocks

2. **Contribution Rewards**
   - NFTs for major contributors
   - Special badges
   - Revenue sharing

3. **Contribution Matching**
   - Match contributors with dreams based on skills
   - Skill-based recommendations
   - Auto-matching system

4. **Contribution Analytics**
   - Track contribution impact
   - Show ROI for contributors
   - Dream evolution metrics

5. **Multi-Dream Contributions**
   - Contribute to multiple dreams at once
   - Contribution bundles
   - Portfolio view

## Technical Details

### Frontend
- **Location**: `apps/site/src/pages/miniapps/dream-contributions/index.tsx`
- **Framework**: React + TypeScript
- **Wallet**: MetaMask/Base Wallet integration
- **Styling**: Tailwind CSS with gradient themes

### Backend
- **Location**: `server/routes/dream-contributions.ts`
- **Database**: PostgreSQL via Drizzle ORM
- **Integration**: Uses existing dream schema

### Routes
- **Frontend**: `/miniapps/contributions`
- **API**: `/api/dreams/:id/contribute`
- **API**: `/api/dreams/:id/contributions`

## Success Metrics

- Number of contributions per dream
- Average contribution amount
- Skill/service contributions vs financial
- Dreams that reach evolution milestones
- Community engagement rate

---

**Status**: ✅ **LIVE** - Ready for Base App submission!

