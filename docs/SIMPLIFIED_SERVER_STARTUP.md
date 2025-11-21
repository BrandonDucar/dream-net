# 🎯 Simplified Server Startup Plan

**Goal**: Get server starting reliably with just essentials, then add features gradually

---

## ✅ What Stays (Core Essentials)

1. **Core Agents** (LUCID, CANVAS, ROOT, ECHO) - These work ✅
2. **Star Bridge** - This works ✅  
3. **Health Endpoints** (`/health`, `/ready`) - Essential ✅
4. **Basic Routes** - API routes that don't depend on heavy subsystems ✅

---

## ⏸️ What Gets Disabled (For Now)

1. **DreamState** - Governance layer (can add back later)
2. **Directory** - Entity discovery (can add back later)
3. **Network Blueprints** - Network bootstrap (can add back later)
4. **Nerve Fabric** - Event bus (can add back later)
5. **Spider Web Core** - Event threading (can add back later)
6. **Wolf Pack Analyst** - Pattern learning (can add back later)
7. **Shield Core** - Multi-phase shield (can add back later)
8. **Orca Pack** - Communications (can add back later)
9. **Whale Pack** - Commerce (can add back later)
10. **Webhook Nervous Core** - Auto-discovery (can add back later)

---

## 🔄 Gradual Re-enablement Strategy

**Phase 1** (Now): Core agents + Star Bridge + Health ✅
**Phase 2** (Next): Add DreamState (governance)
**Phase 3** (Then): Add Directory (entity discovery)
**Phase 4** (Later): Add Nerve Fabric (event bus)
**Phase 5** (Later): Add other subsystems one at a time

---

## 📝 How to Re-enable

1. Find the commented block in `server/index.ts`
2. Uncomment ONE subsystem
3. Test server startup
4. If it works, move to next subsystem
5. If it fails, fix or defer that subsystem

---

**Status**: Simplifying now... 🚀

