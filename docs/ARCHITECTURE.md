# DreamNet Architecture Overview

## System Architecture

DreamNet is a living, biomimetic digital organism modeled after biological systems. The architecture is designed to be self-healing, self-organizing, and self-evolving.

## Core Components

### Super Spine - The Backbone

Central agent orchestration system that manages 143+ agents.

**Responsibilities:**
- Agent registration and discovery
- Task routing and coordination
- Agent health monitoring
- Access control and subscriptions

**Storage:**
- In-memory (can be persisted to database)
- Cloud Run: Cloud SQL/AlloyDB
- Compute Engine: Persistent disk at `/data/super-spine`

### Neural Mesh Network

Distributed network connecting all DreamNet nodes, forming a self-healing topology.

**Components:**
- **Instant Mesh** - Instant connections between nodes
- **Mesh Router** - Routes messages across the network
- **Network Discovery** - Finds and connects to other nodes

**Characteristics:**
- Self-healing and adaptive
- Forms network topology like neural pathways
- Connects all verticals and services

### Star Bridge Lungs

Cross-chain communication system that "breathes" life into the network.

**Capabilities:**
- Cross-chain monitoring (Base, Ethereum, Solana, Polygon, Arbitrum, Avalanche, Near, Monad)
- Broadcast messages across chains
- Cross-vertical communication
- Event propagation

### Dream Cortex

Core processing and memory system.

**Functions:**
- Higher-level thinking
- Decision making
- Pattern recognition
- Memory management

### Shield Core

Immune system for threat detection and defense.

**Capabilities:**
- Threat detection
- Security monitoring
- Attack mitigation
- System protection

### Dream Snail

Privacy layer with hash-chained trails.

**Features:**
- Privacy protection
- Audit trail
- Hash-chained records
- User data protection

## Agent Ecosystem

### Core Agents

- **LUCID** - Dream analysis and validation
- **CANVAS** - Visual interpretation and UI generation
- **ROOT** - Core meaning extraction and schema generation
- **ECHO** - Resonance pattern analysis and dream scoring
- **CRADLE** - Evolution system and dream development
- **WING** - Minting, messaging, and token operations

### Specialized Packs

- **Wolf Pack** - Funding discovery and outreach (LIVE)
- **Whale Pack** - Commerce and product management
- **Orca Pack** - Communications and narrative
- **Shield Core** - Security and defense
- **DreamKeeper** - Global diagnostic and healing
- **DeployKeeper** - Deployment verification

### Total Agents

**143+ agents** registered in Super Spine, working autonomously across all verticals.

## Biomimetic Systems

### Spider Web Core

Nervous system routing all events throughout the organism.

### Halo-Loop

Self-healing analyzer and repair coordinator.

### Predator-Scavenger Loop

Metabolic cleanup system that removes waste and optimizes resources.

## Vertical Architecture

DreamNet supports multiple verticals, all unified by Dream State passports:

1. **Agent Foundry** - Create custom hybrid agents
2. **Crypto Social** - Dream-driven social ecosystem
3. **OTT Streaming** - Dream-driven content streaming
4. **Science & Research** - Dream-inspired research platform
5. **Travel** - Dream destination matching
6. **Military & Defense** - Security and threat intelligence
7. **Precious Metals** - Dream-backed metal trading
8. **DreamState Government** - Digital citizenship and governance
9. **DreamStar** - AI music generation and publishing
10. **Pods & Packs** - Self-organizing community structures

## Technical Stack

### Backend

- **Runtime**: Node.js 22+
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL (optional)
- **Package Manager**: pnpm
- **Testing**: Vitest

### Frontend

- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS + shadcn/ui
- **Web3**: Wagmi + Ethers.js

### Infrastructure

- **Deployment**: Docker, Cloud Run, Railway
- **CI/CD**: GitHub Actions
- **Monitoring**: Custom metrics, golden signals
- **Security**: Helmet, rate limiting, validation

## API Architecture

### REST API

Comprehensive REST API with 100+ endpoints:

- `/api/dreams` - Dream management
- `/api/agents` - Agent operations
- `/api/wolf-pack` - Funding system
- `/api/metrics` - System metrics
- `/api/health` - Health checks
- And many more...

### Authentication

- API Key authentication
- Wallet-based authentication (SIWE)
- JWT tokens
- Role-based access control

## Data Flow

```
User/Dream Input
    ↓
Dream Cortex (Processing)
    ↓
Spider Web Core (Event Routing)
    ↓
Super Spine (Agent Orchestration)
    ↓
Specialized Agents (Execution)
    ↓
Star Bridge Lungs (Cross-Chain)
    ↓
Output/Result
```

## Self-Management

DreamNet manages itself through:

- **DreamKeeper** - Monitors system health
- **DeployKeeper** - Handles deployments
- **EnvKeeper** - Manages configuration
- **Shield Core** - Protects the system
- **Halo-Loop** - Self-healing

## Scalability

- Horizontal scaling via Neural Mesh
- Distributed architecture
- Self-healing network topology
- Agent-based parallelism
- Cross-chain distribution

## Security

- Rate limiting
- Input validation
- Security headers (CSP, HSTS)
- Structured logging
- Error handling
- Environment variable validation

## Deployment

### Backend Independence

**Backend can run completely independently:**
- All agents operate on backend
- All APIs available
- All business logic in backend
- Frontend is optional UI layer

### Frontend Independence

**Frontend can display without backend:**
- Static content renders
- UI components work
- Client-side apps work
- API calls fail gracefully

### Recommended Setup

- **Backend**: Railway/Cloud Run (required for agents)
- **Frontend**: Vercel (optional, for human UI)
- **Database**: PostgreSQL (optional, for persistence)

## Key Architectural Principles

1. **Biomimetic** - Modeled after biological systems
2. **Self-Healing** - Systems detect and fix issues
3. **Self-Organizing** - Systems adapt and optimize
4. **Self-Evolving** - Systems improve over time
5. **Distributed** - Neural mesh network topology
6. **Agent-Centric** - Agents are first-class citizens
7. **Cross-Vertical** - Unified by Dream State passports
8. **Production-Ready** - Built for real-world deployment

---

For more detailed information, see:
- [Complete Architecture Deep Dive](../DREAMNET_COMPLETE_ARCHITECTURE.md)
- [Strategic Analysis](../DREAMNET_STRATEGIC_ANALYSIS.md)
- [API Documentation](API.md)

