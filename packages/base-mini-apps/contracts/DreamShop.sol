// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/**
 * @title DreamShop
 * @notice On-chain storefront for DreamNet mini-apps
 * Supports NFT and token purchases
 */
contract DreamShop is Ownable, ReentrancyGuard {
    struct ShopItem {
        uint256 id;
        string name;
        string description;
        uint256 price;
        address tokenAddress; // address(0) for ETH, else ERC20
        bool isNFT;
        address nftContract; // If isNFT, the NFT contract address
        uint256 nftTokenId; // If isNFT, the specific token ID
        bool active;
        uint256 supply;
        uint256 sold;
    }

    mapping(uint256 => ShopItem) public items;
    mapping(address => mapping(uint256 => bool)) public purchases; // user => itemId => purchased
    uint256 public itemCount;
    uint256 public totalRevenue;

    event ItemCreated(uint256 indexed itemId, string name, uint256 price);
    event ItemPurchased(address indexed buyer, uint256 indexed itemId, uint256 price);
    event ItemUpdated(uint256 indexed itemId, bool active);

    constructor(address initialOwner) Ownable(initialOwner) {}

    /**
     * @notice Create a new shop item
     */
    function createItem(
        string memory name,
        string memory description,
        uint256 price,
        address tokenAddress,
        bool isNFT,
        address nftContract,
        uint256 nftTokenId,
        uint256 supply
    ) external onlyOwner returns (uint256) {
        itemCount++;
        items[itemCount] = ShopItem({
            id: itemCount,
            name: name,
            description: description,
            price: price,
            tokenAddress: tokenAddress,
            isNFT: isNFT,
            nftContract: nftContract,
            nftTokenId: nftTokenId,
            active: true,
            supply: supply,
            sold: 0
        });

        emit ItemCreated(itemCount, name, price);
        return itemCount;
    }

    /**
     * @notice Purchase an item
     */
    function purchaseItem(uint256 itemId) external payable nonReentrant {
        ShopItem storage item = items[itemId];
        require(item.active, "Item not active");
        require(item.sold < item.supply, "Item sold out");
        require(!purchases[msg.sender][itemId], "Already purchased");

        if (item.tokenAddress == address(0)) {
            // ETH payment
            require(msg.value >= item.price, "Insufficient payment");
            totalRevenue += msg.value;
        } else {
            // ERC20 payment
            IERC20 token = IERC20(item.tokenAddress);
            require(token.transferFrom(msg.sender, address(this), item.price), "Token transfer failed");
            totalRevenue += item.price;
        }

        purchases[msg.sender][itemId] = true;
        item.sold++;

        emit ItemPurchased(msg.sender, itemId, item.price);
    }

    /**
     * @notice Update item status
     */
    function updateItemStatus(uint256 itemId, bool active) external onlyOwner {
        items[itemId].active = active;
        emit ItemUpdated(itemId, active);
    }

    /**
     * @notice Withdraw revenue
     */
    function withdraw(address payable to, uint256 amount) external onlyOwner {
        require(to != address(0), "Invalid address");
        require(address(this).balance >= amount, "Insufficient balance");
        to.transfer(amount);
    }

    /**
     * @notice Withdraw ERC20 tokens
     */
    function withdrawToken(address tokenAddress, address to, uint256 amount) external onlyOwner {
        IERC20 token = IERC20(tokenAddress);
        require(token.transfer(to, amount), "Token transfer failed");
    }

    /**
     * @notice Get item details
     */
    function getItem(uint256 itemId) external view returns (ShopItem memory) {
        return items[itemId];
    }

    /**
     * @notice Check if user purchased item
     */
    function hasPurchased(address user, uint256 itemId) external view returns (bool) {
        return purchases[user][itemId];
    }
}

