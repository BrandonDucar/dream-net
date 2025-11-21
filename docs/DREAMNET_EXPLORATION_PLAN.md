# DreamNet Exploration Plan

**Status**: Server starting, will explore once ready  
**Domains**: dreamnet.ink (Vercel), dreamnet.live (Firebase)

---

## 🎯 What We'll Explore

### Core Systems
1. **Health & Readiness** - `/health`, `/ready`
2. **Agent Citizenship** - `/api/register-agents/status`
3. **Directory** - `/api/directory/status`
4. **DreamState** - `/api/dream-state/status`

### Biomimetic Systems
5. **Star Bridge** - `/api/star-bridge/status`
6. **Wolf Pack** - `/api/wolf-pack/status`
7. **Shield Core** - `/api/shield/status`
8. **Octopus** - `/api/octopus/status`
9. **Jaggy** - `/api/jaggy/status`
10. **Spider Web** - `/api/webhooks/status`

### Fleets & Revenue
11. **Aegis Fleet** - `/api/fleets/status`
12. **Travel Fleet** - `/api/custom-gpt-fleets/status`
13. **Economic Engine** - `/api/economic-engine/status`
14. **Treasury** - `/api/treasury/status`

### Agent Gateway
15. **Agent Gateway** - `/api/agent/gateway/tools`
16. **Available Tools** - List all tools

---

## 📊 Expected Findings

### Current State (Before Setup)
- **Agents**: 0 registered (need to register 143)
- **Passports**: 0-1 (founder only)
- **Directory**: Core nodes registered, agents missing
- **Systems**: Most initialized, need verification

### After Internal Setup
- **Agents**: 143 registered ✅
- **Passports**: 143 issued ✅
- **Citizens**: 143 created ✅
- **Directory**: Full registry ✅
- **Systems**: All verified ✅

---

## 🚀 Exploration Script

**Run once server is ready**:
```bash
pnpm tsx scripts/explore-dreamnet.ts
```

**This will**:
- Check all health endpoints
- Verify agent registration
- Check directory status
- Verify biomimetic systems
- Check fleets
- Report on everything

---

## 📝 Domain Notes

### Current Setup
- **dreamnet.ink** → Vercel ✅ (working)
- **dreamnet.live** → Firebase ✅ (working)
- **aethersafe** → Replit ✅ (separate)
- **dadfi.org** → Namecheap ✅ (separate)

### Migration Plan
1. **Test**: Deploy to GCP/AWS → Point `dreamnet.live` (test new deployment)
2. **Production**: Point `dreamnet.ink` to GCP/AWS (migrate from Vercel)
3. **Keep Separate**: `aethersafe` (Replit), `dadfi.org` (Namecheap)

---

## ⏳ Waiting for Server

**Server is starting...** Once ready, we'll:
1. ✅ Check health
2. ✅ Register all 143 agents
3. ✅ Explore all systems
4. ✅ Report findings
5. ✅ Ready for deployment!

---

**Status**: Server starting, exploration ready! 🔍

