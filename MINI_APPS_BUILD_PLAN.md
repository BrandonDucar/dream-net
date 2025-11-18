# Mini Apps Build Plan - Grant-Focused

## 🎯 Priority 1: DREAM Rewards Hub

### Why This First:
- ✅ **Highest grant potential** (3-5 ETH Builder Grant)
- ✅ **Uses deployed contracts** (DreamToken, SheepToken)
- ✅ **Daily engagement** (Base loves DAU)
- ✅ **Viral loops** (streaks, referrals, leaderboards)
- ✅ **Quick to build** (we have rewards engine ready)

### Features:
1. **Daily/Weekly Claims**
   - Beautiful claim interface
   - Streak visualization
   - Reward animations

2. **Leaderboards**
   - Top DREAM earners
   - Streak champions
   - Weekly competitions

3. **Achievement System**
   - Badges for milestones
   - Progress tracking
   - Social sharing

4. **Referral Program**
   - Share links
   - Track referrals
   - Bonus rewards

5. **Social Features**
   - Share achievements
   - Compare with friends
   - Community challenges

### Grant Application Points:
- Daily active users (daily claims)
- User retention (streak system)
- Viral coefficient (referrals)
- Transaction volume (token claims)

---

## 🎯 Priority 2: Creator Subscription Manager

### Why This Second:
- ✅ **Uses deployed contracts** (SubscriptionHub, SubscriptionBadge)
- ✅ **Creator economy** (Base's focus area)
- ✅ **Revenue generation** (ecosystem growth)
- ✅ **Grant potential** (2-4 ETH Builder Grant)

### Features:
1. **Subscription Tiers**
   - Create tiers
   - Set prices
   - Configure benefits

2. **Badge Management**
   - Mint subscription badges
   - View subscriber badges
   - Badge metadata

3. **Revenue Dashboard**
   - Earnings tracking
   - Subscriber analytics
   - Payment history

4. **Fan Management**
   - Subscriber list
   - Engagement metrics
   - Communication tools

### Grant Application Points:
- Creator adoption
- Revenue generated
- Subscriber growth
- Ecosystem value

---

## 🎯 Priority 3: Dream Social Feed

### Why This Third:
- ✅ **Unique to DreamNet** (differentiator)
- ✅ **Social network effects** (viral growth)
- ✅ **Content creation** (ecosystem building)
- ✅ **Grant potential** (2-3 ETH Builder Grant)

### Features:
1. **Dream Feed**
   - Browse dreams
   - Filter by tags
   - Discover trending

2. **Remix System**
   - Remix dreams
   - Track evolution
   - Show lineage

3. **Social Interactions**
   - Like/favorite
   - Comment
   - Share

4. **Token Gating**
   - Exclusive content
   - Premium dreams
   - Access control

### Grant Application Points:
- Content creation
- User engagement
- Social interactions
- Network effects

---

## 🛠️ Technical Implementation

### Mini App Structure:
```
apps/site/src/pages/miniapps/
├── rewards/
│   ├── index.tsx          # Main rewards hub
│   ├── ClaimButton.tsx    # Daily/weekly claims
│   ├── Leaderboard.tsx    # Rankings
│   ├── Achievements.tsx   # Badges & milestones
│   └── Referral.tsx       # Referral system
├── subscriptions/
│   ├── index.tsx          # Creator dashboard
│   ├── TierManager.tsx    # Subscription tiers
│   ├── BadgeMinter.tsx    # Badge creation
│   └── Revenue.tsx        # Earnings dashboard
└── social/
    ├── index.tsx          # Dream feed
    ├── DreamCard.tsx      # Dream display
    ├── RemixStudio.tsx    # Remix interface
    └── Interactions.tsx   # Social features
```

### Base MiniKit Integration:
```typescript
import { OnchainKitProvider } from '@coinbase/onchainkit';

// Wrap app with OnchainKit
<OnchainKitProvider>
  <MiniApp />
</OnchainKitProvider>
```

### Contract Integration:
```typescript
import { ethers } from 'ethers';
import DreamTokenABI from '@/contracts/DreamToken.json';

const provider = new ethers.JsonRpcProvider('https://mainnet.base.org');
const dreamToken = new ethers.Contract(
  '0x4a6775abfD8CC67cBe9585c95C089FDc2Ae81C77',
  DreamTokenABI,
  provider
);
```

---

## 📅 Build Timeline

### Week 1: DREAM Rewards Hub
- Day 1-2: Setup MiniKit, create structure
- Day 3-4: Build claim interface, connect contracts
- Day 5-6: Add leaderboards, achievements
- Day 7: Deploy, test, iterate

### Week 2: Creator Subscription Manager
- Day 1-2: Subscription tier management
- Day 3-4: Badge minting interface
- Day 5-6: Revenue dashboard
- Day 7: Deploy, test, iterate

### Week 3: Dream Social Feed
- Day 1-2: Feed interface
- Day 3-4: Remix system
- Day 5-6: Social interactions
- Day 7: Deploy, test, iterate

---

## 🎯 Grant Application Strategy

### For Each Mini App:

1. **Ship & Measure** (Week 1-2)
   - Deploy to production
   - Get real users
   - Track metrics

2. **Document** (Week 2-3)
   - User testimonials
   - Usage stats
   - Impact metrics

3. **Apply** (Week 3-4)
   - Builder Grant application
   - Show real value
   - Demonstrate growth

---

## 📊 Success Metrics to Track

### DREAM Rewards Hub:
- Daily active users (target: 100+)
- Daily claims (target: 50+)
- Streak retention (target: 30%+)
- Referral rate (target: 10%+)

### Creator Subscription Manager:
- Creators onboarded (target: 20+)
- Active subscriptions (target: 100+)
- Revenue generated (target: $1000+)
- Subscriber growth (target: 20%/month)

### Dream Social Feed:
- Dreams shared (target: 500+)
- Remixes created (target: 100+)
- Social interactions (target: 1000+)
- User retention (target: 40%+)

---

**Let's start building! 🚀**

