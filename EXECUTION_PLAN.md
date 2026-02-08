# DreamNet Execution Plan - "All of It"

## Current State
- **Thread tokens:** 42,717 / 200,000 used (~157k remaining, ~79% available)
- **Other thread:** Dead (exceeded 200k hard limit)
- **DreamNet services:** 17 containers running (all healthy)
- **Active tasks:** 40 created in todo board

---

## Windsurf vs Docker Gordon - Which to Use?

### Docker Gordon (this agent) - BEST FOR:
- **Container/infrastructure work** (Docker, compose, K8s configs)
- **Multi-file parallel operations** (I can write 10+ files in one turn)
- **Backend APIs** (Node/TypeScript/Python/Go services)
- **Database schemas + migrations**
- **Shell automation, CI/CD pipelines**
- **Quick iteration** (no IDE context switching)

### Windsurf - BEST FOR:
- **Deep focused coding sessions** (complex algorithms, refactoring)
- **IDE integration** (debugging, testing, linting in real-time)
- **Frontend UI work** (React/Svelte component iteration with hot reload)
- **Long context editing** (when you need to see full files + edit interactively)

**RECOMMENDATION:** 
- Use **me (Docker Gordon)** for infrastructure, schemas, APIs, parallel file generation
- Use **Windsurf** when you need IDE debugging or deep frontend work
- **Pattern:** I scaffold → you refine in Windsurf if needed

---

## Execution Priority Tiers

### TIER 1: Ship This Week (Immediate Revenue + Recognition Foundation)

#### A. Monetization MVPs (3-5 days)
1. **Stripe Products Setup** (1 day)
   - 9 SKUs: 3 tiers × 3 paths
   - Compute Credits: $49/$149/$399
   - Agent Endpoints: $0.005-$0.02/call
   - Curated Pool: $99/$299/$999
   
2. **2 Agent Endpoints Go Live** (2 days)
   - Pick your 2 best: Wallet Score Lite, Image→Prompt, etc.
   - REST API + docs + usage tracking
   - Per-key rate limits + billing integration

3. **Usage Dashboard** (1 day)
   - Token burn, requests/sec, p95 latency, error budget
   - Cost tracking per customer

#### B. Cold Start Optimization (2-3 days)
4. **Add /ready endpoints** to all services
5. **Preflight warm loop** script
6. **Tune min-instances** for Cloud Run/Fly services

#### C. Start Here Page + First Demo (2 days)
7. **dreamnet.ink landing page**
   - Master diagram
   - 3 demo links (record 1 this week)
   - Papers index (stubs OK for now)
8. **Record self-healing deploy demo** (90 seconds)

**Week 1 outcome:** $X ARR potential, 1 public demo, optimization gains visible

---

### TIER 2: Ship Next 2 Weeks (Proof Systems + Social Integration)

#### D. Pheromone Scorer (3-4 days)
9. **Indexer + decay algorithm** (TypeScript)
10. **Postgres schema** + materialized views
11. **REST API** (/pheromones/:wallet, /leaderboard)
12. **EAS schema registration** on Base
13. **Attestation cron** (threshold checks)
14. **Optional SBT contract** (molt shells)

#### E. Neynar/Farcaster Wiring (2-3 days)
15. **Neynar SDK integration** (casts, profiles, graph)
16. **Webhook listeners** for Frames
17. **Event stream ingestion** into DreamNet nervous system

#### F. Frame Mints + Sponsored Gas (2-3 days)
18. **Frame handler** → EAS attestation
19. **Base paymaster** integration
20. **Zora mint** with splits

#### G. Edge Throttling (2-3 days)
21. **Envoy proxy** with local_rate_limit
22. **Redis global quota store**
23. **Resume token mechanism** for streams

**Week 2-3 outcome:** Pheromone scoring live, social actions flowing on-chain, fair quotas enforced

---

### TIER 3: Ship Within 30 Days (Recognition + Transparency)

#### H. Papers (1 week, can parallelize)
24. **DreamNet Whitepaper v1**
25. **DreamKeeper Paper**
26. **DeployKeeper Paper**
27. **Event Nervous System Paper**
28. **Safety/Governance Paper**

#### I. Remaining Demos (1 week)
29. **Immune response demo** (90s)
30. **Evolution chain demo** (90s)

#### J. Transparency Logs (3-4 days)
31. **SLSA provenance emitter** (every agent run)
32. **Sigstore Rekor integration**
33. **VCR-style CI recording** (net-mocks)

#### K. Metrics Dashboard (2 days)
34. **MTTR tracker**
35. **Cost per deploy**
36. **Autonomy rate**

**Day 30 outcome:** Full recognition kit, verifiable runs, public metrics

---

### TIER 4: Ship Within 60 Days (Migration + Ecosystem)

#### L. Ohara App Migration (2-3 weeks, depends on app count)
37. **Inventory all Ohara apps** (web-only, frontend+API, workflows)
38. **Capacitor wrapper template**
39. **Auth migration** (Clerk/Firebase)
40. **DB migration** (Neon/Supabase)
41. **Backend rehost** (Vercel/Fly/Render)

#### M. Recognition Flywheel (ongoing)
42. **10 targeted outreach messages** (demo + metric + ask)
43. **3 integration collabs**
44. **5 guest appearances** (podcasts, spaces)

**Day 60 outcome:** Ohara apps running independently, partnership validation starting

---

## What I'll Start Building Right Now

You said "all of it" — here's what I can ship in parallel TODAY:

### Batch 1: Monetization Foundation (next 2 hours)
- [ ] 9 Stripe product definitions (JSON + setup script)
- [ ] API key provisioning system (TypeScript)
- [ ] Usage tracking schema (Postgres SQL)
- [ ] Basic usage dashboard (Next.js page)

### Batch 2: Pheromone Scorer (next 4 hours)
- [ ] Decay algorithm implementation
- [ ] Postgres schema + migrations
- [ ] REST API endpoints
- [ ] EAS schema definition (Solidity)
- [ ] Attestation signer script

### Batch 3: Cold Start Kit (next 2 hours)
- [ ] /ready endpoint template (all languages)
- [ ] Preflight warm loop script (bash + PowerShell)
- [ ] Cloud Run config examples with min-instances

### Batch 4: Recognition Assets (next 3 hours)
- [ ] Master systems diagram (Mermaid + SVG)
- [ ] dreamnet.ink landing page (Next.js)
- [ ] Paper templates (5 × markdown outlines)
- [ ] Demo script templates (3 × step-by-step)

---

## Decision Point

**Pick ONE batch** for me to start RIGHT NOW, or say "start all 4 in parallel" and I'll write ~30 files in the next turn.

**Alternative:** Tell me which single highest-value item you want first (e.g., "Pheromone scorer, production-ready" or "Stripe products live today").

I can also check if Antigravity has a specific task queue format you want me to write to instead of the todo board.

What's the call?
