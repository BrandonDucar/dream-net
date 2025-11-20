# DreamNet Integrations & Connectors Inventory
## Complete List of External Services and APIs

**Last Updated**: Comprehensive scan complete  
**Status**: ✅ All integrations cataloged

> **Note**: This inventory is governed by the [DreamNet OPS_CONTRACT](docs/OPS_CONTRACT.md). All integrations must follow the contract rules for configuration, environment variables, and code organization.

---

## 🌐 Infrastructure & Hosting

### 1. **Vercel** (Frontend Hosting)
- **Package**: `packages/dreamnet-vercel-agent`
- **Agent**: DreamNetVercelAgent
- **Purpose**: Frontend deployment management, project cleanup
- **Capabilities**:
  - List projects
  - Get project details
  - Analyze cleanup opportunities
  - Execute cleanup actions (dry-run)
- **Env Vars**: `VERCEL_TOKEN`
- **Routes**: `/api/vercel/*`
- **Status**: ✅ Active, auto-initializes on startup

### 2. **Railway** (Backend Hosting)
- **Config**: `railway.json`, `railway.toml`
- **Purpose**: Backend deployment and hosting
- **Build**: `pnpm install && pnpm build:app`
- **Start**: `pnpm start`
- **Health**: `/health` endpoint
- **Status**: ✅ Configured

### 3. **Neon PostgreSQL** (Database)
- **Package**: `@neondatabase/serverless`
- **Purpose**: Serverless PostgreSQL database
- **Connection**: `DATABASE_URL` or `NEON_DATABASE_URL`
- **ORM**: Drizzle ORM
- **Features**: Connection pooling, WebSocket support
- **Status**: ✅ Optional (server can start without DB)

---

## 🔗 Blockchain & Web3

### 4. **Base Mainnet** (Primary Blockchain)
- **Chain ID**: 8453
- **RPC**: `BASE_MAINNET_RPC_URL` (default: `https://mainnet.base.org`)
- **Explorer**: BaseScan (`https://basescan.org`)
- **API Key**: `BASE_SCAN_API_KEY`
- **Purpose**: Smart contract deployment and interaction
- **Contracts**: 18+ deployed contracts
- **Status**: ✅ Active

### 5. **Base Sepolia** (Testnet)
- **Chain ID**: 84532
- **RPC**: `BASE_SEPOLIA_RPC_URL` (default: `https://sepolia.base.org`)
- **Explorer**: BaseScan Sepolia (`https://sepolia.basescan.org`)
- **Purpose**: Testing and development
- **Status**: ✅ Configured

### 6. **Hardhat** (Smart Contract Development)
- **Config**: `hardhat.config.cjs`
- **Networks**: Base Mainnet, Base Sepolia, Hardhat local
- **Purpose**: Contract compilation, deployment, verification
- **Status**: ✅ Active

### 7. **Ethers.js** (Blockchain Interaction)
- **Version**: ^6.15.0
- **Purpose**: Ethereum/Base blockchain interaction
- **Status**: ✅ Active

### 8. **Coinbase OnChainKit** (Wallet Integration)
- **Package**: `@coinbase/onchainkit`
- **Purpose**: Base wallet integration, UI components
- **Status**: ✅ Active

### 9. **Solana Wallet Adapter** (Multi-Chain Support)
- **Packages**: 
  - `@solana/wallet-adapter-base`
  - `@solana/wallet-adapter-react`
  - `@solana/wallet-adapter-react-ui`
- **Purpose**: Solana wallet integration (multi-chain support)
- **Status**: ✅ Available

### 10. **Wagmi** (Ethereum React Hooks)
- **Package**: `wagmi`, `@wagmi/core`, `viem`
- **Purpose**: React hooks for Ethereum/Base
- **Status**: ✅ Active

### 11. **SIWE** (Sign-In With Ethereum)
- **Package**: `siwe`
- **Purpose**: EIP-4361 wallet authentication
- **Status**: ✅ Active

