#!/bin/bash
echo "⚙️  Forcing Node.js 20.x for Vercel build..."
export PATH="/usr/local/n/versions/node/20.17.0/bin:$PATH"
node -v
npm run build

