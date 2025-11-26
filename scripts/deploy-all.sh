#!/usr/bin/env bash
set -euo pipefail

ENVIRONMENT="${1:-prod}" # prod | staging

SERVICES=(
  "web"
  "api"
  "agents"
  "dreamkeeper"
)

for svc in "${SERVICES[@]}"; do
  echo "==============================="
  echo "Deploying $svc ($ENVIRONMENT)..."
  echo "==============================="
  ./scripts/deploy-service.sh "$svc" "$ENVIRONMENT"
done

