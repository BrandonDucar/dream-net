// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * DreamNet Operator Registry (DIN Registry)
 * 
 * On-chain registry for node operators with staking and slashing
 * Inspired by DIN's EigenLayer model
 */
contract DINRegistry is Ownable, ReentrancyGuard {
    struct OperatorInfo {
        address operator;
        uint256 stakedAmount;
        uint256 performanceScore; // 0-100
        bool active;
        uint256 registeredAt;
        uint256 lastPerformanceCheck;
    }

    mapping(address => OperatorInfo) public operators;
    mapping(address => bool) public isOperator;
    address[] public operatorList;
    
    uint256 public minStake = 1 ether; // Minimum stake required
    uint256 public totalStaked;
    
    address public performanceMonitor; // Address authorized to update performance scores
    address public governance; // Address authorized to slash
    
    event OperatorRegistered(address indexed operator, uint256 stake);
    event StakeDeposited(address indexed operator, uint256 amount);
    event StakeWithdrawn(address indexed operator, uint256 amount);
    event OperatorSlashed(address indexed operator, uint256 amount, string reason);
    event PerformanceScoreUpdated(address indexed operator, uint256 score);
    event OperatorDeactivated(address indexed operator);
    
    modifier onlyOperator() {
        require(isOperator[msg.sender], "Not a registered operator");
        _;
    }
    
    modifier onlyPerformanceMonitor() {
        require(msg.sender == performanceMonitor || msg.sender == owner(), "Not authorized");
        _;
    }
    
    modifier onlyGovernance() {
        require(msg.sender == governance || msg.sender == owner(), "Not authorized");
        _;
    }
    
    constructor(address _governance) Ownable(msg.sender) {
        governance = _governance;
        performanceMonitor = msg.sender; // Owner is initial performance monitor
    }
    
    /**
     * Register as a node operator
     */
    function registerOperator() external payable nonReentrant {
        require(!isOperator[msg.sender], "Already registered");
        require(msg.value >= minStake, "Stake below minimum");
        
        operators[msg.sender] = OperatorInfo({
            operator: msg.sender,
            stakedAmount: msg.value,
            performanceScore: 100, // Start at 100
            active: true,
            registeredAt: block.timestamp,
            lastPerformanceCheck: block.timestamp
        });
        
        isOperator[msg.sender] = true;
        operatorList.push(msg.sender);
        totalStaked += msg.value;
        
        emit OperatorRegistered(msg.sender, msg.value);
    }
    
    /**
     * Stake additional ETH
     */
    function stake() external payable onlyOperator nonReentrant {
        require(msg.value > 0, "Must stake something");
        
        operators[msg.sender].stakedAmount += msg.value;
        totalStaked += msg.value;
        
        emit StakeDeposited(msg.sender, msg.value);
    }
    
    /**
     * Unstake ETH
     */
    function unstake(uint256 amount) external onlyOperator nonReentrant {
        require(amount > 0, "Amount must be > 0");
        require(amount <= operators[msg.sender].stakedAmount, "Insufficient stake");
        
        operators[msg.sender].stakedAmount -= amount;
        totalStaked -= amount;
        
        // Transfer ETH back to operator
        (bool success, ) = msg.sender.call{value: amount}("");
        require(success, "Transfer failed");
        
        emit StakeWithdrawn(msg.sender, amount);
    }
    
    /**
     * Slash operator stake (governance only)
     */
    function slash(
        address operator,
        uint256 amount,
        string memory reason
    ) external onlyGovernance nonReentrant {
        require(isOperator[operator], "Not an operator");
        require(amount > 0, "Amount must be > 0");
        require(amount <= operators[operator].stakedAmount, "Amount exceeds stake");
        
        operators[operator].stakedAmount -= amount;
        totalStaked -= amount;
        
        // Slashed funds go to governance (can be changed to burn or treasury)
        (bool success, ) = governance.call{value: amount}("");
        require(success, "Transfer failed");
        
        emit OperatorSlashed(operator, amount, reason);
        
        // Deactivate if stake falls below minimum
        if (operators[operator].stakedAmount < minStake) {
            operators[operator].active = false;
            emit OperatorDeactivated(operator);
        }
    }
    
    /**
     * Update performance score (performance monitor only)
     */
    function updatePerformanceScore(
        address operator,
        uint256 score
    ) external onlyPerformanceMonitor {
        require(isOperator[operator], "Not an operator");
        require(score <= 100, "Score must be <= 100");
        
        operators[operator].performanceScore = score;
        operators[operator].lastPerformanceCheck = block.timestamp;
        
        // Deactivate if performance score drops too low
        if (score < 50) {
            operators[operator].active = false;
            emit OperatorDeactivated(operator);
        }
        
        emit PerformanceScoreUpdated(operator, score);
    }
    
    /**
     * Get operator info
     */
    function getOperator(address operator) external view returns (OperatorInfo memory) {
        return operators[operator];
    }
    
    /**
     * Get all operators
     */
    function getAllOperators() external view returns (address[] memory) {
        return operatorList;
    }
    
    /**
     * Set performance monitor address
     */
    function setPerformanceMonitor(address _monitor) external onlyOwner {
        performanceMonitor = _monitor;
    }
    
    /**
     * Set governance address
     */
    function setGovernance(address _governance) external onlyOwner {
        governance = _governance;
    }
    
    /**
     * Set minimum stake
     */
    function setMinStake(uint256 _minStake) external onlyOwner {
        minStake = _minStake;
    }
}

