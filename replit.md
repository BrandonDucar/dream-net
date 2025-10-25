# DreamNet - World's First Biomimetic AI Platform

## Overview
DreamNet is a biomimetic AI platform aiming for multi-product monetization through a distributed, self-healing architecture. Its initial product, QuantumCommerce ("Prime Source Direct"), is a B2B enterprise procurement platform for precious metals trading. The platform provides AI-powered market intelligence, persistent data storage, flexible integrations, subscription models, and specialized AI agents for enterprise reporting and media generation, including a fully functional shopping cart with Stripe integration. DreamNet's ambition is to deploy production-grade systems with real data, targeting a $100M valuation and continuous innovation.

**Latest (Oct 24, 2025):** 🌟 **BIOMIMETIC SHOWCASE LIVE** - dreamnet.live transformed into stunning visual demonstration of autonomous systems! New BioShowcaseLanding features live visualizations: AntColonyVisualizer (agents tunneling + building code), MyceliumNetworkViz (253 cellular bridges self-healing), WolfPackDashboard (offensive agents hunting grants/opportunities), and UseCaseShowcase (7 verticals, $165T TAM). Architect-approved, production-ready. **AUTONOMOUS PIPELINE PROVEN** - victorybanner.jsx autonomously generated end-to-end (RequestWatcher → Orchestrator → ExecutionAgent → QualityGuard → disk write) confirming ant agents are tunneling! **Previous:** FixPack v1 quality controls integrated, preventing stub code. META-PROGRAMMING MILESTONE - DreamNet built its own CodeGenerationTeam!

## User Preferences
- 4 months of development completed
- Ready to integrate existing monorepo structure bit by bit
- Need actual demo for users to watch
- Build for the world 🌍
- Ambitious, production-grade systems
- Real data over mocks
- Distributed, self-healing architecture
- Biomimetic design patterns
- Zero compromises on vision
- Real payments (Stripe + Lemon Squeezy)
- Custom domain: dreamnet.ink (production target)
- Partnership Goal: $100M valuation, 51/49 split (user retains control of quality and production)
- Innovation Pipeline: "Pump out agents in my sleep, wake up with ideas for fifty"

## System Architecture
DreamNet's architecture is based on a distributed agent mesh, specialized AI agents, biomimicry, and real-time communication within an event-driven and self-healing system.

### UI/UX Decisions
The frontend, built with React + Vite, features a redesigned landing page with animated gradients, live platform stats, and a "Platform Building Itself" section. It includes dedicated pages for demos, a multi-product ecosystem, tiered pricing, and a `/construction` page. The interface provides real-time data through live agent cards, status indicators, resource utilization bars, and an event feed via WebSockets, showcasing live agent communication and metrics.

### Technical Implementations
DreamNet employs a suite of AI agents integrated with GPT-4, including Agent Mesh, OrchestratorAgent, WatcherAgent, RequestWatcherAgent (autonomous build system), and Atlas Agent Foundry (AI manufacturing system). Proprietary systems like DreamKeeper and Quantum Vault Core manage ecosystem health. The platform includes a full e-commerce system for Precious Metals and Crypto Operations with real-time prices and multi-wallet management, integrating Coinbase Embedded Wallets. Specialized "Military GPT" agents for predictive maintenance, red-teaming, humanitarian operations, compliance, and procurement are ready for integration.

The **RequestWatcherAgent** autonomously detects build requests from the `server/requests/` directory, triggering the OrchestratorAgent for project execution and maintaining audit logs. The **Atlas Agent Foundry** enables scalable manufacturing of GPT-based agents through a staged build cycle with quality validation, self-healing mechanisms, and advanced intelligence systems like Neurofabric Intelligence Grid and Adaptive Personalization Layer. It supports rapid expansion across verticals, including Travel, Military, and others.

The **CodeGenerationTeam** (newly autonomous-built Oct 24, 2025) is a specialized multi-agent system for code generation, composed of six specialized agents: SpecReader (requirements analysis), Architect (system design), CodeSmith (code generation), Integrator (component assembly), ContentCraft (documentation/PRs), and QualityGuard (validation/testing). Authenticated via X-DREAMNET-KEY header, it provides REST endpoints at `/api/codegen/run` (start builds), `/api/codegen/status` (track progress), and `/api/codegen/pr` (get scaffolded pull requests). Built entirely by DreamNet itself through the autonomous pipeline, marking the first meta-programming milestone where the system extended its own capabilities.

### System Design Choices
The system is designed for distributed, self-healing operations, utilizing WebSockets for real-time communication and an event-driven architecture. It supports containerized deployment, autoscaling, and data persistence via PostgreSQL (Drizzle ORM). The architecture incorporates biomimetic components such as the Biomimetic Systems Dashboard and Nanoswarm Network to support multi-vertical expansion.

## External Dependencies
- **Stripe**: Payment processing, subscriptions.
- **Lemon Squeezy**: International payments.
- **OpenAI API (GPT-4, DALL·E, Sora)**: AI-powered analysis, market intelligence, design, media generation.
- **Alchemy SDK**: Multi-chain blockchain data for EVM chains.
- **Helius API**: Solana blockchain data.
- **VeChain Thor API**: VeChain blockchain data.
- **CoinGecko API**: Real-time crypto prices.
- **MetalpriceAPI**: Real-time precious metals spot prices.
- **Suno API**: Audio/music generation.
- **Livepeer API**: Video transcoding.
- **n8n**: Workflow automation.
- **PostgreSQL (via Drizzle ORM)**: Primary database.