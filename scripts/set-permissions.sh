#!/bin/sh

# Set permissions for the app directory
echo "🔧 Setting permissions for the app directory..."
mkdir -p /app/dist
chmod -R 777 /app
echo "✅ Permissions set successfully!"