// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * Dream Vault NFT Contract
 * ERC721 NFTs representing Dream Vaults
 */
contract DreamVaultNFT is ERC721, Ownable {
    uint256 private _tokenIdCounter;
    mapping(uint256 => VaultData) public vaultData;
    mapping(address => uint256[]) public ownerVaults;

    struct VaultData {
        string name;
        string description;
        address creator;
        uint256 createdAt;
        uint256 revenueShare; // Basis points (10000 = 100%)
        bool isPublic;
    }

    event VaultCreated(
        uint256 indexed tokenId,
        address indexed creator,
        string name
    );

    constructor() ERC721("Dream Vault", "DVAULT") Ownable(msg.sender) {}

    function createVault(
        address to,
        string memory name,
        string memory description,
        uint256 revenueShare,
        bool isPublic
    ) public returns (uint256) {
        uint256 tokenId = _tokenIdCounter;
        _tokenIdCounter++;

        vaultData[tokenId] = VaultData({
            name: name,
            description: description,
            creator: msg.sender,
            createdAt: block.timestamp,
            revenueShare: revenueShare,
            isPublic: isPublic
        });

        _safeMint(to, tokenId);
        ownerVaults[to].push(tokenId);

        emit VaultCreated(tokenId, msg.sender, name);
        return tokenId;
    }

    function getVault(uint256 tokenId) public view returns (VaultData memory) {
        require(_ownerOf(tokenId) != address(0), "Vault does not exist");
        return vaultData[tokenId];
    }

    function getOwnerVaults(address owner) public view returns (uint256[] memory) {
        return ownerVaults[owner];
    }
}

