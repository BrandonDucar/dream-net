// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "./SLUPool.sol";

/**
 * @title SLUWrapper
 * @notice Wraps SLU tokens for compatibility with Aerodrome/Uniswap
 * @dev Maintains staking rewards while wrapped
 */
contract SLUWrapper is ERC20, Ownable, ReentrancyGuard {
    SLUPool public immutable sluPool;
    
    mapping(address => uint256) public wrappedBalance;
    
    event Wrapped(address indexed user, uint256 sluAmount, uint256 wrappedAmount);
    event Unwrapped(address indexed user, uint256 wrappedAmount, uint256 sluAmount);

    constructor(
        address _sluPool,
        string memory name,
        string memory symbol,
        address initialOwner
    ) ERC20(name, symbol) Ownable(initialOwner) {
        sluPool = SLUPool(_sluPool);
    }

    /**
     * @notice Wrap SLU tokens for use in external DeFi protocols
     */
    function wrap(uint256 sluAmount) external nonReentrant returns (uint256 wrappedAmount) {
        require(sluAmount > 0, "Amount must be greater than 0");
        require(sluPool.balanceOf(msg.sender) >= sluAmount, "Insufficient SLU balance");
        
        // Transfer SLU tokens to wrapper
        sluPool.transferFrom(msg.sender, address(this), sluAmount);
        
        // Mint wrapped tokens (1:1 ratio, maintains rewards)
        wrappedAmount = sluAmount;
        _mint(msg.sender, wrappedAmount);
        wrappedBalance[msg.sender] += wrappedAmount;
        
        emit Wrapped(msg.sender, sluAmount, wrappedAmount);
    }

    /**
     * @notice Unwrap tokens back to SLU
     */
    function unwrap(uint256 wrappedAmount) external nonReentrant returns (uint256 sluAmount) {
        require(wrappedAmount > 0, "Amount must be greater than 0");
        require(balanceOf(msg.sender) >= wrappedAmount, "Insufficient wrapped balance");
        
        // Burn wrapped tokens
        _burn(msg.sender, wrappedAmount);
        wrappedBalance[msg.sender] -= wrappedAmount;
        
        // Transfer SLU tokens back
        sluAmount = wrappedAmount;
        sluPool.transfer(msg.sender, sluAmount);
        
        emit Unwrapped(msg.sender, wrappedAmount, sluAmount);
    }

    /**
     * @notice Claim rewards from underlying SLU pool (maintains rewards while wrapped)
     */
    function claimRewards(address to) external {
        require(wrappedBalance[msg.sender] > 0, "No wrapped position");
        
        // Claim rewards from underlying pool
        sluPool.claimRewards(to);
    }
}

