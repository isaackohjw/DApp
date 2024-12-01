import React from "react";
import { Titlebar } from "@/components/titlebar";
import OrganisationBox from "@/components/organisation_box";

export default function OrganisationPage() {
  return (
    <div className="min-h-screen">
      {/* Titlebar */}
      <Titlebar name="John Doe" initial="J" />

      <div className="flex flex-wrap gap-4 p-6">
        {/* Organisation 1 */}
        <OrganisationBox
          name="Tech Innovators"
          profilePic="/duck.avif"
          roles={["Proposer", "Voter"]}
          tokens={["3 ETH", "50 USDC"]}
        />

        {/* Organisation 2 */}
        <OrganisationBox
          name="Green Solutions"
          profilePic="/window.svg"
          roles={["Voter"]}
          tokens={["10 ETH", "5 DAI"]}
        />
      </div>
    </div>
  );
}
