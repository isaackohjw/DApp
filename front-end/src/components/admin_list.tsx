import React from "react";

interface AdminListProps {
  admins: string[];
  onRemove: (admin: string) => void;
}

export const AdminList: React.FC<AdminListProps> = ({ admins, onRemove }) => (
  <ul className="space-y-2">
    {admins.map((admin, index) => (
      <li
        key={index}
        className="flex justify-between items-center bg-gray-700 p-2 rounded-md"
      >
        <span>{admin}</span>
        <button
          onClick={() => onRemove(admin)}
          className="text-red-500 hover:text-red-700"
        >
          ✖
        </button>
      </li>
    ))}
  </ul>
);
