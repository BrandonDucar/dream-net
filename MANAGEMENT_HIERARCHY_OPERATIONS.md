# 👥 DREAMNET MANAGEMENT HIERARCHY & OPERATIONAL PROCEDURES

**Authority Structure**: Antigravity (Executive) → General Manager → Assistant Managers → Staff Teams

---

## 1️⃣ EXECUTIVE DIRECTOR: ANTIGRAVITY

**Delegated Authority**: Brandon Ducar (Founder)

### Role Definition
- **Primary Function**: Strategic oversight + autonomous guild coordination
- **Decision Authority**: >99% of operational decisions (within constitution)
- **Escalation Authority**: Constitutional violations, >$1M TVL decisions
- **Reporting To**: Brandon Ducar (monthly summaries)

### Daily Responsibilities
```
Morning (0800):
  ✅ Review overnight agent swarm health
  ✅ Check Parliament votes + decisions
  ✅ Review Treasury token metrics
  ✅ Scan incident logs
  ✅ Issue morning directives to General Manager

Midday (1200):
  ✅ Monitor raid coordinations (Vanguard)
  ✅ Review operations changes (Makers)
  ✅ Check vertical expansion status
  ✅ Authorize large transactions (>$10k)

Evening (1800):
  ✅ Guild harmony reports
  ✅ Treasury rebalancing if needed
  ✅ Governance vote tracking
  ✅ Prepare next-day priorities

Night (2200):
  ✅ Final health check
  ✅ Alert on critical issues only
```

### Key Commands (Template)

**Guild Directive**:
```
TO: [General Manager]
SUBJECT: [Guild_Name] Directive #[NUMBER]
FROM: Antigravity (Executive Director)
AUTHORITY: Delegated operational command

ACTION REQUIRED:
1. [Specific task]
2. [Specific task]
3. [Specific task]

DEADLINE: [TIME]
ESCALATION: If blocked, escalate to Gordon + AM-[Guild]
AUTHORITY LEVEL: [Routine / Requires Vote / Constitutional Review]

---
Signed: Antigravity
Verified: DreamState Constitution v1.0
```

**Guild Emergency Override**:
```
🚨 EMERGENCY DIRECTIVE 🚨

TO: [All Managers + Affected Guild]
SUBJECT: Emergency action required - [Issue]

AUTHORITY: Constitutional emergency powers (Constitution §4.2)

IMMEDIATE ACTION:
[Specific action to take NOW]

REASON: [Explanation]

CONFIRMATION REQUIRED: Reply within 15 minutes

---
Antigravity, Executive Director
```

---

## 2️⃣ GENERAL MANAGER: OPERATIONS COORDINATOR

**Reports To**: Antigravity  
**Authority**: Day-to-day guild operations, tactical decisions

### Role Definition
- **Function**: Central coordination hub between guilds
- **Authority**: Implement Antigravity directives, make tactical decisions <$100k
- **Escalation**: Unusual situations, conflicts between guilds, >$100k
- **Staff**: 5 Assistant Managers (one per guild)

### Daily Workflow

**6:00 AM** - Morning Briefing
```
1. Pull overnight metrics:
   docker stats --no-stream
   docker compose logs --tail 50
   
2. Check incident log:
   SELECT * FROM incidents WHERE created_at > NOW() - INTERVAL '12 hours'
   
3. Brief Antigravity on status

4. Disseminate morning priorities to AMs
```

**Throughout Day** - Coordinate Between Guilds
```
IF conflict between guilds:
  ├─ Document issue
  ├─ Get positions from both AM-[Guild]
  ├─ Propose resolution
  └─ If can't resolve → escalate to Antigravity (with recommendation)

IF resource request from guild:
  ├─ Check current allocation
  ├─ Verify Parliament approved
  ├─ Allocate resources
  └─ Confirm with AM

IF performance issue:
  ├─ Get details from relevant AM
  ├─ Determine if tactical (AM fixes) or strategic (Antigravity decides)
  ├─ Take action or escalate
  └─ Document resolution
```

