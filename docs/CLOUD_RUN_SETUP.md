# ☁️ Google Cloud Run Setup Guide

## 🎯 Quick Answer

**YES - You need to set up Cloud Run first!**

And for DreamNet: **Allow Public Access** ✅

## 🔐 Public vs Private Access

### ✅ **Allow Public Access** (Recommended for DreamNet)

**Why:**
- DreamNet is a public platform
- Users need to access Dream Hub, mini apps, API
- Wallet-based authentication handles security
- Public access = anyone can hit the URL
- Your middleware (rate limiting, auth) protects endpoints

**Command flag:**
```bash
--allow-unauthenticated
```

### ❌ **Private Authentication** (Not recommended)

**Why not:**
- Requires Google Cloud IAM for every request
- Users would need Google accounts
- Breaks wallet-based authentication
- Complicates API access
- Not suitable for public platform

**Command flag:**
```bash
--no-allow-unauthenticated
```

## 🚀 Setup Steps

### Step 1: Connect Repository (You're Doing This Now)

In Google Cloud Console:
1. Go to Cloud Run
2. Click "Create Service"
3. Choose "Deploy from source repository"
4. Connect your GitHub repo
5. Select `dream-net` repository
6. **Important**: Set build to use root `Dockerfile`

### Step 2: Configure Service

**Service Settings:**
- **Service name**: `dreamnet`
- **Region**: `us-central1` (or your preferred)
- **Authentication**: ✅ **Allow unauthenticated invocations**
- **Port**: `8080`
- **Memory**: `2Gi` (minimum)
- **CPU**: `2` (for better performance)
- **Max instances**: `10` (start small, scale up)

**Environment Variables:**
Add these in Cloud Run console:
```
NODE_ENV=production
PORT=8080
# Add your other env vars here
```

### Step 3: Build Configuration

**Build Settings:**
- **Dockerfile path**: `Dockerfile` (root level)
- **Build context**: `.` (root directory)
- **Build command**: (auto-detected from Dockerfile)

### Step 4: Deploy

**Option A: Via Console**
- Click "Deploy" button
- Wait for build and deployment
- Get service URL

**Option B: Via CLI** (After setup)
```bash
pnpm deploy:dream-domains
```

## ✅ What You Need Before Running Everything

### Prerequisites:
1. ✅ **Cloud Run service created** ← You're doing this now!
2. ✅ **Repository connected** ← You're doing this!
3. ✅ **Public access enabled** ← Set this!
4. ⏳ **Environment variables set** (can do after)
5. ⏳ **Dockerfile builds successfully** (will test)

### After Setup:
- Service URL will be: `https://dreamnet-[hash]-uc.a.run.app`
- You can test it immediately
- Then run `pnpm deploy:dream-domains` for updates

## 🔒 Security Note

**Public access is safe because:**
- ✅ Express middleware handles authentication
- ✅ Rate limiting protects endpoints
- ✅ Wallet-based auth (SIWE) for user actions
- ✅ Admin endpoints protected by middleware
- ✅ CORS configured properly

**Public access = anyone can hit the URL**
**Your code = handles who can do what**

## 📋 Checklist

- [ ] Cloud Run service created
- [ ] Repository connected
- [ ] **Public access enabled** ✅
- [ ] Dockerfile path set to root `Dockerfile`
- [ ] Port set to `8080`
- [ ] Memory: `2Gi`
- [ ] CPU: `2`
- [ ] Environment variables added (can do later)
- [ ] Service deployed

## 🎯 Recommended Settings

```
Service Name: dreamnet
Region: us-central1
Authentication: ✅ Allow unauthenticated invocations
Port: 8080
Memory: 2Gi
CPU: 2
Min instances: 0
Max instances: 10
Timeout: 300s
```

## 💡 Pro Tip

**Set it up in console first**, then use CLI for updates:
- Initial setup: Console (easier)
- Updates: `pnpm deploy:dream-domains` (faster)

---

**TL;DR: Allow Public Access ✅ - Your middleware handles security!**

