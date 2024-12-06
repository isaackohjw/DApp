import React from "react";
import { VOTING_RESULTS } from "@/global_var";

export interface VotingInstance {
  sessionId: number;
  title: string;
  votedYes: number;
  votedNo: number;
  votedAbstain: number;
  totalVoters: number;
  deadline: number;
  createdAt: number;
}

interface VotingResultsCardProps {
  instance: VotingInstance;
}

export const VotingResultsCard: React.FC<VotingResultsCardProps> = ({
  instance,
}) => {
  const totalVotes =
    instance.votedYes + instance.votedNo + instance.votedAbstain;

  // Avoid division by zero
  const percentYes = totalVotes > 0 ? ((instance.votedYes / totalVotes) * 100).toFixed(2) : "0.00";
  const percentNo = totalVotes > 0 ? ((instance.votedNo / totalVotes) * 100).toFixed(2) : "0.00";
  const percentAbstain = totalVotes > 0 ? ((instance.votedAbstain / totalVotes) * 100).toFixed(2) : "0.00";

  const totalVotedPercentage =
    instance.totalVoters > 0
      ? ((totalVotes / instance.totalVoters) * 100).toFixed(2)
      : "0.00";
      

  return (
    <div className="w-full bg-gray-800 text-white p-3 rounded-md mb-6 shadow-lg border border-gray-700 relative hover:bg-gray-700 hover:scale-105 transform transition-all duration-300">
      {/* Title */}
      <h3 className="text-lg font-bold mb-3 text-center">{instance.title}</h3>

      {/* Voting Percentages */}
      <div className="space-y-3 mb-6">
        {[
          {
            label: VOTING_RESULTS.YES_LABEL,
            count: instance.votedYes,
            percent: percentYes,
            color: "bg-green-600",
          },
          {
            label: VOTING_RESULTS.NO_LABEL,
            count: instance.votedNo,
            percent: percentNo,
            color: "bg-red-600",
          },
          {
            label: VOTING_RESULTS.ABSTAIN_LABEL,
            count: instance.votedAbstain,
            percent: percentAbstain,
            color: "bg-yellow-600",
          },
        ].map((option) => (
          <div key={option.label} className="flex flex-col space-y-1">
            <span className="text-sm">{option.label}</span>
            <div className="w-full bg-gray-600 rounded-full h-4 relative">
              <div
                className={`${option.color} h-4 rounded-full`}
                style={{ width: `${option.percent}%` }}
              ></div>
              <div className="absolute inset-y-0 right-0 flex items-center justify-end pr-2 text-xs text-white">
                {option.count} Votes
              </div>
              <div className="absolute inset-y-0 left-0 w-full flex items-center justify-center text-sm font-semibold text-white">
                {option.percent}%
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Voter Progress Bar */}
      <div className="mb-6">
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

      {/* Dates */}
      <div className="text-xs text-gray-500 space-y-1">
        <div>
          {VOTING_RESULTS.CREATED_LABEL}:{" "}
          {new Date(instance.createdAt*1000).toLocaleString()}
        </div>
        <div>
          {VOTING_RESULTS.CLOSED_LABEL}:{" "}
          {new Date(instance.deadline*1000).toLocaleString()}
        </div>
      </div>
    </div>
  );
};