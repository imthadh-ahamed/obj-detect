import os
import sys
import uuid
import cv2
import numpy as np
from pathlib import Path
from typing import List, Dict, Any
import torch
from fastapi import FastAPI, File, UploadFile, HTTPException, Form
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
import base64
from io import BytesIO
from PIL import Image
import json

# Add the parent directory to Python path to import YOLOv5
sys.path.append(str(Path(__file__).parent.parent))

app = FastAPI(title="YOLOv5 Object Detection API", version="1.0.0")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static files
app.mount("/static", StaticFiles(directory="static"), name="static")

# Global variables
model = None
device = None

class DetectionResult(BaseModel):
    class_name: str
    confidence: float
    bbox: List[float]  # [x1, y1, x2, y2]
    class_id: int

class DetectionResponse(BaseModel):
    success: bool
    image_url: str
    detections: List[DetectionResult]
    processing_time: float
    image_size: List[int]  # [width, height]

@app.on_event("startup")
async def load_model():
    """Load YOLOv5 model on startup"""
    global model, device
    
    try:
        # Set device
        device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
        print(f"Using device: {device}")
        
        # Load YOLOv5 model
        model_path = Path(__file__).parent.parent / "yolov5s.pt"
        if not model_path.exists():
            # Try to load from yolov5 directory
            model_path = Path(__file__).parent.parent / "yolov5" / "yolov5s.pt"
        
        # Load model using torch.hub
        model = torch.hub.load('ultralytics/yolov5', 'yolov5s', pretrained=True)
        model.to(device)
        model.eval()
        
        print("YOLOv5 model loaded successfully!")
        
    except Exception as e:
        print(f"Error loading model: {e}")
        raise e

def draw_bounding_boxes(image: np.ndarray, results, confidence_threshold: float = 0.5) -> np.ndarray:
    """Draw bounding boxes on image"""
    # Convert tensor to numpy if needed
    if isinstance(image, torch.Tensor):
        image = image.cpu().numpy()
    
    # Make a copy to avoid modifying original
    img_with_boxes = image.copy()
    
    # Define colors for different classes
    colors = [
        (255, 0, 0), (0, 255, 0), (0, 0, 255), (255, 255, 0),
        (255, 0, 255), (0, 255, 255), (128, 0, 128), (255, 165, 0),
        (128, 128, 0), (0, 128, 128), (128, 0, 0), (0, 128, 0)
    ]
    
    # Extract predictions
    for *box, conf, cls in results.xyxy[0].cpu().numpy():
        if conf >= confidence_threshold:
            x1, y1, x2, y2 = map(int, box)
            class_id = int(cls)
            class_name = results.names[class_id]
            
            # Get color for this class
            color = colors[class_id % len(colors)]
            
            # Draw bounding box
            cv2.rectangle(img_with_boxes, (x1, y1), (x2, y2), color, 2)
            
            # Draw label
            label = f"{class_name}: {conf:.2f}"
            label_size = cv2.getTextSize(label, cv2.FONT_HERSHEY_SIMPLEX, 0.5, 2)[0]
            
            # Draw label background
            cv2.rectangle(img_with_boxes, (x1, y1 - label_size[1] - 10), 
                         (x1 + label_size[0], y1), color, -1)
            
            # Draw label text
            cv2.putText(img_with_boxes, label, (x1, y1 - 5), 
                       cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 255, 255), 2)
    
    return img_with_boxes

@app.post("/detect", response_model=DetectionResponse)
async def detect_objects(
    file: UploadFile = File(...),
    confidence_threshold: float = Form(0.5)
):
    """
    Detect objects in uploaded image using YOLOv5
    """
    if not model:
        raise HTTPException(status_code=500, detail="Model not loaded")
    
    # Validate file type
    if not file.content_type.startswith('image/'):
        raise HTTPException(status_code=400, detail="File must be an image")
    
    try:
        import time
        start_time = time.time()
        
        # Read image
        contents = await file.read()
        nparr = np.frombuffer(contents, np.uint8)
        image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        if image is None:
            raise HTTPException(status_code=400, detail="Invalid image file")
        
        # Get image dimensions
        height, width = image.shape[:2]
        
        # Run inference
        results = model(image)
        
        # Process results
        detections = []
        for *box, conf, cls in results.xyxy[0].cpu().numpy():
            if conf >= confidence_threshold:
                x1, y1, x2, y2 = box
                class_id = int(cls)
                class_name = results.names[class_id]
                
                detections.append(DetectionResult(
                    class_name=class_name,
                    confidence=float(conf),
                    bbox=[float(x1), float(y1), float(x2), float(y2)],
                    class_id=class_id
                ))
        
        # Draw bounding boxes
        image_with_boxes = draw_bounding_boxes(image, results, confidence_threshold)
        
        # Save processed image
        filename = f"{uuid.uuid4()}.jpg"
        output_path = Path("static") / filename
        cv2.imwrite(str(output_path), image_with_boxes)
        
        processing_time = time.time() - start_time
        
        return DetectionResponse(
            success=True,
            image_url=f"/static/{filename}",
            detections=detections,
            processing_time=processing_time,
            image_size=[width, height]
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing image: {str(e)}")

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "model_loaded": model is not None,
        "device": str(device) if device else "unknown"
    }

@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "YOLOv5 Object Detection API",
        "version": "1.0.0",
        "endpoints": {
            "detect": "/detect - POST - Upload image for object detection",
            "health": "/health - GET - Check API health",
            "docs": "/docs - GET - API documentation"
        }
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
