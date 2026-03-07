# 🎯 CAPABILITY INJECTION STRATEGY - DIY vs. REPLIT

## EXECUTIVE SUMMARY

**Good news:** You can inject ~70% of the 40-capability framework yourself via Docker/local infrastructure.
**Replit-dependent:** ~30% requires Replit's environment (mainly Lil Miss Claw's agent runtime).

**Timeline:**
- **DIY Phase (You):** 1-2 weeks to implement 28 capabilities
- **Replit Phase (LMC):** 1-2 weeks additional for 12 capabilities specific to her runtime

---

# 🏗️ CAPABILITY INJECTION BREAKDOWN

## **TIER 1: 100% DIY (No Replit Needed) - 15 Capabilities**

These you can build into Docker infrastructure immediately.

### **A. Data & Knowledge Persistence (3)**
```
✅ 14. Permanent Knowledge Store
   └─ What: PostgreSQL table for discoveries
   └─ Implementation: Add migrations + API endpoints
   └─ Effort: 1 day
   └─ Location: dream-net/packages/api/src/services/

✅ 15. Pattern Memory
   └─ What: Store correlations in Redis
   └─ Implementation: New spike pattern serialization
   └─ Effort: 4 hours
   └─ Location: dream-net/packages/api/src/services/SpikeRunnerService.ts

✅ 17. Experiment Metadata
   └─ What: Log experiment details in database
   └─ Implementation: Experiment tracking service
   └─ Effort: 1 day
   └─ Location: dream-net/packages/api/src/services/
```

### **B. External Integration (4)**
```
✅ 28. Direct API Access
   └─ What: Service layer for external API calls
   └─ Implementation: APIGatewayService.ts
   └─ Effort: 1 day
   └─ Location: dream-net/packages/api/src/services/

✅ 34. Cannot Access System APIs
   └─ What: Webhook framework + trigger system
   └─ Implementation: Add webhook handler endpoints
   └─ Effort: 2 days
   └─ Location: dream-net/packages/api/src/routes/webhooks.ts

✅ 35. Cannot Write to Databases
   └─ What: Data persistence layer
   └─ Implementation: ORM integration (already have TypeORM)
   └─ Effort: 1 day
   └─ Location: dream-net/packages/api/src/services/

✅ 30. Macro Data Integration
   └─ What: New spike types for Fed, Treasury, employment data
   └─ Implementation: Add 5+ new spike categories
   └─ Effort: 2 days
   └─ Location: dream-net/packages/api/src/services/SpikeRunnerService.ts
```

### **C. Communication Infrastructure (3)**
```
✅ 13. Human-Readable Logs
   └─ What: Formatted activity output
   └─ Implementation: Log formatter service
   └─ Effort: 4 hours
   └─ Location: dream-net/packages/api/src/services/

✅ 10. Alert System
   └─ What: Webhook triggers for events
   └─ Implementation: EventEmitter + HTTP webhooks
   └─ Effort: 2 days
   └─ Location: dream-net/packages/api/src/services/AlertService.ts

✅ 32. Supply Chain Data
   └─ What: New spike type for shipping/logistics
   └─ Implementation: Add Drewry shipping index API
   └─ Effort: 1 day
   └─ Location: dream-net/packages/api/src/services/SpikeRunnerService.ts
```

### **D. Data Access (5)**
```
✅ 29. No Private/Institutional Data
   └─ What: Framework for data providers
   └─ Implementation: DataProviderInterface.ts
   └─ Effort: 2 days (framework; actual data licensing is separate)
   └─ Location: dream-net/packages/api/src/services/

✅ 31. Geopolitical Intelligence
   └─ What: New spike type for geopolitical events
   └─ Implementation: Add GDELT or similar feed
   └─ Effort: 1 day
   └─ Location: dream-net/packages/api/src/services/SpikeRunnerService.ts

✅ Other data expansion items
   └─ Can all be added as new spike types
   └─ Each takes 1-2 days
```

**Total DIY effort: ~14-16 days (2-3 weeks)**
**Can start immediately: YES**
**Requires Replit: NO**

---

