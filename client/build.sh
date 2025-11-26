#!/bin/bash
# Force Node 22 for Vercel builds
export NODE_VERSION=22
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
nvm use 22 || echo "NVM not available, continuing..."

# Install and build
pnpm install --include=optional
pnpm build

