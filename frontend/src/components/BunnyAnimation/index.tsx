import React from 'react';

export const BunnyAnimation: React.FC = () => {
  return (
    <div className="hidden lg:block fixed right-8 top-0 h-full w-32 overflow-hidden pointer-events-none">
      <div className="animate-hop absolute">
        <div className="relative">
          {/* R1 Bunny */}
          <div className="w-16 h-16 bg-gray-200 rounded-full relative">
            {/* Ears */}
            <div className="absolute -top-8 left-2 w-4 h-10 bg-gray-200 rounded-full transform -rotate-12"></div>
            <div className="absolute -top-8 right-2 w-4 h-10 bg-gray-200 rounded-full transform rotate-12"></div>
            {/* Eyes */}
            <div className="absolute top-4 left-3 w-2 h-2 bg-black rounded-full"></div>
            <div className="absolute top-4 right-3 w-2 h-2 bg-black rounded-full"></div>
            {/* Nose */}
            <div className="absolute top-6 left-1/2 transform -translate-x-1/2 w-3 h-2 bg-pink-300 rounded-full"></div>
          </div>
          {/* Carrots */}
          <div className="carrot-trail">
            {[...Array(5)].map((_, i) => (
              <div 
                key={i} 
                className="absolute w-8 h-8"
                style={{
                  top: `${i * 120}px`,
                  right: `${Math.sin(i * 0.5) * 20}px`,
                  transform: 'rotate(45deg)'
                }}
              >
                <div className="w-6 h-6 bg-orange-500 rounded-full"></div>
                <div className="absolute top-4 left-2 w-4 h-8 bg-green-500 transform -rotate-45"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}; 