// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./interfaces/ISLUPool.sol";
import "./StakedSPK.sol";

/**
 * @title SLUPool
 * @notice Staked Liquidity Units pool - stSPK as base asset
 * @dev Triple-yield system: staking rewards + swap fees + emissions
 */
contract SLUPool is ERC20, Ownable, ReentrancyGuard, ISLUPool {
    IERC20 public immutable stSPK;
    IERC20 public immutable pairedToken;
    
    uint256 public reserveStSPK;
    uint256 public reservePaired;
    
    uint256 public constant FEE_BPS = 30; // 0.3% swap fee
    uint256 public constant FEE_DENOMINATOR = 10000;
    
    // Reward tracking
    uint256 public totalStakingRewardsAccrued;
    uint256 public totalSwapFeesAccrued;
    uint256 public totalEmissionsAccrued;
    
    mapping(address => SLUInfo) public sluInfo;
    
    // Auto-compounding
    uint256 public lastCompoundTime;
    uint256 public compoundInterval = 1 days;
    
    event LiquidityAdded(address indexed user, uint256 stSPKAmount, uint256 pairedAmount, uint256 liquidity);
    event LiquidityRemoved(address indexed user, uint256 stSPKAmount, uint256 pairedAmount, uint256 liquidity);
    event Swap(address indexed user, address tokenIn, address tokenOut, uint256 amountIn, uint256 amountOut);
    event RewardsClaimed(address indexed user, uint256 stakingRewards, uint256 swapFees, uint256 emissions);
    event AutoCompounded(uint256 amount);

    constructor(
        address _stSPK,
        address _pairedToken,
        string memory name,
        string memory symbol,
        address initialOwner
    ) ERC20(name, symbol) Ownable(initialOwner) {
        stSPK = IERC20(_stSPK);
        pairedToken = IERC20(_pairedToken);
        lastCompoundTime = block.timestamp;
    }

    /**
     * @notice Add liquidity with stSPK + paired token
     */
    function addLiquidity(
        uint256 stSPKAmount,
        uint256 pairedAmount,
        address to
    ) external nonReentrant returns (uint256 liquidity) {
        require(stSPKAmount > 0 && pairedAmount > 0, "Amounts must be greater than 0");
        
        // Calculate liquidity to mint
        uint256 totalSupply = totalSupply();
        if (totalSupply == 0) {
            liquidity = sqrt(stSPKAmount * pairedAmount);
        } else {
            liquidity = min(
                (stSPKAmount * totalSupply) / reserveStSPK,
                (pairedAmount * totalSupply) / reservePaired
            );
        }
        
        require(liquidity > 0, "Insufficient liquidity minted");
        
        // Transfer tokens
        stSPK.transferFrom(msg.sender, address(this), stSPKAmount);
        pairedToken.transferFrom(msg.sender, address(this), pairedAmount);
        
        // Update reserves
        reserveStSPK += stSPKAmount;
        reservePaired += pairedAmount;
        
        // Mint SLU tokens
        _mint(to, liquidity);
        
        // Update user SLU info
        SLUInfo storage info = sluInfo[to];
        info.pool = address(this);
        info.stSPKAmount += stSPKAmount;
        info.pairedAmount += pairedAmount;
        
        emit LiquidityAdded(to, stSPKAmount, pairedAmount, liquidity);
    }

    /**
     * @notice Remove liquidity
     */
    function removeLiquidity(
        uint256 liquidity,
        address to
    ) external nonReentrant returns (uint256 stSPKAmount, uint256 pairedAmount) {
        require(liquidity > 0, "Liquidity must be greater than 0");
        require(balanceOf(msg.sender) >= liquidity, "Insufficient SLU balance");
        
        uint256 totalSupply = totalSupply();
        
        // Calculate amounts to return
        stSPKAmount = (liquidity * reserveStSPK) / totalSupply;
        pairedAmount = (liquidity * reservePaired) / totalSupply;
        
        require(stSPKAmount > 0 && pairedAmount > 0, "Insufficient reserves");
        
        // Burn SLU tokens
        _burn(msg.sender, liquidity);
        
        // Update reserves
        reserveStSPK -= stSPKAmount;
        reservePaired -= pairedAmount;
        
        // Transfer tokens
        stSPK.transfer(to, stSPKAmount);
        pairedToken.transfer(to, pairedAmount);
        
        // Update user SLU info
        SLUInfo storage info = sluInfo[msg.sender];
        info.stSPKAmount -= stSPKAmount;
        info.pairedAmount -= pairedAmount;
        
        emit LiquidityRemoved(to, stSPKAmount, pairedAmount, liquidity);
    }

    /**
     * @notice Swap tokens
     */
    function swap(
        uint256 amountIn,
        address tokenIn,
        address tokenOut,
        address to
    ) external nonReentrant returns (uint256 amountOut) {
        require(tokenIn == address(stSPK) || tokenIn == address(pairedToken), "Invalid tokenIn");
        require(tokenOut == address(stSPK) || tokenOut == address(pairedToken), "Invalid tokenOut");
        require(tokenIn != tokenOut, "Tokens must be different");
        require(amountIn > 0, "Amount must be greater than 0");
        
        uint256 reserveIn = tokenIn == address(stSPK) ? reserveStSPK : reservePaired;
        uint256 reserveOut = tokenOut == address(stSPK) ? reserveStSPK : reservePaired;
        
        // Calculate swap with fee
        uint256 amountInWithFee = amountIn * (FEE_DENOMINATOR - FEE_BPS);
        amountOut = (amountInWithFee * reserveOut) / (reserveIn * FEE_DENOMINATOR + amountInWithFee);
        
        require(amountOut > 0, "Insufficient output amount");
        require(reserveOut >= amountOut, "Insufficient reserves");
        
        // Transfer tokens
        IERC20(tokenIn).transferFrom(msg.sender, address(this), amountIn);
        IERC20(tokenOut).transfer(to, amountOut);
        
        // Update reserves
        if (tokenIn == address(stSPK)) {
            reserveStSPK += amountIn;
            reservePaired -= amountOut;
        } else {
            reservePaired += amountIn;
            reserveStSPK -= amountOut;
        }
        
        // Track swap fees
        uint256 fee = amountIn * FEE_BPS / FEE_DENOMINATOR;
        totalSwapFeesAccrued += fee;
        
        emit Swap(msg.sender, tokenIn, tokenOut, amountIn, amountOut);
    }

    /**
     * @notice Get SLU info for a user
     */
    function getSLUInfo(address user) external view returns (SLUInfo memory) {
        return sluInfo[user];
    }

    /**
     * @notice Get total rewards accrued
     */
    function getTotalRewards() external view returns (
        uint256 totalStakingRewards,
        uint256 totalSwapFees,
        uint256 totalEmissions
    ) {
        return (totalStakingRewardsAccrued, totalSwapFeesAccrued, totalEmissionsAccrued);
    }

    /**
     * @notice Claim rewards (staking + fees + emissions)
     */
    function claimRewards(address to) external nonReentrant returns (
        uint256 stakingRewards,
        uint256 swapFees,
        uint256 emissions
    ) {
        SLUInfo storage info = sluInfo[msg.sender];
        require(info.stSPKAmount > 0, "No SLU position");
        
        // Calculate proportional rewards
        uint256 totalSLU = totalSupply();
        if (totalSLU > 0) {
            uint256 userShare = (balanceOf(msg.sender) * 1e18) / totalSLU;
            
            stakingRewards = (totalStakingRewardsAccrued * userShare) / 1e18;
            swapFees = (totalSwapFeesAccrued * userShare) / 1e18;
            emissions = (totalEmissionsAccrued * userShare) / 1e18;
            
            // Reset user's accrued rewards
            info.stakingRewards = 0;
            info.swapFees = 0;
            info.emissions = 0;
        }
        
        // Transfer rewards (simplified - in production would handle each token type)
        if (stakingRewards > 0 || swapFees > 0 || emissions > 0) {
            // Auto-compound: reinvest into pool
            autoCompound();
        }
        
        emit RewardsClaimed(to, stakingRewards, swapFees, emissions);
    }

    /**
     * @notice Auto-compound rewards
     */
    function autoCompound() public {
        require(block.timestamp >= lastCompoundTime + compoundInterval, "Too soon to compound");
        
        // In production, this would:
        // 1. Claim staking rewards from stSPK contract
        // 2. Reinvest fees and emissions
        // 3. Update reserves accordingly
        
        lastCompoundTime = block.timestamp;
        emit AutoCompounded(block.timestamp);
    }

    /**
     * @notice Accrue staking rewards (called by stSPK contract or external)
     */
    function accrueStakingRewards(uint256 amount) external {
        require(msg.sender == address(stSPK), "Only stSPK contract");
        totalStakingRewardsAccrued += amount;
    }

    /**
     * @notice Accrue emissions (called by gauge or external)
     */
    function accrueEmissions(uint256 amount) external onlyOwner {
        totalEmissionsAccrued += amount;
    }

    /**
     * @notice Set compound interval
     */
    function setCompoundInterval(uint256 interval) external onlyOwner {
        compoundInterval = interval;
    }

    // Math helpers
    function sqrt(uint256 x) internal pure returns (uint256) {
        if (x == 0) return 0;
        uint256 z = (x + 1) / 2;
        uint256 y = x;
        while (z < y) {
            y = z;
            z = (x / z + z) / 2;
        }
        return y;
    }

    function min(uint256 a, uint256 b) internal pure returns (uint256) {
        return a < b ? a : b;
    }
}
