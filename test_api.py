#!/usr/bin/env python3
"""
Test client for YOLOv5 Object Detection API
"""

import requests
import json
import time
from pathlib import Path
import argparse

def test_health_endpoint(base_url):
    """Test the health endpoint"""
    try:
        response = requests.get(f"{base_url}/health")
        if response.status_code == 200:
            print("✅ Health check passed")
            print(f"Response: {response.json()}")
            return True
        else:
            print(f"❌ Health check failed: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Health check error: {e}")
        return False

def test_detection_endpoint(base_url, image_path, confidence=0.5):
    """Test the detection endpoint"""
    try:
        # Check if image exists
        if not Path(image_path).exists():
            print(f"❌ Image file not found: {image_path}")
            return False
        
        # Prepare the request
        with open(image_path, 'rb') as f:
            files = {'file': f}
            data = {'confidence_threshold': confidence}
            
            print(f"🔍 Testing detection with image: {image_path}")
            print(f"📊 Confidence threshold: {confidence}")
            
            start_time = time.time()
            response = requests.post(f"{base_url}/detect", files=files, data=data)
            end_time = time.time()
            
            if response.status_code == 200:
                result = response.json()
                print("✅ Detection successful")
                print(f"⏱️  Request time: {end_time - start_time:.2f}s")
                print(f"⏱️  Processing time: {result['processing_time']:.2f}s")
                print(f"📏 Image size: {result['image_size']}")
                print(f"🎯 Objects detected: {len(result['detections'])}")
                
                if result['detections']:
                    print("\n📋 Detection results:")
                    for i, detection in enumerate(result['detections'], 1):
                        print(f"  {i}. {detection['class_name']}: {detection['confidence']:.2f}")
                
                return True
            else:
                print(f"❌ Detection failed: {response.status_code}")
                print(f"Error: {response.text}")
                return False
                
    except Exception as e:
        print(f"❌ Detection error: {e}")
        return False

def main():
    parser = argparse.ArgumentParser(description='Test YOLOv5 Object Detection API')
    parser.add_argument('--url', default='http://localhost:8000', help='API base URL')
    parser.add_argument('--image', help='Path to test image')
    parser.add_argument('--confidence', type=float, default=0.5, help='Confidence threshold')
    
    args = parser.parse_args()
    
    print("🧪 YOLOv5 Object Detection API Test Client")
    print("=" * 50)
    
    # Test health endpoint
    print("\n1. Testing health endpoint...")
    health_ok = test_health_endpoint(args.url)
    
    if not health_ok:
        print("❌ Health check failed, stopping tests")
        return
    
    # Test detection endpoint
    if args.image:
        print("\n2. Testing detection endpoint...")
        detection_ok = test_detection_endpoint(args.url, args.image, args.confidence)
        
        if detection_ok:
            print("\n✅ All tests passed!")
        else:
            print("\n❌ Detection test failed")
    else:
        # Try to find a test image
        test_images = [
            '../yolov5/data/images/bus.jpg',
            '../yolov5/data/images/zidane.jpg',
            'test.jpg',
            'sample.jpg'
        ]
        
        found_image = None
        for img in test_images:
            if Path(img).exists():
                found_image = img
                break
        
        if found_image:
            print(f"\n2. Testing detection endpoint with {found_image}...")
            detection_ok = test_detection_endpoint(args.url, found_image, args.confidence)
            
            if detection_ok:
                print("\n✅ All tests passed!")
            else:
                print("\n❌ Detection test failed")
        else:
            print("\n⚠️  No test image provided or found")
            print("   Use --image path/to/image.jpg to test detection")

if __name__ == "__main__":
    main()
