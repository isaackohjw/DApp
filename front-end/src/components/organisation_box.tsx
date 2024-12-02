"use client";

import React from "react";
import { Role, roleColors } from "@/global_var";

// Define prop types for OrganisationBox
interface OrganisationBoxProps {
  name: string;
  profilePic: string;
  role: Role;
  token: string;
  description: string;
}

// OrganisationBox component to display details of an organization
export const OrganisationBox: React.FC<OrganisationBoxProps> = ({
  name,
  profilePic,
  role,
  token,
  description,
}) => {
  return (
    <div className="w-80 rounded-lg shadow-md bg-gray-800 text-white p-4 w-full font-body transform transition-all duration-300 hover:scale-105 hover:shadow-xl hover:bg-gray-700 cursor-pointer">
      {/* Organization Image */}
      <div className="flex justify-center mb-2">
        <img
          src={profilePic}
          alt={`${name} Logo`}
          className="w-full h-32 object-cover rounded-md"
        />
      </div>

      {/* Organization Name */}
      <h2 className="text-lg font-bold text-center mb-2">{name}</h2>

      {/* Organization Description */}
      <p className="text-center mb-4 text-xs text-gray-400 line-clamp-2">
        {description}
      </p>

      {/* Organization Role */}
      <div className="flex justify-center mb-2">
        <button
          className={`py-1 px-2 rounded-lg text-white ${roleColors[role]} hover:bg-opacity-80 text-sm`}
        >
          {role}
        </button>
      </div>

      {/* Token Used + Amount */}
      <div className="flex justify-center mb-2">
        <div className="bg-gray-700 bg-opacity-80 text-white rounded-full px-3 py-1 text-xs font-semibold border-2 border-gray-500 transform transform transition-all duration-300 hover:bg-gray-400 hover:scale-105">
          {token}
        </div>
      </div>
    </div>
  );
};
