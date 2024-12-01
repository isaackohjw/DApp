"use client";

import React, { useState, useEffect } from "react";
import { Titlebar } from "@/components/titlebar";
import { OrganisationBox } from "@/components/organisation_box";

// Simulated API Data (default values)
const defaultData = {
  orgName: "Tech Innovators",
  description:
    "An innovative tech organization focused on pushing boundaries in technology and digital solutions.",
  role: "Owner" as "Owner",
  token: "3 ETH",
  imageUrl: "/duck.avif",
};

export default function OrganisationPage() {
  const [orgData, setOrgData] = useState(defaultData);

  // Simulating an API call to fetch organization data
  useEffect(() => {
    const fetchOrgData = async () => {
      setOrgData(defaultData); // Placeholder for now
    };

    fetchOrgData();
  }, []);

  return (
    <div className="min-h-screen">
      {/* Titlebar */}
      <Titlebar name="John Doe" initial="J" />

      <div className="flex flex-wrap gap-4 p-6">
        {/* Organisation 1 - Dynamic data */}
        <OrganisationBox
          name={orgData.orgName}
          profilePic={orgData.imageUrl}
          role={orgData.role}
          token={orgData.token}
          description={orgData.description}
        />

        {/* Organisation 2 - Static data */}
        <OrganisationBox
          name="Green Solutions"
          profilePic="/image1.jpg"
          role="Admin"
          token="10 ETH"
          description="A green tech company focused on sustainable solutions."
        />

        {/* Organisation 3 - Static data */}
        <OrganisationBox
          name="Future Horizons"
          profilePic="/koala.jpg"
          role="Voter"
          token="5 ETH"
          description="A nonprofit focused on empowering communities through technology."
        />
      </div>
    </div>
  );
}