### 12. **VeChain** (Enterprise Blockchain)
- **Package**: `@dreamnet/vechain-core`
- **Purpose**: Supply chain tracking, NFTs, IoT integration, sustainability
- **Features**:
  - VeChain Thor client connection
  - Supply chain product tracking
  - Enhanced NFT capabilities (on-chain metadata, multi-asset)
  - IoT device integration
  - Sustainability/ESG tracking (VeBetter DAO)
- **Env Vars**:
  - `VECHAIN_NETWORK` (mainnet/testnet)
  - `VECHAIN_MAINNET_RPC_URL`
  - `VECHAIN_TESTNET_RPC_URL`
  - `VECHAIN_WALLET_ADDRESS`
- **Status**: 🚧 In Progress (Foundation setup complete)
- **Documentation**: `docs/VECHAIN_INTEGRATION_OPPORTUNITIES.md`

---

## 💬 Communication & Messaging

### 12. **Twilio** (SMS/Voice)
- **Package**: `packages/dreamnet-voice-twilio`
- **Agent**: DreamNetVoiceTwilio
- **Purpose**: SMS messaging, voice notifications
- **Capabilities**:
  - Send SMS messages
  - Route events to SMS
  - Format events to SMS
  - Message statistics
- **Env Vars**:
  - `TWILIO_ACCOUNT_SID`
  - `TWILIO_AUTH_TOKEN`
  - `TWILIO_PHONE_NUMBER`
  - `DREAMNET_VOICE_RECIPIENT`
- **Routes**: `/api/voice/*`, `/api/twilio/*`
- **Status**: ✅ Active, initializes on startup

### 13. **Gmail API** (Email via Google)
- **Package**: `packages/inbox-squared-core`
- **Adapter**: `GmailApiAdapter`
- **Purpose**: Email sending, draft creation, engagement tracking
- **Features**:
  - Send emails
  - Create drafts
  - Track engagement
  - Research engine integration
- **Routes**: `/api/google-integration/*`, `/api/inbox-squared/*`
- **Status**: ✅ Active

### 14. **DreamNet Email Service** (Email Provider)
- **File**: `server/email/DreamNetEmail.ts`
- **Purpose**: Email sending abstraction
- **Routes**: `/api/email/*`
- **Status**: ✅ Active

---

## 🤖 AI & Machine Learning

### 15. **OpenAI** (AI Services)
- **Package**: `openai` (^6.8.1)
- **Purpose**: AI-powered features
- **Use Cases**:
  - Dream title generation
  - SEO optimization
  - Content generation
  - Dream shopping
- **Env Var**: `OPENAI_API_KEY`
- **Routes**: `/api/dream-titles`, `/api/seoToolsRoutes`, `/api/dream-shopping`
- **Status**: ✅ Active

### 16. **Anthropic Claude** (AI Services)
- **Package**: `@anthropic-ai/sdk` (^0.37.0)
- **Purpose**: AI-powered features (alternative to OpenAI)
- **Status**: ✅ Available

---

## 💳 Payments & Commerce

### 17. **Stripe** (Payment Processing)
- **Package**: `stripe` (^14.21.0)
- **Purpose**: Payment processing, subscriptions, checkout
- **Capabilities**:
  - Create checkout sessions
  - Handle webhooks
  - Manage subscriptions
  - Billing management
- **Env Vars**:
  - `STRIPE_SECRET_KEY`
  - `STRIPE_WEBHOOK_SECRET`
- **Routes**:
  - `/api/stripe-checkout/*`
  - `/api/stripe-webhook/*`
  - `/api/stripe-billing/*`
- **Status**: ✅ Active

---

## 🔍 Search & Analytics

### 18. **Google Services** (Multiple)
- **Routes**: `/api/google-integration/*`
- **Services**:
  - **Gmail**: Email sending (`/send-email`)
  - **Calendar**: Event creation (`/create-calendar-event`)
  - **Google Ads**: (via `googleAdsRoutes.ts`)
- **Status**: ✅ Active (simulated/proof-of-concept)

### 19. **Telemetry Services**
- **Services**: 
  - Neon ping (`pingNeon`)
  - Upstash ping (`pingUpstash`)
- **Routes**: `/api/telemetry/*`
- **Status**: ✅ Available

---

## 🌍 Social Media & Communication Platforms

