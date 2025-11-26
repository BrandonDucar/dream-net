// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title X402TransactionRegistry
 * @notice On-chain registry for X402 transactions
 * Stores transaction history for transparency and verification
 */
contract X402TransactionRegistry is Ownable {
    mapping(uint256 => Transaction) public transactions;
    mapping(address => uint256[]) public userTransactions; // user => transaction IDs
    mapping(string => uint256) public txHashToId; // txHash => transaction ID
    uint256 private _transactionCounter;

    struct Transaction {
        uint256 id;
        address from;
        address to;
        string amount; // X402 amount as string
        string chain; // "base", "bsc", "ethereum", "solana"
        uint256 timestamp;
        string txHash;
        string serviceId; // Optional service ID
        bool isBridge; // Is this a bridge transaction?
        string bridgeFrom; // Source chain for bridges
        string bridgeTo; // Destination chain for bridges
    }

    event TransactionRecorded(
        uint256 indexed id,
        address indexed from,
        address indexed to,
        string amount,
        string chain,
        string txHash
    );
    event BridgeTransactionRecorded(
        uint256 indexed id,
        address indexed from,
        string amount,
        string fromChain,
        string toChain,
        string txHash
    );

    constructor() Ownable(msg.sender) {}

    /**
     * @notice Record a standard X402 payment transaction
     */
    function recordTransaction(
        address from,
        address to,
        string memory amount,
        string memory chain,
        string memory txHash,
        string memory serviceId
    ) public returns (uint256) {
        require(from != address(0) && to != address(0), "Invalid addresses");
        require(bytes(txHash).length > 0, "Invalid tx hash");

        // Check if transaction already recorded
        require(txHashToId[txHash] == 0, "Transaction already recorded");

        uint256 id = _transactionCounter;
        _transactionCounter++;

        transactions[id] = Transaction({
            id: id,
            from: from,
            to: to,
            amount: amount,
            chain: chain,
            timestamp: block.timestamp,
            txHash: txHash,
            serviceId: serviceId,
            isBridge: false,
            bridgeFrom: "",
            bridgeTo: ""
        });

        txHashToId[txHash] = id;
        userTransactions[from].push(id);
        userTransactions[to].push(id);

        emit TransactionRecorded(id, from, to, amount, chain, txHash);
        return id;
    }

    /**
     * @notice Record a bridge transaction
     */
    function recordBridgeTransaction(
        address from,
        string memory amount,
        string memory fromChain,
        string memory toChain,
        string memory txHash
    ) public returns (uint256) {
        require(from != address(0), "Invalid address");
        require(bytes(txHash).length > 0, "Invalid tx hash");
        require(txHashToId[txHash] == 0, "Transaction already recorded");

        uint256 id = _transactionCounter;
        _transactionCounter++;

        transactions[id] = Transaction({
            id: id,
            from: from,
            to: from, // Bridge: from and to are same user
            amount: amount,
            chain: toChain, // Destination chain
            timestamp: block.timestamp,
            txHash: txHash,
            serviceId: "",
            isBridge: true,
            bridgeFrom: fromChain,
            bridgeTo: toChain
        });

        txHashToId[txHash] = id;
        userTransactions[from].push(id);

        emit BridgeTransactionRecorded(id, from, amount, fromChain, toChain, txHash);
        return id;
    }

    /**
     * @notice Get transaction by ID
     */
    function getTransaction(uint256 transactionId) public view returns (Transaction memory) {
        return transactions[transactionId];
    }

    /**
     * @notice Get all transactions for a user
     */
    function getUserTransactions(address user) public view returns (uint256[] memory) {
        return userTransactions[user];
    }

    /**
     * @notice Get transaction by tx hash
     */
    function getTransactionByHash(string memory txHash) public view returns (Transaction memory) {
        uint256 id = txHashToId[txHash];
        require(id > 0 || transactions[0].id == 0, "Transaction not found");
        return transactions[id];
    }

    /**
     * @notice Get transaction count
     */
    function getTransactionCount() public view returns (uint256) {
        return _transactionCounter;
    }
}

