// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * Bounty Escrow Contract
 * Holds funds for bounties and releases on completion
 */
contract BountyEscrow is Ownable, ReentrancyGuard {
    struct Bounty {
        uint256 id;
        address creator;
        uint256 amount;
        string description;
        address winner;
        bool isClaimed;
        bool isActive;
        uint256 createdAt;
        uint256 deadline;
    }

    mapping(uint256 => Bounty) public bounties;
    uint256 private _bountyCounter;

    event BountyCreated(uint256 indexed id, address indexed creator, uint256 amount);
    event BountyClaimed(uint256 indexed id, address indexed winner, uint256 amount);
    event BountyCancelled(uint256 indexed id, address indexed creator);

    constructor() Ownable(msg.sender) {}

    function createBounty(
        string memory description,
        uint256 deadline
    ) public payable returns (uint256) {
        require(msg.value > 0, "Bounty amount must be greater than 0");
        require(deadline > block.timestamp, "Deadline must be in the future");

        uint256 id = _bountyCounter;
        _bountyCounter++;

        bounties[id] = Bounty({
            id: id,
            creator: msg.sender,
            amount: msg.value,
            description: description,
            winner: address(0),
            isClaimed: false,
            isActive: true,
            createdAt: block.timestamp,
            deadline: deadline
        });

        emit BountyCreated(id, msg.sender, msg.value);
        return id;
    }

    function claimBounty(uint256 bountyId) public nonReentrant {
        Bounty storage bounty = bounties[bountyId];
        require(bounty.isActive, "Bounty is not active");
        require(bounty.winner == address(0), "Bounty already claimed");
        require(block.timestamp <= bounty.deadline, "Bounty deadline passed");

        bounty.winner = msg.sender;
        bounty.isClaimed = true;
        bounty.isActive = false;

        (bool success, ) = payable(msg.sender).call{value: bounty.amount}("");
        require(success, "Transfer failed");

        emit BountyClaimed(bountyId, msg.sender, bounty.amount);
    }

    function cancelBounty(uint256 bountyId) public {
        Bounty storage bounty = bounties[bountyId];
        require(bounty.creator == msg.sender, "Only creator can cancel");
        require(bounty.isActive, "Bounty is not active");
        require(bounty.winner == address(0), "Bounty already claimed");

        bounty.isActive = false;

        (bool success, ) = payable(bounty.creator).call{value: bounty.amount}("");
        require(success, "Transfer failed");

        emit BountyCancelled(bountyId, bounty.creator);
    }

    function getBounty(uint256 bountyId) public view returns (Bounty memory) {
        return bounties[bountyId];
    }
}

