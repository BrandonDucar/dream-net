#!/bin/bash
# DreamNet Production Deployment Script
# Deploys to Vercel (frontend) and Google Cloud Run (backend)

set -e

echo "🌿 DreamNet Production Deployment"
echo "=================================="
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Configuration
PROJECT_NAME="dreamnet"
GCP_PROJECT_ID="${GCP_PROJECT_ID:-dreamnet-62b49}"
GCP_REGION="${GCP_REGION:-us-central1}"
IMAGE_NAME="gcr.io/${GCP_PROJECT_ID}/${PROJECT_NAME}:latest"

# Step 1: Build
echo -e "${GREEN}Step 1: Building application...${NC}"
echo ""

echo "📦 Installing dependencies..."
pnpm install --frozen-lockfile

echo ""
echo "🎨 Building frontend..."
pnpm --filter client build

echo ""
echo "⚙️  Building backend..."
pnpm --filter server build

echo ""
echo -e "${GREEN}✅ Build complete!${NC}"
echo ""

# Step 2: Deploy Frontend (Vercel)
echo -e "${GREEN}Step 2: Deploying frontend to Vercel...${NC}"
echo ""

if command -v vercel &> /dev/null; then
    echo "🚀 Deploying to Vercel..."
    cd client
    vercel --prod
    cd ..
    echo -e "${GREEN}✅ Frontend deployed!${NC}"
else
    echo -e "${YELLOW}⚠️  Vercel CLI not found. Install with: npm install -g vercel${NC}"
    echo "   Or deploy via Vercel Dashboard: https://vercel.com/new"
fi

echo ""

# Step 3: Build Docker Image
echo -e "${GREEN}Step 3: Building Docker image...${NC}"
echo ""

if command -v docker &> /dev/null; then
    echo "🐳 Building Docker image..."
    docker build -t "${IMAGE_NAME}" .
    
    echo ""
    echo "📤 Pushing to Google Container Registry..."
    docker push "${IMAGE_NAME}"
    
    echo -e "${GREEN}✅ Docker image pushed!${NC}"
else
    echo -e "${YELLOW}⚠️  Docker not found. Install Docker Desktop${NC}"
    echo "   Or build manually: docker build -t ${IMAGE_NAME} ."
fi

echo ""

# Step 4: Deploy Backend (Google Cloud Run)
echo -e "${GREEN}Step 4: Deploying backend to Google Cloud Run...${NC}"
echo ""

if command -v gcloud &> /dev/null; then
    echo "🚀 Deploying to Cloud Run..."
    gcloud run deploy dreamnet-api \
        --image "${IMAGE_NAME}" \
        --platform managed \
        --region "${GCP_REGION}" \
        --allow-unauthenticated \
        --memory 1Gi \
        --cpu 1 \
        --min-instances 1 \
        --max-instances 10 \
        --set-env-vars "NODE_ENV=production,PORT=8080" \
        --project "${GCP_PROJECT_ID}"
    
    echo -e "${GREEN}✅ Backend deployed!${NC}"
else
    echo -e "${YELLOW}⚠️  gcloud CLI not found. Install Google Cloud SDK${NC}"
    echo "   Or deploy via API: POST /api/google-cloud/run/deploy"
fi

echo ""
echo "=================================="
echo -e "${GREEN}✅ Production deployment complete!${NC}"
echo ""
echo "📝 Next Steps:"
echo "1. Configure environment variables in deployment platforms"
echo "2. Set up custom domains (dreamnet.ink, api.dreamnet.ink)"
echo "3. Verify deployments: curl https://dreamnet.ink"
echo "4. Test API: curl https://api.dreamnet.ink/api/health"
echo ""

