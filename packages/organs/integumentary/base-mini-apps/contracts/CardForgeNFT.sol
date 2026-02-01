// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title CardForgeNFT
 * @dev NFT contract for Card Forge Pro cards minted on Base
 * Each card is a unique NFT with metadata stored on-chain or IPFS
 */
contract CardForgeNFT is ERC721URIStorage, Ownable {
    uint256 private _tokenIdCounter;

    struct CardMetadata {
        string cardType; // business, trading, digital, nft, custom
        string title;
        string description;
        string imageUrl;
        string cardUrl;
        uint256 createdAt;
    }

    mapping(uint256 => CardMetadata) public cardMetadata;
    mapping(address => uint256[]) public userCards;

    event CardMinted(
        uint256 indexed tokenId,
        address indexed owner,
        string cardType,
        string title
    );

    constructor(address initialOwner) ERC721("Card Forge Pro", "CFP") Ownable(initialOwner) {}

    /**
     * @dev Mint a new card NFT
     * @param to Address to mint the NFT to
     * @param tokenURI URI for the NFT metadata (IPFS or HTTP)
     * @param metadata Card metadata struct
     */
    function mintCard(
        address to,
        string memory tokenURI,
        CardMetadata memory metadata
    ) public onlyOwner returns (uint256) {
        _tokenIdCounter++;
        uint256 newTokenId = _tokenIdCounter;

        _safeMint(to, newTokenId);
        _setTokenURI(newTokenId, tokenURI);
        
        cardMetadata[newTokenId] = metadata;
        userCards[to].push(newTokenId);

        emit CardMinted(newTokenId, to, metadata.cardType, metadata.title);

        return newTokenId;
    }

    /**
     * @dev Get all cards owned by a user
     */
    function getUserCards(address user) public view returns (uint256[] memory) {
        return userCards[user];
    }

    /**
     * @dev Get card metadata
     */
    function getCardMetadata(uint256 tokenId) public view returns (CardMetadata memory) {
        require(_ownerOf(tokenId) != address(0), "Card does not exist");
        return cardMetadata[tokenId];
    }

    /**
     * @dev Get total number of cards minted
     */
    function totalSupply() public view returns (uint256) {
        return _tokenIdCounter;
    }
}

