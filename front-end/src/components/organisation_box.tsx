"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { Role, roleColors } from "@/global_var";

interface OrganisationBoxProps {
  name: string;
  profilePic?: string;
  role?: Role;
  token: string;
  balance?: number; // Add balance as an optional prop
  description?: string;
}

export const OrganisationBox: React.FC<OrganisationBoxProps> = ({
  name,
  profilePic,
  role,
  token,
  balance = 0, // Default to 0 if no balance is passed
  description,
}) => {
  const router = useRouter();
  const handleClick = () => {
    router.push(`/dashboard/${token}`); // Navigate to the dashboard page with the contract address
  };
  return (
    <div 
    className="w-80 rounded-lg shadow-md bg-gray-800 text-white p-4 font-body transform transition-all duration-300 hover:scale-105 hover:shadow-xl hover:bg-gray-700 cursor-pointer"
    onClick={handleClick}>
      {/* Organization Image */}
      {profilePic && (
        <div className="flex justify-center mb-2">
          <img
            src={profilePic}
            alt={`${name} Logo`}
            className="w-full h-32 object-cover rounded-md"
          />
        </div>
      )}

      {/* Organization Name */}
      <h2 className="text-lg font-bold text-center mb-2">{name}</h2>

      {/* Organization Description */}
      {description && (
        <p className="text-center mb-4 text-xs text-gray-400 line-clamp-2">
          {description}
        </p>
      )}

      {/* Organization Role */}
      {role && (
        <div className="flex justify-center mb-2">
          <button
            className={`py-1 px-2 rounded-lg text-white ${
              roleColors[role]
            } hover:bg-opacity-80 text-sm`}
          >
            {role}
          </button>
        </div>
      )}

      {/* Token Address */}
      <div className="flex justify-center mb-2">
        <div className="bg-gray-700 bg-opacity-80 text-white rounded-full px-3 py-1 text-xs font-semibold border-2 border-gray-500 transform transition-all duration-300 hover:bg-gray-400 hover:scale-105">
          {token}
        </div>
      </div>

      {/* Current Holdings */}
      <div className="flex justify-center">
        <span className="text-sm text-gray-300">
          Current Holdings: <strong>{balance}</strong>
        </span>
      </div>
    </div>
  );
};