// Role type
export type Role = "Voter" | "Admin" | "Owner";

// Role color mapping
export const roleColors: { [key in Role]: string } = {
  Owner: "bg-red-600",
  Admin: "bg-blue-600",
  Voter: "bg-orange-600",
};

// Enum for voting status
export enum VotingStatus {
  OPEN = "Open",
  CLOSED = "Closed",
  SUSPENDED = "Suspended",
}

// Enum for voting choices
export enum VotingChoice {
  YES = "Yes",
  NO = "No",
  ABSTAIN = "Abstain",
}

// VotingInstance type to represent each voting instance
export interface VotingInstance {
  id: number;
  title: string;
  description: string;
  status: VotingStatus;
  totalVoters: number;
  votedYes: number;
  votedNo: number;
  votedAbstain: number;
  createdAt: string;
  closedAt: string;
  timeLeft: string;
  hasVoted: boolean;
  createdByUser: boolean;
}

// For global variables, you can add any constants you want to use across your app
export const VOTING_STATUSES = [
  VotingStatus.OPEN,
  VotingStatus.CLOSED,
  VotingStatus.SUSPENDED,
];

export const VOTING_CHOICES = [
  VotingChoice.YES,
  VotingChoice.NO,
  VotingChoice.ABSTAIN,
];

// Labels for voting results
export const VOTING_RESULTS = {
  YES_LABEL: "Yes",
  NO_LABEL: "No",
  ABSTAIN_LABEL: "Abstain",
  VOTERS_LABEL: "Total Voters",
  VOTED_LABEL: "Voted",
  CREATED_LABEL: "Created At",
  CLOSED_LABEL: "Closed At",
};
