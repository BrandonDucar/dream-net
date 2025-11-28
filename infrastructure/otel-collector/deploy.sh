#!/bin/bash
# Deploy OpenTelemetry Collector to Cloud Run

set -euo pipefail

PROJECT_ID=${GCP_PROJECT_ID:-dreamnet-62b49}
REGION=${GCP_REGION:-us-central1}
SERVICE_NAME=otel-collector

echo "Deploying OpenTelemetry Collector to Cloud Run..."

gcloud builds submit --tag gcr.io/${PROJECT_ID}/${SERVICE_NAME} .

gcloud run deploy ${SERVICE_NAME} \
  --image gcr.io/${PROJECT_ID}/${SERVICE_NAME} \
  --platform managed \
  --region ${REGION} \
  --allow-unauthenticated \
  --port 4317 \
  --set-env-vars GCP_PROJECT_ID=${PROJECT_ID} \
  --memory 512Mi \
  --cpu 1

echo "✅ OpenTelemetry Collector deployed"
echo "OTLP endpoint: https://${SERVICE_NAME}-${REGION}-${PROJECT_ID}.a.run.app"

