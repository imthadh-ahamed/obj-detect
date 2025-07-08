@echo off
REM Local Development Start Script for Windows

echo 🚀 Starting YOLOv5 Object Detection Interface (Local Development)

REM Check if Python is installed
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Python is not installed. Please install Python 3.8+ first.
    pause
    exit /b 1
)

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js first.
    pause
    exit /b 1
)

REM Start backend
echo 🔧 Starting backend server...
cd backend
python -m venv venv 2>nul || echo Virtual environment already exists
call venv\Scripts\activate
pip install -r requirements.txt
start "Backend Server" cmd /k python main.py
cd ..

REM Wait for backend to start
echo ⏳ Waiting for backend to start...
timeout /t 10 /nobreak >nul

REM Start frontend
echo 🌐 Starting frontend server...
cd frontend
npm install
start "Frontend Server" cmd /k npm run dev
cd ..

REM Wait for frontend to start
echo ⏳ Waiting for frontend to start...
timeout /t 15 /nobreak >nul

echo.
echo 🎉 Both services are starting!
echo.
echo 📡 Services:
echo   Frontend: http://localhost:3000
echo   Backend:  http://localhost:8000
echo   API Docs: http://localhost:8000/docs
echo.
echo 🛠️  To stop services:
echo   Close the terminal windows or press Ctrl+C in each
echo.
pause
