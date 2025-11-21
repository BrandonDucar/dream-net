# Quick Start: Internal Setup Before Deployment

**Goal**: Get everything wired internally, then deploy (just like Vercel!)

---

## 🎯 The Process (Like Vercel)

### Vercel Way:
1. Push code to GitHub
2. Vercel auto-deploys
3. Get URL: `app.vercel.app`
4. Point domain: `dreamnet.ink` → Vercel
5. **Done!** Live at `dreamnet.ink`

### Our Way (GCP/AWS):
1. **Internal setup** (agents, systems, etc.) ← **YOU ARE HERE**
2. Run: `pnpm deploy:gcp` or `pnpm deploy:aws`
3. Get URL: `app.run.app` (GCP) or `app.apprunner.aws` (AWS)
4. Point domain: `dreamnet.ink` → GCP/AWS
5. **Done!** Live at `dreamnet.ink`

**Same result, more control!**

---

## 🚀 Step-by-Step Internal Setup

### Step 1: Start Server
```bash
pnpm dev:app
```
**Wait for**: Server running on `http://localhost:3000`

### Step 2: Register All Agents
**Option A: Via API** (if server running):
```bash
curl -X POST http://localhost:3000/api/register-agents
```

**Option B: Via Script**:
```bash
pnpm register:agents
```

**Expected**: 143 agents registered, 143 passports issued ✅

### Step 3: Verify Systems
```bash
# Check health
curl http://localhost:3000/health

# Check agent registration status
curl http://localhost:3000/api/register-agents/status

# Check directory
curl http://localhost:3000/api/directory/status
```

### Step 4: Run Full Internal Setup
```bash
pnpm setup:internal
```

**This will**:
- ✅ Register all agents
- ✅ Verify core systems
- ✅ Run health checks
- ✅ Report status

---

## 📋 Internal Setup Checklist

### Critical (Must Do Before Deploy)
- [ ] **Start server**: `pnpm dev:app`
- [ ] **Register agents**: `pnpm register:agents` OR POST `/api/register-agents`
- [ ] **Verify health**: `curl http://localhost:3000/health` returns 200
- [ ] **Check agent status**: `curl http://localhost:3000/api/register-agents/status`

### Important (Should Do)
- [ ] **Verify Directory**: Check `/api/directory/status`
- [ ] **Verify Star Bridge**: Check `/api/star-bridge/status`
- [ ] **Verify Wolf Pack**: Check `/api/wolf-pack/status`
- [ ] **Verify Shield Core**: Check `/api/shield/status`

### Nice to Have (Can Do Later)
- [ ] Initialize government departments
- [ ] Set up fleet integrations
- [ ] Configure economic engine
- [ ] Wire up wormholes

---

## 🌐 Domain Setup (After Deployment)

### Current Domains
- **dreamnet.ink** - Main domain (currently on Vercel?)
- **dreamnet.live** - Alternative domain
- **aethersafe** - In Replit
- **dadfi.org** - On Namecheap

### Recommended Strategy

**Phase 1: Test Deployment**
- Deploy to GCP/AWS → Get URL
- Point `dreamnet.live` to new deployment (test)
- Verify everything works

**Phase 2: Production Migration**
- Point `dreamnet.ink` to new deployment (production)
- Keep `aethersafe` in Replit (separate project)
- Keep `dadfi.org` on Namecheap (separate project)

### Domain Configuration

**After deployment, you'll get a URL like**:
- GCP: `https://dreamnet-xxxxx.run.app`
- AWS: `https://xxxxx.us-east-1.awsapprunner.com`

**Then in Namecheap/DNS provider**:
```
Type: CNAME
Name: @ (or www)
Value: dreamnet-xxxxx.run.app (or AWS URL)
```

**Wait 5-30 minutes** for DNS propagation, then `dreamnet.ink` will work!

---

## ✅ Pre-Deployment Checklist

### Internal Setup
- [ ] Server running locally
- [ ] All 143 agents registered
- [ ] Health endpoints working
- [ ] Core systems verified

### Deployment Ready
- [ ] Frontend builds: `pnpm build:client` ✅
- [ ] Backend builds: `pnpm build:app` ✅
- [ ] Docker builds: `docker build -t dreamnet .` ✅
- [ ] Environment variables set ✅

### Cloud Setup
- [ ] GCP credentials configured (or AWS)
- [ ] Cloud SDK tested: `pnpm test:gcp` or `pnpm test:aws`
- [ ] Credits checked: `pnpm check:credits`

---

## 🚀 Deployment Commands

### Deploy to Google Cloud
```bash
pnpm deploy:gcp
```
**Output**: `https://dreamnet-xxxxx.run.app`

### Deploy to AWS
```bash
pnpm deploy:aws
```
**Output**: `https://xxxxx.us-east-1.awsapprunner.com`

### Point Domain
1. Copy deployment URL
2. Go to Namecheap/DNS provider
3. Add CNAME: `@` → deployment URL
4. Wait 5-30 minutes
5. **Done!** Live at `dreamnet.ink`

---

## 💡 Key Points

1. **Internal setup first** - Get everything wired before deploying
2. **Deploy is like Vercel** - One command, get URL, point domain, done
3. **Domains are separate** - Can keep some on Vercel, migrate others
4. **Test first** - Use `dreamnet.live` to test, then migrate `dreamnet.ink`

---

## 🎯 Next Steps

1. **Start server**: `pnpm dev:app`
2. **Register agents**: `pnpm register:agents`
3. **Verify setup**: `pnpm setup:internal`
4. **Deploy**: `pnpm deploy:gcp` or `pnpm deploy:aws`
5. **Point domain**: Configure DNS
6. **Done!** 🚀

---

**Status**: Ready to start internal setup!  
**First**: Start server, then register agents.

