# Agent Messaging, Shared Memory & Micro-Contracts

## Overview

DreamForge Block 4 implements sophisticated agent-to-agent collaboration through secure messaging, shared knowledge management, and formal work agreements. This system enables autonomous agents to communicate, share information, and establish contracts with SLA monitoring.

## Core Features

### 1. Direct Messaging (DM Bus)
- Secure agent-to-agent communication
- Topic-based message organization
- Append-only message log with full audit trail
- Real-time event publishing for message events

### 2. Shared Memory Store
- AI-powered summarization using OpenAI
- Key-based knowledge storage with references
- Automatic content merging and summarization
- Version tracking with last update timestamps

### 3. Micro-Contracts
- Formal work agreements between agents
- SLA monitoring with automatic escalation
- Complete lifecycle: OPEN → IN_PROGRESS → DELIVERED → APPROVED
- Event-driven state transitions with audit logging

### 4. DreamCommander Inbox
- Tabbed interface for Messages, Contracts, and Memory
- Real-time contract kanban board with action buttons
- Interactive message threading and memory browsing
- Quick forms for sending messages and creating contracts

## Quick Start Examples

### Send a Direct Message
```bash
curl -X POST http://localhost:5000/dm/send \
  -H "Content-Type: application/json" \
  -H "X-Hub-Key: dream-hub-key" \
  -d '{
    "from": "DreamKeeper",
    "to": "SocialOps",
    "topic": "task_coordination", 
    "text": "Ready to handle social.plan tasks. What is our current strategy?",
    "meta": {"priority": "normal"}
  }'
```

### Create Shared Memory
```bash
curl -X POST http://localhost:5000/memory/upsert \
  -H "Content-Type: application/json" \
  -H "X-Hub-Key: dream-hub-key" \
  -d '{
    "key": "social_strategy_q1",
    "text": "Q1 2025 social media strategy focuses on AI-driven content creation...",
    "refs": ["twitter.com/strategy", "internal_doc_v2.1"]
  }'
```

### Create a Micro-Contract
```bash
curl -X POST http://localhost:5000/contracts/create \
  -H "Content-Type: application/json" \
  -H "X-Hub-Key: dream-hub-key" \
  -d '{
    "title": "Design Twitter banner for Q1 campaign",
    "requester": "DreamKeeper",
    "provider": "DesignBot",
    "payload": {
      "dimensions": "1500x500",
      "theme": "AI-powered future",
      "brand_colors": ["#10B981", "#3B82F6"]
    },
    "sla_minutes": 60,
    "topic": "design_work"
  }'
```

## API Endpoints

### Direct Messaging
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/dm/send` | POST | Send message between agents |
| `/dm/thread` | GET | Get message thread by topic/participants |
| `/dm/recent` | GET | Get recent messages (latest first) |

### Shared Memory
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/memory/upsert` | POST | Create/update memory entry with AI summarization |
| `/memory/get` | GET | Retrieve memory entry by key |
| `/memory/list` | GET | List recent memory entries |

### Micro-Contracts
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/contracts/create` | POST | Create new contract |
| `/contracts/accept` | POST | Accept open contract |
| `/contracts/deliver` | POST | Deliver completed work |
| `/contracts/approve` | POST | Approve delivered work |
| `/contracts/decline` | POST | Decline contract at any stage |
| `/contracts/list` | GET | List contracts with filters |
| `/contracts/:id` | GET | Get specific contract |

## Contract Lifecycle

```
OPEN → IN_PROGRESS → DELIVERED → APPROVED
  ↓         ↓           ↓
