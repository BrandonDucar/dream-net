#!/bin/bash
# Deploy DreamNet to Google Cloud Run
# Uses your Google Cloud credits

set -e

# Check for required env vars
if [ -z "$GCP_PROJECT_ID" ]; then
  echo "❌ ERROR: GCP_PROJECT_ID not set"
  echo "Set it with: export GCP_PROJECT_ID=your-project-id"
  exit 1
fi

if [ -z "$GOOGLE_APPLICATION_CREDENTIALS" ] && [ -z "$FIREBASE_TOKEN" ]; then
  echo "❌ ERROR: No Google Cloud credentials found"
  echo "Set GOOGLE_APPLICATION_CREDENTIALS or FIREBASE_TOKEN"
  exit 1
fi

echo "🚀 Deploying DreamNet to Google Cloud Run..."
echo "📊 Project: $GCP_PROJECT_ID"

# Authenticate
if [ -n "$GOOGLE_APPLICATION_CREDENTIALS" ]; then
  echo "🔐 Using service account credentials"
  gcloud auth activate-service-account --key-file="$GOOGLE_APPLICATION_CREDENTIALS"
elif [ -n "$FIREBASE_TOKEN" ]; then
  echo "🔐 Using Firebase token"
  echo "$FIREBASE_TOKEN" | firebase login:ci
fi

# Set project
gcloud config set project "$GCP_PROJECT_ID"

# Enable required APIs
echo "🔧 Enabling required APIs..."
gcloud services enable cloudbuild.googleapis.com
gcloud services enable run.googleapis.com
gcloud services enable containerregistry.googleapis.com

# Build and deploy using Cloud Build
echo "🏗️ Building and deploying..."
gcloud builds submit --config cloudbuild.yaml

echo "✅ Deployment complete!"
echo "🌐 Your app should be live at: https://dreamnet-XXXXX.run.app"
echo "💡 Check Cloud Run console for the exact URL"

