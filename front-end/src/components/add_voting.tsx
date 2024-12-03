import React, { useState } from "react";
interface AddVotingInstanceModalProps {
  onClose: () => void;
  onSubmit: (formData: { description: string; deadline: string; oneVotePerUser: boolean }) => void;
}


export const AddVotingInstanceModal: React.FC<AddVotingInstanceModalProps> = ({
  onClose,
  onSubmit,
}) => {
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const [oneVotePerUser, setOneVotePerUser] = useState(false);
  const handleSave = () => {
    onSubmit({ description, deadline, oneVotePerUser });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 font-body">
      <div className="bg-gray-800 text-white p-8 rounded-lg w-96">
        <h2 className="text-xl mb-4">Add Voting Instance</h2>

        {/* Voting Title */}
        <div className="mb-4">
          <label className="block mb-2">Description:</label>
          <textarea
            placeholder="Enter voting description"
            className="w-full px-4 py-2 rounded-md bg-gray-700 text-white"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        {/* Deadline */}
        <div className="mb-4">
          <label className="block mb-2">Deadline:</label>
          <input
            type="datetime-local"
            className="w-full px-4 py-2 rounded-md bg-gray-700 text-white"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
          />
        </div>


        {/* One Vote Per User */}
        <div className="mb-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              className="mr-2"
              checked={oneVotePerUser}
              onChange={(e) => setOneVotePerUser(e.target.checked)}
            />
            One vote per user
          </label>
        </div>

        {/* Buttons */}
        <div className="flex justify-end space-x-4">
          <button
            onClick={handleSave}
            className="bg-blue-600 text-white px-4 py-2 rounded-md"
          >
            Save
          </button>
          <button
            onClick={onClose}
            className="bg-red-600 text-white px-4 py-2 rounded-md"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};