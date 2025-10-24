#!/bin/bash
set -e

echo "⚙️ Using Node.js for Vercel build..."
node -v
npm -v

echo "📦 Ensuring dependencies are installed..."
if [ ! -d "node_modules" ]; then
  echo "🧩 node_modules not found. Installing dependencies..."
  npm ci --silent --legacy-peer-deps || (echo "❌ Failed to install dependencies!" && exit 1)
else
  echo "✅ node_modules already exists. Skipping install."
fi

echo "🧠 Ensuring TypeScript and typings are installed..."
npm install --save-dev typescript @types/react @types/react-dom @types/node --legacy-peer-deps --silent || true

echo "🧹 Clearing cache..."
rm -rf .next

echo "🚀 Building optimized Next.js app..."
npx next build || (echo "❌ Build failed!" && exit 1)

echo "✅ Vercel build completed successfully!"

