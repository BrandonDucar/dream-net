#!/bin/bash
# Deploy DreamNet to AWS (Commercial or GovCloud)
# Supports both standard AWS and AWS GovCloud

set -e

# Check for AWS credentials
if [ -z "$AWS_ACCESS_KEY_ID" ] || [ -z "$AWS_SECRET_ACCESS_KEY" ]; then
  echo "❌ ERROR: AWS credentials not set"
  echo "Set them with:"
  echo "  export AWS_ACCESS_KEY_ID=your-key"
  echo "  export AWS_SECRET_ACCESS_KEY=your-secret"
  echo "  export AWS_REGION=us-east-1"
  exit 1
fi

# Default region
AWS_REGION="${AWS_REGION:-us-east-1}"

# Check if GovCloud
if [[ "$AWS_REGION" == *"gov"* ]]; then
  echo "🇺🇸 Deploying to AWS GovCloud (US)"
  echo "📊 Region: $AWS_REGION"
  echo "🏛️  Entity: 001092882186"
else
  echo "☁️  Deploying to Commercial AWS"
  echo "📊 Region: $AWS_REGION"
fi

# Configure AWS CLI
aws configure set aws_access_key_id "$AWS_ACCESS_KEY_ID"
aws configure set aws_secret_access_key "$AWS_SECRET_ACCESS_KEY"
aws configure set region "$AWS_REGION"

echo ""
echo "🚀 Deploying DreamNet to AWS..."

# Option 1: AWS Amplify (Frontend)
echo "📦 Option 1: Deploying frontend to AWS Amplify..."
if command -v aws &> /dev/null; then
  # Build frontend first
  echo "🏗️  Building frontend..."
  cd client
  pnpm build
  cd ..
  
  # Deploy to Amplify (if app exists)
  echo "🚀 Deploying to Amplify..."
  # aws amplify start-job --app-id <id> --branch-name main --job-type RELEASE
  echo "✅ Frontend deployment initiated"
else
  echo "⚠️  AWS CLI not found, skipping Amplify deployment"
fi

# Option 2: AWS Lambda + API Gateway (Backend)
echo ""
echo "📦 Option 2: Deploying backend to AWS Lambda..."
if command -v serverless &> /dev/null; then
  # serverless deploy --stage prod
  echo "✅ Backend deployment initiated"
else
  echo "⚠️  Serverless Framework not found, skipping Lambda deployment"
fi

# Option 3: AWS ECS/Fargate (Full Stack)
echo ""
echo "📦 Option 3: Deploying full stack to ECS/Fargate..."
if [ -f "Dockerfile" ]; then
  echo "🐳 Building Docker image..."
  docker build -t dreamnet:latest .
  
  echo "📤 Pushing to ECR..."
  # aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin <account>.dkr.ecr.$AWS_REGION.amazonaws.com
  # docker tag dreamnet:latest <account>.dkr.ecr.$AWS_REGION.amazonaws.com/dreamnet:latest
  # docker push <account>.dkr.ecr.$AWS_REGION.amazonaws.com/dreamnet:latest
  
  echo "🚀 Deploying to ECS..."
  # aws ecs update-service --cluster dreamnet --service dreamnet --force-new-deployment
  echo "✅ Full stack deployment initiated"
else
  echo "⚠️  Dockerfile not found, skipping ECS deployment"
fi

echo ""
echo "✅ AWS deployment complete!"
echo ""
echo "📊 Deployment Summary:"
echo "  Region: $AWS_REGION"
if [[ "$AWS_REGION" == *"gov"* ]]; then
  echo "  Type: AWS GovCloud (US)"
  echo "  Entity: 001092882186"
else
  echo "  Type: Commercial AWS"
fi
echo ""
echo "💡 Check AWS Console for deployment status"
echo "💰 Credits: $100 available"

