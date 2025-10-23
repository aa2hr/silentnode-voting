#!/bin/bash
set -e

echo "⚙️ Using Node.js for Vercel build..."
node -v
npm -v

echo "📦 Ensuring dependencies are installed..."
if [ ! -d "node_modules" ]; then
  echo "🧩 node_modules not found. Installing dependencies..."
  npm ci --silent || (echo "❌ Failed to install dependencies!" && exit 1)
else
  echo "✅ node_modules already exists. Skipping install."
fi

# Check for tsconfig.json to confirm TypeScript project
if [ ! -f "tsconfig.json" ]; then
  echo "⚠️ tsconfig.json not found. Skipping TypeScript-related steps."
else
  # Check if TypeScript is installed
  if ! npm ls typescript >/dev/null 2>&1; then
    echo "🧠 Installing TypeScript..."
    npm install --save-dev typescript --silent --legacy-peer-deps || (echo "❌ Failed to install TypeScript!" && exit 1)
  fi

  # Install React type packages only if project uses React
  if npm ls react >/dev/null 2>&1; then
    echo "🧠 Installing React and Node type packages..."
    npm install --save-dev @types/react @types/node --silent --legacy-peer-deps || (echo "❌ Failed to install React/Node type packages!" && exit 1)
  fi

  # Check for missing TypeScript type definitions
  echo "🔍 Checking for missing TypeScript type definitions..."
  missing_types=""
  npm ls --prod --depth=0 --parseable > build-dependencies.log
  for pkg in $(cat build-dependencies.log | awk -F/ '{print $NF}' | sort | uniq); do
    if ! npm ls @types/$pkg >/dev/null 2>&1 && [ "$pkg" != "typescript" ]; then
      if npm view @types/$pkg >/dev/null 2>&1; then
        missing_types="$missing_types @types/$pkg"
      fi
    fi
  done
  rm -f build-dependencies.log

  if [ -n "$missing_types" ]; then
    echo "📦 Installing missing @types packages: $missing_types..."
    npm install --save-dev $missing_types --silent --legacy-peer-deps || (echo "❌ Failed to install missing type packages!" && exit 1)
  else
    echo "✅ All necessary @types packages are already installed or not needed."
  fi
fi

# Preserve Next.js ISR cache for Vercel production builds
if [ "$VERCEL" = "1" ] && [ "$VERCEL_ENV" = "production" ]; then
  echo "🧹 Preserving .next/cache for ISR and incremental builds..."
  rm -rf .next && mkdir -p .next/cache || true
else
  echo "🧹 Cleaning .next cache..."
  rm -rf .next
fi

# Check if build script exists
if ! npm run | grep -q "^build$"; then
  echo "⚠️ No 'build' script found in package.json. Attempting default Next.js build..."
  NODE_ENV=production npx next build || (echo "❌ Build failed!" && exit 1)
else
  echo "🚀 Building optimized Next.js app..."
  NODE_ENV=production npm run build || (echo "❌ Build failed!" && exit 1)
fi

echo "✅ Vercel build completed successfully!"