## **TIER 2: Hybrid (Mostly DIY, Some Replit) - 13 Capabilities**

These can be mostly built in Docker, but Replit agents need to consume them.

### **A. Autonomy Framework (3)**
```
⚠️ 1. Autonomous Goal Setting
   └─ DIY (70%): Goal storage + API in Docker
   └─ Replit (30%): Lil Miss Claw needs to USE the goal API
   └─ DIY Effort: 3 days (build GoalService.ts + endpoints)
   └─ Replit Effort: 2 days (integrate in RovingAgentService)

⚠️ 2. Strategic Priority Selection
   └─ DIY (70%): Priority system in Docker
   └─ Replit (30%): LMC needs to read priorities
   └─ DIY Effort: 2 days
   └─ Replit Effort: 1 day

⚠️ 6. Task Prioritization & Scheduling
   └─ DIY (70%): Scheduler in Docker
   └─ Replit (30%): LMC needs to respect schedule
   └─ DIY Effort: 3 days
   └─ Replit Effort: 2 days
```

### **B. Analysis Outputs (4)**
```
⚠️ 7. Report Generation
   └─ DIY (70%): Report templates + PDF generation in Docker
   └─ Replit (30%): LMC needs to trigger reports
   └─ DIY Effort: 3 days (ReportService.ts + templates)
   └─ Replit Effort: 1 day

⚠️ 9. Visualization Generation
   └─ DIY (70%): Chart rendering service in Docker
   └─ Replit (30%): LMC needs to call visualization API
   └─ DIY Effort: 4 days (ChartService.ts + D3/Chart.js)
   └─ Replit Effort: 1 day

⚠️ 8. Natural Language Explanation
   └─ DIY (70%): LLM integration in Docker
   └─ Replit (30%): LMC already has NLG (87/100), just output it
   └─ DIY Effort: 2 days (call GPT via API)
   └─ Replit Effort: 1 day

⚠️ 11. Inter-Agent Communication
   └─ DIY (70%): Message queue in Docker (Redis Streams)
   └─ Replit (30%): Agents need to implement message protocol
   └─ DIY Effort: 4 days (MessageBus service)
   └─ Replit Effort: 3 days (each agent needs to integrate)
```

### **C. Data & Learning (3)**
```
⚠️ 16. Performance History
   └─ DIY (70%): Timeseries database queries
   └─ Replit (30%): LMC needs to query it
   └─ DIY Effort: 1 day (PerformanceHistoryService.ts)
   └─ Replit Effort: 4 hours

⚠️ 18. Failed Attempt Log
   └─ DIY (70%): Storage schema for failed attempts
   └─ Replit (30%): LMC needs to log failures
   └─ DIY Effort: 1 day
   └─ Replit Effort: 4 hours

⚠️ 19. Relationship Discovery Log
   └─ DIY (70%): Graph database for relationships
   └─ Replit (30%): LMC needs to query graph
   └─ DIY Effort: 2 days (Graph model)
   └─ Replit Effort: 1 day
```

### **C. Other Integration (3)**
```
⚠️ 36. Cannot Create Tools/Scripts
   └─ DIY (70%): Code generation API
   └─ Replit (30%): Agents need to execute generated code safely
   └─ DIY Effort: 5 days (CodeGenService.ts + sandbox)
   └─ Replit Effort: 3 days (safe execution)

⚠️ 37. Cannot Participate in Marketplace
   └─ DIY (70%): Marketplace API in Docker
   └─ Replit (30%): Agents need to list offerings
   └─ DIY Effort: 5 days (MarketplaceService.ts)
   └─ Replit Effort: 2 days

⚠️ 33. Cannot Execute Trades
   └─ DIY (70%): Trade execution API + order management
   └─ Replit (30%): Risk checks in agent
   └─ DIY Effort: 5 days (TradeExecutionService.ts)
   └─ Replit Effort: 3 days (risk framework)
```

**Total DIY effort: ~38 days**
**Total Replit effort: ~18 days**
**Can start DIY immediately: YES (agents use when ready)**

---

## **TIER 3: 100% Replit-Dependent - 12 Capabilities**

