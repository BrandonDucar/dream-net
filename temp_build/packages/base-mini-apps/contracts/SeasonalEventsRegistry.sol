// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * Seasonal Events Registry
 * Tracks seasonal events and their metadata
 */
contract SeasonalEventsRegistry is Ownable {
    mapping(bytes32 => EventData) public events;
    bytes32[] public eventIds;

    struct EventData {
        bytes32 seasonId;
        string name;
        bytes32 metadataHash;
        uint256 startTime;
        uint256 endTime;
        bool isActive;
    }

    event SeasonAdded(
        bytes32 indexed seasonId,
        string name,
        uint256 startTime,
        uint256 endTime
    );

    event SeasonActivated(bytes32 indexed seasonId);
    event SeasonDeactivated(bytes32 indexed seasonId);

    constructor() Ownable(msg.sender) {}

    function registerSeason(
        bytes32 seasonId,
        string memory name,
        bytes32 metadataHash,
        uint256 startTime,
        uint256 endTime
    ) public onlyOwner {
        require(events[seasonId].startTime == 0, "Season already registered");
        require(endTime > startTime, "Invalid time range");

        events[seasonId] = EventData({
            seasonId: seasonId,
            name: name,
            metadataHash: metadataHash,
            startTime: startTime,
            endTime: endTime,
            isActive: false
        });

        eventIds.push(seasonId);
        emit SeasonAdded(seasonId, name, startTime, endTime);
    }

    function activateSeason(bytes32 seasonId) public onlyOwner {
        require(events[seasonId].startTime > 0, "Season not found");
        events[seasonId].isActive = true;
        emit SeasonActivated(seasonId);
    }

    function deactivateSeason(bytes32 seasonId) public onlyOwner {
        require(events[seasonId].startTime > 0, "Season not found");
        events[seasonId].isActive = false;
        emit SeasonDeactivated(seasonId);
    }

    function getSeason(bytes32 seasonId) public view returns (EventData memory) {
        return events[seasonId];
    }

    function getAllSeasons() public view returns (bytes32[] memory) {
        return eventIds;
    }
}

