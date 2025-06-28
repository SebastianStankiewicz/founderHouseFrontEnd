"use client";
import PersuasionBar from "./Components/PersuasionBar";
import PlayerContainer from "./Components/PlayerContainer";
import GameHeader from "./Components/GameHeader";
import MobileVoting from "./Components/MobileVoting";
import React, { useEffect, useState } from "react";
import { useIsMobile } from "./Hooks/useIsMobile";
import { socket } from "../socket";
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

  useEffect(() => {
    const interval = setInterval(() => {
      setActivePlayer((prev) => {
        if (prev === null) return 0;
        if (prev === 0) return 1;
        return null;
      });
    }, 3000);
  
    if (socket.connected) {
      onConnect();
    }
  
    function onConnect() {
      setIsConnected(true);
      setTransport(socket.io.engine.transport.name);
      socket.io.engine.on("upgrade", (transport) => {
        setTransport(transport.name);
      });
    }
  
    function onDisconnect() {
      setIsConnected(false);
      setTransport("N/A");
    }
  
    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
  
    socket.on("concurrentViews", (data) => {
      setViewCount(data.totalViews);

    });
  
    socket.on("persuasionBarVotes", (data) => {
      setPersuasionBarVotes(data.totalVotes);
    });
  
    socket.on("gameData", (data) => {
      setCurrentQuestion(data.question);
    });
  
    // ⬇️ Handle binary audio data
    let audioBuffer = null;
    socket.on("audio_bytes_on_connection", (data) => {
      console.log("Received audio bytes");
  
      const blob = new Blob([data], { type: "audio/mp3" }); // Adjust type if it's not MP3
      const url = URL.createObjectURL(blob);
      audioBuffer = new Audio(url);
      audioBuffer.load(); // optional, just in case
    });
  
    // ⬇️ Handle start time
    socket.on("start_at", (startEpoch) => {
      const now = Date.now() / 1000;
      const delay = Math.max(0, startEpoch - now) * 1000;
  
      console.log(`Scheduling audio to play in ${delay.toFixed(0)}ms`);
  
      setTimeout(() => {
        if (audioBuffer) {
          audioBuffer.play().catch((err) => {
            console.error("Playback error:", err);
          });
        }
      }, delay);
    });
  
    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("audio_bytes_on_connection");
      socket.off("start_at");
      socket.off("persuasionBarVotes");
      socket.off("gameData");
      socket.off("concurrentViews");
      clearInterval(interval);
    };
  }, []);
  

  //LEFT IS NEGATIVE 1
  //RIGHT IS POSTIVE 1
  function sendVote(side){
    if (isConnected){
      socket.emit('vote', {
        side: side,
        user: userName
      })

    } else{
      console.log("Not connected to the websocket.")
      return false
    }
  }

  function getGameData(){
    alert("Clicked")
    if(isConnected){
      socket.emit('play_clip')
      alert("asent play_clip");
    } else{

    }
  }

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
