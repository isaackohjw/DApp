interface VotingInstanceCardProps {
  instance: {
    id: number;
    title: string;
    status: string; // "Open" | "Closed" | "Suspended"
    createdAt?: string;
    timeLeft?: string;
    hasVoted?: boolean;
  };
}

export const VotingInstanceCard: React.FC<VotingInstanceCardProps> = ({
  instance,
}) => {
  const {
    id,
    title,
    status,
    createdAt = new Date().toISOString(),
    timeLeft = "N/A",
    hasVoted = false,
  } = instance;

  return (
    <div className="bg-gray-800 text-white p-2 pl-3 rounded-md shadow-md mb-6 border border-gray-700 relative w-52 hover:bg-gray-700 hover:scale-105 transform transition-all duration-300">
      {/* Title */}
      <h3
        className="text-lg font-bold text-white mb-4 text-center leading-tight line-clamp-2"
        style={{ minHeight: "2.8rem" }}
      >
        {instance.title}
      </h3>

      {/* Status */}
      <div
        className={`flex justify-center items-center px-1 py-1 rounded-full text-sm font-semibold mb-4 bg-opacity-60 border border-gray-700 ${
          getStatusStyles(status).bg
        }`}
      >
        <span className={getStatusStyles(status).text}>{status}</span>
      </div>

      {/* Time Left */}
      <div className="flex justify-center items-center mb-8">
        <span className="px-4 py-1 rounded-md text-green-500 bg-green-900 bg-opacity-70 text-sm font-medium">
          Time Left: {timeLeft}
        </span>
      </div>

      {/* Created At */}
      <div className="absolute bottom-1 left-2 text-xs text-gray-500">
        Created: {new Date(createdAt).toLocaleDateString()}
      </div>

      {/* Vote Status Box */}
      <div
        className={`absolute bottom-1 right-2 px-1 py-1 rounded text-xs font-bold ${
          hasVoted ? "bg-green-500 text-black" : "bg-gray-700 text-white"
        }`}
      >
        {hasVoted ? "Voted" : "To Vote"}
      </div>
    </div>
  );
};

// Helper function remains the same
const getStatusStyles = (status: string) => {
  switch (status) {
    case "Open":
      return { bg: "bg-green-700", text: "text-green-400" };
    case "Closed":
      return { bg: "bg-red-700", text: "text-red-400" };
    case "Suspended":
      return { bg: "bg-yellow-700", text: "text-yellow-400" };
    default:
      return { bg: "bg-gray-700", text: "text-white" };
  }
};
