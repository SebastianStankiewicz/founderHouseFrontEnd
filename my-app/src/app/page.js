"use client";
import PersuasionBar from "./Components/PersuasionBar";
import PlayerContainer from "./Components/PlayerContainer";
import GameHeader from "./Components/GameHeader";
import MobileVoting from "./Components/MobileVoting";
import React, { useEffect, useState } from "react";
import { useIsMobile } from "./Hooks/useIsMobile";
import { socket } from "./socket";
import ViewCountBubble from "./Components/ViewCountBubble";
export default function Home() {
  const [activePlayer, setActivePlayer] = useState(null);
  const [loadingGame, setIsLoadingGame] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [transport, setTransport] = useState("N/A");
  const isMobile = useIsMobile();

  const [viewCount, setViewCount ] = useState(0);
  const [userName, setUserName] = useState("Jacob");

  const [persuasionBarVotes, setPersuasionBarVotes] = useState(0);

  const [currentQuesiton, setCurrentQuestion] = useState("Game question")

  
  // State to hold the audio buffer for playback
  const [audioBuffer, setAudioBuffer] = useState(null);

  useEffect(() => {
    // Set up a simple active player rotation for demonstration
    const playerRotationInterval = setInterval(() => {
      setActivePlayer((prev) => {
        if (prev === null) return 0;
        if (prev === 0) return 1;
        return null;
      });
    }, 3000);

    // Only proceed if the socket is available from the context
    if (socket) {
      // Socket.IO event handlers
      const handleConcurrentViews = (data) => {
        console.log("Received concurrentViews:", data.totalViews);
        setViewCount(data.totalViews);
      };

      const handlePersuasionBarVotes = (data) => {
        setPersuasionBarVotes(data.totalVotes);
      };

      const handleGameData = (data) => {
        setCurrentQuestion(data.question);
        // Potentially set loadingGame to true if new round data means loading
        // setIsLoadingGame(true);
      };

      const handleAudioBytes = (data) => {
        console.log("Received audio bytes");
        const blob = new Blob([data], { type: "audio/mp3" });
        const url = URL.createObjectURL(blob);
        const audio = new Audio(url);
        audio.load();
        setAudioBuffer(audio);
      };

      const handleStartAt = (startEpoch) => {
        const now = Date.now() / 1000;
        const delay = Math.max(0, startEpoch - now) * 1000;

        console.log(`Scheduling audio to play in ${delay.toFixed(0)}ms`);

        setTimeout(() => {
          if (audioBuffer) {
            audioBuffer.play().catch((err) => {
              console.error("Playback error:", err);
            });
          } else {
            console.warn("Audio buffer not ready when start_at signal received.");
          }
        }, delay);
      };

      // Register event listeners
      socket.on("concurrentViews", handleConcurrentViews);
      socket.on("persuasionBarVotes", handlePersuasionBarVotes);
      socket.on("gameData", handleGameData);
      socket.on("audio_bytes_on_connection", handleAudioBytes);
      socket.on("start_at", handleStartAt);
    }

    // Cleanup function for useEffect
    return () => {
      clearInterval(playerRotationInterval); // Clear the active player interval
      if (socket) {
        socket.off("concurrentViews", handleConcurrentViews);
        socket.off("persuasionBarVotes", handlePersuasionBarVotes);
        socket.off("gameData", handleGameData);
        socket.off("audio_bytes_on_connection", handleAudioBytes);
        socket.off("start_at", handleStartAt);
      }

      // Revoke the Blob URL if audioBuffer exists to prevent memory leaks
      if (audioBuffer) {
        URL.revokeObjectURL(audioBuffer.src);
      }
    };
  }, [socket, audioBuffer]); // Depend on 'socket' to ensure listeners are registered once socket is available

  // LEFT IS NEGATIVE 1
  // RIGHT IS POSITIVE 1
  const sendVote = (side) => {
    // Check if socket is available before emitting
    if (socket && socket.connected) {
      // Use acknowledgment for critical actions like voting
      socket.emit('vote', {
        side: side,
        user: userName
      }, (response) => {
        if (response.status === 'ok') {
          console.log('Vote sent and acknowledged by server.');
          // Optionally, show a success message to the user
        } else {
          console.error('Vote failed:', response.message);
          // Optionally, show an error message to the user
        }
      });
    } else {
      console.log("Socket not connected. Vote not sent.");
      // Provide user feedback that they are not connected
    }
  };

  const getGameData = () => {
    // Check if socket is available before emitting
    if (socket && socket.connected) {
      socket.emit('play_clip');
      console.log("Requested 'play_clip' from server.");
    } else {
      console.log("Socket not connected. Cannot request clip.");
    }
  };
  // Mobile interface
  if (isMobile) {
    return <MobileVoting onVote={sendVote} onEmojiReact={null} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 relative overflow-hidden">
      {/* Animated background elements */}
      <ViewCountBubble count={viewCount} position="top-right" />
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-10 left-10 w-20 h-20 bg-cyan-400 rounded-full animate-bounce"></div>
        <div className="absolute top-32 right-16 w-16 h-16 bg-pink-400 rounded-full animate-pulse"></div>
        <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-yellow-400 rounded-full animate-ping"></div>
        <div className="absolute bottom-32 right-1/3 w-14 h-14 bg-green-400 rounded-full animate-bounce"></div>
      </div>

    

      {loadingGame ? (
        <>
          <div className=" min-h-screen flex justify-center flex-col items-center " >
            <div className="animate-spin rounded-full h-32 w-32 border-b-6 border-blue-500"></div>
            <div className="text-4xl text-white font-bold">Loading next round</div>
          </div>
        </>
      ) : (
        <div className="relative z-10 p-4">
          {/* Game Header */}
          <GameHeader
            question="A train is heading toward a child who will grow up to be a dictator. You can pull a lever to divert it to a clown heading to a children's hospital."
            round={2}
            maxRounds={5}
          />

          {/* Persuasion Bar */}
          <div className="mb-12">
            <PersuasionBar persuasionBarVotes={persuasionBarVotes} />
          </div>

          {/* Player Containers */}
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
        </div>
      )}
    </div>
  );
}
