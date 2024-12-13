import React, { useState } from "react";

interface AddAdminInputProps {
  onAdd: (newAdmins: string[]) => void;
}

export const AddAdminInput: React.FC<AddAdminInputProps> = ({ onAdd }) => {
  const [newAdmins, setNewAdmins] = useState<string[]>([]);
  const [isChecked, setIsChecked] = useState(false);

  const handleAddClick = () => {
    if (isChecked && newAdmins.length > 0) {
      onAdd(newAdmins);
      setNewAdmins([]);
      setIsChecked(false);
    }
  };

  return (
    <div>
      <textarea
        value={newAdmins.join("\n")}
        onChange={(e) =>
          setNewAdmins(e.target.value.split("\n").filter((line) => line.trim()))
        }
        placeholder="Enter admin addresses (one per line)"
        className="w-full bg-gray-700 p-2 rounded-md text-sm"
        rows={3}
      ></textarea>
      <div className="flex items-center space-x-2 mt-2">
        <input
          type="checkbox"
          checked={isChecked}
          onChange={(e) => setIsChecked(e.target.checked)}
          className="h-4 w-4 text-blue-600"
        />
        <span className="text-sm">I confirm the addition of these admins</span>
      </div>
      <button
        onClick={handleAddClick}
        className="bg-blue-600 text-white px-4 py-2 mt-2 w-full rounded-md"
        disabled={!isChecked || newAdmins.length === 0}
      >
        Add Admins
      </button>
    </div>
  );
};
