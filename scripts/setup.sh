#!/bin/bash

# Store Intelligence System - Setup Script

set -e

echo "================================"
echo "Store Intelligence System Setup"
echo "================================"
echo ""

# Check prerequisites
echo "Checking prerequisites..."

if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed"
    exit 1
fi

if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed"
    exit 1
fi

if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed"
    exit 1
fi

echo "✓ All prerequisites found"
echo ""

# Setup backend
echo "Setting up backend..."
cd backend
cp .env.example .env
npm install
npm run build
cd ..
echo "✓ Backend setup complete"
echo ""

# Setup frontend
echo "Setting up frontend..."
cd frontend
cp .env.example .env
npm install
npm run build
cd ..
echo "✓ Frontend setup complete"
echo ""

# Setup AI service
echo "Setting up AI service..."
cd ai-service
cp .env.example .env
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
deactivate
cd ..
echo "✓ AI service setup complete"
echo ""

echo "================================"
echo "Setup Complete!"
echo "================================"
echo ""
echo "Next steps:"
echo "1. Review and update .env files in each service"
echo "2. Start services with: docker-compose up -d"
echo "3. Check health: curl http://localhost:3000/api/health"
echo "4. Access frontend: http://localhost:5173"
echo ""
