// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./PassportMint.sol";

/**
 * Dream State Governance Contract
 * Allows passport holders to vote on proposals
 */
contract DreamStateGovernance {
    DreamPassportNFT public passportContract;
    
    struct Proposal {
        uint256 id;
        string title;
        string description;
        address proposer;
        uint256 createdAt;
        uint256 votingEndsAt;
        uint256 votesFor;
        uint256 votesAgainst;
        bool executed;
        mapping(address => bool) hasVoted;
        mapping(address => Vote) votes;
    }

    struct Vote {
        bool support; // true = for, false = against
        uint256 weight; // Based on passport tier
    }

    mapping(uint256 => Proposal) public proposals;
    uint256 public proposalCount;
    
    // Tier weights for voting
    mapping(uint256 => uint256) public tierWeights; // PassportTier => weight

    event ProposalCreated(uint256 indexed proposalId, address indexed proposer);
    event VoteCast(uint256 indexed proposalId, address indexed voter, bool support, uint256 weight);
    event ProposalExecuted(uint256 indexed proposalId);

    constructor(address _passportContract) {
        passportContract = DreamPassportNFT(_passportContract);
        
        // Set tier weights
        tierWeights[0] = 0; // Visitor - no vote
        tierWeights[1] = 1; // Dreamer
        tierWeights[2] = 2; // Citizen
        tierWeights[3] = 3; // Operator
        tierWeights[4] = 5; // Architect
        tierWeights[5] = 10; // Founder
    }

    function createProposal(
        string memory title,
        string memory description,
        uint256 votingDuration
    ) public returns (uint256) {
        require(passportContract.hasPassport(msg.sender), "Must have passport");
        
        proposalCount++;
        uint256 proposalId = proposalCount;
        
        Proposal storage proposal = proposals[proposalId];
        proposal.id = proposalId;
        proposal.title = title;
        proposal.description = description;
        proposal.proposer = msg.sender;
        proposal.createdAt = block.timestamp;
        proposal.votingEndsAt = block.timestamp + votingDuration;
        
        emit ProposalCreated(proposalId, msg.sender);
        return proposalId;
    }

    function castVote(uint256 proposalId, bool support) public {
        require(passportContract.hasPassport(msg.sender), "Must have passport");
        
        Proposal storage proposal = proposals[proposalId];
        require(block.timestamp <= proposal.votingEndsAt, "Voting ended");
        require(!proposal.hasVoted[msg.sender], "Already voted");
        
        uint256 tier = uint256(passportContract.getTier(msg.sender));
        uint256 weight = tierWeights[tier];
        require(weight > 0, "Tier cannot vote");
        
        proposal.hasVoted[msg.sender] = true;
        proposal.votes[msg.sender] = Vote({
            support: support,
            weight: weight
        });
        
        if (support) {
            proposal.votesFor += weight;
        } else {
            proposal.votesAgainst += weight;
        }
        
        emit VoteCast(proposalId, msg.sender, support, weight);
    }

    function executeProposal(uint256 proposalId) public {
        Proposal storage proposal = proposals[proposalId];
        require(block.timestamp > proposal.votingEndsAt, "Voting still active");
        require(!proposal.executed, "Already executed");
        require(proposal.votesFor > proposal.votesAgainst, "Proposal rejected");
        
        proposal.executed = true;
        emit ProposalExecuted(proposalId);
    }

    function getProposal(uint256 proposalId) public view returns (
        uint256 id,
        string memory title,
        string memory description,
        address proposer,
        uint256 votesFor,
        uint256 votesAgainst,
        bool executed
    ) {
        Proposal storage p = proposals[proposalId];
        return (
            p.id,
            p.title,
            p.description,
            p.proposer,
            p.votesFor,
            p.votesAgainst,
            p.executed
        );
    }
}

