#!/bin/bash

# Script to build and push Docker image to Docker Hub

# Configuration
IMAGE_NAME="expansion-management-api"
DOCKER_HUB_USER="abanoubhany"
REPO_NAME="expansion-management-api"
VERSION="v1.0.0"
LATEST="latest"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}🚀 Starting Docker image build and push process...${NC}"

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo -e "${RED}❌ Docker is not running. Please start Docker and try again.${NC}"
    exit 1
fi

# Login to Docker Hub
echo -e "${YELLOW}🔐 Logging in to Docker Hub...${NC}"
docker login

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Docker login failed. Please check your credentials.${NC}"
    exit 1
fi

# Build the image
echo -e "${YELLOW}🏗️ Building Docker image...${NC}"
docker build -t $IMAGE_NAME .

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Docker build failed.${NC}"
    exit 1
fi

# Tag the image
echo -e "${YELLOW}🏷️ Tagging Docker image...${NC}"
docker tag $IMAGE_NAME $DOCKER_HUB_USER/$REPO_NAME:$VERSION
docker tag $IMAGE_NAME $DOCKER_HUB_USER/$REPO_NAME:$LATEST

# Push version tag
echo -e "${YELLOW}📤 Pushing version tag $VERSION...${NC}"
docker push $DOCKER_HUB_USER/$REPO_NAME:$VERSION

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Failed to push version tag.${NC}"
    exit 1
fi

# Push latest tag
echo -e "${YELLOW}📤 Pushing latest tag...${NC}"
docker push $DOCKER_HUB_USER/$REPO_NAME:$LATEST

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Failed to push latest tag.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Docker image successfully pushed to Docker Hub!${NC}"
echo -e "${GREEN}Image URLs:${NC}"
echo -e "${GREEN}  - https://hub.docker.com/r/$DOCKER_HUB_USER/$REPO_NAME/tags?page=1&name=$VERSION${NC}"
echo -e "${GREEN}  - https://hub.docker.com/r/$DOCKER_HUB_USER/$REPO_NAME/tags?page=1&name=$LATEST${NC}"