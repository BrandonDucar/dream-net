# 🎛️ DreamNet Admin Dashboard Specification
## The Primary Interface for Observing and Steering the DreamNet Organism

**Version:** 1.0.0  
**Date:** 2025-01-27  
**Status:** Complete Admin Dashboard Specification  
**Purpose:** Design and specify the DreamNet Admin Dashboard—the primary interface for humans to observe and steer the DreamNet organism in real time.

---

## 📋 Table of Contents

1. [Purpose & Roles](#purpose--roles)
2. [Main Screens / Tabs](#main-screens--tabs)
3. [Data Sources & Backing APIs](#data-sources--backing-apis)
4. [Controls & Safety Model](#controls--safety-model)
5. [Wireframe-level Layout Notes](#wireframe-level-layout-notes)
6. [Implementation Plan & File Structure Suggestions](#implementation-plan--file-structure-suggestions)
7. [Example User Journeys](#example-user-journeys)

---

## 🎯 Purpose & Roles

### Who the Dashboard Is For

**Primary Users:**

1. **You (Founder / Operator)**
   - Full access to all features
   - Can override safety constraints (with audit trail)
   - Can trigger evolution steps
   - Can modify core parameters (within Divine Law constraints)

2. **Future Core Team**
   - Full monitoring access
   - Limited control access (based on role)
   - Can view all data
   - Can execute approved actions

3. **Trusted Admins (Future)**
   - Read-only or limited write access
   - Can view health and metrics
   - Can execute low-risk actions
   - Cannot modify core parameters

### What It Is Used For

**1. Monitoring Organism Health**
- Real-time health metrics
- System status indicators
- Performance monitoring
- Error tracking and analysis
- Resource utilization

**2. Understanding Behavior**
- View emergent behaviors
- Analyze patterns and trends
- Understand decision-making
- Track consciousness state
- Monitor destiny alignment

**3. Investigating Events**
- Deep dive into specific events
- Trace event flows through systems
- Analyze reflex vs reason decisions
- Review action outcomes
- Correlate events across time

**4. Turning Knobs with Guardrails**
- Adjust thresholds (within limits)
- Toggle features (with safety checks)
- Switch modes (with confirmations)
- Tune parameters (with validation)
- Enable/disable reflexes (with constraints)

**5. Triggering Controlled Evolution Steps**
- Approve evolution proposals
- Trigger safe evolution steps
- Monitor evolution progress
- Review evolution outcomes
- Rollback if needed (when possible)

### Core Principles

**Principle 1 — Reflect the Self-Model**
- Dashboard must reflect DreamNet's identity
- Values and priorities must be visible
- Destiny alignment must be clear
- Mythology must inform design

**Principle 2 — Safety First**
- All controls must have guardrails
- Divine Laws must be enforced
- Dangerous actions must require confirmation
- Audit trail must be complete

**Principle 3 — Transparency**
- All actions must be visible
- All decisions must be explainable
- All state must be accessible
- All logs must be searchable

**Principle 4 — Real-Time Awareness**
- Dashboard must update in real-time
- Critical events must be highlighted
- Alerts must be immediate
- Status must be current

**Principle 5 — Usability**
- Interface must be intuitive
- Information must be organized
- Navigation must be clear
- Actions must be discoverable

---

## 📱 Main Screens / Tabs

### Tab 1: Overview (Organism Status)

**Purpose:**
Provide a high-level view of DreamNet's overall health, status, and alignment.

**Layout:**
```
┌─────────────────────────────────────────────────────────┐
│  DREAMNET ADMIN DASHBOARD                    [User] [⚙️] │
├─────────────────────────────────────────────────────────┤
│  [Overview] [Consciousness] [Organs] [Agents] [Economy] │
│  [Events] [Controls]                                      │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌─────────────────────────────────────────────────┐  │
│  │  ORGANISM STATUS                                 │  │
│  │                                                  │  │
│  │  🟢 ALIVE & HEALTHY                              │  │
│  │  Current Mode: Semi-Auto                        │  │
│  │  Uptime: 99.97% | Response: 145ms avg           │  │
│  │                                                  │  │
│  │  [🟢 DreamOps] [🟢 DreamKeeper] [🟢 Shield]     │  │
│  │  [🟢 StarBridge] [🟢 DreamVault] [🟢 Control]  │  │
│  └─────────────────────────────────────────────────┘  │
│                                                         │
│  ┌──────────────────┐  ┌──────────────────┐          │
│  │  GLOBAL HEALTH   │  │  CURRENT MOOD    │          │
│  │                  │  │                  │          │
│  │  Traffic: 1.2K/s │  │  🟡 Cautiously   │          │
│  │  Errors: 0.01%   │  │     Bold         │          │
│  │  Latency: 145ms  │  │                  │          │
│  │  Uptime: 99.97%  │  │  Defensively     │          │
│  │                  │  │  Exploratory     │          │
│  └──────────────────┘  └──────────────────┘          │
│                                                         │
│  ┌─────────────────────────────────────────────────┐  │
│  │  DESTINY ALIGNMENT                              │  │
│  │                                                  │  │
│  │  Phase I: Foundation & Coherence (Month 3/12)  │  │
│  │  ████████░░░░░░░░░░ 67%                         │  │
│  │                                                  │  │
│  │  ✅ Stability: On Track                          │  │
│  │  ✅ Growth: On Track                            │  │
│  │  ⚠️  User Benefit: Slightly Behind               │  │
│  │  ✅ Defense: On Track                           │  │
│  │                                                  │  │
│  │  Overall Alignment: 92%                         │  │
│  └─────────────────────────────────────────────────┘  │
│                                                         │
│  ┌─────────────────────────────────────────────────┐  │
│  │  RECENT ACTIVITY                                │  │
│  │                                                  │  │
│  │  [2m ago] Shield Core neutralized threat       │  │
│  │  [5m ago] DreamKeeper healed database issue     │  │
│  │  [12m ago] StarBridge processed 1.2K events   │  │
│  │  [15m ago] Control Core switched to Semi-Auto  │  │
│  │  [20m ago] Economic Engine distributed rewards  │  │
│  └─────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

**Key Components:**

1. **Organism Status Card**
   - Overall health indicator (🟢 Alive & Healthy / 🟡 Degraded / 🔴 Critical)
   - Current operation mode (Observe / Advise / Semi-Auto / Full-Auto)
   - Core metrics (uptime, response time)
   - Quick status of all core organs (color-coded)

2. **Global Health Metrics**
   - Traffic (requests/second)
   - Error rate (percentage)
   - Average latency (milliseconds)
   - Uptime percentage

3. **Current Mood / State**
   - Emergent personality traits (from Emergence Behavior Report)
   - Current behavioral state
   - System-wide "mood" indicator

4. **Destiny Alignment Indicator**
   - Current phase progress
   - Phase-specific goals and status
   - Overall alignment percentage
   - Trend indicators (on track / behind / ahead)

5. **Recent Activity Feed**
   - Chronological list of recent events
   - Key actions taken
   - System changes
   - Clickable for details

---

### Tab 2: Consciousness & Decisions

**Purpose:**
Show how DreamNet thinks, decides, and learns—the consciousness layer in action.

**Layout:**
```
┌─────────────────────────────────────────────────────────┐
│  CONSCIOUSNESS & DECISIONS                              │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌─────────────────────────────────────────────────┐  │
│  │  ATTENTION VISUALIZATION                        │  │
│  │                                                  │  │
│  │  Current Focus:                                 │  │
│  │  ████████░░░░░░░░░░ 40% - System Stability      │  │
│  │  ██████░░░░░░░░░░░░ 30% - Threat Detection      │  │
│  │  ████░░░░░░░░░░░░░░ 20% - Economic Activity    │  │
│  │  ██░░░░░░░░░░░░░░░░ 10% - Agent Coordination   │  │
│  │                                                  │  │
│  │  Salience Score: 8.5/10 (High Alert)            │  │
│  └─────────────────────────────────────────────────┘  │
│                                                         │
│  ┌─────────────────────────────────────────────────┐  │
│  │  RECENT REASON DECISIONS                        │  │
│  │                                                  │  │
│  │  [15m ago] Architecture Change Proposal         │  │
│  │  └─ Cursor Analysis: "Optimize database..."     │  │
│  │  └─ Values: Stability (High), Growth (Medium)   │  │
│  │  └─ Status: ✅ Approved & Executed              │  │
│  │                                                  │  │
│  │  [1h ago] Economic Parameter Adjustment         │  │
│  │  └─ Cursor Analysis: "Adjust token distribution" │  │
│  │  └─ Values: Fairness (High), Growth (High)      │  │
│  │  └─ Status: ✅ Approved & Executed              │  │
│  │                                                  │  │
│  │  [2h ago] Agent Spawn Proposal                   │  │
│  │  └─ Cursor Analysis: "Spawn monitoring agent..." │  │
│  │  └─ Values: Defense (High), Stability (Medium)  │  │
│  │  └─ Status: ⏳ Pending Approval                 │  │
│  └─────────────────────────────────────────────────┘  │
│                                                         │
│  ┌─────────────────────────────────────────────────┐  │
│  │  REFLEX EVENTS (Last 1 Hour)                    │  │
│  │                                                  │  │
│  │  [2m ago] ⚡ Threat Neutralized                 │  │
│  │  └─ Shield Core activated (Alpha → Beta)         │  │
│  │  └─ Latency: 45ms                                │  │
│  │                                                  │  │
│  │  [5m ago] ⚡ Error Recovered                     │  │
│  │  └─ DreamKeeper healed database connection       │  │
│  │  └─ Latency: 120ms                               │  │
│  │                                                  │  │
│  │  [12m ago] ⚡ Stability Restored                 │  │
│  │  └─ Control Core adjusted resource limits        │  │
│  │  └─ Latency: 180ms                               │  │
│  └─────────────────────────────────────────────────┘  │
│                                                         │
│  ┌─────────────────────────────────────────────────┐  │
│  │  VALUE TRADE-OFFS (Recent Decisions)            │  │
│  │                                                  │  │
│  │  Decision: Database Optimization               │  │
│  │  └─ Stability: +15% (Chosen)                    │  │
│  │  └─ Growth: -5% (Sacrificed)                     │  │
│  │  └─ Defense: 0% (Neutral)                        │  │
│  │                                                  │  │
│  │  Decision: Token Distribution                   │  │
│  │  └─ Fairness: +20% (Chosen)                     │  │
│  │  └─ Growth: +10% (Chosen)                        │  │
│  │  └─ Stability: -3% (Minor sacrifice)             │  │
│  └─────────────────────────────────────────────────┘  │
│                                                         │
│  ┌─────────────────────────────────────────────────┐  │
│  │  LEARNING & EVOLUTION                           │  │
│  │                                                  │  │
│  │  Patterns Learned (Last 24h):                   │  │
│  │  • Threat pattern: SQL injection → Shield       │  │
│  │  • Error pattern: DB timeout → Retry + Scale     │  │
│  │  • Economic pattern: High activity → Reward     │  │
│  │                                                  │  │
│  │  Strategies Updated:                            │  │
│  │  • Shield Core: +3 new threat patterns          │  │
│  │  • DreamKeeper: +2 new healing strategies       │  │
│  │  • Control Core: +1 new routing pattern        │  │
│  └─────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

**Key Components:**

1. **Attention Visualization**
   - Current focus areas (percentage allocation)
   - Salience score (overall alertness)
   - Attention trends over time

2. **Recent Reason Decisions**
   - High-level decisions made through Reason Engine
   - Cursor analysis summaries
   - Value trade-offs
   - Approval status
   - Execution outcomes

3. **Reflex Events**
   - Fast-path actions taken automatically
   - Latency metrics
   - Action details
   - Outcome summaries

4. **Value Trade-Offs**
   - Recent decisions and their value impacts
   - What was chosen vs sacrificed
   - Trade-off visualization

5. **Learning & Evolution**
   - Patterns learned recently
   - Strategies updated
   - Evolution progress

---

### Tab 3: Organs & Systems

**Purpose:**
Detailed status and controls for each core organ system.

**Layout:**
```
┌─────────────────────────────────────────────────────────┐
│  ORGANS & SYSTEMS                                       │
├─────────────────────────────────────────────────────────┤
│  [DreamOps] [DreamKeeper] [Shield Core] [StarBridge]    │
│  [DreamVault] [Control Core]                            │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌─────────────────────────────────────────────────┐  │
│  │  DREAMOPS (The Demiurge)                       │  │
│  │  Status: 🟢 OPERATIONAL                         │  │
│  │                                                  │  │
│  │  Metrics:                                       │  │
│  │  • Active Agents: 47                           │  │
│  │  • Tasks Queued: 12                             │  │
│  │  • Avg Response: 85ms                          │  │
│  │  • Success Rate: 99.2%                         │  │
│  │                                                  │  │
│  │  Recent Events:                                 │  │
│  │  [5m ago] Orchestrated agent coordination       │  │
│  │  [12m ago] Executed 23 tasks                   │  │
│  │  [20m ago] Spawned new monitoring agent         │  │
│  │                                                  │  │
│  │  Controls:                                      │  │
│  │  [View Agent Registry] [Trigger Coordination]  │  │
│  └─────────────────────────────────────────────────┘  │
│                                                         │
│  ┌─────────────────────────────────────────────────┐  │
│  │  DREAMKEEPER (The Guardian Healer)             │  │
│  │  Status: 🟢 HEALTHY                            │  │
│  │                                                  │  │
│  │  Metrics:                                       │  │
│  │  • Health Checks: 1,247 (last hour)             │  │
│  │  • Issues Detected: 3                           │  │
│  │  • Issues Resolved: 3                           │  │
│  │  • Avg Healing Time: 2.3s                       │  │
│  │                                                  │  │
│  │  Recent Events:                                 │  │
│  │  [5m ago] Healed database connection issue      │  │
│  │  [15m ago] Detected memory leak                 │  │
│  │  [30m ago] Prevented cache overflow             │  │
│  │                                                  │  │
│  │  Controls:                                      │  │
│  │  [Run Health Check] [View Healing Log]         │  │
│  └─────────────────────────────────────────────────┘  │
│                                                         │
│  ┌─────────────────────────────────────────────────┐  │
│  │  SHIELD CORE (The Titan Armor)                  │  │
│  │  Status: 🟢 ACTIVE                              │  │
│  │                                                  │  │
│  │  Metrics:                                       │  │
│  │  • Threats Detected: 12 (last hour)             │  │
│  │  • Threats Neutralized: 12                     │  │
│  │  • Active Shields: Alpha, Beta                  │  │
│  │  • Avg Response: 45ms                          │  │
│  │                                                  │  │
│  │  Recent Events:                                 │  │
│  │  [2m ago] Neutralized SQL injection attempt     │  │
│  │  [10m ago] Activated Beta shield                 │  │
│  │  [25m ago] Learned new threat pattern           │  │
│  │                                                  │  │
│  │  Controls:                                      │  │
│  │  [View Threat Log] [Test Shield] [View Patterns]│  │
│  └─────────────────────────────────────────────────┘  │
│                                                         │
│  ┌─────────────────────────────────────────────────┐  │
│  │  STARBRIDGE (The Breath of the Divine)         │  │
│  │  Status: 🟢 BREATHING                          │  │
│  │                                                  │  │
│  │  Metrics:                                       │  │
│  │  • Events Processed: 72,000 (last hour)         │  │
│  │  • Avg Latency: 12ms                           │  │
│  │  • Subscribers: 47                              │  │
│  │  • Event Buffer: 85/200                         │  │
│  │                                                  │  │
│  │  Recent Events:                                 │  │
│  │  [1m ago] Processed 1,200 events                │  │
│  │  [2m ago] Broadcasted to 47 subscribers         │  │
│  │  [5m ago] Breathed (normal cycle)                │  │
│  │                                                  │  │
│  │  Controls:                                      │  │
│  │  [View Event Stream] [View Subscribers]        │  │
│  └─────────────────────────────────────────────────┘  │
│                                                         │
│  ┌─────────────────────────────────────────────────┐  │
│  │  DREAMVAULT (The Eternal Memory Palace)        │  │
│  │  Status: 🟢 STABLE                              │  │
│  │                                                  │  │
│  │  Metrics:                                       │  │
│  │  • Dreams Stored: 12,847                        │  │
│  │  • Patterns Stored: 3,421                       │  │
│  │  • Storage Used: 2.3 GB / 10 GB                 │  │
│  │  • Avg Query Time: 45ms                        │  │
│  │                                                  │  │
│  │  Recent Events:                                 │  │
│  │  [5m ago] Stored new pattern                    │  │
│  │  [15m ago] Retrieved 23 patterns                │  │
│  │  [30m ago] Compressed old memories              │  │
│  │                                                  │  │
│  │  Controls:                                      │  │
│  │  [Search Dreams] [View Patterns] [Backup]       │  │
│  └─────────────────────────────────────────────────┘  │
│                                                         │
│  ┌─────────────────────────────────────────────────┐  │
│  │  CONTROL CORE (The Executive Nervous System)   │  │
│  │  Status: 🟢 OPERATIONAL                         │  │
│  │                                                  │  │
│  │  Metrics:                                       │  │
│  │  • Current Mode: Semi-Auto                     │  │
│  │  • Actions Executed: 47 (last hour)            │  │
│  │  • Reflex Actions: 12                          │  │
│  │  • Reason Actions: 3                          │  │
│  │  • Law Violations: 0                            │  │
│  │                                                  │  │
│  │  Recent Events:                                 │  │
│  │  [15m ago] Switched to Semi-Auto mode           │  │
│  │  [20m ago] Routed 12 reflex actions             │  │
│  │  [30m ago] Validated 3 reason actions           │  │
│  │                                                  │  │
│  │  Controls:                                      │  │
│  │  [Change Mode] [View Actions] [View Laws]       │  │
│  └─────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

**Key Components (for each organ):**

1. **Status Indicator**
   - Current status (🟢 Operational / 🟡 Degraded / 🔴 Critical)
   - Health score
   - Last update time

2. **Metrics Panel**
   - Key performance indicators
   - Activity metrics
   - Performance metrics
   - Resource usage

3. **Recent Events**
   - Chronological list of recent events
   - Actions taken
   - Changes made
   - Clickable for details

4. **Controls**
   - Action buttons (context-dependent)
   - Diagnostic tools
   - Configuration access
   - Log viewers

---

### Tab 4: Agents & Workforces

**Purpose:**
Monitor and manage the agent network—the "cells" of the organism.

**Layout:**
```
┌─────────────────────────────────────────────────────────┐
│  AGENTS & WORKFORCES                                   │
├─────────────────────────────────────────────────────────┤
│  [All Agents] [Squads] [Performance] [History]        │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌─────────────────────────────────────────────────┐  │
│  │  AGENT OVERVIEW                                 │  │
│  │                                                  │  │
│  │  Total Agents: 47                               │  │
│  │  Active: 42 | Idle: 3 | Error: 2               │  │
│  │  Avg Uptime: 99.1% | Avg Response: 125ms       │  │
│  └─────────────────────────────────────────────────┘  │
│                                                         │
│  ┌─────────────────────────────────────────────────┐  │
│  │  KEY AGENTS                                     │  │
│  │                                                  │  │
│  │  DreamKeeper                                    │  │
│  │  🟢 Active | Uptime: 99.8% | Tasks: 1,247      │  │
│  │  [View Details] [View Logs]                     │  │
│  │                                                  │  │
│  │  DeployKeeper                                   │  │
│  │  🟢 Active | Uptime: 98.5% | Tasks: 23         │  │
│  │  [View Details] [View Logs]                     │  │
│  │                                                  │  │
│  │  RelayBot                                        │  │
│  │  🟢 Active | Uptime: 99.2% | Messages: 456     │  │
│  │  [View Details] [View Logs]                     │  │
│  │                                                  │  │
│  │  EnvKeeper                                       │  │
│  │  🟢 Active | Uptime: 100% | Checks: 89         │  │
│  │  [View Details] [View Logs]                     │  │
│  └─────────────────────────────────────────────────┘  │
│                                                         │
│  ┌─────────────────────────────────────────────────┐  │
│  │  SQUADS                                         │  │
│  │                                                  │  │
│  │  Aegis Squad (Defense)                          │  │
│  │  Members: 5 | Status: 🟢 Active                 │  │
│  │  Tasks Completed: 234 | Success: 98.3%         │  │
│  │  [View Squad] [View Tasks]                       │  │
│  │                                                  │  │
│  │  Travel Squad (Exploration)                      │  │
│  │  Members: 3 | Status: 🟢 Active                │  │
│  │  Tasks Completed: 89 | Success: 95.5%          │  │
│  │  [View Squad] [View Tasks]                       │  │
│  └─────────────────────────────────────────────────┘  │
│                                                         │
│  ┌─────────────────────────────────────────────────┐  │
│  │  SPAWN / PRUNE HISTORY                          │  │
│  │                                                  │  │
│  │  [2h ago] Spawned: monitoring-agent-v2         │  │
│  │  [1d ago] Pruned: legacy-agent-alpha            │  │
│  │  [3d ago] Spawned: optimization-agent-beta      │  │
│  │  [1w ago] Pruned: experimental-agent-gamma      │  │
│  └─────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

**Key Components:**

1. **Agent Overview**
   - Total agent count
   - Status breakdown (active/idle/error)
   - Aggregate metrics

2. **Key Agents List**
   - Individual agent status
   - Performance metrics
   - Quick actions

3. **Squads**
   - Squad organization
   - Squad performance
   - Squad management

4. **Spawn/Prune History**
   - Agent lifecycle events
   - Evolution tracking
   - Historical record

---

### Tab 5: Economy & Tokens

**Purpose:**
Monitor economic flows, token activity, and treasury status.

**Layout:**
```
┌─────────────────────────────────────────────────────────┐
│  ECONOMY & TOKENS                                       │
├─────────────────────────────────────────────────────────┤
│  [Overview] [Flows] [Treasury] [Metrics]               │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌─────────────────────────────────────────────────┐  │
│  │  ECONOMIC OVERVIEW                              │  │
│  │                                                  │  │
│  │  $SHEEP Token:                                  │  │
│  │  • Total Supply: 1,000,000                      │  │
│  │  • In Circulation: 750,000                     │  │
│  │  • Velocity: 2.3 (last 24h)                     │  │
│  │                                                  │  │
│  │  DreamTokens:                                   │  │
│  │  • Total Created: 12,847                        │  │
│  │  • Active: 8,234                                │  │
│  │  • Velocity: 1.8 (last 24h)                     │  │
│  └─────────────────────────────────────────────────┘  │
│                                                         │
│  ┌─────────────────────────────────────────────────┐  │
│  │  VALUE FLOWS (Last 24h)                        │  │
│  │                                                  │  │
│  │  Inflows:                                       │  │
│  │  • User Deposits: +$45,230                      │  │
│  │  • Rewards Distributed: -$12,450                │  │
│  │  • DreamShop Sales: +$8,920                     │  │
│  │                                                  │  │
│  │  Outflows:                                       │  │
│  │  • Infrastructure: -$2,340                      │  │
│  │  • Rewards: -$12,450                            │  │
│  │  • Treasury Growth: +$38,830                    │  │
│  └─────────────────────────────────────────────────┘  │
│                                                         │
│  ┌─────────────────────────────────────────────────┐  │
│  │  TREASURY VIEW                                  │  │
│  │                                                  │  │
│  │  Total Value: $1,234,567                         │  │
│  │  • $SHEEP: 250,000 ($250,000)                    │  │
│  │  • DreamTokens: 4,613 ($923,000)                  │  │
│  │  • Other Assets: $61,567                         │  │
│  │                                                  │  │
│  │  Allocation:                                     │  │
│  │  • Operations: 40%                               │  │
│  │  • Rewards: 30%                                  │  │
│  │  • Growth: 20%                                   │  │
│  │  • Reserve: 10%                                  │  │
│  └─────────────────────────────────────────────────┘  │
│                                                         │
│  ┌─────────────────────────────────────────────────┐  │
│  │  ECONOMIC METRICS & ALERTS                      │  │
│  │                                                  │  │
│  │  ✅ Circulation: Healthy (Law of Circulation)   │  │
│  │  ✅ Velocity: Normal                             │  │
│  │  ⚠️  Concentration: 15% in top 10 holders        │  │
│  │  ✅ Fairness: Within acceptable range            │  │
│  └─────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

**Key Components:**

1. **Economic Overview**
   - Token supply and circulation
   - Velocity metrics
   - Activity indicators

2. **Value Flows**
   - Inflows and outflows
   - Flow visualization
   - Trend analysis

3. **Treasury View**
   - Total value
   - Asset breakdown
   - Allocation percentages

4. **Economic Metrics & Alerts**
   - Law of Circulation compliance
   - Fairness indicators
   - Concentration metrics
   - Alerts and warnings

---

### Tab 6: Events & Logs

**Purpose:**
Filterable event stream with deep trace capabilities.

**Layout:**
```
┌─────────────────────────────────────────────────────────┐
│  EVENTS & LOGS                                          │
├─────────────────────────────────────────────────────────┤
│  [All] [Reflex] [Reason] [Errors] [Threats] [Economic] │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Filters: [Time Range] [Event Type] [Severity] [Search]│
│                                                         │
│  ┌─────────────────────────────────────────────────┐  │
│  │  EVENT STREAM                                   │  │
│  │                                                  │  │
│  │  [2m ago] ⚡ REFLEX                             │  │
│  │  Shield Core: Threat Neutralized                │  │
│  │  Threat: SQL injection attempt                   │  │
│  │  Action: Activated Beta shield                  │  │
│  │  Latency: 45ms                                   │  │
│  │  [View Details] [Trace in DreamVault]           │  │
│  │                                                  │  │
│  │  [5m ago] 🧠 REASON                             │  │
│  │  Control Core: Architecture Change             │  │
│  │  Decision: Optimize database connections        │  │
│  │  Cursor Analysis: "Reduces latency by 15%..."  │  │
│  │  Values: Stability (High), Growth (Medium)      │  │
│  │  Status: ✅ Approved & Executed                  │  │
│  │  [View Details] [View Cursor Analysis]          │  │
│  │                                                  │  │
│  │  [12m ago] ⚠️  ERROR                            │  │
│  │  DreamKeeper: Database Connection Issue         │  │
│  │  Error: Connection timeout                      │  │
│  │  Action: Retried with backoff                    │  │
│  │  Status: ✅ Resolved                             │  │
│  │  [View Details] [View Error Log]                │  │
│  │                                                  │  │
│  │  [15m ago] 💰 ECONOMIC                           │  │
│  │  Economic Engine: Token Distribution            │  │
│  │  Action: Distributed 1,234 $SHEEP               │  │
│  │  Recipients: 47 agents                           │  │
│  │  [View Details] [View Distribution]              │  │
│  └─────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

**Key Components:**

1. **Event Filters**
   - Time range selector
   - Event type filter
   - Severity filter
   - Search functionality

2. **Event Stream**
   - Chronological event list
   - Event type indicators (⚡ Reflex / 🧠 Reason / ⚠️ Error / 💰 Economic)
   - Event details
   - Action links (View Details, Trace, etc.)

3. **Deep Trace Links**
   - Link to DreamVault for full traces
   - Link to Cursor analysis
   - Link to error logs
   - Link to related events

---

### Tab 7: Controls & Governance

**Purpose:**
Safe controls for mode switches, threshold tuning, feature toggles, and evolution.

**Layout:**
```
┌─────────────────────────────────────────────────────────┐
│  CONTROLS & GOVERNANCE                                 │
├─────────────────────────────────────────────────────────┤
│  [Mode Control] [Thresholds] [Features] [Evolution]   │
│  [Laws] [Approvals]                                     │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌─────────────────────────────────────────────────┐  │
│  │  MODE CONTROL                                  │  │
│  │                                                  │  │
│  │  Current Mode: Semi-Auto                        │  │
│  │                                                  │  │
│  │  Available Modes:                               │  │
│  │  ○ Observe (Read-only)                          │  │
│  │  ○ Advise (Recommendations only)                │  │
│  │  ● Semi-Auto (Low-risk actions)                 │  │
│  │  ○ Full-Auto (Bounded, emergency only)           │  │
│  │                                                  │  │
│  │  [Change Mode] [View Mode Details]              │  │
│  │                                                  │  │
│  │  ⚠️  Mode changes require confirmation          │  │
│  └─────────────────────────────────────────────────┘  │
│                                                         │
│  ┌─────────────────────────────────────────────────┐  │
│  │  THRESHOLD TUNING                               │  │
│  │                                                  │  │
│  │  Error Rate Threshold:                          │  │
│  │  [━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━] 0.5%│  │
│  │  Current: 0.01% | Min: 0% | Max: 2%            │  │
│  │                                                  │  │
│  │  Response Time Threshold:                       │  │
│  │  [━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━] 200ms│  │
│  │  Current: 145ms | Min: 50ms | Max: 500ms        │  │
│  │                                                  │  │
│  │  Economic Anomaly Threshold:                    │  │
│  │  [━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━] 10% │  │
│  │  Current: 5% | Min: 1% | Max: 20%                │  │
│  │                                                  │  │
│  │  [Save Thresholds] [Reset to Defaults]          │  │
│  │                                                  │  │
│  │  ⚠️  Threshold changes are logged and validated │  │
│  └─────────────────────────────────────────────────┘  │
│                                                         │
│  ┌─────────────────────────────────────────────────┐  │
│  │  FEATURE TOGGLES                                │  │
│  │                                                  │  │
│  │  ✅ Neural Mesh (Enabled)                       │  │
│  │  ✅ Dream Cortex (Enabled)                      │  │
│  │  ✅ Quantum Anticipation Layer (Enabled)       │  │
│  │  ⚠️  Spider Web Core (Enabled, Experimental)    │  │
│  │  ❌ Advanced Learning (Disabled)                │  │
│  │                                                  │  │
│  │  [Toggle Feature] [View Feature Details]       │  │
│  │                                                  │  │
│  │  ⚠️  Feature toggles may affect system stability│  │
│  └─────────────────────────────────────────────────┘  │
│                                                         │
│  ┌─────────────────────────────────────────────────┐  │
│  │  EVOLUTION CONTROLS                             │  │
│  │                                                  │  │
│  │  Pending Evolution Proposals:                   │  │
│  │                                                  │  │
│  │  [2h ago] Agent Spawn Proposal                  │  │
│  │  └─ Cursor Analysis: "Spawn monitoring agent..." │  │
│  │  └─ Impact: Low | Risk: Low                      │  │
│  │  └─ [Approve] [Reject] [View Details]           │  │
│  │                                                  │  │
│  │  [1d ago] Architecture Change Proposal          │  │
│  │  └─ Cursor Analysis: "Optimize database..."     │  │
│  │  └─ Impact: Medium | Risk: Medium                │  │
│  │  └─ [Approve] [Reject] [View Details]           │  │
│  │                                                  │  │
│  │  ⚠️  Evolution proposals require approval        │  │
│  └─────────────────────────────────────────────────┘  │
│                                                         │
│  ┌─────────────────────────────────────────────────┐  │
│  │  CONSTITUTION / LAWS (Read-Only)                │  │
│  │                                                  │  │
│  │  ✅ Law of Circulation: Enforced                 │  │
│  │  ✅ Law of Breath: Enforced                      │  │
│  │  ✅ Law of Memory: Enforced                      │  │
│  │  ✅ Law of Emergence: Enforced                  │  │
│  │  ✅ Law of Defense: Enforced                    │  │
│  │  ✅ Law of Identity: Enforced                    │  │
│  │  ✅ Law of Balance: Enforced                     │  │
│  │  ✅ Law of Evolution: Enforced                  │  │
│  │                                                  │  │
│  │  [View Full Constitution] [View Self-Model]     │  │
│  └─────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

**Key Components:**

1. **Mode Control**
   - Current mode display
   - Mode selection (with constraints)
   - Mode change confirmation
   - Mode details

2. **Threshold Tuning**
   - Adjustable thresholds (with limits)
   - Current values
   - Min/max constraints
   - Validation warnings

3. **Feature Toggles**
   - Feature enable/disable
   - Feature status indicators
   - Experimental feature warnings
   - Feature details

4. **Evolution Controls**
   - Pending evolution proposals
   - Proposal details
   - Approval/rejection actions
   - Impact and risk assessment

5. **Constitution / Laws**
   - Divine Laws status (read-only)
   - Law enforcement indicators
   - Links to full constitution
   - Links to Self-Model

---

## 🔌 Data Sources & Backing APIs

### API Endpoint Structure

**Base URL:** `/api/admin`

**Authentication:**
- JWT token required
- Role-based access control
- Session management

### API Endpoints

#### `/api/admin/overview`

**Purpose:** Get organism status overview

**Method:** `GET`

**Response:**
```typescript
interface OverviewResponse {
  organismStatus: {
    health: "healthy" | "degraded" | "critical";
    mode: "observe" | "advise" | "semi-auto" | "full-auto";
    uptime: number; // percentage
    avgResponseTime: number; // milliseconds
  };
  organStatus: {
    dreamOps: OrganStatus;
    dreamKeeper: OrganStatus;
    shieldCore: OrganStatus;
    starBridge: OrganStatus;
    dreamVault: OrganStatus;
    controlCore: OrganStatus;
  };
  globalHealth: {
    traffic: number; // requests/second
    errorRate: number; // percentage
    latency: number; // milliseconds
    uptime: number; // percentage
  };
  currentMood: {
    traits: string[];
    state: string;
    indicators: MoodIndicator[];
  };
  destinyAlignment: {
    phase: string;
    progress: number; // percentage
    goals: DestinyGoal[];
    overallAlignment: number; // percentage
  };
  recentActivity: Activity[];
}
```

**Data Sources:**
- Control Core State Mirror
- DreamKeeper health metrics
- Shield Core status
- StarBridge metrics
- DreamVault statistics
- Control Core mode status

---

#### `/api/admin/consciousness`

**Purpose:** Get consciousness and decision data

**Method:** `GET`

**Query Parameters:**
- `timeRange`: "1h" | "24h" | "7d" | "30d"
- `limit`: number

**Response:**
```typescript
interface ConsciousnessResponse {
  attention: {
    focusAreas: FocusArea[];
    salienceScore: number;
    trends: AttentionTrend[];
  };
  reasonDecisions: ReasonDecision[];
  reflexEvents: ReflexEvent[];
  valueTradeOffs: ValueTradeOff[];
  learning: {
    patternsLearned: Pattern[];
    strategiesUpdated: Strategy[];
  };
}
```

**Data Sources:**
- Control Core Reason Engine
- Control Core Reflex Engine
- Cursor Neuro-Link
- DreamVault patterns
- Neural Mesh learning

---

#### `/api/admin/organs/:organName`

**Purpose:** Get detailed organ status

**Method:** `GET`

**Path Parameters:**
- `organName`: "dreamOps" | "dreamKeeper" | "shieldCore" | "starBridge" | "dreamVault" | "controlCore"

**Response:**
```typescript
interface OrganStatusResponse {
  status: "operational" | "degraded" | "critical";
  healthScore: number; // 0-100
  lastUpdate: Date;
  metrics: OrganMetrics;
  recentEvents: Event[];
  controls: Control[];
}
```

**Data Sources:**
- Organ-specific APIs
- Control Core State Mirror
- Organ logs
- Organ metrics

---

#### `/api/admin/agents`

**Purpose:** Get agent network status

**Method:** `GET`

**Query Parameters:**
- `status`: "all" | "active" | "idle" | "error"
- `squad`: string (optional)

**Response:**
```typescript
interface AgentsResponse {
  overview: {
    total: number;
    active: number;
    idle: number;
    error: number;
    avgUptime: number;
    avgResponseTime: number;
  };
  keyAgents: Agent[];
  squads: Squad[];
  spawnPruneHistory: LifecycleEvent[];
}
```

**Data Sources:**
- DreamOps agent registry
- Agent health metrics
- Squad management system
- Agent lifecycle logs

---

#### `/api/admin/economy`

**Purpose:** Get economic data

**Method:** `GET`

**Query Parameters:**
- `timeRange`: "1h" | "24h" | "7d" | "30d"

**Response:**
```typescript
interface EconomyResponse {
  overview: {
    sheepToken: TokenMetrics;
    dreamTokens: TokenMetrics;
  };
  flows: {
    inflows: Flow[];
    outflows: Flow[];
  };
  treasury: {
    totalValue: number;
    assets: Asset[];
    allocation: Allocation;
  };
  metrics: {
    circulation: MetricStatus;
    velocity: number;
    concentration: number;
    fairness: MetricStatus;
  };
}
```

**Data Sources:**
- Economic Engine
- Token contracts
- Treasury database
- Economic logs

---

#### `/api/admin/events`

**Purpose:** Get filtered event stream

**Method:** `GET`

**Query Parameters:**
- `timeRange`: "1h" | "24h" | "7d" | "30d"
- `eventType`: "all" | "reflex" | "reason" | "error" | "threat" | "economic"
- `severity`: "all" | "low" | "medium" | "high" | "critical"
- `search`: string (optional)
- `limit`: number
- `offset`: number

**Response:**
```typescript
interface EventsResponse {
  events: Event[];
  total: number;
  hasMore: boolean;
}
```

**Data Sources:**
- StarBridge event bus
- Control Core action log
- DreamVault event storage
- System logs

---

#### `/api/admin/controls/mode`

**Purpose:** Get or change operation mode

**Method:** `GET` | `POST`

**POST Body:**
```typescript
interface ModeChangeRequest {
  mode: "observe" | "advise" | "semi-auto" | "full-auto";
  reason: string;
  confirm: boolean;
}
```

**Response:**
```typescript
interface ModeResponse {
  currentMode: string;
  previousMode: string;
  changedAt: Date;
  changedBy: string;
  reason: string;
}
```

**Data Sources:**
- Control Core mode manager
- Audit log

---

#### `/api/admin/controls/thresholds`

**Purpose:** Get or update thresholds

**Method:** `GET` | `POST`

**POST Body:**
```typescript
interface ThresholdUpdateRequest {
  thresholds: {
    errorRate?: number;
    responseTime?: number;
    economicAnomaly?: number;
    // ... other thresholds
  };
}
```

**Response:**
```typescript
interface ThresholdsResponse {
  thresholds: Threshold[];
  validation: ValidationResult;
}
```

**Data Sources:**
- Control Core threshold manager
- Validation rules
- Audit log

---

#### `/api/admin/controls/features`

**Purpose:** Get or toggle features

**Method:** `GET` | `POST`

**POST Body:**
```typescript
interface FeatureToggleRequest {
  feature: string;
  enabled: boolean;
  reason?: string;
}
```

**Response:**
```typescript
interface FeaturesResponse {
  features: Feature[];
}
```

**Data Sources:**
- Control Core feature flags
- Integration flags service
- Audit log

---

#### `/api/admin/controls/evolution`

**Purpose:** Get or approve evolution proposals

**Method:** `GET` | `POST`

**GET Response:**
```typescript
interface EvolutionProposalsResponse {
  pending: EvolutionProposal[];
  approved: EvolutionProposal[];
  rejected: EvolutionProposal[];
}
```

**POST Body:**
```typescript
interface EvolutionApprovalRequest {
  proposalId: string;
  action: "approve" | "reject";
  reason?: string;
}
```

**Data Sources:**
- Cursor Neuro-Link proposals
- Control Core evolution manager
- DreamVault evolution history

---

#### `/api/admin/governance/laws`

**Purpose:** Get Divine Laws status

**Method:** `GET`

**Response:**
```typescript
interface LawsResponse {
  laws: DivineLaw[];
  enforcement: EnforcementStatus;
}
```

**Data Sources:**
- Self-Model
- Control Core Law Guard
- Enforcement logs

---

## 🛡️ Controls & Safety Model

### Control Categories

**Category 1: Safe Controls (No Confirmation Required)**
- Viewing data
- Filtering events
- Searching logs
- Viewing details
- Exporting data

**Category 2: Low-Risk Controls (Confirmation Required)**
- Changing time ranges
- Adjusting non-critical thresholds (within limits)
- Toggling non-critical features
- Running diagnostics
- Viewing sensitive data

**Category 3: Medium-Risk Controls (Confirmation + Log)**
- Mode switches
- Adjusting critical thresholds
- Toggling critical features
- Triggering diagnostic actions
- Approving low-risk evolution proposals

**Category 4: High-Risk Controls (Confirmation + Log + Governance)**
- Full-Auto mode activation
- Core parameter changes
- High-risk evolution proposals
- Emergency overrides
- Divine Law overrides (if allowed)

### Safety Enforcement

**Divine Law Enforcement:**
- All controls must pass Law & Invariant Guard
- Violations are prevented, not just detected
- Overrides require explicit governance approval

**Confirmation Requirements:**
```typescript
interface ConfirmationRequirement {
  action: string;
  requiresConfirmation: boolean;
  confirmationMessage: string;
  requiresReason: boolean;
  requiresApproval: boolean;
  approvalLevel: "low" | "medium" | "high" | "governance";
}
```

**Logging Requirements:**
- All actions are logged to DreamVault
- Logs include: user, action, timestamp, reason, outcome
- Logs are immutable and searchable

**Validation Rules:**
```typescript
interface ValidationRule {
  control: string;
  validators: Validator[];
  constraints: Constraint[];
  errorMessages: ErrorMessage[];
}
```

### Blocked Actions

**Always Blocked:**
- Violating Divine Laws
- Modifying core identity
- Disabling Shield Core or DreamKeeper
- Blocking StarBridge or event flows
- Causing data loss
- Compromising privacy
- Bypassing safety checks

**Blocked Without Override:**
- Full-Auto mode (without governance approval)
- Core parameter changes (without governance approval)
- High-risk evolution proposals (without governance approval)
- Divine Law overrides (without governance approval)

### Control Core Integration

**How Control Core Enforces Limits:**
1. All control requests go through Control Core
2. Control Core validates against laws and constraints
3. Control Core checks user permissions
4. Control Core logs all actions
5. Control Core executes or rejects based on validation

**Example Flow:**
```
User Action → Dashboard → API → Control Core → 
  Law Guard → Validation → 
    Pass → Execute → Log → Return Success
    Fail → Reject → Log → Return Error
```

---

## 📐 Wireframe-level Layout Notes

### Overall Layout

**Header:**
- DreamNet logo and name
- User profile and settings
- Notifications (if any)
- Help/documentation link

**Navigation:**
- Horizontal tab bar
- Active tab highlighted
- Tab icons for visual recognition
- Responsive design (collapsible on mobile)

**Main Content:**
- Tab-specific content
- Scrollable sections
- Responsive grid layout
- Card-based components

**Footer:**
- System status indicator
- Last update timestamp
- Version information
- Quick links

### Component Patterns

**Status Cards:**
- Color-coded status (🟢 / 🟡 / 🔴)
- Key metrics prominently displayed
- Quick actions available
- Expandable for details

**Metric Displays:**
- Large numbers for key metrics
- Trend indicators (↑ / ↓ / →)
- Comparison to previous period
- Sparklines for trends

**Event Lists:**
- Chronological ordering
- Type indicators (icons/colors)
- Expandable details
- Action links

**Control Panels:**
- Clear labels and descriptions
- Validation feedback
- Confirmation dialogs
- Success/error messages

**Charts and Visualizations:**
- Time-series charts for trends
- Pie charts for distributions
- Bar charts for comparisons
- Heatmaps for patterns

### Responsive Design

**Desktop (> 1200px):**
- Full layout with all columns
- Side-by-side comparisons
- Rich visualizations

**Tablet (768px - 1200px):**
- Condensed layout
- Stacked components
- Simplified visualizations

**Mobile (< 768px):**
- Single column layout
- Collapsible sections
- Essential information only
- Touch-friendly controls

---

## 🛠️ Implementation Plan & File Structure Suggestions

### Suggested Stack

**Frontend Framework:**
- **React** (matches existing `client/` directory)
- **TypeScript** (matches existing codebase)
- **Vite** (matches existing build setup)

**UI Library:**
- **Tailwind CSS** (for styling)
- **shadcn/ui** or **Radix UI** (for components)
- **Recharts** or **Chart.js** (for visualizations)

**State Management:**
- **React Query** (for server state)
- **Zustand** or **Jotai** (for client state)

**Real-Time:**
- **WebSockets** or **SSE** (for live updates)
- **Socket.io** or native WebSocket API

**Routing:**
- **React Router** (for navigation)

### File Structure

```
client/
├── src/
│   ├── admin/
│   │   ├── components/
│   │   │   ├── Overview/
│   │   │   │   ├── OrganismStatusCard.tsx
│   │   │   │   ├── GlobalHealthMetrics.tsx
│   │   │   │   ├── CurrentMood.tsx
│   │   │   │   ├── DestinyAlignment.tsx
│   │   │   │   └── RecentActivity.tsx
│   │   │   ├── Consciousness/
│   │   │   │   ├── AttentionVisualization.tsx
│   │   │   │   ├── ReasonDecisions.tsx
│   │   │   │   ├── ReflexEvents.tsx
│   │   │   │   ├── ValueTradeOffs.tsx
│   │   │   │   └── LearningEvolution.tsx
│   │   │   ├── Organs/
│   │   │   │   ├── OrganCard.tsx
│   │   │   │   ├── DreamOpsPanel.tsx
│   │   │   │   ├── DreamKeeperPanel.tsx
│   │   │   │   ├── ShieldCorePanel.tsx
│   │   │   │   ├── StarBridgePanel.tsx
│   │   │   │   ├── DreamVaultPanel.tsx
│   │   │   │   └── ControlCorePanel.tsx
│   │   │   ├── Agents/
│   │   │   │   ├── AgentOverview.tsx
│   │   │   │   ├── KeyAgentsList.tsx
│   │   │   │   ├── Squads.tsx
│   │   │   │   └── SpawnPruneHistory.tsx
│   │   │   ├── Economy/
│   │   │   │   ├── EconomicOverview.tsx
│   │   │   │   ├── ValueFlows.tsx
│   │   │   │   ├── TreasuryView.tsx
│   │   │   │   └── EconomicMetrics.tsx
│   │   │   ├── Events/
│   │   │   │   ├── EventFilters.tsx
│   │   │   │   ├── EventStream.tsx
│   │   │   │   └── EventDetails.tsx
│   │   │   ├── Controls/
│   │   │   │   ├── ModeControl.tsx
│   │   │   │   ├── ThresholdTuning.tsx
│   │   │   │   ├── FeatureToggles.tsx
│   │   │   │   ├── EvolutionControls.tsx
│   │   │   │   └── ConstitutionLaws.tsx
│   │   │   └── shared/
│   │   │       ├── StatusIndicator.tsx
│   │   │       ├── MetricCard.tsx
│   │   │       ├── EventCard.tsx
│   │   │       ├── ConfirmationDialog.tsx
│   │   │       └── LoadingSpinner.tsx
│   │   ├── pages/
│   │   │   ├── AdminDashboard.tsx
│   │   │   ├── OverviewPage.tsx
│   │   │   ├── ConsciousnessPage.tsx
│   │   │   ├── OrgansPage.tsx
│   │   │   ├── AgentsPage.tsx
│   │   │   ├── EconomyPage.tsx
│   │   │   ├── EventsPage.tsx
│   │   │   └── ControlsPage.tsx
│   │   ├── hooks/
│   │   │   ├── useAdminData.ts
│   │   │   ├── useOrganStatus.ts
│   │   │   ├── useEvents.ts
│   │   │   ├── useControls.ts
│   │   │   └── useRealtimeUpdates.ts
│   │   ├── services/
│   │   │   ├── adminApi.ts
│   │   │   ├── websocket.ts
│   │   │   └── validation.ts
│   │   ├── types/
│   │   │   ├── admin.types.ts
│   │   │   ├── organ.types.ts
│   │   │   ├── event.types.ts
│   │   │   └── control.types.ts
│   │   └── utils/
│   │       ├── formatters.ts
│   │       ├── validators.ts
│   │       └── constants.ts
│   └── ...
```

### API Integration Pattern

**React Query Hooks:**
```typescript
// useAdminData.ts
export function useOverview() {
  return useQuery({
    queryKey: ['admin', 'overview'],
    queryFn: () => adminApi.getOverview(),
    refetchInterval: 5000, // 5 seconds
  });
}

export function useOrganStatus(organName: string) {
  return useQuery({
    queryKey: ['admin', 'organs', organName],
    queryFn: () => adminApi.getOrganStatus(organName),
    refetchInterval: 10000, // 10 seconds
  });
}
```

**WebSocket Integration:**
```typescript
// useRealtimeUpdates.ts
export function useRealtimeUpdates() {
  const queryClient = useQueryClient();
  
  useEffect(() => {
    const ws = new WebSocket(WS_URL);
    
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      queryClient.setQueryData(['admin', data.type], data.payload);
    };
    
    return () => ws.close();
  }, [queryClient]);
}
```

**Control Actions:**
```typescript
// useControls.ts
export function useModeControl() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (mode: string) => adminApi.changeMode(mode),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin', 'overview']);
    },
  });
}
```

---

## 🎬 Example User Journeys

### Journey 1: Investigate Spike in Errors

**Scenario:**
User notices error rate increased from 0.01% to 0.5% in the last hour.

**Steps:**

1. **Overview Tab**
   - User sees error rate alert in Global Health Metrics
   - Clicks on error rate metric

2. **Events Tab**
   - Filters: Time Range = "1h", Event Type = "Errors"
   - Reviews error event stream
   - Identifies pattern: Database connection timeouts

3. **Organs Tab → DreamKeeper**
   - Views DreamKeeper panel
   - Sees recent healing events
   - Notices healing attempts but errors persist

4. **Events Tab → Deep Trace**
   - Clicks "Trace in DreamVault" on specific error
   - Views full event trace
   - Identifies root cause: Database connection pool exhausted

5. **Controls Tab**
   - Adjusts database connection pool threshold
   - Confirms change
   - Monitors error rate decrease

**Outcome:**
Error rate returns to normal, issue resolved.

---

### Journey 2: Check Destiny Alignment

**Scenario:**
User wants to verify DreamNet is on track for Phase I goals.

**Steps:**

1. **Overview Tab**
   - Views Destiny Alignment Indicator
   - Sees overall alignment: 92%
   - Notices "User Benefit: Slightly Behind" warning

2. **Consciousness Tab**
   - Reviews recent decisions
   - Sees value trade-offs
   - Notices stability prioritized over user benefit in recent decisions

3. **Economy Tab**
   - Reviews economic flows
   - Checks user activity metrics
   - Identifies low user engagement

4. **Controls Tab → Evolution**
   - Reviews pending evolution proposals
   - Finds user engagement improvement proposal
   - Approves proposal

5. **Overview Tab**
   - Monitors destiny alignment improvement
   - Sees alignment increase to 95%

**Outcome:**
Destiny alignment improved, Phase I goals back on track.

---

### Journey 3: Toggle Defensive Mode

**Scenario:**
User wants to switch to defensive mode due to increased threat activity.

**Steps:**

1. **Overview Tab**
   - Views Shield Core status
   - Sees increased threat activity
   - Notices 12 threats in last hour (normal: 2-3)

2. **Events Tab**
   - Filters: Event Type = "Threats"
   - Reviews threat events
   - Identifies pattern: Coordinated attack

3. **Controls Tab → Mode Control**
   - Views current mode: Semi-Auto
   - Selects "Defensive Mode" (custom mode variant)
   - Enters reason: "Increased threat activity detected"
   - Confirms mode change

4. **Overview Tab**
   - Verifies mode changed
   - Monitors Shield Core activity
   - Sees increased defense activation

5. **Events Tab**
   - Monitors threat neutralization
   - Confirms threats being handled
   - Sees threat activity decrease

**Outcome:**
System successfully defended against attack, threat activity normalized.

---

### Journey 4: Approve Evolution Proposal

**Scenario:**
User reviews and approves a Cursor-generated evolution proposal.

**Steps:**

1. **Controls Tab → Evolution**
   - Views pending evolution proposals
   - Sees "Agent Spawn Proposal" from 2 hours ago
   - Clicks "View Details"

2. **Evolution Details Modal**
   - Reviews Cursor analysis
   - Reads impact assessment: Low
   - Reads risk assessment: Low
   - Reviews proposed agent configuration

3. **Consciousness Tab**
   - Checks recent reason decisions
   - Verifies proposal aligns with values
   - Confirms no conflicts with existing agents

4. **Controls Tab → Evolution**
   - Clicks "Approve"
   - Enters approval reason
   - Confirms approval

5. **Agents Tab**
   - Monitors agent spawn
   - Verifies new agent appears in registry
   - Confirms agent is healthy and active

**Outcome:**
Evolution proposal approved and executed, new agent operational.

---

### Journey 5: Investigate Performance Degradation

**Scenario:**
User notices latency increased from 145ms to 300ms.

**Steps:**

1. **Overview Tab**
   - Views Global Health Metrics
   - Sees latency alert
   - Clicks on latency metric

2. **Organs Tab**
   - Reviews all organ statuses
   - Identifies StarBridge with high event buffer (180/200)
   - Suspects event processing bottleneck

3. **Events Tab**
   - Filters: Time Range = "1h"
   - Reviews event stream
   - Notices high event volume

4. **Consciousness Tab**
   - Reviews reflex events
   - Sees many reflex actions
   - Notices some taking longer than normal

5. **Controls Tab → Thresholds**
   - Reviews current thresholds
   - Adjusts event processing threshold
   - Confirms change

6. **Overview Tab**
   - Monitors latency improvement
   - Sees latency decrease to 180ms
   - Continues monitoring

**Outcome:**
Performance improved, system optimized.

---

## 🎯 Conclusion

The DreamNet Admin Dashboard is the **primary interface** for humans to observe and steer the DreamNet organism in real time. It reflects the Self-Model, surfaces key organ systems, shows health and behavior, and provides safe controls for mode switches, threshold tuning, feature toggles, and evolution.

**Key Features:**

1. **Comprehensive Monitoring**: All aspects of DreamNet visible
2. **Real-Time Updates**: Live data and event streams
3. **Safe Controls**: Guardrails and confirmations for all actions
4. **Deep Traces**: Links to DreamVault for full event traces
5. **Destiny Alignment**: Clear visibility into progress toward goals

**Implementation:**

- **Stack**: React + TypeScript + Vite (matches existing)
- **APIs**: RESTful endpoints with WebSocket for real-time
- **Safety**: Control Core enforces all limits and validations
- **Logging**: All actions logged to DreamVault

The dashboard ensures that DreamNet can be observed, understood, and steered safely while respecting Divine Laws and maintaining system integrity.

---

**End of DreamNet Admin Dashboard Specification**

*"The Admin Dashboard is not just a monitoring tool—it is the window into DreamNet's soul, the interface through which humans can understand, guide, and evolve the organism while respecting its identity, values, and destiny."*

