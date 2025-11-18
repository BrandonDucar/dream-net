# Wolf Pack & Super Spine System

## 🐺 Wolf Pack Funding Hunter

**What it does:**
- Automatically discovers funding opportunities (Base grants, OP retro funding, etc.)
- Tracks application status through the pipeline
- Generates outreach templates for grant applications
- Manages funding hunts with target amounts and sources
- Can be used as a **paid feature** for users

### Features

1. **Automated Discovery**
   - Scans for Base Builder Grants (1-5 ETH)
   - Optimism Retroactive Public Goods Funding
   - Other funding sources (extensible)

2. **Funding Hunt Management**
   - Create hunts with target amounts
   - Track multiple opportunities per hunt
   - Status pipeline: discovered → researching → applied → interview → approved → funded

3. **Outreach Automation**
   - Pre-built templates for different funding sources
   - Variable substitution (project name, amount, metrics, etc.)
   - Ready-to-send grant application emails

4. **Paid Feature Integration**
   - Users can subscribe to Wolf Pack access
   - Personal funding hunts per user
   - Automated discovery and tracking

### API Endpoints

- `GET /api/wolf-pack/opportunities` - Get all funding opportunities
- `POST /api/wolf-pack/discover` - Trigger discovery
- `POST /api/wolf-pack/hunt` - Create a funding hunt
- `GET /api/wolf-pack/hunts` - Get user's hunts
- `GET /api/wolf-pack/hunt/:id/stats` - Get hunt statistics
- `POST /api/wolf-pack/outreach` - Generate outreach message

### Usage Example

```typescript
// Create a hunt for 10 ETH from Base and Optimism
const hunt = await fetch('/api/wolf-pack/hunt', {
  method: 'POST',
  headers: { 'x-user-id': userId },
  body: JSON.stringify({
    targetAmount: 10,
    targetSources: ['base', 'optimism']
  })
});

// Get opportunities
const opps = await fetch('/api/wolf-pack/opportunities?source=base');

// Generate outreach
const outreach = await fetch('/api/wolf-pack/outreach', {
  method: 'POST',
  body: JSON.stringify({
    opportunityId: '...',
    templateId: 'base-builder-grant',
    variables: {
      amount: '3 ETH',
      metrics: '100+ active users, 4 live mini-apps'
    }
  })
});
```

---

## 🦴 Super Spine - Agent Orchestration Backbone

**What it does:**
- Central nervous system for all agents
- Agent discovery and registration
- Task routing and load balancing
- Agent health monitoring
- **Paid features** - Premium agent subscriptions
- Agent marketplace

### Features

1. **Agent Registry**
   - All agents registered in Super Spine
   - Agent capabilities (code, design, analysis, communication, funding, deployment)
   - Agent health monitoring (uptime, success rate, response time)

2. **Access Control**
   - Unlock requirements (trust score, staking, etc.)
   - Premium subscriptions for paid agents
   - Per-user access checking

3. **Task Management**
   - Submit tasks to agents
   - Task queue per agent
   - Task status tracking
   - User task history

4. **Paid Features**
   - Premium agents require subscriptions
   - Monthly/yearly pricing in DREAM tokens
   - Subscription management
   - Access gating

### Registered Agents

**Standard (Free):**
- LUCID - Logic orchestration
- CANVAS - Visual layer weaver
- ROOT - Backend architect (requires Trust Score > 60)

**Premium (Paid Subscription):**
- CRADLE - Evolution Engine (50 DREAM/month)
- WING - Messenger & Mint (30 DREAM/month)
- **Wolf Pack** - Funding Hunter (100 DREAM/month) 🆕

### API Endpoints

- `GET /api/super-spine/agents` - Get all agents
- `GET /api/super-spine/agent/:key` - Get specific agent + stats
- `GET /api/super-spine/agent/:key/access` - Check user access
- `POST /api/super-spine/subscription` - Create subscription
- `GET /api/super-spine/subscription/:agentKey` - Get user's subscription
- `POST /api/super-spine/task` - Submit task to agent
- `GET /api/super-spine/tasks` - Get user's tasks

### Usage Example

```typescript
// Check access to Wolf Pack
const access = await fetch('/api/super-spine/agent/wolf-pack/access', {
  headers: {
    'x-user-id': userId,
  },
  params: {
    trustScore: 85,
    completedDreams: 5,
    stakedSheep: 500
  }
});

// Subscribe to Wolf Pack (if premium)
if (!access.hasAccess && access.reason === 'Premium subscription required') {
  const subscription = await fetch('/api/super-spine/subscription', {
    method: 'POST',
    headers: { 'x-user-id': userId },
    body: JSON.stringify({
      agentKey: 'wolf-pack',
      period: 'monthly'
    })
  });
}

// Submit task to Wolf Pack
const task = await fetch('/api/super-spine/task', {
  method: 'POST',
  headers: { 'x-user-id': userId },
  body: JSON.stringify({
    agentKey: 'wolf-pack',
    type: 'discover-opportunities',
    input: {
      sources: ['base', 'optimism']
    }
  })
});
```

---

## 💰 Paid Features System

### How It Works

1. **Agent Tiers**
   - **Standard**: Free, basic unlock requirements
   - **Premium**: Requires subscription (monthly/yearly DREAM payment)
   - **Nightmare**: Special unlock conditions

2. **Subscription Model**
   - Monthly or yearly subscriptions
   - Paid in DREAM tokens
   - Automatic access gating
   - Subscription status tracking

3. **Integration Points**
   - Super Spine checks subscriptions before allowing agent access
   - Wolf Pack can be used as paid feature
   - Other premium agents (CRADLE, WING) also use this system

### Pricing

- **CRADLE**: 50 DREAM/month
- **WING**: 30 DREAM/month
- **Wolf Pack**: 100 DREAM/month

### Revenue Model

Users pay DREAM tokens to access premium agents. This creates:
- Revenue stream for DreamNet
- Value for DREAM token holders
- Incentive to earn/acquire DREAM tokens
- Sustainable funding for agent development

---

## 🚀 Next Steps

### UI Components Needed

1. **Wolf Pack Dashboard**
   - Funding opportunities list
   - Active hunts
   - Application status tracking
   - Outreach message generator

2. **Super Spine Agent Marketplace**
   - Agent directory
   - Agent details and capabilities
   - Subscription management
   - Task submission interface

3. **Paid Features UI**
   - Subscription purchase flow
   - Active subscriptions list
   - Payment history
   - Access status indicators

### Integration Points

1. **Rewards Engine**
   - Grant rewards for funding applications
   - Reward users for successful grants

2. **Dream Token Layer**
   - Subscription payments in DREAM
   - Token balance checking
   - Payment processing

3. **Operator Panel**
   - View all subscriptions
   - Monitor agent health
   - Manage pricing

---

## 📊 Metrics to Track

### Wolf Pack
- Funding opportunities discovered
- Applications submitted
- Success rate (approved/funded)
- Average hunt cycle time
- Revenue from paid subscriptions

### Super Spine
- Agent uptime
- Task completion rate
- Average response time
- Active subscriptions
- Revenue from subscriptions

---

## 🎯 Use Cases

1. **For DreamNet Team**
   - Automated grant discovery and application
   - Track funding pipeline
   - Generate outreach messages

2. **For Users (Paid Feature)**
   - Personal funding hunts
   - Track their own grant applications
   - Get notified of new opportunities
   - Automated outreach generation

3. **For Ecosystem**
   - More funding = more development
   - Sustainable revenue model
   - Value for DREAM token holders

---

Ready to hunt! 🐺💰

