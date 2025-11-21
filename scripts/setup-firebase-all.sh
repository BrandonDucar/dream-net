#!/bin/bash
# Setup Firebase Hosting for All Domains
# Deploys DreamNet Hub + Mini-Apps to Firebase

set -e

echo "🔥 Firebase Hosting Setup for DreamNet"
echo "======================================="
echo ""

# Check Firebase auth
if ! firebase projects:list &> /dev/null; then
  echo "❌ ERROR: Not authenticated to Firebase"
  echo "Run: firebase login"
  exit 1
fi

# Get current project
CURRENT_PROJECT=$(firebase use 2>&1 | grep -oP '(?<=\()[^)]+' || echo "")

if [ -z "$CURRENT_PROJECT" ]; then
  echo "⚠️  No Firebase project selected"
  echo "Available projects:"
  firebase projects:list
  
  echo ""
  read -p "Enter project ID to use (or press Enter for aqueous-tube-470317-m6): " PROJECT_ID
  PROJECT_ID="${PROJECT_ID:-aqueous-tube-470317-m6}"
  firebase use "$PROJECT_ID"
else
  echo "📊 Using project: $CURRENT_PROJECT"
  PROJECT_ID="$CURRENT_PROJECT"
fi

# Build frontend
echo ""
echo "🏗️  Building frontend..."
cd client
pnpm install
pnpm build
cd ..

# Check if firebase.json exists
if [ ! -f "firebase.json" ]; then
  echo "📝 Creating firebase.json..."
  cat > firebase.json << EOF
{
  "hosting": {
    "public": "client/dist",
    "headers": [
      { "source": "**/*.@(js|css)", "headers": [
        { "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }
      ]},
      { "source": "/index.html", "headers": [
        { "key": "Cache-Control", "value": "no-cache" }
      ]}
    ],
    "rewrites": [{ "source": "**", "destination": "/index.html" }]
  }
}
EOF
fi

# Deploy
echo ""
echo "🚀 Deploying to Firebase Hosting..."
firebase deploy --only hosting

echo ""
echo "✅ Deployment complete!"
echo ""
echo "🌐 Your app is live at:"
echo "   - https://$PROJECT_ID.web.app"
echo "   - https://$PROJECT_ID.firebaseapp.com"
echo ""
echo "💡 To add custom domains:"
echo "   1. Go to Firebase Console → Hosting → Add custom domain"
echo "   2. Add: dreamnet.live (already configured)"
echo "   3. Add: dadf.org (if you want)"
echo "   4. Follow DNS instructions"
echo ""
echo "📋 Current domains:"
firebase hosting:sites:list 2>/dev/null || echo "   (Check Firebase Console for domains)"

