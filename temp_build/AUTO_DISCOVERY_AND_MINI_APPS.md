# Auto-Discovery & Base Mini-Apps

## 🎯 Never Ask for API Keys Again!

The API Keeper now **automatically discovers** API keys from your `.env` file. Just add them to `.env` and they're automatically registered!

### How It Works

1. **On startup**, API Keeper scans:
   - Environment variables (`process.env`)
   - `.env` file (if accessible)
   - Common API key patterns

2. **Auto-registers** keys for:
   - Twilio (`TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`)
   - Telegram (`TELEGRAM_BOT_TOKEN`)
   - Twitter (`TWITTER_BEARER_TOKEN`)
   - OpenAI (`OPENAI_API_KEY`)
   - Anthropic (`ANTHROPIC_API_KEY`)
   - SendGrid (`SENDGRID_API_KEY`)
   - Any `*_API_KEY` pattern

3. **Tags them** as `["auto-discovered", "env"]` so you know they came from auto-discovery

### Example

Just add to `.env`:
```env
TWILIO_ACCOUNT_SID=your_sid
TWILIO_AUTH_TOKEN=your_token
TELEGRAM_BOT_TOKEN=your_token
```

Run API Keeper cycle → Keys automatically registered! 🎉

## 📱 Base Mini-Apps

Created **8 Base mini-apps** ready for deployment:

### 1. 🪪 Dream Passport Mint (Identity)
- Mint your Dream State passport NFT on Base
- No passport required (first-time users)
- Integrates with Dream State

### 2. 🏛️ Dream State Governance (Governance)
- Vote on proposals
- Participate in governance
- Requires: Citizen+ tier passport
- Features: Voting, proposals, governance

### 3. 🔑 API Keeper Dashboard (Utility)
- Manage API keys
- Monitor costs
- Configure rail guards
- Requires: Operator+ tier passport
- Integrates: API Keeper

### 4. 💰 Wolf Pack Funding Portal (Commerce)
- View funding leads
- Track outreach
- Manage grants
- Requires: Citizen+ tier passport
- Integrates: Wolf Pack

### 5. 🌐 DreamNet Social Hub (Social)
- Connect with citizens
- Share dreams
- Messaging
- Requires: Dreamer+ tier passport
- Integrates: Orca Pack, Social Hub

### 6. 🐋 Whale Pack Commerce (Commerce)
- TikTok Shop integration
- Commerce analytics
- Requires: Citizen+ tier passport
- Integrates: Whale Pack

### 7. 💎 DreamNet Treasury (DeFi)
- View treasury
- Budget tracking
- Economic activity
- Requires: Operator+ tier passport
- Integrates: Economic Engine, Dream State

### 8. 🛡️ Shield Status Monitor (Utility)
- Monitor shield system
- Threat detection
- Security monitoring
- Requires: Operator+ tier passport
- Integrates: Shield Core

## 🏛️ Government Department Integration

The **API Keeper Department** is now part of Dream State governance:
- **Department ID**: `dept:api-keeper`
- **Leader**: `agent:APIKeeperCore`
- **Responsibilities**:
  - API discovery and management
  - Key management and security
  - Cost optimization
  - Rate limiting and rail guards
  - Provider selection and routing

## 🚀 What Makes This Special

### 1. Zero-Config API Keys
- Never manually register keys
- Auto-discovery from `.env`
- Automatic provider matching
- Smart key management

### 2. Base Mini-Apps Ecosystem
- 8 apps ready for deployment
- Passport-gated access
- Integrated with Dream State
- Onchain identity verification

### 3. Governance Integration
- API Keeper as government department
- Cost tracking via Economic Engine
- Budget management via proposals
- Transparent API usage

## 📊 Stats

- **8 Mini-Apps** created
- **6 Categories** covered (identity, governance, utility, commerce, social, defi)
- **Auto-discovery** for all major APIs
- **Passport integration** for access control

## 🎨 Mini-App Features

Each mini-app includes:
- ✅ Category classification
- ✅ Passport tier requirements
- ✅ Integration points
- ✅ Feature list
- ✅ Color scheme
- ✅ Status tracking

## 🔮 Future Enhancements

- [ ] Deploy contracts to Base
- [ ] Build frontend UIs
- [ ] Onchain passport verification
- [ ] Mini-app marketplace
- [ ] Revenue sharing
- [ ] Cross-mini-app interactions

## 💡 Usage

```typescript
// Auto-discover keys (runs automatically on API Keeper cycle)
APIKeeperCore.autoDiscoverKeys();

// Create mini-apps
const apps = BaseMiniApps.createDefaultMiniApps();

// Deploy to Base (when ready)
BaseMiniApps.deployMiniApp(appId, contractAddress, deploymentTx);
```

## 🎉 Result

**You never have to ask for or look for API keys again!** Just add them to `.env` and they're automatically discovered and registered. Plus, you have 8 Base mini-apps ready to deploy and build the Dream State ecosystem on Base! 🚀

