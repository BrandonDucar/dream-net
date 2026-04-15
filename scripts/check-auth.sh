#!/bin/bash
# Check if you're authenticated to Google Cloud and AWS

echo "🔍 Checking Authentication Status...\n"

# Check Google Cloud
echo "🔵 Google Cloud:"
if command -v gcloud &> /dev/null; then
  echo "  ✅ gcloud CLI installed"
  if gcloud auth list --filter=status:ACTIVE --format="value(account)" &> /dev/null; then
    ACTIVE_ACCOUNT=$(gcloud auth list --filter=status:ACTIVE --format="value(account)" | head -n 1)
    echo "  ✅ Authenticated as: $ACTIVE_ACCOUNT"
    PROJECT=$(gcloud config get-value project 2>/dev/null)
    if [ -n "$PROJECT" ]; then
      echo "  ✅ Project: $PROJECT"
    else
      echo "  ⚠️  No project set"
    fi
  else
    echo "  ❌ Not authenticated"
    echo "  💡 Run: gcloud auth login"
  fi
else
  echo "  ❌ gcloud CLI not installed"
  echo "  💡 Install: https://cloud.google.com/sdk/docs/install"
fi

# Check Firebase
echo ""
echo "🔥 Firebase:"
if command -v firebase &> /dev/null; then
  echo "  ✅ Firebase CLI installed"
  if firebase projects:list &> /dev/null; then
    echo "  ✅ Authenticated"
    firebase projects:list 2>/dev/null | grep -q "dreamnet-62b49" && echo "  ✅ Project dreamnet-62b49 found"
  else
    echo "  ❌ Not authenticated"
    echo "  💡 Run: firebase login"
  fi
else
  echo "  ❌ Firebase CLI not installed"
  echo "  💡 Install: npm install -g firebase-tools"
fi

# Check AWS
echo ""
echo "🟠 AWS:"
if command -v aws &> /dev/null; then
  echo "  ✅ AWS CLI installed"
  if aws sts get-caller-identity &> /dev/null; then
    ACCOUNT=$(aws sts get-caller-identity --query Account --output text 2>/dev/null)
    if [ -n "$ACCOUNT" ]; then
      echo "  ✅ Authenticated"
      echo "  ✅ Account: $ACCOUNT"
      if [ "$ACCOUNT" = "001092882186" ]; then
        echo "  ✅ Correct AWS account!"
      fi
    else
      echo "  ❌ Not authenticated"
      echo "  💡 Run: aws configure"
    fi
  else
    echo "  ❌ Not authenticated"
    echo "  💡 Run: aws configure"
  fi
else
  echo "  ❌ AWS CLI not installed"
  echo "  💡 Install: https://awscli.amazonaws.com/AWSCLIV2.msi"
fi

echo ""
echo "📋 Summary:"
echo "  Run the commands above to authenticate, then I can deploy!"

