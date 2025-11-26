// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * Data Integrity Registry
 * Stores data hashes on Base blockchain for immutable audit trails
 * Batches multiple hashes into Merkle roots for gas efficiency
 */
contract DataIntegrityRegistry {
    struct DataHash {
        bytes32 hash;
        uint256 timestamp;
        string dataType; // e.g., "market-data", "threat", "audit"
        address submitter;
    }

    struct Batch {
        bytes32 merkleRoot;
        uint256 timestamp;
        uint256 hashCount;
        string batchId;
    }

    // Mapping: hash => DataHash
    mapping(bytes32 => DataHash) public dataHashes;

    // Mapping: batchId => Batch
    mapping(string => Batch) public batches;

    // Array of all batch IDs
    string[] public batchIds;

    // Events
    event DataHashRecorded(
        bytes32 indexed hash,
        string dataType,
        address indexed submitter,
        uint256 timestamp
    );

    event BatchRecorded(
        string indexed batchId,
        bytes32 indexed merkleRoot,
        uint256 hashCount,
        uint256 timestamp
    );

    /**
     * Record a single data hash
     */
    function recordHash(
        bytes32 hash,
        string memory dataType
    ) public {
        require(dataHashes[hash].timestamp == 0, "Hash already recorded");

        dataHashes[hash] = DataHash({
            hash: hash,
            timestamp: block.timestamp,
            dataType: dataType,
            submitter: msg.sender
        });

        emit DataHashRecorded(hash, dataType, msg.sender, block.timestamp);
    }

    /**
     * Record a batch of hashes as a Merkle root
     */
    function recordBatch(
        string memory batchId,
        bytes32 merkleRoot,
        uint256 hashCount
    ) public {
        require(batches[batchId].timestamp == 0, "Batch ID already used");

        batches[batchId] = Batch({
            merkleRoot: merkleRoot,
            timestamp: block.timestamp,
            hashCount: hashCount,
            batchId: batchId
        });

        batchIds.push(batchId);

        emit BatchRecorded(batchId, merkleRoot, hashCount, block.timestamp);
    }

    /**
     * Check if a hash exists
     */
    function hashExists(bytes32 hash) public view returns (bool) {
        return dataHashes[hash].timestamp > 0;
    }

    /**
     * Get data hash info
     */
    function getHash(bytes32 hash) public view returns (DataHash memory) {
        return dataHashes[hash];
    }

    /**
     * Get batch info
     */
    function getBatch(string memory batchId) public view returns (Batch memory) {
        return batches[batchId];
    }

    /**
     * Get total number of batches
     */
    function getBatchCount() public view returns (uint256) {
        return batchIds.length;
    }

    /**
     * Get batch ID by index
     */
    function getBatchId(uint256 index) public view returns (string memory) {
        require(index < batchIds.length, "Index out of bounds");
        return batchIds[index];
    }
}

