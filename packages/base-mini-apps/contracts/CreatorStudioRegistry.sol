// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title CreatorStudioRegistry
 * @notice Registry for Creator Studio content creation and NFTs
 * Tracks content, NFTs, royalties, and creator activity
 */
contract CreatorStudioRegistry is Ownable {
    mapping(uint256 => Content) public content;
    mapping(address => uint256[]) public creatorContent;
    mapping(uint256 => Royalty) public royalties;
    uint256 private _contentCounter;

    struct Content {
        uint256 id;
        address creator;
        string title;
        string description;
        string contentType; // e.g., "image", "video", "audio", "text"
        string metadataURI; // IPFS or other URI
        uint256 royaltyPercent; // Basis points (e.g., 500 = 5%)
        bool isActive;
        uint256 createdAt;
    }

    struct Royalty {
        uint256 contentId;
        address creator;
        uint256 percent;
        uint256 totalEarned;
    }

    event ContentCreated(
        uint256 indexed id,
        address indexed creator,
        string title,
        string contentType
    );
    event RoyaltyPaid(
        uint256 indexed contentId,
        address indexed creator,
        uint256 amount
    );
    event ContentUpdated(uint256 indexed contentId, address indexed creator);

    constructor() Ownable(msg.sender) {}

    /**
     * @notice Create new content
     */
    function createContent(
        string memory title,
        string memory description,
        string memory contentType,
        string memory metadataURI,
        uint256 royaltyPercent
    ) public returns (uint256) {
        require(royaltyPercent <= 1000, "Royalty cannot exceed 10%"); // Max 10%

        uint256 id = _contentCounter;
        _contentCounter++;

        content[id] = Content({
            id: id,
            creator: msg.sender,
            title: title,
            description: description,
            contentType: contentType,
            metadataURI: metadataURI,
            royaltyPercent: royaltyPercent,
            isActive: true,
            createdAt: block.timestamp
        });

        creatorContent[msg.sender].push(id);
        
        royalties[id] = Royalty({
            contentId: id,
            creator: msg.sender,
            percent: royaltyPercent,
            totalEarned: 0
        });

        emit ContentCreated(id, msg.sender, title, contentType);
        return id;
    }

    /**
     * @notice Record royalty payment
     */
    function recordRoyalty(uint256 contentId) public payable {
        Content storage cont = content[contentId];
        require(cont.createdAt > 0, "Content not found");
        require(cont.isActive, "Content not active");

        Royalty storage royalty = royalties[contentId];
        uint256 royaltyAmount = (msg.value * royalty.percent) / 10000;
        
        if (royaltyAmount > 0) {
            royalty.totalEarned += royaltyAmount;
            payable(royalty.creator).transfer(royaltyAmount);
            emit RoyaltyPaid(contentId, royalty.creator, royaltyAmount);
        }
    }

    /**
     * @notice Get content by ID
     */
    function getContent(uint256 contentId) public view returns (Content memory) {
        return content[contentId];
    }

    /**
     * @notice Get all content by a creator
     */
    function getCreatorContent(address creator) public view returns (uint256[] memory) {
        return creatorContent[creator];
    }

    /**
     * @notice Get royalty info for content
     */
    function getRoyalty(uint256 contentId) public view returns (Royalty memory) {
        return royalties[contentId];
    }
}

