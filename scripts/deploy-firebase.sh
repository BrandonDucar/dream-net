#!/bin/bash
# Deploy DreamNet to Firebase Hosting
# Uses your existing Firebase project

set -e

# Check Firebase auth
if ! firebase projects:list &> /dev/null; then
  echo "❌ ERROR: Not authenticated to Firebase"
  echo "Run: firebase login"
  exit 1
fi

echo "🔥 Deploying to Firebase Hosting..."

# Get current project
CURRENT_PROJECT=$(firebase use 2>&1 | grep -oP '(?<=\()[^)]+' || echo "")

if [ -z "$CURRENT_PROJECT" ]; then
  echo "⚠️  No Firebase project selected"
  echo "Available projects:"
  firebase projects:list
  
  echo ""
  read -p "Enter project ID to use: " PROJECT_ID
  firebase use "$PROJECT_ID"
else
  echo "📊 Using project: $CURRENT_PROJECT"
fi

# Build frontend first
echo "🏗️  Building frontend..."
cd client
pnpm build
cd ..

# Deploy to Firebase Hosting
echo "🚀 Deploying to Firebase..."
firebase deploy --only hosting

echo ""
echo "✅ Deployment complete!"
echo "🌐 Your app should be live at: https://$CURRENT_PROJECT.web.app"
echo "💡 Or check Firebase Console for exact URL"

