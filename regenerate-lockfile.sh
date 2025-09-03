#!/bin/bash

# Script to regenerate package-lock.json with proper flags
# This resolves peer dependency conflicts that cause CI/CD failures

echo "🔄 Regenerating package-lock.json..."

# Remove existing lock file
echo "🗑️ Removing existing package-lock.json..."
rm -f package-lock.json

# Install dependencies with legacy peer deps flag
echo "📥 Installing dependencies with --legacy-peer-deps flag..."
npm install --legacy-peer-deps

echo "✅ package-lock.json regenerated successfully!"
echo "📝 Please commit the updated package-lock.json file to fix CI/CD issues."