### 20. **Social Media Ops** (Multi-Platform)
- **Agent**: `CampaignMasterAgent`
- **Routes**: `/api/social-media-ops/*`
- **Platforms Supported**:
  - LinkedIn
  - Twitter/X
  - Facebook
  - Instagram
  - Threads
- **Capabilities**:
  - Initialize campaigns
  - Create posts
  - Auto-posting
  - Status tracking
- **Status**: ⚠️ Framework ready, API integration pending

### 21. **Discord** (Webhooks)
- **Purpose**: Webhook notifications
- **Status**: ✅ Referenced in docs

### 22. **Telegram** (Bot Messages)
- **Purpose**: Bot notifications
- **Status**: ✅ Referenced in docs

---

## 🔐 Authentication & Security

### 23. **Passport.js** (Authentication)
- **Package**: `passport`, `passport-local`
- **Purpose**: Authentication middleware
- **Status**: ✅ Active

### 24. **JWT** (JSON Web Tokens)
- **Package**: `jsonwebtoken`
- **Purpose**: Token-based authentication
- **Status**: ✅ Active

---

## 📊 Monitoring & Observability

### 25. **Lighthouse** (Performance Auditing)
- **Package**: `lighthouse` (^12.8.1)
- **Purpose**: Performance auditing
- **Status**: ✅ Available

### 26. **Chrome Launcher** (Browser Automation)
- **Package**: `chrome-launcher` (^1.2.0)
- **Purpose**: Browser automation for Lighthouse
- **Status**: ✅ Available

---

## 🗄️ Data & Storage

### 27. **Drizzle ORM** (Database ORM)
- **Package**: `drizzle-orm`, `drizzle-kit`
- **Purpose**: Type-safe database operations
- **Database**: PostgreSQL (Neon)
- **Status**: ✅ Active

### 28. **Multer** (File Upload)
- **Package**: `multer` (^1.4.5-lts.1)
- **Purpose**: File upload handling
- **Status**: ✅ Active

---

## 🔄 Webhooks & Event Systems

### 29. **Webhook Nervous Core** (Biomimetic Webhook Management)
- **Package**: `packages/webhook-nervous-core`
- **Purpose**: Auto-discovery and management of webhooks
- **Features**:
  - Nervous system (neurons, synapses, reflex arcs)
  - Immune system (antibodies, antigens, memory cells)
  - Mycelium network (hyphae, paths)
  - Ant colony (pheromone trails, routing)
- **Auto-Discovery**: ✅ Zero-touch webhook discovery
- **Routes**: `/api/webhook-*`
- **Status**: ✅ Active, runs every 5 minutes

### 30. **Stripe Webhooks**
- **Endpoint**: `/api/stripe-webhook`
- **Purpose**: Payment event handling
- **Status**: ✅ Active

---

## 🌉 Cross-Chain & Bridge Services

### 31. **Star Bridge Lungs** (Cross-Chain Routing)
- **Package**: `packages/star-bridge-lungs`
- **Purpose**: Cross-chain breathwork, chain monitoring
- **Features**:
  - Chain metrics
  - Breath snapshots
  - Cross-chain activity monitoring
- **Cycle**: Runs every 2 minutes
- **Status**: ✅ Active (when INIT_SUBSYSTEMS=true)

---

## 📡 API Management

### 32. **API Keeper Core** (Zero-Touch API Key Management)
- **Package**: `packages/api-keeper-core`
- **Purpose**: Auto-discovery and management of API keys
- **Features**:
  - Auto-discovery of API keys
  - Cost tracking
  - Provider management
- **Cycle**: Runs every 5 minutes
- **Status**: ✅ Active, auto-initializes on startup

### 33. **Env Keeper Core** (Zero-Touch Environment Management)
- **Package**: `packages/env-keeper-core`
- **Purpose**: Auto-discovery and management of environment variables
- **Features**:
  - Auto-discovery of env vars
  - Secret protection
  - Category organization
- **Cycle**: Syncs every 10 minutes
- **Status**: ✅ Active, auto-initializes on startup

---

## 🎨 UI & Frontend Libraries

### 34. **Shadcn/UI** (Component Library)
- **Purpose**: UI component library
- **Status**: ✅ Active

