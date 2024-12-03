"use client";

import React, { useEffect, useState } from "react";
import { createWalletClient, createPublicClient, http, Address, custom } from "viem";
import { holesky } from "viem/chains";
import { VotingInstanceCard } from "@/components/voting_instance";
import { VotingResultsCard } from "@/components/voting_results";
import { AddVotingInstanceModal } from "@/components/add_voting";
import { AddRemoveAdminModal } from "@/components/manage_admin";
import { ConfirmationModal } from "@/components/confirmation_modal";
import { Role, VotingInstance, VotingStatus, VotingChoice } from "@/global_var";
import { Tabs } from "@/components/dashboard_taskbar";
import { Titlebar } from "@/components/titlebar";
import { VotingModal } from "@/components/voting_modal";
import { TokenInfo } from "@/components/token_info";
import { OrganizationFactory } from "../artifacts/OrganizationFactory.ts";
import { Organization } from "../artifacts/Organization.ts";
import { useRouter } from "next/navigation";


export default function Dashboard() {
  const router = useRouter();
  const factoryAddress: Address = "0x5b5bb3ced52d2aca87096f72e437f1d30939258f";

  const [wallets, setWallets] = useState<string[]>([]);
  const [selectedWallet, setSelectedWallet] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("currentVoting");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [newAdmin, setNewAdmin] = useState<string>(""); // Input for the new admin address
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrganization, setSelectedOrganization] = useState<string | null>(null);
  const [organizationDetails, setOrganizationDetails] = useState<
    { name: string; owner: string; address: string; isAdmin: boolean }[]
  >([]);

  const viemClient = createPublicClient({
    chain: holesky,
    transport: http(),
  });

  const walletClient = selectedWallet
    ? createWalletClient({
      account: selectedWallet as Address,
      chain: holesky,
      transport: custom(window.ethereum),
    })
    : null;

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

  useEffect(() => {
    if (selectedWallet) {
      fetchOrganizationDetails();
    }
  }, [selectedWallet]);

  const fetchOrganizationDetails = async () => {
    try {
      setLoading(true);

      const data = await viemClient.readContract({
        address: factoryAddress,
        abi: OrganizationFactory,
        functionName: "getOrganizations",
        args: [],
      });

      const details = await Promise.all(
        (data as Address[]).map(async (address) => {
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

          const isAdmin = await viemClient.readContract({
            address,
            abi: Organization,
            functionName: "admins",
            args: [selectedWallet as Address],
          });

          return {
            name: name as string,
            owner: owner as string,
            address,
            isAdmin: Boolean(isAdmin),
          };
        })
      );

      const associatedOrganizations = details.filter(
        (org) =>
          org.owner.toLowerCase() === selectedWallet?.toLowerCase() || org.isAdmin
      );

      setOrganizationDetails(associatedOrganizations);
    } catch (error) {
      console.error("Error fetching organizations:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectOrganization = (organization: string) => {
    setSelectedOrganization(organization);
  };

  const handleAddAdmin = async () => {
    if (!newAdmin || !selectedOrganization) {
      setError("Please enter a valid address and select an organization.");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const contract = walletClient?.contract({
        address: selectedOrganization as Address,
        abi: Organization,
      });

      const tx = await contract?.write.addAdmin([newAdmin]);
      console.log("Admin added successfully:", tx?.hash);

      setIsAdminModalOpen(false);
      setNewAdmin("");
    } catch (err) {
      console.error("Error adding admin:", err);
      setError("Failed to add admin. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (selectedWallet) {
      fetchOrganizationDetails();
    }
  }, [selectedWallet]);

  const handleSelectWallet = (wallet: string) => {
    setSelectedWallet(wallet);
    localStorage.setItem("selectedWallet", wallet);
  };

  const tabs = [
    { label: "Current Voting", value: "currentVoting" },
    { label: "Voting Results", value: "votingResults" },
    { label: "Manage Admins", value: "manageAdmins" },
  ];

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
        {activeTab === "currentVoting" && <div>Current Voting Instances</div>}

        {activeTab === "votingResults" && <div>Voting Results</div>}

        {activeTab === "manageAdmins" && (
          <div>
            <h2 className="text-xl mb-4">Manage Admins</h2>

            {loading ? (
              <p>Loading organizations...</p>
            ) : organizationDetails.length > 0 ? (
              <div>
                {organizationDetails.map((org) => (
                  <div
                    key={org.address}
                    className="p-4 border rounded mb-4 cursor-pointer"
                    onClick={() => router.push(`/organizations/${org.address}`)}
                  >
                    <h2 className="text-xl font-semibold">{org.name}</h2>
                    <p>
                      <strong>Role:</strong>{" "}
                      {org.owner.toLowerCase() === selectedWallet?.toLowerCase()
                        ? "Owner"
                        : org.isAdmin
                          ? "Admin"
                          : "Member"}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p>No organizations found.</p>
            )}
          </div>
        )}
      </div>

      {isAdminModalOpen && (
        <AddRemoveAdminModal
          onClose={() => setIsAdminModalOpen(false)}
          organizations={organizationDetails}
          onSelectOrganization={handleSelectOrganization}
          selectedOrganization={selectedOrganization}
          onAddAdmin={handleAddAdmin}
          newAdmin={newAdmin}
          setNewAdmin={setNewAdmin}
          isLoading={isLoading}
          error={error}
        />
      )}
    </div>
  );
}