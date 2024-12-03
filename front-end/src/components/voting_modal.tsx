import React, { useState } from "react";
import { VotingInstance } from "@/global_var";
import { VotingChoice } from "@/global_var";

interface VotingModalProps {
  instance: VotingInstance;
  onClose: () => void;
  onVote: (instanceId: number, choice: VotingChoice) => void;
}

export const VotingModal: React.FC<VotingModalProps> = ({
  instance,
  onClose,
  onVote,
}) => {
  const [selectedChoice, setSelectedChoice] = useState<VotingChoice | null>(
    null
  );

  const handleChoiceClick = (choice: VotingChoice) => {
    setSelectedChoice(choice);
  };

  const handleVote = () => {
    if (selectedChoice !== null) {
      onVote(instance.id, selectedChoice);
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center"
      onClick={onClose}
    >
      <div
        className="bg-gray-900 p-6 rounded-lg max-w-md w-96 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-white text-xl"
        >
          ✖
        </button>
        <h2 className="text-xl font-bold mb-4 text-center">{instance.title}</h2>

        <p
          className="text-gray-400 mb-4 overflow-auto p-4 border border-gray-600 rounded-md bg-gray-800"
          style={{ maxHeight: "150px" }}
        >
          {instance.description}
        </p>

        {/* Voting Choices */}
        <div className="flex space-x-2 justify-center mb-4">
          {Object.values(VotingChoice).map((choice) => (
            <button
              key={choice}
              onClick={() => handleChoiceClick(choice)}
              className={`px-6 py-2 rounded-md text-white ${
                selectedChoice === choice
                  ? "bg-blue-700"
                  : choice === VotingChoice.YES
                  ? "bg-green-600"
                  : choice === VotingChoice.NO
                  ? "bg-red-600"
                  : "bg-yellow-600"
              } hover:bg-opacity-80 transition-all duration-200`}
            >
              {choice === VotingChoice.YES
                ? "Yes"
                : choice === VotingChoice.NO
                ? "No"
                : "Abstain"}
            </button>
          ))}
        </div>

        <div className="flex justify-center">
          <button
            onClick={handleVote}
            disabled={!selectedChoice}
            className="bg-gray-700 text-white px-3 py-2 rounded-md mt-4 hover:bg-gray-600 transition-all duration-200 w-20"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
