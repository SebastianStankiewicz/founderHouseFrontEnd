"use client"
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';



function MobileVoting({ onVote, onEmojiReact }) {
  const [selectedSide, setSelectedSide] = useState(null);
  const [selectedEmoji, setSelectedEmoji] = useState(null);

  const emojis = ['🔥', '🤡', '😂', '🤔', '👏'];

  const handleVote = (side) => {
    setSelectedSide(side);
    onVote(side);


    
    // Add haptic feedback if available
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }
  };

  const handleEmojiClick = (emoji) => {
    setSelectedEmoji(emoji);
    onEmojiReact(emoji);
    
    // Add haptic feedback if available
    if (navigator.vibrate) {
      navigator.vibrate(30);
    }
    
    // Reset emoji selection after animation
    setTimeout(() => setSelectedEmoji(null), 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex flex-col">
      {/* Header */}
      <div className="p-4 text-center">
        <h1 className="text-white font-black text-2xl mb-2">CAST YOUR VOTE!</h1>
        <p className="text-white/80 text-sm">Choose a side, then react!</p>
      </div>

      {/* Voting Buttons */}
      <div className="flex-1 flex">
        {/* Left Side */}
        <button
          onClick={() => handleVote(-1)}
          className={`flex-1 bg-gradient-to-br from-blue-500 to-cyan-400 active:from-blue-600 active:to-cyan-500 flex flex-col items-center justify-center text-white font-black text-xl transition-all duration-200 active:scale-95 ${
            selectedSide === 'left' ? 'ring-4 ring-white/50' : ''
          }`}
        >
          <ChevronLeft className="w-16 h-16 mb-4" />
          <span>TEAM BLUE</span>
          {selectedSide === 'left' && (
            <div className="mt-2 text-sm animate-pulse">✓ VOTED!</div>
          )}
        </button>

        {/* Right Side */}
        <button
          onClick={() => handleVote(1)}
          className={`flex-1 bg-gradient-to-br from-red-500 to-pink-500 active:from-red-600 active:to-pink-600 flex flex-col items-center justify-center text-white font-black text-xl transition-all duration-200 active:scale-95 ${
            selectedSide === 'right' ? 'ring-4 ring-white/50' : ''
          }`}
        >
          <ChevronRight className="w-16 h-16 mb-4" />
          <span>TEAM RED</span>
          {selectedSide === 'right' && (
            <div className="mt-2 text-sm animate-pulse">✓ VOTED!</div>
          )}
        </button>
      </div>

      {/* Emoji Reactions */}
      <div className="p-6 bg-black/20 backdrop-blur-sm">
        <h3 className="text-white font-bold text-center mb-4">REACT!</h3>
        <div className="flex justify-center gap-4">
          {emojis.map((emoji, index) => (
            <button
              key={index}
              onClick={() => handleEmojiClick(emoji)}
              className={`w-14 h-14 bg-white/10 hover:bg-white/20 active:bg-white/30 rounded-full flex items-center justify-center text-2xl transition-all duration-200 hover:scale-110 active:scale-95 ${
                selectedEmoji === emoji ? 'animate-bounce bg-yellow-400/30 scale-125' : ''
              }`}
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default MobileVoting;