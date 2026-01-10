// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/**
 * @title StakedSPK
 * @notice Receipt token representing staked SPK positions
 * @dev Auto-compounding staking mechanism for SPK token
 */
contract StakedSPK is ERC20, Ownable, ReentrancyGuard {
    IERC20 public immutable spkToken;
    
    uint256 public totalStaked;
    uint256 public rewardRate; // Rewards per second per staked token
    uint256 public lastUpdateTime;
    uint256 public rewardPerTokenStored;
    
    mapping(address => uint256) public userRewardPerTokenPaid;
    mapping(address => uint256) public rewards;
    mapping(address => uint256) public lockUntil; // Optional lock period
    
    event Staked(address indexed user, uint256 amount);
    event Unstaked(address indexed user, uint256 amount);
    event RewardClaimed(address indexed user, uint256 amount);
    event RewardsDistributed(uint256 amount);

    constructor(
        address _spkToken,
        address initialOwner
    ) ERC20("Staked SPK", "stSPK") Ownable(initialOwner) {
        spkToken = IERC20(_spkToken);
        lastUpdateTime = block.timestamp;
    }

    /**
     * @notice Stake SPK tokens and receive stSPK receipt tokens
     * @param amount Amount of SPK to stake
     * @param lockDuration Optional lock duration in seconds (0 = no lock)
     */
    function stake(uint256 amount, uint256 lockDuration) external nonReentrant {
        require(amount > 0, "Amount must be greater than 0");
        
        updateReward(msg.sender);
        
        spkToken.transferFrom(msg.sender, address(this), amount);
        totalStaked += amount;
        
        if (lockDuration > 0) {
            lockUntil[msg.sender] = block.timestamp + lockDuration;
        }
        
        _mint(msg.sender, amount);
        emit Staked(msg.sender, amount);
    }

    /**
     * @notice Unstake SPK tokens (if not locked)
     * @param amount Amount of stSPK to unstake
     */
    function unstake(uint256 amount) external nonReentrant {
        require(amount > 0, "Amount must be greater than 0");
        require(balanceOf(msg.sender) >= amount, "Insufficient stSPK balance");
        require(block.timestamp >= lockUntil[msg.sender], "Tokens are locked");
        
        updateReward(msg.sender);
        
        totalStaked -= amount;
        _burn(msg.sender, amount);
        spkToken.transfer(msg.sender, amount);
        
        emit Unstaked(msg.sender, amount);
    }

    /**
     * @notice Claim accumulated staking rewards
     */
    function claimRewards() external nonReentrant {
        updateReward(msg.sender);
        uint256 reward = rewards[msg.sender];
        
        if (reward > 0) {
            rewards[msg.sender] = 0;
            // Auto-compound: mint more stSPK instead of transferring SPK
            _mint(msg.sender, reward);
            totalStaked += reward;
            emit RewardClaimed(msg.sender, reward);
        }
    }

    /**
     * @notice Update reward calculations
     */
    function updateReward(address account) internal {
        rewardPerTokenStored = rewardPerToken();
        lastUpdateTime = block.timestamp;
        
        if (account != address(0)) {
            rewards[account] = earned(account);
            userRewardPerTokenPaid[account] = rewardPerTokenStored;
        }
    }

    /**
     * @notice Calculate current reward per token
     */
    function rewardPerToken() public view returns (uint256) {
        if (totalStaked == 0) {
            return rewardPerTokenStored;
        }
        
        uint256 timeElapsed = block.timestamp - lastUpdateTime;
        return rewardPerTokenStored + (rewardRate * timeElapsed * 1e18) / totalStaked;
    }

    /**
     * @notice Calculate earned rewards for an account
     */
    function earned(address account) public view returns (uint256) {
        return (balanceOf(account) * (rewardPerToken() - userRewardPerTokenPaid[account])) / 1e18 + rewards[account];
    }

    /**
     * @notice Set reward rate (owner only)
     */
    function setRewardRate(uint256 _rewardRate) external onlyOwner {
        updateReward(address(0));
        rewardRate = _rewardRate;
    }

    /**
     * @notice Distribute rewards (owner only)
     */
    function distributeRewards(uint256 amount) external onlyOwner {
        require(amount > 0, "Amount must be greater than 0");
        spkToken.transferFrom(msg.sender, address(this), amount);
        updateReward(address(0));
        emit RewardsDistributed(amount);
    }
}
