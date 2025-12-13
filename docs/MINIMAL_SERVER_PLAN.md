# Minimal Server Startup Plan

**Goal**: Start with absolute minimum, then add subsystems one by one

---

## Phase 1: Bare Minimum Server ✅

**What We Need**:
- Express server
- Health endpoint (`/api/health`)
- Ready endpoint (`/ready`)
- Basic error handling
- Server listens on port

**What We DON'T Need Yet**:
- ❌ Neural Mesh
- ❌ Star Bridge Lungs
- ❌ Any subsystems
- ❌ Routes (except health)
- ❌ Vite/frontend
- ❌ Any optional packages

---

## Phase 2: Add Core Routes

**Add**:
- Basic API routes
- Route registration

**Skip**:
- Complex routes that depend on subsystems

---

## Phase 3: Add Subsystems One by One

**Order**:
1. Nervous System Core (Message Bus, Shared Memory)
2. Citadel Core
3. OrchestratorCore
4. Agent Registry Core
5. Then everything else

---

## Implementation

**Current Status**: Server running but Neural Mesh failed

**Next Steps**:
1. Disable Neural Mesh initialization
2. Disable all optional subsystems
3. Verify minimal server works
4. Add subsystems incrementally

