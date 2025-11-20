#!/bin/bash
# Promote Latest Vercel Deployment via CLI

echo "🚀 Promoting Latest Vercel Deployment"
echo "===================================="
echo ""

# Check if vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "📦 Installing Vercel CLI..."
    npm install -g vercel
fi

# Get project info
echo "📦 Getting project info..."
PROJECT_NAME=$(vercel ls --json 2>/dev/null | jq -r '.[0].name' 2>/dev/null || echo "")

if [ -z "$PROJECT_NAME" ]; then
    echo "❌ Could not find project. Linking..."
    vercel link
    PROJECT_NAME=$(vercel ls --json 2>/dev/null | jq -r '.[0].name' 2>/dev/null || echo "")
fi

echo "✅ Project: $PROJECT_NAME"
echo ""

# Get latest deployment
echo "📋 Getting latest deployment..."
LATEST_URL=$(vercel ls --json 2>/dev/null | jq -r '.[0].url' 2>/dev/null || echo "")

if [ -z "$LATEST_URL" ]; then
    echo "❌ Could not get deployments"
    exit 1
fi

echo "✅ Latest deployment: $LATEST_URL"
echo ""

# Promote to production
echo "🚀 Promoting to production..."
vercel promote "$LATEST_URL" --yes

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Successfully promoted to production!"
    echo "💡 Wait 1-2 minutes for DNS propagation"
    echo "🌐 Test: https://dreamnet.ink"
else
    echo ""
    echo "❌ Failed to promote"
    echo "💡 Try manually: vercel promote <deployment-url>"
fi

