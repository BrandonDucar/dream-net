import { BaseMiniApp, MiniAppManifest } from "../types";
import { MiniAppStore } from "../store/miniAppStore";

let appCounter = 0;
function nextAppId() {
  appCounter += 1;
  return `miniapp:${Date.now()}:${appCounter}`;
}

/**
 * Create a Base mini-app
 */
export function createMiniApp(
  name: string,
  description: string,
  category: BaseMiniApp["category"],
  options?: {
    features?: string[];
    requiresPassport?: boolean;
    passportTier?: string[];
    integratesWith?: string[];
    iconUrl?: string;
    colorScheme?: { primary: string; secondary: string };
  }
): BaseMiniApp {
  const now = Date.now();
  const app: BaseMiniApp = {
    id: nextAppId(),
    name,
    description,
    category,
    status: "draft",
    chainId: 8453, // Base mainnet
    features: options?.features || [],
    requiresPassport: options?.requiresPassport || false,
    passportTier: options?.passportTier,
    integratesWith: options?.integratesWith || [],
    iconUrl: options?.iconUrl,
    colorScheme: options?.colorScheme,
    createdAt: now,
    updatedAt: now,
  };

  MiniAppStore.addMiniApp(app);
  console.log(`[MiniAppFactory] Created mini-app: ${name} (${category})`);
  return app;
}

/**
 * Deploy a mini-app (simulated - in production would deploy contract)
 */
export function deployMiniApp(
  appId: string,
  contractAddress: string,
  deploymentTx: string
): boolean {
  const app = MiniAppStore.getMiniApp(appId);
  if (!app) return false;

  app.contractAddress = contractAddress;
  app.deploymentTx = deploymentTx;
  app.status = "deployed";
  app.deployedAt = Date.now();

  MiniAppStore.updateMiniApp(appId, app);
  console.log(`[MiniAppFactory] Deployed mini-app ${app.name} at ${contractAddress}`);
  return true;
}

/**
 * Create default mini-apps
 */
export function createDefaultMiniApps(): BaseMiniApp[] {
  const apps: BaseMiniApp[] = [];

  // 1. Dream State Passport Mint
  apps.push(createMiniApp(
    "Dream Passport Mint",
    "Mint your Dream State passport NFT on Base",
    "identity",
    {
      features: ["minting", "passport", "onchain-identity"],
      requiresPassport: false,
      integratesWith: ["dream-state"],
      colorScheme: { primary: "#0052FF", secondary: "#00D4FF" },
    }
  ));

  // 2. Dream State Governance
  apps.push(createMiniApp(
    "Dream State Governance",
    "Vote on proposals and participate in Dream State governance",
    "governance",
    {
      features: ["voting", "proposals", "governance"],
      requiresPassport: true,
      passportTier: ["citizen", "operator", "architect", "founder"],
      integratesWith: ["dream-state"],
      colorScheme: { primary: "#FF6B35", secondary: "#F7931E" },
    }
  ));

  // 3. API Keeper Dashboard
  apps.push(createMiniApp(
    "API Keeper Dashboard",
    "Manage API keys, monitor costs, and configure rail guards",
    "utility",
    {
      features: ["api-management", "cost-tracking", "key-management"],
      requiresPassport: true,
      passportTier: ["operator", "architect", "founder"],
      integratesWith: ["api-keeper"],
      colorScheme: { primary: "#8B5CF6", secondary: "#A78BFA" },
    }
  ));

  // 4. Wolf Pack Funding Portal
  apps.push(createMiniApp(
    "Wolf Pack Funding Portal",
    "View funding leads, track outreach, and manage grants",
    "commerce",
    {
      features: ["funding", "leads", "grants"],
      requiresPassport: true,
      passportTier: ["citizen", "operator", "architect", "founder"],
      integratesWith: ["wolf-pack"],
      colorScheme: { primary: "#10B981", secondary: "#34D399" },
    }
  ));

  // 5. DreamNet Social Hub
  apps.push(createMiniApp(
    "DreamNet Social Hub",
    "Connect with other Dream State citizens and share dreams",
    "social",
    {
      features: ["social", "messaging", "profiles"],
      requiresPassport: true,
      passportTier: ["dreamer", "citizen", "operator", "architect", "founder"],
      integratesWith: ["orca-pack", "social-hub"],
      colorScheme: { primary: "#EC4899", secondary: "#F472B6" },
    }
  ));

  // 6. Whale Pack Commerce
  apps.push(createMiniApp(
    "Whale Pack Commerce",
    "TikTok Shop integration and commerce analytics",
    "commerce",
    {
      features: ["commerce", "analytics", "tiktok"],
      requiresPassport: true,
      passportTier: ["citizen", "operator", "architect", "founder"],
      integratesWith: ["whale-pack"],
      colorScheme: { primary: "#000000", secondary: "#FF0050" },
    }
  ));

  // 7. DreamNet Treasury
  apps.push(createMiniApp(
    "DreamNet Treasury",
    "View Dream State treasury, budgets, and economic activity",
    "defi",
    {
      features: ["treasury", "budget", "economics"],
      requiresPassport: true,
      passportTier: ["operator", "architect", "founder"],
      integratesWith: ["economic-engine", "dream-state"],
      colorScheme: { primary: "#F59E0B", secondary: "#FBBF24" },
    }
  ));

  // 8. Shield Status Monitor
  apps.push(createMiniApp(
    "Shield Status Monitor",
    "Monitor DreamNet's multi-layer shield system and threat detection",
    "utility",
    {
      features: ["security", "monitoring", "threats"],
      requiresPassport: true,
      passportTier: ["operator", "architect", "founder"],
      integratesWith: ["shield-core"],
      colorScheme: { primary: "#EF4444", secondary: "#F87171" },
    }
  ));

  return apps;
}