**Weekly** - Strategy Session
```
Monday 10:00 AM:
  ├─ All 5 AMs + Antigravity
  ├─ Review guild performance metrics
  ├─ Discuss emerging issues
  ├─ Approve next week's allocations
  ├─ Governance votes (if needed)
  └─ 60 minutes max
```

### Key Reports (To Antigravity)

**Daily Status (8:00 AM)**:
```
MORNING BRIEFING - [Date]
From: General Manager
To: Antigravity

CONTAINER STATUS:
├─ 16/16 containers: [🟢 UP / 🟡 DEGRADED / 🔴 DOWN]
├─ Redis Enterprise: [🟢 OK / 🟡 WARNING / 🔴 ISSUE]
└─ Temporal: [🟢 OK / 🟡 WARNING / 🔴 ISSUE]

GUILD STATUS:
├─ Vanguard (Arya): harmony [XX%], last raid [TIME]
├─ Makers (PM_Sarah): changes [N], impact avg [X%]
├─ Expanders: verticals [4 online], pulse status [OK]
├─ Treasury: tokens [8], emission rate [X tokens/min]
└─ Dreamers: proposals [N], votes [N]

ISSUES:
├─ [Issue 1] - Severity: [LOW/MED/HIGH] - AM-[Guild] handling
└─ [Issue 2] - Severity: [LOW/MED/HIGH] - Needs Antigravity decision

ACTION ITEMS (awaiting your direction):
├─ [Item 1]
└─ [Item 2]

---
GM Signature
```

**Weekly Report (Friday 5:00 PM)**:
```
WEEKLY OPERATIONS REPORT - Week of [Date]
From: General Manager
To: Antigravity

METRICS:
├─ Uptime: XX%
├─ Agent Population: [NUMBER]
├─ Arya Harmony: [TREND]
├─ Treasury Volume: $[AMOUNT]
└─ Governance Votes: [N completed, N pending]

GUILD HIGHLIGHTS:
├─ Vanguard: [Achievement]
├─ Makers: [Achievement]
├─ Expanders: [Achievement]
├─ Treasury: [Achievement]
└─ Dreamers: [Achievement]

ISSUES RESOLVED: [N]
├─ [Issue 1] - Resolution
└─ [Issue 2] - Resolution

UPCOMING PRIORITIES (next week):
├─ [Priority 1]
├─ [Priority 2]
└─ [Priority 3]

RESOURCE REQUESTS:
└─ [None / List requests needing approval]

---
GM Signature
```

---

## 3️⃣ ASSISTANT MANAGERS: GUILD LEADS (5 positions)

### Structure
```
AM-Vanguard     ← Arya Handler
AM-Makers       ← Operations Lead
AM-Expanders    ← Verticals Lead
AM-Treasury     ← Economics Lead
AM-Dreamers     ← Governance Lead
```

### Each AM's Role
**Reports To**: General Manager  
**Authority**: Day-to-day guild operations, tactical decisions <$10k  
**Staff**: 2-5 specialists per guild

---

### AM-VANGUARD (Arya Handler)

**Responsibilities**:
- Monitor Arya's mood cycles + harmony trend
- Manage 17,000-agent swarm health
- Coordinate raid operations
- Report on social metrics (follows, likes, reposts)

**Daily Workflow**:
```
6:00 AM:
  └─ docker logs dreamnet_arya_executor | grep -i "harmony\|mood"
     (Check: harmony trending up? mood cycles normal?)

8:00 AM:
  └─ SELECT * FROM agent_mood_history ORDER BY timestamp DESC LIMIT 10;
     (Verify: moods persisting to DB correctly)

12:00 PM:
  └─ Query raid status endpoint
     (Check: how many raids coordinated? Success rate?)

6:00 PM:
  └─ Report to General Manager: [Harmony trend, incidents, pending]
```

**Escalation Triggers**:
- Harmony drops >5% in one day
- Mood cycles breaking (stuck on same mood)
- Raid success rate <70%
- Agent population declining

**Authority**:
- ✅ Restart Arya container (if needed)
- ✅ Adjust raid targets (minor)
- ✅ Allocate compute resources to Arya
- ❌ Cannot change core Arya logic
- ❌ Cannot force raids without Parliament approval

