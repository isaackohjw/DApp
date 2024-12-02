import React from "react";
import { VotingInstance, VOTING_RESULTS } from "@/global_var";

interface VotingResultsCardProps {
  instance: VotingInstance;
}

export const VotingResultsCard: React.FC<VotingResultsCardProps> = ({
  instance,
}) => {
  const totalVotes =
    instance.votedYes + instance.votedNo + instance.votedAbstain;

  // Calculate percentages
  const percentYes = ((instance.votedYes / totalVotes) * 100).toFixed(2);
  const percentNo = ((instance.votedNo / totalVotes) * 100).toFixed(2);
  const percentAbstain = ((instance.votedAbstain / totalVotes) * 100).toFixed(
    2
  );

  // Calculate voter progress
  const totalVotedPercentage = (
    (totalVotes / instance.totalVoters) *
    100
  ).toFixed(2);

  return (
    <div className="bg-gray-800 text-white p-2 pl-3 pr-3 rounded-md mb-6 shadow-lg border border-gray-700 relative w-64 hover:bg-gray-700 hover:scale-105 transform transition-all duration-300">
      {/* Title */}
      <h3 className="text-lg font-bold mb-1 text-center">{instance.title}</h3>

      {/* Voting Percentages with Progress Bars */}
      <div className="space-y-2 mb-4">
        {/* Yes option */}
        <div className="flex flex-col items-start space-y-1">
          <span className="text-sm">{VOTING_RESULTS.YES_LABEL}</span>
          <div className="w-full bg-gray-600 rounded-full h-4 relative">
            <div
              className="bg-green-600 h-4 rounded-full"
              style={{ width: `${percentYes}%` }}
            ></div>
            <div className="absolute inset-y-0 right-0 flex items-center justify-end pr-2 text-xs text-white">
              {instance.votedYes} Votes
            </div>
            <div className="absolute inset-y-0 left-0 w-full flex items-center justify-center text-sm font-semibold text-white">
              {percentYes}%
            </div>
          </div>
        </div>

        {/* No option */}
        <div className="flex flex-col items-start space-y-1">
          <span className="text-sm">{VOTING_RESULTS.NO_LABEL}</span>
          <div className="w-full bg-gray-600 rounded-full h-4 relative">
            <div
              className="bg-red-600 h-4 rounded-full"
              style={{ width: `${percentNo}%` }}
            ></div>
            <div className="absolute inset-y-0 right-0 flex items-center justify-end pr-2 text-xs text-white">
              {instance.votedNo} Votes
            </div>
            <div className="absolute inset-y-0 left-0 w-full flex items-center justify-center text-sm font-semibold text-white">
              {percentNo}%
            </div>
          </div>
        </div>

        {/* Abstain option */}
        <div className="flex flex-col items-start space-y-1">
          <span className="text-sm">{VOTING_RESULTS.ABSTAIN_LABEL}</span>
          <div className="w-full bg-gray-600 rounded-full h-4 relative">
            <div
              className="bg-yellow-600 h-4 rounded-full"
              style={{ width: `${percentAbstain}%` }}
            ></div>
            <div className="absolute inset-y-0 right-0 flex items-center justify-end pr-2 text-xs text-white">
              {instance.votedAbstain} Votes
            </div>
            <div className="absolute inset-y-0 left-0 w-full flex items-center justify-center text-sm font-semibold text-white">
              {percentAbstain}%
            </div>
          </div>
        </div>
      </div>

      {/* Voter Progress Bar */}
      <div className="mb-4 mt-6">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-bold">Votes:</span>
          <div className="w-full bg-gray-600 rounded-full h-4 relative">
            <div
              className="bg-blue-600 h-4 rounded-full"
              style={{ width: `${totalVotedPercentage}%` }}
            ></div>
            <div className="absolute inset-y-0 right-0 flex items-center justify-end pr-2 text-xs text-white">
              {instance.totalVoters}
            </div>
            <div className="absolute inset-y-0 left-0 w-full flex items-center justify-center text-sm font-semibold text-white">
              {totalVotes} Voted
            </div>
          </div>
        </div>
      </div>

      {/* Dates with Margin Top */}
      <div className="text-xs text-gray-500 space-y-1">
        <div>
          {VOTING_RESULTS.CREATED_LABEL}:{" "}
          {new Date(instance.createdAt).toLocaleDateString()}
        </div>
        <div>
          {VOTING_RESULTS.CLOSED_LABEL}:{" "}
          {new Date(instance.closedAt).toLocaleDateString()}
        </div>
      </div>
    </div>
  );
};
