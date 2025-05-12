import React, { useRef, useState } from 'react';
import { Camera, Upload, X } from 'lucide-react';
import { ImageState } from '../types';

interface ImageUploaderProps {
  onImageSelected: (imageState: ImageState) => void;
  disabled?: boolean;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageSelected, disabled = false }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleFileChange = (file: File | null) => {
    if (!file) return;
    
    // Check if file is jpg or png
    const fileType = file.type;
    if (fileType !== 'image/jpeg' && fileType !== 'image/png') {
      alert('Please upload only JPG or PNG images');
      return;
    }

    const preview = URL.createObjectURL(file);
    onImageSelected({ file, preview });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileChange(e.target.files[0]);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const openFileDialog = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const activateCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      const videoElement = document.createElement('video');
      videoElement.srcObject = stream;
      videoElement.play();
      
      // Take picture after 3 seconds
      setTimeout(() => {
        const canvas = document.createElement('canvas');
        canvas.width = videoElement.videoWidth;
        canvas.height = videoElement.videoHeight;
        
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(videoElement, 0, 0);
          
          // Convert canvas to blob
          canvas.toBlob((blob) => {
            if (blob) {
              const file = new File([blob], 'camera-capture.jpg', { type: 'image/jpeg' });
              handleFileChange(file);
            }
            
            // Stop all video tracks
            stream.getTracks().forEach(track => track.stop());
          }, 'image/jpeg');
        }
      }, 3000);
    } catch (err) {
      console.error('Error accessing camera:', err);
      alert('Could not access camera. Please try uploading an image instead.');
    }
  };

  const baseClasses = `
    w-full h-64 border-2 border-dashed rounded-lg p-4 flex flex-col items-center justify-center
    transition-all duration-300 ease-in-out
    ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-blue-500 hover:bg-blue-50'}
    ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}
  `;

  return (
    <div 
      className={baseClasses}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      onClick={disabled ? undefined : openFileDialog}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        accept="image/jpeg,image/png"
        className="hidden"
        disabled={disabled}
      />
      
      <Upload className="w-12 h-12 text-blue-500 mb-4" />
      <h3 className="text-lg font-medium text-gray-700 mb-2">
        Drag and drop your image here
      </h3>
      <p className="text-sm text-gray-500 mb-4">
        Or click to browse your files (JPG or PNG only)
      </p>
      
      <div className="flex gap-4 mt-2">
        <button
          type="button"
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-300 flex items-center gap-2"
          onClick={(e) => {
            e.stopPropagation();
            openFileDialog();
          }}
          disabled={disabled}
        >
          <Upload className="w-4 h-4" />
          Upload Image
        </button>
        
        <button
          type="button"
          className="px-4 py-2 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 transition-colors duration-300 flex items-center gap-2"
          onClick={(e) => {
            e.stopPropagation();
            activateCamera();
          }}
          disabled={disabled}
        >
          <Camera className="w-4 h-4" />
          Take Photo
        </button>
      </div>
    </div>
  );
};

export default ImageUploader;