'use client';

import React from "react";

interface VotingInstanceCardProps {
  instance: {
    id: number;
    description: string;
    deadline: number; // UNIX timestamp
    oneVotePerUser: boolean;
    status: string; // "Open", "Closed", "Suspended"
  };
  hasVoted: boolean; // Whether the user has voted
  onClick: () => void; // Callback for when the card is clicked
}

export const VotingInstanceCard: React.FC<VotingInstanceCardProps> = ({
  instance,
  hasVoted,
  onClick,
}) => {
  const { id, description, deadline, oneVotePerUser, status } = instance;

  return (
    <div
      className="bg-gray-800 text-white p-4 rounded-md shadow-md mb-6 border border-gray-700 relative hover:bg-gray-700 hover:scale-105 transform transition-all duration-300 cursor-pointer"
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
        className={`flex justify-center items-center px-2 py-1 rounded-full text-sm font-semibold mb-4 bg-opacity-60 border border-gray-700 ${
          getStatusStyles(status).bg
        }`}
      >
        <span className={getStatusStyles(status).text}>{status}</span>
      </div>

      {/* Deadline */}
      <div className="flex justify-center items-center mb-4">
        <span className="px-4 py-1 rounded-md text-blue-500 bg-blue-900 bg-opacity-70 text-sm font-medium">
          Deadline: {new Date(deadline * 1000).toLocaleString()}
        </span>
      </div>

      {/* Voting Rules */}
      <div className="flex justify-center items-center text-sm text-gray-400 mb-4">
        {oneVotePerUser ? "One vote per user" : "Multiple votes allowed"}
      </div>

      {/* Voting Status */}
      <div className="flex justify-center items-center text-sm font-bold mb-4">
        {hasVoted ? (
          <span className="text-green-500">Already Voted</span>
        ) : (
          <span className="text-red-500">Not Voted Yet</span>
        )}
      </div>

      {/* ID */}
      <div className="absolute bottom-1 left-2 text-xs text-gray-500">
        Session ID: {id}
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