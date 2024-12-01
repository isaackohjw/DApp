"use client";

import React, { useState, useEffect } from "react";
import { Titlebar } from "@/components/titlebar";
import { OrganisationBox } from "@/components/organisation_box";
import { AddOrganisation } from "@/components/add_organisation"; // Import the modal component

// Simulated API Data (default values)
const defaultData = {
  orgName: "Tech Innovators",
  description:
    "An innovative tech organization focused on pushing boundaries in technology and digital solutions.",
  role: "Owner" as "Owner",
  token: "3 ETH",
  imageUrl: "/duck.avif",
};

export default function OrganisationPage() {
  const [orgData, setOrgData] = useState(defaultData);
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility

  // Simulating an API call to fetch organization data
  useEffect(() => {
    const fetchOrgData = async () => {
      setOrgData(defaultData);
    };

    fetchOrgData();
  }, []);

  const handleAddOrganisation = (data: {
    name: string;
    description: string;
    image: string;
    tokenAddress: string;
    adminWallets: string[]; // Change to an array
  }) => {
    console.log("New Organisation Created:", data);
    // Here, you can handle the new organisation data (e.g., update state or make an API call)
    setIsModalOpen(false); // Close the modal after adding
  };

  return (
    <div className="min-h-screen relative">
      {/* Titlebar */}
      <Titlebar name="John Doe" initial="J" />

      <p className="mt-2 text-base text-gray-300 font-body text-center">
        Select an organisation to begin voting, manage roles, or explore
        details.
      </p>

      <div className="flex flex-wrap gap-4 p-6">
        {/* Organisation 1 - Dynamic data */}
        <OrganisationBox
          name={orgData.orgName}
          profilePic={orgData.imageUrl}
          role={orgData.role}
          token={orgData.token}
          description={orgData.description}
        />

        {/* Organisation 2 - Static data */}
        <OrganisationBox
          name="Green Solutions"
          profilePic="/image1.jpg"
          role="Admin"
          token="10 ETH"
          description="A green tech company focused on sustainable solutions."
        />

        {/* Organisation 3 - Static data */}
        <OrganisationBox
          name="Future Horizons"
          profilePic="/koala.jpg"
          role="Voter"
          token="5 ETH"
          description="A nonprofit focused on empowering communities through technology."
        />
      </div>

      {/* Plus Button */}
      <div className="fixed bottom-6 right-6">
        <div className="group relative">
          {/* Plus Icon */}
          <button
            onClick={() => setIsModalOpen(true)} // Open the modal
            className="bg-gray-700 text-white w-10 h-10 rounded-full flex items-center justify-center shadow-lg hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 border-2 border-gray-300"
          >
            <span className="text-3xl font-thin">+</span>
          </button>

          {/* Tooltip */}
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <span className="flex justify-center items-center text-white text-center text-xs font-normal px-3 py-1 rounded-full font-body shadow-lg">
              Add Organisation
            </span>
          </div>
        </div>
      </div>

      {/* Add Organisation Modal */}
      {isModalOpen && (
        <AddOrganisation
          onClose={() => setIsModalOpen(false)} // Close the modal
          onCreate={handleAddOrganisation} // Handle the new organisation creation
        />
      )}
    </div>
  );
}
