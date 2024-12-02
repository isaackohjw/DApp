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
import VotingModal from "@/components/voting_modal";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("currentVoting");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [adminList, setAdminList] = useState<string[]>([
    "admin1@example.com",
    "admin2@example.com",
    "admin3@example.com",
  ]);
  const [newAdmin, setNewAdmin] = useState<string>("");
  const [confirmAction, setConfirmAction] = useState<string | null>(null);
  const [adminToRemove, setAdminToRemove] = useState<string | null>(null);

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
    setIsConfirmModalOpen(false);
  };

  const handleAddAdmins = () => {
    if (newAdmin) {
      setAdminList((prevAdminList) => [...prevAdminList, newAdmin]);
      setNewAdmin("");
    }
  };

  const handleRemoveAdmin = (admin: string) => {
    setAdminToRemove(admin);
    setConfirmAction("remove");
    setIsConfirmModalOpen(true);
  };

  const confirmRemoveAdmin = () => {
    setAdminList((prevAdminList) =>
      prevAdminList.filter((admin) => admin !== adminToRemove)
    );
    setAdminToRemove(null);
    setIsConfirmModalOpen(false);
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

      {/* Plus Button for Adding Voting Instance */}
      <div className="fixed bottom-6 right-6">
        <div className="group relative">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className={`bg-gray-700 text-white w-10 h-10 rounded-full flex items-center justify-center shadow-lg hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 border-2 border-gray-300 ${
              userRole === "Voter" ? "hidden" : ""
            }`}
          >
            <span className="text-3xl font-thin">+</span>
          </button>
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <span className="flex justify-center items-center text-white text-center text-xs font-normal px-3 py-1 rounded-full font-body shadow-lg">
              Add Voting Instance
            </span>
          </div>
        </div>
      </div>

      {/* Modals */}
      {isAddModalOpen && (
        <AddVotingInstanceModal
          onClose={() => setIsAddModalOpen(false)}
          onCreate={(data) => {
            console.log("Created Voting Instance:", data);
            // Add logic to handle the creation of the voting instance
            setIsAddModalOpen(false); // Close modal after creation
          }}
        />
      )}

      {isAdminModalOpen && (
        <AddRemoveAdminModal onClose={() => setIsAdminModalOpen(false)} />
      )}
    </div>
  );
}
