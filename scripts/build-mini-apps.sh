#!/bin/bash
# 🚀 DreamNet Mini-App Builder
# Quick script to scaffold new mini-apps

set -e

MINI_APP_NAME=$1

if [ -z "$MINI_APP_NAME" ]; then
  echo "Usage: ./scripts/build-mini-apps.sh <mini-app-name>"
  echo "Example: ./scripts/build-mini-apps.sh dreamnet-status"
  exit 1
fi

echo "🚀 Building mini-app: $MINI_APP_NAME"

# Create directory structure
mkdir -p "mini-apps/$MINI_APP_NAME/frontend"
mkdir -p "mini-apps/$MINI_APP_NAME/contracts"
mkdir -p "mini-apps/$MINI_APP_NAME/api"

# Create frontend package.json
cat > "mini-apps/$MINI_APP_NAME/frontend/package.json" << EOF
{
  "name": "@dreamnet/$MINI_APP_NAME-frontend",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "@vitejs/plugin-react": "^4.2.0",
    "typescript": "^5.9.3",
    "vite": "^5.0.0"
  }
}
EOF

# Create vite config
cat > "mini-apps/$MINI_APP_NAME/frontend/vite.config.ts" << EOF
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3001,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
});
EOF

# Create README
cat > "mini-apps/$MINI_APP_NAME/README.md" << EOF
# $MINI_APP_NAME

DreamNet Mini-App

## Development

\`\`\`bash
cd frontend
pnpm install
pnpm dev
\`\`\`

## Deployment

Deploy to Vercel or Cloud Run.

## API Integration

This mini-app integrates with DreamNet APIs:
- \`/api/brain/query\` - Query Super Brain
- \`/api/brain/drive\` - Get Drive Engine status
- \`/api/wolf-pack/*\` - Wolf Pack endpoints
- \`/api/dreams/*\` - DreamVault endpoints
EOF

echo "✅ Mini-app scaffolded: mini-apps/$MINI_APP_NAME"
echo "📝 Next steps:"
echo "   1. cd mini-apps/$MINI_APP_NAME/frontend"
echo "   2. pnpm install"
echo "   3. pnpm dev"
echo "   4. Start building!"

