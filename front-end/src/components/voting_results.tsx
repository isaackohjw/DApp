interface VotingResultsCardProps {
  instance: {
    id: number;
    title: string;
    status: string;
  };
}

export const VotingResultsCard: React.FC<VotingResultsCardProps> = ({
  instance,
}) => {
  return (
    <div className="bg-gray-700 text-white p-4 rounded-md mb-4">
      <h3 className="text-lg">{instance.title}</h3>
      <p>Status: {instance.status}</p>
      <button className="bg-blue-600 px-4 py-2 mt-2 rounded-md">
        View Results
      </button>
    </div>
  );
};
