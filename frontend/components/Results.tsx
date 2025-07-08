'use client';

import { DetectionResult } from '../types/detection';
import { Download, Eye } from 'lucide-react';

interface ResultsProps {
  results: {
    imageUrl: string;
    detections: DetectionResult[];
    processingTime: number;
    imageSize: [number, number];
    success?: boolean;
  } | null;
  isLoading: boolean;
}

export default function Results({ results, isLoading }: Readonly<ResultsProps>) {
  const getConfidenceWidthClass = (confidence: number): string => {
    if (confidence >= 0.9) return 'w-full';
    if (confidence >= 0.8) return 'w-5/6';
    if (confidence >= 0.7) return 'w-4/5';
    if (confidence >= 0.6) return 'w-3/5';
    if (confidence >= 0.5) return 'w-1/2';
    if (confidence >= 0.4) return 'w-2/5';
    if (confidence >= 0.3) return 'w-1/3';
    if (confidence >= 0.2) return 'w-1/5';
    return 'w-1/6';
  };

  const downloadImage = () => {
    if (!results) return;
    
    const link = document.createElement('a');
    link.href = `http://localhost:8000${results.imageUrl}`;
    link.download = `detection_result_${Date.now()}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isLoading) {
    return (
      <div className="card">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Processing image...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!results) {
    return (
      <div className="card">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Eye size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600">Upload an image to see detection results</p>
          </div>
        </div>
      </div>
    );
  }

  // Handle error case
  if (results.success === false) {
    return (
      <div className="card">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-red-500 text-2xl">⚠️</span>
            </div>
            <p className="text-gray-600 mb-2">Failed to process image</p>
            <p className="text-sm text-gray-500">Please try again with a different image</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Image Results */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Detection Results</h3>
          <button
            onClick={downloadImage}
            className="btn-secondary flex items-center space-x-2"
          >
            <Download size={16} />
            <span>Download</span>
          </button>
        </div>
        
        <div className="relative">
          <img
            src={`http://localhost:8000${results.imageUrl}`}
            alt="Detection results"
            className="w-full h-auto rounded-lg shadow-sm"
          />
        </div>
      </div>

      {/* Detections Table */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">
          Detected Objects ({results.detections.length})
        </h3>
        
        {results.detections.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600">No objects detected in this image</p>
            <p className="text-sm text-gray-500 mt-2">
              Try lowering the confidence threshold in settings
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Object
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Confidence
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Bounding Box
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {results.detections.map((detection, index) => (
                  <tr key={`${detection.class_name}-${detection.bbox.join('-')}-${index}`} className="hover:bg-gray-50">
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {detection.class_name}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                          <div
                            className={`bg-green-500 h-2 rounded-full transition-all duration-300 ${getConfidenceWidthClass(detection.confidence)}`}
                          ></div>
                        </div>
                        <span className="text-sm font-medium text-gray-900">
                          {(detection.confidence * 100).toFixed(1)}%
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      <div className="text-xs">
                        x: {Math.round(detection.bbox[0])}, y: {Math.round(detection.bbox[1])}
                        <br />
                        w: {Math.round(detection.bbox[2] - detection.bbox[0])}, 
                        h: {Math.round(detection.bbox[3] - detection.bbox[1])}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
