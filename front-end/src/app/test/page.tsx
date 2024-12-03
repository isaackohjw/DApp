"use client";
import { useEffect, useState } from "react";
import { createWalletClient, createPublicClient, http, Address, custom } from "viem";
import { holesky } from "viem/chains";
import { OrganizationFactory } from "../../artifacts/OrganizationFactory.ts";
import { Organization } from "../../artifacts/Organization.ts";


export default function OrganizationManager() {
  const factoryAddress: Address = "0xd738B8127301c5bB8ffBFDF91d5aebE14Ca35910";

  const [organizations, setOrganizations] = useState<string[]>([]);
  const [organizationName, setOrganizationName] = useState("");
  const [organizationToken, setOrganizationToken] = useState("");
  const [organizationDetails, setOrganizationDetails] = useState<
    { name: string; owner: string; token: string }[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);

  const viemClient = createPublicClient({
    chain: holesky,
    transport: http(),
  });

  const walletClient = createWalletClient({
    chain: holesky,
    transport: custom(window.ethereum),
  });

  const fetchOrganizations = async () => {
    try {
      setLoading(true);
      const fetchedOrganizations = await viemClient.readContract({
        address: factoryAddress,
        abi: OrganizationFactory,
        functionName: "getAllOrganizations",
        args: [],
      });
      setOrganizations(fetchedOrganizations as string[]);
    } catch (error) {
      console.error("Error fetching organizations:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrganizationDetails = async () => {
    try {
      const details = await Promise.all(
        organizations.map(async (orgAddress) => {
          const name = await viemClient.readContract({
            address: orgAddress as Address,
            abi: Organization,
            functionName: "name",
          });
          const owner = await viemClient.readContract({
            address: orgAddress as Address,
            abi: Organization,
            functionName: "owner",
          });
          const token = await viemClient.readContract({
            address: orgAddress as Address,
            abi: Organization,
            functionName: "token",
          });

          return { name, owner, token };
        })
      );

      setOrganizationDetails(details);
    } catch (error) {
      console.error("Error fetching organization details:", error);
    }
  };

  useEffect(() => {
    fetchOrganizations();
  }, []);

  useEffect(() => {
    if (organizations.length > 0) {
      fetchOrganizationDetails();
    }
  }, [organizations]);

  const handleCreateOrganization = async () => {
    try {
      if (!organizationName || !organizationToken) {
        alert("Please fill in all fields.");
        return;
      }

      setCreating(true);
      const [account] = await walletClient.getAddresses();
      const txHash = await walletClient.writeContract({
        address: factoryAddress,
        abi: OrganizationFactory,
        functionName: "createOrganization",
        args: [organizationName, account, organizationToken as Address],
        account,
      });
      await viemClient.waitForTransactionReceipt({ hash: txHash });
      console.log("Transaction mined!");
      fetchOrganizations();
    } catch (error) {
      console.error("Error creating organization:", error);
      alert("Error: Unable to create organization.");
    } finally {
      setCreating(false);
    }
  };


  return (
    <div style={{ padding: "20px" }}>
      <h1>Organization Manager</h1>

      {/* Display all organizations */}
      <div>
        <h2>All Organizations</h2>
        {loading ? (
          <p>Loading organizations...</p>
        ) : organizations.length > 0 ? (
          <ul>
            {organizationDetails.map((org, index) => (
              <li key={index} style={{ marginBottom: "10px" }}>
                <strong>Name:</strong> {org.name} <br />
                <strong>Owner:</strong> {org.owner} <br />
                <strong>Token Address:</strong> {org.token} <br />
              </li>
            ))}
          </ul>
        ) : (
          <p>No organizations found.</p>
        )}
        <button
          onClick={fetchOrganizations}
          style={{
            marginTop: "10px",
            padding: "5px 10px",
            backgroundColor: "blue",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Refresh Organizations
        </button>
      </div>

      {/* Create Organization Section */}
      <div style={{ marginTop: "20px" }}>
        <h2>Create New Organization</h2>
        <input
          type="text"
          placeholder="Organization Name"
          value={organizationName}
          onChange={(e) => setOrganizationName(e.target.value)}
          style={{ padding: "5px", marginRight: "10px", width: "200px" }}
        />
        <input
          type="text"
          placeholder="Token Address"
          value={organizationToken}
          onChange={(e) => setOrganizationToken(e.target.value)}
          style={{ padding: "5px", marginRight: "10px", width: "300px" }}
        />
        <button
          onClick={handleCreateOrganization}
          style={{
            padding: "5px 10px",
            cursor: "pointer",
            backgroundColor: creating ? "gray" : "green",
            color: "white",
            border: "none",
            borderRadius: "5px",
          }}
          disabled={creating} // Disable button while creating
        >
          {creating ? "Creating..." : "Create Organization"}
        </button>
      </div>
    </div>
  );
}