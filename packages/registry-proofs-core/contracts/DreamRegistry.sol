// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * Dream Registry
 * 
 * On-chain registry for KYC/KYB attestations and compliance flags
 * Bitmap-based flag storage for gas efficiency
 */
contract DreamRegistry is Ownable, ReentrancyGuard {
    // Registry bits (uint256 bitmap):
    uint8 constant KYC = 0;                    // Know Your Customer verified
    uint8 constant KYB = 1;                    // Know Your Business verified
    uint8 constant ACCREDITED = 2;             // Accredited investor
    uint8 constant REGION_US = 3;              // US region verified
    uint8 constant REGION_EU = 4;              // EU region verified
    uint8 constant SANCTIONS_CLEAR = 5;         // Sanctions screening passed
    uint8 constant PROFESSIONAL_INVESTOR = 6;  // Professional investor status
    uint8 constant NODE_OPERATOR = 7;           // DIN-style operator verification
    
    mapping(address => uint256) public registryFlags;
    mapping(address => address) public attesters; // who attested this account
    mapping(address => bool) public authorizedAttesters;
    
    address[] public attesterList;
    
    event FlagSet(
        address indexed account,
        uint8 flagBit,
        bool value,
        address indexed attester,
        uint256 timestamp
    );
    
    event AttesterAdded(address indexed attester);
    event AttesterRemoved(address indexed attester);
    
    modifier onlyAttester() {
        require(authorizedAttesters[msg.sender], "Not an authorized attester");
        _;
    }
    
    constructor() Ownable(msg.sender) {
        // Owner is initial attester
        authorizedAttesters[msg.sender] = true;
        attesterList.push(msg.sender);
    }
    
    /**
     * Set a registry flag for an account
     */
    function setFlag(
        address account,
        uint8 flagBit,
        bool value
    ) external onlyAttester {
        require(flagBit < 256, "Invalid flag bit");
        
        if (value) {
            registryFlags[account] |= (1 << flagBit);
        } else {
            registryFlags[account] &= ~(1 << flagBit);
        }
        
        attesters[account] = msg.sender;
        
        emit FlagSet(account, flagBit, value, msg.sender, block.timestamp);
    }
    
    /**
     * Set multiple flags at once
     */
    function setFlags(
        address account,
        uint8[] memory flagBits,
        bool[] memory values
    ) external onlyAttester {
        require(flagBits.length == values.length, "Arrays length mismatch");
        
        for (uint i = 0; i < flagBits.length; i++) {
            require(flagBits[i] < 256, "Invalid flag bit");
            
            if (values[i]) {
                registryFlags[account] |= (1 << flagBits[i]);
            } else {
                registryFlags[account] &= ~(1 << flagBits[i]);
            }
        }
        
        attesters[account] = msg.sender;
        
        // Emit events for each flag
        for (uint i = 0; i < flagBits.length; i++) {
            emit FlagSet(account, flagBits[i], values[i], msg.sender, block.timestamp);
        }
    }
    
    /**
     * Check if an account has a specific flag
     */
    function hasFlag(address account, uint8 flagBit) external view returns (bool) {
        require(flagBit < 256, "Invalid flag bit");
        return (registryFlags[account] & (1 << flagBit)) != 0;
    }
    
    /**
     * Get all flags for an account
     */
    function getFlags(address account) external view returns (uint256) {
        return registryFlags[account];
    }
    
    /**
     * Check if account has all required flags
     */
    function hasAllFlags(address account, uint8[] memory flagBits) external view returns (bool) {
        for (uint i = 0; i < flagBits.length; i++) {
            if ((registryFlags[account] & (1 << flagBits[i])) == 0) {
                return false;
            }
        }
        return true;
    }
    
    /**
     * Add an authorized attester
     */
    function addAttester(address attester) external onlyOwner {
        require(!authorizedAttesters[attester], "Already an attester");
        authorizedAttesters[attester] = true;
        attesterList.push(attester);
        emit AttesterAdded(attester);
    }
    
    /**
     * Remove an authorized attester
     */
    function removeAttester(address attester) external onlyOwner {
        require(authorizedAttesters[attester], "Not an attester");
        authorizedAttesters[attester] = false;
        emit AttesterRemoved(attester);
    }
    
    /**
     * Get all attesters
     */
    function getAllAttesters() external view returns (address[] memory) {
        return attesterList;
    }
}

