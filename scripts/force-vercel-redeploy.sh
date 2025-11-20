#!/bin/bash
# Force Vercel Fresh Deployment
# Clears cache and triggers new build

echo "🚀 Forcing fresh Vercel deployment..."
echo ""

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "📦 Installing Vercel CLI..."
    npm install -g vercel
fi

# Force production deployment with no cache
echo "🔄 Deploying to production (cache disabled)..."
vercel --prod --force --yes

echo ""
echo "✅ Deployment triggered!"
echo "📊 Check status at: https://vercel.com/dashboard"
echo "🌐 Site will be live at: https://dreamnet.ink"

