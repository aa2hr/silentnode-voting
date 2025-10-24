#!/bin/bash
set -e

echo "⚙️ Using Node.js for Vercel build..."
node -v
npm -v

echo "📦 Cleaning old modules and cache..."
rm -rf node_modules package-lock.json .next

echo "📦 Installing all dependencies (including devDependencies)..."
# Force install to bypass missing peer deps, and include devDeps for TypeScript build
npm install --legacy-peer-deps --force

echo "🧩 Verifying TypeScript setup..."
if [ -f "tsconfig.json" ]; then
  echo "✅ tsconfig.json found — installing TypeScript toolchain..."
  npm install --save-dev typescript @types/react @types/node
else
  echo "⚠️ tsconfig.json not found — assuming JavaScript-only project."
fi

echo "🧹 Cleaning .next cache..."
rm -rf .next

echo "🚀 Building optimized Next.js app..."
NODE_ENV=production npm run build

echo "✅ Build completed successfully for Vercel!"

