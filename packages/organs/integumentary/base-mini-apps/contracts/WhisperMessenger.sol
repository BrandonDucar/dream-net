// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * Whisper Messenger
 * Hash-based encrypted message registry
 */
contract WhisperMessenger {
    mapping(bytes32 => MessageData) public messages;
    mapping(address => bytes32[]) public userMessages;

    struct MessageData {
        bytes32 contentHash;
        address from;
        address to;
        uint256 timestamp;
        bool isUnlocked;
    }

    event WhisperSent(
        bytes32 indexed messageId,
        address indexed from,
        address indexed to,
        bytes32 contentHash
    );

    event WhisperUnlocked(
        bytes32 indexed messageId,
        address indexed by
    );

    function sendWhisper(
        bytes32 messageId,
        bytes32 contentHash,
        address to
    ) public {
        require(messages[messageId].timestamp == 0, "Message ID already used");

        messages[messageId] = MessageData({
            contentHash: contentHash,
            from: msg.sender,
            to: to,
            timestamp: block.timestamp,
            isUnlocked: false
        });

        userMessages[msg.sender].push(messageId);
        if (to != address(0)) {
            userMessages[to].push(messageId);
        }

        emit WhisperSent(messageId, msg.sender, to, contentHash);
    }

    function unlockWhisper(bytes32 messageId) public {
        MessageData storage message = messages[messageId];
        require(message.timestamp > 0, "Message does not exist");
        require(message.to == msg.sender || message.from == msg.sender, "Not authorized");
        require(!message.isUnlocked, "Already unlocked");

        message.isUnlocked = true;
        emit WhisperUnlocked(messageId, msg.sender);
    }

    function getMessage(bytes32 messageId) public view returns (MessageData memory) {
        return messages[messageId];
    }

    function getUserMessages(address user) public view returns (bytes32[] memory) {
        return userMessages[user];
    }
}

