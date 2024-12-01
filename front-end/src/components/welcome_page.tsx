import React from "react";

interface WelcomeMessageProps {
  orgName: string;
  roles?: string[];
  onRoleClick: (role: string) => void;
}

export function WelcomeMessage({
  orgName,
  roles = ["Proposer", "Voter"],
  onRoleClick,
}: WelcomeMessageProps) {
  return (
    <div className="text-white h-screen flex flex-col items-center justify-start pt-24 font-title">
      <h1 className="text-4xl font-thin mb-4">Welcome to {orgName}</h1>
      <p className="text-lg mb-4">Sign in as:</p>

      {/* Display roles as clickable items */}
      <div className="flex gap-2 mb-4">
        {roles.length > 0 ? (
          roles.map((role, index) => (
            <button
              key={index}
              onClick={() => onRoleClick(role)} // Trigger role click handler
              className="bg-gray-600 text-white px-3 py-1 rounded-lg text-sm cursor-pointer hover:bg-gray-500"
            >
              {role}
            </button>
          ))
        ) : (
          <span className="text-gray-500 text-sm">No roles assigned</span>
        )}
      </div>
    </div>
  );
}
