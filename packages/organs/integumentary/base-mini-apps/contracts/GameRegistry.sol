// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title GameRegistry
 * @notice Unified registry for all DreamNet games
 * Tracks scores, leaderboards, achievements, and rewards
 */
contract GameRegistry is Ownable, ReentrancyGuard {
    enum GameType {
        JaggyStealthRun,
        DreamDNASequencerGame,
        DreamLatticeGame,
        WormholeEscape,
        DreamBetArcade,
        OctopusPatternMaster,
        LabubuPopSmash,
        ReactionTestMini,
        DreamSnailDrift,
        DreamCloudBuilder
    }

    struct GameScore {
        address player;
        GameType gameType;
        uint256 score;
        uint256 timestamp;
        string metadata; // JSON string with game-specific data
    }

    struct LeaderboardEntry {
        address player;
        uint256 score;
        uint256 timestamp;
        uint256 rank;
    }

    struct Achievement {
        uint256 id;
        GameType gameType;
        string name;
        string description;
        uint256 scoreThreshold;
        bool active;
    }

    // Game scores: gameType => player => scores[]
    mapping(GameType => mapping(address => GameScore[])) public playerScores;
    
    // Leaderboards: gameType => top scores (sorted)
    mapping(GameType => LeaderboardEntry[]) public leaderboards;
    
    // Achievements: gameType => achievementId => Achievement
    mapping(GameType => mapping(uint256 => Achievement)) public achievements;
    
    // Player achievements: player => gameType => achievementIds[]
    mapping(address => mapping(GameType => uint256[])) public playerAchievements;
    
    // Best scores: gameType => player => best score
    mapping(GameType => mapping(address => uint256)) public bestScores;
    
    // Game stats
    mapping(GameType => uint256) public totalPlayers;
    mapping(GameType => uint256) public totalGamesPlayed;

    event ScoreSubmitted(
        address indexed player,
        GameType indexed gameType,
        uint256 score,
        uint256 timestamp
    );

    event AchievementUnlocked(
        address indexed player,
        GameType indexed gameType,
        uint256 achievementId,
        string achievementName
    );

    event LeaderboardUpdated(
        GameType indexed gameType,
        address indexed player,
        uint256 rank,
        uint256 score
    );

    constructor(address initialOwner) Ownable(initialOwner) {}

    /**
     * @notice Submit a game score
     */
    function submitScore(
        GameType gameType,
        uint256 score,
        string memory metadata
    ) external nonReentrant {
        require(score > 0, "Score must be > 0");
        
        address player = msg.sender;
        
        // Record score
        GameScore memory newScore = GameScore({
            player: player,
            gameType: gameType,
            score: score,
            timestamp: block.timestamp,
            metadata: metadata
        });
        
        playerScores[gameType][player].push(newScore);
        
        // Update best score
        if (score > bestScores[gameType][player]) {
            bestScores[gameType][player] = score;
        }
        
        // Update leaderboard
        _updateLeaderboard(gameType, player, score);
        
        // Check for achievements
        _checkAchievements(gameType, player, score);
        
        // Update stats
        if (playerScores[gameType][player].length == 1) {
            totalPlayers[gameType]++;
        }
        totalGamesPlayed[gameType]++;
        
        emit ScoreSubmitted(player, gameType, score, block.timestamp);
    }

    /**
     * @notice Create an achievement for a game
     */
    function createAchievement(
        GameType gameType,
        uint256 achievementId,
        string memory name,
        string memory description,
        uint256 scoreThreshold
    ) external onlyOwner {
        achievements[gameType][achievementId] = Achievement({
            id: achievementId,
            gameType: gameType,
            name: name,
            description: description,
            scoreThreshold: scoreThreshold,
            active: true
        });
    }

    /**
     * @notice Get player's best score for a game
     */
    function getBestScore(
        GameType gameType,
        address player
    ) external view returns (uint256) {
        return bestScores[gameType][player];
    }

    /**
     * @notice Get top N players for a game
     */
    function getTopPlayers(
        GameType gameType,
        uint256 count
    ) external view returns (LeaderboardEntry[] memory) {
        uint256 length = leaderboards[gameType].length;
        uint256 returnCount = count > length ? length : count;
        
        LeaderboardEntry[] memory top = new LeaderboardEntry[](returnCount);
        for (uint256 i = 0; i < returnCount; i++) {
            top[i] = leaderboards[gameType][i];
        }
        return top;
    }

    /**
     * @notice Get player's rank for a game
     */
    function getPlayerRank(
        GameType gameType,
        address player
    ) external view returns (uint256) {
        LeaderboardEntry[] memory board = leaderboards[gameType];
        for (uint256 i = 0; i < board.length; i++) {
            if (board[i].player == player) {
                return i + 1; // Rank is 1-indexed
            }
        }
        return 0; // Not ranked
    }

    /**
     * @notice Get player's achievements for a game
     */
    function getPlayerAchievements(
        GameType gameType,
        address player
    ) external view returns (uint256[] memory) {
        return playerAchievements[player][gameType];
    }

    /**
     * @notice Get game statistics
     */
    function getGameStats(
        GameType gameType
    ) external view returns (uint256 players, uint256 gamesPlayed) {
        return (totalPlayers[gameType], totalGamesPlayed[gameType]);
    }

    /**
     * @notice Update leaderboard (internal)
     */
    function _updateLeaderboard(
        GameType gameType,
        address player,
        uint256 score
    ) internal {
        LeaderboardEntry[] storage board = leaderboards[gameType];
        
        // Find insertion point (keep top 100)
        uint256 insertIndex = board.length;
        for (uint256 i = 0; i < board.length; i++) {
            if (score > board[i].score) {
                insertIndex = i;
                break;
            }
        }
        
        // Insert new entry
        if (insertIndex < 100) {
            // Shift entries down
            if (board.length >= 100) {
                board.pop(); // Remove last if at capacity
            }
            
            // Insert at position
            LeaderboardEntry memory newEntry = LeaderboardEntry({
                player: player,
                score: score,
                timestamp: block.timestamp,
                rank: insertIndex + 1
            });
            
            // Shift array
            for (uint256 i = board.length; i > insertIndex; i--) {
                board.push(board[i - 1]);
            }
            
            board[insertIndex] = newEntry;
            
            // Update ranks
            for (uint256 i = insertIndex; i < board.length; i++) {
                board[i].rank = i + 1;
            }
            
            emit LeaderboardUpdated(gameType, player, insertIndex + 1, score);
        }
    }

    /**
     * @notice Check and unlock achievements (internal)
     */
    function _checkAchievements(
        GameType gameType,
        address player,
        uint256 score
    ) internal {
        // Check all achievements for this game
        // Note: In production, you'd iterate through active achievements
        // For now, we'll use a simple threshold-based system
        
        uint256 bestScore = bestScores[gameType][player];
        uint256[] storage unlocked = playerAchievements[player][gameType];
        
        // Example achievement thresholds (can be configured)
        uint256[] memory thresholds = new uint256[](5);
        thresholds[0] = 100;
        thresholds[1] = 500;
        thresholds[2] = 1000;
        thresholds[3] = 5000;
        thresholds[4] = 10000;
        
        for (uint256 i = 0; i < thresholds.length; i++) {
            if (bestScore >= thresholds[i]) {
                // Check if already unlocked
                bool alreadyUnlocked = false;
                for (uint256 j = 0; j < unlocked.length; j++) {
                    if (unlocked[j] == i) {
                        alreadyUnlocked = true;
                        break;
                    }
                }
                
                if (!alreadyUnlocked) {
                    unlocked.push(i);
                    emit AchievementUnlocked(
                        player,
                        gameType,
                        i,
                        string(abi.encodePacked("Score ", _uint2str(thresholds[i])))
                    );
                }
            }
        }
    }

    /**
     * @notice Helper to convert uint to string
     */
    function _uint2str(uint256 _i) internal pure returns (string memory) {
        if (_i == 0) {
            return "0";
        }
        uint256 j = _i;
        uint256 len;
        while (j != 0) {
            len++;
            j /= 10;
        }
        bytes memory bstr = new bytes(len);
        uint256 k = len;
        while (_i != 0) {
            k = k - 1;
            uint8 temp = (48 + uint8(_i - _i / 10 * 10));
            bytes1 b1 = bytes1(temp);
            bstr[k] = b1;
            _i /= 10;
        }
        return string(bstr);
    }
}

