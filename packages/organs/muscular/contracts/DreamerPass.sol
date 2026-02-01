// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

/**
 * @title DreamerPass
 * @dev ERC1155 NFT for social gating and access control in DreamNet
 * Supports multiple pass tiers/types via token IDs
 */
contract DreamerPass is ERC1155, Ownable {
    using Strings for uint256;
    
    // Token ID mappings
    uint256 public constant TIER_BRONZE = 1;
    uint256 public constant TIER_SILVER = 2;
    uint256 public constant TIER_GOLD = 3;
    uint256 public constant TIER_PLATINUM = 4;
    
    string public name = "Dreamer Pass";
    string public symbol = "DREAMER";
    string private baseURI;
    
    mapping(uint256 => uint256) public maxSupply; // Max supply per token ID
    mapping(uint256 => uint256) public totalSupply; // Current supply per token ID
    mapping(uint256 => bool) public mintingEnabled; // Whether minting is enabled for a token ID
    
    event PassMinted(address indexed to, uint256 indexed tokenId, uint256 amount);
    event BaseURIUpdated(string newBaseURI);
    
    constructor(address initialOwner, string memory uri) 
        ERC1155(uri) 
        Ownable(initialOwner) 
    {
        baseURI = uri;
        
        // Set max supplies (unlimited for now, can be updated)
        maxSupply[TIER_BRONZE] = type(uint256).max;
        maxSupply[TIER_SILVER] = type(uint256).max;
        maxSupply[TIER_GOLD] = type(uint256).max;
        maxSupply[TIER_PLATINUM] = type(uint256).max;
        
        // Enable minting for all tiers
        mintingEnabled[TIER_BRONZE] = true;
        mintingEnabled[TIER_SILVER] = true;
        mintingEnabled[TIER_GOLD] = true;
        mintingEnabled[TIER_PLATINUM] = true;
    }
    
    /**
     * @dev Mint passes to an address
     */
    function mint(address to, uint256 tokenId, uint256 amount) public onlyOwner {
        require(mintingEnabled[tokenId], "DreamerPass: Minting disabled for this tier");
        require(totalSupply[tokenId] + amount <= maxSupply[tokenId], "DreamerPass: Exceeds max supply");
        
        totalSupply[tokenId] += amount;
        _mint(to, tokenId, amount, "");
        
        emit PassMinted(to, tokenId, amount);
    }
    
    /**
     * @dev Batch mint multiple token IDs
     */
    function mintBatch(
        address to,
        uint256[] memory tokenIds,
        uint256[] memory amounts
    ) public onlyOwner {
        require(tokenIds.length == amounts.length, "DreamerPass: Arrays length mismatch");
        
        for (uint256 i = 0; i < tokenIds.length; i++) {
            require(mintingEnabled[tokenIds[i]], "DreamerPass: Minting disabled for this tier");
            require(totalSupply[tokenIds[i]] + amounts[i] <= maxSupply[tokenIds[i]], "DreamerPass: Exceeds max supply");
            totalSupply[tokenIds[i]] += amounts[i];
        }
        
        _mintBatch(to, tokenIds, amounts, "");
    }
    
    /**
     * @dev Set max supply for a token ID
     */
    function setMaxSupply(uint256 tokenId, uint256 newMaxSupply) public onlyOwner {
        require(newMaxSupply >= totalSupply[tokenId], "DreamerPass: Max supply below current supply");
        maxSupply[tokenId] = newMaxSupply;
    }
    
    /**
     * @dev Enable/disable minting for a token ID
     */
    function setMintingEnabled(uint256 tokenId, bool enabled) public onlyOwner {
        mintingEnabled[tokenId] = enabled;
    }
    
    /**
     * @dev Update base URI
     */
    function setURI(string memory newBaseURI) public onlyOwner {
        baseURI = newBaseURI;
        _setURI(newBaseURI);
        emit BaseURIUpdated(newBaseURI);
    }
    
    /**
     * @dev Get URI for a token ID
     */
    function uri(uint256 tokenId) public view override returns (string memory) {
        return string(abi.encodePacked(baseURI, tokenId.toString(), ".json"));
    }
}