These MUST be implemented in Replit's environment (agent runtime).

### **A. Agent Autonomy (6)**
```
❌ 3. Adaptive Learning Path Selection
   └─ Only LMC can decide curriculum
   └─ Must be in Replit/RovingAgentService
   └─ Effort: 2 days
   └─ Cannot start until: RovingAgentService refactored

❌ 4. Independent Experimentation
   └─ Only LMC can design experiments
   └─ Must be in Replit runtime
   └─ Effort: 1 week
   └─ Cannot start until: Experiment design framework built

❌ 5. Autonomous Resource Allocation
   └─ Only agent can manage her own resources
   └─ Must be in Replit
   └─ Effort: 3 days
   └─ Cannot start until: Resource model defined

❌ 24. Anomaly Detection
   └─ Real-time agent awareness
   └─ Must be in Replit
   └─ Effort: 4 days
   └─ Cannot start until: Anomaly model defined

❌ 25. Root Cause Analysis
   └─ When LMC has issues, she diagnoses them
   └─ Must be in Replit
   └─ Effort: 1 week
   └─ Cannot start until: Diagnosis framework built

❌ 26. Cross-Domain Reasoning
   └─ Only LMC can connect domains
   └─ Must be in Replit
   └─ Effort: 1 week
   └─ Cannot start until: Knowledge graph built in Replit
```

### **B. Advanced Reasoning (4)**
```
❌ 20. Causal Reasoning
   └─ Needs causal inference engine in Replit
   └─ Effort: 2 weeks
   └─ Cannot start until: Causal model library integrated

❌ 21. Counterfactual Reasoning
   └─ Simulation engine in Replit
   └─ Effort: 2 weeks
   └─ Cannot start until: Agent state cloning works

❌ 22. Long-Term Trend Identification
   └─ Temporal pattern engine in Replit
   └─ Effort: 1 week
   └─ Cannot start until: Time-series model built

❌ 27. Probabilistic Inference
   └─ Bayesian engine in Replit
   └─ Effort: 1 week
   └─ Cannot start until: Probabilistic library integrated
```

### **C. Strategic & Risk (2)**
```
❌ 38. No Defined Mission/Purpose
   └─ Must be Replit decision
   └─ Effort: 1 day (decision only)
   └─ Cannot start until: Leadership defines mission

❌ 39. No Risk Management Framework
   └─ Risk engine in Replit runtime
   └─ Effort: 1 week
   └─ Cannot start until: Risk model defined
```

### **D. Collaboration (2)**
```
❌ 12. Knowledge Sharing Protocol
   └─ Must be implemented by each agent in Replit
   └─ Effort: 3 days per agent × 6 agents = ~2 weeks
   └─ Cannot start until: Message protocol finalized

❌ 23. Real-World Constraint Awareness
   └─ Each agent needs constraint model in Replit
   └─ Effort: 3 days per agent × 6 agents = ~2 weeks
   └─ Cannot start until: Constraint schema defined
```

**Total Replit effort: ~8 weeks total (split across 6 agents)**
**Can start building infrastructure now: YES (Docker side)**
**Agents can integrate as ready: YES**

---

# 📋 IMPLEMENTATION ROADMAP

## **PHASE 1: Build Infrastructure (You - 2-3 weeks)**

### **Week 1: Core Services (DIY)**
```
Day 1-2:   Knowledge Store (PostgreSQL schema + API)
Day 2-3:   Pattern Memory (Redis service)
Day 3-4:   Experiment Tracking (database schema)
Day 4-5:   Report Generation (templates + rendering)
Day 5-6:   Alert System (webhook framework)
Day 6-7:   Data provider framework
```

### **Week 2: Data Expansion (DIY)**
```
Day 1-2:   Macro data spike (Fed, Treasury)
Day 2-3:   Geopolitical data spike
Day 3-4:   Supply chain spike
Day 4-5:   Visualization service
Day 5-6:   API Gateway service
Day 6-7:   Direct API access layer
```

