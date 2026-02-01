// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * Dream Time Capsule
 * Lock dreams with a future unlock date/time
 */
contract DreamTimeCapsule {
    mapping(uint256 => CapsuleData) public capsules;
    mapping(address => uint256[]) public userCapsules;
    uint256 private _capsuleCounter;

    struct CapsuleData {
        uint256 id;
        address creator;
        bytes32 dreamHash;
        string message;
        uint256 unlockTimestamp;
        bool isUnlocked;
        bool earlyUnlockEnabled;
        uint256 earlyUnlockFee; // in wei
        uint256 createdAt;
    }

    event CapsuleCreated(
        uint256 indexed id,
        address indexed creator,
        bytes32 dreamHash,
        uint256 unlockTimestamp
    );

    event CapsuleUnlocked(
        uint256 indexed id,
        address indexed unlocker,
        bool earlyUnlock
    );

    function createCapsule(
        bytes32 dreamHash,
        string memory message,
        uint256 unlockTimestamp,
        bool allowEarlyUnlock,
        uint256 earlyUnlockFee
    ) public returns (uint256) {
        require(unlockTimestamp > block.timestamp, "Unlock time must be in the future");
        require(unlockTimestamp <= block.timestamp + 365 days * 100, "Max 100 years");

        uint256 id = _capsuleCounter;
        _capsuleCounter++;

        capsules[id] = CapsuleData({
            id: id,
            creator: msg.sender,
            dreamHash: dreamHash,
            message: message,
            unlockTimestamp: unlockTimestamp,
            isUnlocked: false,
            earlyUnlockEnabled: allowEarlyUnlock,
            earlyUnlockFee: earlyUnlockFee,
            createdAt: block.timestamp
        });

        userCapsules[msg.sender].push(id);
        emit CapsuleCreated(id, msg.sender, dreamHash, unlockTimestamp);
        return id;
    }

    function unlockCapsule(uint256 capsuleId) public payable {
        CapsuleData storage capsule = capsules[capsuleId];
        require(capsule.createdAt > 0, "Capsule does not exist");
        require(!capsule.isUnlocked, "Capsule already unlocked");

        bool earlyUnlock = false;
        
        if (block.timestamp < capsule.unlockTimestamp) {
            // Early unlock
            require(capsule.earlyUnlockEnabled, "Early unlock not allowed");
            require(msg.value >= capsule.earlyUnlockFee, "Insufficient fee for early unlock");
            earlyUnlock = true;
        }

        capsule.isUnlocked = true;
        emit CapsuleUnlocked(capsuleId, msg.sender, earlyUnlock);

        // Refund excess payment
        if (msg.value > capsule.earlyUnlockFee) {
            payable(msg.sender).transfer(msg.value - capsule.earlyUnlockFee);
        }
    }

    function getCapsule(uint256 capsuleId) public view returns (CapsuleData memory) {
        return capsules[capsuleId];
    }

    function getUserCapsules(address user) public view returns (uint256[] memory) {
        return userCapsules[user];
    }

    function canUnlock(uint256 capsuleId) public view returns (bool) {
        CapsuleData memory capsule = capsules[capsuleId];
        if (capsule.createdAt == 0 || capsule.isUnlocked) return false;
        return block.timestamp >= capsule.unlockTimestamp || capsule.earlyUnlockEnabled;
    }

    function getTimeUntilUnlock(uint256 capsuleId) public view returns (uint256) {
        CapsuleData memory capsule = capsules[capsuleId];
        if (capsule.createdAt == 0 || capsule.isUnlocked) return 0;
        if (block.timestamp >= capsule.unlockTimestamp) return 0;
        return capsule.unlockTimestamp - block.timestamp;
    }
}

