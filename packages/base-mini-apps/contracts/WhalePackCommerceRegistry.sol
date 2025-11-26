// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title WhalePackCommerceRegistry
 * @notice Registry for Whale Pack commerce transactions and products
 * Tracks products, sales, orders, and commerce activity
 */
contract WhalePackCommerceRegistry is Ownable {
    mapping(uint256 => Product) public products;
    mapping(uint256 => Order) public orders;
    mapping(address => uint256[]) public userOrders;
    uint256 private _productCounter;
    uint256 private _orderCounter;

    struct Product {
        uint256 id;
        string name;
        string description;
        uint256 price;
        address seller;
        bool isActive;
        uint256 stock;
        uint256 createdAt;
    }

    struct Order {
        uint256 id;
        uint256 productId;
        address buyer;
        uint256 quantity;
        uint256 totalPrice;
        uint256 status; // 0 = pending, 1 = confirmed, 2 = shipped, 3 = delivered, 4 = cancelled
        uint256 createdAt;
    }

    event ProductCreated(
        uint256 indexed id,
        address indexed seller,
        string name,
        uint256 price
    );
    event OrderPlaced(
        uint256 indexed orderId,
        uint256 indexed productId,
        address indexed buyer,
        uint256 quantity
    );
    event OrderStatusUpdated(uint256 indexed orderId, uint256 status);

    constructor() Ownable(msg.sender) {}

    /**
     * @notice Create a new product
     */
    function createProduct(
        string memory name,
        string memory description,
        uint256 price,
        uint256 stock
    ) public returns (uint256) {
        uint256 id = _productCounter;
        _productCounter++;

        products[id] = Product({
            id: id,
            name: name,
            description: description,
            price: price,
            seller: msg.sender,
            isActive: true,
            stock: stock,
            createdAt: block.timestamp
        });

        emit ProductCreated(id, msg.sender, name, price);
        return id;
    }

    /**
     * @notice Place an order
     */
    function placeOrder(
        uint256 productId,
        uint256 quantity
    ) public returns (uint256) {
        Product storage product = products[productId];
        require(product.createdAt > 0, "Product not found");
        require(product.isActive, "Product not active");
        require(product.stock >= quantity, "Insufficient stock");

        product.stock -= quantity;

        uint256 id = _orderCounter;
        _orderCounter++;

        orders[id] = Order({
            id: id,
            productId: productId,
            buyer: msg.sender,
            quantity: quantity,
            totalPrice: product.price * quantity,
            status: 0, // pending
            createdAt: block.timestamp
        });

        userOrders[msg.sender].push(id);
        emit OrderPlaced(id, productId, msg.sender, quantity);
        return id;
    }

    /**
     * @notice Update order status (seller or owner)
     */
    function updateOrderStatus(uint256 orderId, uint256 status) public {
        Order storage order = orders[orderId];
        require(order.createdAt > 0, "Order not found");
        
        Product storage product = products[order.productId];
        require(
            msg.sender == product.seller || msg.sender == owner(),
            "Not authorized"
        );
        require(status <= 4, "Invalid status");

        order.status = status;
        emit OrderStatusUpdated(orderId, status);
    }

    /**
     * @notice Get a product by ID
     */
    function getProduct(uint256 productId) public view returns (Product memory) {
        return products[productId];
    }

    /**
     * @notice Get an order by ID
     */
    function getOrder(uint256 orderId) public view returns (Order memory) {
        return orders[orderId];
    }

    /**
     * @notice Get all orders by a user
     */
    function getUserOrders(address user) public view returns (uint256[] memory) {
        return userOrders[user];
    }
}

