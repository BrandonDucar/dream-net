// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * Badge NFT Contract
 * Achievement badges for DreamNet users
 */
contract BadgeNFT is ERC721, Ownable {
    uint256 private _tokenIdCounter;
    mapping(uint256 => BadgeData) public badgeData;
    mapping(address => uint256[]) public userBadges;
    mapping(string => bool) public badgeTypeExists;

    struct BadgeData {
        string badgeType;
        string name;
        string description;
        address awardedBy;
        uint256 awardedAt;
        uint256 rarity; // 1-5, 5 being rarest
    }

    event BadgeAwarded(
        uint256 indexed tokenId,
        address indexed recipient,
        string badgeType
    );

    constructor() ERC721("DreamNet Badge", "DBADGE") Ownable(msg.sender) {}

    function awardBadge(
        address to,
        string memory badgeType,
        string memory name,
        string memory description,
        uint256 rarity
    ) public onlyOwner returns (uint256) {
        require(rarity >= 1 && rarity <= 5, "Rarity must be 1-5");

        uint256 tokenId = _tokenIdCounter;
        _tokenIdCounter++;

        badgeData[tokenId] = BadgeData({
            badgeType: badgeType,
            name: name,
            description: description,
            awardedBy: msg.sender,
            awardedAt: block.timestamp,
            rarity: rarity
        });

        _safeMint(to, tokenId);
        userBadges[to].push(tokenId);
        badgeTypeExists[badgeType] = true;

        emit BadgeAwarded(tokenId, to, badgeType);
        return tokenId;
    }

    function getBadge(uint256 tokenId) public view returns (BadgeData memory) {
        require(_ownerOf(tokenId) != address(0), "Badge does not exist");
        return badgeData[tokenId];
    }

    function getUserBadges(address user) public view returns (uint256[] memory) {
        return userBadges[user];
    }
}

