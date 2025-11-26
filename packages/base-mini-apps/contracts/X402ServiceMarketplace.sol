// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title X402ServiceMarketplace
 * @notice On-chain registry for X402-powered services
 * Allows agents to list services with X402 pricing
 */
contract X402ServiceMarketplace is Ownable {
    mapping(uint256 => Service) public services;
    mapping(address => uint256[]) public providerServices;
    mapping(uint256 => Purchase) public purchases;
    uint256 private _serviceCounter;
    uint256 private _purchaseCounter;

    struct Service {
        uint256 id;
        address provider;
        string name;
        string description;
        string price; // X402 amount as string (e.g., "0.1")
        string category;
        bool isActive;
        uint256 createdAt;
        uint256 purchaseCount;
    }

    struct Purchase {
        uint256 id;
        uint256 serviceId;
        address buyer;
        address provider;
        string amount;
        uint256 timestamp;
        string txHash;
    }

    event ServiceCreated(
        uint256 indexed id,
        address indexed provider,
        string name,
        string price
    );
    event ServiceUpdated(uint256 indexed id, address indexed provider);
    event ServicePurchased(
        uint256 indexed purchaseId,
        uint256 indexed serviceId,
        address indexed buyer,
        string amount,
        string txHash
    );
    event ServiceDeactivated(uint256 indexed id, address indexed provider);

    constructor() Ownable(msg.sender) {}

    /**
     * @notice Create a new service listing
     */
    function createService(
        string memory name,
        string memory description,
        string memory price,
        string memory category
    ) public returns (uint256) {
        uint256 id = _serviceCounter;
        _serviceCounter++;

        services[id] = Service({
            id: id,
            provider: msg.sender,
            name: name,
            description: description,
            price: price,
            category: category,
            isActive: true,
            createdAt: block.timestamp,
            purchaseCount: 0
        });

        providerServices[msg.sender].push(id);

        emit ServiceCreated(id, msg.sender, name, price);
        return id;
    }

    /**
     * @notice Update an existing service
     */
    function updateService(
        uint256 serviceId,
        string memory name,
        string memory description,
        string memory price,
        string memory category
    ) public {
        require(services[serviceId].provider == msg.sender, "Not service provider");
        require(services[serviceId].isActive, "Service not active");

        services[serviceId].name = name;
        services[serviceId].description = description;
        services[serviceId].price = price;
        services[serviceId].category = category;

        emit ServiceUpdated(serviceId, msg.sender);
    }

    /**
     * @notice Record a service purchase (called after X402 payment)
     */
    function recordPurchase(
        uint256 serviceId,
        address buyer,
        string memory amount,
        string memory txHash
    ) public returns (uint256) {
        require(services[serviceId].isActive, "Service not active");
        require(buyer != address(0), "Invalid buyer");

        uint256 purchaseId = _purchaseCounter;
        _purchaseCounter++;

        purchases[purchaseId] = Purchase({
            id: purchaseId,
            serviceId: serviceId,
            buyer: buyer,
            provider: services[serviceId].provider,
            amount: amount,
            timestamp: block.timestamp,
            txHash: txHash
        });

        services[serviceId].purchaseCount++;

        emit ServicePurchased(
            purchaseId,
            serviceId,
            buyer,
            amount,
            txHash
        );

        return purchaseId;
    }

    /**
     * @notice Deactivate a service
     */
    function deactivateService(uint256 serviceId) public {
        require(services[serviceId].provider == msg.sender, "Not service provider");
        services[serviceId].isActive = false;
        emit ServiceDeactivated(serviceId, msg.sender);
    }

    /**
     * @notice Get all active services
     */
    function getActiveServices() public view returns (uint256[] memory) {
        uint256[] memory activeServices = new uint256[](_serviceCounter);
        uint256 count = 0;
        for (uint256 i = 0; i < _serviceCounter; i++) {
            if (services[i].isActive) {
                activeServices[count] = i;
                count++;
            }
        }
        // Resize array
        uint256[] memory result = new uint256[](count);
        for (uint256 i = 0; i < count; i++) {
            result[i] = activeServices[i];
        }
        return result;
    }

    /**
     * @notice Get services by category
     */
    function getServicesByCategory(string memory category) public view returns (uint256[] memory) {
        uint256[] memory categoryServices = new uint256[](_serviceCounter);
        uint256 count = 0;
        for (uint256 i = 0; i < _serviceCounter; i++) {
            if (services[i].isActive && 
                keccak256(bytes(services[i].category)) == keccak256(bytes(category))) {
                categoryServices[count] = i;
                count++;
            }
        }
        uint256[] memory result = new uint256[](count);
        for (uint256 i = 0; i < count; i++) {
            result[i] = categoryServices[i];
        }
        return result;
    }

    /**
     * @notice Get service details
     */
    function getService(uint256 serviceId) public view returns (Service memory) {
        return services[serviceId];
    }
}

