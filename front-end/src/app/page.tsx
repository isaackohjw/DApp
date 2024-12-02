"use client";

import React, { useState } from "react";
import { VotingInstanceCard } from "@/components/voting_instance";
import { VotingResultsCard } from "@/components/voting_results";
import { AddVotingInstanceModal } from "@/components/add_voting";
import { AddRemoveAdminModal } from "@/components/manage_admin";
import { ConfirmationModal } from "@/components/confirmation_modal";
import { Role, VotingInstance, VotingStatus } from "@/global_var";
import { Tabs } from "@/components/dashboard_taskbar";
import { Titlebar } from "@/components/titlebar";
import { AdminList } from "@/components/admin_list";
import { AddAdminInput } from "@/components/admin_input";
import { ConfirmationModalAd } from "@/components/admin_confirmation_modal";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("currentVoting");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [adminList, setAdminList] = useState<string[]>([
    "admin1@example.com",
    "admin2@example.com",
    "admin3@example.com",
  ]); // Example admin list
  const [newAdmin, setNewAdmin] = useState<string>(""); // New admin input field
  const [confirmAction, setConfirmAction] = useState<string | null>(null); // To track which confirmation action to show
  const [adminToRemove, setAdminToRemove] = useState<string | null>(null); // Admin to be removed

  // Simulated data
  const userRole: Role = "Owner"; // Can be "Voter", "Admin", or "Owner"

  // Test Data for Voting Instances
  const votingInstances = [
    {
      id: 1,
      title: "Election 2024",
      status: VotingStatus.OPEN,
      totalVoters: 500,
      votedYes: 300,
      votedNo: 120,
      votedAbstain: 50,
      createdAt: "2024-12-01",
      closedAt: "2024-12-02",
      timeLeft: "2d 3h 15m",
      hasVoted: true,
      createdByUser: true,
    },
    {
      id: 2,
      title: "Company Annual Vote",
      status: VotingStatus.CLOSED,
      totalVoters: 300,
      votedYes: 89,
      votedNo: 150,
      votedAbstain: 50,
      createdAt: "2024-11-20",
      closedAt: "2024-11-21",
      timeLeft: "0d 0h 0m",
      hasVoted: false,
      createdByUser: false,
    },
    {
      id: 3,
      title: "Community Fund Allocation",
      status: VotingStatus.SUSPENDED,
      totalVoters: 400,
      votedYes: 8,
      votedNo: 100,
      votedAbstain: 50,
      createdAt: "2024-11-25",
      closedAt: "2024-11-26",
      timeLeft: "N/A",
      hasVoted: false,
      createdByUser: true,
    },
  ];

  // Handlers for Confirmation Modal
  const handleConfirm = () => {
    if (confirmAction === "remove" && adminToRemove) {
      confirmRemoveAdmin();
    }
  };

  const handleCancel = () => {
    setIsConfirmModalOpen(false); // Close modal after cancellation
  };

  const handleAddAdmins = () => {
    if (newAdmin) {
      setAdminList((prevAdminList) => [...prevAdminList, newAdmin]); // Add one new admin to the list
      setNewAdmin(""); // Clear input field after adding
    }
  };

  const handleRemoveAdmin = (admin: string) => {
    setAdminToRemove(admin);
    setConfirmAction("remove");
    setIsConfirmModalOpen(true); // Show confirmation modal before removing admin
  };

  const confirmRemoveAdmin = () => {
    setAdminList((prevAdminList) =>
      prevAdminList.filter((admin) => admin !== adminToRemove)
    ); // Remove admin from the list
    setAdminToRemove(null); // Clear the selected admin
    setIsConfirmModalOpen(false); // Close modal
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
      <Tabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        tabs={tabs}
        organisationName="Tech Innovators"
      />

      {/* Main Content */}
      <div className="pt-16 px-4" style={{ marginTop: "-40px" }}>
        {/* Tab Content */}
        {activeTab === "currentVoting" && (
          <div className="flex space-x-4 overflow-x-auto">
            {votingInstances.map((instance) => (
              <VotingInstanceCard key={instance.id} instance={instance} />
            ))}
          </div>
        )}

        {activeTab === "votingResults" && (
          <div>
            {votingInstances
              .filter((instance) => instance.status === "Closed")
              .map((instance) => (
                <VotingResultsCard key={instance.id} instance={instance} />
              ))}
          </div>
        )}

        {activeTab === "myVotingInstances" && userRole !== "Voter" && (
          <div className="flex space-x-4 overflow-x-auto">
            {votingInstances
              .filter((instance) => instance.createdByUser)
              .map((instance) => (
                <VotingInstanceCard key={instance.id} instance={instance} />
              ))}
          </div>
        )}

        {activeTab === "manageAdmins" && userRole === "Owner" && (
          <div
            className="mx-auto flex flex-col items-center "
            style={{ width: "24rem" }}
          >
            <h2 className="text-2xl font-bold mb-6">Admin List</h2>
            <div className="w-full max-w-xl p-4 bg-gray-800 rounded-lg">
              {/* List of Admins */}
              {adminList.length > 0 ? (
                adminList.map((admin) => (
                  <div
                    key={admin}
                    className="flex justify-between items-center bg-gray-700 p-3 mb-2 rounded-md"
                  >
                    <span>{admin}</span>
                    <button
                      className="text-red-500 hover:text-red-700"
                      onClick={() => handleRemoveAdmin(admin)}
                    >
                      ✖
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-gray-400">No admins available.</p>
              )}
            </div>

            {/* Add Admin Section */}
            <div className="flex items-center space-x-4 w-full max-w-xl mt-4">
              <input
                type="email"
                className="p-2 w-full bg-gray-700 rounded-md"
                placeholder="Enter new admin wallet address"
                value={newAdmin}
                onChange={(e) => setNewAdmin(e.target.value)}
              />
              <button
                className="bg-blue-600 p-1 rounded-md text-xs"
                onClick={handleAddAdmins}
              >
                Add Admin
              </button>
            </div>

            {/* Confirmation Modal */}
            {isConfirmModalOpen && confirmAction === "remove" && (
              <ConfirmationModal
                isOpen={isConfirmModalOpen}
                message={`Are you sure you want to remove ${adminToRemove}?`}
                onConfirm={handleConfirm}
                onCancel={handleCancel}
              />
            )}
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
    </div>
  );
}
