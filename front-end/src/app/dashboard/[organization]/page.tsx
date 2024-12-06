"use client";
import React, { useEffect, useState } from "react";
import {
  createPublicClient, createWalletClient, http, Address, custom, type Hash,
  type TransactionReceipt,
} from "viem";
import { VotingInstanceCard } from "@/components/voting_instance";
import { VotingModal } from "@/components/voting_modal";
import { VotingResultsCard } from "@/components/voting_results";
import { AddVotingInstanceModal } from "@/components/add_voting";
import { holesky } from "viem/chains";
import { Organization } from "../../../artifacts/Organization.ts";
import { usePathname } from "next/navigation";
import { Titlebar } from "@/components/titlebar";
import { Tabs } from "@/components/dashboard_taskbar";

export default function OrganizationDashboard() {
  const [activeTab, setActiveTab] = useState("currentVoting");
  const pathname = usePathname();
  const [sessions, setSessions] = useState<
    { id: number; description: string; deadline: number; oneVotePerUser: boolean; status: string, creationTime: number; }[]
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
  const [isRemovingAdmin, setIsRemovingAdmin] = useState(false);
  const [addAdminInput, setAddAdminInput] = useState<string>("");
  const [removeAdminInput, setRemoveAdminInput] = useState<string>("");

  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hash, setHash] = useState<Hash>()
  const [receipt, setReceipt] = useState<TransactionReceipt>()
  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false)
  const [showModal, setShowModal] = useState(false);
  const [selectedInstance, setSelectedInstance] = useState<number | null>(null);
  const [results, setResults] = useState<
    { sessionId: number; title: string; votedYes: number; votedNo: number; votedAbstain: number; totalVoters: number; deadline: number }[]
  >([]);

  const [votingStatuses, setVotingStatuses] = useState<
    { sessionId: number; hasVoted: boolean }[]
  >([]);

  const fetchVotingStatuses = async () => {
    if (!selectedWallet) return;

    try {
      const statusData = [];
      for (let i = 0; i < sessions.length; i++) {
        const hasVoted = await viemClient.readContract({
          address: contractAddress as Address,
          abi: Organization,
          functionName: "getUserHasVoted",
          args: [BigInt(i), selectedWallet as Address],
        });

        statusData.push({ sessionId: i, hasVoted: Boolean(hasVoted) });
      }
      setVotingStatuses(statusData);
    } catch (error) {
      console.error("Error fetching voting status:", error);
    }
  };
  useEffect(() => {
    if (sessions.length > 0 && selectedWallet) {
      fetchVotingStatuses();
    }
  }, [sessions, selectedWallet]);

  useEffect(() => {
    if (selectedWallet && activeTab === "currentVoting") {
      handleFetchSessions();
    }
  }, [selectedWallet, activeTab]);

  const tabs = [
    { label: "Current Voting", value: "currentVoting" },
    { label: "Voting Results", value: "votingResults" },
    { label: "Organisation Settings", value: "orgSettings" },
  ];

  const handleVotingSessionCreation = async (formData: {
    description: string;
    deadline: string;
    oneVotePerUser: boolean;
  }) => {
    try {
      const { description, deadline, oneVotePerUser } = formData;

      const deadlineTimestamp = BigInt(Math.floor(new Date(deadline).getTime() / 1000));

      const { request } = await viemClient.simulateContract({
        address: contractAddress as Address,
        account: selectedWallet as Address,
        abi: Organization,
        functionName: "createVotingSession",
        args: [description, deadlineTimestamp, oneVotePerUser],
      });

      const hash = await walletClient.writeContract(request);

      const receipt = await viemClient.waitForTransactionReceipt({ hash });

      if (receipt.status === "success") {
        alert("Voting session created successfully!");
      } else {
        alert("Transaction failed.");
      }
    } catch (error) {
      console.error("Error creating voting session:", error);
      alert(error);
    }
  };

  useEffect(() => {
    if (activeTab === "votingResults") {
      fetchVotingResults();
    }
  }, [activeTab]);

  const refreshAdminPage = () => {
    fetchOrganizationDetails();
  }

  useEffect(() => {
    (async () => {
      if (hash) {
        try {
          const receipt = await viemClient.waitForTransactionReceipt({ hash });
          setReceipt(receipt);
          console.log(receipt);
          if (receipt.status === 'success') {
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

  const fetchVotingResults = async () => {
    try {
      const resultsData = [];
      for (let i = 0; i < sessions.length; i++) {
        const [yesVotes, noVotes, abstainVotes, totalVotes] = await Promise.all([
          viemClient.readContract({
            address: contractAddress as Address,
            abi: Organization,
            functionName: "getTotalVotesByOption",
            args: [BigInt(i), 1], // Yes votes
          }),
          viemClient.readContract({
            address: contractAddress as Address,
            abi: Organization,
            functionName: "getTotalVotesByOption",
            args: [BigInt(i), 2], // No votes
          }),
          viemClient.readContract({
            address: contractAddress as Address,
            abi: Organization,
            functionName: "getTotalVotesByOption",
            args: [BigInt(i), 0], // Abstain votes
          }),
          viemClient.readContract({
            address: contractAddress as Address,
            abi: Organization,
            functionName: "totalVotes",
            args: [BigInt(i)],
          }),
        ]);
  
        const normalizeVote = (rawVotes: any) => {
          return sessions[i]?.oneVotePerUser ? Number(rawVotes) : Number(rawVotes) / 10 ** 18;
        };
  
        const normalizedYesVotes = normalizeVote(yesVotes);
        const normalizedNoVotes = normalizeVote(noVotes);
        const normalizedAbstainVotes = normalizeVote(abstainVotes);
        const normalizedTotalVotes = normalizeVote(totalVotes); // Normalize total votes
  
        resultsData.push({
          sessionId: i,
          title: sessions[i].description,
          votedYes: normalizedYesVotes,
          votedNo: normalizedNoVotes,
          votedAbstain: normalizedAbstainVotes,
          totalVoters: normalizedTotalVotes, // Correctly normalized total votes
          createdAt: sessions[i].creationTime,
          deadline: sessions[i].deadline,
        });
      }
      setResults(resultsData);
    } catch (error) {
      console.error("Error fetching voting results:", error);
    }
  };

  const handleFetchSessions = async () => {
    const sessionData = [];

    try {
      for (let i = 0; i < 500; i++) {
        try {
          const session = await viemClient.readContract({
            address: contractAddress as Address,
            abi: Organization,
            functionName: "votingSessions",
            args: [BigInt(i)], // Pass index as BigInt
          });

          const [description, deadline, oneVotePerUser, creationTime] = session;

          sessionData.push({
            id: i,
            description,
            deadline: Number(deadline),
            oneVotePerUser,
            creationTime: Number(creationTime),
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
      setIsRemovingAdmin(true);
      const address = contractAddress as Address;
      const { request } = await viemClient.simulateContract({
        account: selectedWallet as Address,
        address: address,
        abi: Organization,
        functionName: "removeAdmin",
        args: [admin as Address],
      });
      const hash = await walletClient.writeContract(request);
      setHash(hash);
      setNewAdmin(""); // Clear the input field after success
    } catch (error: any) {
      console.error("Error removing admin:", error);
      alert(`Failed to remove admin: ${error.message}`);
    } finally {
      setIsRemovingAdmin(false);
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

      <Tabs organisationName={organizationName} activeTab={activeTab} onTabChange={setActiveTab} tabs={tabs} />
      <div className="pt-16 px-4 " style={{ marginTop: "-40px" }}>
        {activeTab === "currentVoting" && (
          <>
            {loading && <p>Loading voting sessions...</p>}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 justify-items-center">
              {sessions.length > 0 ? (
                sessions.map((session) => {
                  const votingStatus = votingStatuses.find((s) => s.sessionId === session.id);
                  return (
                    <VotingInstanceCard
                      key={session.id}
                      instance={session}
                      hasVoted={votingStatus?.hasVoted || false}
                      onClick={() => {
                        setSelectedInstance(session.id);
                        setShowModal(true);
                      }}
                    />
                  );
                })
              ) : (
                <p>No voting sessions found.</p>
              )}
            </div>
          </>
        )}
        {activeTab === "votingResults" && (
          <div>
            <div className="mt-6 grid md:grid-cols-2 lg:grid-cols-3 gap-4 justify-items-center">
              {results.length > 0 ? (
                results.map((result) => (
                  <VotingResultsCard
                    key={result.sessionId}
                    instance={{
                      sessionId: result.sessionId,
                      title: result.title,
                      votedYes: result.votedYes,
                      votedNo: result.votedNo,
                      votedAbstain: result.votedAbstain,
                      totalVoters: result.totalVoters,
                      deadline: result.deadline,
                      createdAt: result.createdAt,
                    }}
                  />
                ))
              ) : (
                <p>No voting results available. Try refreshing.</p>
              )}
            </div>
          </div>
        )}

        {activeTab === "orgSettings" && (
          <div className=" text-white shadow-lg mx-auto">
            <h2>Organisation Settings</h2>

            {/* Contract Details */}
            <div className="space-y-3">
              <p>
                <strong className="text-blue-400">Contract Address:</strong>
                <span className="text-gray-300 ml-2">{contractAddress || "N/A"}</span>
              </p>
              <p>
                <strong className="text-blue-400">Name:</strong>
                <span className="text-gray-300 ml-2">{organizationName}</span>
              </p>
              <p>
                <strong className="text-blue-400">Owner:</strong>
                <span className="text-gray-300 ml-2">{owner}</span>
              </p>
              <p>
                <strong className="text-blue-400">ERC Token:</strong>
                <span className="text-gray-300 ml-2">{organizationToken}</span>
              </p>
            </div>

            {/* Add Admin Section */}
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-2">Add Admin</h3>
              <input
                type="text"
                placeholder="Enter admin address to add"
                value={addAdminInput}
                onChange={(e) => setAddAdminInput(e.target.value)}
                className="w-full p-2 border border-gray-600 rounded mb-3 bg-gray-900 text-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none"
              />
              <button
                onClick={() => handleAddAdmin()}
                className={`w-full px-4 py-2 rounded text-sm font-bold ${isAddingAdmin
                  ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                  : "bg-blue-500 hover:bg-blue-600"
                  }`}
                disabled={isAddingAdmin}
              >
                {isAddingAdmin ? "Adding..." : "Add Admin"}
              </button>
            </div>

            {/* Remove Admin Section */}
            <div className="mb-4">
              <h4 className="text-lg font-semibold mb-2">Remove Admin</h4>
              <input
                type="text"
                placeholder="Enter admin address to remove"
                value={removeAdminInput}
                onChange={(e) => setRemoveAdminInput(e.target.value)}
                className="w-full p-2 border border-gray-600 rounded mb-3 bg-gray-900 text-gray-300 focus:ring-2 focus:ring-red-400 focus:outline-none"
              />
              <button
                onClick={() => handleRemoveAdmin(removeAdminInput)}
                className={`w-full px-4 py-2 rounded text-sm font-bold ${isRemovingAdmin
                  ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                  : "bg-red-500 hover:bg-red-600"
                  }`}
                disabled={isRemovingAdmin}
              >
                {isRemovingAdmin ? "Removing..." : "Remove Admin"}
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

        {showModal && selectedInstance !== null && (
          <VotingModal
            instanceId={selectedInstance}
            onClose={() => setShowModal(false)}
            contractAddress={contractAddress}
            walletAddress={selectedWallet as string}
          />
        )}
      </div>
    </div>

  );
}