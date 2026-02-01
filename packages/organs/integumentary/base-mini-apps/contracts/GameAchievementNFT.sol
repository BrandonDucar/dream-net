// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "./GameRegistry.sol";

/**
 * @title GameAchievementNFT
 * @notice Mints NFTs for game achievements
 * Integrates with GameRegistry to track achievements
 */
contract GameAchievementNFT is ERC721, Ownable, ReentrancyGuard {
    GameRegistry public gameRegistry;
    
    uint256 private _tokenIdCounter;
    
    struct AchievementNFT {
        uint256 tokenId;
        address player;
        GameRegistry.GameType gameType;
        uint256 achievementId;
        string achievementName;
        uint256 score;
        uint256 timestamp;
    }
    
    mapping(uint256 => AchievementNFT) public achievementNFTs;
    mapping(address => uint256[]) public playerNFTs;
    mapping(GameRegistry.GameType => mapping(uint256 => bool)) public achievementMinted;
    
    event AchievementNFTMinted(
        address indexed player,
        uint256 indexed tokenId,
        GameRegistry.GameType gameType,
        uint256 achievementId,
        string achievementName
    );

    constructor(
        address initialOwner,
        address gameRegistryAddress
    ) ERC721("DreamNet Game Achievement", "DREAMGAME") Ownable(initialOwner) {
        gameRegistry = GameRegistry(gameRegistryAddress);
    }

    /**
     * @notice Mint NFT for an achievement
     */
    function mintAchievementNFT(
        GameRegistry.GameType gameType,
        uint256 achievementId,
        string memory achievementName,
        uint256 score
    ) external nonReentrant {
        address player = msg.sender;
        
        // Verify achievement is unlocked
        uint256[] memory achievements = gameRegistry.getPlayerAchievements(gameType, player);
        bool hasAchievement = false;
        for (uint256 i = 0; i < achievements.length; i++) {
            if (achievements[i] == achievementId) {
                hasAchievement = true;
                break;
            }
        }
        
        require(hasAchievement, "Achievement not unlocked");
        require(!achievementMinted[gameType][achievementId], "NFT already minted");
        
        // Mint NFT
        uint256 tokenId = _tokenIdCounter++;
        _safeMint(player, tokenId);
        
        achievementNFTs[tokenId] = AchievementNFT({
            tokenId: tokenId,
            player: player,
            gameType: gameType,
            achievementId: achievementId,
            achievementName: achievementName,
            score: score,
            timestamp: block.timestamp
        });
        
        playerNFTs[player].push(tokenId);
        achievementMinted[gameType][achievementId] = true;
        
        emit AchievementNFTMinted(player, tokenId, gameType, achievementId, achievementName);
    }

    /**
     * @notice Get player's achievement NFTs
     */
    function getPlayerNFTs(address player) external view returns (uint256[] memory) {
        return playerNFTs[player];
    }

    /**
     * @notice Get NFT details
     */
    function getNFTDetails(uint256 tokenId) external view returns (AchievementNFT memory) {
        require(_ownerOf(tokenId) != address(0), "NFT does not exist");
        return achievementNFTs[tokenId];
    }

    /**
     * @notice Set game registry (if needed to update)
     */
    function setGameRegistry(address newRegistry) external onlyOwner {
        gameRegistry = GameRegistry(newRegistry);
    }
}

