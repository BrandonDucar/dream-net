# 🚀 DreamNet Production Deployment Plan

**Status:** ✅ **Ready for Production**  
**Date:** 2025-01-27

---

## 🎯 Deployment Strategy

### **Multi-Platform Approach**

**Frontend:**
- **Primary:** Vercel (fast CDN, automatic deployments)
- **Backup:** AWS Amplify or Google Cloud Run

**Backend:**
- **Primary:** Google Cloud Run (uses $1,300 credits)
- **Backup:** AWS Lambda or Railway

**Database:**
- **Primary:** Neon PostgreSQL (already configured)

---

## 📋 Pre-Deployment Checklist

### **✅ Code Readiness**
- ✅ Google Cloud SDK integrated
- ✅ AWS SDK integrated
- ✅ All routes registered
- ✅ TypeScript compilation successful
- ✅ Build scripts configured
- ✅ Dockerfile ready

### **⚠️ Environment Variables Needed**

**Required:**
```bash
# Database
DATABASE_URL=postgresql://user:pass@host/db

# Runtime
NODE_ENV=production
PORT=8080

# Google Cloud (for backend)
GCP_PROJECT_ID=dreamnet-62b49
GCP_REGION=us-central1
GOOGLE_APPLICATION_CREDENTIALS=/path/to/key.json

# AWS (optional, for Amplify)
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
```

**Optional:**
```bash
# Domain
DOMAIN=dreamnet.ink

# API Keys
OPENAI_API_KEY=...
ANTHROPIC_API_KEY=...
TWILIO_API_KEY=...
STRIPE_SECRET_KEY=...
```

---

## 🚀 Deployment Steps

### **Phase 1: Frontend Deployment (Vercel)**

#### **Option A: Vercel Dashboard**
1. Go to https://vercel.com/new
2. Import GitHub repository
3. Configure:
   - **Root Directory:** `client`
   - **Build Command:** `pnpm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `pnpm install`
4. Add environment variables
5. Deploy

#### **Option B: Vercel CLI**
```bash
cd client
vercel login
vercel --prod
```

**Expected Result:**
- Frontend live at `https://dreamnet.ink` (or Vercel URL)
- API routes proxied to backend

---

### **Phase 2: Backend Deployment (Google Cloud Run)**

#### **Step 1: Build Docker Image**
```bash
# Build image
docker build -t gcr.io/dreamnet-62b49/dreamnet:latest .

# Tag for Cloud Run
docker tag gcr.io/dreamnet-62b49/dreamnet:latest \
  gcr.io/dreamnet-62b49/dreamnet:v1.0.0

# Push to Google Container Registry
docker push gcr.io/dreamnet-62b49/dreamnet:latest
```

#### **Step 2: Deploy via API**
```bash
curl -X POST http://localhost:5000/api/google-cloud/run/deploy \
  -H "Content-Type: application/json" \
  -d '{
    "serviceName": "dreamnet-api",
    "image": "gcr.io/dreamnet-62b49/dreamnet:latest",
    "port": 8080,
    "environmentVariables": {
      "NODE_ENV": "production",
      "DATABASE_URL": "...",
      "PORT": "8080"
    },
    "memory": "1Gi",
    "cpu": "1",
    "minInstances": 1,
    "maxInstances": 10
  }'
```

#### **Step 3: Configure Domain**
1. Go to Google Cloud Console → Cloud Run
2. Select `dreamnet-api` service
3. Click "Manage Custom Domains"
4. Add `api.dreamnet.ink`
5. Update DNS records

**Expected Result:**
- Backend live at `https://api.dreamnet.ink`
- All API endpoints accessible

---

### **Phase 3: Database Setup**

**Already Configured:**
- ✅ Neon PostgreSQL database
- ✅ Connection string in `DATABASE_URL`

**Verify:**
```bash
# Test database connection
curl http://localhost:5000/api/health
```

---

### **Phase 4: Environment Variables**

#### **Vercel (Frontend)**
```bash
# In Vercel Dashboard → Settings → Environment Variables
DATABASE_URL=...
NODE_ENV=production
VITE_API_URL=https://api.dreamnet.ink
```

#### **Google Cloud Run (Backend)**
```bash
# Via API or Console
NODE_ENV=production
DATABASE_URL=...
PORT=8080
GCP_PROJECT_ID=dreamnet-62b49
GCP_REGION=us-central1
```

