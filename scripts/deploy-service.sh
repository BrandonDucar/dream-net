#!/usr/bin/env bash
set -euo pipefail

SERVICE_NAME="${1:-}"
ENVIRONMENT="${2:-prod}" # prod | staging

if [ -z "$SERVICE_NAME" ]; then
  echo "Usage: $0 <service-name> [prod|staging]"
  exit 1
fi

PROJECT_ID="dreamnet-main"
REGION="us-central1"

# Map environment to Cloud Run service suffix
if [ "$ENVIRONMENT" = "prod" ]; then
  SERVICE_ID="$SERVICE_NAME"
else
  SERVICE_ID="${SERVICE_NAME}-staging"
fi

# Optional: map env file
ENV_FILE=".env.${ENVIRONMENT}"

echo "Deploying service '$SERVICE_NAME' as '$SERVICE_ID' to project '$PROJECT_ID' in '$REGION'..."

gcloud config set project "$PROJECT_ID"

EXTRA_ENV_FLAGS=""
if [ -f "$ENV_FILE" ]; then
  echo "Loading env vars from $ENV_FILE"
  # Turn KEY=VALUE lines into --set-env-vars KEY=VALUE,KEY2=VALUE2
  ENV_VARS=$(grep -v '^\s*#' "$ENV_FILE" | grep -v '^\s*$' | paste -sd, -)
  EXTRA_ENV_FLAGS="--set-env-vars=$ENV_VARS"
fi

gcloud run deploy "$SERVICE_ID" \
  --source "services/$SERVICE_NAME" \
  --region "$REGION" \
  --allow-unauthenticated \
  $EXTRA_ENV_FLAGS

