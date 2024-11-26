"use client";
import React from "react";
import { useState } from "react";
import { ethers } from "ethers";
import { InfuraProvider } from "ethers";
import Image from "next/image";

export default function LoginPage() {
  const [walletAddress, setWalletAddress] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
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

  // Hardcoded wallet address and password for testing
  const dummyWalletAddress = "0xYourDummyWalletAddressHere";
  const dummyPassword = "123456";

  // Simulate the connection to the wallet (hardcode)
  const connectWallet = () => {
    setWalletAddress(dummyWalletAddress);
    setIsClicked(true);
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

    // Simulate signing process with a dummy signature (no MetaMask needed)
    try {
      const message = `Sign in to MyApp at ${new Date().toISOString()}`;
      const signature = ethers.hashMessage(message);

      // Simulate a backend request for login verification
      if (
        walletAddress.toLowerCase() === dummyWalletAddress.toLowerCase() &&
        password === dummyPassword
      ) {
        const response = { name: "John Doe" };
        alert(`Welcome, ${response.name}!`);
      } else {
        setError("Invalid credentials");
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message || "Login failed");
      } else {
        setError("An unknown error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen flex-col">
      <div className="text-center mb-16">
        <span className="text-4xl rainbow-text font-title">
          Voting Application
        </span>
      </div>
      <div className="bg-gray-800 p-6 rounded-lg shadow-md w-full max-w-sm">
        {error && <div className="text-red-600 text-sm mb-4">{error}</div>}
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <button
              type="button"
              className={`w-full py-2 px-4 rounded flex items-center justify-center text-white transition-colors duration-400 
        ${isClicked ? "bg-yellow-700" : "bg-yellow-500 hover:bg-yellow-600"}`}
              onClick={connectWallet}
            >
              {walletAddress ? "Wallet Connected" : "Connect Wallet"}

              <Image
                src="/MetaMask_Fox.webp"
                alt="MetaMask Logo"
                width={28}
                height={28}
                className="ml-2"
              />
            </button>
          </div>
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-500"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 p-2 w-full border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
              placeholder="Enter your Password"
              required
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-700 disabled:opacity-50"
          >
            {isLoading ? "Signing In..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
