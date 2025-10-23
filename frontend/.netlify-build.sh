#!/bin/bash
set -e  # توقف در صورت خطا

echo "⚙️  Using Node.js 22.x for Netlify build..."
node -v
npm -v

echo "📦 Installing dependencies..."
# استفاده از cache برای سرعت
if [ -d "node_modules" ]; then
  echo "✅ Using cached node_modules"
else
  echo "⬇️  Installing fresh dependencies..."
  if [ -f package-lock.json ]; then
    npm ci
  else
    npm install
  fi
fi

echo "🧹 Cleaning Next.js cache..."
rm -rf .next

echo "🚀 Building optimized Next.js app for production..."
npm run build

echo "✅ Build completed successfully!"

