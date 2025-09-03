@echo off
echo 🚀 Starting development environment with Docker...

echo Starting all services in development mode...
docker compose -f docker-compose.dev.yml up

echo ✅ Development environment started!
echo 📋 Access your application at: http://localhost:3000
echo 📚 API Documentation: http://localhost:3000/docs