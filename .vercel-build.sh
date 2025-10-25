#!/bin/bash
set -e
echo "⚙️ Using Node.js for Vercel build..."
node -v
npm -v

echo "📦 Installing dependencies..."
npm ci --legacy-peer-deps

echo "🚀 Building optimized Next.js app..."
npm run build

