// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";

/**
 * @title DreamToken
 * @dev ERC20 token for DreamNet ecosystem - the core progression/utility token
 * Name: DreamNet Token
 * Symbol: DREAM
 * Decimals: 18
 * Max Supply: 1,000,000,000 DREAM (1 billion)
 * 
 * This token represents the future on-chain version of internal DREAM balances.
 * Initially, DREAM will be distributed through the rewards engine, then users
 * can claim their internal DREAM as on-chain DREAM tokens.
 */
contract DreamToken is ERC20, ERC20Burnable, Ownable {
    uint256 public constant MAX_SUPPLY = 1_000_000_000 * 10**18; // 1 billion tokens
    
    // Minter role for rewards engine
    mapping(address => bool) public minters;
    
    event MinterAdded(address indexed minter);
    event MinterRemoved(address indexed minter);
    
    constructor(address initialOwner) ERC20("DreamNet Token", "DREAM") Ownable(initialOwner) {
        // No initial mint - tokens will be minted through rewards/claims
    }
    
    /**
     * @dev Add a minter address (e.g., rewards engine contract)
     */
    function addMinter(address minter) public onlyOwner {
        minters[minter] = true;
        emit MinterAdded(minter);
    }
    
    /**
     * @dev Remove a minter address
     */
    function removeMinter(address minter) public onlyOwner {
        minters[minter] = false;
        emit MinterRemoved(minter);
    }
    
    /**
     * @dev Mint tokens (only by authorized minters or owner)
     * Used to convert internal DREAM balances to on-chain tokens
     */
    function mint(address to, uint256 amount) public {
        require(minters[msg.sender] || msg.sender == owner(), "DreamToken: Not authorized to mint");
        require(totalSupply() + amount <= MAX_SUPPLY, "DreamToken: Exceeds max supply");
        _mint(to, amount);
    }
    
    /**
     * @dev Batch mint for multiple users (gas efficient)
     */
    function batchMint(address[] calldata recipients, uint256[] calldata amounts) public {
        require(minters[msg.sender] || msg.sender == owner(), "DreamToken: Not authorized to mint");
        require(recipients.length == amounts.length, "DreamToken: Array length mismatch");
        
        uint256 totalAmount = 0;
        for (uint256 i = 0; i < amounts.length; i++) {
            totalAmount += amounts[i];
        }
        
        require(totalSupply() + totalAmount <= MAX_SUPPLY, "DreamToken: Exceeds max supply");
        
        for (uint256 i = 0; i < recipients.length; i++) {
            _mint(recipients[i], amounts[i]);
        }
    }
}

