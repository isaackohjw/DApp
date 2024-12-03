"use client";

import React, { useEffect, useState } from "react";
import {
  createPublicClient, createWalletClient, http, Address, custom, type Hash,
  type TransactionReceipt,
} from "viem";
import { VotingInstanceCard } from "@/components/voting_instance";
import { VotingResultsCard } from "@/components/voting_results";
import { AddVotingInstanceModal } from "@/components/add_voting";
import { holesky } from "viem/chains";
import { Organization } from "../../../../artifacts/Organization.ts";
import { usePathname } from "next/navigation";
import { Titlebar } from "@/components/titlebar";
import { Tabs } from "@/components/dashboard_taskbar";

export default function Session() {
  const [contractAddress, setContractAddress] = useState<string>("");
  const [sessionId, setSessionId] = useState<string>("");

  const pathname = usePathname();
  useEffect(() => {
    if (pathname) {
      const pathSegments = pathname.split("/").filter(Boolean); // Split and remove empty segments
      const sessionId = pathSegments.pop(); // First pop gets the session ID
      const contractAddress = pathSegments.pop();
      setContractAddress(contractAddress || "");
      setSessionId(sessionId || "");
    }

  }, [pathname]);



  return (
    <div className="min-h-screen text-white font-body">
      
    </div>

  );
}