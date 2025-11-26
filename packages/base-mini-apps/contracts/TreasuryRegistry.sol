// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/**
 * @title TreasuryRegistry
 * @notice Registry for DreamNet treasury operations
 * Tracks deposits, withdrawals, budgets, and treasury activity
 */
contract TreasuryRegistry is Ownable {
    mapping(uint256 => Transaction) public transactions;
    mapping(string => Budget) public budgets; // department => budget
    uint256 private _transactionCounter;
    uint256 public totalDeposits;
    uint256 public totalWithdrawals;

    struct Transaction {
        uint256 id;
        address from;
        address to;
        uint256 amount;
        string category; // e.g., "deposit", "withdrawal", "transfer"
        string department; // e.g., "wolf-pack", "whale-pack"
        string description;
        uint256 timestamp;
    }

    struct Budget {
        string department;
        uint256 allocated;
        uint256 spent;
        uint256 remaining;
    }

    event Deposit(
        uint256 indexed transactionId,
        address indexed from,
        uint256 amount,
        string department
    );
    event Withdrawal(
        uint256 indexed transactionId,
        address indexed to,
        uint256 amount,
        string department
    );
    event BudgetAllocated(string department, uint256 amount);
    event BudgetSpent(string department, uint256 amount, uint256 remaining);

    constructor() Ownable(msg.sender) {}

    /**
     * @notice Record a deposit
     */
    function recordDeposit(
        address from,
        uint256 amount,
        string memory department,
        string memory description
    ) public onlyOwner returns (uint256) {
        uint256 id = _transactionCounter;
        _transactionCounter++;

        transactions[id] = Transaction({
            id: id,
            from: from,
            to: address(this),
            amount: amount,
            category: "deposit",
            department: department,
            description: description,
            timestamp: block.timestamp
        });

        totalDeposits += amount;
        emit Deposit(id, from, amount, department);
        return id;
    }

    /**
     * @notice Record a withdrawal
     */
    function recordWithdrawal(
        address to,
        uint256 amount,
        string memory department,
        string memory description
    ) public onlyOwner returns (uint256) {
        require(amount <= address(this).balance, "Insufficient balance");

        uint256 id = _transactionCounter;
        _transactionCounter++;

        transactions[id] = Transaction({
            id: id,
            from: address(this),
            to: to,
            amount: amount,
            category: "withdrawal",
            department: department,
            description: description,
            timestamp: block.timestamp
        });

        totalWithdrawals += amount;
        emit Withdrawal(id, to, amount, department);
        return id;
    }

    /**
     * @notice Allocate budget to a department
     */
    function allocateBudget(
        string memory department,
        uint256 amount
    ) public onlyOwner {
        Budget storage budget = budgets[department];
        budget.department = department;
        budget.allocated += amount;
        budget.remaining += amount;
        emit BudgetAllocated(department, amount);
    }

    /**
     * @notice Record budget spending
     */
    function recordSpending(
        string memory department,
        uint256 amount
    ) public onlyOwner {
        Budget storage budget = budgets[department];
        require(budget.remaining >= amount, "Insufficient budget");
        
        budget.spent += amount;
        budget.remaining -= amount;
        emit BudgetSpent(department, amount, budget.remaining);
    }

    /**
     * @notice Get a transaction by ID
     */
    function getTransaction(uint256 transactionId) public view returns (Transaction memory) {
        return transactions[transactionId];
    }

    /**
     * @notice Get budget for a department
     */
    function getBudget(string memory department) public view returns (Budget memory) {
        return budgets[department];
    }

    /**
     * @notice Receive ETH
     */
    receive() external payable {
        recordDeposit(msg.sender, msg.value, "general", "ETH deposit");
    }
}

