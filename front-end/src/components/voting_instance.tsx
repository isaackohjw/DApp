interface VotingInstanceCardProps {
  instance: {
    id: number;
    title: string;
    status: string;
  };
}

export const VotingInstanceCard: React.FC<VotingInstanceCardProps> = ({
  instance,
}) => {
  return (
    <div className="bg-gray-700 text-white p-4 rounded-md mb-4">
      <h3 className="text-lg">{instance.title}</h3>
      <p>Status: {instance.status}</p>
    </div>
  );
};
