@echo off
echo 🔄 Fixing dependency conflicts...

echo 🗑️ Removing existing package-package-lock.json...
del /f package-lock.json 2>nul

echo 📥 Installing dependencies...
echo Note: The .npmrc file automatically applies --legacy-peer-deps to prevent future conflicts.
npm install

echo 🏗️ Running test build...
npm run build

echo ✅ Dependencies fixed successfully!
echo 📝 Please commit the updated package-lock.json file to fix CI/CD issues.
echo 💡 Note: The .npmrc file automatically applies --legacy-peer-deps to prevent future conflicts.