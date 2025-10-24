#!/bin/bash
set -e

# 🗂 Change to frontend directory
cd frontend || (echo "❌ Failed to change to frontend directory!" && exit 1)

echo "⚙️ Using Node.js for Vercel build..."
node -v
npm -v

echo "📦 Dependencies already installed by Vercel (including devDependencies)."
echo "✅ Skipping reinstall to speed up build."

# Check for TypeScript config
if [ ! -f "tsconfig.json" ]; then
  echo "⚠️ tsconfig.json not found. Assuming non-TypeScript project."
else
  echo "✅ TypeScript project detected."
fi

# Clean cache before build
echo "🧹 Cleaning .next cache..."
rm -rf .next

echo "🚀 Building optimized Next.js app..."
NODE_ENV=production npm run build || (echo "❌ Build failed!" && exit 1)

echo "✅ Vercel build completed successfully!"

