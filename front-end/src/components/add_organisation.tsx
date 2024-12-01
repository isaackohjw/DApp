"use client";
import React, { useState, useEffect } from "react";
import { ConfirmationModal } from "./confirmation_modal";

interface AddOrganisationProps {
  onClose: () => void;
  onCreate: (data: {
    name: string;
    description: string;
    image: string;
    tokenAddress: string;
    adminWallets: string[];
  }) => void;
}

export const AddOrganisation: React.FC<AddOrganisationProps> = ({
  onClose,
  onCreate,
}) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [tokenAddress, setTokenAddress] = useState("");
  const [adminWallets, setAdminWallets] = useState<string[]>([]);
  const [walletInput, setWalletInput] = useState("");
  const [isDirty, setIsDirty] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Effect to track changes in fields
  useEffect(() => {
    const isAnyFieldFilled =
      Boolean(name.trim()) ||
      Boolean(description.trim()) ||
      Boolean(image) ||
      Boolean(tokenAddress.trim()) ||
      adminWallets.length > 0;
    setIsDirty(isAnyFieldFilled);
  }, [name, description, image, tokenAddress, adminWallets]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleAddWallet = () => {
    if (walletInput.trim() && !adminWallets.includes(walletInput)) {
      setAdminWallets([...adminWallets, walletInput.trim()]);
      setWalletInput("");
    }
  };

  const handleRemoveWallet = (wallet: string) => {
    setAdminWallets(adminWallets.filter((w) => w !== wallet));
  };

  const handleSubmit = () => {
    onCreate({
      name,
      description,
      image: image || "",
      tokenAddress,
      adminWallets,
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 font-body ">
      <div className="bg-gray-800 text-white p-8 rounded-lg w-96">
        {/* Modal Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Add Organisation</h2>
          <button
            onClick={handleClose} // Use handleClose for modal close
            className="text-gray-500 hover:text-gray-700 focus:outline-none font-base font-bold"
          >
            ✕
          </button>
        </div>

        {/* Modal Content Wrapper */}
        <div className="h-full overflow-y-auto p-1">
          {/* Organisation Name */}
          <div>
            <label className="block text-sm font-medium text-gray-200">
              Organisation Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-500 text-white p-8 rounded-lg w-96 w-full p-2 rounded-md"
              placeholder="Enter organisation name"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-200">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-500"
              placeholder="Enter organisation description"
              rows={3}
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-200">
              Organisation Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
            />
            {image && (
              <img
                src={image}
                alt="Uploaded"
                className="mt-2 w-24 h-24 object-cover rounded-md"
              />
            )}
          </div>

          {/* Token Address */}
          <div>
            <label className="block text-sm font-medium text-gray-200">
              Token Address
            </label>
            <input
              type="text"
              value={tokenAddress}
              onChange={(e) => setTokenAddress(e.target.value)}
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-500"
              placeholder="Enter token address"
            />
          </div>

          {/* Admin Wallet Addresses */}
          <div>
            <label className="block text-sm font-medium text-gray-200">
              Add Admin Wallets
            </label>
            <div className="flex space-x-2 mt-1">
              <input
                type="text"
                value={walletInput}
                onChange={(e) => setWalletInput(e.target.value)}
                placeholder="Wallet Address"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-500"
              />
              <button
                onClick={handleAddWallet}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                Add
              </button>
            </div>
            {/* Display Added Wallets */}
            <ul className="mt-2 space-y-2 max-h-16 overflow-y-auto">
              {adminWallets.map((wallet, index) => (
                <li
                  key={index}
                  className="flex justify-between items-center bg-gray-100 px-3 py-2 rounded-md"
                >
                  <span className="text-gray-700">{wallet}</span>
                  <button
                    onClick={() => handleRemoveWallet(wallet)}
                    className="text-red-500 hover:text-red-700 focus:outline-none"
                  >
                    ✕
                  </button>
                </li>
              ))}
            </ul>
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
