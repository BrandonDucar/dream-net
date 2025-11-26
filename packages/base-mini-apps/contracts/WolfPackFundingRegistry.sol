// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title WolfPackFundingRegistry
 * @notice Registry for Wolf Pack funding opportunities and applications
 * Tracks grants, applications, outcomes, and funding history
 */
contract WolfPackFundingRegistry is Ownable {
    mapping(uint256 => FundingOpportunity) public opportunities;
    mapping(uint256 => Application) public applications;
    mapping(address => uint256[]) public userApplications;
    uint256 private _opportunityCounter;
    uint256 private _applicationCounter;

    struct FundingOpportunity {
        uint256 id;
        string title;
        string description;
        string source; // e.g., "Base Foundation", "Optimism Grants"
        uint256 maxAmount;
        uint256 deadline;
        bool isActive;
        uint256 createdAt;
    }

    struct Application {
        uint256 id;
        uint256 opportunityId;
        address applicant;
        string proposal;
        uint256 requestedAmount;
        uint256 status; // 0 = pending, 1 = approved, 2 = rejected
        uint256 submittedAt;
        uint256 reviewedAt;
    }

    event OpportunityCreated(
        uint256 indexed id,
        string title,
        uint256 maxAmount,
        uint256 deadline
    );
    event ApplicationSubmitted(
        uint256 indexed applicationId,
        uint256 indexed opportunityId,
        address indexed applicant
    );
    event ApplicationReviewed(
        uint256 indexed applicationId,
        uint256 status
    );

    constructor() Ownable(msg.sender) {}

    /**
     * @notice Create a new funding opportunity
     */
    function createOpportunity(
        string memory title,
        string memory description,
        string memory source,
        uint256 maxAmount,
        uint256 deadline
    ) public onlyOwner returns (uint256) {
        uint256 id = _opportunityCounter;
        _opportunityCounter++;

        opportunities[id] = FundingOpportunity({
            id: id,
            title: title,
            description: description,
            source: source,
            maxAmount: maxAmount,
            deadline: deadline,
            isActive: true,
            createdAt: block.timestamp
        });

        emit OpportunityCreated(id, title, maxAmount, deadline);
        return id;
    }

    /**
     * @notice Submit a funding application
     */
    function submitApplication(
        uint256 opportunityId,
        string memory proposal,
        uint256 requestedAmount
    ) public returns (uint256) {
        FundingOpportunity storage opp = opportunities[opportunityId];
        require(opp.createdAt > 0, "Opportunity not found");
        require(opp.isActive, "Opportunity not active");
        require(block.timestamp <= opp.deadline, "Deadline passed");
        require(requestedAmount <= opp.maxAmount, "Amount exceeds max");

        uint256 id = _applicationCounter;
        _applicationCounter++;

        applications[id] = Application({
            id: id,
            opportunityId: opportunityId,
            applicant: msg.sender,
            proposal: proposal,
            requestedAmount: requestedAmount,
            status: 0, // pending
            submittedAt: block.timestamp,
            reviewedAt: 0
        });

        userApplications[msg.sender].push(id);
        emit ApplicationSubmitted(id, opportunityId, msg.sender);
        return id;
    }

    /**
     * @notice Review an application (owner only)
     */
    function reviewApplication(uint256 applicationId, uint256 status) public onlyOwner {
        Application storage app = applications[applicationId];
        require(app.submittedAt > 0, "Application not found");
        require(status == 1 || status == 2, "Invalid status"); // 1 = approved, 2 = rejected
        
        app.status = status;
        app.reviewedAt = block.timestamp;
        emit ApplicationReviewed(applicationId, status);
    }

    /**
     * @notice Get an opportunity by ID
     */
    function getOpportunity(uint256 opportunityId) public view returns (FundingOpportunity memory) {
        return opportunities[opportunityId];
    }

    /**
     * @notice Get an application by ID
     */
    function getApplication(uint256 applicationId) public view returns (Application memory) {
        return applications[applicationId];
    }

    /**
     * @notice Get all applications by a user
     */
    function getUserApplications(address user) public view returns (uint256[] memory) {
        return userApplications[user];
    }
}

