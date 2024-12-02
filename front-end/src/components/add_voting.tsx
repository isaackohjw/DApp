interface AddVotingInstanceModalProps {
  onClose: () => void;
}

export const AddVotingInstanceModal: React.FC<AddVotingInstanceModalProps> = ({
  onClose,
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-gray-800 text-white p-8 rounded-lg w-96">
        <h2 className="text-xl">Add Voting Instance</h2>
        <input
          type="text"
          placeholder="Voting Title"
          className="mt-4 w-full px-4 py-2 rounded-md"
        />
        <button
          onClick={onClose}
          className="bg-blue-600 text-white px-6 py-2 mt-4 rounded-md"
        >
          Save
        </button>
        <button
          onClick={onClose}
          className="bg-red-600 text-white px-6 py-2 mt-4 rounded-md"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};
