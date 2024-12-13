"use client";
import { useState, useRef, useEffect } from "react";
import { createWalletClient, custom, Address } from "viem";
import { holesky } from "viem/chains";
import { privateKeyToAccount } from 'viem/accounts'

const AddAdmin = () => {
  const organizationAbi = [
    {
      inputs: [{ internalType: "address", name: "admin", type: "address" }],
      name: "addAdmin",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
  ];

  const organizationAddress: Address = "0xcC26E88E31d0590b2d053FD33b581ECc27FBEF90"; // Replace with your contract address
  const [walletConnected, setWalletConnected] = useState(false);
  const [accounts, setAccounts] = useState<string[]>([]);
  const [activeWallet, setActiveWallet] = useState<string | null>(null);
  const [walletClient, setWalletClient] = useState<any>(null);
  const [newAdmin, setNewAdmin] = useState<string>("");
  const [status, setStatus] = useState<string>("Not connected");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fetch all accounts from MetaMask
  const fetchAllAccounts = async () => {
    if (!window.ethereum) {
      alert("MetaMask is not installed. Please install MetaMask!");
      return;
    }
    try {
      const requestedAccounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      if (requestedAccounts && requestedAccounts.length > 0) {
        setAccounts(requestedAccounts);
        setWalletConnected(true);
      } else {
        alert("No accounts found. Please connect your wallet.");
      }
    } catch (error) {
      console.error("Error fetching accounts:", error);
    }
  };

  // Handle account selection
  const handleWalletSelection = async (account: string) => {
    setActiveWallet(account);
    const client = createWalletClient({
        chain: holesky,
        transport: custom(window.ethereum!)
    });

    const [address] = await client.getAddresses() 
    setWalletClient(client);
    setStatus(`Active Wallet: ${account}`);
    setIsDropdownOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleAddAdmin = async () => {
    if (!walletClient || !activeWallet) {
      alert("Please connect your wallet first.");
      return;
    }
    if (!newAdmin) {
      alert("Please enter a valid admin address.");
      return;
    }

    try {
      const { request } = await walletClient.writeContract({
        address: organizationAddress,
        abi: organizationAbi,
        functionName: "addAdmin",
        args: [newAdmin as Address],
        account: activeWallet as Address,
      });

      console.log("Transaction Request:", request);
      setStatus("Transaction sent. Check MetaMask for confirmation.");
    } catch (error) {
      console.error("Error calling addAdmin:", error);
      setStatus("Failed to send transaction");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-blue-600 p-4 flex justify-between items-center">
        <h1 className="text-white text-2xl font-bold">Token Dashboard</h1>
        <div className="relative">
          <button
            className="px-4 py-2 bg-white text-blue-600 font-medium rounded-lg hover:bg-gray-200 transition"
            onClick={() => {
              if (!walletConnected) {
                fetchAllAccounts();
              } else {
                setIsDropdownOpen(!isDropdownOpen);
              }
            }}
          >
            Wallet
          </button>

          {isDropdownOpen && walletConnected && accounts.length > 0 && (
            <div
              ref={dropdownRef}
              className="absolute right-0 mt-2 bg-white shadow-lg rounded-lg w-60 z-50"
            >
              <ul className="py-2">
                {accounts.map((account, index) => (
                  <li
                    key={index}
                    onClick={() => handleWalletSelection(account)}
                    className="px-4 py-3 text-gray-800 hover:bg-gray-100 cursor-pointer"
                  >
                    <span className="font-semibold">Wallet {index + 1}</span>
                    <br />
                    <span className="text-sm text-gray-600">
                      {account.slice(0, 6)}...{account.slice(-4)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </nav>

      <div className="container mx-auto p-6">
        {walletConnected && activeWallet && (
          <div className="bg-white shadow-md rounded-lg p-4 mb-6">
            <h2 className="text-gray-700 text-lg font-semibold">Selected Wallet:</h2>
            <p className="text-blue-600 text-sm font-medium">{activeWallet}</p>
          </div>
        )}

        {walletConnected && (
          <div className="bg-white shadow-md rounded-lg p-4">
            <h2 className="text-gray-700 text-lg font-semibold">Add Admin</h2>
            <input
              type="text"
              placeholder="Enter admin address"
              value={newAdmin}
              onChange={(e) => setNewAdmin(e.target.value)}
              className="border rounded-lg p-2 w-full mt-2"
            />
            <button
              onClick={handleAddAdmin}
              className="mt-4 px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition"
            >
              Add Admin
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddAdmin;
