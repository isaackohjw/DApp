'use client';
import { useState, useEffect, useRef } from 'react';

interface Transaction {
  from: string;
  to: string;
  value: number;
  tokenSymbol: string;
  tokenName: string;
}

export default function Token() {
  const [walletConnected, setWalletConnected] = useState(false);
  const [accounts, setAccounts] = useState<string[]>([]);
  const [activeWallet, setActiveWallet] = useState<string | null>(null); // Active wallet
  const [transactions, setTransactions] = useState<Record<string, Transaction[]>>({});
  const [founderTokens, setFounderTokens] = useState<Transaction[]>([]);
  const [tokenBalances, setTokenBalances] = useState<Record<string, number>>({});
  const [eligibleTokens, setEligibleTokens] = useState<string[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fetch accounts from MetaMask
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
        setAccounts(requestedAccounts);
        setWalletConnected(true);
        setIsDropdownOpen(true);
      } else {
        alert('No accounts found. Please connect your wallet.');
      }
    } catch (error) {
      console.error('Error fetching accounts:', error);
    }
  };

  const handleWalletSelection = async (account: string) => {
    setActiveWallet(account);
    await fetchTokenTransfers(account);
    setIsDropdownOpen(false); // Close dropdown after selection
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
    const transactionsByToken: Record<string, Transaction[]> = {};
    const balances: Record<string, number> = {};
    const founderTokenList: Transaction[] = [];

    rawTransactions.forEach((transfer) => {
      const tokenKey = `${transfer.tokenName} (${transfer.tokenSymbol})`;
      const decimals = parseInt(transfer.tokenDecimal || '18', 10);
      const value = parseFloat(transfer.value) / Math.pow(10, decimals);

      if (!transactionsByToken[tokenKey]) {
        transactionsByToken[tokenKey] = [];
        balances[tokenKey] = 0;
      }

      transactionsByToken[tokenKey].push({
        from: transfer.from,
        to: transfer.to,
        value,
        tokenSymbol: transfer.tokenSymbol,
        tokenName: transfer.tokenName,
      });

      if (transfer.to.toLowerCase() === walletAddress.toLowerCase()) {
        balances[tokenKey] += value;
      } else if (transfer.from.toLowerCase() === walletAddress.toLowerCase()) {
        balances[tokenKey] -= value;
      }

      if (
        transfer.from === '0x0000000000000000000000000000000000000000' &&
        transfer.to.toLowerCase() === walletAddress.toLowerCase()
      ) {
        founderTokenList.push({
          from: transfer.from,
          to: transfer.to,
          value,
          tokenSymbol: transfer.tokenSymbol,
          tokenName: transfer.tokenName,
        });
      }
    });

    setTransactions(transactionsByToken);
    setTokenBalances(balances);
    setFounderTokens(founderTokenList);

    const eligible = founderTokenList
      .filter((founderToken) => balances[`${founderToken.tokenName} (${founderToken.tokenSymbol})`] > 0)
      .map((founderToken) => `${founderToken.tokenName} (${founderToken.tokenSymbol})`);

    setEligibleTokens(eligible);
  };

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

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
        {/* Selected Wallet Address */}
        {walletConnected && activeWallet && (
          <div className="bg-white shadow-md rounded-lg p-4 mb-6">
            <h2 className="text-gray-700 text-lg font-semibold">Selected Wallet:</h2>
            <p className="text-blue-600 text-sm font-medium">{activeWallet}</p>
          </div>
        )}

        {/* Eligible Tokens Section */}
        <div className="mt-8">
          <h2 className="text-xl font-bold text-green-700 mb-4">
            Eligible Tokens for Organization Creation
          </h2>
          {eligibleTokens.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {eligibleTokens.map((token, index) => (
                <div
                  key={index}
                  className="bg-white shadow-lg rounded-lg p-4 flex flex-col items-center justify-between"
                >
                  <h3 className="text-lg font-semibold text-gray-800">{token}</h3>
                  <button
                    className="mt-4 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
                    onClick={() => alert(`Creating an organization for ${token}`)}
                  >
                    Create Organization
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No tokens eligible for organization creation.</p>
          )}
        </div>

        {/* Token Balances Section */}
        <div className="mt-12">
          <h2 className="text-xl font-bold text-blue-700 mb-4">Token Balances</h2>
          {Object.keys(tokenBalances).length > 0 ? (
            <ul className="bg-white shadow-lg rounded-lg p-4">
              {Object.entries(tokenBalances).map(([token, balance]) => (
                <li
                  key={token}
                  className="flex justify-between items-center py-2 border-b last:border-none"
                >
                  <span className="text-gray-800 font-medium">{token}</span>
                  <span className="text-gray-700">{balance.toFixed(4)}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No token balances available</p>
          )}
        </div>
        <div className="mt-8">
          <h2 className="text-xl font-bold text-purple-700 mb-4">Founding Tokens</h2>
          {founderTokens.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {founderTokens.map((token, index) => (
                <div
                  key={index}
                  className="bg-white shadow-md rounded-lg p-4 flex flex-col items-center"
                >
                  <h3 className="text-lg font-semibold text-gray-800">
                    {token.tokenName} ({token.tokenSymbol})
                  </h3>
                  <p className="text-gray-600 mt-2">
                    Value: {token.value.toFixed(4)} {token.tokenSymbol}
                  </p>
                  
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No founding tokens found.</p>
          )}
        </div>
      </div>


    </div>
  );
}