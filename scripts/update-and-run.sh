#!/bin/sh

# Script to pull latest code and run the application
echo "Starting Expansion Management System with auto-update..."

# Function to pull latest code
update_code() {
    echo "Checking for updates..."
    git fetch origin
    LOCAL=$(git rev-parse HEAD)
    REMOTE=$(git rev-parse origin/main)
    
    if [ $LOCAL = $REMOTE ]; then
        echo "Code is up to date"
    else
        echo "Updating code..."
        git pull origin main
        
        # Reinstall dependencies if package.json changed
        if [ -f package.json ]; then
            echo "Installing dependencies..."
            npm install --legacy-peer-deps
        fi
        
        # Rebuild the application
        echo "Rebuilding application..."
        npm run build
    fi
}

# Initial update
update_code

# Set up a cron job to periodically check for updates
echo "Setting up auto-update cron job..."
echo "0 * * * * cd /app && /app/scripts/update-and-run.sh update_only >> /var/log/update.log 2>&1" | crontab -

# Start cron daemon
crond

# Start the application
echo "Starting application..."
node dist/main.js