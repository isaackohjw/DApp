import React from "react";

interface ConfirmationModalProps {
  isOpen: boolean;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmationModalAd: React.FC<ConfirmationModalProps> = ({
  isOpen,
  message,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-gray-800 text-white p-6 rounded-lg w-[20rem] space-y-4">
        <p className="text-sm text-gray-300 text-center">{message}</p>
        <div className="flex space-x-4 justify-center">
          <button
            onClick={onConfirm}
            className="bg-green-600 px-4 py-2 rounded-md"
          >
            Confirm
          </button>
          <button
            onClick={onCancel}
            className="bg-gray-600 px-4 py-2 rounded-md"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
