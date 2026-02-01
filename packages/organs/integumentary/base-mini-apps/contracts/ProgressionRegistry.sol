// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * Progression Registry
 * Tracks XP and tier progression for users
 */
contract ProgressionRegistry is Ownable {
    mapping(address => UserProgression) public progression;
    mapping(uint256 => TierData) public tiers;

    struct UserProgression {
        uint256 xp;
        uint256 tier;
        uint256 lastUpdated;
    }

    struct TierData {
        string name;
        uint256 minXP;
    }

    event XPUpdated(address indexed user, uint256 newXP, uint256 newTier);
    event TierUpdated(address indexed user, uint256 oldTier, uint256 newTier);
    event TierDefined(uint256 tierId, string name, uint256 minXP);

    constructor() Ownable(msg.sender) {
        // Initialize default tiers
        defineTier(0, "Visitor", 0);
        defineTier(1, "Dreamer", 100);
        defineTier(2, "Citizen", 500);
        defineTier(3, "Operator", 2000);
        defineTier(4, "Architect", 10000);
        defineTier(5, "Founder", 50000);
    }

    function defineTier(
        uint256 tierId,
        string memory name,
        uint256 minXP
    ) public onlyOwner {
        tiers[tierId] = TierData({name: name, minXP: minXP});
        emit TierDefined(tierId, name, minXP);
    }

    function updateXP(address user, uint256 xp) public onlyOwner {
        UserProgression storage prog = progression[user];
        uint256 oldTier = prog.tier;
        uint256 newTier = calculateTier(xp);

        prog.xp = xp;
        prog.tier = newTier;
        prog.lastUpdated = block.timestamp;

        emit XPUpdated(user, xp, newTier);
        if (oldTier != newTier) {
            emit TierUpdated(user, oldTier, newTier);
        }
    }

    function addXP(address user, uint256 amount) public onlyOwner {
        UserProgression storage prog = progression[user];
        uint256 newXP = prog.xp + amount;
        updateXP(user, newXP);
    }

    function calculateTier(uint256 xp) public view returns (uint256) {
        uint256 currentTier = 0;
        for (uint256 i = 0; i < 10; i++) {
            if (tiers[i].minXP <= xp) {
                currentTier = i;
            } else {
                break;
            }
        }
        return currentTier;
    }

    function getUserProgression(address user) public view returns (UserProgression memory) {
        return progression[user];
    }
}

