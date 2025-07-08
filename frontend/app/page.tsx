'use client';

import { useState } from 'react';
import UploadForm from '../components/UploadForm';
import Results from '../components/Results';
import { DetectionResult } from '../types/detection';

export default function Home() {
  const [results, setResults] = useState<{
    imageUrl: string;
    detections: DetectionResult[];
    processingTime: number;
    imageSize: [number, number];
    success?: boolean;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleDetectionComplete = (data: any) => {
    // Transform the response to match our expected format
    if (data.success !== false) {
      setResults({
        imageUrl: data.image_url ?? '',
        detections: data.detections ?? [],
        processingTime: data.processing_time ?? 0,
        imageSize: data.image_size ?? [0, 0],
        success: data.success
      });
    } else {
      // Handle error case
      setResults({
        imageUrl: '',
        detections: [],
        processingTime: 0,
        imageSize: [0, 0],
        success: false
      });
    }
    setIsLoading(false);
  };

  const handleDetectionStart = () => {
    setIsLoading(true);
    setResults(null);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            YOLOv5 Object Detection
          </h1>
          <p className="text-xl text-gray-600">
            Upload an image and detect objects using our YOLOv5 model
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <UploadForm
              onDetectionStart={handleDetectionStart}
              onDetectionComplete={handleDetectionComplete}
              isLoading={isLoading}
            />
            
            {results && results.success !== false && (
              <div className="card">
                <h3 className="text-lg font-semibold mb-3">Detection Summary</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Objects detected:</span>
                    <span className="font-medium">{results.detections?.length ?? 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Processing time:</span>
                    <span className="font-medium">{results.processingTime?.toFixed(2) ?? '0.00'}s</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Image size:</span>
                    <span className="font-medium">{results.imageSize?.[0] ?? 0} × {results.imageSize?.[1] ?? 0}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div>
            <Results
              results={results}
              isLoading={isLoading}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
