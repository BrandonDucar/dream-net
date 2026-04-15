// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * Dream Remix Registry
 * Tracks remix relationships between dreams
 */
contract DreamRemixRegistry is Ownable {
    mapping(uint256 => uint256) public remixOf; // childId => parentId
    mapping(uint256 => uint256[]) public remixesOf; // parentId => childIds[]
    mapping(uint256 => bool) public isRegistered;

    event RemixRegistered(
        uint256 indexed childId,
        uint256 indexed parentId,
        address indexed creator
    );

    constructor() Ownable(msg.sender) {}

    function registerRemix(
        uint256 childId,
        uint256 parentId
    ) public {
        require(!isRegistered[childId], "Remix already registered");
        require(childId != parentId, "Cannot remix self");

        remixOf[childId] = parentId;
        remixesOf[parentId].push(childId);
        isRegistered[childId] = true;

        emit RemixRegistered(childId, parentId, msg.sender);
    }

    function getRemixParent(uint256 childId) public view returns (uint256) {
        return remixOf[childId];
    }

    function getRemixes(uint256 parentId) public view returns (uint256[] memory) {
        return remixesOf[parentId];
    }
}

