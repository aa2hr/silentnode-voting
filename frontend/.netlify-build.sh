#!/bin/bash
set -e

echo "⚙️ Using Node.js for Netlify build..."
node -v
npm -v

echo "📦 Ensuring dependencies are installed..."
if [ ! -d "node_modules" ]; then
  echo "🧩 node_modules not found. Installing dependencies..."
  npm ci || (echo "❌ Failed to install dependencies!" && exit 1)
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
    npm install --save-dev typescript || (echo "❌ Failed to install TypeScript!" && exit 1)
  fi

  # Install common type packages only if project uses React
  if npm ls react >/dev/null 2>&1; then
    echo "🧠 Installing React and Node type packages..."
    npm install --save-dev @types/react @types/node || (echo "❌ Failed to install React/Node type packages!" && exit 1)
  fi

  # Check for dependencies missing TypeScript types
  echo "🔍 Checking for missing TypeScript type definitions..."
  missing_types=""
  for pkg in $(npm ls --prod --parseable | grep -v '/@types/' | awk -F/ '{print $NF}' | sort | uniq); do
    if ! npm ls @types/$pkg >/dev/null 2>&1 && [ "$pkg" != "typescript" ]; then
      # Verify if @types/$pkg exists in npm registry before adding
      if npm view @types/$pkg >/dev/null 2>&1; then
        missing_types="$missing_types @types/$pkg"
      fi
    fi
  done

  if [ -n "$missing_types" ]; then
    echo "📦 Installing missing @types packages: $missing_types..."
    npm install --save-dev $missing_types || (echo "❌ Failed to install missing type packages!" && exit 1)
  else
    echo "✅ All necessary @types packages are already installed or not needed."
  fi
fi

# Preserve Next.js cache for faster builds
if [ -n "$NETLIFY_BUILD_BASE" ] && [ "$CONTEXT" = "production" ]; then
  echo "🧹 Skipping .next cache clean to leverage Netlify caching..."
else
  echo "🧹 Cleaning Next.js cache..."
  rm -rf .next
fi

# Check if build script exists
if ! npm run | grep -q "^build$"; then
  echo "❌ No 'build' script found in package.json!"
  exit 1
fi

echo "🚀 Building optimized Next.js app..."
NODE_ENV=production npm run build || (echo "❌ Build failed!" && exit 1)

echo "✅ Netlify build completed successfully!"
