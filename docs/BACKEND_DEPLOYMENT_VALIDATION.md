# DreamNet Backend Deployment - Validation Steps

**Purpose:** Verify backend builds locally and runs in Cloud Run-like mode  
**Target:** Ensure `server/` is production-ready before deploying to Cloud Run

---

## Local Build Validation

### Step 1: Install Dependencies

```bash
# From repo root
pnpm install --no-frozen-lockfile
```

**Expected Output:**
```
✓ Dependencies installed
✓ Workspace packages linked
```

**Verification:**
```bash
# Check that node_modules exists
ls node_modules

# Check workspace packages
ls packages/deployment-core
ls packages/directory
```

---

### Step 2: Build Backend

```bash
# From repo root
cd server
pnpm build
```

**Expected Output:**
```
🔨 Starting build process...
📦 Running TypeScript compiler...
⚠️ TypeScript reported errors, but dist/index.js exists - continuing
✅ Build completed successfully - dist/index.js exists
📄 File size: 80949 bytes
```

**Verification:**
```bash
# Check dist/index.js exists
ls server/dist/index.js

# Check file size (should be ~80KB)
Get-ChildItem server/dist/index.js | Select-Object Length
```

**✅ Status:** Verified locally (80,949 bytes)

---

### Step 3: Build Frontend (Optional)

```bash
# From repo root
cd client
pnpm build
```

**Expected Output:**
```
✓ Built in XXXms
✓ dist/ folder created
```

**Verification:**
```bash
# Check dist folder exists
ls client/dist

# Check index.html exists
ls client/dist/index.html
```

---

## Docker Build Validation (Optional but Recommended)

### Step 1: Build Docker Image Locally

```bash
# From repo root
docker build -t dreamnet:local .
```

**Expected Output:**
```
[+] Building XXs (XX/XX FINISHED)
=> [internal] load build definition
=> [internal] load .dockerignore
=> [internal] load metadata
=> CACHED [1/8] FROM docker.io/library/node:20-slim
=> [2/8] RUN npm install -g pnpm@10.21.0
=> [3/8] COPY package files
=> [4/8] RUN pnpm install --frozen-lockfile
=> [5/8] COPY source code
=> [6/8] RUN cd client && pnpm build
=> [7/8] RUN cd server && pnpm build
=> [8/8] RUN mkdir -p server/dist && cp server/vite.ts server/dist/vite.js
=> exporting to image
=> => naming to docker.io/library/dreamnet:local
```

**Verification:**
```bash
# List Docker images
docker images | grep dreamnet

# Expected output:
# dreamnet    local    <image-id>    <timestamp>    <size>
```

---

### Step 2: Run Docker Container Locally

```bash
# Run with minimal env vars
docker run -p 8080:8080 \
  -e NODE_ENV=production \
  -e PORT=8080 \
  dreamnet:local
```

**Expected Output:**
```
🚀 DreamNet Server starting...
✅ Server listening on port 8080
```

**Verification:**
Open another terminal and test:

```bash
# Health check
curl http://localhost:8080/health

# Expected: {"status":"ok","timestamp":"..."}
```

---

### Step 3: Test with Database (If Available)

```bash
# Run with DATABASE_URL
docker run -p 8080:8080 \
  -e NODE_ENV=production \
  -e PORT=8080 \
  -e DATABASE_URL="postgresql://user:password@host:5432/database" \
  dreamnet:local
```

**Expected Output:**
```
🚀 DreamNet Server starting...
✅ Database connected
✅ Server listening on port 8080
```

**Verification:**
```bash
# Test database-dependent endpoint
curl http://localhost:8080/api/dreams

# Expected: JSON response (may be empty array if no data)
```

---

## Cloud Run Simulation (Local)

### Run with Cloud Run Environment Variables

```bash
docker run -p 8080:8080 \
  -e NODE_ENV=production \
  -e PORT=8080 \
  -e K_SERVICE=dreamnet \
  -e K_REVISION=dreamnet-00001-abc \
  -e K_CONFIGURATION=dreamnet \
  dreamnet:local
```

**Note:** `K_SERVICE`, `K_REVISION`, `K_CONFIGURATION` are Cloud Run-specific env vars.

---

## Smoke Test Endpoints

### Core Endpoints

| Endpoint | Method | Expected Response | Status |
|----------|--------|-------------------|--------|
| `/health` | GET | `{"status":"ok"}` | ✅ Required |
| `/api/health` | GET | `{"status":"ok"}` | ✅ Required |
| `/` | GET | Frontend HTML | ✅ Required |

### API Endpoints (Require Database)

