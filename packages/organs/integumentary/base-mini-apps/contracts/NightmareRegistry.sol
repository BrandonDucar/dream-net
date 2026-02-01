// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * Nightmare Registry
 * Tracks nightmares and their resolution status
 */
contract NightmareRegistry {
    mapping(uint256 => NightmareData) public nightmares;
    mapping(address => uint256[]) public userNightmares;
    uint256 private _nightmareCounter;

    struct NightmareData {
        uint256 id;
        address reporter;
        bytes32 contentHash;
        string resolutionType; // "transmutation", "purification", "containment"
        address assignedAgent;
        bool isResolved;
        uint256 reportedAt;
        uint256 resolvedAt;
    }

    event NightmareLogged(
        uint256 indexed id,
        address indexed reporter,
        bytes32 contentHash
    );

    event NightmareResolved(
        uint256 indexed id,
        string resolutionType,
        address indexed agent
    );

    function logNightmare(
        bytes32 contentHash
    ) public returns (uint256) {
        uint256 id = _nightmareCounter;
        _nightmareCounter++;

        nightmares[id] = NightmareData({
            id: id,
            reporter: msg.sender,
            contentHash: contentHash,
            resolutionType: "",
            assignedAgent: address(0),
            isResolved: false,
            reportedAt: block.timestamp,
            resolvedAt: 0
        });

        userNightmares[msg.sender].push(id);
        emit NightmareLogged(id, msg.sender, contentHash);
        return id;
    }

    function resolveNightmare(
        uint256 nightmareId,
        string memory resolutionType,
        address agent
    ) public {
        NightmareData storage nightmare = nightmares[nightmareId];
        require(nightmare.reportedAt > 0, "Nightmare not found");
        require(!nightmare.isResolved, "Already resolved");

        nightmare.isResolved = true;
        nightmare.resolutionType = resolutionType;
        nightmare.assignedAgent = agent;
        nightmare.resolvedAt = block.timestamp;

        emit NightmareResolved(nightmareId, resolutionType, agent);
    }

    function getNightmare(uint256 nightmareId) public view returns (NightmareData memory) {
        return nightmares[nightmareId];
    }

    function getUserNightmares(address user) public view returns (uint256[] memory) {
        return userNightmares[user];
    }
}

