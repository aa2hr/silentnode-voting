
#!/bin/bash
set -e

# 🗂 Change to frontend directory
cd frontend || (echo "❌ Failed to change to frontend directory!" && exit 1)

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

# Check for tsconfig.json to confirm TypeScript project
if [ ! -f "tsconfig.json" ]; then
  echo "⚠️ tsconfig.json not found. Assuming non-TypeScript project."
else
  echo "✅ TypeScript project detected."
fi

# Clear cache to ensure fresh build
echo "🧹 Clearing .next cache..."
rm -rf .next

echo "🚀 Building optimized Next.js app..."
NODE_ENV=production npm run build || (echo "❌ Build failed!" && exit 1)

echo "✅ Vercel build completed successfully!"
