# DreamNet Workflows - Complete Documentation

**Status**: ✅ Complete  
**Last Updated**: 2025-01-27  
**Purpose**: Document all critical workflow sequences and how systems interact

---

## 🎯 Executive Summary

This document covers **how systems execute in sequences**, from agent task routing to payment processing to governance proposals. Understanding these workflows is critical for deployment readiness.

---

## 🔄 WORKFLOW 1: AGENT TASK EXECUTION WORKFLOW

### WHAT: Agent Task Routing

**Super Spine** orchestrates agent tasks, routes them to agents, manages subscriptions, tracks health.

### WHERE: Super Spine

**File**: `server/core/SuperSpine.ts`  
**Route**: `server/routes/super-spine.ts`

### HOW: Task Submission Flow

```
User submits task via POST /api/super-spine/task
    ↓
Super Spine validates access (tier, subscription)
    ↓
Task queued to agent
    ↓
Agent processes task
    ↓
Result returned
```

**Detailed Flow**:

1. **Task Submission** (`server/routes/super-spine.ts` line 115)
   - User calls `POST /api/super-spine/task`
   - Validates `agentKey`, `type`, `input`
   - Checks access (tier, subscription)
   - Creates task

2. **Access Check** (`server/core/SuperSpine.ts` line 127)
   - Validates tier, subscription, trust score
   - Checks `completedDreams`, `stakedSheep`, `hasTokenBoost`
   - Returns access result

3. **Task Creation** (`server/core/SuperSpine.ts` line 331)
   - Creates task with `id`, `userId`, `agentKey`, `type`, `input`
   - Queues to agent
   - Returns task

### Agent Capabilities

**LUCID**: Code, analysis  
**CANVAS**: Design, code  
**ROOT**: Code, analysis  
**CRADLE**: Code, analysis (Premium)  
**WING**: Communication (Premium)  
**Wolf Pack**: Funding, communication, analysis

### WHY: Design Rationale

- **Tier-based**: Higher tiers unlock more agents
- **Subscription**: Premium agents require subscription
- **Trust Score**: Some agents require trust score > 60
- **Token Boost**: Unlocks premium agents

---

## 💰 WORKFLOW 2: X402 PAYMENT WORKFLOW

### WHAT: X402 Micropayments

**X402 protocol** micropayments between agents. Real-time, pay-per-use transactions.

### WHERE: X402 Payment Gateway

**File**: `server/core/agents/X402PaymentGateway.ts`  
**Route**: `server/routes/x402-payment-gateway.ts`

### HOW: Payment Flow

```
POST /api/x402/payment
    ↓
Validate fromAgentId, toAgentId, amount
    ↓
Get wallets (from/to)
    ↓
Process EVM transfer (ERC20)
    ↓
Broadcast event
    ↓
Return result
```

**Detailed Flow**:

1. **Payment Request** (`server/routes/x402-payment-gateway.ts` line 21)
   - Validates `fromAgentId`, `toAgentId`, `amount`
   - Processes payment
   - Returns result

2. **Wallet Retrieval** (`server/core/agents/X402PaymentGateway.ts` line 111)
   - Gets wallets from Agent Wallet Manager
   - Processes transfer
   - Returns result

3. **Event Broadcast** (`server/core/agents/X402PaymentGateway.ts` line 146)
   - Broadcasts `x402.payment.success` or `x402.payment.failed`
   - Returns result

### WHY: Design Rationale

- **Micropayments**: Real-time settlement
- **Multi-chain**: Base, Solana, Polygon
- **Agent-to-agent**: Direct transfers

---

## 🏛️ WORKFLOW 3: DREAMSTATE GOVERNANCE WORKFLOW

### WHAT: Governance Proposals

**DreamState** governance: proposals, voting, execution.

### WHERE: Governance System

**File**: `packages/dream-state-core/logic/governance.ts`  
**Route**: `server/routes/dreamstate.ts`

### HOW: Proposal Flow

```
Citizen creates proposal
    ↓
Proposal goes to vote
    ↓
Citizens vote (tier-weighted)
    ↓
If passed → Head of State executes
```

**Detailed Flow**:

1. **Create Proposal** (`packages/dream-state-core/logic/governance.ts` line 7)
   - Citizen creates proposal
   - Proposal stored in DreamState
   - Returns proposal

