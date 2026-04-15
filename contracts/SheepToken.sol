// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title SheepToken
 * @dev ERC20 token for DreamNet ecosystem rewards
 * Name: Sheep Token
 * Symbol: SHEEP
 * Decimals: 18
 * Total Supply: 1,000,000,000 SHEEP
 */
contract SheepToken is ERC20, Ownable {
    uint256 public constant MAX_SUPPLY = 1_000_000_000 * 10**18; // 1 billion tokens
    
    constructor(address initialOwner) ERC20("Sheep Token", "SHEEP") Ownable(initialOwner) {
        // Mint total supply to deployer
        _mint(initialOwner, MAX_SUPPLY);
    }
    
    /**
     * @dev Mint tokens (only owner, for future rewards)
     * Note: This requires increasing MAX_SUPPLY or implementing a different mechanism
     */
    function mint(address to, uint256 amount) public onlyOwner {
        require(totalSupply() + amount <= MAX_SUPPLY, "SheepToken: Exceeds max supply");
        _mint(to, amount);
    }
    
    /**
     * @dev Burn tokens
     */
    function burn(uint256 amount) public {
        _burn(msg.sender, amount);
    }
}

