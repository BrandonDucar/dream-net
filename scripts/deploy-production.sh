#!/bin/bash
# DreamNet Production Deployment Script
# Deploys to Google Cloud Run with real APIs

set -e  # Exit on error

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 DreamNet Production Deployment${NC}"
echo ""

# Check if gcloud is installed
if ! command -v gcloud &> /dev/null; then
    echo -e "${RED}❌ gcloud CLI not found. Install from: https://cloud.google.com/sdk/docs/install${NC}"
    exit 1
fi

# Get project ID
PROJECT_ID=${GCP_PROJECT_ID:-$(gcloud config get-value project 2>/dev/null)}
if [ -z "$PROJECT_ID" ]; then
    echo -e "${YELLOW}⚠️  GCP_PROJECT_ID not set.${NC}"
    read -p "Enter your GCP Project ID: " PROJECT_ID
    export GCP_PROJECT_ID=$PROJECT_ID
    gcloud config set project $PROJECT_ID
fi

REGION=${GCP_REGION:-us-central1}
SERVICE_NAME=${GCP_SERVICE_NAME:-dreamnet}
ARTIFACT_REPO=${ARTIFACT_REGISTRY_REPO:-dreamnet-repo}

echo -e "${GREEN}✅ Using GCP Project: ${PROJECT_ID}${NC}"
echo -e "${GREEN}✅ Region: ${REGION}${NC}"
echo -e "${GREEN}✅ Service Name: ${SERVICE_NAME}${NC}"
echo ""

# Step 1: Enable required APIs
echo -e "${BLUE}📦 Enabling required Google Cloud APIs...${NC}"
gcloud services enable cloudbuild.googleapis.com --project=$PROJECT_ID
gcloud services enable run.googleapis.com --project=$PROJECT_ID
gcloud services enable artifactregistry.googleapis.com --project=$PROJECT_ID
gcloud services enable secretmanager.googleapis.com --project=$PROJECT_ID
echo -e "${GREEN}✅ APIs enabled${NC}"
echo ""

# Step 2: Create Artifact Registry (if doesn't exist)
echo -e "${BLUE}🐳 Creating Artifact Registry repository...${NC}"
if ! gcloud artifacts repositories describe $ARTIFACT_REPO --location=$REGION --project=$PROJECT_ID &>/dev/null; then
    gcloud artifacts repositories create $ARTIFACT_REPO \
        --repository-format=docker \
        --location=$REGION \
        --description="DreamNet Docker images" \
        --project=$PROJECT_ID
    echo -e "${GREEN}✅ Artifact Registry created${NC}"
else
    echo -e "${YELLOW}⚠️  Artifact Registry already exists${NC}"
fi
echo ""

# Step 3: Check for secrets
echo -e "${BLUE}🔐 Checking required secrets...${NC}"
REQUIRED_SECRETS=(
    "database-url"
    "session-secret"
)

OPTIONAL_SECRETS=(
    "openai-api-key"
    "anthropic-api-key"
    "twilio-account-sid"
    "twilio-auth-token"
    "twilio-phone-number"
    "dreamnet-voice-recipient"
    "base-mainnet-rpc-url"
    "base-scan-api-key"
    "vercel-token"
    "stripe-secret-key"
)

MISSING_SECRETS=()

for secret in "${REQUIRED_SECRETS[@]}"; do
    if ! gcloud secrets describe $secret --project=$PROJECT_ID &>/dev/null; then
        MISSING_SECRETS+=($secret)
        echo -e "${RED}❌ Missing required secret: $secret${NC}"
    else
        echo -e "${GREEN}✅ Secret exists: $secret${NC}"
    fi
done

for secret in "${OPTIONAL_SECRETS[@]}"; do
    if gcloud secrets describe $secret --project=$PROJECT_ID &>/dev/null; then
        echo -e "${GREEN}✅ Secret exists: $secret${NC}"
    else
        echo -e "${YELLOW}⚠️  Optional secret not found: $secret${NC}"
    fi
done

if [ ${#MISSING_SECRETS[@]} -gt 0 ]; then
    echo ""
    echo -e "${YELLOW}⚠️  Missing required secrets. Create them with:${NC}"
    echo "  gcloud secrets create <secret-name> --data-file=- <<< \"<value>\""
    echo ""
    read -p "Continue anyway? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi
echo ""

# Step 4: Build secrets list for deployment
SECRETS_ARGS=""
for secret in "${REQUIRED_SECRETS[@]}" "${OPTIONAL_SECRETS[@]}"; do
    if gcloud secrets describe $secret --project=$PROJECT_ID &>/dev/null; then
        UPPER_SECRET=$(echo $secret | tr '[:lower:]' '[:upper:]' | tr '-' '_')
        SECRETS_ARGS="$SECRETS_ARGS --set-secrets $UPPER_SECRET=$secret:latest"
    fi
done

# Step 5: Build and deploy
echo -e "${BLUE}🏗️  Building and deploying to Cloud Run...${NC}"
echo ""

# Use Cloud Build
gcloud builds submit --config cloudbuild.yaml \
    --substitutions=_REGION=$REGION,_SERVICE_NAME=$SERVICE_NAME,_ARTIFACT_REGISTRY_REPO=$ARTIFACT_REPO,_MEMORY=2Gi,_CPU=2,_TIMEOUT=300s,_MAX_INSTANCES=10,_MIN_INSTANCES=0 \
    --project=$PROJECT_ID

echo ""
echo -e "${GREEN}✅ Build complete!${NC}"
echo ""

# Step 6: Update Cloud Run service with secrets
echo -e "${BLUE}🔐 Updating Cloud Run service with secrets...${NC}"
gcloud run services update $SERVICE_NAME \
    --region=$REGION \
    --project=$PROJECT_ID \
    $SECRETS_ARGS

echo ""
echo -e "${GREEN}✅ Service updated with secrets${NC}"
echo ""

# Step 7: Get service URL
SERVICE_URL=$(gcloud run services describe $SERVICE_NAME --region=$REGION --project=$PROJECT_ID --format='value(status.url)')
echo -e "${GREEN}🎉 Deployment complete!${NC}"
echo ""
echo -e "${BLUE}Service URL: ${SERVICE_URL}${NC}"
echo ""

# Step 8: Test deployment
echo -e "${BLUE}🧪 Testing deployment...${NC}"
if curl -f -s "$SERVICE_URL/health" > /dev/null; then
    echo -e "${GREEN}✅ Health check passed${NC}"
else
    echo -e "${RED}❌ Health check failed${NC}"
    echo "View logs with: gcloud run services logs read $SERVICE_NAME --region=$REGION"
fi

echo ""
echo -e "${GREEN}📝 Next Steps:${NC}"
echo "1. Point DNS for dreamnet.ink to this service"
echo "2. Map custom domain in Cloud Run console"
echo "3. Monitor logs: gcloud run services logs read $SERVICE_NAME --region=$REGION --follow"
echo ""
echo -e "${GREEN}✅ Production deployment complete!${NC}"