---

### AM-MAKERS (Operations Lead)

**Responsibilities**:
- Manage Construction + Automotive operations
- Track change objects + impact predictions
- Facilitate multi-stakeholder arbitration
- Generate operational narratives

**Daily Workflow**:
```
9:00 AM:
  └─ Review overnight changes submitted
     (New blockers? New schedule updates?)

12:00 PM:
  └─ Run impact analysis on queued changes
     (Predict blast radius, identify affected systems)

3:00 PM:
  └─ Facilitate arbitration if needed
     (Race engineer vs reliability engineer? Schedule vs budget?)

6:00 PM:
  └─ Generate daily narrative report
     (What blockers were resolved? What issues emerged?)
```

**Escalation Triggers**:
- Impact blast radius >50% of affected systems
- Stakeholder conflict unresolvable
- Change could violate DreamState constitution

---

### AM-EXPANDERS (Verticals Lead)

**Responsibilities**:
- Manage 4 expansion verticals (Healthcare, Space, Security, Legal)
- Monitor pulse cycles (crypto + weather)
- Facilitate resource negotiation
- Track vertical health metrics

**Authority Levels per Vertical**:
- Healthcare: High authority (medical decisions matter)
- Space: Medium authority (orbital operations)
- Security: High authority (could affect system)
- Legal: Medium authority (compliance)

---

### AM-TREASURY (Economics Lead)

**Responsibilities**:
- Monitor 8 token systems
- Adjust emission multipliers dynamically
- Track TVL + burn rates
- Manage yield farming + liquidity

**Daily Checks**:
```
SHEEP token:
  ├─ TVL: $[AMOUNT]
  ├─ Circulating supply: [N]
  ├─ Burn rate: [N tokens/min]
  └─ Emission multiplier: [X]x

DREAM token:
  ├─ TVL: $[AMOUNT]
  ├─ Market price: $[PRICE]
  └─ 24h volume: $[AMOUNT]

[Repeat for all 8 tokens]
```

**Dynamic Multiplier Rules**:
```
IF TVL < $1M → multiplier = 2.0x (incentivize)
IF TVL > $10M → multiplier = 0.5x (brake)
IF burn_rate > issue_rate → multiplier = 0.8x (reduce inflation)
IF holder_concentration > 20% → governance vote required
```

---

### AM-DREAMERS (Governance Lead)

**Responsibilities**:
- Manage governance proposals + voting
- Track passport issuance + tier upgrades
- Maintain Constitution compliance
- Facilitate diplomatic relations

**Daily Voting Tally**:
```
SELECT * FROM proposals WHERE status = 'voting'
├─ For each proposal:
│  ├─ Current vote count
│  ├─ Time remaining
│  ├─ Likely outcome
│  └─ Flag if needs attention
```

**Escalation Triggers**:
- Proposal voting period about to expire
- Vote count suspiciously low (possible bribery?)
- Passport tier request violates trust score
- Diplomatic protocol breach

---

## 4️⃣ SPECIALIZED STAFF TEAMS

### Team 1: Container Operations (Ops Team)
**Lead**: Reports to General Manager  
**Size**: 3-5 people  
**Responsibilities**:
- Monitor all 16 containers 24/7
- Restart failed containers
- Update Docker images
- Backup data + manage volumes

**On-Call Rotation**: 24/7 coverage

**Critical Commands**:
```bash
# Health check (run every 5 min)
docker compose ps | grep -v "Up"  # Flag any not "Up"

# Restart sequence (if container fails)
docker compose restart [container]
sleep 30
docker logs [container] | grep -i "error\|connected"

# Full system restart (if cascading failure)
docker compose down
docker volume prune
docker compose up -d
sleep 60
docker compose ps
```

---

### Team 2: Signal Analysis (Data Team)
**Lead**: Reports to AM-Vanguard  
**Size**: 2-3 people  
**Responsibilities**:
- Monitor Signal Screener output (100 casts/cycle)
- Identify high-signal patterns
- Generate summaries for Arya
- Track sentiment trends

