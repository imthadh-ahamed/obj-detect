'use client';

import { useState, useRef } from 'react';
import { Upload, Settings, X } from 'lucide-react';
import { DetectionResponse } from '../types/detection';

interface UploadFormProps {
  onDetectionStart: () => void;
  onDetectionComplete: (data: DetectionResponse) => void;
  isLoading: boolean;
}

export default function UploadForm({ 
  onDetectionStart, 
  onDetectionComplete, 
  isLoading 
}: Readonly<UploadFormProps>) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [confidence, setConfidence] = useState(0.5);
  const [showSettings, setShowSettings] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please select an image file');
        return;
      }
      
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setError('File size must be less than 10MB');
        return;
      }
      
      setSelectedFile(file);
      setError(null);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('Please select an image file');
        return;
      }
      
      if (file.size > 10 * 1024 * 1024) {
        setError('File size must be less than 10MB');
        return;
      }
      
      setSelectedFile(file);
      setError(null);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!selectedFile) {
      setError('Please select an image file');
      return;
    }

    onDetectionStart();
    setError(null);

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('confidence_threshold', confidence.toString());

    try {
      const response = await fetch('http://localhost:8000/detect', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail ?? 'Detection failed');
      }

      const data: DetectionResponse = await response.json();
      onDetectionComplete(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      onDetectionComplete({
        success: false,
        image_url: '',
        detections: [],
        processing_time: 0,
        image_size: [0, 0]
      });
    }
  };

  const clearFile = () => {
    setSelectedFile(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Upload Image</h2>
        <button
          type="button"
          onClick={() => setShowSettings(!showSettings)}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          title="Toggle settings"
          aria-label="Toggle detection settings"
        >
          <Settings size={20} aria-hidden="true" />
        </button>
      </div>

      {showSettings && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Confidence Threshold: {confidence.toFixed(2)}
          </label>
          <input
            type="range"
            min="0.1"
            max="1.0"
            step="0.05"
            value={confidence}
            onChange={(e) => setConfidence(parseFloat(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            title="Adjust confidence threshold"
            aria-label="Confidence threshold slider"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>0.1</span>
            <span>1.0</span>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <label
          htmlFor="file-upload"
          className="block border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary-500 transition-colors cursor-pointer"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <input
            id="file-upload"
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="sr-only"
            title="Select an image file"
            aria-label="Select an image file"
          />
          {selectedFile ? (
            <div className="space-y-4">
              <div className="flex items-center justify-center space-x-4">
                <img
                  src={URL.createObjectURL(selectedFile)}
                  alt="Preview"
                  className="w-32 h-32 object-cover rounded-lg"
                />
                <div className="text-left">
                  <p className="font-medium text-gray-900">{selectedFile.name}</p>
                  <p className="text-sm text-gray-500">
                    {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    clearFile();
                  }}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  title="Remove selected file"
                  aria-label="Remove selected file"
                >
                  <X size={20} aria-hidden="true" />
                  <span className="sr-only">Remove selected file</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <Upload size={48} className="mx-auto text-gray-400" />
              <div>
                <p className="text-lg font-medium text-gray-900">
                  Drop an image here or click to browse
                </p>
                <p className="text-sm text-gray-500">
                  PNG, JPG, GIF up to 10MB
                </p>
              </div>
              <span className="btn-secondary inline-block">
                Select File
              </span>
            </div>
          )}
        </label>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={!selectedFile || isLoading}
          className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              <span>Detecting Objects...</span>
            </>
          ) : (
            <>
              <Upload size={20} />
              <span>Detect Objects</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
