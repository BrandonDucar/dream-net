# 💓 Heartbeat & Keep-Alive Guide

## Understanding the Difference

### ❌ **Heartbeat is NOT for keeping services alive**

**Heartbeat** = **Monitoring & Reporting**
- Checks health of all services
- Generates Sunrise Reports
- Sends alerts if services are down
- **Does NOT prevent shutdown**

### ✅ **Cloud Run Configuration keeps services alive**

**Keep-Alive** = **Cloud Run Settings**
- `minInstances > 0` prevents scale-to-zero
- Traffic keeps instances warm
- Health checks keep instances running
- **This is what prevents shutdown**

---

## 🔧 How to Keep DreamNet Active

### **Option 1: Set minInstances (Recommended)**

This prevents Cloud Run from scaling to zero:

```powershell
.\scripts\configure-cloud-run-keepalive.ps1
```

**What this does:**
- Sets `minInstances=1` (always at least 1 instance running)
- Sets `maxInstances=10` (can scale up to 10)
- Configures CPU/memory/timeout

**Cost:** ~$10-30/month per instance (but DreamNet never shuts down)

---

### **Option 2: Keep-Alive Pings (Free but less reliable)**

Use Cloud Scheduler to ping the service every 5 minutes:

```bash
chmod +x scripts/setup-heartbeat-scheduler.sh
./scripts/setup-heartbeat-scheduler.sh
```

**What this does:**
- Creates Cloud Scheduler job that pings `/healthz` every 5 minutes
- Keeps instances warm through traffic
- **Free** but instances can still scale to zero between pings

---

## 📅 Scheduling Heartbeat (Monitoring)

### **Option 1: Google Cloud Scheduler (Recommended)**

```bash
chmod +x scripts/setup-heartbeat-scheduler.sh
./scripts/setup-heartbeat-scheduler.sh
```

**Creates two jobs:**
1. **dreamnet-heartbeat** - Nightly at 03:00 UTC (monitoring)
2. **dreamnet-keepalive** - Every 5 minutes (keep-alive pings)

### **Option 2: GitHub Actions (Already configured)**

Already set up in `.github/workflows/heartbeat.yml`:
- Runs nightly at 03:00 UTC
- Generates Sunrise Report
- Sends to console/logs

### **Option 3: Vercel Cron (If using Vercel)**

Already configured in `vercel.json`:
- Runs nightly at 03:00 UTC
- Calls `/api/heartbeat-cron`

---

## 🎯 Recommended Setup

### **For Production (Always On):**

1. **Set minInstances:**
   ```powershell
   .\scripts\configure-cloud-run-keepalive.ps1
   ```

2. **Schedule Heartbeat:**
   ```bash
   ./scripts/setup-heartbeat-scheduler.sh
   ```

3. **Result:**
   - ✅ Services never shut down (minInstances=1)
   - ✅ Heartbeat runs nightly (monitoring)
   - ✅ Keep-alive pings every 5 minutes (extra safety)

### **For Development (Cost-Saving):**

1. **Use keep-alive pings only:**
   ```bash
   ./scripts/setup-heartbeat-scheduler.sh
   ```

2. **Result:**
   - ✅ Services stay warm (through pings)
   - ✅ Heartbeat runs nightly (monitoring)
   - ⚠️ May scale to zero if no traffic for 15+ minutes

---

## 📊 What Heartbeat Does

### **Nightly Heartbeat (03:00 UTC):**

1. **Pings all services:**
   - dream-hub
   - dream-snipe
   - dream-shop
   - dream-vault
   - dream-keeper
   - web
   - api
   - agents

2. **Collects KPIs:**
   - new_users_24h
   - events_24h
   - errors_24h
   - last_block

3. **Generates Sunrise Report:**
   - Plain text report
   - Service status
   - Health metrics
   - Alerts if any service is down

4. **Sends alerts** (if configured):
   - Telegram
   - Discord
   - Email

### **Access Reports:**

- **API:** `GET /api/sunrise-report`
- **Text:** `GET /api/sunrise-report/text`
- **UI:** Component at `/sunrise-report` (if added to frontend)

---

## 🚨 Troubleshooting

### **Service keeps shutting down:**

**Problem:** Cloud Run scaling to zero

**Solution:**
```powershell
.\scripts\configure-cloud-run-keepalive.ps1 -MinInstances 1
```

### **Heartbeat not running:**

**Problem:** Cron job not configured

**Solution:**
```bash
./scripts/setup-heartbeat-scheduler.sh
```

### **Check current configuration:**

```bash
gcloud run services describe dreamnet \
  --region=us-central1 \
  --format="value(spec.template.metadata.annotations['autoscaling.knative.dev/minScale'])"
```

---

## 💰 Cost Considerations

### **minInstances=1:**
- **Cost:** ~$10-30/month per instance
- **Benefit:** Always on, instant response
- **Best for:** Production, critical services

### **minInstances=0 (with keep-alive pings):**
- **Cost:** ~$0-5/month (only when active)
- **Benefit:** Cost-effective
- **Trade-off:** Cold starts possible (5-10 seconds)

---

## ✅ Quick Setup Commands

```powershell
# 1. Keep services alive (prevent shutdown)
.\scripts\configure-cloud-run-keepalive.ps1

# 2. Schedule heartbeat (monitoring)
bash scripts/setup-heartbeat-scheduler.sh

# 3. Verify
gcloud scheduler jobs list --location=us-central1
gcloud run services describe dreamnet --region=us-central1
```

---

**Summary:**
- **Heartbeat** = Monitoring (doesn't prevent shutdown)
- **minInstances > 0** = Prevents shutdown (keeps services alive)
- **Keep-alive pings** = Extra safety (keeps instances warm)

