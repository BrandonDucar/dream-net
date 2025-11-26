# 🚀 Complete DreamNet Deployment Guide

## 📋 **What We're Deploying**

### **1. Backend Server** (`server/`)
- Express.js API server
- All routes (`/api/*`)
- DreamNet agents (Wolf Pack, Whale Pack, etc.)
- Database connections
- Middleware (CORS, auth, etc.)

### **2. Frontend Website** (`client/`)
- React app (DreamNet Hub)
- All 60+ mini apps
- Wallet connections
- UI/UX

### **3. Smart Contracts** (Already Deployed ✅)
- 22 contracts on Base mainnet
- X402 contracts just deployed

---

## 🏠 **What Your Website Will Look Like**

### **Homepage** (`dreamnet.ink`)
- **DreamNet Hub** - Main landing page
- **Mini Apps Grid** - All 60+ apps
- **Wallet Connection** - MetaMask integration
- **Navigation** - Creative menu system

### **Mini Apps** (`/miniapps/*`)
- X402 Payment Gateway
- X402 Balance Viewer
- X402 Service Marketplace
- X402 Transaction History
- X402 Multi-Chain Bridge
- All other 55+ mini apps

### **API Endpoints** (`/api/*`)
- `/api/dreams` - Dream management
- `/api/x402/*` - X402 payments
- `/api/wolf-pack/*` - Funding discovery
- `/api/whale-pack/*` - Commerce
- `/api/marketplace/*` - Agent marketplace
- 200+ more endpoints

---

## 🚀 **Deployment Options**

### **Option 1: Local Development** (Test First)

**Start Backend:**
```powershell
# From root directory
pnpm dev:app
```

**Start Frontend (separate terminal):**
```powershell
# From root directory
cd client
pnpm dev
```

**What happens:**
- Backend runs on `http://localhost:8080`
- Frontend runs on `http://localhost:5173`
- Frontend proxies `/api/*` to backend
- Hot reload enabled

---

### **Option 2: Production - Google Cloud Run** (Recommended)

**One Command Deployment:**
```powershell
# From root directory
.\scripts\deploy-watchable.ps1
```

**What it does:**
1. ✅ Builds Docker image
2. ✅ Pushes to Artifact Registry
3. ✅ Deploys to Cloud Run
4. ✅ Shows you the URL
5. ✅ Tests health endpoint

**Result:**
- Backend + Frontend served together
- URL like: `https://dreamnet-abc123-uc.a.run.app`
- Auto-scaling
- Pay-per-use

---

## 🔧 **How Everything Connects**

### **Architecture:**

```
┌─────────────────────────────────────┐
│   Google Cloud Run (Production)     │
│                                     │
│  ┌──────────────────────────────┐  │
│  │   Express Server (Backend)    │  │
│  │   - API Routes (/api/*)       │  │
│  │   - Middleware                │  │
│  │   - Agents                    │  │
│  └──────────────────────────────┘  │
│              │                      │
│              ▼                      │
│  ┌──────────────────────────────┐  │
│  │   React Frontend (Built)     │  │
│  │   - Serves client/dist       │  │
│  │   - SPA routing              │  │
│  └──────────────────────────────┘  │
└─────────────────────────────────────┘
              │
              ▼
    https://dreamnet.ink
```

### **Middleware Stack** (Already Configured):

1. **CORS** - Cross-origin requests
2. **Body Parser** - JSON/form data
3. **Trace ID** - Request tracking
4. **Idempotency** - Duplicate prevention
5. **Tier Resolver** - User tier detection
6. **Control Core** - Rate limiting
7. **Auto SEO** - SEO optimization
8. **Routes** - All API endpoints

---

## 📝 **Step-by-Step Deployment**

### **Step 1: Check Prerequisites**

```powershell
# Check if gcloud is installed
gcloud --version

# Check if you're logged in
gcloud auth list

# Check project
gcloud config get-value project
```

### **Step 2: Set Environment Variables**

Create `.env` file (if not exists):
```env
# Google Cloud
GCP_PROJECT_ID=your-project-id
GCP_REGION=us-central1
GCP_SERVICE_NAME=dreamnet

# Database
DATABASE_URL=your-database-url

# API Keys (optional for now)
OPENAI_API_KEY=your-key
# ... etc
```

### **Step 3: Deploy**

```powershell
# Run the watchable deployment script
.\scripts\deploy-watchable.ps1
```

**Watch the output:**
- ✅ APIs enabled
- ✅ Artifact Registry created
- ✅ Docker image built
- ✅ Deployed to Cloud Run
- ✅ Service URL shown

### **Step 4: Test**

The script will:
1. Deploy everything
2. Show you the URL
3. Test `/health` endpoint
4. Show logs command

---

## 🌐 **After Deployment**

### **Your Website URL:**
```
https://dreamnet-abc123-uc.a.run.app
```

### **What You'll See:**
1. **Homepage** - DreamNet Hub
2. **Mini Apps** - All 60+ apps
3. **Wallet Connect** - MetaMask button
4. **Navigation** - Creative menu

### **API Endpoints:**
- `https://dreamnet-abc123-uc.a.run.app/api/health`
- `https://dreamnet-abc123-uc.a.run.app/api/x402/balance`
- `https://dreamnet-abc123-uc.a.run.app/api/marketplace/services`
- etc.

---

## 🔍 **Check Server Status**

### **Local Development:**
```powershell
# Check if server is running
curl http://localhost:8080/health
```

### **Production:**
```powershell
# View logs
gcloud run services logs read dreamnet --region us-central1 --follow

# Check status
gcloud run services describe dreamnet --region us-central1
```

---

## 🎯 **Quick Start Commands**

### **Start Everything Locally:**
```powershell
# Terminal 1: Backend
pnpm dev:app

# Terminal 2: Frontend
cd client && pnpm dev
```

### **Deploy to Production:**
```powershell
.\scripts\deploy-watchable.ps1
```

### **Build Only:**
```powershell
# Build backend
pnpm build:app

# Build frontend
cd client && pnpm build
```

---

## ✅ **What's Already Configured**

- ✅ Server startup (`server/index.ts`)
- ✅ Middleware stack
- ✅ API routes (200+ endpoints)
- ✅ Frontend build (`client/dist`)
- ✅ Docker configuration
- ✅ Cloud Run deployment script
- ✅ Health checks
- ✅ Error handling

---

## 🚨 **Troubleshooting**

### **Server Won't Start:**
```powershell
# Check port
netstat -ano | findstr :8080

# Check logs
pnpm dev:app
```

### **Deployment Fails:**
```powershell
# Check gcloud auth
gcloud auth list

# Check project
gcloud config get-value project

# Check balance
gcloud billing accounts list
```

### **Frontend Not Loading:**
- Check if `client/dist` exists
- Check server logs
- Check browser console

---

## 📊 **Current Status**

- ✅ **Backend:** Ready to deploy
- ✅ **Frontend:** Ready to deploy
- ✅ **Contracts:** Deployed (22 on Base)
- ✅ **X402 Apps:** Created + Contracts deployed
- ⏳ **Production:** Ready to deploy

---

**Ready to deploy? Run: `.\scripts\deploy-watchable.ps1`** 🚀

