"use client";

import React, { useEffect, useState } from "react";
import { createPublicClient, http, Address } from "viem";
import { holesky } from "viem/chains";
import { Organization } from "../artifacts/Organization.ts";

export default function OrganizationDetailsPage({ params }: { params: { address: string } }) {
  const { address } = params;
  const [organizationName, setOrganizationName] = useState<string>("");
  const [organizationToken, setOrganizationToken] = useState<string>("");

  const viemClient = createPublicClient({
    chain: holesky,
    transport: http(),
  });

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const name = await viemClient.readContract({
          address: address as Address,
          abi: Organization,
          functionName: "name",
        });

        const token = await viemClient.readContract({
          address: address as Address,
          abi: Organization,
          functionName: "token",
        });

        setOrganizationName(name as string);
        setOrganizationToken(token as string);
      } catch (error) {
        console.error("Error fetching organization details:", error);
      }
    };

    fetchDetails();
  }, [address]);

  return (
    <div className="min-h-screen p-6">
      <h1 className="text-2xl font-bold mb-4">Organization Details</h1>
      <p>
        <strong>Name:</strong> {organizationName || "Loading..."}
      </p>
      <p>
        <strong>ERC Token:</strong> {organizationToken || "Loading..."}
      </p>
    </div>
  );
}