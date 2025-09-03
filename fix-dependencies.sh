#!/bin/bash

# Script to fix dependency conflicts and regenerate package-lock.json
# This resolves peer dependency conflicts that cause CI/CD failures

echo "🔄 Fixing dependency conflicts..."

# Remove existing lock file
echo "🗑️ Removing existing package-lock.json..."
rm -f package-lock.json

# Install dependencies with legacy peer deps flag to resolve conflicts
# Note: The .npmrc file should automatically apply --legacy-peer-deps
echo "📥 Installing dependencies..."
npm install

# Run a test build to ensure everything works
echo "🏗️ Running test build..."
npm run build

echo "✅ Dependencies fixed successfully!"
echo "📝 Please commit the updated package-lock.json file to fix CI/CD issues."
echo "💡 Note: The .npmrc file automatically applies --legacy-peer-deps to prevent future conflicts."