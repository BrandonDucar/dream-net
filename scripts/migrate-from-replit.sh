#!/bin/bash
# Migrate code from Replit to DreamNet monorepo

set -e

echo "🚀 Replit Migration Helper"
echo "=========================="
echo ""

# Check if we're in the DreamNet root
if [ ! -f "package.json" ] || [ ! -d "packages" ]; then
  echo "❌ Error: Must run from DreamNet root directory"
  exit 1
fi

echo "📋 This script helps you migrate code from Replit to DreamNet"
echo ""
echo "Options:"
echo "1. Import from GitHub (if you pushed Replit to GitHub)"
echo "2. Import from local ZIP file"
echo "3. Create new mini-app structure"
echo ""
read -p "Choose option (1-3): " option

case $option in
  1)
    echo ""
    read -p "Enter GitHub repo URL (e.g., https://github.com/user/repo.git): " repo_url
    read -p "Enter package name (e.g., aethersafe): " package_name
    
    echo "📦 Cloning repository..."
    cd packages
    git clone "$repo_url" "$package_name"
    cd "$package_name"
    
    echo "📝 Checking for package.json..."
    if [ ! -f "package.json" ]; then
      echo "⚠️  No package.json found, creating one..."
      cat > package.json << EOF
{
  "name": "@dreamnet/${package_name}",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "main": "index.ts",
  "scripts": {
    "dev": "tsx index.ts",
    "build": "tsc",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {},
  "devDependencies": {
    "tsx": "^4.20.6",
    "typescript": "^5.4.5"
  }
}
EOF
    fi
    
    echo "✅ Package created at: packages/$package_name"
    echo "📝 Next steps:"
    echo "   1. Review the code structure"
    echo "   2. Install dependencies: cd packages/$package_name && pnpm install"
    echo "   3. Integrate into DreamNet Hub if needed"
    ;;
    
  2)
    echo ""
    read -p "Enter path to ZIP file: " zip_path
    read -p "Enter package name: " package_name
    
    if [ ! -f "$zip_path" ]; then
      echo "❌ Error: ZIP file not found: $zip_path"
      exit 1
    fi
    
    echo "📦 Extracting ZIP..."
    cd packages
    unzip -q "$zip_path" -d "$package_name"
    cd "$package_name"
    
    # Remove any nested directories if ZIP had a root folder
    if [ $(ls -1 | wc -l) -eq 1 ] && [ -d "$(ls -1)" ]; then
      nested_dir=$(ls -1)
      mv "$nested_dir"/* .
      mv "$nested_dir"/.* . 2>/dev/null || true
      rmdir "$nested_dir"
    fi
    
    echo "✅ Package extracted to: packages/$package_name"
    echo "📝 Next steps:"
    echo "   1. Review the code structure"
    echo "   2. Install dependencies: cd packages/$package_name && pnpm install"
    echo "   3. Integrate into DreamNet Hub if needed"
    ;;
    
  3)
    echo ""
    read -p "Enter mini-app name (e.g., aethersafe): " app_name
    
    echo "📦 Creating mini-app structure..."
    mkdir -p "packages/base-mini-apps/frontend/${app_name}"
    
    cat > "packages/base-mini-apps/frontend/${app_name}/${app_name^}Mini.tsx" << EOF
import React from 'react';

export function ${app_name^}Mini() {
  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-gray-800 rounded-lg p-6 border border-cyan-500/20">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            ${app_name^}
          </h1>
          <p className="text-gray-400 mt-2">Your ${app_name} mini-app</p>
          
          {/* Add your app content here */}
        </div>
      </div>
    </div>
  );
}
EOF
    
    echo "✅ Mini-app created at: packages/base-mini-apps/frontend/${app_name}/"
    echo "📝 Next steps:"
    echo "   1. Add your app logic to ${app_name^}Mini.tsx"
    echo "   2. Export it in packages/base-mini-apps/frontend/index.tsx"
    echo "   3. Add to MINI_APPS registry"
    ;;
    
  *)
    echo "❌ Invalid option"
    exit 1
    ;;
esac

echo ""
echo "🎉 Migration helper complete!"
echo "💡 Check docs/DOMAIN_MIGRATION_GUIDE.md for next steps"

