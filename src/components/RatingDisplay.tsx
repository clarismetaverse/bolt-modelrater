import React from 'react';
import { Star } from 'lucide-react';

interface RatingDisplayProps {
  rating: number;
  feedback: string;
}

const RatingDisplay: React.FC<RatingDisplayProps> = ({ rating, feedback }) => {
  const maxStars = 5;
  const normalizedRating = (rating / 20); // Convert from 0-100 to 0-5 scale
  const fullStars = Math.floor(normalizedRating);
  const hasHalfStar = normalizedRating % 1 >= 0.5;
  
  const getRatingColor = () => {
    if (normalizedRating >= 4) return 'text-green-500';
    if (normalizedRating >= 2.5) return 'text-yellow-500';
    return 'text-red-500';
  };
  
  const ratingColor = getRatingColor();

  return (
    <div className="w-full bg-white rounded-lg shadow-lg p-6 transition-all duration-500 animate-fadeIn">
      <div className="flex flex-col items-center">
        <div className={`text-4xl font-bold mb-2 ${ratingColor}`}>
          {normalizedRating.toFixed(1)}
        </div>
        
        <div className="flex mb-6">
          {[...Array(maxStars)].map((_, i) => {
            if (i < fullStars) {
              return (
                <Star 
                  key={i} 
                  className={`w-8 h-8 ${ratingColor} fill-current`} 
                />
              );
            }
            else if (i === fullStars && hasHalfStar) {
              return (
                <div key={i} className="relative">
                  <Star className={`w-8 h-8 text-gray-300`} />
                  <div className="absolute top-0 left-0 overflow-hidden w-1/2">
                    <Star className={`w-8 h-8 ${ratingColor} fill-current`} />
                  </div>
                </div>
              );
            } 
            else {
              return <Star key={i} className="w-8 h-8 text-gray-300" />;
            }
          })}
        </div>
        
        <div className="w-full">
          <pre className="whitespace-pre-wrap font-mono text-sm bg-gray-50 p-4 rounded-md overflow-x-auto">
            {feedback}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default RatingDisplay