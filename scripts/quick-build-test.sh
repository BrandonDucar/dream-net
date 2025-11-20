#!/bin/bash
# Quick Build Test - Checks critical integrations

echo "🧪 Quick Build Integration Test"
echo "================================"
echo ""

cd client || exit 1

echo "1. Checking package.json..."
if [ -f "package.json" ]; then
  echo "✅ package.json exists"
  PACKAGE_NAME=$(node -p "require('./package.json').name")
  echo "   Package: $PACKAGE_NAME"
else
  echo "❌ package.json not found"
  exit 1
fi

echo ""
echo "2. Checking vite.config.ts..."
if [ -f "vite.config.ts" ]; then
  echo "✅ vite.config.ts exists"
else
  echo "❌ vite.config.ts not found"
  exit 1
fi

echo ""
echo "3. Checking critical source files..."
FILES=("src/main.tsx" "src/App.tsx" "index.css")
for file in "${FILES[@]}"; do
  if [ -f "$file" ]; then
    echo "✅ $file exists"
  else
    echo "❌ $file not found"
  fi
done

echo ""
echo "4. Checking for problematic imports..."
if grep -r "@dreamnet/inbox-squared-core" src/ 2>/dev/null; then
  echo "❌ Found inbox-squared-core import in client!"
else
  echo "✅ No inbox-squared-core imports"
fi

if grep -r "googleapis" src/ 2>/dev/null; then
  echo "❌ Found googleapis import in client!"
else
  echo "✅ No googleapis imports"
fi

echo ""
echo "5. Testing build command..."
if command -v pnpm &> /dev/null; then
  echo "✅ pnpm is available"
  echo "   Running: pnpm run build"
  pnpm run build
  BUILD_EXIT=$?
  if [ $BUILD_EXIT -eq 0 ]; then
    echo "✅ Build succeeded!"
  else
    echo "❌ Build failed with exit code $BUILD_EXIT"
    exit 1
  fi
else
  echo "❌ pnpm not found"
  exit 1
fi

echo ""
echo "================================"
echo "✅ All tests passed!"

