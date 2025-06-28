import { useEffect, useState } from "react";

const SlotReveal = ({ question }) => {
  const [displayText, setDisplayText] = useState("🔄");
  const [rolling, setRolling] = useState(true);

  const placeholders = [
    "🍌",
    "🚀",
    "Mushroom",
    "Shell",
    "Star",
    "⚡️",
    "👻",
    "🎯",
    "🔥",
    "??",
    "🎲",
  ];

  useEffect(() => {
    let interval;
    setRolling(true);
    let spinTime = 800; // total spin time
    const stepTime = 50;

    interval = setInterval(() => {
      const random =
        placeholders[Math.floor(Math.random() * placeholders.length)];
      setDisplayText(random);
    }, stepTime);

    const timeout = setTimeout(() => {
      clearInterval(interval);
      setDisplayText(question);
      setRolling(false);
    }, spinTime);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [question]);

  return (
    <div>
      <h2
        key={question}
        className={`text-white text-xl md:text-2xl font-bold text-center leading-relaxed ${
          rolling ? "animate-spin-reel" : ""
        }`}
      >
        {displayText}
      </h2>
    </div>
  );
};

export default SlotReveal;
