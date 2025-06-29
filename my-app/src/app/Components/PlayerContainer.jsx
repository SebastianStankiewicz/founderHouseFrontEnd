import React from "react";
import { User } from "lucide-react";

function PlayerContainer({ playerName, isActive = false, teamColor = "blue" }) {
  const colorClasses =
    teamColor === "blue"
      ? "from-blue-500 to-cyan-400 border-cyan-300"
      : "from-red-500 to-pink-500 border-pink-300";

  const glowClasses =
    teamColor === "blue" ? "shadow-cyan-400/50" : "shadow-pink-400/50";

  const waveColor = teamColor === "blue" ? "bg-cyan-400" : "bg-pink-400";

  return (
    <div
      className={`w-full max-w-md transform transition-all duration-300 hover:scale-105 ${
        isActive ? "scale-105" : ""
      }`}
    >
      <div className="bg-gradient-to-br from-purple-900/90 to-indigo-900/90 backdrop-blur-sm rounded-3xl border-2 border-white/20 shadow-2xl overflow-hidden">
        <div className="p-6">
          {/* Player Avatar with Talking Animation */}
          <div className="flex flex-col items-center mb-6">
            <div className="relative">
              <div
                className={`w-24 h-24 rounded-full bg-gradient-to-br ${colorClasses} border-4 flex items-center justify-center shadow-lg ${
                  isActive ? `shadow-xl ${glowClasses}` : ""
                } transition-all duration-300 relative z-10`}
              >
                <User className="w-10 h-10 text-white drop-shadow-lg" />
                {isActive && (
                  <div className="absolute inset-0 rounded-full border-2 border-white/30 animate-ping"></div>
                )}
              </div>

              {/* Floating Speech Indicators */}
              {isActive && (
                <>
                  <div
                    className="absolute -top-2 -right-2 w-4 h-4 bg-white/80 rounded-full animate-bounce"
                    style={{ animationDelay: "0s" }}
                  ></div>
                  <div
                    className="absolute -top-4 right-2 w-3 h-3 bg-white/60 rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                  <div
                    className="absolute -top-6 right-6 w-2 h-2 bg-white/40 rounded-full animate-bounce"
                    style={{ animationDelay: "0.4s" }}
                  ></div>
                </>
              )}
            </div>

            <h3 className="text-white font-bold text-lg tracking-wide mt-3">
              {playerName}
            </h3>
            <div
              className={`px-3 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r ${colorClasses} shadow-lg`}
            >
              {teamColor.toUpperCase()} TEAM
            </div>
          </div>

          {/* Main Talking Animation Area */}
          <div className="bg-black/30 rounded-2xl p-8 backdrop-blur-sm border border-white/10">
            <div className="flex flex-col items-center justify-center space-y-6">
              {/* Large Sound Wave Visualization */}
              <div className="flex items-end space-x-2">
                {[...Array(7)].map((_, i) => (
                  <div
                    key={i}
                    className={`w-3 rounded-full transition-all duration-200 ${
                      isActive ? waveColor : "bg-gray-600"
                    }`}
                    style={{
                      height: isActive ? "40px" : "12px",
                      animation: isActive
                        ? `wave 1.2s ease-in-out infinite ${i * 0.15}s`
                        : "none",
                    }}
                  ></div>
                ))}
              </div>

              {/* Pulsing Dots */}
              {isActive && (
                <div className="flex space-x-3">
                  {[...Array(3)].map((_, i) => (
                    <div
                      key={i}
                      className={`w-3 h-3 rounded-full ${waveColor} animate-pulse`}
                      style={{ animationDelay: `${i * 0.3}s` }}
                    ></div>
                  ))}
                </div>
              )}

              {/* Status Text */}
              <div className="text-center">
                <span
                  className={`text-sm font-semibold ${
                    isActive ? "text-white animate-pulse" : "text-gray-400"
                  }`}
                >
                  {isActive ? "Speaking..." : "Listening"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CSS Animation Styles */}
      <style jsx>{`
        @keyframes wave {
          0%,
          100% {
            height: 12px;
            opacity: 0.4;
          }
          50% {
            height: 48px;
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}

export default PlayerContainer;
