// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title InboxSquaredRegistry
 * @notice Registry for Inbox² email communications and threads
 * Tracks emails, threads, status, and communication history
 */
contract InboxSquaredRegistry is Ownable {
    mapping(uint256 => EmailThread) public threads;
    mapping(address => uint256[]) public userThreads;
    mapping(uint256 => Message[]) public threadMessages;
    uint256 private _threadCounter;

    struct EmailThread {
        uint256 id;
        address owner;
        string subject;
        string fromAddress;
        string toAddress;
        uint256 status; // 0 = unread, 1 = read, 2 = replied, 3 = archived
        uint256 createdAt;
        uint256 lastUpdated;
        bool isActive;
    }

    struct Message {
        uint256 threadId;
        string content;
        string sender;
        uint256 timestamp;
        bool isAI; // AI-generated response
    }

    event ThreadCreated(
        uint256 indexed threadId,
        address indexed owner,
        string subject
    );
    event MessageAdded(
        uint256 indexed threadId,
        string sender,
        bool isAI
    );
    event ThreadStatusUpdated(uint256 indexed threadId, uint256 status);

    constructor() Ownable(msg.sender) {}

    /**
     * @notice Create a new email thread
     */
    function createThread(
        string memory subject,
        string memory fromAddress,
        string memory toAddress
    ) public returns (uint256) {
        uint256 id = _threadCounter;
        _threadCounter++;

        threads[id] = EmailThread({
            id: id,
            owner: msg.sender,
            subject: subject,
            fromAddress: fromAddress,
            toAddress: toAddress,
            status: 0, // unread
            createdAt: block.timestamp,
            lastUpdated: block.timestamp,
            isActive: true
        });

        userThreads[msg.sender].push(id);
        emit ThreadCreated(id, msg.sender, subject);
        return id;
    }

    /**
     * @notice Add a message to a thread
     */
    function addMessage(
        uint256 threadId,
        string memory content,
        string memory sender,
        bool isAI
    ) public {
        EmailThread storage thread = threads[threadId];
        require(thread.createdAt > 0, "Thread not found");
        require(thread.isActive, "Thread not active");
        require(
            msg.sender == thread.owner || msg.sender == owner(),
            "Not authorized"
        );

        threadMessages[threadId].push(Message({
            threadId: threadId,
            content: content,
            sender: sender,
            timestamp: block.timestamp,
            isAI: isAI
        }));

        thread.lastUpdated = block.timestamp;
        if (thread.status == 0) {
            thread.status = 1; // mark as read
        }

        emit MessageAdded(threadId, sender, isAI);
    }

    /**
     * @notice Update thread status
     */
    function updateThreadStatus(uint256 threadId, uint256 status) public {
        EmailThread storage thread = threads[threadId];
        require(thread.createdAt > 0, "Thread not found");
        require(msg.sender == thread.owner, "Not authorized");
        require(status <= 3, "Invalid status");

        thread.status = status;
        emit ThreadStatusUpdated(threadId, status);
    }

    /**
     * @notice Get a thread by ID
     */
    function getThread(uint256 threadId) public view returns (EmailThread memory) {
        return threads[threadId];
    }

    /**
     * @notice Get all messages in a thread
     */
    function getThreadMessages(uint256 threadId) public view returns (Message[] memory) {
        return threadMessages[threadId];
    }

    /**
     * @notice Get all threads by a user
     */
    function getUserThreads(address user) public view returns (uint256[] memory) {
        return userThreads[user];
    }
}

