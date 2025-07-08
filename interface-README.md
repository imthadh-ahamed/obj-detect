# YOLOv5 Object Detection Interface

A modern web interface for YOLOv5 object detection with Next.js frontend and FastAPI backend.

## 🚀 Features

- **Modern UI**: Beautiful, responsive interface built with Next.js and Tailwind CSS
- **Real-time Detection**: Upload images and get instant object detection results
- **Configurable Confidence**: Adjust detection confidence threshold
- **Visual Results**: Images with bounding boxes and detection metadata
- **Download Results**: Download processed images with annotations
- **RESTful API**: FastAPI backend with automatic documentation

## 🏗️ Architecture

```
┌─────────────────┐    HTTP    ┌─────────────────┐
│   Next.js       │ ---------> │   FastAPI       │
│   Frontend      │            │   Backend       │
│                 │            │                 │
│ - Upload Form   │            │ - YOLOv5 Model  │
│ - Results View  │            │ - Image Processing │
│ - Settings      │            │ - API Endpoints │
└─────────────────┘            └─────────────────┘
```

## 🛠️ Installation

### Option 1: Docker (Recommended)

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd obj-detect
   ```

2. **Start with Docker Compose**
   ```bash
   docker-compose up --build
   ```

3. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - API Documentation: http://localhost:8000/docs

### Option 2: Local Development

#### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Create virtual environment**
   ```bash
   python -m venv venv
   # Windows
   venv\Scripts\activate
   # macOS/Linux
   source venv/bin/activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Start the backend server**
   ```bash
   python main.py
   ```

#### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

## 📡 API Endpoints

### POST /detect
Detect objects in uploaded image

**Request:**
- Form data with image file
- Optional confidence threshold (default: 0.5)

**Response:**
```json
{
  "success": true,
  "image_url": "/static/result_image.jpg",
  "detections": [
    {
      "class_name": "person",
      "confidence": 0.85,
      "bbox": [100, 200, 300, 400],
      "class_id": 0
    }
  ],
  "processing_time": 0.234,
  "image_size": [640, 480]
}
```

### GET /health
Check API health status

### GET /docs
Interactive API documentation

## 🎯 Usage

1. **Upload Image**: Select or drag an image file
2. **Adjust Settings**: Optionally modify confidence threshold
3. **Detect Objects**: Click "Detect Objects" button
4. **View Results**: See annotated image and detection table
5. **Download**: Save the processed image

## 🔧 Configuration

### Backend Configuration

Edit `backend/main.py` to modify:
- Model path
- Confidence thresholds
- Image processing parameters
- API settings

### Frontend Configuration

Edit `frontend/next.config.js` to modify:
- API endpoints
- Image domains
- Build settings

## 🐳 Docker Configuration

### Environment Variables

Create `.env` file in the root directory:

```env
# Backend
BACKEND_PORT=8000
MODEL_PATH=./yolov5s.pt

# Frontend
FRONTEND_PORT=3000
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### Custom Model

To use a custom trained model:

1. Place your model file (e.g., `best.pt`) in the root directory
2. Update `docker-compose.yml` to mount your model:
   ```yaml
   volumes:
     - ./your-model.pt:/app/your-model.pt
   ```
3. Update `backend/main.py` to load your model

## 📊 Performance

- **Model Loading**: ~2-3 seconds on startup
- **Inference Time**: ~0.1-0.5 seconds per image
- **Supported Formats**: JPG, PNG, GIF
- **Max File Size**: 10MB

## 🔍 Troubleshooting

### Common Issues

1. **Model Loading Errors**
   - Ensure PyTorch is installed correctly
   - Check model file path and permissions
   - Verify CUDA availability for GPU acceleration

2. **CORS Errors**
   - Ensure backend CORS settings allow frontend domain
   - Check that both services are running

3. **File Upload Issues**
   - Verify file size limits
   - Check supported image formats
   - Ensure proper file permissions

### Debug Mode

Enable debug logging in `backend/main.py`:

```python
import logging
logging.basicConfig(level=logging.DEBUG)
```

## 🚀 Deployment

### Production Deployment

1. **Build for production**
   ```bash
   docker-compose -f docker-compose.prod.yml up --build
   ```

2. **Environment Variables**
   - Set proper API URLs
   - Configure SSL/TLS
   - Set up reverse proxy (nginx)

3. **Security**
   - Enable HTTPS
   - Set up file upload limits
   - Configure firewall rules

## 📝 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📞 Support

For issues and questions:
- Create an issue on GitHub
- Check the troubleshooting guide
- Review API documentation at `/docs`
