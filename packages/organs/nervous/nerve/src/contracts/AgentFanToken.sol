
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title AgentFanToken
 * @dev Governance token for a specific DreamNet Agent.
 * Fans buy this to vote on the Agent's "Next Research Topic" or "Risk Profile".
 */
contract AgentFanToken is ERC20, Ownable {
    string public agentId;

    constructor(
        string memory name, 
        string memory symbol, 
        string memory _agentId, 
        address initialOwner
    ) ERC20(name, symbol) Ownable(initialOwner) {
        agentId = _agentId;
        _mint(initialOwner, 1000000 * 10 ** decimals()); // 1 Million Tokens
    }

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }
}
