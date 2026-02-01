// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * Dream DNA Sequencer
 * Analyze and store dream "genetic code" - patterns, emotions, themes
 */
contract DreamDNASequencer {
    mapping(bytes32 => DreamDNA) public dreamDNAs;
    mapping(bytes32 => bytes32[]) public similarDreams; // DNA hash => similar dream hashes
    mapping(address => bytes32[]) public userDreamDNAs;

    struct DreamDNA {
        bytes32 dreamHash;
        bytes32 dnaHash; // Unique DNA identifier
        address sequencer; // Who sequenced this dream
        uint256[] traits; // Array of trait values (emotions, themes, patterns)
        uint256 sequencedAt;
        string metadata; // JSON string with detailed analysis
    }

    event DreamSequenced(
        bytes32 indexed dreamHash,
        bytes32 indexed dnaHash,
        address indexed sequencer,
        uint256[] traits
    );

    event SimilarityFound(
        bytes32 indexed dnaHash1,
        bytes32 indexed dnaHash2,
        uint256 similarityScore
    );

    /**
     * Sequence a dream - create its DNA
     * traits array should contain normalized values (0-10000 for percentages)
     */
    function sequenceDream(
        bytes32 dreamHash,
        uint256[] memory traits,
        string memory metadata
    ) public returns (bytes32) {
        require(traits.length > 0, "Traits required");
        require(dreamDNAs[dreamHash].sequencedAt == 0, "Dream already sequenced");

        // Generate DNA hash from dream hash + traits
        bytes32 dnaHash = keccak256(abi.encodePacked(dreamHash, traits, block.timestamp));

        dreamDNAs[dreamHash] = DreamDNA({
            dreamHash: dreamHash,
            dnaHash: dnaHash,
            sequencer: msg.sender,
            traits: traits,
            sequencedAt: block.timestamp,
            metadata: metadata
        });

        userDreamDNAs[msg.sender].push(dreamHash);
        emit DreamSequenced(dreamHash, dnaHash, msg.sender, traits);
        return dnaHash;
    }

    /**
     * Calculate similarity between two dreams
     * Returns similarity score (0-10000, where 10000 = 100% similar)
     */
    function calculateSimilarity(
        bytes32 dreamHash1,
        bytes32 dreamHash2
    ) public view returns (uint256) {
        DreamDNA memory dna1 = dreamDNAs[dreamHash1];
        DreamDNA memory dna2 = dreamDNAs[dreamHash2];
        
        require(dna1.sequencedAt > 0, "Dream 1 not sequenced");
        require(dna2.sequencedAt > 0, "Dream 2 not sequenced");
        require(dna1.traits.length == dna2.traits.length, "Trait count mismatch");

        uint256 totalDiff = 0;
        uint256 maxDiff = dna1.traits.length * 10000; // Max possible difference

        for (uint256 i = 0; i < dna1.traits.length; i++) {
            uint256 diff = dna1.traits[i] > dna2.traits[i] 
                ? dna1.traits[i] - dna2.traits[i]
                : dna2.traits[i] - dna1.traits[i];
            totalDiff += diff;
        }

        // Similarity = inverse of difference (scaled to 0-10000)
        uint256 similarity = 10000 - ((totalDiff * 10000) / maxDiff);
        return similarity;
    }

    /**
     * Record similarity between two dreams
     */
    function recordSimilarity(
        bytes32 dreamHash1,
        bytes32 dreamHash2,
        uint256 minSimilarityScore
    ) public {
        uint256 similarity = calculateSimilarity(dreamHash1, dreamHash2);
        require(similarity >= minSimilarityScore, "Similarity too low");

        DreamDNA memory dna1 = dreamDNAs[dreamHash1];
        DreamDNA memory dna2 = dreamDNAs[dreamHash2];

        // Add to similarity mappings
        bool found1 = false;
        bool found2 = false;
        
        for (uint256 i = 0; i < similarDreams[dna1.dnaHash].length; i++) {
            if (similarDreams[dna1.dnaHash][i] == dna2.dnaHash) {
                found1 = true;
                break;
            }
        }
        if (!found1) {
            similarDreams[dna1.dnaHash].push(dna2.dnaHash);
        }

        for (uint256 i = 0; i < similarDreams[dna2.dnaHash].length; i++) {
            if (similarDreams[dna2.dnaHash][i] == dna1.dnaHash) {
                found2 = true;
                break;
            }
        }
        if (!found2) {
            similarDreams[dna2.dnaHash].push(dna1.dnaHash);
        }

        emit SimilarityFound(dna1.dnaHash, dna2.dnaHash, similarity);
    }

    function getDreamDNA(bytes32 dreamHash) public view returns (DreamDNA memory) {
        return dreamDNAs[dreamHash];
    }

    function getSimilarDreams(bytes32 dnaHash) public view returns (bytes32[] memory) {
        return similarDreams[dnaHash];
    }

    function getUserDreamDNAs(address user) public view returns (bytes32[] memory) {
        return userDreamDNAs[user];
    }
}

