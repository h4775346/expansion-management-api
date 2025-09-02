#!/bin/bash

# Function to pull updates and restart if needed
update_and_restart() {
    echo "Checking for updates..."
    git fetch origin
    LOCAL=$(git rev-parse HEAD)
    REMOTE=$(git rev-parse origin/main)
    
    if [ $LOCAL != $REMOTE ]; then
        echo "Updates found. Pulling changes..."
        git pull origin main
        
        echo "Rebuilding and restarting services..."
        docker-compose down
        docker-compose up -d
        
        echo "Update completed successfully!"
    else
        echo "No updates available."
    fi
}

# Initial setup
echo "Starting Expansion Management System..."
update_and_restart

# Set up auto-update check every hour
while true; do
    sleep 3600  # Wait 1 hour
    update_and_restart
done