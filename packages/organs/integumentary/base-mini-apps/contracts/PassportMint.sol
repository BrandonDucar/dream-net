// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * Dream State Passport NFT Contract
 * Deployed on Base (Chain ID: 8453)
 */
contract DreamPassportNFT is ERC721, Ownable {
    uint256 private _tokenIdCounter;
    mapping(uint256 => PassportTier) public passportTiers;
    mapping(address => uint256) public addressToPassport;
    mapping(uint256 => PassportData) public passportData;

    enum PassportTier {
        Visitor,
        Dreamer,
        Citizen,
        Operator,
        Architect,
        Founder
    }

    struct PassportData {
        PassportTier tier;
        uint256 issuedAt;
        uint256 expiresAt;
        string[] flags;
        string onchainAddress;
    }

    event PassportMinted(
        address indexed to,
        uint256 indexed tokenId,
        PassportTier tier
    );
    event PassportUpgraded(
        uint256 indexed tokenId,
        PassportTier oldTier,
        PassportTier newTier
    );

    constructor() ERC721("Dream State Passport", "DSP") Ownable(msg.sender) {}

    function mintPassport(
        address to,
        PassportTier tier,
        string[] memory flags
    ) public onlyOwner returns (uint256) {
        require(addressToPassport[to] == 0, "Address already has passport");
        
        _tokenIdCounter++;
        uint256 tokenId = _tokenIdCounter;
        
        _safeMint(to, tokenId);
        addressToPassport[to] = tokenId;
        
        passportData[tokenId] = PassportData({
            tier: tier,
            issuedAt: block.timestamp,
            expiresAt: 0, // No expiration by default
            flags: flags,
            onchainAddress: ""
        });

        emit PassportMinted(to, tokenId, tier);
        return tokenId;
    }

    function upgradePassport(
        uint256 tokenId,
        PassportTier newTier
    ) public onlyOwner {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");
        
        PassportTier oldTier = passportData[tokenId].tier;
        require(uint256(newTier) > uint256(oldTier), "Can only upgrade tier");
        
        passportData[tokenId].tier = newTier;
        
        emit PassportUpgraded(tokenId, oldTier, newTier);
    }

    function getPassport(address user) public view returns (PassportData memory) {
        uint256 tokenId = addressToPassport[user];
        require(tokenId != 0, "No passport found");
        return passportData[tokenId];
    }

    function hasPassport(address user) public view returns (bool) {
        return addressToPassport[user] != 0;
    }

    function getTier(address user) public view returns (PassportTier) {
        uint256 tokenId = addressToPassport[user];
        require(tokenId != 0, "No passport found");
        return passportData[tokenId].tier;
    }
}

