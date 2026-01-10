// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * Mission Registry
 * Quest/mission system for DreamNet
 */
contract MissionRegistry is Ownable {
    mapping(uint256 => MissionData) public missions;
    mapping(address => uint256[]) public userMissions;
    uint256 private _missionCounter;

    struct MissionData {
        uint256 id;
        string name;
        string description;
        address creator;
        uint256 rewardHint; // Hint amount (not actual payment)
        bool isActive;
        uint256 createdAt;
        uint256 deadline;
    }

    event MissionCreated(
        uint256 indexed id,
        address indexed creator,
        string name,
        uint256 rewardHint
    );

    event MissionCompleted(
        uint256 indexed id,
        address indexed completer
    );

    constructor() Ownable(msg.sender) {}

    function createMission(
        string memory name,
        string memory description,
        uint256 rewardHint,
        uint256 deadline
    ) public returns (uint256) {
        uint256 id = _missionCounter;
        _missionCounter++;

        missions[id] = MissionData({
            id: id,
            name: name,
            description: description,
            creator: msg.sender,
            rewardHint: rewardHint,
            isActive: true,
            createdAt: block.timestamp,
            deadline: deadline
        });

        emit MissionCreated(id, msg.sender, name, rewardHint);
        return id;
    }

    function completeMission(uint256 missionId) public {
        MissionData storage mission = missions[missionId];
        require(mission.createdAt > 0, "Mission not found");
        require(mission.isActive, "Mission not active");
        require(block.timestamp <= mission.deadline || mission.deadline == 0, "Mission expired");

        mission.isActive = false;
        userMissions[msg.sender].push(missionId);

        emit MissionCompleted(missionId, msg.sender);
    }

    function getMission(uint256 missionId) public view returns (MissionData memory) {
        return missions[missionId];
    }

    function getUserMissions(address user) public view returns (uint256[] memory) {
        return userMissions[user];
    }
}

