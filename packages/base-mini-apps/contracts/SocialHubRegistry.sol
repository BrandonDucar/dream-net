// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title SocialHubRegistry
 * @notice Registry for DreamNet social network features
 * Tracks posts, connections, interactions, and social activity
 */
contract SocialHubRegistry is Ownable {
    mapping(uint256 => Post) public posts;
    mapping(address => uint256[]) public userPosts;
    mapping(address => address[]) public connections; // user => connected users
    mapping(address => mapping(address => bool)) public isConnected; // user => user => connected
    uint256 private _postCounter;

    struct Post {
        uint256 id;
        address author;
        string content;
        uint256 timestamp;
        uint256 likes;
        uint256 shares;
        bool isActive;
        string[] tags;
    }

    event PostCreated(uint256 indexed id, address indexed author, string content);
    event PostLiked(uint256 indexed postId, address indexed liker);
    event PostShared(uint256 indexed postId, address indexed sharer);
    event ConnectionMade(address indexed user1, address indexed user2);
    event PostUpdated(uint256 indexed postId, address indexed author);

    constructor() Ownable(msg.sender) {}

    /**
     * @notice Create a new social post
     */
    function createPost(
        string memory content,
        string[] memory tags
    ) public returns (uint256) {
        uint256 id = _postCounter;
        _postCounter++;

        posts[id] = Post({
            id: id,
            author: msg.sender,
            content: content,
            timestamp: block.timestamp,
            likes: 0,
            shares: 0,
            isActive: true,
            tags: tags
        });

        userPosts[msg.sender].push(id);
        emit PostCreated(id, msg.sender, content);
        return id;
    }

    /**
     * @notice Like a post
     */
    function likePost(uint256 postId) public {
        Post storage post = posts[postId];
        require(post.timestamp > 0, "Post not found");
        require(post.isActive, "Post not active");
        post.likes++;
        emit PostLiked(postId, msg.sender);
    }

    /**
     * @notice Share a post
     */
    function sharePost(uint256 postId) public {
        Post storage post = posts[postId];
        require(post.timestamp > 0, "Post not found");
        require(post.isActive, "Post not active");
        post.shares++;
        emit PostShared(postId, msg.sender);
    }

    /**
     * @notice Connect two users
     */
    function connect(address user) public {
        require(user != msg.sender, "Cannot connect to self");
        require(!isConnected[msg.sender][user], "Already connected");
        
        connections[msg.sender].push(user);
        connections[user].push(msg.sender);
        isConnected[msg.sender][user] = true;
        isConnected[user][msg.sender] = true;
        
        emit ConnectionMade(msg.sender, user);
    }

    /**
     * @notice Get a post by ID
     */
    function getPost(uint256 postId) public view returns (Post memory) {
        return posts[postId];
    }

    /**
     * @notice Get all posts by a user
     */
    function getUserPosts(address user) public view returns (uint256[] memory) {
        return userPosts[user];
    }

    /**
     * @notice Get connections for a user
     */
    function getConnections(address user) public view returns (address[] memory) {
        return connections[user];
    }
}

