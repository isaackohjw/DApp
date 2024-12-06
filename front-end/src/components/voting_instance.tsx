'use client';

import React, { useEffect, useState } from "react";

interface VotingInstanceCardProps {
  instance: {
    id: number;
    description: string;
    deadline: number;
    oneVotePerUser: boolean;
    creationTime: number;
  };
  hasVoted: boolean; // Whether the user has voted
  onClick: () => void; // Callback for when the card is clicked
}

export const VotingInstanceCard: React.FC<VotingInstanceCardProps> = ({
  instance,
  hasVoted,
  onClick,
}) => {
  const { id, description, deadline, oneVotePerUser, creationTime } = instance;

  const [status, setStatus] = useState<string>(""); // Track status
  const [timeLeft, setTimeLeft] = useState<string>(""); // Track time left
  const formattedCreationTime = new Date(creationTime * 1000).toLocaleString();

  // Calculate and update the status dynamically
  useEffect(() => {
    const updateStatus = () => {
      const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
      if (currentTime < deadline) {
        setStatus("Open");
      } else {
        setStatus("Closed");
      }
    };

    updateStatus(); // Initial status calculation

    // Refresh status every second
    const interval = setInterval(updateStatus, 1000);

    return () => clearInterval(interval); // Cleanup on component unmount
  }, [deadline]);

  // Calculate and update the countdown timer dynamically
  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = Math.floor(Date.now() / 1000); // Current time in seconds
      const diff = deadline - now; // Difference in seconds

      if (diff <= 0) {
        setTimeLeft("Expired");
        return;
      }

      const days = Math.floor(diff / (60 * 60 * 24));
      const hours = Math.floor((diff % (60 * 60 * 24)) / (60 * 60));
      const minutes = Math.floor((diff % (60 * 60)) / 60);
      const seconds = diff % 60;

      setTimeLeft(
        `${days > 0 ? `${days}d ` : ""}${hours > 0 ? `${hours}h ` : ""}${minutes > 0 ? `${minutes}m ` : ""
        }${seconds}s`
      );
    };

    calculateTimeLeft(); // Initial calculation

    const interval = setInterval(calculateTimeLeft, 1000); // Update every second

    return () => clearInterval(interval); // Cleanup on unmount
  }, [deadline]);

  return (
    <div
      className="w-full bg-gray-800 text-white p-4 rounded-md shadow-md border border-gray-700 relative hover:bg-gray-700 hover:scale-105 transform transition-all duration-300 cursor-pointer"
      onClick={onClick}
    >
      {/* Description */}
      <h3
        className="text-lg font-bold text-white mb-4 text-center leading-tight line-clamp-2"
        style={{ minHeight: "2.8rem" }}
      >
        {description}
      </h3>

      {/* Status */}
      <div
        className={`flex justify-center items-center px-2 py-1 rounded-full text-sm font-semibold mb-4 bg-opacity-60 border border-gray-700 ${getStatusStyles(status).bg
          }`}
      >
        <span className={getStatusStyles(status).text}>{status}</span>
      </div>

      {/* Countdown */}
      <div className="flex justify-center items-center mb-4">
        <span className="px-4 py-1 rounded-md text-blue-500 bg-blue-900 bg-opacity-70 text-sm font-medium">
          {timeLeft === "Expired" ? "Deadline Expired" : `Time Left: ${timeLeft}`}
        </span>
      </div>

      {/* Voting Rules */}
      <div className="flex justify-center items-center text-sm text-gray-400 mb-4">
        {oneVotePerUser ? "Single vote" : "Weighted"}
      </div>

      {/* Voting Status */}
      <div className="absolute bottom-1 right-2 px-2 py-1 rounded text-base">
        {hasVoted ? (
          <div className="bg-green-900 bg-opacity-70 text-white px-2 py-1 rounded-lg font-semibold">
            Already Voted
          </div>
        ) : (
          <div className="bg-red-900 bg-opacity-70 text-white px-2 py-1 rounded-lg font-semibold">
            Not Voted Yet
          </div>
        )}
      </div>

      {/* ID */}
      <div className="absolute bottom-1 left-2 text-xs text-gray-500">
        Created: {formattedCreationTime}
      </div>
    </div>
  );
};

// Helper function remains the same
const getStatusStyles = (status: string) => {
  switch (status) {
    case "Open":
      return { bg: "bg-green-700", text: "text-green-400" };
    case "Closed":
      return { bg: "bg-red-700", text: "text-red-400" };
    case "Suspended":
      return { bg: "bg-yellow-700", text: "text-yellow-400" };
    default:
      return { bg: "bg-gray-700", text: "text-white" };
  }
};