export const subscriptionHubAbi = [
  "function nextPlanId() view returns (uint256)",
  "function plans(uint256) view returns (uint256 id, address creator, address paymentToken, uint256 price, uint64 interval, uint256 badgeId, string name, string description, string badgeURI, bool active, uint64 createdAt)",
  "function createPlan(string name, string description, address paymentToken, uint256 price, uint64 interval, string badgeURI) returns (uint256)",
  "function updatePlan(uint256 planId, uint256 newPrice, uint64 newInterval, bool active)",
  "function subscribe(uint256 planId)",
  "function cancel(uint256 planId)",
  "function isActive(uint256 planId, address user) view returns (bool)",
  "function subscriptionInfo(uint256 planId, address user) view returns (uint64 startedAt, uint64 expiresAt, bool active)",
];

export const subscriptionBadgeAbi = [
  "function balanceOf(address account, uint256 id) view returns (uint256)",
];

export const erc20Abi = [
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)",
  "function allowance(address owner, address spender) view returns (uint256)",
  "function approve(address spender, uint256 amount) returns (bool)",
];
