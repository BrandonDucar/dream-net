// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title TributeGate
 * @notice Send tributes (payments) to Dreams, Agents, or Nodes
 * Supports multiple token types
 */
contract TributeGate is Ownable, ReentrancyGuard {
    enum TributeTarget {
        Dream,
        Agent,
        Node
    }

    struct Tribute {
        uint256 id;
        address sender;
        TributeTarget target;
        string targetId; // Dream ID, Agent name, or Node address
        address tokenAddress;
        uint256 amount;
        string message;
        uint256 timestamp;
    }

    mapping(uint256 => Tribute) public tributes;
    mapping(address => uint256[]) public userTributes;
    mapping(string => uint256[]) public targetTributes; // targetId => tribute IDs
    uint256 public tributeCount;
    uint256 public totalTributes;

    // Token whitelist
    mapping(address => bool) public allowedTokens;
    address[] public tokenList;

    event TributeSent(
        uint256 indexed tributeId,
        address indexed sender,
        TributeTarget target,
        string targetId,
        address tokenAddress,
        uint256 amount
    );
    event TokenWhitelisted(address indexed token, bool allowed);

    constructor(address initialOwner) Ownable(initialOwner) {
        // Allow ETH by default
        allowedTokens[address(0)] = true;
    }

    /**
     * @notice Send a tribute
     */
    function sendTribute(
        TributeTarget target,
        string memory targetId,
        address tokenAddress,
        uint256 amount,
        string memory message
    ) external payable nonReentrant {
        require(amount > 0, "Amount must be > 0");
        require(allowedTokens[tokenAddress], "Token not allowed");

        if (tokenAddress == address(0)) {
            // ETH tribute
            require(msg.value >= amount, "Insufficient ETH");
        } else {
            // ERC20 tribute
            IERC20 token = IERC20(tokenAddress);
            require(token.transferFrom(msg.sender, address(this), amount), "Token transfer failed");
        }

        tributeCount++;
        tributes[tributeCount] = Tribute({
            id: tributeCount,
            sender: msg.sender,
            target: target,
            targetId: targetId,
            tokenAddress: tokenAddress,
            amount: amount,
            message: message,
            timestamp: block.timestamp
        });

        userTributes[msg.sender].push(tributeCount);
        targetTributes[targetId].push(tributeCount);
        totalTributes += amount;

        emit TributeSent(tributeCount, msg.sender, target, targetId, tokenAddress, amount);
    }

    /**
     * @notice Whitelist a token
     */
    function whitelistToken(address tokenAddress, bool allowed) external onlyOwner {
        allowedTokens[tokenAddress] = allowed;
        bool exists = false;
        for (uint256 i = 0; i < tokenList.length; i++) {
            if (tokenList[i] == tokenAddress) {
                exists = true;
                break;
            }
        }
        if (!exists && allowed) {
            tokenList.push(tokenAddress);
        }
        emit TokenWhitelisted(tokenAddress, allowed);
    }

    /**
     * @notice Withdraw tributes (for target recipients)
     */
    function withdrawTributes(address tokenAddress, address to, uint256 amount) external onlyOwner {
        require(to != address(0), "Invalid address");
        
        if (tokenAddress == address(0)) {
            require(address(this).balance >= amount, "Insufficient balance");
            payable(to).transfer(amount);
        } else {
            IERC20 token = IERC20(tokenAddress);
            require(token.transfer(to, amount), "Token transfer failed");
        }
    }

    /**
     * @notice Get tribute details
     */
    function getTribute(uint256 tributeId) external view returns (Tribute memory) {
        return tributes[tributeId];
    }

    /**
     * @notice Get user's tributes
     */
    function getUserTributes(address user) external view returns (uint256[] memory) {
        return userTributes[user];
    }

    /**
     * @notice Get tributes for a target
     */
    function getTargetTributes(string memory targetId) external view returns (uint256[] memory) {
        return targetTributes[targetId];
    }

    /**
     * @notice Get whitelisted tokens
     */
    function getWhitelistedTokens() external view returns (address[] memory) {
        return tokenList;
    }
}

