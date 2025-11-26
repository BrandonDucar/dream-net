#!/bin/bash
# Setup Google Cloud Run Custom Domain
# Usage: ./scripts/setup-google-domain.sh <domain-name> <service-name> <region>

set -e

DOMAIN=$1
SERVICE_NAME=${2:-dreamnet}
REGION=${3:-us-central1}

if [ -z "$DOMAIN" ]; then
  echo "❌ Error: Domain name required"
  echo "Usage: $0 <domain-name> [service-name] [region]"
  echo "Example: $0 dreamnet.app dreamnet us-central1"
  exit 1
fi

echo "🌐 Setting up custom domain: $DOMAIN"
echo "📦 Service: $SERVICE_NAME"
echo "📍 Region: $REGION"
echo ""

# Check if domain mapping already exists
if gcloud run domain-mappings describe --domain="$DOMAIN" --region="$REGION" &>/dev/null; then
  echo "⚠️  Domain mapping already exists for $DOMAIN"
  echo "📋 Current DNS records:"
  gcloud run domain-mappings describe --domain="$DOMAIN" --region="$REGION" --format="value(status.resourceRecords)"
  exit 0
fi

# Create domain mapping
echo "🔗 Creating domain mapping..."
gcloud run domain-mappings create \
  --service="$SERVICE_NAME" \
  --domain="$DOMAIN" \
  --region="$REGION"

echo ""
echo "✅ Domain mapping created!"
echo ""
echo "📋 Add these DNS records to your domain registrar:"
echo ""

# Get DNS records
gcloud run domain-mappings describe \
  --domain="$DOMAIN" \
  --region="$REGION" \
  --format="table(status.resourceRecords.type,status.resourceRecords.name,status.resourceRecords.rrdata)"

echo ""
echo "⏳ After adding DNS records, wait 5-60 minutes for propagation"
echo "🔒 SSL certificate will be automatically provisioned (takes ~10 minutes)"
echo ""
echo "✅ Verify with: gcloud run domain-mappings describe --domain=$DOMAIN --region=$REGION"

