#!/usr/bin/env bash
# Setup Google Cloud Scheduler for Heartbeat
# This schedules the heartbeat to run nightly and also acts as a keep-alive

set -euo pipefail

PROJECT_ID="${GCP_PROJECT_ID:-dreamnet-main}"
REGION="${GCP_REGION:-us-central1}"
SERVICE_URL="${DREAMNET_URL:-https://dreamnet-xxxxx-uc.a.run.app}"

echo "🔧 Setting up Heartbeat Scheduler for DreamNet..."

# Create Cloud Scheduler job for nightly heartbeat
gcloud scheduler jobs create http dreamnet-heartbeat \
  --project="$PROJECT_ID" \
  --location="$REGION" \
  --schedule="0 3 * * *" \
  --uri="${SERVICE_URL}/api/heartbeat-cron" \
  --http-method=GET \
  --time-zone="UTC" \
  --description="Nightly DreamNet heartbeat and Sunrise Report" \
  || echo "Job may already exist, continuing..."

# Create Cloud Scheduler job for keep-alive (every 5 minutes)
# This pings the health endpoint to keep Cloud Run instances warm
gcloud scheduler jobs create http dreamnet-keepalive \
  --project="$PROJECT_ID" \
  --location="$REGION" \
  --schedule="*/5 * * * *" \
  --uri="${SERVICE_URL}/healthz" \
  --http-method=GET \
  --time-zone="UTC" \
  --description="Keep-alive ping to prevent Cloud Run scale-to-zero" \
  || echo "Keep-alive job may already exist, continuing..."

echo "✅ Heartbeat scheduler configured!"
echo ""
echo "Jobs created:"
echo "  - dreamnet-heartbeat (nightly at 03:00 UTC)"
echo "  - dreamnet-keepalive (every 5 minutes)"
echo ""
echo "To view jobs:"
echo "  gcloud scheduler jobs list --project=$PROJECT_ID --location=$REGION"

