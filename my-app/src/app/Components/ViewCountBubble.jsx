import React from 'react';
import { Eye } from 'lucide-react';



function ViewCountBubble({ count, position = 'top-right' }) {
  const positionClasses = {
    'top-left': 'top-4 left-4',
    'top-right': 'top-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'bottom-right': 'bottom-4 right-4'
  };

  return (
    <div className={`fixed ${positionClasses[position]} z-50`}>
      <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 p-1 rounded-full shadow-2xl animate-pulse">
        <div className="bg-black/40 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20">
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-white animate-bounce" />
            <span className="text-white font-black text-sm tracking-wide">
              {count.toLocaleString()}
            </span>
          </div>
          
          {/* Animated glow effect */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-400/20 to-pink-400/20 animate-ping"></div>
        </div>
      </div>
      
      {/* Floating particles */}
      <div className="absolute -top-1 -right-1 w-2 h-2 bg-cyan-400 rounded-full animate-bounce"></div>
      <div className="absolute -bottom-1 -left-1 w-1.5 h-1.5 bg-yellow-400 rounded-full animate-pulse"></div>
    </div>
  );
}

export default ViewCountBubble;