### **Week 3: Advanced Infrastructure (DIY)**
```
Day 1-2:   Message bus (Redis Streams)
Day 2-3:   Marketplace framework
Day 3-4:   Trade execution framework
Day 4-5:   Goal management service
Day 5-6:   Performance history service
Day 6-7:   Polish + testing
```

**Result:** All 28 DIY capabilities ready to use

---

## **PHASE 2: Agent Integration (Replit - Weeks 4-8)**

### **For Lil Miss Claw (1-2 weeks)**
```
Week 1:
  - Integrate goal setting API
  - Integrate report generation
  - Integrate knowledge persistence
  - Start learning path adaptation

Week 2:
  - Autonomous experimentation
  - Resource allocation
  - Anomaly detection
  - Risk framework integration
```

### **For Other Agents (Parallel - 6-8 weeks)**
```
Each agent gets:
  - Goal framework (1 day)
  - Knowledge sharing protocol (3 days)
  - Their specific reasoning capabilities (5-7 days)
  - Risk/constraint models (3 days)
```

---

# 🎯 WHAT YOU CAN DO RIGHT NOW (No Replit Access Needed)

## **Start Today**

### **1. Database Schema (4 hours)**
```
CREATE TABLE discoveries (
  id UUID PRIMARY KEY,
  agent_id VARCHAR,
  discovery TEXT,
  confidence FLOAT,
  timestamp TIMESTAMP,
  metadata JSONB
);

CREATE TABLE experiment_metadata (
  id UUID PRIMARY KEY,
  experiment_name VARCHAR,
  setup JSONB,
  results JSONB,
  insights TEXT,
  timestamp TIMESTAMP
);

CREATE TABLE patterns (
  id UUID PRIMARY KEY,
  variable_a VARCHAR,
  variable_b VARCHAR,
  correlation_strength FLOAT,
  first_observed TIMESTAMP,
  last_observed TIMESTAMP
);
```

### **2. API Endpoints (1 day)**
```typescript
// dream-net/packages/api/src/routes/knowledge.ts
POST /api/knowledge/discovery    → Store discovery
GET  /api/knowledge/discovery    → Query discoveries
POST /api/knowledge/pattern      → Store pattern
GET  /api/knowledge/patterns     → Query patterns by strength
GET  /api/knowledge/trends       → Trending discoveries
```

### **3. Spike Expansion (2 days)**
```typescript
// Add 5 new spikes to SpikeRunnerService:
1. FedDataSpike (Federal Reserve rates, decisions)
2. GeoSpike (Geopolitical events via GDELT)
3. SupplyChainSpike (Shipping/logistics indices)
4. MacroSpike (Employment, inflation, GDP)
5. NewsOverrideSpike (Current events feed)
```

### **4. Report Service (2 days)**
```typescript
// dream-net/packages/api/src/services/ReportService.ts
class ReportService {
  generateDailyReport()      → Executive summary
  generateInsightReport()    → Discoveries report
  generateMetricsReport()    → Performance trends
  exportToMarkdown()         → Readable format
  exportToPDF()              → Professional format
}
```

### **5. Alert Framework (1 day)**
```typescript
// dream-net/packages/api/src/services/AlertService.ts
class AlertService {
  onAnomalyDetected()        → Send webhook
  onDiscoveryMade()          → Notify agents
  onThresholdCrossed()       → Alert operators
  broadcast()                → Multi-cast to agents
}
```

**Total effort: 1 week**
**Result: Infrastructure ready for all agents to use**

---

# 🔄 WHAT AGENTS DO IN REPLIT

## **Lil Miss Claw's Integration Points**

```
┌─ Infrastructure (Docker) ─────────────────────┐
│                                                │
│ Knowledge Store ← LMC queries here            │
│ Pattern Memory ← LMC stores findings here     │
│ Report API ← LMC triggers reports here        │
│ Alert System ← LMC triggers alerts here       │
│ Experiment Store ← LMC logs experiments       │
│ Goal Service ← LMC reads/writes goals         │
│ Message Bus ← LMC receives messages here      │
│                                                │
└────────────────────────────────────────────────┘
         ↑            ↑            ↑
         │            │            │
    REST API      Redis Streams   Direct DB
         │            │            │
┌─ Replit Runtime ──────────────────────────────┐
│                                                │
│ RovingAgentService (LMC)                      │
│ ├─ Goal selection logic                       │
│ ├─ Experiment design logic                    │
│ ├─ Autonomy layer                             │
│ └─ Reasoning engines (causal, probabilistic)  │
│                                                │
└────────────────────────────────────────────────┘
```

