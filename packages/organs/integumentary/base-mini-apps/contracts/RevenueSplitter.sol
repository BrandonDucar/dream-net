// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * Revenue Splitter
 * Simple pull-based revenue distribution
 */
contract RevenueSplitter is Ownable, ReentrancyGuard {
    mapping(address => uint256) public shares;
    mapping(address => uint256) public totalReleased;
    address[] public payees;
    uint256 public totalShares;
    uint256 public totalReleasedAmount;

    event PayeeAdded(address indexed payee, uint256 shares);
    event PaymentReleased(address indexed to, uint256 amount);
    event PaymentReceived(address indexed from, uint256 amount);

    constructor() Ownable(msg.sender) {}

    receive() external payable {
        emit PaymentReceived(msg.sender, msg.value);
    }

    function addPayee(address payee, uint256 _shares) public onlyOwner {
        require(payee != address(0), "Invalid payee");
        require(_shares > 0, "Shares must be > 0");
        require(shares[payee] == 0, "Payee already exists");

        payees.push(payee);
        shares[payee] = _shares;
        totalShares += _shares;

        emit PayeeAdded(payee, _shares);
    }

    function release(address payee) public nonReentrant {
        require(shares[payee] > 0, "Payee has no shares");

        uint256 totalReceived = address(this).balance + totalReleasedAmount;
        uint256 payment = (totalReceived * shares[payee]) / totalShares - totalReleased[payee];

        require(payment > 0, "No payment due");

        totalReleased[payee] += payment;
        totalReleasedAmount += payment;

        (bool success, ) = payable(payee).call{value: payment}("");
        require(success, "Transfer failed");

        emit PaymentReleased(payee, payment);
    }

    function releaseAll() public {
        for (uint256 i = 0; i < payees.length; i++) {
            release(payees[i]);
        }
    }

    function getPayees() public view returns (address[] memory) {
        return payees;
    }

    function pendingPayment(address payee) public view returns (uint256) {
        if (shares[payee] == 0) return 0;

        uint256 totalReceived = address(this).balance + totalReleasedAmount;
        uint256 payment = (totalReceived * shares[payee]) / totalShares - totalReleased[payee];
        return payment;
    }
}

