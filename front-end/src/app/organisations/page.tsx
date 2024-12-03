"use client";

import React, { useState, useEffect } from "react";
import { createWalletClient, createPublicClient, http, Address, custom } from "viem";
import { holesky } from "viem/chains";
import { OrganizationFactory } from "../../artifacts/OrganizationFactory.ts";
import { Organization } from "../../artifacts/Organization.ts";
import { Titlebar } from "@/components/titlebar";
import { OrganisationBox } from "@/components/organisation_box";
import { AddOrganisation } from "@/components/add_organisation";

export default function OrganisationPage() {
  const factoryAddress: Address = "0x5b5bb3ced52d2aca87096f72e437f1d30939258f";
  const [wallets, setWallets] = useState<string[]>([]);
  const [selectedWallet, setSelectedWallet] = useState<string | null>(null);
  const [organizations, setOrganizations] = useState<string[]>([]);
  const [organizationDetails, setOrganizationDetails] = useState<
    { name: string; owner: string; token: string; address: string; isAdmin: boolean }[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const handleSelectWallet = async (wallet: string) => {
    try {
      setSelectedWallet(wallet);
      localStorage.setItem("selectedWallet", wallet);
      if (typeof window !== "undefined" && window.ethereum) {
        const client = createWalletClient({
          account: wallet as Address,
          chain: holesky,
          transport: custom(window.ethereum),
        });
        setWalletClient(client);
      }
    } catch (error) {
      console.error("Error switching wallet:", error);
    }
  };

  const fetchOrganizationDetails = async () => {
    try {
      setLoading(true);
      // Fetch all organization addresses from the factory
      const data = await viemClient.readContract({
        address: factoryAddress,
        abi: OrganizationFactory,
        functionName: "getOrganizations",
        args: [],
      });
  
      setOrganizations(data as string[]);
  
      // Fetch details for each organization
      const details = await Promise.all(
        (data as Address[]).map(async (address) => {
          // Get organization name
          const name = await viemClient.readContract({
            address: address,
            abi: Organization,
            functionName: "name",
          });
  
          // Get organization owner
          const owner = await viemClient.readContract({
            address: address,
            abi: Organization,
            functionName: "owner",
          });
  
          // Get token address
          const token = await viemClient.readContract({
            address: address,
            abi: Organization,
            functionName: "token",
          });
  
          //Check if the current wallet is an admin
          const isAdmin = await viemClient.readContract({
            address: address,
            abi: Organization,
            functionName: "admins",
            args: [selectedWallet as Address],
          });
  
          return {
            name: name as string,
            owner: owner as string,
            token: token as string,
            address: address,
            isAdmin: Boolean(isAdmin),
          };
        })
      );
      setOrganizationDetails(details);
    } catch (error) {
      console.error("Error fetching organizations:", error);
    } finally {
      setLoading(false);
    }
  };

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

  const handleAddOrganisation = async (data: {
    name: string;
    tokenAddress: string;
  }) => {
    try {
      setCreating(true);
      const tokenAddress: Address = data.tokenAddress as Address;
      const [account] = await walletClient.getAddresses();
      await walletClient.writeContract({
        address: factoryAddress,
        abi: OrganizationFactory,
        functionName: "createOrganization",
        args: [data.name, tokenAddress],
        account,
      });
      alert("Organization created successfully!");
      //alert("Organization created successfully!");
      //fetchOrganizationDetails(); // Refresh the organization list
    } catch (error) {
      console.error("Error creating organization:", error);
      alert("Failed to create organization. Please try again.");
    } finally {
      setCreating(false);
      setIsModalOpen(false);
    }
  };

  return (
    <div className="min-h-screen relative">
      {/* Titlebar */}
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

      <p className="mt-2 text-base text-gray-300 font-body text-center">
        Select an organisation to begin voting, manage roles, or explore
        details.
      </p>

      <div className="flex flex-wrap gap-4 p-6">
        {loading ? (
          <p>Loading organizations...</p>
        ) : organizationDetails.length > 0 ? (
          organizationDetails.map((org) => (
            <OrganisationBox
              key={org.address}
              name={org.name}
              //profilePic="/default-profile.png"
              role={
                org.owner.toLowerCase() === selectedWallet?.toLowerCase()
                  ? "Owner"
                  : org.isAdmin
                  ? "Admin"
                  : "Member"
              }
              token={org.address}
            //description={`Managed by: ${org.owner}`}
            />
          ))
        ) : (
          <p>No organizations found.</p>
        )}

        {/* Plus Button */}
        <div className="fixed bottom-6 right-6">
          <div className="group relative">
            {/* Plus Icon */}
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-gray-700 text-white w-10 h-10 rounded-full flex items-center justify-center shadow-lg hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 border-2 border-gray-300"
            >
              <span className="text-3xl font-thin">+</span>
            </button>

            {/* Tooltip */}
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <span className="flex justify-center items-center text-white text-center text-xs font-normal px-3 py-1 rounded-full font-body shadow-lg">
                Add Organisation
              </span>
            </div>
          </div>
        </div>

        {/* Add Organisation Modal */}
        {isModalOpen && (
          <AddOrganisation
            onClose={() => setIsModalOpen(false)}
            onCreate={handleAddOrganisation}
          />
        )}
      </div>
    </div>
  );
}
