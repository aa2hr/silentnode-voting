
#!/bin/bash
set -e

# 🗂 Change to frontend directory
cd frontend || (echo "❌ Failed to change to frontend directory!" && exit 1)

echo "⚙️ Using Node.js for Vercel build..."
node -v
npm -v

echo "📦 Ensuring dependencies are installed..."
rm -rf node_modules package-lock.json # Force clean install
echo "🧩 Installing dependencies..."
npm install --silent --legacy-peer-deps --include=dev || (echo "❌ Failed to install dependencies!" && exit 1)

# TypeScript check
if [ ! -f "tsconfig.json" ]; then
  echo "⚠️ tsconfig.json not found. Assuming non-TypeScript project."
else
  echo "✅ TypeScript project detected."
fi

echo "🧹 Cleaning .next cache..."
rm -rf .next

echo "🚀 Building optimized Next.js app..."
NODE_ENV=production npm run build || (echo "❌ Build failed!" && exit 1)

echo "✅ Vercel build completed successfully!"
