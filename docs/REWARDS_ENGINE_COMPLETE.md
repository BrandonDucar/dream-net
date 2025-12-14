# Rewards Engine - Complete Documentation

**Generated**: 2025-01-27  
**Status**: Complete System Documentation

---

## Overview

Rewards Engine provides **user reward management** for DreamNet. It manages user balances (DREAM and SHEEP tokens), tracks reward events, calculates daily/weekly rewards with streak bonuses, and handles various reward types.

---

## Key Features

### Balance Management
- DREAM token balances (long-term energy)
- SHEEP token balances (soft currency)
- Balance tracking
- Balance updates

### Reward Types
- Login rewards
- Daily claim rewards
- Weekly claim rewards
- Task completion rewards
- Media upload rewards
- Procurement rewards
- HALO contribution rewards
- Referral rewards
- Admin adjustments

### Streak System
- Daily streak tracking
- Streak bonus multipliers
- Streak maintenance
- Streak reset

### Cooldown System
- Login cooldown
- Daily claim cooldown
- Weekly claim cooldown
- Claim prevention

---

## Architecture

### Components

1. **Rewards Store** (`store/`)
   - Balance storage
   - Event storage
   - Balance retrieval

2. **Rewards Engine** (`rewardsEngine.ts`)
   - Reward calculation
   - Reward granting
   - Cooldown checking
   - Streak management

3. **Config** (`config.ts`)
   - Default configuration
   - Reward amounts
   - Cooldown settings

---

## API Reference

### Balance Management

#### `getUserBalance(userId: string): Promise<UserBalances>`
Gets user balance.

**Example**:
```typescript
import { getUserBalance } from '@dreamnet/rewards-engine';

const balance = await getUserBalance('user-123');
console.log(`DREAM: ${balance.dream}`);
console.log(`SHEEP: ${balance.sheep}`);
console.log(`Streak: ${balance.streakDays} days`);
```

#### `setUserBalance(userId: string, balance: UserBalances): Promise<void>`
Sets user balance.

### Reward Management

#### `grantReward(userId: string, type: RewardType, options?: RewardOptions): Promise<UserBalances>`
Grants a reward to a user.

**Example**:
```typescript
import { grantReward } from '@dreamnet/rewards-engine';

const newBalance = await grantReward('user-123', 'daily-claim', {
  reason: 'Daily claim reward',
});
```

#### `recordRewardEvent(event: RewardEvent): Promise<void>`
Records a reward event.

#### `listRewardEvents(userId?: string): Promise<RewardEvent[]>`
Lists reward events.

### Reward Calculation

#### `calculateDailyReward(streakDays?: number): { dream: number; sheep: number }`
Calculates daily reward with streak bonus.

#### `calculateWeeklyReward(): { dream: number; sheep: number }`
Calculates weekly reward.

---

## Data Models

### UserBalances

```typescript
interface UserBalances {
  userId: string;
  dream: number; // long-term energy
  sheep: number; // soft currency
  lastLoginAt?: string;
  lastDailyClaimAt?: string;
  lastWeeklyClaimAt?: string;
  weeklyGasClaims?: number;
  streakDays?: number;
}
```

### RewardType

```typescript
type RewardType =
  | 'login'
  | 'daily-claim'
  | 'weekly-claim'
  | 'task-complete'
  | 'media-upload'
  | 'procurement'
  | 'halo-contrib'
  | 'referral'
  | 'admin-adjust';
```

### RewardEvent

```typescript
interface RewardEvent {
  id: string;
  userId: string;
  type: RewardType;
  deltaDream: number;
  deltaSheep: number;
  createdAt: string;
  meta?: Record<string, unknown>;
}
```

### RewardConfig

```typescript
interface RewardConfig {
  dailyBaseDream: number;
  dailyBaseSheep: number;
  streakBonusMultiplier: number;
  weeklyBaseDream: number;
  weeklyBaseSheep: number;
  maxDailySheep: number;
  loginCooldownHours: number;
}
```

---

## Reward Types

### Login
- Small login reward
- Cooldown-based
- Daily tracking

### Daily Claim
- Base daily reward
- Streak bonus multiplier
- 24-hour cooldown
- Streak tracking

### Weekly Claim
- Weekly reward
- 7-day cooldown
- Gas claim tracking

### Task Complete
- Task completion reward
- Variable amounts
- Task-specific

### Media Upload
- Media upload reward
- Content creation incentive

### Procurement
- Procurement reward
- Purchase incentive

### HALO Contrib
- HALO contribution reward
- System contribution incentive

### Referral
- Referral reward
- User acquisition incentive

### Admin Adjust
- Admin adjustment
- Manual balance changes

---

## Streak System

### Streak Calculation
- Consecutive days tracked
- Multiplier applied
- Capped at 7 days
- Reset on break

### Streak Bonus
- Exponential multiplier
- Configurable base
- Maximum cap
- Daily application

---

## Integration Points

### DreamNet Systems
- **Economic Engine**: Token economics
- **Zen Garden**: Activity rewards
- **Social Hub**: Social rewards
- **Dream Vault**: Content rewards

### External Systems
- **Blockchain**: On-chain tokens
- **Analytics**: Reward analytics
- **Dashboards**: Balance visualization

---

## Usage Examples

### Get User Balance

```typescript
const balance = await getUserBalance('user-123');
console.log(`DREAM: ${balance.dream}`);
console.log(`SHEEP: ${balance.sheep}`);
console.log(`Streak: ${balance.streakDays} days`);
```

### Grant Daily Reward

```typescript
const newBalance = await grantReward('user-123', 'daily-claim');
console.log(`New DREAM: ${newBalance.dream}`);
console.log(`New SHEEP: ${newBalance.sheep}`);
console.log(`New Streak: ${newBalance.streakDays} days`);
```

### Calculate Daily Reward

```typescript
const reward = calculateDailyReward(5); // 5-day streak
console.log(`DREAM: ${reward.dream}`);
console.log(`SHEEP: ${reward.sheep}`);
```

### List Reward Events

```typescript
const events = await listRewardEvents('user-123');
events.forEach(event => {
  console.log(`${event.type}: +${event.deltaDream} DREAM, +${event.deltaSheep} SHEEP`);
});
```

---

## Best Practices

1. **Reward Management**
   - Use appropriate reward types
   - Set correct amounts
   - Track all events
   - Monitor balances

2. **Streak Management**
   - Track streaks carefully
   - Apply multipliers correctly
   - Reset on breaks
   - Reward consistency

3. **Cooldown Management**
   - Enforce cooldowns
   - Check before granting
   - Track claim times
   - Prevent abuse

---

## Security Considerations

1. **Balance Security**
   - Validate balances
   - Protect balance data
   - Audit balance changes
   - Prevent manipulation

2. **Reward Security**
   - Validate rewards
   - Secure reward granting
   - Audit reward events
   - Prevent abuse

---

**Status**: ✅ Complete Documentation  
**Last Updated**: 2025-01-27

