import React, { useState } from "react";

interface VotingModalProps {
  title: string;
  description: string;
  isOpen: boolean;
  onClose: () => void;
  onSubmitVote: (vote: string) => void;
}

const VotingModal: React.FC<VotingModalProps> = ({
  title,
  description,
  isOpen,
  onClose,
  onSubmitVote,
}) => {
  const [vote, setVote] = useState<string | null>(null);
  const [isLocked, setIsLocked] = useState(false);

  const handleVote = (choice: string) => {
    if (!isLocked) {
      setVote(choice);
    }
  };

  const handleSubmit = () => {
    if (vote) {
      onSubmitVote(vote);
      setIsLocked(true); // Lock the voting after submitting
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-gray-800 text-white rounded-lg w-96 p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">{title}</h2>
          <button className="text-white" onClick={onClose}>
            X
          </button>
        </div>
        <p className="mb-4">{description}</p>
        <div className="space-x-4 mb-4">
          <button
            className={`px-4 py-2 rounded-md ${
              vote === "Yes" ? "bg-green-600" : "bg-gray-600"
            }`}
            onClick={() => handleVote("Yes")}
            disabled={isLocked}
          >
            Yes
          </button>
          <button
            className={`px-4 py-2 rounded-md ${
              vote === "No" ? "bg-red-600" : "bg-gray-600"
            }`}
            onClick={() => handleVote("No")}
            disabled={isLocked}
          >
            No
          </button>
          <button
            className={`px-4 py-2 rounded-md ${
              vote === "Abstain" ? "bg-yellow-600" : "bg-gray-600"
            }`}
            onClick={() => handleVote("Abstain")}
            disabled={isLocked}
          >
            Abstain
          </button>
        </div>
        <button
          className="w-full bg-blue-600 py-2 rounded-md"
          onClick={handleSubmit}
          disabled={isLocked || !vote}
        >
          Done
        </button>
      </div>
    </div>
  );
};

export default VotingModal;
