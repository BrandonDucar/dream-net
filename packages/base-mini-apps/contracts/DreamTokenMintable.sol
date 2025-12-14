// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * DreamNet Token (DREAM) - Mintable Version
 * 
 * This is a mintable version of DREAM token for agent distribution.
 * Only the owner can mint tokens.
 * 
 * Deploy this to replace or supplement the existing DREAM token.
 */
contract DreamTokenMintable is ERC20, Ownable {
    uint256 public constant MAX_SUPPLY = 1_000_000_000 * 10**18; // 1 billion tokens
    
    constructor(address initialOwner) ERC20("DreamNet Token", "DREAM") Ownable(initialOwner) {
        // No initial mint - mint as needed
    }
    
    /**
     * Mint tokens to an address (owner only)
     */
    function mint(address to, uint256 amount) public onlyOwner {
        require(totalSupply() + amount <= MAX_SUPPLY, "Exceeds max supply");
        _mint(to, amount);
    }
    
    /**
     * Mint tokens to multiple addresses in one transaction
     */
    function mintBatch(address[] calldata recipients, uint256[] calldata amounts) public onlyOwner {
        require(recipients.length == amounts.length, "Arrays length mismatch");
        
        uint256 totalAmount = 0;
        for (uint256 i = 0; i < amounts.length; i++) {
            totalAmount += amounts[i];
        }
        
        require(totalSupply() + totalAmount <= MAX_SUPPLY, "Exceeds max supply");
        
        for (uint256 i = 0; i < recipients.length; i++) {
            _mint(recipients[i], amounts[i]);
        }
    }
    
    /**
     * Burn tokens (anyone can burn their own tokens)
     */
    function burn(uint256 amount) public {
        _burn(msg.sender, amount);
    }
}


