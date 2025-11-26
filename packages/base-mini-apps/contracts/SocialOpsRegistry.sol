// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title SocialOpsRegistry
 * @notice Registry for Social Ops campaigns and metrics
 * Tracks campaigns, engagement, metrics, and social operations
 */
contract SocialOpsRegistry is Ownable {
    mapping(uint256 => Campaign) public campaigns;
    mapping(address => uint256[]) public userCampaigns;
    uint256 private _campaignCounter;

    struct Campaign {
        uint256 id;
        address creator;
        string name;
        string description;
        string platform; // e.g., "twitter", "farcaster", "telegram"
        uint256 targetEngagement;
        uint256 currentEngagement;
        uint256 startDate;
        uint256 endDate;
        bool isActive;
        uint256 createdAt;
    }

    struct Metrics {
        uint256 impressions;
        uint256 clicks;
        uint256 shares;
        uint256 likes;
        uint256 comments;
    }

    mapping(uint256 => Metrics) public campaignMetrics;

    event CampaignCreated(
        uint256 indexed id,
        address indexed creator,
        string name,
        string platform
    );
    event EngagementUpdated(
        uint256 indexed campaignId,
        uint256 newEngagement
    );
    event MetricsUpdated(
        uint256 indexed campaignId,
        uint256 impressions,
        uint256 clicks
    );

    constructor() Ownable(msg.sender) {}

    /**
     * @notice Create a new campaign
     */
    function createCampaign(
        string memory name,
        string memory description,
        string memory platform,
        uint256 targetEngagement,
        uint256 startDate,
        uint256 endDate
    ) public returns (uint256) {
        uint256 id = _campaignCounter;
        _campaignCounter++;

        campaigns[id] = Campaign({
            id: id,
            creator: msg.sender,
            name: name,
            description: description,
            platform: platform,
            targetEngagement: targetEngagement,
            currentEngagement: 0,
            startDate: startDate,
            endDate: endDate,
            isActive: true,
            createdAt: block.timestamp
        });

        userCampaigns[msg.sender].push(id);
        emit CampaignCreated(id, msg.sender, name, platform);
        return id;
    }

    /**
     * @notice Update campaign engagement
     */
    function updateEngagement(
        uint256 campaignId,
        uint256 engagement
    ) public {
        Campaign storage campaign = campaigns[campaignId];
        require(campaign.createdAt > 0, "Campaign not found");
        require(
            msg.sender == campaign.creator || msg.sender == owner(),
            "Not authorized"
        );

        campaign.currentEngagement = engagement;
        emit EngagementUpdated(campaignId, engagement);
    }

    /**
     * @notice Update campaign metrics
     */
    function updateMetrics(
        uint256 campaignId,
        uint256 impressions,
        uint256 clicks,
        uint256 shares,
        uint256 likes,
        uint256 comments
    ) public {
        Campaign storage campaign = campaigns[campaignId];
        require(campaign.createdAt > 0, "Campaign not found");
        require(
            msg.sender == campaign.creator || msg.sender == owner(),
            "Not authorized"
        );

        campaignMetrics[campaignId] = Metrics({
            impressions: impressions,
            clicks: clicks,
            shares: shares,
            likes: likes,
            comments: comments
        });

        emit MetricsUpdated(campaignId, impressions, clicks);
    }

    /**
     * @notice Get a campaign by ID
     */
    function getCampaign(uint256 campaignId) public view returns (Campaign memory) {
        return campaigns[campaignId];
    }

    /**
     * @notice Get metrics for a campaign
     */
    function getMetrics(uint256 campaignId) public view returns (Metrics memory) {
        return campaignMetrics[campaignId];
    }

    /**
     * @notice Get all campaigns by a user
     */
    function getUserCampaigns(address user) public view returns (uint256[] memory) {
        return userCampaigns[user];
    }
}

