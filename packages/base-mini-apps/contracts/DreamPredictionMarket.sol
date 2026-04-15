// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * Dream Prediction Market
 * Bet on dream outcomes, agent performance, network events
 */
contract DreamPredictionMarket is Ownable, ReentrancyGuard {
    mapping(uint256 => Prediction) public predictions;
    mapping(uint256 => mapping(bool => uint256)) public predictionPools; // predictionId => outcome => total staked
    mapping(uint256 => mapping(address => mapping(bool => uint256))) public userStakes; // predictionId => user => outcome => amount
    mapping(address => uint256[]) public userPredictions;
    uint256 private _predictionCounter;

    struct Prediction {
        uint256 id;
        string description;
        address creator;
        uint256 endTime;
        bool resolved;
        bool outcome; // true = yes, false = no
        address resolver; // Who resolved it
        uint256 totalStaked;
        uint256 createdAt;
    }

    uint256 public platformFee = 200; // 2% (in basis points)
    uint256 public constant BASIS_POINTS = 10000;

    event PredictionCreated(
        uint256 indexed id,
        address indexed creator,
        string description,
        uint256 endTime
    );

    event PredictionStaked(
        uint256 indexed id,
        address indexed staker,
        bool outcome,
        uint256 amount
    );

    event PredictionResolved(
        uint256 indexed id,
        bool outcome,
        address indexed resolver
    );

    event WinningsClaimed(
        uint256 indexed id,
        address indexed winner,
        uint256 amount
    );

    constructor() Ownable(msg.sender) {}

    function createPrediction(
        string memory description,
        uint256 endTime
    ) public returns (uint256) {
        require(endTime > block.timestamp, "End time must be in the future");
        require(bytes(description).length > 0, "Description required");

        uint256 id = _predictionCounter;
        _predictionCounter++;

        predictions[id] = Prediction({
            id: id,
            description: description,
            creator: msg.sender,
            endTime: endTime,
            resolved: false,
            outcome: false,
            resolver: address(0),
            totalStaked: 0,
            createdAt: block.timestamp
        });

        userPredictions[msg.sender].push(id);
        emit PredictionCreated(id, msg.sender, description, endTime);
        return id;
    }

    function stakeOnPrediction(
        uint256 predictionId,
        bool outcome
    ) public payable nonReentrant {
        require(msg.value > 0, "Must stake something");
        Prediction storage prediction = predictions[predictionId];
        require(prediction.createdAt > 0, "Prediction does not exist");
        require(!prediction.resolved, "Prediction already resolved");
        require(block.timestamp < prediction.endTime, "Prediction ended");

        userStakes[predictionId][msg.sender][outcome] += msg.value;
        predictionPools[predictionId][outcome] += msg.value;
        prediction.totalStaked += msg.value;

        emit PredictionStaked(predictionId, msg.sender, outcome, msg.value);
    }

    function resolvePrediction(
        uint256 predictionId,
        bool outcome
    ) public onlyOwner {
        Prediction storage prediction = predictions[predictionId];
        require(prediction.createdAt > 0, "Prediction does not exist");
        require(!prediction.resolved, "Already resolved");
        require(block.timestamp >= prediction.endTime, "Too early to resolve");

        prediction.resolved = true;
        prediction.outcome = outcome;
        prediction.resolver = msg.sender;

        emit PredictionResolved(predictionId, outcome, msg.sender);
    }

    function claimWinnings(uint256 predictionId) public nonReentrant {
        Prediction memory prediction = predictions[predictionId];
        require(prediction.resolved, "Prediction not resolved");
        
        uint256 userStake = userStakes[predictionId][msg.sender][prediction.outcome];
        require(userStake > 0, "No winnings to claim");

        // Calculate winnings
        uint256 totalWinningPool = predictionPools[predictionId][prediction.outcome];
        uint256 totalLosingPool = predictionPools[predictionId][!prediction.outcome];
        uint256 totalPool = totalWinningPool + totalLosingPool;

        // User gets their stake back + proportional share of losing pool (minus fee)
        uint256 winnings = userStake + ((totalLosingPool * userStake) / totalWinningPool);
        uint256 fee = (winnings * platformFee) / BASIS_POINTS;
        uint256 payout = winnings - fee;

        // Clear user stake
        userStakes[predictionId][msg.sender][prediction.outcome] = 0;

        (bool success, ) = payable(msg.sender).call{value: payout}("");
        require(success, "Transfer failed");

        emit WinningsClaimed(predictionId, msg.sender, payout);
    }

    function getPrediction(uint256 predictionId) public view returns (Prediction memory) {
        return predictions[predictionId];
    }

    function getUserStake(uint256 predictionId, address user, bool outcome) public view returns (uint256) {
        return userStakes[predictionId][user][outcome];
    }

    function getUserPredictions(address user) public view returns (uint256[] memory) {
        return userPredictions[user];
    }

    function getPoolSizes(uint256 predictionId) public view returns (uint256 yesPool, uint256 noPool) {
        return (
            predictionPools[predictionId][true],
            predictionPools[predictionId][false]
        );
    }

    function withdrawFees() public onlyOwner {
        uint256 balance = address(this).balance;
        (bool success, ) = payable(owner()).call{value: balance}("");
        require(success, "Withdrawal failed");
    }

    receive() external payable {
        // Allow contract to receive ETH
    }
}

