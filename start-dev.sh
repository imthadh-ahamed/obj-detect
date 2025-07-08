#!/bin/bash

# Local Development Start Script

echo "🚀 Starting YOLOv5 Object Detection Interface (Local Development)"

# Function to check if port is in use
check_port() {
    if lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null ; then
        echo "⚠️  Port $1 is already in use"
        return 1
    fi
    return 0
}

# Check required ports
check_port 8000
backend_port_free=$?

check_port 3000
frontend_port_free=$?

if [ $backend_port_free -ne 0 ] || [ $frontend_port_free -ne 0 ]; then
    echo "❌ Required ports are not available"
    exit 1
fi

# Start backend
echo "🔧 Starting backend server..."
cd backend
python -m venv venv 2>/dev/null || echo "Virtual environment already exists"
source venv/bin/activate
pip install -r requirements.txt
python main.py &
backend_pid=$!
cd ..

# Wait for backend to start
echo "⏳ Waiting for backend to start..."
sleep 5

# Start frontend
echo "🌐 Starting frontend server..."
cd frontend
npm install
npm run dev &
frontend_pid=$!
cd ..

# Wait for frontend to start
echo "⏳ Waiting for frontend to start..."
sleep 10

echo ""
echo "🎉 Both services are starting!"
echo ""
echo "📡 Services:"
echo "  Frontend: http://localhost:3000"
echo "  Backend:  http://localhost:8000"
echo "  API Docs: http://localhost:8000/docs"
echo ""
echo "🛠️  To stop services:"
echo "  kill $backend_pid $frontend_pid"
echo "  or press Ctrl+C"
echo ""

# Keep script running
wait