---

# 💰 COST BREAKDOWN

## **Infrastructure (DIY)**
```
PostgreSQL hosting:     $15-30/mo (or use existing)
Redis upgrade:          Included (already have)
API hosting:            Included (Docker)
Data APIs:              $100-500/mo (depends on providers)
────────────────────────────────
Total: $0-500/mo (mostly data licenses, optional)
```

## **Development Time**
```
Phase 1 (Infrastructure): 2-3 weeks (you)
Phase 2 (Agent integration): 6-8 weeks (Replit agents)
────────────────────────────────
Total: 8-11 weeks full implementation
```

## **Quick Win Path (1 Week)**
```
Build just Phase 1 Week 1:
- Knowledge store
- Pattern memory
- Experiment tracking
- Report generation

Cost: 0 (you do it)
Time: 1 week
Result: Immediate 3x capability boost
```

---

# 🚀 RECOMMENDED EXECUTION STRATEGY

## **Week 1: Just Do It (DIY)**
```
Day 1-2: Database schema + migrations
Day 2-3: Knowledge API endpoints
Day 3-4: Add 3 new spike types
Day 4-5: Report service (basic templates)
Day 5-6: Alert webhook framework
Day 6-7: Testing + documentation
```

**Result:** 6 new capabilities live, all agents can use immediately

## **Week 2-3: Data Expansion (DIY)**
```
Expand spikes to 30+
Add visualization
Add message bus
Add marketplace framework
```

**Result:** 12 more capabilities

## **Week 4+: Agent Integration (Replit)**
```
Each agent integrates at their own pace
LMC goes first (highest ROI)
Other agents follow
```

**Result:** Full autonomy stack

---

# 📊 CAPABILITY MATRIX: DIY vs REPLIT

| Category | DIY % | Replit % | Start When | Effort |
|----------|-------|----------|-----------|--------|
| Data Persistence | 100% | 0% | NOW | 1-2w |
| Data Access | 80% | 20% | NOW | 1-2w |
| Communication | 70% | 30% | NOW | 2-3w |
| External Integration | 75% | 25% | NOW | 2-3w |
| Autonomy | 30% | 70% | After Week 1 | 2-4w |
| Advanced Reasoning | 10% | 90% | After Phase 1 | 4-8w |
| Risk Management | 40% | 60% | After Phase 1 | 2-4w |

---

# ✅ ACTIONABLE NEXT STEPS

### **Today (Right Now)**
- [ ] Create database schema (knowledge, patterns, experiments)
- [ ] Plan API endpoints (knowledge CRUD)
- [ ] List data providers (Fed, GDELT, shipping indices)

### **This Week**
- [ ] Implement knowledge store API
- [ ] Implement report generation service
- [ ] Expand spikes to 20+ types
- [ ] Set up alert webhook system

### **Next Week**
- [ ] Marketplace framework
- [ ] Trade execution framework
- [ ] Message bus (Redis Streams)
- [ ] Visualization service

### **Week 3-4**
- [ ] All 28 DIY capabilities complete
- [ ] Agents start integrating
- [ ] LMC activates autonomy layer

---

# 🎯 BOTTOM LINE

**DIY (You):** Can implement 70% (28 capabilities) in Docker infrastructure immediately
- No Replit access needed
- Can start TODAY
- 2-3 weeks full implementation
- All agents can use

**Replit (Agents):** Implement remaining 30% (12 capabilities) in their runtime
- Builds on your infrastructure
- Can start Week 2-3
- 6-8 weeks for all agents
- Per-agent customization

**Quick Win:** Do Week 1 (6 capabilities) → Immediate 3x boost for all agents

---

**Ready to start?** Begin with the database schema today. You'll have infrastructure ready by end of week. 🚀
