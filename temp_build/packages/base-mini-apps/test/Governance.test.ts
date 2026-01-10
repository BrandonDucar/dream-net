import { expect } from "chai";
import { ethers } from "hardhat";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import { DreamPassportNFT, DreamStateGovernance } from "../typechain-types";

describe("DreamStateGovernance", function () {
  let passport: DreamPassportNFT;
  let governance: DreamStateGovernance;
  let owner: HardhatEthersSigner;
  let citizen1: HardhatEthersSigner;
  let citizen2: HardhatEthersSigner;

  beforeEach(async function () {
    [owner, citizen1, citizen2] = await ethers.getSigners();

    // Deploy passport
    const DreamPassportNFT = await ethers.getContractFactory("DreamPassportNFT");
    passport = await DreamPassportNFT.deploy();
    await passport.waitForDeployment();

    // Deploy governance
    const DreamStateGovernance = await ethers.getContractFactory("DreamStateGovernance");
    governance = await DreamStateGovernance.deploy(await passport.getAddress());
    await governance.waitForDeployment();

    // Mint passports
    await passport.mintPassport(citizen1.address, 2, []); // Citizen
    await passport.mintPassport(citizen2.address, 2, []); // Citizen
  });

  describe("Proposals", function () {
    it("Should create proposal", async function () {
      await expect(
        governance.connect(citizen1).createProposal(
          "Test Proposal",
          "This is a test",
          7 * 24 * 60 * 60 // 7 days
        )
      ).to.emit(governance, "ProposalCreated");
    });

    it("Should require passport to create proposal", async function () {
      await expect(
        governance.connect(owner).createProposal(
          "Test",
          "Test",
          7 * 24 * 60 * 60
        )
      ).to.be.revertedWith("Must have passport");
    });
  });

  describe("Voting", function () {
    it("Should allow voting", async function () {
      await governance.connect(citizen1).createProposal(
        "Test",
        "Test",
        7 * 24 * 60 * 60
      );

      await expect(
        governance.connect(citizen1).castVote(1, true)
      ).to.emit(governance, "VoteCast");
    });

    it("Should prevent double voting", async function () {
      await governance.connect(citizen1).createProposal("Test", "Test", 7 * 24 * 60 * 60);
      await governance.connect(citizen1).castVote(1, true);
      
      await expect(
        governance.connect(citizen1).castVote(1, false)
      ).to.be.revertedWith("Already voted");
    });
  });
});