### 35. **Radix UI** (Headless Components)
- **Packages**: Multiple `@radix-ui/*` packages
- **Purpose**: Accessible headless UI primitives
- **Status**: ✅ Active

### 36. **Tailwind CSS** (Styling)
- **Package**: `tailwindcss`
- **Purpose**: Utility-first CSS framework
- **Status**: ✅ Active

### 37. **Framer Motion** (Animations)
- **Package**: `framer-motion`
- **Purpose**: Animation library
- **Status**: ✅ Active

### 38. **Lucide React** (Icons)
- **Package**: `lucide-react`
- **Purpose**: Icon library
- **Status**: ✅ Active

---

## 🔧 Development & Build Tools

### 39. **Vite** (Build Tool)
- **Package**: `vite`
- **Purpose**: Frontend build tool and dev server
- **Status**: ✅ Active

### 40. **ESBuild** (Bundler)
- **Package**: `esbuild`
- **Purpose**: Fast JavaScript bundler for backend
- **Status**: ✅ Active

### 41. **TypeScript** (Type Checking)
- **Package**: `typescript`
- **Purpose**: Static type checking
- **Status**: ✅ Active

### 42. **TanStack Query** (Server State)
- **Package**: `@tanstack/react-query`
- **Purpose**: Server state management
- **Status**: ✅ Active

### 43. **React Hook Form** (Form Management)
- **Package**: `react-hook-form`
- **Purpose**: Form state management
- **Status**: ✅ Active

### 44. **Zod** (Validation)
- **Package**: `zod`
- **Purpose**: Runtime type validation
- **Status**: ✅ Active

---

## 📦 Package Management

### 45. **pnpm** (Package Manager)
- **Version**: 10.21.0
- **Purpose**: Monorepo package management
- **Workspaces**: Configured in `pnpm-workspace.yaml`
- **Status**: ✅ Active

---

## 🔍 Additional Services & Utilities

### 46. **HTML2Canvas** (Screenshot)
- **Package**: `html2canvas`
- **Purpose**: Capture HTML elements as images
- **Status**: ✅ Available

### 47. **QRCode React** (QR Code Generation)
- **Package**: `qrcode.react`
- **Purpose**: QR code generation
- **Status**: ✅ Available

### 48. **Date-fns** (Date Utilities)
- **Package**: `date-fns`
- **Purpose**: Date manipulation utilities
- **Status**: ✅ Active

### 49. **Recharts** (Charts)
- **Package**: `recharts`
- **Purpose**: Chart visualization
- **Status**: ✅ Available

### 50. **Vis Network** (Network Visualization)
- **Package**: `vis-network`
- **Purpose**: Network graph visualization
- **Status**: ✅ Available

---

## 🔗 Internal Connectors & Bridges

### 51. **Agent Gateway** (AI-Native Ingress)
- **Routes**: `/api/agent-gateway/*`
- **Purpose**: ChatGPT, Cursor, Replit agent integration
- **Status**: ✅ Active

### 52. **ConnectorBot** (Task Routing)
- **Routes**: `/api/connector/*`, `/api/connector-v1/*`
- **Purpose**: Intelligent task routing between bots
- **Status**: ✅ Active

### 53. **Star Bridge** (Internal Routing)
- **Routes**: `/api/star-bridge/*`
- **Purpose**: Internal request routing
- **Status**: ✅ Active

### 54. **Nerve Fabric** (Event Bus)
- **Package**: `packages/nerve`
- **Purpose**: Internal event routing
- **Status**: ✅ Active

---

## 📋 Integration Summary

### By Category

**Infrastructure (3)**:
- Vercel, Railway, Neon PostgreSQL

**Blockchain (8)**:
- Base Mainnet, Base Sepolia, Hardhat, Ethers.js, Coinbase OnChainKit, Solana Wallet Adapter, Wagmi, SIWE

**Communication (3)**:
- Twilio, Gmail API, DreamNet Email Service

**AI/ML (2)**:
- OpenAI, Anthropic Claude

**Payments (1)**:
- Stripe

**Search & Analytics (2)**:
- Google Services, Telemetry Services

**Social Media (3)**:
- Social Media Ops, Discord, Telegram

