#!/bin/bash
# Setup Google Cloud deployment for DreamNet
# Project: dreamnet-62b49 (857935117713)

set -e

PROJECT_ID="dreamnet-62b49"
PROJECT_NUMBER="857935117713"

echo "🚀 Setting up Google Cloud deployment..."
echo "📊 Project: $PROJECT_ID ($PROJECT_NUMBER)"

# Set project
gcloud config set project "$PROJECT_ID"

# Enable required APIs
echo "🔧 Enabling required APIs..."
gcloud services enable cloudbuild.googleapis.com
gcloud services enable run.googleapis.com
gcloud services enable containerregistry.googleapis.com
gcloud services enable firebase.googleapis.com

# Check if Firebase is configured
if [ -f "firebase.json" ]; then
  echo "✅ Firebase configuration found"
  
  # Try to use Firebase
  if command -v firebase &> /dev/null; then
    echo "🔍 Checking Firebase projects..."
    firebase projects:list || echo "⚠️  Firebase CLI not authenticated"
  fi
fi

echo ""
echo "✅ Google Cloud setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Authenticate: gcloud auth login"
echo "2. Or use service account: gcloud auth activate-service-account"
echo "3. Deploy: bash scripts/deploy-google-cloud.sh"
echo ""
echo "💡 Your project: $PROJECT_ID ($PROJECT_NUMBER)"
echo "💰 Credits: $1,300 available"

