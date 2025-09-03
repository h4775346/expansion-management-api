#!/bin/bash

# Script to manually seed the database
# This script can be used when you need to re-seed the database without restarting the containers

echo "🌱 Seeding database with test data..."

# Run the seed script
npm run seed:run

echo "✅ Database seeding completed!"