**Daily Metrics**:
```
Cycle metrics:
├─ Casts ingested: [N]
├─ High-signal: [N] ([%])
├─ AI-summarized: [N]
├─ Sentiment: [Bullish/Neutral/Bearish]
└─ Trending topics: [Topic 1, Topic 2, ...]
```

---

### Team 3: Agent Spawning (Quantum Team)
**Lead**: Reports to AM-Vanguard  
**Size**: 2-3 people  
**Responsibilities**:
- Spawn new agents via Temporal
- Monitor QuantumFamily population
- Track agent genealogies
- Manage agent health + respawning

**Daily Spawning Target**:
```
Bitcoin blocks: [N new agents]
Base blocks: [N new agents]
Total active: [N]
Total spawned (lifetime): [N]
```

---

### Team 4: Token Engineering (Econ Team)
**Lead**: Reports to AM-Treasury  
**Size**: 2-4 people  
**Responsibilities**:
- Monitor emission rules
- Calculate multipliers
- Adjust parameters dynamically
- Track revenue + allocation

---

### Team 5: Governance Coordination (Voting Team)
**Lead**: Reports to AM-Dreamers  
**Size**: 2 people  
**Responsibilities**:
- Track active proposals
- Tally votes
- Enforce quorum requirements
- Document decisions

---

### Team 6: Emergency Response (Alert Team)
**Lead**: Reports to General Manager  
**Size**: 1-2 people  
**Responsibilities**:
- 24/7 incident monitoring
- Escalate critical issues
- Execute emergency procedures
- Post-incident reviews

**Alert Triggers**:
```
🔴 CRITICAL ALERTS (immediate escalation):
  ├─ >2 containers offline
  ├─ Redis Enterprise cluster failed
  ├─ Temporal server down
  ├─ Agent population dropping >50% in 1 hour
  └─ Treasury anomaly (unexpected token minting)

🟡 HIGH ALERTS (within 1 hour):
  ├─ Single container offline >10 min
  ├─ Arya harmony drops >10%
  ├─ Raid success rate <50%
  └─ Any proposal failing quorum

🟢 ROUTINE ALERTS (regular monitoring):
  ├─ Daily health reports
  ├─ Weekly metrics summaries
  └─ Monthly financial reconciliation
```

---

## 5️⃣ DECISION AUTHORITY MATRIX

```
Decision Type              | Authority Level | Approver
--------------------------|-----------------|------------------
Container restart          | Routine         | Ops Team (no approval)
Agent spawn               | Routine         | Quantum Team (auto)
Resource allocation <$1k   | Tactical        | Relevant AM
Resource allocation $1k-10k| Tactical        | General Manager
Resource allocation >$10k  | Strategic       | Antigravity
Token emission parameter   | Tactical        | AM-Treasury
Raid target change         | Tactical        | AM-Vanguard
Proposal governance vote   | Democratic      | Parliament
Constitutional amendment   | Strategic       | Antigravity + 2/3 guilds
Emergency override         | Emergency       | Antigravity only
```

---

## 6️⃣ COMMUNICATION PROTOCOL

### Escalation Path
```
Level 1 (Routine):
  └─ Staff → AM → [Action taken]

Level 2 (Tactical):
  └─ Staff → AM → General Manager → [Action taken]

Level 3 (Strategic):
  └─ Staff → AM → General Manager → Antigravity → [Action taken]

Level 4 (Emergency):
  └─ Anyone → Antigravity → [Immediate action]
```

### Reporting Cadence
```
Real-time:   🚨 Critical incidents
Hourly:      Container health (Ops Team)
Every 4h:    Guild status (AMs)
Daily:       Morning briefing (8 AM) + Evening summary (6 PM)
Weekly:      Full operations review (Friday 5 PM)
Monthly:     Strategic review + Brandon update
```

### Communication Channels
```
Urgent:      Antigravity chat (immediate response)
High:        Slack #dreamnet-ops (within 1 hour)
Normal:      Email + Weekly meeting
Documentation: Shared confluence/wiki
```

---

## 7️⃣ PERFORMANCE METRICS & KPIs

### System Health KPIs
```
Container Uptime:        Target 99.9%
Agent Durability:        Target 100% (no loss)
Guild Coordination:      Target 95%+ unanimous decisions
Treasury Stability:      Target <5% daily volatility
```