**Authentication (2)**:
- Passport.js, JWT

**Monitoring (2)**:
- Lighthouse, Chrome Launcher

**Data & Storage (2)**:
- Drizzle ORM, Multer

**Webhooks (2)**:
- Webhook Nervous Core, Stripe Webhooks

**Cross-Chain (1)**:
- Star Bridge Lungs

**API Management (2)**:
- API Keeper Core, Env Keeper Core

**UI Libraries (5)**:
- Shadcn/UI, Radix UI, Tailwind CSS, Framer Motion, Lucide React

**Dev Tools (5)**:
- Vite, ESBuild, TypeScript, TanStack Query, React Hook Form, Zod

**Utilities (5)**:
- HTML2Canvas, QRCode React, Date-fns, Recharts, Vis Network

**Internal Connectors (4)**:
- Agent Gateway, ConnectorBot, Star Bridge, Nerve Fabric

---

## 🔑 Environment Variables Required

### Critical (Required for Core Functionality)
- `NODE_ENV` - Environment (development/production/test)
- `PORT` - Server port (auto-injected by Railway)

### Database
- `DATABASE_URL` or `NEON_DATABASE_URL` - PostgreSQL connection string

### Blockchain
- `BASE_MAINNET_RPC_URL` - Base mainnet RPC endpoint
- `BASE_SEPOLIA_RPC_URL` - Base Sepolia RPC endpoint
- `BASE_SCAN_API_KEY` - BaseScan API key for contract verification
- `PRIVATE_KEY` - Wallet private key for deployments

### AI Services
- `OPENAI_API_KEY` - OpenAI API key

### Communication
- `TWILIO_ACCOUNT_SID` - Twilio account SID
- `TWILIO_AUTH_TOKEN` - Twilio auth token
- `TWILIO_PHONE_NUMBER` - Twilio phone number
- `DREAMNET_VOICE_RECIPIENT` - SMS recipient phone number

### Payments
- `STRIPE_SECRET_KEY` - Stripe secret key
- `STRIPE_WEBHOOK_SECRET` - Stripe webhook secret

### Deployment
- `VERCEL_TOKEN` - Vercel API token

### Optional Feature Flags
- `INIT_SUBSYSTEMS` - Enable heavy subsystems (true/false)
- `MESH_AUTOSTART` - Auto-start mesh (true/false, default: true)
- `ALLOWED_ORIGINS` - CORS allowed origins (comma-separated)
- `OPERATOR_WALLETS` - Operator wallet addresses (comma-separated)

---

## 📊 Integration Status Overview

### ✅ Fully Active (35+)
- Vercel, Railway, Neon PostgreSQL
- Base Mainnet/Sepolia, Hardhat, Ethers.js
- Coinbase OnChainKit, Wagmi, SIWE
- Twilio, Gmail API, Email Service
- OpenAI, Anthropic Claude
- Stripe
- Webhook Nervous Core
- API Keeper Core, Env Keeper Core
- Star Bridge Lungs
- All UI libraries
- All dev tools
- Internal connectors

### ⚠️ Partially Active (5)
- Social Media Ops (framework ready, API integration pending)
- Google Services (simulated/proof-of-concept)
- Discord/Telegram (referenced, integration pending)
- Solana Wallet Adapter (available but not primary)

### 🔄 Auto-Discovery Systems (3)
- Webhook Nervous Core (auto-discovers webhooks)
- API Keeper Core (auto-discovers API keys)
- Env Keeper Core (auto-discovers env vars)

---

## 🎯 Integration Capabilities Summary

**Total Integrations**: 54+  
**Active Integrations**: 35+  
**Auto-Discovery Systems**: 3  
**Zero-Touch Systems**: 3  
**Blockchain Networks**: 2 (Base Mainnet, Base Sepolia)  
**Payment Processors**: 1 (Stripe)  
**Communication Channels**: 3 (SMS, Email, Social Media)  
**AI Providers**: 2 (OpenAI, Anthropic)  
**Hosting Providers**: 2 (Vercel, Railway)  
**Database Providers**: 1 (Neon PostgreSQL)

---

**All integrations are cataloged and ready for coordination!** 🚀

