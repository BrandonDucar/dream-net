export interface MiniApp {
  id: string;
  name: string;
  description: string;
  category: "identity" | "vault" | "bounty" | "remix" | "governance" | "analytics" | "creative" | "other";
  status: "alpha" | "beta" | "stable" | "coming-soon";
  pricingHint?: string;
  route: string;
  icon?: string;
}

export const mockApps: MiniApp[] = [
  {
    id: "passport",
    name: "Passport",
    description: "Identity and authentication system",
    category: "identity",
    status: "stable",
    pricingHint: "Free",
    route: "/hub/apps/passport",
  },
  {
    id: "vault",
    name: "Vault",
    description: "Secure storage for dreams and assets",
    category: "vault",
    status: "stable",
    pricingHint: "0.1 DREAM per storage",
    route: "/hub/apps/vault",
  },
  {
    id: "bounty",
    name: "Bounty",
    description: "Task and bounty management system",
    category: "bounty",
    status: "beta",
    pricingHint: "Variable",
    route: "/hub/apps/bounty",
  },
  {
    id: "remix",
    name: "Remix",
    description: "Dream remixing and evolution",
    category: "remix",
    status: "stable",
    pricingHint: "0.5 DREAM per remix",
    route: "/hub/apps/remix",
  },
  {
    id: "explorer",
    name: "Explorer",
    description: "Network exploration and discovery",
    category: "analytics",
    status: "beta",
    pricingHint: "Free",
    route: "/hub/apps/explorer",
  },
  {
    id: "governance",
    name: "Governance",
    description: "DAO management and voting",
    category: "governance",
    status: "alpha",
    pricingHint: "Stake required",
    route: "/hub/apps/governance",
  },
  {
    id: "dreamscope",
    name: "DreamScope",
    description: "Advanced dream analytics and insights",
    category: "analytics",
    status: "beta",
    pricingHint: "1 DREAM per analysis",
    route: "/hub/apps/dreamscope",
  },
  {
    id: "onboarding",
    name: "Onboarding",
    description: "Creator onboarding and setup",
    category: "identity",
    status: "stable",
    pricingHint: "Free",
    route: "/hub/apps/onboarding",
  },
  {
    id: "card-forge-pro",
    name: "Card Forge Pro",
    description: "AI-powered card creation and NFT minting on Base",
    category: "creative",
    status: "beta",
    pricingHint: "Free (NFT minting costs gas)",
    route: "/hub/apps/card-forge-pro",
  },
];

