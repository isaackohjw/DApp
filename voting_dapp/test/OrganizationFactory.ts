import {
  time,
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox-viem/network-helpers";
import { expect } from "chai";
import hre from "hardhat";
import { getAddress, parseUnits } from "viem";

describe("OrganizationFactory", () => {
  async function deployOrganizationFactoryFixture() {
    const [user1, user2] = await hre.viem.getWalletClients();

    const factory = await hre.viem.deployContract("OrganizationFactory");
    const mockToken = await hre.viem.deployContract("DummyToken", [
      "Test MockERC20",
      "TST",
      parseUnits("1000000", 18),
    ]);
    const mockToken2 = await hre.viem.deployContract("DummyToken", [
      "Test MockERC20 2",
      "TST2",
      parseUnits("1000000", 18),
    ]);

    const publicClient = await hre.viem.getPublicClient();

    return {
      factory,
      user1,
      user2,
      mockToken,
      mockToken2,
      publicClient,
    };
  }

  describe("Organization Creation", () => {
    it("Should create a new organization", async function () {
      const { factory, mockToken, user1, publicClient } = await loadFixture(
        deployOrganizationFactoryFixture
      );

      const hash = await factory.write.createOrganization(
        ["TestOrg", mockToken.address],
        { account: user1.account }
      );
      await publicClient.waitForTransactionReceipt({ hash });

      const events = await factory.getEvents.OrganizationCreated();

      expect(events).to.have.lengthOf(1);
      expect(events[0].args.name).to.equal("TestOrg");
      const organizations = await factory.read.getOrganizations();
      expect(organizations).to.have.lengthOf(1);
    });

    it("Should allow creating multiple organizations", async function () {
      const { factory, mockToken, mockToken2, user1, user2 } =
        await loadFixture(deployOrganizationFactoryFixture);
      await factory.write.createOrganization(["TestOrg1", mockToken.address], {
        account: user1.account,
      });
      await factory.write.createOrganization(["TestOrg2", mockToken2.address], {
        account: user2.account,
      });

      const organizations = await factory.read.getOrganizations();
      expect(organizations).to.have.lengthOf(2);
    });

    it("Should emit OrganizationCreated event with correct parameters", async function () {
      const { factory, mockToken, user1, publicClient } = await loadFixture(
        deployOrganizationFactoryFixture
      );
      const hash = await factory.write.createOrganization(
        ["TestOrg", mockToken.address],
        { account: user1.account }
      );
      await publicClient.waitForTransactionReceipt({ hash });

      const events = await factory.getEvents.OrganizationCreated();

      expect(events).to.have.lengthOf(1);
      expect(events[0].args.name).to.equal("TestOrg");

      const organizationAddress = events[0].args.organizationContract;
      const organizations = await factory.read.getOrganizations();
      expect(organizationAddress).to.be.a("string");
      expect(organizationAddress).to.be.equal(organizations[0]);
    });
  });

  describe("View Functions", () => {
    it("Should return all created organizations", async function () {
      const { factory, mockToken, user1, user2 } = await loadFixture(
        deployOrganizationFactoryFixture
      );
      await factory.write.createOrganization(["TestOrg1", mockToken.address], {
        account: user1.account,
      });
      await factory.write.createOrganization(["TestOrg2", mockToken.address], {
        account: user2.account,
      });

      const organizations = await factory.read.getOrganizations();
      expect(organizations).to.have.lengthOf(2);
      organizations.forEach((org) => {
        expect(getAddress(org)).to.be.a("string");
      });
    });
  });
});
