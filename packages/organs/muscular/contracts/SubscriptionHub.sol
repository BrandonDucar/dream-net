// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

import "./SubscriptionBadge.sol";

interface IERC20Minimal {
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
    function approve(address spender, uint256 amount) external returns (bool);
    function allowance(address owner, address spender) external view returns (uint256);
}

library SafeERC20Minimal {
    function safeTransferFrom(IERC20Minimal token, address from, address to, uint256 amount) internal {
        _callOptionalReturn(token, abi.encodeWithSelector(token.transferFrom.selector, from, to, amount));
    }

    function safeApprove(IERC20Minimal token, address spender, uint256 amount) internal {
        _callOptionalReturn(token, abi.encodeWithSelector(token.approve.selector, spender, amount));
    }

    function _callOptionalReturn(IERC20Minimal token, bytes memory data) private {
        (bool success, bytes memory returndata) = address(token).call(data);
        require(success, "SafeERC20: call failed");

        if (returndata.length > 0) {
            require(abi.decode(returndata, (bool)), "SafeERC20: operation did not succeed");
        }
    }
}

abstract contract ReentrancyGuardMinimal {
    uint256 private constant _NOT_ENTERED = 1;
    uint256 private constant _ENTERED = 2;
    uint256 private _status;

    constructor() {
        _status = _NOT_ENTERED;
    }

    modifier nonReentrant() {
        require(_status != _ENTERED, "ReentrancyGuard: reentrant call");
        _status = _ENTERED;
        _;
        _status = _NOT_ENTERED;
    }
}

/**
 * @title SubscriptionHub
 * @dev Manages creator subscription plans and NFT badge issuance
 */
contract SubscriptionHub is Ownable, ReentrancyGuardMinimal {
    using SafeERC20Minimal for IERC20Minimal;

    struct Plan {
        uint256 id;
        address creator;
        address paymentToken;
        uint256 price;
        uint64 interval; // seconds
        uint256 badgeId;
        string name;
        string description;
        string badgeURI;
        bool active;
        uint64 createdAt;
    }

    struct Subscription {
        uint64 startedAt;
        uint64 expiresAt;
        bool active;
    }

    uint256 public nextPlanId = 1;
    SubscriptionBadge public immutable badgeContract;

    // planId => Plan
    mapping(uint256 => Plan) public plans;
    // planId => subscriber => Subscription
    mapping(uint256 => mapping(address => Subscription)) public subscriptions;

    event PlanCreated(
        uint256 indexed planId,
        address indexed creator,
        address paymentToken,
        uint256 price,
        uint64 interval,
        uint256 badgeId,
        string name,
        string badgeURI
    );
    event PlanUpdated(uint256 indexed planId, uint256 price, uint64 interval, bool active);
    event SubscriptionActivated(uint256 indexed planId, address indexed subscriber, uint64 expiresAt);
    event SubscriptionCancelled(uint256 indexed planId, address indexed subscriber);

    constructor(SubscriptionBadge badge, address initialOwner) Ownable(initialOwner) {
        badgeContract = badge;
    }

    /**
     * @dev Create a new subscription plan
     */
    function createPlan(
        string calldata name,
        string calldata description,
        address paymentToken,
        uint256 price,
        uint64 interval,
        string calldata badgeURI
    ) external returns (uint256 planId) {
        require(price > 0, "SubscriptionHub: price must be > 0");
        require(interval >= 1 days, "SubscriptionHub: interval too short");
        require(paymentToken != address(0), "SubscriptionHub: invalid token");

        planId = nextPlanId++;
        uint256 badgeId = planId;

        plans[planId] = Plan({
            id: planId,
            creator: msg.sender,
            paymentToken: paymentToken,
            price: price,
            interval: interval,
            badgeId: badgeId,
            name: name,
            description: description,
            badgeURI: badgeURI,
            active: true,
            createdAt: uint64(block.timestamp)
        });

        // Set badge URI and ensure hub can mint badges
        badgeContract.setTokenURI(badgeId, badgeURI);

        emit PlanCreated(planId, msg.sender, paymentToken, price, interval, badgeId, name, badgeURI);
    }

    /**
     * @dev Update plan pricing and interval
     */
    function updatePlan(
        uint256 planId,
        uint256 newPrice,
        uint64 newInterval,
        bool active
    ) external {
        Plan storage plan = plans[planId];
        require(plan.creator != address(0), "SubscriptionHub: plan not found");
        require(plan.creator == msg.sender, "SubscriptionHub: not plan creator");
        require(newPrice > 0, "SubscriptionHub: invalid price");
        require(newInterval >= 1 days, "SubscriptionHub: interval too short");

        plan.price = newPrice;
        plan.interval = newInterval;
        plan.active = active;

        emit PlanUpdated(planId, newPrice, newInterval, active);
    }

    /**
     * @dev Subscribe or renew subscription
     */
    function subscribe(uint256 planId) external nonReentrant {
        Plan storage plan = plans[planId];
        require(plan.creator != address(0) && plan.active, "SubscriptionHub: inactive plan");

        IERC20Minimal(plan.paymentToken).safeTransferFrom(msg.sender, plan.creator, plan.price);

        Subscription storage sub = subscriptions[planId][msg.sender];
        uint64 start = sub.active ? sub.startedAt : uint64(block.timestamp);
        uint64 currentExpiry = sub.active && sub.expiresAt > block.timestamp
            ? sub.expiresAt
            : uint64(block.timestamp);
        uint64 newExpiry = currentExpiry + plan.interval;

        sub.startedAt = start;
        sub.expiresAt = newExpiry;
        sub.active = true;

        // Mint badge to subscriber
        badgeContract.mint(msg.sender, plan.badgeId);

        emit SubscriptionActivated(planId, msg.sender, newExpiry);
    }

    /**
     * @dev Cancel subscription (badge burned)
     */
    function cancel(uint256 planId) external nonReentrant {
        Subscription storage sub = subscriptions[planId][msg.sender];
        require(sub.active, "SubscriptionHub: no active subscription");

        sub.active = false;
        sub.expiresAt = uint64(block.timestamp);

        Plan storage plan = plans[planId];
        badgeContract.burn(msg.sender, plan.badgeId);

        emit SubscriptionCancelled(planId, msg.sender);
    }

    /**
     * @dev Check subscription status
     */
    function isActive(uint256 planId, address user) external view returns (bool) {
        Subscription memory sub = subscriptions[planId][user];
        return sub.active && sub.expiresAt > block.timestamp;
    }

    function subscriptionInfo(uint256 planId, address user)
        external
        view
        returns (Subscription memory)
    {
        return subscriptions[planId][user];
    }

    /**
     * @dev Allow owner to update badge URI if metadata changes
     */
    function updateBadgeURI(uint256 planId, string calldata newUri) external {
        Plan storage plan = plans[planId];
        require(plan.creator != address(0), "SubscriptionHub: plan not found");
        require(plan.creator == msg.sender || msg.sender == owner(), "SubscriptionHub: not authorized");

        plan.badgeURI = newUri;
        badgeContract.setTokenURI(plan.badgeId, newUri);
    }
}
