"use client";

import React, { useState, useEffect } from "react";
import { createWalletClient, createPublicClient, http, Address, custom } from "viem";
import { holesky } from "viem/chains";
import { OrganizationFactory } from "../../artifacts/OrganizationFactory.ts";
import { Organization } from "../../artifacts/Organization.ts";
import { Titlebar } from "@/components/titlebar";
import { OrganisationBox } from "@/components/organisation_box";
import { AddOrganisation } from "@/components/add_organisation";
import { Tabs } from "@/components/dashboard_taskbar";

interface Transaction {
  from: string;
  to: string;
  value: number;
  tokenSymbol: string;
  tokenName: string;
}

export default function OrganisationPage() {
  const [activeTab, setActiveTab] = useState("walletDetails");
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
  const [transactions, setTransactions] = useState<Record<string, Transaction[]>>({});
  const [founderTokens, setFounderTokens] = useState<
    { name: string; symbol: string; address: string; value: number }[]
  >([]);
  const [tokenBalances, setTokenBalances] = useState<
    Record<string, { name: string; symbol: string; address: string; balance: number }>
  >({});
  const [eligibleTokens, setEligibleTokens] = useState<
    { name: string; symbol: string; address: string }[]
  >([]);

  const [modalData, setModalData] = useState<{ name?: string; tokenAddress?: string } | null>(null);

  const tabs = [
    { label: "Organizations", value: "organizations" },
    { label: "Wallet Details", value: "walletDetails" },
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

  const fetchTokenTransfers = async (walletAddress: string) => {
    try {
      const apiKey = process.env.NEXT_PUBLIC_ETHERSCAN_API_KEY;
      const baseUrl = 'https://api-holesky.etherscan.io/api';
      const url = `${baseUrl}?module=account&action=tokentx&address=${walletAddress}&page=1&offset=100&startblock=0&endblock=99999999&sort=asc&apikey=${apiKey}`;

      const response = await fetch(url);
      const data = await response.json();

      if (data.status === '1') {
        processTransactions(data.result, walletAddress);
      } else {
        console.error('Error fetching token transfers:', data.message);
        alert('Failed to fetch token transfers. Please try again.');
      }
    } catch (error) {
      console.error('Error fetching token transfers:', error);
    }
  };

  const processTransactions = (rawTransactions: any[], walletAddress: string) => {
    const tokenDetails: Record<string, { name: string; symbol: string; address: string; balance: number }> = {};
    const founderTokenList: { name: string; symbol: string; address: string; value: number }[] = [];

    rawTransactions.forEach((transfer) => {
      const decimals = parseInt(transfer.tokenDecimal || "18", 10);
      const value = parseFloat(transfer.value) / Math.pow(10, decimals);
      const tokenKey = transfer.contractAddress.toLowerCase();

      if (!tokenDetails[tokenKey]) {
        tokenDetails[tokenKey] = {
          name: transfer.tokenName,
          symbol: transfer.tokenSymbol,
          address: transfer.contractAddress,
          balance: 0,
        };
      }

      // Update balances
      if (transfer.to.toLowerCase() === walletAddress.toLowerCase()) {
        tokenDetails[tokenKey].balance += value;
      } else if (transfer.from.toLowerCase() === walletAddress.toLowerCase()) {
        tokenDetails[tokenKey].balance -= value;
      }

      // Identify founder tokens
      if (
        transfer.from === "0x0000000000000000000000000000000000000000" &&
        transfer.to.toLowerCase() === walletAddress.toLowerCase()
      ) {
        founderTokenList.push({
          name: transfer.tokenName,
          symbol: transfer.tokenSymbol,
          address: transfer.contractAddress,
          value,
        });
      }
    });
    // Set state
    setTokenBalances(tokenDetails);
    setFounderTokens(founderTokenList);

    const eligible = Object.values(tokenDetails)
      .filter((token) => token.balance > 0)
      .map(({ name, symbol, address }) => ({ name, symbol, address }));

    setEligibleTokens(eligible);
    console.log("Token Details:", tokenDetails);
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
      fetchTokenTransfers(selectedWallet);
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
    <div className="min-h-screen relative">
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
      {activeTab === "organizations" && (
        <>
          <p className="mt-2 text-base text-gray-300 font-body text-center">
            Select an organisation to begin voting, manage roles, or explore details.
          </p>

          <div className="flex flex-wrap gap-4 p-6">
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
                        : "Member"
                  }
                  token={org.address}
                  balance={tokenBalances[org.token.toLowerCase()]?.balance || 0} 
                />
              ))
            ) : (
              <p>No organizations found.</p>
            )}
          </div>
        </>
      )}

      {activeTab === "walletDetails" && (
        <div className="container mx-auto">
          <div className="">
            <h2 className="text-lg my-4">
              Eligible Tokens for Organization Creation
            </h2>
            {eligibleTokens.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {eligibleTokens.map((token, index) => (
                  <div
                    key={index}
                    className="bg-gray-800 shadow-lg rounded-lg p-4 flex flex-col items-center justify-between"
                  >
                    <h3 className="text-lg font-semibold text-white">{token.name}</h3>
                    <p className="text-gray-400 text-sm"> {token.symbol} </p>
                    <button
                      className="my-2 px-2 py-2 bg-green-600 text-white rounded-lg hover:bg-green-600 transition"
                      onClick={() => {
                        setModalData({
                          name: token.name,
                          tokenAddress: token.address,
                        });
                        setIsModalOpen(true);
                      }}
                    >
                      Create Organization
                    </button>
                    <div className="flex justify-center mb-2">
                      <div className="bg-gray-700 bg-opacity-80 text-white rounded-full px-3 py-1 text-xs font-semibold border-2 border-gray-500 transform transform transition-all duration-300 hover:bg-gray-400 hover:scale-105">
                        {token.address}
                      </div>
                    </div>
                    
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No tokens eligible for organization creation.</p>
            )}
          </div>

          {/* Token Balances Section */}
          <div className="mt-8">
            <h2 className="text-lg mb-4">Token Balances</h2>
            <h2 className="text-gray-400 text-md">Wallet Address: {selectedWallet}</h2>

            {Object.keys(tokenBalances).length > 0 ? (
              <ul className="bg-gray-800 shadow-lg rounded-lg p-4 divide-y divide-gray-600">
                {Object.entries(tokenBalances).map(([address, { name, symbol, balance }]) => (
                  <li
                    key={address}
                    className="flex flex-col space-y-2 py-4"
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold text-gray-400">
                        {name} <span className="text-sm text-gray-600">({symbol})</span>
                      </span>
                      <span className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                        Balance: {balance}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">
                      <span className="font-medium">Address:</span> {address}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No token balances available</p>
            )}
          </div>

          {/* Founding Tokens Section */}
          <div className="mt-8">
            <h2 className="text-lg mb-4">Founding Tokens</h2>
            {founderTokens.length > 0 ? (
              <div className="flex flex-col gap-4">
                {founderTokens.map((token, index) => (
                  <div
                    key={index}
                    className="bg-gray-800 shadow-md rounded-lg p-4 flex flex-col items-center"
                  >
                    <h3 className="text-lg font-semibold text-gray-400">
                      {token.name} ({token.symbol})
                    </h3>
                    <p className="text-gray-500 text-sm">Address: {token.address}</p>
                    <p className="text-gray-600 mt-2">
                      Value: {token.value.toFixed(4)} {token.symbol}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No founding tokens found.</p>
            )}
          </div>
        </div>

      )}
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
          prefillData={modalData} // Pass pre-filled data
        />
      )}
    </div>
  );
}
