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
  const factoryAddress: Address = "0x40dcac9d2c852d650a9143c5da650b05095f351b";
  const [wallets, setWallets] = useState<string[]>([]);
  const [selectedWallet, setSelectedWallet] = useState<string | null>(null);
  const [organizations, setOrganizations] = useState<string[]>([]);
  const [organizationDetails, setOrganizationDetails] = useState<
    { name: string; owner: string; token: string; symbol:string; address: string; isAdmin: boolean; tokenBalance: number }[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [modalData, setModalData] = useState<{ name?: string; tokenAddress?: string } | null>(null);

  const tabs = [
    { label: "Organizations", value: "organizations" },
  ];

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
      const data = await viemClient.readContract({
        address: factoryAddress,
        abi: OrganizationFactory,
        functionName: "getOrganizations",
        args: [],
      });
      const organizationAddresses = data as Address[];
      setOrganizations(organizationAddresses);
      const details = await Promise.all(
        organizationAddresses.map(async (address) => {
          try {
            // Get organization name
            const name = await viemClient.readContract({
              address,
              abi: Organization,
              functionName: "name",
            });

            // Get organization owner
            const owner = await viemClient.readContract({
              address,
              abi: Organization,
              functionName: "owner",
            });

            // Get token address
            const token = await viemClient.readContract({
              address,
              abi: Organization,
              functionName: "token",
            });

            // Check if the current wallet is an admin
            const isAdmin = await viemClient.readContract({
              address,
              abi: Organization,
              functionName: "admins",
              args: [selectedWallet as Address],
            });

            const tokenSymbol = await viemClient.readContract({
              address: token as Address,
              abi: [
                {
                  constant: true,
                  inputs: [],
                  name: "symbol",
                  outputs: [{ name: "", type: "string" }],
                  type: "function",
                },
              ],
              functionName: "symbol",
            });

            // Fetch the token balance of the current wallet
            const tokenBalance = await viemClient.readContract({
              address: token as Address,
              abi: [
                {
                  constant: true,
                  inputs: [{ name: "_owner", type: "address" }],
                  name: "balanceOf",
                  outputs: [{ name: "balance", type: "uint256" }],
                  type: "function",
                },
              ],
              functionName: "balanceOf",
              args: [selectedWallet as Address],
            }) as bigint;

            // Convert token balance to a readable number (ensure safe conversion)
            const tokenBalanceNumber =
              BigInt(tokenBalance) <= BigInt(Number.MAX_SAFE_INTEGER)
                ? Number(tokenBalance)
                : Number(tokenBalance / BigInt(10 ** 18));

            // Return organization details
            return {
              name: name as string,
              owner: owner as string,
              token: token as string,
              address,
              isAdmin: Boolean(isAdmin),
              tokenBalance: tokenBalanceNumber,
              symbol: tokenSymbol as string,
            };
          } catch (innerError) {
            console.error(`Error fetching details for organization at ${address}:`, innerError);
            return null;
          }
        })
      );

      setOrganizationDetails(details.filter((org) => org !== null));
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
      console.log("Creating organization with data:", data);
      setCreating(true);
      const tokenAddress: Address = data.tokenAddress as Address;
      const { request } = await viemClient.simulateContract({
        address: factoryAddress,
        account: selectedWallet as Address,
        abi: OrganizationFactory,
        functionName: "createOrganization",
        args: [data.name, tokenAddress],
      });
      const hash = await walletClient.writeContract(request);
      const receipt = await viemClient.waitForTransactionReceipt({ hash });

      if (receipt.status === "success") {
        alert("Organization created successfully!");
      }
      else {
        alert("Failed to create organization. Please try again.");
      }
    } catch (error) {
      alert(error);
    } finally {
      setCreating(false);
      setIsModalOpen(false);
      fetchOrganizationDetails();
    }
  };

  return (
    <div className="min-h-screen relative container mx-auto">
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

      <p className="container mt-24 mb-8 text-base text-gray-300 font-body text-center">
        Select an organisation to begin voting, manage roles, or explore details.
      </p>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 justify-items-center">
        {loading ? (
          <p>Loading organizations...</p>
        ) : organizationDetails.length > 0 ? (
          organizationDetails.map((org) => (
            <OrganisationBox
              key={org.address}
              name={org.name}
              role={
                org.owner.toLowerCase() === selectedWallet?.toLowerCase()
                  ? "Owner"
                  : org.isAdmin
                    ? "Admin"
                    : "Voter"
              }
              token={org.address}
              tokenSymbol={org.symbol}
              balance={org.tokenBalance}
            />
          ))
        ) : (
          <p>No organizations found.</p>
        )}
      </div>

      {/* Plus Button */}
      <div className="fixed bottom-6 right-6">
        <div className="group relative">
          {/* Plus Icon */}
          <button
            onClick={() => {
              setModalData({ name: "", tokenAddress: "" });
              setIsModalOpen(true); // Open the modal
            }}
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
          onCreate={(data) => handleAddOrganisation(data)} // Correctly invoke the function
        />
      )}
    </div>
  );
}
