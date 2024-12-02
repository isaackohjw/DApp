"use client";

import React, { useState, useEffect } from "react";
import { ConfirmationModal } from "./confirmation_modal";

interface AddVotingInstanceProps {
  onClose: () => void;
  onCreate: (data: {
    title: string;
    description: string;
    startDate: string;
    endDate: string;
    choices: string[];
  }) => void;
}

export const AddVotingInstanceModal: React.FC<AddVotingInstanceProps> = ({
  onClose,
  onCreate,
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [choices, setChoices] = useState<string[]>(["Yes", "No", "Abstain"]); // Default choices
  const [isDirty, setIsDirty] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Check if all required fields are filled
  const isFormValid =
    title.trim() !== "" &&
    description.trim() !== "" &&
    startDate !== "" &&
    endDate !== "";

  // Effect to track changes in fields
  useEffect(() => {
    const isAnyFieldFilled =
      Boolean(title.trim()) ||
      Boolean(description.trim()) ||
      Boolean(startDate.trim()) ||
      Boolean(endDate.trim());
    setIsDirty(isAnyFieldFilled);
  }, [title, description, startDate, endDate]);

  const handleSubmit = () => {
    if (isFormValid) {
      onCreate({
        title,
        description,
        startDate,
        endDate,
        choices,
      });
      onClose();
    }
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 font-body">
      <div className="bg-gray-800 text-white p-8 rounded-lg w-96">
        {/* Modal Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Add Voting Instance</h2>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700 focus:outline-none font-base font-bold"
          >
            ✕
          </button>
        </div>

        {/* Modal Content Wrapper */}
        <div className="h-full overflow-y-auto p-1">
          {/* Voting Instance Title */}
          <div>
            <label className="block text-sm font-medium text-gray-200">
              Voting Instance Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-500"
              placeholder="Enter voting instance title"
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
              placeholder="Enter description for the voting instance"
              rows={3}
            />
          </div>

          {/* Start Date */}
          <div>
            <label className="block text-sm font-medium text-gray-200">
              Start Date
            </label>
            <input
              type="datetime-local"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-500"
            />
          </div>

          {/* End Date */}
          <div>
            <label className="block text-sm font-medium text-gray-200">
              End Date
            </label>
            <input
              type="datetime-local"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-500"
            />
          </div>

          {/* Voting Choices */}
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-200">
              Voting Choices
            </label>
            <div className="space-y-2 mt-2">
              {choices.map((choice, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={choice}
                    onChange={(e) => {
                      const newChoices = [...choices];
                      newChoices[index] = e.target.value;
                      setChoices(newChoices);
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-500"
                    placeholder="Enter a choice"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="mt-6 flex justify-center">
          <button
            onClick={handleSubmit}
            className={`px-4 py-2 rounded-md ${
              isFormValid ? "bg-green-500" : "bg-gray-500"
            } text-white focus:outline-none focus:ring-2 focus:ring-green-400`}
            disabled={!isFormValid}
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
