import React, { useState, useEffect } from "react";

type WalletSelectorProps = {
  walletAddress: string;
};

type Transaction = {
  from: string;
  to: string;
  value: number;
  tokenSymbol: string;
  tokenName: string;
};

export const TokenInfo: React.FC<WalletSelectorProps> = ({
  walletAddress,
}) => {
  const [transactions, setTransactions] = useState<Record<string, Transaction[]>>({});
  const [tokenBalances, setTokenBalances] = useState<Record<string, number>>({});
  const [founderTokens, setFounderTokens] = useState<Transaction[]>([]);
  const [eligibleTokens, setEligibleTokens] = useState<string[]>([]);

  const fetchTokenTransfers = async () => {
    try {
      const apiKey = process.env.NEXT_PUBLIC_ETHERSCAN_API_KEY;
      const baseUrl = "https://api-holesky.etherscan.io/api";
      const url = `${baseUrl}?module=account&action=tokentx&address=${walletAddress}&page=1&offset=100&startblock=0&endblock=99999999&sort=asc&apikey=${apiKey}`;

      const response = await fetch(url);
      const data = await response.json();

      if (data.status === "1") {
        processTransactions(data.result);
      } else {
        console.error("Error fetching token transfers:", data.message);
        alert("Failed to fetch token transfers. Please try again.");
      }
    } catch (error) {
      console.error("Error fetching token transfers:", error);
    }
  };

  const processTransactions = (rawTransactions: any[]) => {
    const transactionsByToken: Record<string, Transaction[]> = {};
    const balances: Record<string, number> = {};
    const founderTokenList: Transaction[] = [];

    rawTransactions.forEach((transfer) => {
      const tokenKey = `${transfer.tokenName} (${transfer.tokenSymbol})`;
      const decimals = parseInt(transfer.tokenDecimal || "18", 10);
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
        transfer.from === "0x0000000000000000000000000000000000000000" &&
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
      .filter(
        (founderToken) =>
          balances[`${founderToken.tokenName} (${founderToken.tokenSymbol})`] > 0
      )
      .map(
        (founderToken) =>
          `${founderToken.tokenName} (${founderToken.tokenSymbol})`
      );

    setEligibleTokens(eligible);
  };

  useEffect(() => {
    if (walletAddress) {
      fetchTokenTransfers();
    }
  }, [walletAddress]);

  return (
    <div>
      <h1 className="text-white text-2xl">Token Dashboard</h1>
      <div>
      Displays detailed insights about your ERC20 tokens, including balances, eligible tokens for organization creation and founding tokens. It helps you track and manage your token holdings effectively, ensuring you stay informed and in control
      </div>
      <div className="mt-8">
        <h2 className="text-xl mb-4">Token Balance</h2>
        {Object.keys(tokenBalances).length > 0 ? (
          <ul className="bg-gray-700 shadow-lg rounded-lg p-4">
            {Object.entries(tokenBalances).map(([token, balance]) => (
              <li
                key={token}
                className="flex justify-between items-center py-2 border-b last:border-none"
              >
                <span className="text-white font-medium">{token}</span>
                <span className="text-white">{balance.toFixed(4)}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No token balances available</p>
        )}
      </div>

      {/* Eligible Tokens */}
      <div className="mt-8">
        <h2 className="text-xl mb-4">
          Eligible tokens to create organization
        </h2>
        {eligibleTokens.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {eligibleTokens.map((token, index) => (
              <div
                key={index}
                className="bg-gray-700 shadow-lg rounded-lg p-4 flex flex-col items-center justify-between"
              >
                <h3 className="text-lg font-semibold text-white">{token}</h3>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">
            No tokens eligible for organization creation.
          </p>
        )}
      </div>
      
      {/* Founding Tokens */}
      <div className="mt-8">
        <h2 className="text-xl mb-4">
          Founding Tokens
        </h2>
        {founderTokens.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {founderTokens.map((token, index) => (
              <div
                key={index}
                className="bg-gray-700 shadow-md rounded-lg p-4 flex flex-col items-center"
              >
                <h3 className="text-lg font-semibold text-white">
                  {token.tokenName} ({token.tokenSymbol})
                </h3>
                <p className="text-white mt-2">
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
  );
};