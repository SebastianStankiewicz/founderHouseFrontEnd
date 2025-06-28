import React from "react";

function PersuasionBar({ persuasionBarVotes }) {
  const blueWidth = `${Math.max(0, 50 - persuasionBarVotes / 2)}%`;
  const redWidth = `${Math.max(0, 50 + persuasionBarVotes / 2)}%`;

  return (
    <div className="w-full max-w-4xl mx-auto px-4">
      <div className="relative bg-gradient-to-r from-purple-900 via-purple-800 to-purple-900 p-1 rounded-2xl shadow-2xl">
        <div className="bg-black/20 rounded-xl p-4">
          <div className="flex h-16 rounded-xl overflow-hidden shadow-inner">
            <div
              className="bg-gradient-to-r from-blue-500 to-cyan-400 flex justify-center items-center relative group transition-all duration-300 hover:scale-105"
              style={{ width: blueWidth }}
            >
              <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <span className="text-white font-black text-2xl drop-shadow-lg relative z-10">
                { `${Math.round(100 - (persuasionBarVotes + 100) / 2)}%`}
              </span>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-cyan-300 rounded-full animate-pulse"></div>
            </div>

            <div
              className="bg-gradient-to-r from-red-500 to-pink-500 flex justify-center items-center relative group transition-all duration-300 hover:scale-105"
              style={{ width: redWidth }}
            >
              <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <span className="text-white font-black text-2xl drop-shadow-lg relative z-10">
                {`${Math.round((persuasionBarVotes + 100) / 2)}%`}
              </span>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-pink-300 rounded-full animate-pulse"></div>
            </div>
          </div>

          <div className="flex justify-between mt-3 text-white/80 text-sm font-bold">
            <span className="text-cyan-300">TEAM BLUE</span>
            <span className="text-pink-300">TEAM RED</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PersuasionBar;
