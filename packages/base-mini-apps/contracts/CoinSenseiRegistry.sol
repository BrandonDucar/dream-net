// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title CoinSenseiRegistry
 * @notice Registry for CoinSensei portfolio analytics and holdings
 * Tracks portfolios, holdings, performance, and analytics
 */
contract CoinSenseiRegistry is Ownable {
    mapping(address => Portfolio) public portfolios;
    mapping(address => mapping(address => Holding)) public holdings; // user => token => holding
    mapping(address => address[]) public userTokens; // user => tokens[]

    struct Portfolio {
        address owner;
        uint256 totalValue; // In USD (scaled by 1e18)
        uint256 totalPnl; // Profit/Loss
        uint256 lastUpdated;
        bool isActive;
    }

    struct Holding {
        address token;
        uint256 balance;
        uint256 value; // In USD (scaled by 1e18)
        uint256 avgBuyPrice;
        uint256 pnl; // Profit/Loss
        uint256 lastUpdated;
    }

    event PortfolioCreated(address indexed owner);
    event HoldingUpdated(
        address indexed owner,
        address indexed token,
        uint256 balance,
        uint256 value
    );
    event PortfolioValueUpdated(
        address indexed owner,
        uint256 totalValue,
        uint256 totalPnl
    );

    constructor() Ownable(msg.sender) {}

    /**
     * @notice Create or update a portfolio
     */
    function createPortfolio() public {
        Portfolio storage portfolio = portfolios[msg.sender];
        if (portfolio.lastUpdated == 0) {
            portfolio.owner = msg.sender;
            portfolio.isActive = true;
            emit PortfolioCreated(msg.sender);
        }
        portfolio.lastUpdated = block.timestamp;
    }

    /**
     * @notice Update a holding
     */
    function updateHolding(
        address token,
        uint256 balance,
        uint256 value,
        uint256 avgBuyPrice,
        uint256 pnl
    ) public {
        createPortfolio(); // Ensure portfolio exists

        Holding storage holding = holdings[msg.sender][token];
        if (holding.lastUpdated == 0) {
            // New holding
            userTokens[msg.sender].push(token);
        }

        holding.token = token;
        holding.balance = balance;
        holding.value = value;
        holding.avgBuyPrice = avgBuyPrice;
        holding.pnl = pnl;
        holding.lastUpdated = block.timestamp;

        emit HoldingUpdated(msg.sender, token, balance, value);

        // Update portfolio totals
        _updatePortfolioValue(msg.sender);
    }

    /**
     * @notice Update portfolio total value
     */
    function _updatePortfolioValue(address user) internal {
        Portfolio storage portfolio = portfolios[user];
        address[] memory tokens = userTokens[user];
        
        uint256 totalValue = 0;
        uint256 totalPnl = 0;

        for (uint256 i = 0; i < tokens.length; i++) {
            Holding storage holding = holdings[user][tokens[i]];
            if (holding.lastUpdated > 0) {
                totalValue += holding.value;
                totalPnl += holding.pnl;
            }
        }

        portfolio.totalValue = totalValue;
        portfolio.totalPnl = totalPnl;
        portfolio.lastUpdated = block.timestamp;

        emit PortfolioValueUpdated(user, totalValue, totalPnl);
    }

    /**
     * @notice Get portfolio for a user
     */
    function getPortfolio(address user) public view returns (Portfolio memory) {
        return portfolios[user];
    }

    /**
     * @notice Get holding for a user and token
     */
    function getHolding(address user, address token) public view returns (Holding memory) {
        return holdings[user][token];
    }

    /**
     * @notice Get all tokens for a user
     */
    function getUserTokens(address user) public view returns (address[] memory) {
        return userTokens[user];
    }

    /**
     * @notice Batch update holdings (owner only, for efficiency)
     */
    function batchUpdateHoldings(
        address user,
        address[] memory tokens,
        uint256[] memory balances,
        uint256[] memory values,
        uint256[] memory avgBuyPrices,
        uint256[] memory pnls
    ) public onlyOwner {
        require(
            tokens.length == balances.length &&
            tokens.length == values.length &&
            tokens.length == avgBuyPrices.length &&
            tokens.length == pnls.length,
            "Array length mismatch"
        );

        for (uint256 i = 0; i < tokens.length; i++) {
            updateHolding(tokens[i], balances[i], values[i], avgBuyPrices[i], pnls[i]);
        }
    }
}

