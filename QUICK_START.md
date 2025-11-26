# ⚡ Quick Start - Get DreamNet Running NOW

## 🚀 **Fastest Way to See Your Website**

### **Option 1: Deploy to Google Cloud Run** (Production - Recommended)

```powershell
# From root directory
.\scripts\deploy-watchable.ps1
```

**This will:**
1. Build everything
2. Deploy to Google Cloud
3. Give you a live URL
4. Take ~5-10 minutes

**Result:** Your website live at `https://dreamnet-abc123-uc.a.run.app`

---

### **Option 2: Run Locally** (Development - Fastest)

**Terminal 1 - Start Backend:**
```powershell
pnpm dev:app
```

**Terminal 2 - Start Frontend:**
```powershell
cd client
pnpm dev
```

**Result:** 
- Backend: `http://localhost:8080`
- Frontend: `http://localhost:5173`
- Open `http://localhost:5173` in browser

---

## 🌐 **What Your Website Looks Like**

### **Homepage:**
- **DreamNet Hub** - Main landing
- **Mini Apps Grid** - All 60+ apps
- **Connect Wallet** button
- **Navigation Menu**

### **Mini Apps:**
- `/miniapps/x402-payment-gateway` - Send X402 payments
- `/miniapps/x402-balance-viewer` - Check balances
- `/miniapps/x402-service-marketplace` - Buy services
- `/miniapps/x402-transaction-history` - View history
- `/miniapps/x402-multi-chain-bridge` - Bridge tokens
- Plus 55+ more apps!

### **API:**
- `/api/health` - Health check
- `/api/x402/balance` - Get balance
- `/api/marketplace/services` - List services
- 200+ more endpoints

---

## ✅ **What's Already Running**

### **Server Status:**
- ❌ **Not started yet** - You need to start it
- ✅ **Ready to start** - All code is ready
- ✅ **Middleware connected** - Already configured
- ✅ **Routes registered** - All 200+ endpoints ready

### **What Happens When You Start:**

1. **Server starts** → Listens on port 8080
2. **Middleware loads** → CORS, auth, etc.
3. **Routes register** → All `/api/*` endpoints
4. **Agents initialize** → Wolf Pack, Whale Pack, etc.
5. **Frontend serves** → React app from `client/dist`

---

## 🎯 **Choose Your Path**

### **I want to see it NOW (Local):**
```powershell
# Terminal 1
pnpm dev:app

# Terminal 2  
cd client && pnpm dev

# Open browser: http://localhost:5173
```

### **I want to deploy to production:**
```powershell
.\scripts\deploy-watchable.ps1
```

### **I want to check if server is running:**
```powershell
curl http://localhost:8080/health
```

---

## 📊 **Current Status**

- ✅ **Backend Code:** Ready
- ✅ **Frontend Code:** Ready  
- ✅ **Smart Contracts:** Deployed (22 on Base)
- ✅ **X402 Apps:** Created + Contracts deployed
- ⏳ **Server:** Not started (you need to start it)
- ⏳ **Website:** Not live (deploy to make it live)

---

## 🚀 **Next Step**

**Choose one:**

1. **Local Development:** `pnpm dev:app` (see it now)
2. **Production Deploy:** `.\scripts\deploy-watchable.ps1` (go live)

**Which do you want to do?** 🤔