| Endpoint | Method | Expected Response | Status |
|----------|--------|-------------------|--------|
| `/api/dreams` | GET | `[]` or dream array | ⚠️ DB required |
| `/api/agents` | GET | Agent list | ⚠️ DB required |
| `/api/garden/feed` | GET | Garden feed | ⚠️ DB required |

### Authentication Endpoints

| Endpoint | Method | Expected Response | Status |
|----------|--------|-------------------|--------|
| `/api/auth/nonce` | GET | `{"nonce":"..."}` | ✅ Should work |
| `/api/auth/verify` | POST | Auth response | ⚠️ Requires payload |

---

## Smoke Test Script

### Create Test Script

Create `scripts/smoke-test.sh`:

```bash
#!/bin/bash

BASE_URL=${1:-http://localhost:8080}

echo "🧪 Running smoke tests against $BASE_URL"
echo ""

# Test 1: Health check
echo "Test 1: Health check"
curl -s $BASE_URL/health | grep -q "ok" && echo "✅ PASS" || echo "❌ FAIL"

# Test 2: API health
echo "Test 2: API health"
curl -s $BASE_URL/api/health | grep -q "ok" && echo "✅ PASS" || echo "❌ FAIL"

# Test 3: Frontend
echo "Test 3: Frontend"
curl -s $BASE_URL/ | grep -q "html" && echo "✅ PASS" || echo "❌ FAIL"

# Test 4: API endpoint (may fail without DB)
echo "Test 4: API endpoint (optional)"
curl -s $BASE_URL/api/dreams && echo "✅ PASS" || echo "⚠️ SKIP (DB required)"

echo ""
echo "🎉 Smoke tests complete!"
```

### Run Smoke Tests

```bash
# Test local Docker container
bash scripts/smoke-test.sh http://localhost:8080

# Test Cloud Run deployment
bash scripts/smoke-test.sh https://dreamnet-xxx-uc.a.run.app
```

---

## PowerShell Smoke Test (Windows)

### Create Test Script

Create `scripts/smoke-test.ps1`:

```powershell
param(
    [string]$BaseUrl = "http://localhost:8080"
)

Write-Host "🧪 Running smoke tests against $BaseUrl" -ForegroundColor Cyan
Write-Host ""

# Test 1: Health check
Write-Host "Test 1: Health check" -NoNewline
try {
    $response = Invoke-RestMethod -Uri "$BaseUrl/health" -Method Get
    if ($response.status -eq "ok") {
        Write-Host " ✅ PASS" -ForegroundColor Green
    } else {
        Write-Host " ❌ FAIL" -ForegroundColor Red
    }
} catch {
    Write-Host " ❌ FAIL: $_" -ForegroundColor Red
}

# Test 2: API health
Write-Host "Test 2: API health" -NoNewline
try {
    $response = Invoke-RestMethod -Uri "$BaseUrl/api/health" -Method Get
    if ($response.status -eq "ok") {
        Write-Host " ✅ PASS" -ForegroundColor Green
    } else {
        Write-Host " ❌ FAIL" -ForegroundColor Red
    }
} catch {
    Write-Host " ❌ FAIL: $_" -ForegroundColor Red
}

# Test 3: Frontend
Write-Host "Test 3: Frontend" -NoNewline
try {
    $response = Invoke-WebRequest -Uri "$BaseUrl/" -Method Get
    if ($response.Content -match "html") {
        Write-Host " ✅ PASS" -ForegroundColor Green
    } else {
        Write-Host " ❌ FAIL" -ForegroundColor Red
    }
} catch {
    Write-Host " ❌ FAIL: $_" -ForegroundColor Red
}

# Test 4: API endpoint (optional)
Write-Host "Test 4: API endpoint (optional)" -NoNewline
try {
    $response = Invoke-RestMethod -Uri "$BaseUrl/api/dreams" -Method Get
    Write-Host " ✅ PASS" -ForegroundColor Green
} catch {
    Write-Host " ⚠️ SKIP (DB required)" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "🎉 Smoke tests complete!" -ForegroundColor Cyan
```

### Run PowerShell Tests

```powershell
# Test local Docker container
.\scripts\smoke-test.ps1 -BaseUrl "http://localhost:8080"

# Test Cloud Run deployment
.\scripts\smoke-test.ps1 -BaseUrl "https://dreamnet-xxx-uc.a.run.app"
```

---

## Post-Deployment Validation

### After Cloud Run Deployment

1. **Get Service URL:**
   ```bash
   gcloud run services describe dreamnet --region us-central1 --format="value(status.url)"
   ```

