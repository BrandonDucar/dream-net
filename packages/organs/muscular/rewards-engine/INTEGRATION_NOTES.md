# Rewards Engine Integration Notes

## Integration Points

### ✅ Implemented
- **Media Upload**: Rewards granted on successful media ingestion (`server/routes/media.ts`)

### 🔄 TODO: Integration Points

1. **HALO Contribution** (`packages/halo-loop/`)
   - When HALO cycle completes successfully
   - When operator manually triggers HALO cycle
   - Location: `server/index.ts` or `packages/halo-loop/src/haloLoop.ts`
   - Code: `await grantReward(userId, "halo-contrib", { deltaDream: 20, deltaSheep: 10 });`

2. **Procurement/Sourcing** (`server/routes/orders.ts`)
   - When order status changes to "sourcing" or "fulfilled"
   - Location: `server/routes/orders.ts` - order update endpoint
   - Code: `await grantReward(userId, "procurement", { deltaDream: 50 });`

3. **Referral System**
   - When a new user signs up with a referral code
   - Location: User registration/auth endpoint
   - Code: `await grantReward(referrerId, "referral");`

4. **Task Completion**
   - When tasks are marked as completed in Operator Panel
   - Location: `server/routes/operator.ts` or task completion endpoint
   - Code: `await grantReward(userId, "task-complete", { deltaDream: 5 });`

## Metrics Integration

The rewards engine should track total DREAM and SHEEP issued per day. This can be added to `packages/metrics-engine/metricsEngine.ts` by:
- Querying `rewards_events.json` for today's events
- Summing `deltaDream` and `deltaSheep` for today
- Adding to `MetricsDaily` record

