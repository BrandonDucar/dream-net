// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title ISLUPool
 * @notice Interface for Staked Liquidity Units (SLU) pools
 */
interface ISLUPool {
    struct SLUInfo {
        address pool;           // Which pool this SLU belongs to
        uint256 stSPKAmount;    // Amount of stSPK in this SLU
        uint256 pairedAmount;   // Amount of paired token
        uint256 stakingRewards; // Accrued staking rewards
        uint256 swapFees;       // Accrued swap fees
        uint256 emissions;      // Accrued emissions
    }

    function addLiquidity(
        uint256 stSPKAmount,
        uint256 pairedAmount,
        address to
    ) external returns (uint256 liquidity);

    function removeLiquidity(
        uint256 liquidity,
        address to
    ) external returns (uint256 stSPKAmount, uint256 pairedAmount);

    function swap(
        uint256 amountIn,
        address tokenIn,
        address tokenOut,
        address to
    ) external returns (uint256 amountOut);

    function getSLUInfo(address user) external view returns (SLUInfo memory);

    function getTotalRewards() external view returns (
        uint256 totalStakingRewards,
        uint256 totalSwapFees,
        uint256 totalEmissions
    );

    function claimRewards(address to) external returns (
        uint256 stakingRewards,
        uint256 swapFees,
        uint256 emissions
    );

    function autoCompound() external;
}

