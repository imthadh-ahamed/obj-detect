export interface DetectionResult {
  class_name: string;
  confidence: number;
  bbox: [number, number, number, number]; // [x1, y1, x2, y2]
  class_id: number;
}

export interface DetectionResponse {
  success: boolean;
  image_url: string;
  detections: DetectionResult[];
  processing_time: number;
  image_size: [number, number]; // [width, height]
}
