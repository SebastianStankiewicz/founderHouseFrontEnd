"use client";
import React, { useEffect, useState, useRef } from "react";
import axios from "axios"; // ✅ Import Axios
import PersuasionBar from "./Components/PersuasionBar";
import PlayerContainer from "./Components/PlayerContainer";
import GameHeader from "./Components/GameHeader";
import MobileVoting from "./Components/MobileVoting";
import ViewCountBubble from "./Components/ViewCountBubble"; // Keep if you decide to poll for it
import { useIsMobile } from "./Hooks/useIsMobile";
// Removed: import { useSocket } from "./SocketProvider";

export default function Home() {
  // Removed: const socket = useSocket();

  const [activePlayer, setActivePlayer] = useState(null);
  const [loadingGame, setIsLoadingGame] = useState(true);
  // Removed: const [isConnected, setIsConnected] = useState(false);
  // Removed: const [transport, setTransport] = useState("N/A");
  const [viewCount, setViewCount] = useState(0); // You'd need to poll for this if needed
  const [userName, setUserName] = useState("Jacob");
  const [persuasionBarVotes, setPersuasionBarVotes] = useState(0); // You'd need to poll for this if needed
  const [currentQuestion, setCurrentQuestion] = useState("Game question");

  const isMobile = useIsMobile();
  const pollIntervalRef = useRef(null); // Ref to store the interval ID for game data
  const viewCountPollIntervalRef = useRef(null); // Ref for view count polling
  const persuasionPollIntervalRef = useRef(null); // Ref for persuasion bar polling

  const speakerPollIntervalRef = useRef(null);

  const [leftUserName, setLeftUserName] = useState("Player one");
  const [rightUserName, setRightUserName] = useState("Player one");

  // --- API Base URL (IMPORTANT: Configure this!) ---
  // Replace with your actual backend API URL.
  // For development, it might be 'http://localhost:5000' or similar.
  const API_BASE_URL =
    "https://0b810eef-b8e3-4b75-999f-1460007ce4ee-00-39fhpjg5zm1r4.kirk.replit.dev"; // <--- ⚠️ CHANGE THIS TO YOUR BACKEND URL

  // --- Axios Request Functions ---

  // 1. Fetch Game Data
  const fetchGameData = async () => {
    try {
      console.log("Polling for game data...");
      const response = await axios.get(`${API_BASE_URL}/game/data`, {
        params: { user: userName },
      });

      if (response.data && typeof response.data === "object") {
        if (response.data.showLoadScreen) {
          setIsLoadingGame(true);
        } else {
          setIsLoadingGame(false);
          console.log("Received game data:", response.data);
          setCurrentQuestion(response.data.question);
          setLeftUserName(response.data.leftName);
          setRightUserName(response.data.rightName);
          // Assuming activePlayer, round, maxRounds would also come from this data
          // setActivePlayer(response.data.activePlayer);
          // setRound(response.data.round);
          // setMaxRounds(response.data.maxRounds);
        }
      } else {
        console.warn("Received unexpected game data format:", response.data);
      }
    } catch (error) {
      console.error("Error fetching game data:", error);
      // Optional: Handle specific error states like connection issues
      // setIsLoadingGame(true); // Maybe keep loading screen if connection fails
    }
  };

  // 2. Send Vote
  const sendVote = async (side) => {
    try {
      // You might not need a response for a vote, or it could be a success message.
      const response = await axios.post(`${API_BASE_URL}/game/vote`, {
        side,
        user: userName,
      });
      console.log("Vote sent:", response.data);
      // If the backend sends updated persuasion bar data, you could update it here:
      // setPersuasionBarVotes(response.data.totalVotes);
      // For a quick demo, you might just rely on the next poll to update the bar.
    } catch (error) {
      console.error("Error sending vote:", error);
    }
  };

  // 3. Send Emoji Reaction
  const sendEmojiReaction = async (emoji) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/game/emoji`, {
        emoji,
        user: userName,
      });
      console.log("Emoji reaction sent:", response.data);
    } catch (error) {
      console.error("Error sending emoji reaction:", error);
    }
  };

  const getSpeaker = async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}/getSpeaker`);
      console.log("speaker sent:", response.data);
      if (response.data.success == true) {
        // Then call getAudioFileToPla

        if (response.data.speaker == leftUserName) {
          setActivePlayer(0);
        }
        if (response.data.speaker == rightUserName) {
          setActivePlayer(1);
        }
        await getAudioFileToPlay();
      }
    } catch (error) {
      console.error("Error sending emoji reaction:", error);
    }
  };

  const getAudioFileToPlay = async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}/getAudio`);
      const { audio_base64 } = response.data;

      if (!audio_base64) {
        console.warn("No audio received");
        return;
      }

      // Convert base64 to Blob
      const byteCharacters = atob(audio_base64);
      const byteArrays = [];

      for (let i = 0; i < byteCharacters.length; i += 1024) {
        const slice = byteCharacters.slice(i, i + 1024);
        const byteNumbers = new Array(slice.length);
        for (let j = 0; j < slice.length; j++) {
          byteNumbers[j] = slice.charCodeAt(j);
        }
        const byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
      }

      const audioBlob = new Blob(byteArrays, { type: "audio/mpeg" });
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      audio.play();

      audio.onended = () => {
        URL.revokeObjectURL(audioUrl);
      };

      console.log("Audio is playing...");
    } catch (error) {
      console.error("Error fetching/playing audio:", error);
    }
  };

  const pollSpeaker = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/getSpeaker`);
      if (response.data && typeof response.data === "object") {
        if (response.data.success) {
          console.log("Speaker found:", response.data);
        }
      }
    } catch (error) {
      console.error("Error polling speaker count:", error);
    }
  };

  // --- Polling Logic ---
  // If you still want "real-time" updates like view count or persuasion bar
  // without WebSockets, you'll need separate polling for them or include
  // them in your main game data poll.
  const pollViewCount = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/game/views`);
      if (response.data && typeof response.data === "object") {
        setViewCount(response.data.totalViews);
      }
    } catch (error) {
      console.error("Error polling view count:", error);
    }
  };

  const pollPersuasionBar = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/game/persuasion`);
      if (response.data && typeof response.data === "object") {
        setPersuasionBarVotes(response.data.totalVotes);
      }
    } catch (error) {
      console.error("Error polling persuasion bar:", error);
    }
  };

  useEffect(() => {
    const startPollingSpeaker = () => {
      if (speakerPollIntervalRef.current) {
        clearInterval(speakerPollIntervalRef.current);
      }
      getSpeaker();
      startPollingSpeaker.current = setInterval(getSpeaker, 3000);
    };

    // Start polling for game data
    const startPollingGameData = () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
      }
      fetchGameData(); // Initial immediate request
      pollIntervalRef.current = setInterval(fetchGameData, 3000); // Poll every 3 seconds
    };

    // Start polling for view count
    const startPollingViewCount = () => {
      if (viewCountPollIntervalRef.current) {
        clearInterval(viewCountPollIntervalRef.current);
      }
      pollViewCount(); // Initial immediate request
      viewCountPollIntervalRef.current = setInterval(pollViewCount, 5000); // Poll every 5 seconds
    };

    // Start polling for persuasion bar
    const startPollingPersuasionBar = () => {
      if (persuasionPollIntervalRef.current) {
        clearInterval(persuasionPollIntervalRef.current);
      }
      pollPersuasionBar(); // Initial immediate request
      persuasionPollIntervalRef.current = setInterval(pollPersuasionBar, 2000); // Poll every 2 seconds
    };

    startPollingGameData();
    startPollingViewCount();
    startPollingPersuasionBar();
    startPollingSpeaker();

    return () => {
      // Clear all intervals on component unmount
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
      }
      if (viewCountPollIntervalRef.current) {
        clearInterval(viewCountPollIntervalRef.current);
      }
      if (persuasionPollIntervalRef.current) {
        clearInterval(persuasionPollIntervalRef.current);
      }
      if (speakerPollIntervalRef.current) {
        clearInterval(speakerPollIntervalRef.current);
      }
    };
  }, [userName, leftUserName, rightUserName]); // Depend on userName if it changes, though for a demo it might be stati

  if (isMobile) {
    return (
      <MobileVoting
        onVote={sendVote}
        onEmojiReact={sendEmojiReaction} // Pass the Axios emoji function
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 relative overflow-hidden font-inter">
      <ViewCountBubble count={viewCount} position="top-right" />

      {/* Decorative background circles */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-10 left-10 w-20 h-20 bg-cyan-400 rounded-full animate-bounce"></div>
        <div className="absolute top-32 right-16 w-16 h-16 bg-pink-400 rounded-full animate-pulse"></div>
        <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-yellow-400 rounded-full animate-ping"></div>
        <div className="absolute bottom-32 right-1/3 w-14 h-14 bg-green-400 rounded-full animate-bounce"></div>
      </div>

      {loadingGame ? (
        <div className="min-h-screen flex justify-center flex-col items-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-6 border-blue-500"></div>
          <div className="text-4xl text-white font-bold mt-4">
            Loading next round...
          </div>
        </div>
      ) : (
        <div className="relative z-10 p-4 min-h-screen flex flex-col">
          <GameHeader
            question={currentQuestion}
            round={2} // Placeholder, ideally would come from game data
            maxRounds={5} // Placeholder, ideally would come from game data
          />

          <div className="mb-12 mt-8">
            <PersuasionBar persuasionBarVotes={persuasionBarVotes} />
          </div>

          <div className="flex flex-1 flex-col lg:flex-row items-center justify-center gap-8 max-w-6xl mx-auto w-full px-4">
            <PlayerContainer
              playerName={leftUserName}
              teamColor="blue"
              isActive={activePlayer === 0} // Placeholder
            />
            <PlayerContainer
              playerName={rightUserName}
              teamColor="red"
              isActive={activePlayer === 1} // Placeholder
            />
          </div>

          <div className="flex justify-center mt-auto py-8 gap-4 w-full">
            <button
              className="bg-blue-500 text-white px-8 py-4 rounded-xl shadow-lg hover:bg-blue-600 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300 text-lg font-semibold"
              onClick={() => sendVote(-1)}
            >
              Vote Left
            </button>
            <button
              className="bg-red-500 text-white px-8 py-4 rounded-xl shadow-lg hover:bg-red-600 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-red-300 text-lg font-semibold"
              onClick={() => sendVote(1)}
            >
              Vote Right
            </button>
          </div>

          {/* Connection status is no longer relevant for REST API polling */}
          {/* <div className="text-center mt-4 text-white text-sm opacity-80 pb-4">
            {isConnected ? (
              <>
                Connected via <span className="font-semibold">{transport}</span>
              </>
            ) : (
              <>Disconnected from server</>
            )}
          </div> */}
        </div>
      )}
    </div>
  );
}