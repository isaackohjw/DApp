"use client";

import React, { useEffect, useState } from "react";
import {
  createPublicClient,
  createWalletClient,
  http,
  Address,
  custom,
} from "viem";
import { holesky } from "viem/chains";
import { Organization } from "../artifacts/Organization.ts";

interface VotingModalProps {
  instanceId: number;
  contractAddress: string;
  walletAddress: string;
  onClose: () => void;
}

export const VotingModal: React.FC<VotingModalProps> = ({
  instanceId,
  contractAddress,
  walletAddress,
  onClose,
}) => {
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const [isVoting, setIsVoting] = useState(false);

  const viemClient = createPublicClient({
    chain: holesky,
    transport: http(),
  });

  const walletClient = createWalletClient({
    account: walletAddress as Address,
    chain: holesky,
    transport: custom(window.ethereum),
  });

  const handleChoiceClick = (choice: string) => {
    setSelectedChoice(choice);
  };

  const handleVote = async () => {
    if (!selectedChoice) {
      alert("Please select a voting choice.");
      return;
    }

    try {
      setIsVoting(true);

      const voteOption =
        selectedChoice === "YES" ? 1 : selectedChoice === "NO" ? 2 : 0;

      const { request } = await viemClient.simulateContract({
        address: contractAddress as Address,
        account: walletAddress as Address,
        abi: Organization,
        functionName: "vote",
        args: [BigInt(instanceId), voteOption],
      });

      const hash = await walletClient.writeContract(request);

      const receipt = await viemClient.waitForTransactionReceipt({ hash });

      if (receipt.status === "success") {
        alert("Vote successfully cast!");
      } else {
        alert("Voting transaction failed.");
      }
    } catch (error: any) {
      const errorMessage = error.message || "An unknown error occurred.";

      if (errorMessage.includes("Invalid session ID")) {
        alert("Error: The session ID is invalid.");
      } else if (errorMessage.includes("Voting closed")) {
        alert("Error: Voting for this session is closed.");
      } else if (errorMessage.includes("Insufficient token balance")) {
        alert("Error: You do not have enough tokens to vote.");
      } else if (errorMessage.includes("Already voted")) {
        alert("Error: You have already voted in this session.");
      } else {
        console.error("Error casting vote:", error);
        alert("Failed to cast vote. Please try again.");
      }
    } finally {
      setIsVoting(false);
      onClose(); // Close the modal
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center">
      <div className="bg-gray-900 p-6 rounded-lg max-w-md w-96">
        <h2 className="text-xl font-bold mb-4 text-center">
          Voting Session {instanceId}
        </h2>

        <div className="flex space-x-2 justify-center mb-4">
          {["YES", "NO", "ABSTAIN"].map((choice) => (
            <button
              key={choice}
              onClick={() => handleChoiceClick(choice)}
              className={`px-6 py-2 rounded-md text-white ${
                selectedChoice === choice
                  ? "bg-blue-700"
                  : choice === "YES"
                  ? "bg-green-600"
                  : choice === "NO"
                  ? "bg-red-600"
                  : "bg-yellow-600"
              } hover:bg-opacity-80 transition-all duration-200`}
            >
              {choice === "YES" ? "Yes" : choice === "NO" ? "No" : "Abstain"}
            </button>
          ))}
        </div>

        <div className="flex justify-center space-x-4">
          <button
            onClick={handleVote}
            disabled={isVoting}
            className={`bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 ${
              isVoting && "cursor-not-allowed"
            }`}
          >
            {isVoting ? "Voting..." : "Vote"}
          </button>

          <button
            onClick={onClose}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
