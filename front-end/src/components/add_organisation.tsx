"use client";
import React, { useState, useEffect } from "react";
import { ConfirmationModal } from "./confirmation_modal";

interface AddOrganisationProps {
  onClose: () => void;
  onCreate: (data: {
    name: string;
    tokenAddress: string;
  }) => void;
  prefillData?: {
    name?: string;
    tokenAddress?: string;
  };
}

export const AddOrganisation: React.FC<AddOrganisationProps> = ({
  onClose,
  onCreate,
  prefillData = {},
}) => {
  const [name, setName] = useState(prefillData.name || "");
  const [tokenAddress, setTokenAddress] = useState(prefillData.tokenAddress || "");
  const [isDirty, setIsDirty] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const isAnyFieldFilled = Boolean(name.trim()) || Boolean(tokenAddress.trim());
    setIsDirty(isAnyFieldFilled);
  }, [name, tokenAddress]);

  const handleSubmit = () => {
    if (!name.trim() || !tokenAddress.trim()) {
      alert("Please fill in all fields.");
      return;
    }
    onCreate({
      name: name.trim(),
      tokenAddress: tokenAddress.trim(),
    });
    onClose();
  };

  const handleClose = () => {
    if (isDirty) {
      setIsModalOpen(true);
    } else {
      onClose();
    }
  };

  const handleModalConfirm = () => {
    setIsModalOpen(false);
    onClose();
  };

  const handleModalCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-gray-800 text-white p-8 rounded-lg w-96">
        {/* Modal Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Add Organisation</h2>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700 focus:outline-none font-bold"
          >
            ✕
          </button>
        </div>

        {/* Modal Content */}
        <div className="h-full overflow-y-auto p-1">
          {/* Organisation Name */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300">
              Organisation Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-900"
              placeholder="Enter organisation name"
            />
          </div>

          {/* Token Address */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300">
              Token Address
            </label>
            <input
              type="text"
              value={tokenAddress}
              onChange={(e) => setTokenAddress(e.target.value)}
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-900"
              placeholder="Enter token address"
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="mt-6 flex justify-center">
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400"
          >
            Create
          </button>
        </div>

        {/* Confirmation Modal */}
        <ConfirmationModal
          isOpen={isModalOpen}
          onConfirm={handleModalConfirm}
          onCancel={handleModalCancel}
          message="You have unsaved changes. Are you sure you want to close this window? All progress will be lost."
        />
      </div>
    </div>
  );
};