"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

type TitlebarProps = {
  name: string;
  initial: string;
  wallets: string[];
  onSelectWallet: (wallet: string) => void;
};

export function Titlebar({
  name = "User",
  initial = "U",
  wallets = [],
  onSelectWallet,
}: TitlebarProps) {
  const [showDropdown, setShowDropdown] = useState(false);
  const toggleDropdown = () => setShowDropdown(!showDropdown);
  const router = useRouter();
  const navigateToOrganizations = () => {
    router.push("/organisations"); // Navigate to the organizations page
  };

  return (
    <div className="text-white h-16 flex items-center px-4 bg-gray-900 fixed top-0 left-0 right-0 z-50">
      {/* Title */}
      <div className="flex justify-left ml-8 mt-2">
        <span
          className="text-2xl rainbow-text font-title leading-normal"
          onClick={navigateToOrganizations}>
          Voting Application
        </span>
      </div>

      {/* Profile Section */}
      <div className="flex items-center space-x-2 ml-auto text-body mt-2 mr-8 relative">
        <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center text-base font-body">
          {initial}
        </div>
        <span
          className="text-base font-body cursor-pointer"
          onClick={toggleDropdown}
        >
          {name}
        </span>

        {/* Dropdown */}
        {showDropdown && (
          <div className="absolute top-12 right-0 bg-gray-800 text-white rounded-lg shadow-lg p-4 w-48 z-10">
            <h3 className="text-sm font-bold mb-2">Select Wallet:</h3>
            <ul className="space-y-2">
              {wallets.map((wallet, index) => (
                <li key={index}>
                  <button
                    className="w-full text-left py-2 px-4 bg-gray-700 hover:bg-gray-600 rounded-lg"
                    onClick={() => {
                      onSelectWallet(wallet);
                      setShowDropdown(false); // Close dropdown after selection
                    }}
                  >
                    Wallet {index + 1}: {wallet.slice(0, 6)}...{wallet.slice(-4)}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}