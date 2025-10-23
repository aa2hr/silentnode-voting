#!/bin/bash
set -e  # اگر هر مرحله خطا داد، build متوقف شود

echo "⚙️  Using Node.js 20.x for Vercel build..."
export PATH="/usr/local/n/versions/node/20.17.0/bin:$PATH"
node -v
npm -v

echo "📦 Installing dependencies..."
# استفاده از npm ci باعث نصب دقیق بر اساس package-lock.json می‌شود
# اگر فایل package-lock.json نداری، می‌تونی از npm install استفاده کنی
if [ -f package-lock.json ]; then
  npm ci
else
  npm install
fi

echo "🧹 Cleaning Next.js cache (for fresh build)..."
rm -rf .next

echo "🚀 Building optimized Next.js app..."
npm run build

echo "✅ Build completed successfully!"

