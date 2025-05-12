import React, { useState } from 'react';
import { Camera, RefreshCw } from 'lucide-react';
import ImageUploader from './components/ImageUploader';
import ImagePreview from './components/ImagePreview';
import RatingDisplay from './components/RatingDisplay';
import LoadingSpinner from './components/LoadingSpinner';
import { uploadImageForRating } from './api/ratingService';
import { ImageState, RatingResponse } from './types';

function App() {
  const [imageState, setImageState] = useState<ImageState>({ file: null, preview: null });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [result, setResult] = useState<RatingResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleImageSelected = (newImageState: ImageState) => {
    if (imageState.preview) {
      URL.revokeObjectURL(imageState.preview);
    }
    
    setImageState(newImageState);
    setResult(null);
    setError(null);
  };

  const handleRemoveImage = () => {
    if (imageState.preview) {
      URL.revokeObjectURL(imageState.preview);
    }
    setImageState({ file: null, preview: null });
    setResult(null);
    setError(null);
  };

  const handleSubmit = async () => {
    if (!imageState.file) {
      setError('Please select an image first');
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const response = await uploadImageForRating(imageState.file);
      
      if (response.success && response.resp?.[0]) {
        setResult(response);
      } else {
        setError(response.error || 'Failed to get rating');
      }
    } catch (err) {
      console.error('Error during submission:', err);
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    handleRemoveImage();
  };

  const calculateRating = (resp: RatingResponse['resp'][0]) => {
    return (resp.angelicness + resp.sexyness) / 2;
  };

  const formatFeedback = (resp: RatingResponse['resp'][0]) => {
    return `Angelicness: ${resp.angelicness}
Model Agency Rate: ${resp['model agency rate']}
Sexyness: ${resp.sexyness}
Unique Features: ${resp['look unique features']}${resp.comment ? '\nComment: ' + resp.comment : ''}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <header className="text-center mb-12">
          <div className="mb-4 flex justify-center">
            <div className="p-3 bg-blue-500 text-white rounded-full">
              <Camera className="w-8 h-8" />
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
            Image Rating
          </h1>
          <p className="text-gray-600 text-lg">
            Upload a photo and get instant feedback
          </p>
        </header>

        <main className="bg-white rounded-2xl shadow-xl overflow-hidden transition-all duration-300">
          <div className="p-6 md:p-8">
            {result?.resp?.[0] && !isLoading ? (
              <div className="animate-fadeIn">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">Results</h2>
                  <button
                    type="button"
                    onClick={handleReset}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Try Another Image
                  </button>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <ImagePreview 
                    imageState={imageState} 
                    onRemove={handleRemoveImage} 
                    disabled={true}
                  />
                  
                  <RatingDisplay 
                    rating={calculateRating(result.resp[0])}
                    feedback={formatFeedback(result.resp[0])}
                  />
                </div>
              </div>
            ) : (
              <div>
                <h2 className="text-xl font-semibold mb-4">
                  Upload Your Image
                </h2>
                
                {!imageState.preview ? (
                  <ImageUploader 
                    onImageSelected={handleImageSelected} 
                    disabled={isLoading} 
                  />
                ) : (
                  <div>
                    <ImagePreview 
                      imageState={imageState} 
                      onRemove={handleRemoveImage}
                      disabled={isLoading}
                    />
                    
                    <div className="mt-6 flex justify-center">
                      <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={isLoading}
                        className={`
                          px-6 py-3 rounded-lg font-medium text-white 
                          flex items-center gap-2 transition-all duration-300
                          ${isLoading ? 
                            'bg-blue-400 cursor-not-allowed' : 
                            'bg-blue-500 hover:bg-blue-600 hover:shadow-md'
                          }
                        `}
                      >
                        {isLoading ? 'Processing...' : 'Get Rating'}
                      </button>
                    </div>
                  </div>
                )}
                
                {isLoading && (
                  <div className="mt-8 text-center">
                    <LoadingSpinner size="medium" />
                    <p className="text-gray-600 mt-2">Analyzing your image...</p>
                  </div>
                )}
                
                {error && (
                  <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-md">
                    <p>{error}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </main>
        
        <footer className="mt-8 text-center text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} Image Rater App</p>
        </footer>
      </div>
    </div>
  );
}

export default App;