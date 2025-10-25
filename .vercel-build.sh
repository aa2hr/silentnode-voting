#!/bin/bash
set -e

echo "Current directory: $(pwd)"
ls -la

echo "Using Node.js for Vercel build..."
node -v
npm -v

echo "Ensuring dependencies are installed..."
rm -rf node_modules package-lock.json
echo "Installing dependencies..."
npm install --silent --legacy-peer-deps || (echo "Failed to install dependencies!" && exit 1)

echo "Cleaning .next cache..."
rm -rf .next

echo "Building optimized Next.js app..."
NODE_ENV=production npm run build || (echo "Build failed!" && exit 1)

echo "Vercel build completed successfully!"
