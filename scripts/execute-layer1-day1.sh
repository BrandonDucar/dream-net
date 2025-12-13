#!/bin/bash
# Layer 1, Day 1: Server Deployment
# Execute this to start building DreamNet

set -e  # Exit on error

echo "🚀 DreamNet Execution: Layer 1, Day 1 - Server Deployment"
echo "=================================================="
echo ""

# Step 1: Verify environment
echo "📋 Step 1: Verifying environment..."
node --version | grep -q "v22" || (echo "❌ Node.js 22+ required" && exit 1)
pnpm --version || (echo "❌ pnpm required" && exit 1)
echo "✅ Environment verified"
echo ""

# Step 2: Install dependencies
echo "📦 Step 2: Installing dependencies..."
pnpm install --frozen-lockfile
echo "✅ Dependencies installed"
echo ""

# Step 3: Test local server
echo "🧪 Step 3: Testing local server..."
echo "Starting server in background..."
pnpm dev:app &
SERVER_PID=$!
sleep 5

# Test health endpoint
echo "Testing health endpoint..."
curl -f http://localhost:5000/api/health || (echo "❌ Health endpoint failed" && kill $SERVER_PID && exit 1)
echo "✅ Server running, health endpoint responding"
echo ""

# Step 4: Stop test server
echo "Stopping test server..."
kill $SERVER_PID
wait $SERVER_PID 2>/dev/null || true
echo "✅ Test server stopped"
echo ""

# Step 5: Production deployment
echo "🚀 Step 5: Ready for production deployment"
echo "Choose deployment target:"
echo "  1. Google Cloud Run (recommended)"
echo "  2. Vercel"
echo "  3. AWS"
echo ""
echo "To deploy to Cloud Run, run:"
echo "  pnpm deploy:gcp"
echo ""
echo "To deploy to Vercel, run:"
echo "  cd client && vercel --prod"
echo ""

echo "✅ Layer 1, Day 1 Complete!"
echo "Next: Layer 1, Day 2 - Core Systems Initialization"

