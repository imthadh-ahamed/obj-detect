@echo off
REM YOLOv5 Object Detection Interface - Development Setup Script for Windows

echo 🚀 Setting up YOLOv5 Object Detection Interface...

REM Check if Docker is installed
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker is not installed. Please install Docker Desktop first.
    pause
    exit /b 1
)

REM Check if Docker Compose is installed
docker-compose --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker Compose is not installed. Please install Docker Compose first.
    pause
    exit /b 1
)

REM Build and start the services
echo 🔧 Building and starting services...
docker-compose up --build -d

REM Wait for services to start
echo ⏳ Waiting for services to start...
timeout /t 15 /nobreak >nul

REM Check if services are running
echo 🔍 Checking service status...
docker-compose ps

REM Test backend health
echo 🏥 Testing backend health...
curl -s -o nul -w "%%{http_code}" http://localhost:8000/health > temp_response.txt
set /p response=<temp_response.txt
del temp_response.txt
if "%response%"=="200" (
    echo ✅ Backend is healthy
) else (
    echo ❌ Backend health check failed
)

REM Test frontend
echo 🌐 Testing frontend...
curl -s -o nul -w "%%{http_code}" http://localhost:3000 > temp_response.txt
set /p response=<temp_response.txt
del temp_response.txt
if "%response%"=="200" (
    echo ✅ Frontend is accessible
) else (
    echo ❌ Frontend accessibility check failed
)

echo.
echo 🎉 Setup complete!
echo.
echo 📡 Services:
echo   Frontend: http://localhost:3000
echo   Backend:  http://localhost:8000
echo   API Docs: http://localhost:8000/docs
echo.
echo 🛠️  Commands:
echo   Stop services:    docker-compose down
echo   View logs:        docker-compose logs -f
echo   Restart services: docker-compose restart
echo.
pause
