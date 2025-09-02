#!/bin/bash

# Script to build and push Docker image to Docker Hub

# Configuration
IMAGE_NAME="expansion-management-api"
DOCKER_HUB_USER="abanoubhany"
REPO_NAME="expansion-management-api"
VERSION="v1.0.0"
LATEST="latest"

echo "🚀 Starting Docker image build and push process..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker and try again."
    exit 1
fi

# Login to Docker Hub
echo "🔐 Logging in to Docker Hub..."
docker login
if [ $? -ne 0 ]; then
    echo "❌ Docker login failed. Please check your credentials."
    exit 1
fi

# Build the image using the production Dockerfile
echo "🏗️ Building Docker image with production Dockerfile..."
docker build -t $IMAGE_NAME -f Dockerfile.prod .
if [ $? -ne 0 ]; then
    echo "❌ Docker build failed."
    exit 1
fi

# Tag the image
echo "🏷️ Tagging Docker image..."
docker tag $IMAGE_NAME $DOCKER_HUB_USER/$REPO_NAME:$VERSION
docker tag $IMAGE_NAME $DOCKER_HUB_USER/$REPO_NAME:$LATEST

# Push version tag
echo "📤 Pushing version tag $VERSION..."
docker push $DOCKER_HUB_USER/$REPO_NAME:$VERSION
if [ $? -ne 0 ]; then
    echo "❌ Failed to push version tag."
    exit 1
fi

# Push latest tag
echo "📤 Pushing latest tag..."
docker push $DOCKER_HUB_USER/$REPO_NAME:$LATEST
if [ $? -ne 0 ]; then
    echo "❌ Failed to push latest tag."
    exit 1
fi

echo "✅ Docker image successfully pushed to Docker Hub!"
echo "Image URLs:"
echo "  - https://hub.docker.com/r/$DOCKER_HUB_USER/$REPO_NAME/tags?page=1&name=$VERSION"
echo "  - https://hub.docker.com/r/$DOCKER_HUB_USER/$REPO_NAME/tags?page=1&name=$LATEST"