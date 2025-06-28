import React from "react";
import { Zap, Trophy } from "lucide-react";

function GameHeader({
  question,
  round,
  maxRounds,
}) {
  return (
    <div className="w-full max-w-6xl mx-auto px-4 mb-8">
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-6 py-2 rounded-full font-black text-sm shadow-lg mb-4">
          <Trophy className="w-4 h-4" />
          Game Number {3}
        </div>

        <div className="bg-gradient-to-r from-purple-900 via-pink-900 to-purple-900 rounded-3xl p-1 shadow-2xl">
          <div className="bg-black/40 backdrop-blur-sm rounded-3xl px-8 py-6 border border-white/20">
            <div className="flex items-center justify-center gap-3 mb-2">
              <Zap className="w-8 h-8 text-yellow-400 animate-pulse" />
              <h1 className="text-white font-black text-2xl md:text-4xl tracking-wide drop-shadow-lg">
                Trolley Trials
              </h1>
              <Zap className="w-8 h-8 text-yellow-400 animate-pulse" />
            </div>

            <div className="w-full max-w-4xl mx-auto">
              <div className="bg-gradient-to-r from-blue-600/20 to-pink-600/20 rounded-2xl p-6 border border-white/10">
                <h2 className="text-white text-xl md:text-2xl font-bold text-center leading-relaxed">
                {question}

                </h2>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GameHeader;
