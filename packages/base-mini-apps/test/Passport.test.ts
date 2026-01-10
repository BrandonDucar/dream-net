import { expect } from "chai";
import { ethers } from "hardhat";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import { DreamPassportNFT } from '../typechain-types.js';

describe("DreamPassportNFT", function () {
  let passport: DreamPassportNFT;
  let owner: HardhatEthersSigner;
  let user1: HardhatEthersSigner;
  let user2: HardhatEthersSigner;

  beforeEach(async function () {
    [owner, user1, user2] = await ethers.getSigners();

    const DreamPassportNFT = await ethers.getContractFactory("DreamPassportNFT");
    passport = await DreamPassportNFT.deploy();
    await passport.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should deploy successfully", async function () {
      expect(await passport.getAddress()).to.not.equal(ethers.ZeroAddress);
    });

    it("Should have correct name and symbol", async function () {
      expect(await passport.name()).to.equal("Dream State Passport");
      expect(await passport.symbol()).to.equal("DSP");
    });
  });

  describe("Minting", function () {
    it("Should mint passport to user", async function () {
      await passport.mintPassport(
        user1.address,
        1, // Dreamer tier
        ["early"]
      );

      expect(await passport.hasPassport(user1.address)).to.be.true;
      expect(await passport.balanceOf(user1.address)).to.equal(1);
    });

    it("Should prevent duplicate passports", async function () {
      await passport.mintPassport(user1.address, 1, []);
      
      await expect(
        passport.mintPassport(user1.address, 2, [])
      ).to.be.revertedWith("Address already has passport");
    });

    it("Should only allow owner to mint", async function () {
      await expect(
        passport.connect(user1).mintPassport(user2.address, 1, [])
      ).to.be.revertedWithCustomError(passport, "OwnableUnauthorizedAccount");
    });
  });

  describe("Upgrading", function () {
    it("Should upgrade passport tier", async function () {
      await passport.mintPassport(user1.address, 1, []); // Dreamer
      
      await passport.upgradePassport(1, 2); // Citizen
      
      const data = await passport.getPassport(user1.address);
      expect(data.tier).to.equal(2);
    });

    it("Should prevent downgrading", async function () {
      await passport.mintPassport(user1.address, 2, []); // Citizen
      
      await expect(
        passport.upgradePassport(1, 1) // Try to downgrade to Dreamer
      ).to.be.revertedWith("Can only upgrade tier");
    });
  });
});

