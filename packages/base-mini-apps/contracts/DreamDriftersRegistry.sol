// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * Dream Drifters Registry
 * Registry of DreamNet drifters (community members)
 */
contract DreamDriftersRegistry {
    mapping(address => DrifterData) public drifters;
    address[] public drifterAddresses;
    mapping(address => bool) public isDrifter;

    struct DrifterData {
        address drifterAddress;
        bytes32 metadataHash;
        uint256 joinedAt;
        bool isActive;
    }

    event DrifterJoined(
        address indexed drifter,
        bytes32 metadataHash
    );

    event DrifterUpdated(
        address indexed drifter,
        bytes32 metadataHash
    );

    function joinAsDrifter(bytes32 metadataHash) public {
        require(!isDrifter[msg.sender], "Already a drifter");

        drifters[msg.sender] = DrifterData({
            drifterAddress: msg.sender,
            metadataHash: metadataHash,
            joinedAt: block.timestamp,
            isActive: true
        });

        drifterAddresses.push(msg.sender);
        isDrifter[msg.sender] = true;

        emit DrifterJoined(msg.sender, metadataHash);
    }

    function updateMetadata(bytes32 metadataHash) public {
        require(isDrifter[msg.sender], "Not a drifter");
        drifters[msg.sender].metadataHash = metadataHash;
        emit DrifterUpdated(msg.sender, metadataHash);
    }

    function getDrifter(address drifter) public view returns (DrifterData memory) {
        return drifters[drifter];
    }

    function getAllDrifters() public view returns (address[] memory) {
        return drifterAddresses;
    }

    function getDrifterCount() public view returns (uint256) {
        return drifterAddresses.length;
    }
}

