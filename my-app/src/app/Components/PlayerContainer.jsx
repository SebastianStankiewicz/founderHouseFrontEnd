import React from "react";
import { User } from "lucide-react";

function PlayerContainer({
  playerName = "AI Agent",
  isActive = false,
  teamColor = "blue",
}) {
  const colorClasses =
    teamColor === "blue"
      ? "from-blue-500 to-cyan-400 border-cyan-300"
      : "from-red-500 to-pink-500 border-pink-300";

  const glowClasses =
    teamColor === "blue" ? "shadow-cyan-400/50" : "shadow-pink-400/50";

  return (
    <div
      className={`w-full max-w-md transform transition-all duration-300 hover:scale-105 ${
        isActive ? "scale-105" : ""
      }`}
    >
      <div className="bg-gradient-to-br from-purple-900/90 to-indigo-900/90 backdrop-blur-sm rounded-3xl border-2 border-white/20 shadow-2xl overflow-hidden">
        <div className="p-6">
          {/* Player Avatar */}
          <div className="flex flex-col items-center mb-6">
            <div
              className={`w-24 h-24 rounded-full bg-gradient-to-br ${colorClasses} border-4 flex items-center justify-center mb-3 shadow-lg ${
                isActive ? `shadow-xl ${glowClasses}` : ""
              } transition-all duration-300`}
            >
              <User className="w-10 h-10 text-white drop-shadow-lg" />
              {isActive && (
                <div className="absolute inset-0 rounded-full border-2 border-white/50 animate-ping"></div>
              )}
            </div>
            <h3 className="text-white font-bold text-lg tracking-wide">
              {playerName}
            </h3>
            <div
              className={`px-3 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r ${colorClasses} shadow-lg`}
            >
              {teamColor.toUpperCase()} TEAM
            </div>
          </div>

          {/* Argument Display */}
          <div className="bg-black/30 rounded-2xl p-4 backdrop-blur-sm border border-white/10">
            <div className="min-h-32 flex items-center justify-center">
              <p className="text-white/90 text-center text-sm leading-relaxed italic">
                {isActive ? (
                  <span className="animate-pulse">
                    🤖 Crafting the perfect argument...
                  </span>
                ) : (
                  "Current AI agent's compelling argument text will appear here. Get ready for some serious persuasion!"
                )}
              </p>
            </div>
          </div>

          {/* Status Indicator */}
          <div className="flex justify-center mt-4">
            <div
              className={`px-4 py-2 rounded-full text-xs font-bold ${
                isActive
                  ? "bg-green-500 text-white animate-pulse"
                  : "bg-gray-600 text-gray-300"
              } transition-all duration-300`}
            >
              {isActive ? "● ARGUING" : "○ WAITING"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PlayerContainer;
