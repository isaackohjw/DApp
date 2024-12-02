import {
  time,
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox-viem/network-helpers";
import { expect } from "chai";
import hre from "hardhat";
import { formatUnits, getAddress, parseUnits } from "viem";

describe("Organization", () => {
  enum VoteOption {
    ABSTAIN,
    YES,
    NO,
  }

  async function deployOrganizationFixture() {
    const [owner, admin1, admin2, voter1, voter2, voter3] =
      await hre.viem.getWalletClients();
    const mockToken = await hre.viem.deployContract("DummyToken", [
      "Test MockERC20",
      "TST",
      parseUnits("1000000", 18),
    ]);
    const organization = await hre.viem.deployContract("Organization", [
      "TestOrg",
      owner.account.address,
      mockToken.address,
    ]);

    await mockToken.write.mint([owner.account.address, parseUnits("100", 18)]);
    await mockToken.write.mint([admin1.account.address, parseUnits("100", 18)]);
    await mockToken.write.mint([admin2.account.address, parseUnits("100", 18)]);
    await mockToken.write.mint([voter1.account.address, parseUnits("100", 18)]);
    await mockToken.write.mint([voter2.account.address, parseUnits("100", 18)]);

    const publicClient = await hre.viem.getPublicClient();

    return {
      organization,
      owner,
      admin1,
      admin2,
      voter1,
      voter2,
      voter3,
      mockToken,
      publicClient,
    };
  }

  async function deployOrganizationFixtureWithUnweightedVoteSession() {
    const [owner, admin1, admin2, voter1, voter2, voter3] =
      await hre.viem.getWalletClients();
    const mockToken = await hre.viem.deployContract("DummyToken", [
      "Test MockERC20",
      "TST",
      parseUnits("1000000", 18),
    ]);
    const organization = await hre.viem.deployContract("Organization", [
      "TestOrg",
      owner.account.address,
      mockToken.address,
    ]);

    await mockToken.write.mint([owner.account.address, parseUnits("100", 18)]);
    await mockToken.write.mint([admin1.account.address, parseUnits("100", 18)]);
    await mockToken.write.mint([admin2.account.address, parseUnits("100", 18)]);
    await mockToken.write.mint([voter1.account.address, parseUnits("100", 18)]);
    await mockToken.write.mint([voter2.account.address, parseUnits("100", 18)]);

    const publicClient = await hre.viem.getPublicClient();
    const deadline = (await time.latest()) + 3600; // 1 hour from now
    const hash = await organization.write.createVotingSession([
      "TestSession",
      BigInt(deadline),
      true,
    ]);
    await publicClient.waitForTransactionReceipt({ hash });

    return {
      organization,
      owner,
      admin1,
      admin2,
      voter1,
      voter2,
      voter3,
      mockToken,
      publicClient,
    };
  }

  async function deployOrganizationFixtureWithWeightedVoteSession() {
    const [owner, admin1, admin2, voter1, voter2, voter3] =
      await hre.viem.getWalletClients();
    const mockToken = await hre.viem.deployContract("DummyToken", [
      "Test MockERC20",
      "TST",
      parseUnits("1000000", 18),
    ]);
    const organization = await hre.viem.deployContract("Organization", [
      "TestOrg",
      owner.account.address,
      mockToken.address,
    ]);

    await mockToken.write.mint([owner.account.address, parseUnits("100", 18)]);
    await mockToken.write.mint([admin1.account.address, parseUnits("100", 18)]);
    await mockToken.write.mint([admin2.account.address, parseUnits("100", 18)]);
    await mockToken.write.mint([voter1.account.address, parseUnits("100", 18)]);
    await mockToken.write.mint([voter2.account.address, parseUnits("100", 18)]);

    const publicClient = await hre.viem.getPublicClient();
    const deadline = (await time.latest()) + 3600; // 1 hour from now
    const hash = await organization.write.createVotingSession([
      "TestSession",
      BigInt(deadline),
      false,
    ]);
    await publicClient.waitForTransactionReceipt({ hash });

    return {
      organization,
      owner,
      admin1,
      admin2,
      voter1,
      voter2,
      voter3,
      mockToken,
      publicClient,
    };
  }

  describe("Deployment", () => {
    it("should set contract name, owner, and token correctly", async () => {
      const { organization, owner, mockToken } = await loadFixture(
        deployOrganizationFixture
      );
      expect(await organization.read.name()).to.equal("TestOrg");
      expect(await organization.read.owner()).to.equal(
        getAddress(owner.account.address)
      );
      expect(await organization.read.token()).to.equal(
        getAddress(mockToken.address)
      );
    });

    it("should set owner as an admin by default", async () => {
      const { organization, owner } = await loadFixture(
        deployOrganizationFixture
      );
      expect(await organization.read.admins([owner.account.address])).to.be
        .true;
    });
  });

  describe("Admin Management", () => {
    it("should allow owner to add new admins", async () => {
      const { organization, admin1 } = await loadFixture(
        deployOrganizationFixture
      );
      await organization.write.addAdmin([admin1.account.address]);
      expect(await organization.read.admins([admin1.account.address])).to.be
        .true;
    });

    it("should emit AdminAdded event when adding an admin", async () => {
      const { organization, admin1 } = await loadFixture(
        deployOrganizationFixture
      );
      await organization.write.addAdmin([admin1.account.address]);
      const events = await organization.getEvents.AdminAdded();
      expect(events).to.have.lengthOf(1);
      expect(events[0].args.admin).to.equal(getAddress(admin1.account.address));
    });

    it("should revert if non-admin tries to add an admin", async () => {
      const { organization, admin1 } = await loadFixture(
        deployOrganizationFixture
      );
      const organizationAsOtherAccount = await hre.viem.getContractAt(
        "Organization",
        organization.address,
        { client: { wallet: admin1 } }
      );
      await expect(
        organizationAsOtherAccount.write.addAdmin([admin1.account.address])
      ).to.be.rejectedWith("Not an admin");
    });

    it("should prevent removing the owner", async () => {
      const { organization, owner } = await loadFixture(
        deployOrganizationFixture
      );

      await expect(
        organization.write.removeAdmin([owner.account.address])
      ).to.be.rejectedWith("Cannot remove owner");
    });

    it("should allow admin removal by another admin", async () => {
      const { organization, admin1 } = await loadFixture(
        deployOrganizationFixture
      );
      await organization.write.addAdmin([admin1.account.address]);
      await organization.write.removeAdmin([admin1.account.address]);

      const isStillAdmin = await organization.read.admins([
        admin1.account.address,
      ]);
      expect(isStillAdmin).to.be.false;
    });

    it("should revert if non-admin tries to remove an admin", async () => {
      const { organization, admin1, voter1 } = await loadFixture(
        deployOrganizationFixture
      );
      await organization.write.addAdmin([admin1.account.address]);

      const organizationAsOtherAccount = await hre.viem.getContractAt(
        "Organization",
        organization.address,
        { client: { wallet: voter1 } }
      );

      await expect(
        organizationAsOtherAccount.write.removeAdmin([admin1.account.address])
      ).to.be.rejectedWith("Not an admin");
    });
  });

  describe("Voting Session Creation", () => {
    it("should create a voting session with correct parameters", async () => {
      const { organization, publicClient } = await loadFixture(
        deployOrganizationFixture
      );
      const deadline = Math.floor(Date.now() / 1000) + 3600;
      const hash = await organization.write.createVotingSession([
        "TestSession",
        BigInt(deadline),
        true,
      ]);
      await publicClient.waitForTransactionReceipt({ hash });
      const session = await organization.read.votingSessions([0n]);
      expect(session[0]).to.equal("TestSession");
      expect(Number(formatUnits(session[1], 0))).to.equal(deadline);
      expect(session[2]).to.be.true;
    });

    it("should create a voting session as non-owner admin", async () => {
      const { organization, admin1, publicClient } = await loadFixture(
        deployOrganizationFixture
      );
      await organization.write.addAdmin([admin1.account.address]);

      const organizationAsOtherAccount = await hre.viem.getContractAt(
        "Organization",
        organization.address,
        { client: { wallet: admin1 } }
      );
      const deadline = Math.floor(Date.now() / 1000) + 3600;
      const hash = await organizationAsOtherAccount.write.createVotingSession([
        "TestSession",
        BigInt(deadline),
        true,
      ]);
      await publicClient.waitForTransactionReceipt({ hash });
      const session = await organization.read.votingSessions([0n]);
      expect(session[0]).to.equal("TestSession");
      expect(Number(formatUnits(session[1], 0))).to.equal(deadline);
      expect(session[2]).to.be.true;
    });

    it("should emit VotingSessionCreated event", async () => {
      const { organization, publicClient } = await loadFixture(
        deployOrganizationFixture
      );
      const deadline = Math.floor(Date.now() / 1000) + 3600;
      const hash = await organization.write.createVotingSession([
        "TestSession",
        BigInt(deadline),
        true,
      ]);
      await publicClient.waitForTransactionReceipt({ hash });

      const events = await organization.getEvents.VotingSessionCreated();

      expect(events).to.have.lengthOf(1);
      expect(Number(formatUnits(events[0].args.sessionId!, 1))).to.equal(0);
      expect(events[0].args.description).to.equal("TestSession");
    });

    it("should revert if voting session deadline is in the past", async () => {
      const { organization } = await loadFixture(deployOrganizationFixture);
      const pastDeadline = Math.floor(Date.now() / 1000) - 3600;
      await expect(
        organization.write.createVotingSession([
          "PastDeadlineSession",
          BigInt(pastDeadline),
          true,
        ])
      ).to.be.rejectedWith("Invalid deadline");
    });

    it("should revert voting session creation by non-admin", async () => {
      const { organization, admin1 } = await loadFixture(
        deployOrganizationFixture
      );

      const organizationAsOtherAccount = await hre.viem.getContractAt(
        "Organization",
        organization.address,
        { client: { wallet: admin1 } }
      );
      const deadline = Math.floor(Date.now() / 1000) + 3600;
      await expect(
        organizationAsOtherAccount.write.createVotingSession([
          "TestSession",
          BigInt(deadline),
          true,
        ])
      ).to.be.rejectedWith("Not an admin");
    });
  });

  describe("Voting with Unweighted Voting", () => {
    it("should revert for invalid session ID", async () => {
      const { organization, voter1 } = await loadFixture(
        deployOrganizationFixtureWithUnweightedVoteSession
      );

      const organizationAsVoter = await hre.viem.getContractAt(
        "Organization",
        organization.address,
        { client: { wallet: voter1 } }
      );

      await expect(
        organizationAsVoter.write.vote([999n, VoteOption.YES])
      ).to.be.rejectedWith("Invalid session ID");
    });

    it("should prevent voting after deadline", async () => {
      const { organization, voter1 } = await loadFixture(
        deployOrganizationFixtureWithUnweightedVoteSession
      );
      await time.increaseTo(BigInt((await time.latest()) + 3600));

      const organizationAsVoter = await hre.viem.getContractAt(
        "Organization",
        organization.address,
        { client: { wallet: voter1 } }
      );
      await expect(
        organizationAsVoter.write.vote([0n, VoteOption.YES])
      ).to.be.rejectedWith("Voting closed");
    });

    it("should prevent double voting", async () => {
      const { organization, voter1 } = await loadFixture(
        deployOrganizationFixtureWithUnweightedVoteSession
      );

      const organizationAsVoter = await hre.viem.getContractAt(
        "Organization",
        organization.address,
        { client: { wallet: voter1 } }
      );
      await organizationAsVoter.write.vote([0n, VoteOption.YES]);

      await expect(
        organizationAsVoter.write.vote([0n, VoteOption.YES])
      ).to.be.rejectedWith("Already voted");
    });

    it("should prevent voting with zero token balance", async () => {
      const { organization, voter3 } = await loadFixture(
        deployOrganizationFixtureWithUnweightedVoteSession
      );
      const organizationAsVoter = await hre.viem.getContractAt(
        "Organization",
        organization.address,
        { client: { wallet: voter3 } }
      );

      await expect(
        organizationAsVoter.write.vote([0n, VoteOption.YES])
      ).to.be.rejectedWith("Insufficient token balance");
    });

    it("should allow voting with token balance", async () => {
      const { organization, voter1 } = await loadFixture(
        deployOrganizationFixtureWithUnweightedVoteSession
      );
      const hash = await organization.write.createVotingSession([
        "TestSession",
        BigInt(Math.floor(Date.now() / 1000) + 3600),
        true,
      ]);

      const organizationAsVoter = await hre.viem.getContractAt(
        "Organization",
        organization.address,
        { client: { wallet: voter1 } }
      );
      await organizationAsVoter.write.vote([0n, VoteOption.YES]);
      const totalYesVotes = await organization.read.getTotalVotesByOption([
        0n,
        VoteOption.YES,
      ]);
      expect(totalYesVotes).to.equal(1n);
      const hasVoted = await organization.read.getUserHasVoted([
        0n,
        getAddress(voter1.account.address),
      ]);
      expect(hasVoted).to.be.true;
      const userVoteOption = await organization.read.getUserVoteOption([
        0n,
        getAddress(voter1.account.address),
      ]);
      expect(userVoteOption).to.be.equal(VoteOption.YES);
      const userVote = await organization.read.getUserVotes([
        0n,
        getAddress(voter1.account.address),
      ]);
      expect(userVote).to.be.equal(1n);
    });

    it("should track votes correctly for different vote options", async () => {
      const { organization, voter1, voter2 } = await loadFixture(
        deployOrganizationFixtureWithUnweightedVoteSession
      );

      const organizationAsVoter1 = await hre.viem.getContractAt(
        "Organization",
        organization.address,
        { client: { wallet: voter1 } }
      );
      await organizationAsVoter1.write.vote([0n, VoteOption.YES]);

      const organizationAsVoter2 = await hre.viem.getContractAt(
        "Organization",
        organization.address,
        { client: { wallet: voter2 } }
      );
      await organizationAsVoter2.write.vote([0n, VoteOption.NO]);

      const yesVotes = await organization.read.getTotalVotesByOption([
        0n,
        VoteOption.YES,
      ]);
      const noVotes = await organization.read.getTotalVotesByOption([
        0n,
        VoteOption.NO,
      ]);

      expect(yesVotes).to.equal(1n);
      expect(noVotes).to.equal(1n);
    });
  });

  describe("Voting with Weighted Voting", () => {
    it("should revert for invalid session ID", async () => {
      const { organization, voter1 } = await loadFixture(
        deployOrganizationFixtureWithUnweightedVoteSession
      );

      const organizationAsVoter = await hre.viem.getContractAt(
        "Organization",
        organization.address,
        { client: { wallet: voter1 } }
      );

      await expect(
        organizationAsVoter.write.vote([999n, VoteOption.YES])
      ).to.be.rejectedWith("Invalid session ID");
    });

    it("should prevent voting after deadline", async () => {
      const { organization, voter1 } = await loadFixture(
        deployOrganizationFixtureWithWeightedVoteSession
      );
      await time.increaseTo(BigInt((await time.latest()) + 3600));

      const organizationAsVoter = await hre.viem.getContractAt(
        "Organization",
        organization.address,
        { client: { wallet: voter1 } }
      );
      await expect(
        organizationAsVoter.write.vote([0n, VoteOption.YES])
      ).to.be.rejectedWith("Voting closed");
    });

    it("should prevent double voting", async () => {
      const { organization, voter1 } = await loadFixture(
        deployOrganizationFixtureWithWeightedVoteSession
      );

      const organizationAsVoter = await hre.viem.getContractAt(
        "Organization",
        organization.address,
        { client: { wallet: voter1 } }
      );
      await organizationAsVoter.write.vote([0n, VoteOption.YES]);

      await expect(
        organizationAsVoter.write.vote([0n, VoteOption.YES])
      ).to.be.rejectedWith("Already voted");
    });

    it("should prevent voting with zero token balance", async () => {
      const { organization, voter3 } = await loadFixture(
        deployOrganizationFixtureWithWeightedVoteSession
      );
      const organizationAsVoter = await hre.viem.getContractAt(
        "Organization",
        organization.address,
        { client: { wallet: voter3 } }
      );

      await expect(
        organizationAsVoter.write.vote([0n, VoteOption.YES])
      ).to.be.rejectedWith("Insufficient token balance");
    });

    it("should allow voting with token balance proportional to vote weight", async () => {
      const { organization, voter1, mockToken } = await loadFixture(
        deployOrganizationFixtureWithWeightedVoteSession
      );
      const voterBalance = await mockToken.read.balanceOf([
        voter1.account.address,
      ]);

      const organizationAsVoter = await hre.viem.getContractAt(
        "Organization",
        organization.address,
        { client: { wallet: voter1 } }
      );
      await organizationAsVoter.write.vote([0n, VoteOption.YES]);
      const totalYesVotes = await organization.read.getTotalVotesByOption([
        0n,
        VoteOption.YES,
      ]);
      expect(totalYesVotes).to.equal(voterBalance);
      const hasVoted = await organization.read.getUserHasVoted([
        0n,
        getAddress(voter1.account.address),
      ]);
      expect(hasVoted).to.be.true;
      const userVoteOption = await organization.read.getUserVoteOption([
        0n,
        getAddress(voter1.account.address),
      ]);
      expect(userVoteOption).to.be.equal(VoteOption.YES);
      const userVote = await organization.read.getUserVotes([
        0n,
        getAddress(voter1.account.address),
      ]);
      expect(userVote).to.be.equal(voterBalance);
    });

    it("should track total votes based on token balance", async () => {
      const { organization, voter1, voter2, mockToken } = await loadFixture(
        deployOrganizationFixtureWithWeightedVoteSession
      );

      const voter1Balance = await mockToken.read.balanceOf([
        voter1.account.address,
      ]);
      const voter2Balance = await mockToken.read.balanceOf([
        voter2.account.address,
      ]);

      const organizationAsVoter1 = await hre.viem.getContractAt(
        "Organization",
        organization.address,
        { client: { wallet: voter1 } }
      );

      const organizationAsVoter2 = await hre.viem.getContractAt(
        "Organization",
        organization.address,
        { client: { wallet: voter2 } }
      );

      await organizationAsVoter1.write.vote([0n, VoteOption.YES]);
      await organizationAsVoter2.write.vote([0n, VoteOption.NO]);

      const totalYesVotes = await organization.read.getTotalVotesByOption([
        0n,
        VoteOption.YES,
      ]);
      const totalNoVotes = await organization.read.getTotalVotesByOption([
        0n,
        VoteOption.NO,
      ]);

      expect(totalYesVotes).to.equal(voter1Balance);
      expect(totalNoVotes).to.equal(voter2Balance);

      const voter1Votes = await organization.read.getUserVotes([
        0n,
        getAddress(voter1.account.address),
      ]);
      const voter1HasVoted = await organization.read.getUserHasVoted([
        0n,
        getAddress(voter1.account.address),
      ]);
      const voter1VoteOption = await organization.read.getUserVoteOption([
        0n,
        getAddress(voter1.account.address),
      ]);

      expect(voter1Votes).to.equal(voter1Balance);
      expect(voter1HasVoted).to.be.true;
      expect(voter1VoteOption).to.equal(VoteOption.YES);

      const voter2Votes = await organization.read.getUserVotes([
        0n,
        getAddress(voter2.account.address),
      ]);
      const voter2HasVoted = await organization.read.getUserHasVoted([
        0n,
        getAddress(voter2.account.address),
      ]);
      const voter2VoteOption = await organization.read.getUserVoteOption([
        0n,
        getAddress(voter2.account.address),
      ]);

      expect(voter2Votes).to.equal(voter2Balance);
      expect(voter2HasVoted).to.be.true;
      expect(voter2VoteOption).to.equal(VoteOption.NO);
    });
  });

  describe("View Function Failure Cases", () => {
    describe("getTotalVotesByOption", () => {
      it("should revert for invalid session ID", async () => {
        const { organization } = await loadFixture(deployOrganizationFixture);
        await expect(
          organization.read.getTotalVotesByOption([999n, VoteOption.YES])
        ).to.be.rejectedWith("Invalid session ID");
      });
    });

    describe("getUserHasVoted", () => {
      it("should revert for invalid session ID", async () => {
        const { organization, voter1 } = await loadFixture(
          deployOrganizationFixture
        );
        await expect(
          organization.read.getUserHasVoted([
            999n,
            getAddress(voter1.account.address),
          ])
        ).to.be.rejectedWith("Invalid session ID");
      });
    });

    describe("getUserVoteOption", () => {
      it("should revert for invalid session ID", async () => {
        const { organization, voter1 } = await loadFixture(
          deployOrganizationFixture
        );
        await expect(
          organization.read.getUserVoteOption([
            999n,
            getAddress(voter1.account.address),
          ])
        ).to.be.rejectedWith("Invalid session ID");
      });

      it("should revert if user has not voted", async () => {
        const { organization, voter1 } = await loadFixture(
          deployOrganizationFixtureWithUnweightedVoteSession
        );
        await expect(
          organization.read.getUserVoteOption([
            0n,
            getAddress(voter1.account.address),
          ])
        ).to.be.rejectedWith("User has not voted in this session");
      });
    });

    describe("getUserVotes", () => {
      it("should revert for invalid session ID", async () => {
        const { organization, voter1 } = await loadFixture(
          deployOrganizationFixture
        );
        await expect(
          organization.read.getUserVotes([
            999n,
            getAddress(voter1.account.address),
          ])
        ).to.be.rejectedWith("Invalid session ID");
      });

      it("should return zero votes for user who has not voted", async () => {
        const { organization, voter1 } = await loadFixture(
          deployOrganizationFixtureWithUnweightedVoteSession
        );
        const userVotes = await organization.read.getUserVotes([
          0n,
          getAddress(voter1.account.address),
        ]);
        expect(userVotes).to.equal(0n);
      });
    });
  });
});