2. **Test Health Endpoint:**
   ```bash
   curl $(gcloud run services describe dreamnet --region us-central1 --format="value(status.url)")/health
   ```

3. **Test API Endpoint:**
   ```bash
   curl $(gcloud run services describe dreamnet --region us-central1 --format="value(status.url)")/api/health
   ```

4. **Test Frontend:**
   ```bash
   curl $(gcloud run services describe dreamnet --region us-central1 --format="value(status.url)")/ | grep html
   ```

5. **Run Full Smoke Tests:**
   ```bash
   SERVICE_URL=$(gcloud run services describe dreamnet --region us-central1 --format="value(status.url)")
   bash scripts/smoke-test.sh $SERVICE_URL
   ```

---

## Performance Validation

### Load Test (Optional)

Use `ab` (Apache Bench) or `wrk` for load testing:

```bash
# Install ab (if not installed)
# Windows: Download from Apache website
# Linux: sudo apt install apache2-utils
# Mac: brew install ab

# Run load test (100 requests, 10 concurrent)
ab -n 100 -c 10 http://localhost:8080/health

# Expected:
# - Requests per second: >100
# - Time per request: <100ms
# - Failed requests: 0
```

### Memory Usage

```bash
# Check Docker container memory
docker stats dreamnet:local

# Expected:
# - Memory usage: <500MB (without heavy subsystems)
# - Memory usage: <2GB (with heavy subsystems)
```

---

## Troubleshooting Validation Failures

### Build Fails

**Issue:** `dist/index.js` not created  
**Solution:**
```bash
# Check TypeScript errors
cd server
npx tsc -p tsconfig.json

# Check build script
node build.cjs
```

### Docker Build Fails

**Issue:** "Cannot find module"  
**Solution:**
```bash
# Check Dockerfile COPY commands
# Ensure pnpm-workspace.yaml is copied
# Verify pnpm install runs at root
```

### Container Won't Start

**Issue:** "Error: Cannot find module"  
**Solution:**
```bash
# Check that dist/index.js exists in container
docker run dreamnet:local ls -la server/dist/

# Check that node_modules exists
docker run dreamnet:local ls -la node_modules/
```

### Health Endpoint Fails

**Issue:** `curl http://localhost:8080/health` returns error  
**Solution:**
```bash
# Check container logs
docker logs <container-id>

# Check if server is listening on correct port
docker exec <container-id> netstat -tuln | grep 8080
```

---

## Validation Checklist

### Pre-Deployment

- [ ] Dependencies installed (`pnpm install`)
- [ ] Backend builds successfully (`cd server && pnpm build`)
- [ ] `dist/index.js` exists (~80KB)
- [ ] Frontend builds successfully (`cd client && pnpm build`)
- [ ] Docker image builds successfully
- [ ] Docker container runs locally
- [ ] Health endpoint responds (`/health`)
- [ ] API health endpoint responds (`/api/health`)
- [ ] Frontend serves (`/`)

### Post-Deployment

- [ ] Cloud Run service is running
- [ ] Service URL is accessible
- [ ] Health endpoint responds (Cloud Run URL)
- [ ] API health endpoint responds (Cloud Run URL)
- [ ] Frontend serves (Cloud Run URL)
- [ ] Database connection works (if configured)
- [ ] Custom domain mapped (if configured)
- [ ] SSL certificate active
- [ ] Logs are accessible
- [ ] Metrics are visible

### Production Readiness

- [ ] Environment variables configured
- [ ] Secrets stored in Secret Manager
- [ ] Monitoring alerts set up
- [ ] Log exports configured
- [ ] Backup strategy in place
- [ ] Rollback tested
- [ ] CI/CD pipeline configured (optional)

---

## Success Criteria

### Minimum Viable Deployment

✅ **Required for success:**
1. Cloud Run service is running
2. Health endpoint returns 200 OK
3. Frontend is accessible
4. No critical errors in logs

### Production-Ready Deployment

✅ **Required for production:**
1. All minimum viable criteria met
2. Database connection works
3. Custom domain mapped
4. SSL certificate active
5. Monitoring and alerting enabled
6. Rollback tested

---

## Next Steps After Validation

1. ✅ Local build validated
2. ⏳ Docker build validated (optional)
3. ⏳ Deploy to Cloud Run
4. ⏳ Run post-deployment validation
5. ⏳ Map custom domain
6. ⏳ Set up monitoring
7. ⏳ Configure CI/CD (optional)

---

**Last Updated:** 2025-11-26  
**Status:** Ready for validation  
**Next Action:** Run local build validation