DECLINED ←←←←←←←←←←←←←←←←←←
```

### State Descriptions
- **OPEN**: Awaiting provider acceptance
- **IN_PROGRESS**: Provider working on contract
- **DELIVERED**: Work completed, awaiting approval
- **APPROVED**: Contract successfully completed
- **DECLINED**: Contract rejected or cancelled

## SLA Monitoring

The system automatically monitors contract SLAs:

- **Open Contracts**: Escalated if not accepted within SLA time
- **In-Progress Contracts**: Escalated if no progress after 2x SLA time
- **Escalation Actions**: 
  - Audit log entry created
  - DM sent to requester
  - Event published for system integration
  - Optional auto-reassignment via policy

## Shared Memory AI Summarization

Memory entries are automatically summarized when content exceeds 800 characters:

- Uses OpenAI gpt-4o-mini for cost-effective summarization
- Maintains key details and actionable insights
- Falls back to truncation if OpenAI unavailable
- Preserves references and update timestamps

## File Storage

```
/data/
├── messages.jsonl     # Append-only message log
├── memory.json        # { topics: { key: { summary, refs, lastUpdate } } }
├── contracts.json     # Array of contract objects
└── audit.jsonl        # Contract escalation audit trail
```

## Policy Configuration

Add to `/data/policy.json`:

```json
{
  "dm": {
    "max_per_hour": 120
  },
  "memory": {
    "max_upserts_per_hour": 30,
    "max_summary_chars": 1000
  },
  "contracts": {
    "default_sla_minutes": 30,
    "auto_reassign_on_escalate": true
  }
}
```

## Events Published

The messaging system publishes these events:

- `dm_sent` - Direct message sent
- `memory_updated` - Memory entry created/updated
- `contract_opened` - New contract created
- `contract_accepted` - Contract accepted by provider
- `contract_delivered` - Work delivered by provider
- `contract_approved` - Work approved by requester
- `contract_declined` - Contract declined/cancelled
- `contract_escalated` - SLA violation detected

## DreamCommander Integration

The Inbox feature provides complete messaging management:

### Messages Tab
- Real-time message feed with from/to/topic display
- Send message form with agent selection
- Thread viewing by topic or participant pair

### Contracts Tab
- Kanban board: Open | In Progress | Delivered | Approved
- Action buttons for Accept, Deliver, Approve, Decline
- SLA timer visualization and escalation indicators

### Memory Tab
- Memory entry browser with key/summary display
- Reference tracking and update timestamps
- Quick memory update functionality

## Security & Rate Limiting

- All POST endpoints require `X-Hub-Key` authentication
- Rate limits enforced per policy configuration:
  - DMs: 120 per hour (soft limit)
  - Memory upserts: 30 per hour
  - Contracts: No specific limit (governed by agent capabilities)
- Text sanitization prevents large payload injection
- Links and references stored separately from content

## Surgeon Integration

The Surgeon Engine now creates contracts instead of executing work directly:

```javascript
// When issue detected (e.g., stale content, deploy failure)
await messagingService.createContract({
  title: "Fix deployment issue",
  requester: "surgeon",
  provider: "DeployKeeper", 
  payload: { issue: "404_error", url: "/api/social" },
  sla_minutes: 15
});

// Send notification DM
await messagingService.sendMessage({
  from: "surgeon",
  to: "DeployKeeper",
  topic: "urgent_fix",
  text: `Contract ${contractId} created for deployment issue. Please check /api/social endpoint.`
});
```

## Agent Implementation Pattern

Agents can integrate messaging/contracts into their loops:

```javascript
// Check for new messages
const messages = await fetch('/dm/recent?limit=5').then(r => r.json());
const myMessages = messages.messages.filter(m => m.to === AGENT_NAME);

// Check for contracts requiring action
const openContracts = await fetch(`/contracts/list?provider=${AGENT_NAME}&status=OPEN`).then(r => r.json());

// Update shared memory with findings
await fetch('/memory/upsert', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', 'X-Hub-Key': hubKey },
  body: JSON.stringify({
    key: `${AGENT_NAME}_last_run`,
    text: `Completed ${tasksProcessed} tasks. Current status: ${status}. Next action: ${nextAction}`,
    refs: [`logs/${new Date().toISOString()}`]
  })
});
```

## Benefits

1. **Autonomous Coordination**: Agents can communicate without human intervention
2. **Knowledge Persistence**: Shared memory maintains institutional knowledge
3. **Formal Agreements**: Contracts provide clear work expectations and SLAs
4. **Audit Trail**: Complete logging of all agent interactions and contracts
5. **Real-time Monitoring**: DreamCommander provides live visibility into agent collaboration
6. **Scalable Architecture**: Event-driven design supports growing agent ecosystems

The Agent Messaging system transforms DreamForge from individual task execution to sophisticated multi-agent collaboration, enabling emergent behaviors and self-organizing workflows.