"use client";

import React, { useState } from "react";
import { VotingInstanceCard } from "@/components/voting_instance";
import { VotingResultsCard } from "@/components/voting_results";
import { AddVotingInstanceModal } from "@/components/add_voting";
import { AddRemoveAdminModal } from "@/components/manage_admin";
import { ConfirmationModal } from "@/components/confirmation_modal";
import { Role } from "@/global_var";
import { Tabs } from "@/components/dashboard_taskbar";
import { Titlebar } from "@/components/titlebar";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("currentVoting");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  // Simulated data
  const userRole: Role = "Owner"; // Can be "Voter", "Admin", or "Owner"
  const votingInstances = [
    { id: 1, title: "Voting 1", status: "Ongoing" },
    { id: 2, title: "Voting 2", status: "Completed" },
  ];

  // Handlers for Confirmation Modal
  const handleConfirm = () => {
    console.log("Confirmed");
    setIsConfirmModalOpen(false); // Close modal after confirmation
  };

  const handleCancel = () => {
    console.log("Cancelled");
    setIsConfirmModalOpen(false); // Close modal after cancellation
  };

  // Tabs data
  const tabs = [
    { label: "Current Voting", value: "currentVoting" },
    { label: "Voting Results", value: "votingResults" },
  ];

  // Add admin-specific tabs if user is Admin or Owner
  if (userRole === "Admin" || userRole === "Owner") {
    tabs.push({ label: "My Voting Instances", value: "myVotingInstances" });
  }

  // Add Owner-specific tab if user is Owner
  if (userRole === "Owner") {
    tabs.push({ label: "Manage Admins", value: "manageAdmins" });
  }

  return (
    <div className="min-h-screen text-white font-body">
      <Titlebar name="John Doe" initial="J" />

      {/* Tab Navigation */}
      <Tabs activeTab={activeTab} onTabChange={setActiveTab} tabs={tabs} />

      {/* Main Content */}
      <div className="pt-16 px-4" style={{ marginTop: "-40px" }}>
        {/* Tab Content */}
        {activeTab === "currentVoting" && (
          <div>
            {votingInstances
              .filter((instance) => instance.status === "Ongoing")
              .map((instance) => (
                <VotingInstanceCard key={instance.id} instance={instance} />
              ))}
          </div>
        )}

        {activeTab === "votingResults" && (
          <div>
            {votingInstances
              .filter((instance) => instance.status === "Completed")
              .map((instance) => (
                <VotingResultsCard key={instance.id} instance={instance} />
              ))}
          </div>
        )}

        {activeTab === "myVotingInstances" && (
          <div>
            {votingInstances.map((instance) => (
              <VotingInstanceCard key={instance.id} instance={instance} />
            ))}
            {userRole !== "Voter" && (
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="bg-blue-600 text-white px-4 py-2 mt-4 rounded-md"
              >
                Add Voting Instance
              </button>
            )}
          </div>
        )}

        {activeTab === "manageAdmins" && userRole === "Owner" && (
          <div>
            <h2 className="text-xl mb-4">Manage Admins</h2>
            <button
              onClick={() => setIsAdminModalOpen(true)}
              className="bg-blue-600 text-white px-4 py-2 mt-4 rounded-md"
            >
              Add/Remove Admins
            </button>
          </div>
        )}
      </div>

      {/* Modals */}
      {isAddModalOpen && (
        <AddVotingInstanceModal onClose={() => setIsAddModalOpen(false)} />
      )}

      {isAdminModalOpen && (
        <AddRemoveAdminModal onClose={() => setIsAdminModalOpen(false)} />
      )}

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
        message="Are you sure you want to proceed?"
      />
    </div>
  );
}
