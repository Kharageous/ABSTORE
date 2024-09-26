import React, { useEffect, useState } from "react";

const colors = [
  "bg-red-500",
  "bg-yellow-500",
  "bg-green-500",
  "bg-blue-500",
  "bg-indigo-500",
  "bg-purple-500",
  "bg-pink-500",
  "bg-orange-500",
  "bg-teal-500",
  "bg-cyan-500",
];

const MousePointerEffect = () => {
  const [trail, setTrail] = useState([]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setTrail((prev) => [...prev, { x: e.clientX, y: e.clientY }].slice(-10)); // Limit to last 10 positions for a smoother trail
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-50">
      {trail.map((pos, index) => (
        <div
          key={index}
          className={`absolute rounded-full transition-transform duration-200 ease-out ${
            colors[index % colors.length]
          }`}
          style={{
            width: `${20 - index * 2}px`, // Dots decrease in size
            height: `${20 - index * 2}px`,
            left: `${pos.x}px`,
            top: `${pos.y}px`,
            opacity: 1 - index * 0.1, // Dots fade out gradually
            transform: "translate(-50%, -50%)",
            boxShadow: `0 0 10px ${colors[index % colors.length].replace(
              "bg",
              "text"
            )}`,
          }}
        />
      ))}
    </div>
  );
};

export default MousePointerEffect;
