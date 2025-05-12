import React from 'react';
import { X } from 'lucide-react';
import { ImageState } from '../types';

interface ImagePreviewProps {
  imageState: ImageState;
  onRemove: () => void;
  disabled?: boolean;
}

const ImagePreview: React.FC<ImagePreviewProps> = ({ 
  imageState, 
  onRemove,
  disabled = false
}) => {
  if (!imageState.preview) return null;
  
  return (
    <div className="relative mt-4 w-full h-64 bg-gray-100 rounded-lg overflow-hidden transition-all duration-300 ease-in-out">
      <img 
        src={imageState.preview} 
        alt="Preview" 
        className="w-full h-full object-contain"
      />
      {!disabled && (
        <button 
          type="button"
          onClick={onRemove}
          className="absolute top-2 right-2 bg-white bg-opacity-70 rounded-full p-1 hover:bg-opacity-100 transition-all duration-200"
        >
          <X className="w-5 h-5 text-gray-700" />
        </button>
      )}
    </div>
  );
};

export default ImagePreview;