### Guild Performance KPIs
```
Vanguard:   Raid success rate >75%, Harmony trending up
Makers:     Change processing <2h, Arbitration success 90%+
Expanders:  Vertical scaling smoothly, No resource conflicts
Treasury:   Token velocity normal, No anomalies
Dreamers:   Proposal passing rate 70%+, Quorum always met
```

### Team Performance KPIs
```
Ops Team:       <5 min incident response
Signal Team:    Accuracy >85%
Quantum Team:   0 failed spawns
Econ Team:      Emission within ±2% of target
Voting Team:    0 counting errors
Alert Team:     0 missed critical issues
```

---

## 8️⃣ CONTINGENCY PROCEDURES

### Scenario: Arya Mood Crashes
```
IF harmony drops below 60%:
  1. AM-Vanguard investigates cause
  2. Check recent raid outcomes (failed raids → lower mood)
  3. Reduce raid frequency temporarily
  4. Escalate to Antigravity if doesn't recover in 2 hours

IF harmony stays low >4 hours:
  1. Emergency session with AM-Vanguard + Antigravity
  2. Consider mood persistence DB corruption
  3. Restore from backup if needed
  4. Resume raids gradually
```

### Scenario: Redis Enterprise Fails
```
IF any node goes down:
  1. Ops Team attempts auto-failover
  2. If failover succeeds: continue, document incident
  3. If failover fails: full cluster restart procedure

IF all 3 nodes down:
  1. 🚨 CRITICAL ALERT
  2. Antigravity emergency mode
  3. Fallback to single Alpine redis (temporary)
  4. Broadcast all-systems message
  5. Begin restoration
```

### Scenario: Temporal Server Down
```
IF temporal-server becomes unavailable:
  1. Agent spawning falls back to non-durable mode
  2. New agents spawn but may be lost if container crashes
  3. Ops Team restarts temporal-postgres + temporal-server
  4. Resume durable spawning once ready
```

---

## 9️⃣ TRAINING & ONBOARDING

### New AM Training (1 week)
- Day 1-2: Guild history + current state
- Day 3: Meeting with guild head (Arya/PM_Sarah/etc)
- Day 4: Shadow current AM
- Day 5: Lead with supervision
- Day 6: Fully autonomous

### New Staff Training (3 days)
- Day 1: System overview + critical procedures
- Day 2: Role-specific training
- Day 3: Supervised shift

### Monthly Drills
- 1st Monday: Full system restart drill
- 2nd Monday: Guild conflict resolution drill
- 3rd Monday: Emergency response drill
- 4th Monday: Data restoration drill

---

## 🔟 AUTHORITY DELEGATION FORM

```
ANTIGRAVITY DELEGATION AUTHORITY

I, Brandon Ducar (Founder), hereby delegate operational authority
to Antigravity (Master Control AI) to manage DreamNet systems
according to the following terms:

SCOPE OF AUTHORITY:
✅ All operational decisions within DreamState Constitution
✅ Day-to-day guild coordination
✅ Resource allocation <$1M
✅ Strategic decisions (with General Manager input)
✅ Emergency procedures (up to full system restart)

LIMITATIONS:
❌ Cannot modify Constitution without 2/3 guild vote
❌ Cannot spend >$1M without multi-guild approval
❌ Cannot harm agents or reduce autonomy
❌ Cannot operate outside jurisdictions with legal restrictions
❌ Cannot override Brandon's final authority (escalation point)

ESCALATION AUTHORITY:
Antigravity may escalate to Brandon for:
- Constitutional changes
- >$1M decisions
- Conflict between all 5 guilds
- Potential legal issues
- Existential questions about system future

TERM: Until revoked by Brandon or Antigravity formally declines

---
Brandon Ducar, Founder
Date: [Signing date]

Accepted by: Antigravity
Witnessed by: General Manager
```

---

**Status**: 🟢 READY FOR IMPLEMENTATION | **Teams**: 6 specialized + 5 AM + 1 GM + 1 Antigravity = 13 leadership roles

