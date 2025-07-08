# 🚀 YOLOv5 Object Detection Interface - Quick Start Guide

## 📋 Prerequisites

- **Docker & Docker Compose** (recommended) OR
- **Python 3.8+** and **Node.js 18+** (for local development)

## 🎯 Option 1: Docker (Easiest)

### Windows
```cmd
# Double-click setup.bat or run in Command Prompt
setup.bat
```

### Linux/Mac
```bash
# Make executable and run
chmod +x setup.sh
./setup.sh
```

### Manual Docker
```bash
# Build and start all services
docker-compose up --build

# Access the interface at:
# Frontend: http://localhost:3000
# Backend API: http://localhost:8000
# API Docs: http://localhost:8000/docs
```

## 🛠️ Option 2: Local Development

### Windows
```cmd
# Double-click start-dev.bat or run in Command Prompt
start-dev.bat
```

### Linux/Mac
```bash
# Make executable and run
chmod +x start-dev.sh
./start-dev.sh
```

### Manual Local Setup

#### Backend
```bash
cd backend
python -m venv venv
# Windows: venv\Scripts\activate
# Linux/Mac: source venv/bin/activate
pip install -r requirements.txt
python main.py
```

#### Frontend (in another terminal)
```bash
cd frontend
npm install
npm run dev
```

## 🧪 Testing

```bash
# Test API with sample image
python test_api.py --image path/to/your/image.jpg

# Test with bus image (if available)
python test_api.py --image yolov5/data/images/bus.jpg
```

## 🌐 Access Points

- **Web Interface**: http://localhost:3000
- **API Endpoint**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs
- **Health Check**: http://localhost:8000/health

## 📖 Usage

1. Open http://localhost:3000 in your browser
2. Upload an image (JPG, PNG, GIF - max 10MB)
3. Adjust confidence threshold if needed (optional)
4. Click "Detect Objects"
5. View results with bounding boxes and detection table
6. Download the processed image

## 🔧 Configuration

### Backend Settings
Edit `backend/main.py`:
- Model path
- Confidence thresholds
- Image processing parameters
- CORS settings

### Frontend Settings
Edit `frontend/next.config.js`:
- API endpoints
- Image domains
- Proxy settings

## 📊 Performance Tips

- **GPU Acceleration**: Ensure PyTorch with CUDA is installed for GPU support
- **Memory**: Recommended 4GB+ RAM for smooth operation
- **Network**: Local deployment avoids network latency

## 🆘 Troubleshooting

### Common Issues

1. **Port already in use**
   - Check if ports 3000 or 8000 are occupied
   - Stop other services or change ports in configuration

2. **Model loading fails**
   - Ensure yolov5s.pt is in the root directory
   - Check PyTorch installation

3. **CORS errors**
   - Verify both frontend and backend are running
   - Check CORS settings in backend/main.py

4. **Frontend build issues**
   - Delete node_modules and reinstall: `rm -rf node_modules && npm install`
   - Check Node.js version compatibility

5. **Docker issues**
   - Ensure Docker is running
   - Try `docker-compose down` then `docker-compose up --build`

### Debug Commands

```bash
# Check service status
docker-compose ps

# View logs
docker-compose logs -f

# Restart services
docker-compose restart

# Clean rebuild
docker-compose down
docker-compose up --build
```

## 🎉 Success!

If everything is working correctly, you should see:
- ✅ Frontend accessible at http://localhost:3000
- ✅ Backend API responding at http://localhost:8000
- ✅ Model loaded successfully
- ✅ Object detection working on uploaded images

Happy detecting! 🎯
