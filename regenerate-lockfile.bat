@echo off
echo 🔄 Regenerating package-lock.json...

echo 🗑️ Removing existing package-lock.json...
del /f package-lock.json 2>nul

echo 📥 Installing dependencies with --legacy-peer-deps flag...
npm install --legacy-peer-deps

echo ✅ package-lock.json regenerated successfully!
echo 📝 Please commit the updated package-lock.json file to fix CI/CD issues.