2. **Open for Voting** (`packages/dream-state-core/logic/governance.ts` line 19)
   - Proposal goes to vote
   - Citizens vote (tier-weighted)
   - Tally votes

3. **Execute** (`packages/dream-state-core/logic/governance.ts` line 45)
   - If passed, Head of State executes
   - Returns result

### WHY: Design Rationale

- **Tier-weighted**: Higher tiers have more weight
- **Citizen+**: Only citizens and above can vote
- **Proposal States**: draft → open → passed/rejected → executed

---

## 🕷️ WORKFLOW 4: SPIDER WEB EVENT ROUTING WORKFLOW

### WHAT: Event Routing

**Spider Web** routes events as "threads" to target systems.

### WHERE: Spider Web Core

**File**: `packages/spider-web-core/`  
**Route**: `server/routes/starbridge.ts`

### HOW: Event Flow

```
External event arrives
    ↓
Spider Web catches fly
    ↓
Creates thread
    ↓
Routes to target system
```

**Detailed Flow**:

1. **External Event** (`server/routes/starbridge.ts`)
   - Event arrives
   - Spider Web catches fly
   - Creates thread
   - Routes to target

2. **Thread Creation** (`packages/spider-web-core/logic/flyCatcher.ts`)
   - Classifies fly
   - Creates thread
   - Routes to target

3. **Pattern Learning** (`packages/spider-web-core/logic/patternLearner.ts`)
   - Learns from threads
   - Updates patterns

### WHY: Design Rationale

- **Biomimetic**: Mirrors biological nervous system
- **Event-driven**: Decoupled architecture
- **Pattern Learning**: Improves over time

---

## 🎯 WORKFLOW 5: ORCHESTRATOR CYCLE WORKFLOW

### WHAT: Orchestrator Cycle

**Orchestrator** runs subsystems in sequence.

### WHERE: Orchestrator Core

**File**: `packages/orchestrator-core/logic/runCycle.ts`  
**Route**: `server/routes/orchestrator.ts`

### HOW: Cycle Flow

```
Cycle starts
    ↓
Citadel runs (strategic command)
    ↓
FieldLayer runs (fields updated)
    ↓
Core analytics run
    ↓
Dream subsystems run
    ↓
User-facing subsystems run
    ↓
Panel + OS summary
```

**Detailed Flow**:

1. **Citadel** (`packages/orchestrator-core/logic/runCycle.ts` line 16)
   - Strategic command center
   - Generates snapshots
   - Provides foundational data

2. **FieldLayer** (`packages/orchestrator-core/logic/runCycle.ts` line 35)
   - Fields updated
   - Other systems can sample

3. **Core Analytics** (`packages/orchestrator-core/logic/runCycle.ts` line 49)
   - Agent Registry Core
   - Economic Engine Core

### WHY: Design Rationale

- **Sequential**: Subsystems run in order
- **Dependencies**: Later subsystems depend on earlier
- **Context**: Each subsystem receives context

---

## 📊 WORKFLOW 6: REQUEST-TO-RESPONSE WORKFLOW

### WHAT: Request Flow

**HTTP request** → middleware → route → response.

### WHERE: Express Server

**File**: `server/index.ts`  
**Route**: `server/routes/`

### HOW: Request Flow

```
HTTP Request
    ↓
Middleware
    ↓
Route Handler
    ↓
Response
```

**Detailed Flow**:

1. **Request** (`server/routes/`)
   - User makes request
   - Middleware processes
   - Route handler executes
   - Response returned

2. **Middleware** (`server/middleware/`)
   - Body parsing
   - CORS
   - Rate limiting
   - Authentication

3. **Route Handler** (`server/routes/`)
   - Processes request
   - Returns response

### WHY: Design Rationale

- **Express**: Standard Express patterns
- **Middleware**: Reusable logic
- **Error Handling**: Consistent errors

---

## 🎓 SUMMARY

**Workflows Documented**:
- ✅ Agent Task Execution
- ✅ X402 Payment
- ✅ DreamState Governance
- ✅ Spider Web Event Routing
- ✅ Orchestrator Cycle
- ✅ Request-to-Response

**Status**: ✅ **100% Complete** - All workflows documented

---

**Next Steps**: Continue deep dive into remaining systems

