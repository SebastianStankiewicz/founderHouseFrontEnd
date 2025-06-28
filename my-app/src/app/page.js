"use client";
import React, { useEffect, useState } from "react";
import PersuasionBar from "./Components/PersuasionBar";
import PlayerContainer from "./Components/PlayerContainer";
import GameHeader from "./Components/GameHeader";
import MobileVoting from "./Components/MobileVoting";
import ViewCountBubble from "./Components/ViewCountBubble";
import { useIsMobile } from "./Hooks/useIsMobile";
import { useSocket } from "./SocketProvider"; // <-- ✅ use context socket

export default function Home() {
  const socket = useSocket(); // <-- ✅ get socket from context

  const [activePlayer, setActivePlayer] = useState(null);
  const [loadingGame, setIsLoadingGame] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [transport, setTransport] = useState("N/A");
  const [viewCount, setViewCount] = useState(0);
  const [userName, setUserName] = useState("Jacob");
  const [persuasionBarVotes, setPersuasionBarVotes] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState("Game question");

  const isMobile = useIsMobile();

  // Handle socket events
  useEffect(() => {
    if (!socket) return;

    const handleConnect = () => {
      setIsConnected(true);
      setTransport(socket.io.engine.transport.name);
      console.log("Connected to server");

      socket.emit("join_game", { user: userName });
    };

    const handleDisconnect = () => {
      setIsConnected(false);
      console.log("Disconnected");
    };

    const handleUpgrade = (transport) => {
      setTransport(transport.name);
    };

    const handleViewCount = (count) => {
      console.log(count)
      setViewCount(count.totalViews);
    };

    const handlePersuasionUpdate = (votes) => {
      console.log(votes);
      setPersuasionBarVotes(votes.totalVotes);
    };

    const handleGameData = (data) => {
      console.log(data)
      //setGameData(data);
      setCurrentQuestion(data.question);
      setIsLoadingGame(false); // Stop loading when data arrives
    };

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.io.engine.on("upgrade", handleUpgrade);
    socket.on("concurrentViews", handleViewCount);
    socket.on("persuasionBarVotes", handlePersuasionUpdate);
    socket.on("gameData", handleGameData);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.io.engine.off("upgrade", handleUpgrade);
      socket.off("concurrentViews", handleViewCount);
      socket.off("persuasionBarVotes", handlePersuasionUpdate);
    };
  }, [socket, userName]);

  // Send vote
  const sendVote = (side) => {
    if (socket && socket.connected) {
      socket.emit("vote", { side, user: userName }, (response) => {
        if (response.status === "ok") {
          console.log("Vote sent");
        } else {
          console.error("Vote failed:", response.message);
        }
      });
    } else {
      console.warn("Socket not connected");
    }
  };

  if (isMobile) {
    return <MobileVoting onVote={sendVote} onEmojiReact={null} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 relative overflow-hidden">
      <ViewCountBubble count={viewCount} position="top-right" />

      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-10 left-10 w-20 h-20 bg-cyan-400 rounded-full animate-bounce"></div>
        <div className="absolute top-32 right-16 w-16 h-16 bg-pink-400 rounded-full animate-pulse"></div>
        <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-yellow-400 rounded-full animate-ping"></div>
        <div className="absolute bottom-32 right-1/3 w-14 h-14 bg-green-400 rounded-full animate-bounce"></div>
      </div>

      {loadingGame ? (
        <div className="min-h-screen flex justify-center flex-col items-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-6 border-blue-500"></div>
          <div className="text-4xl text-white font-bold">Loading next round</div>
        </div>
      ) : (
        <div className="relative z-10 p-4">
          <GameHeader
            question={currentQuestion}
            round={2}
            maxRounds={5}
          />

          <div className="mb-12">
            <PersuasionBar persuasionBarVotes={persuasionBarVotes} />
          </div>

          <div className="flex flex-col lg:flex-row items-center justify-center gap-8 max-w-6xl mx-auto">
            <PlayerContainer
              playerName="Player one"
              teamColor="blue"
              isActive={activePlayer === 0}
            />
            <PlayerContainer
              playerName="Player two"
              teamColor="red"
              isActive={activePlayer === 1}
            />
          </div>

          <div className="flex justify-center mt-8 gap-4">
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
              onClick={() => sendVote(-1)}
            >
              Vote Left
            </button>
            <button
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
              onClick={() => sendVote(1)}
            >
              Vote Right
            </button>
          </div>

          <div className="text-center mt-4 text-white text-sm opacity-80">
            {isConnected ? (
              <>
                Connected via <span className="font-semibold">{transport}</span>
              </>
            ) : (
              <>Disconnected from server</>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
