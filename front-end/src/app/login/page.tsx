"use client";
import React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

type WalletModalProps = {
  wallets: string[];
  onSelectWallet: (wallet: string) => void;
  onClose: () => void;
};

export const WalletModal: React.FC<WalletModalProps> = ({
  wallets,
  onSelectWallet,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70">
      <div className="flex flex-col bg-gray-900 p-6 rounded-lg w-[50vw] h-[60vh] items-center justify-center">
        <h2 className="rainbow-text text-xl mb-4 text-gray-700 text-center">
          Select a Wallet
        </h2>
        <ul className="space-y-4">
          {wallets.map((wallet, index) => (
            <li key={index}>
              <button
                className="w-full text-left py-2 px-4 bg-gray-800 hover:bg-gray-300 rounded-lg"
                onClick={() => onSelectWallet(wallet)}
              >
                <div className="font-bold">
                  Wallet {index + 1}
                </div>
                {wallet.slice(0, 20)}...{wallet.slice(-4)}
              </button>
            </li>
          ))}
        </ul>
        <button
          className="mt-4 py-2 px-4 bg-red-500 text-white rounded-lg"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default function LoginPage() {
  const router = useRouter();
  const [wallets, setWallets] = useState<string[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [walletConnected, setWalletConnected] = useState(false);
  const [accounts, setAccounts] = useState<string[]>([]);
  const [activeWallet, setActiveWallet] = useState<string | null>(null);
  const [walletAddress, setWalletAddress] = useState("");
  const [isClicked, setIsClicked] = useState(false);
  const [error, setError] = useState("");
  const fetchAllAccounts = async () => {
    try {
      if (!window.ethereum) {
        alert('MetaMask is not installed. Please install MetaMask!');
        return;
      }

      const requestedAccounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      if (requestedAccounts && requestedAccounts.length > 0) {
        setWallets(requestedAccounts);
        localStorage.setItem("wallets", JSON.stringify(requestedAccounts)); // Save all wallets
        localStorage.setItem("selectedWallet", requestedAccounts[0]);
        setShowModal(true);
      } else {
        alert('No accounts found. Please connect your wallet.');
      }
    } catch (error) {
      console.error('Error fetching accounts:', error);
    }
  };

  const handleSelectWallet = (wallet: string) => {
    // Store selected wallet and navigate to the next page
    localStorage.setItem("selectedWallet", wallet);
    setShowModal(false);
    router.push("/organisations"); // Replace with the actual next page route
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-white font-body">
      <div className="text-center mb-4">
        <h1 className="text-5xl font-title rainbow-text mb-2 leading-normal">
          Voting Application
        </h1>
        <p className="mt-4 text-xl text-gray-400 font-title mb-20">
          Secure. Transparent. Decentralised.
        </p>
        <p className="mt-2 text-sm text-gray-300">
          Connect your wallet to sign in.
        </p>
      </div>
      {/* Wallet connection button */}
      <div className="text-center">
        {error && <div className="text-red-600 text-sm mb-4">{error}</div>}
        <button
          type="button"
          className={`py-3 px-6 rounded-lg flex items-center justify-center text-white transition-colors duration-300 ${isClicked ? "bg-yellow-700" : "bg-yellow-500 hover:bg-yellow-600"
            }`}
          onClick={fetchAllAccounts}
        >
          {walletAddress ? "Wallet Connected" : "Connect Wallet"}
          <img
            src="/MetaMask_Fox.webp"
            alt="MetaMask Logo"
            width={28}
            height={28}
            className="ml-2"
          />
        </button>
      </div>
      {showModal && (
        <WalletModal
          wallets={wallets}
          onSelectWallet={handleSelectWallet}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}
