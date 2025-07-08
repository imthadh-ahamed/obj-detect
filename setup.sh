#!/bin/bash

# YOLOv5 Object Detection Interface - Development Setup Script

echo "🚀 Setting up YOLOv5 Object Detection Interface..."

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Build and start the services
echo "🔧 Building and starting services..."
docker-compose up --build -d

# Wait for services to start
echo "⏳ Waiting for services to start..."
sleep 10

# Check if services are running
echo "🔍 Checking service status..."
docker-compose ps

# Test backend health
echo "🏥 Testing backend health..."
response=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8000/health)
if [ "$response" == "200" ]; then
    echo "✅ Backend is healthy"
else
    echo "❌ Backend health check failed"
fi

# Test frontend
echo "🌐 Testing frontend..."
response=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000)
if [ "$response" == "200" ]; then
    echo "✅ Frontend is accessible"
else
    echo "❌ Frontend accessibility check failed"
fi

echo ""
echo "🎉 Setup complete!"
echo ""
echo "📡 Services:"
echo "  Frontend: http://localhost:3000"
echo "  Backend:  http://localhost:8000"
echo "  API Docs: http://localhost:8000/docs"
echo ""
echo "🛠️  Commands:"
echo "  Stop services:    docker-compose down"
echo "  View logs:        docker-compose logs -f"
echo "  Restart services: docker-compose restart"
echo ""
