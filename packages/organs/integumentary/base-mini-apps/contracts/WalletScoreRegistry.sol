// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title WalletScoreRegistry
 * @notice On-chain registry for wallet scores and metrics
 * Scores are calculated off-chain and stored on-chain for verification
 */
contract WalletScoreRegistry is Ownable {
    struct WalletScore {
        address wallet;
        uint256 score;
        uint256 risk;
        uint256 diversity;
        uint256 engagement;
        uint256 lastUpdated;
        bool verified;
    }

    mapping(address => WalletScore) public scores;
    address[] public scoredWallets;

    // Score thresholds
    uint256 public minScoreForVerification = 50;
    uint256 public maxScore = 100;

    event ScoreUpdated(
        address indexed wallet,
        uint256 score,
        uint256 risk,
        uint256 diversity,
        uint256 engagement
    );
    event ScoreVerified(address indexed wallet, bool verified);
    event ThresholdsUpdated(uint256 minScore, uint256 maxScore);

    constructor(address initialOwner) Ownable(initialOwner) {}

    /**
     * @notice Update wallet score (only owner/authorized scorer)
     */
    function updateScore(
        address wallet,
        uint256 score,
        uint256 risk,
        uint256 diversity,
        uint256 engagement
    ) external onlyOwner {
        require(wallet != address(0), "Invalid wallet");
        require(score <= maxScore, "Score exceeds maximum");
        require(risk <= 100, "Risk must be <= 100");
        require(diversity <= 100, "Diversity must be <= 100");
        require(engagement <= 100, "Engagement must be <= 100");

        bool isNew = scores[wallet].lastUpdated == 0;
        
        scores[wallet] = WalletScore({
            wallet: wallet,
            score: score,
            risk: risk,
            diversity: diversity,
            engagement: engagement,
            lastUpdated: block.timestamp,
            verified: score >= minScoreForVerification
        });

        if (isNew) {
            scoredWallets.push(wallet);
        }

        emit ScoreUpdated(wallet, score, risk, diversity, engagement);
        
        if (scores[wallet].verified) {
            emit ScoreVerified(wallet, true);
        }
    }

    /**
     * @notice Batch update scores
     */
    function batchUpdateScores(
        address[] memory wallets,
        uint256[] memory scoreValues,
        uint256[] memory risks,
        uint256[] memory diversities,
        uint256[] memory engagements
    ) external onlyOwner {
        require(
            wallets.length == scoreValues.length &&
            wallets.length == risks.length &&
            wallets.length == diversities.length &&
            wallets.length == engagements.length,
            "Array length mismatch"
        );

        for (uint256 i = 0; i < wallets.length; i++) {
            address wallet = wallets[i];
            uint256 score = scoreValues[i];
            uint256 risk = risks[i];
            uint256 diversity = diversities[i];
            uint256 engagement = engagements[i];
            
            require(wallet != address(0), "Invalid wallet");
            require(score <= maxScore, "Score exceeds maximum");
            require(risk <= 100, "Risk must be <= 100");
            require(diversity <= 100, "Diversity must be <= 100");
            require(engagement <= 100, "Engagement must be <= 100");

            bool isNew = scores[wallet].lastUpdated == 0;
            
            scores[wallet] = WalletScore({
                wallet: wallet,
                score: score,
                risk: risk,
                diversity: diversity,
                engagement: engagement,
                lastUpdated: block.timestamp,
                verified: score >= minScoreForVerification
            });

            if (isNew) {
                scoredWallets.push(wallet);
            }

            emit ScoreUpdated(wallet, score, risk, diversity, engagement);
            
            if (scores[wallet].verified) {
                emit ScoreVerified(wallet, true);
            }
        }
    }

    /**
     * @notice Verify a wallet score
     */
    function verifyScore(address wallet) external onlyOwner {
        require(scores[wallet].lastUpdated > 0, "Score not found");
        scores[wallet].verified = true;
        emit ScoreVerified(wallet, true);
    }

    /**
     * @notice Update score thresholds
     */
    function updateThresholds(uint256 minScore, uint256 maxScoreValue) external onlyOwner {
        require(maxScoreValue > 0, "Max score must be > 0");
        minScoreForVerification = minScore;
        maxScore = maxScoreValue;
        emit ThresholdsUpdated(minScore, maxScoreValue);
    }

    /**
     * @notice Get wallet score
     */
    function getScore(address wallet) external view returns (WalletScore memory) {
        return scores[wallet];
    }

    /**
     * @notice Check if wallet is verified
     */
    function isVerified(address wallet) external view returns (bool) {
        return scores[wallet].verified;
    }

    /**
     * @notice Get total scored wallets
     */
    function getTotalScoredWallets() external view returns (uint256) {
        return scoredWallets.length;
    }
}