---

## 🔧 Production Configuration

### **Frontend (Vercel)**

**vercel.json:**
```json
{
  "version": 2,
  "rootDirectory": "client",
  "buildCommand": "pnpm run build",
  "outputDirectory": "dist",
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "https://api.dreamnet.ink/:path*"
    }
  ]
}
```

### **Backend (Cloud Run)**

**Dockerfile:**
```dockerfile
FROM node:20-slim
RUN npm install -g pnpm@10.21.0
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm build
EXPOSE 8080
ENV NODE_ENV=production
CMD ["node", "server/dist/index.js"]
```

---

## 🧪 Post-Deployment Verification

### **1. Frontend Health**
```bash
curl https://dreamnet.ink
# Should return HTML
```

### **2. Backend Health**
```bash
curl https://api.dreamnet.ink/api/health
# Should return health status
```

### **3. API Endpoints**
```bash
# Test AWS integration
curl https://api.dreamnet.ink/api/aws/status

# Test Google Cloud integration
curl https://api.dreamnet.ink/api/google-cloud/status

# Test Dream endpoints
curl https://api.dreamnet.ink/api/dreams
```

### **4. Database Connection**
```bash
curl https://api.dreamnet.ink/api/health
# Check database status in response
```

---

## 📊 Deployment Status Tracking

### **Frontend**
- [ ] Vercel project created
- [ ] Environment variables configured
- [ ] Domain configured (dreamnet.ink)
- [ ] Deployment successful
- [ ] Health check passing

### **Backend**
- [ ] Google Cloud project configured
- [ ] Docker image built
- [ ] Cloud Run service deployed
- [ ] Environment variables set
- [ ] Domain configured (api.dreamnet.ink)
- [ ] Health check passing

### **Database**
- [ ] Neon database configured
- [ ] Connection string set
- [ ] Migrations applied
- [ ] Connection verified

### **Integrations**
- [ ] AWS SDK working
- [ ] Google Cloud SDK working
- [ ] All API endpoints accessible

---

## 🚨 Rollback Plan

### **If Deployment Fails:**

1. **Frontend Rollback:**
   ```bash
   # Vercel automatically keeps previous deployments
   # Rollback via Dashboard → Deployments → Previous → Promote
   ```

2. **Backend Rollback:**
   ```bash
   # Cloud Run keeps revisions
   # Rollback via Console → Cloud Run → Revisions → Rollback
   ```

3. **Database Rollback:**
   ```bash
   # Neon has point-in-time recovery
   # Restore via Neon Dashboard
   ```

---

## 💰 Cost Estimation

### **Google Cloud ($1,300 Credits)**
- Cloud Run: ~$20-50/month (with traffic)
- Cloud Storage: ~$5/month
- Cloud Build: ~$0.10/build
- **Estimated:** 6-12 months free

### **Vercel**
- Hobby Plan: Free (for personal projects)
- Pro Plan: $20/month (if needed)

### **Neon PostgreSQL**
- Free tier available
- Paid: ~$19/month (if needed)

**Total Estimated:** **$0-40/month** (with credits)

---

## 🎯 Quick Start Commands

### **Deploy Everything:**

```bash
# 1. Build
pnpm install
pnpm build

# 2. Deploy Frontend (Vercel)
cd client
vercel --prod

# 3. Deploy Backend (Google Cloud)
# Build Docker image
docker build -t gcr.io/dreamnet-62b49/dreamnet:latest .
docker push gcr.io/dreamnet-62b49/dreamnet:latest

# Deploy via API
curl -X POST https://api.dreamnet.ink/api/google-cloud/run/deploy \
  -H "Content-Type: application/json" \
  -d @deployment-config.json
```

---

## 📝 Production Checklist

- [ ] All environment variables configured
- [ ] Database migrations applied
- [ ] Frontend deployed to Vercel
- [ ] Backend deployed to Cloud Run
- [ ] Domains configured (dreamnet.ink, api.dreamnet.ink)
- [ ] SSL certificates active
- [ ] Health checks passing
- [ ] API endpoints tested
- [ ] Error monitoring configured
- [ ] Backup strategy in place

---

**Ready to deploy!** 🚀

Let's move DreamNet to production!
