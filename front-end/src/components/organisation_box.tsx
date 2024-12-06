"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { Role, roleColors } from "@/global_var";

interface OrganisationBoxProps {
  name: string;
  profilePic?: string;
  role: Role;
  token: string;
  balance: number;
  tokenSymbol: string;
}

export const OrganisationBox: React.FC<OrganisationBoxProps> = ({
  name,
  profilePic,
  role,
  token,
  balance,
  tokenSymbol,
}) => {
  const router = useRouter();
  const handleClick = () => {
    router.push(`/dashboard/${token}`); // Navigate to the dashboard page with the contract address
  };
  return (
    <div 
    className="w-full rounded-lg shadow-md bg-gray-800 text-white p-4 font-body transform transition-all duration-300 hover:scale-105 hover:shadow-xl hover:bg-gray-700 cursor-pointer"
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

      {/* Token Address */}
      <div className="flex justify-center mb-2">
        <div className="bg-opacity-80 text-gray-400 rounded-full px-3 py-1 text-xs">
          {token}
        </div>
      </div>

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

      {/* Current Holdings */}
      <div className="flex justify-center mb-2">
        <div className="bg-gray-700 bg-opacity-80 text-white rounded-full px-3 py-1 text-xs font-semibold border-2 border-gray-500 transform transition-all duration-300 hover:bg-gray-400 hover:scale-105">
          {balance} {tokenSymbol}
        </div>
      </div>
    </div>
  );
};