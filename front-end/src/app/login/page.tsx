"use client";
import React from "react";
import { useState } from "react";
import { ethers } from "ethers";
import { InfuraProvider } from "ethers";
import Image from "next/image";

export default function LoginPage() {
  const [walletAddress, setWalletAddress] = useState("");
  const [isClicked, setIsClicked] = useState(false);
  const [error, setError] = useState("");
  // const provider = new ethers.BrowserProvider(window.ethereum);

  // Code using MetaMask

  /*

  const connectWallet = async () => {
    try {
      if (!window.ethereum) throw new Error("MetaMask is not installed");
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      setWalletAddress(accounts[0]); // Set connected wallet address
    } catch (err) {
      // Use type guard to ensure 'err' is an instance of Error
      if (err instanceof Error) {
        setError(err.message || "Failed to connect wallet");
      } else {
        setError("An unknown error occurred");
      }
    }
  };

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setIsLoading(true);

    if (!walletAddress || !password) {
      setError("Please connect your wallet and enter a password");
      setIsLoading(false);
      return;
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      // Request signature from the wallet
      const message = `Sign in to MyApp at ${new Date().toISOString()}`;
      const signature = await signer.signMessage(message);

      // Send wallet address, password, and signature to the backend for verification
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ walletAddress, password, signature, message }),
      });

      if (!response.ok) throw new Error("Invalid credentials");

      const data = await response.json();
      alert(`Welcome, ${data.name || "User"}!`);
    } catch (err) {
      // Use type guard to ensure 'err' is an instance of Error
      if (err instanceof Error) {
        setError(err.message || "Login failed");
      } else {
        setError("An unknown error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };

  */

  // ----------------------- Hard Coded -----------------------

  // Hardcoded wallet address for testing
  const dummyWalletAddress = "0xYourDummyWalletAddressHere";

  // Simulate the connection to the wallet
  const connectWallet = () => {
    setWalletAddress(dummyWalletAddress);
    setIsClicked(true);

    if (dummyWalletAddress.toLowerCase() === walletAddress.toLowerCase()) {
      alert("Welcome to the Voting Application!");
    } else {
      setError("Failed to connect. Please try again.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-white">
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
          className={`py-3 px-6 rounded-lg flex items-center justify-center text-white transition-colors duration-300 ${
            isClicked ? "bg-yellow-700" : "bg-yellow-500 hover:bg-yellow-600"
          }`}
          onClick={connectWallet}
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
    </div>
  );
}
