"use client";

import React, { useEffect, useState } from "react";
import {
  createPublicClient, createWalletClient, http, Address, custom, type Hash,
  type TransactionReceipt,
} from "viem";
import { VotingInstanceCard } from "@/components/voting_instance";
import { VotingResultsCard } from "@/components/voting_results";
import { AddVotingInstanceModal } from "@/components/add_voting";
import { holesky } from "viem/chains";
import { Organization } from "../../../artifacts/Organization.ts";
import { usePathname } from "next/navigation";
import { Titlebar } from "@/components/titlebar";
import { Tabs } from "@/components/dashboard_taskbar";

export default function OrganizationDashboard() {
  const pathname = usePathname();
  const [sessions, setSessions] = useState<
    { id: number; description: string; deadline: number; oneVotePerUser: boolean; status: string }[]
  >([]);
  const [wallets, setWallets] = useState<string[]>([]);
  const [contractAddress, setContractAddress] = useState<string>("");
  const [organizationName, setOrganizationName] = useState<string>("Loading...");
  const [organizationToken, setOrganizationToken] = useState<string>("Loading...");
  const [owner, setOwner] = useState<string>("Loading...");
  const [selectedWallet, setSelectedWallet] = useState<string | null>(null);
  const [adminList, setAdminList] = useState<string[]>([]);
  const [newAdmin, setNewAdmin] = useState<string>("");
  const [isAddingAdmin, setIsAddingAdmin] = useState(false);
  const [isRemovingAdmin, setIsRemovingAdmin] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hash, setHash] = useState<Hash>()
  const [receipt, setReceipt] = useState<TransactionReceipt>()
  const [activeTab, setActiveTab] = useState("currentVoting");
  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false)

  const tabs = [
    { label: "Current Voting", value: "currentVoting" },
    { label: "Voting Results", value: "votingResults" },
    { label: "Manage Admins", value: "manageAdmins" },
  ];

  const handleVotingSessionCreation = async (formData: {
    description: string;
    deadline: string;
    oneVotePerUser: boolean;
  }) => {
    try { // Replace with your contract address
      const { description, deadline, oneVotePerUser } = formData;

      // Convert deadline to UNIX timestamp
      const deadlineTimestamp = BigInt(Math.floor(new Date(deadline).getTime() / 1000));

      // Simulate the contract function to ensure validity
      const { request } = await viemClient.simulateContract({
        address: contractAddress as Address,
        account: selectedWallet as Address,
        abi: Organization, // ABI of your smart contract
        functionName: "createVotingSession",
        args: [description, deadlineTimestamp, oneVotePerUser],
      });

      // Submit the transaction
      const hash = await walletClient.writeContract(request);

      // Wait for the transaction receipt
      const receipt = await viemClient.waitForTransactionReceipt({ hash });

      if (receipt.status === "success") {
        alert("Voting session created successfully!");
      } else {
        alert("Transaction failed.");
      }
    } catch (error) {
      console.error("Error creating voting session:", error);
      alert(error?.message || "Failed to create voting session.");
    }
  };

  useEffect(() => {
    console.log(hash);
    (async () => {
      if (hash) {
        try {
          const receipt = await viemClient.waitForTransactionReceipt({ hash });
          setReceipt(receipt);
          console.log(receipt);
          if (receipt.status === 'success') {
            //alert("Admin added successfully!");
            refreshAdminPage();
          } else {
            alert("Failed operation. Transaction reverted.");
          }
        } catch (error) {
          console.error("Error fetching transaction receipt:", error);
          alert("An error occurred while fetching the transaction status.");
        }
      }
    })();
  }, [hash]);

  // Function to refresh the admin page
  const refreshAdminPage = () => {
    // Fetch updated admin list or other necessary data
    fetchOrganizationDetails(); // Assuming you have a function that fetches the admin list
  };

  const viemClient = createPublicClient({
    chain: holesky,
    transport: http(),
  });

  const [walletClient, setWalletClient] = useState(
    createWalletClient({
      account: selectedWallet as Address,
      chain: holesky,
      transport: custom(window.ethereum),
    })
  );

  useEffect(() => {
    if (pathname) {
      const address = pathname.split("/").filter(Boolean).pop();
      setContractAddress(address || "");
    }
  }, [pathname]);

  // Load wallet from localStorage
  useEffect(() => {
    const storedWallets = localStorage.getItem("wallets");
    const storedSelectedWallet = localStorage.getItem("selectedWallet");
    if (storedWallets) {
      setWallets(JSON.parse(storedWallets));
    }
    if (storedSelectedWallet) {
      setSelectedWallet(storedSelectedWallet);
    }
  }, []);

  const handleFetchSessions = async () => {
    const maxSessions = 5; // Assumed maximum number of sessions
    const sessionData = [];

    try {
      for (let i = 0; i < maxSessions; i++) {
        try {
          const session = await viemClient.readContract({
            address: contractAddress as Address,
            abi: Organization,
            functionName: "votingSessions",
            args: [BigInt(i)], // Pass index as BigInt
          });

          // Destructure the tuple
          const [description, deadline, oneVotePerUser] = session;

          sessionData.push({
            id: i,
            description,
            deadline: Number(deadline), // Convert BigInt to number
            oneVotePerUser,
            status: Number(deadline) > Math.floor(Date.now() / 1000) ? "Active" : "Expired",
          });
        } catch (error) {
          console.log(`No more sessions found at index ${i}.`);
          break;
        }
      }
      setSessions(sessionData);
    } catch (error) {
      console.error("Error fetching voting sessions:", error);
    }
  };


  const handleSelectWallet = async (wallet: string) => {
    try {
      setSelectedWallet(wallet);
      localStorage.setItem("selectedWallet", wallet); // Store the selected wallet

      // Update the walletClient with the new wallet
      const client = createWalletClient({
        account: wallet as Address,
        chain: holesky,
        transport: custom(window.ethereum),
      });
      setWalletClient(client); // Update the wallet client
    } catch (error) {
      console.error("Error switching wallet:", error);
      alert("Failed to switch wallet. Please try again.");
    }
  };


  // Fetch organization details based on the contract address
  useEffect(() => {
    fetchOrganizationDetails();
  }, [contractAddress]);

  const fetchOrganizationDetails = async () => {
    if (!contractAddress) return;
    try {
      const address = contractAddress as Address;

      // Fetch organization name
      const name = await viemClient.readContract({
        address,
        abi: Organization,
        functionName: "name",
      });

      const owner = await viemClient.readContract({
        address,
        abi: Organization,
        functionName: "owner",
      });

      // Fetch token address
      const token = await viemClient.readContract({
        address,
        abi: Organization,
        functionName: "token",
      });

      let adminList = await viemClient.readContract({
        address,
        abi: Organization,
        functionName: "getAdmins",
      });

      const filteredAdminList = (adminList as string[]).filter(
        admin => admin.toLowerCase() !== (owner as string).toLowerCase()
      );

      // Set state with string values
      setOrganizationName(name as string);
      setOrganizationToken(token as string);
      setOwner(owner as string);
      setAdminList(filteredAdminList);
    } catch (error) {
      console.error("Error fetching organization details:", error);
    }
  };

  const handleAddAdmin = async () => {
    try {
      setIsAddingAdmin(true);

      const address = contractAddress as Address;

      // Call the `addAdmin` function
      const { request } = await viemClient.simulateContract({
        account: selectedWallet as Address,
        address: address,
        abi: Organization,
        functionName: "addAdmin",
        args: [newAdmin as Address],
      });
      const hash = await walletClient.writeContract(request)
      setHash(hash)
      setNewAdmin("");
    } catch (error) {
      console.error("Error adding admin:", error);
      alert("Failed to add admin. Please try again.");
    } finally {
      setIsAddingAdmin(false);
    }
  };

  const handleRemoveAdmin = async (admin: string) => {
    try {
      setIsRemovingAdmin(admin);
      const address = contractAddress as Address;
      const { request } = await viemClient.simulateContract({
        account: selectedWallet as Address,
        address: address,
        abi: Organization,
        functionName: "removeAdmin",
        args: [admin as Address],
      });
      const hash = await walletClient.writeContract(request)
      setHash(hash)
    } catch (error: any) {
      console.error("Error removing admin:", error);
      alert(`Failed to remove admin: ${error.message}`);
    } finally {
      setIsRemovingAdmin(null);
    }
  };

  return (
    <div className="min-h-screen text-white font-body">
      <Titlebar
        name={
          selectedWallet
            ? `${selectedWallet.slice(0, 6)}...${selectedWallet.slice(-4)}`
            : "No Wallet Connected"
        }
        initial={selectedWallet ? selectedWallet[2].toUpperCase() : "N"}
        wallets={wallets}
        onSelectWallet={handleSelectWallet}
      />

      <Tabs activeTab={activeTab} onTabChange={setActiveTab} tabs={tabs} />
      <div className="pt-16 px-4" style={{ marginTop: "-40px" }}>

        {activeTab === "currentVoting" && (
          <>
            <button
              onClick={handleFetchSessions}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
            >
              Retrieve voting sessions
            </button>
            
            {loading && <p>Loading voting sessions...</p>}

            <div className="mt-4">
              {sessions.length > 0 ? (
                sessions.map((session) => (
                  <VotingInstanceCard key={session.id} instance={session} />
                ))
              ) : (
                !loading && <p>No voting sessions found.</p>
              )}
            </div>
          </>
        )}
        {activeTab === "manageAdmins" && (
          <div>
            <h2 className="text-2xl font-bold">Manage Admin</h2>
            <p>
              <strong>Contract Address:</strong> {contractAddress || "N/A"}
            </p>
            <p>
              <strong>Name:</strong> {organizationName}
            </p>
            <p>
              <strong>Owner:</strong> {owner}
            </p>
            <p>
              <strong>ERC Token:</strong> {organizationToken}
            </p>
            <p>
              <strong>Admins:</strong>
            </p>
            <ul>
              {adminList.map((admin) => (
                <li key={admin} className="flex items-center justify-between mb-2">
                  <span>{admin}</span>
                  <button
                    onClick={() => handleRemoveAdmin(admin)}
                    className={`px-3 py-1 rounded text-white ${isRemovingAdmin === admin
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-red-500 hover:bg-red-600"
                      }`}
                    disabled={isRemovingAdmin === admin}
                  >
                    {isRemovingAdmin === admin ? "Removing..." : "Remove"}
                  </button>
                </li>
              ))}
            </ul>
            <div className="mt-6">
              <h2 className="text-xl font-bold mb-2">Add Admin</h2>
              <input
                type="text"
                placeholder="Enter admin address"
                value={newAdmin}
                onChange={(e) => setNewAdmin(e.target.value)}
                className="p-2 border rounded w-full mb-4"
              />
              <button
                onClick={handleAddAdmin}
                className={`px-4 py-2 rounded text-white ${isAddingAdmin ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
                  }`}
                disabled={isAddingAdmin}
              >
                {isAddingAdmin ? "Adding..." : "Add Admin"}
              </button>
            </div>
          </div>
        )}

        {/* Bottom-Left Floating Button */}
        <button
          onClick={handleOpenModal}
          className="fixed bottom-4 left-4 bg-blue-600 text-white px-6 py-2 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
        >
          + Create Vote
        </button>

        {/* Modal Integration */}
        {isModalOpen && (
          <AddVotingInstanceModal
            onClose={handleCloseModal}
            onSubmit={handleVotingSessionCreation}
          />
        )}
      </div>
    </div>

  );
}