/**
 * Base Mini-Apps Frontend Entry Point
 * All mini-apps exported for use in Base ecosystem
 */

// Original apps
export { PassportMintApp } from './PassportMintApp';
export { GovernanceApp } from './GovernanceApp';
export { APIKeeperDashboard } from './APIKeeperDashboard';
export { APIKeeperGovernmentOffice } from './APIKeeperGovernmentOffice';
export { JaggyGovernmentOffice } from './JaggyGovernmentOffice';
export { MyceliumGovernmentOffice } from './MyceliumGovernmentOffice';
export { WolfPackPortal } from './WolfPackPortal';
export { SocialHub } from './SocialHub';
export { WhalePackCommerce } from './WhalePackCommerce';
export { Treasury } from './Treasury';
export { ShieldMonitor } from './ShieldMonitor';

// Quick win apps (no contracts)
export { DreamGalleryExplorer } from './DreamGalleryExplorer';
export { EcosystemDashboardMini } from './EcosystemDashboardMini';
export { DreamNetworkExplorer } from './DreamNetworkExplorer';
export { AgentDashboardMini } from './AgentDashboardMini';
export { BadgeBoardMini } from './BadgeBoardMini';

// Contract-based apps
export { DreamVaultMini } from './DreamVaultMini';
export { BountyBoardMini } from './BountyBoardMini';
export { DreamRemixStudio } from './DreamRemixStudio';
export { DreamRemixArena } from './DreamRemixArena';
export { WhisperMessengerApp } from './WhisperMessengerApp';
export { SeasonalEventsHub } from './SeasonalEventsHub';
export { NightmareNetwork } from './NightmareNetwork';
export { MissionCenter } from './MissionCenter';
export { RevenueSharingDashboard } from './RevenueSharingDashboard';
export { ProgressionTracker } from './ProgressionTracker';
export { DreamDriftersDAO } from './DreamDriftersDAO';
export { DreamTimeCapsuleApp } from './DreamTimeCapsuleApp';
export { DreamDNASequencerApp } from './DreamDNASequencerApp';
export { DreamPredictionMarketApp } from './DreamPredictionMarketApp';
export { DreamNetHub } from './DreamNetHub';
export { DreamNetHubWrapper } from './DreamNetHubWrapper';
export { DreamScopeOpsConsole } from './DreamScopeOpsConsole';
export { OnboardingWizard } from './OnboardingWizard';
export { CreatorStudio } from './CreatorStudio';

// Fun/Game Apps
export { JaggyStealthRun } from './JaggyStealthRun';
export { DreamDNASequencerGame } from './DreamDNASequencerGame';
export { DreamLatticeGame } from './DreamLatticeGame';
export { WormholeEscape } from './WormholeEscape';
export { DreamBetArcade } from './DreamBetArcade';
export { OctopusPatternMaster } from './OctopusPatternMaster';
export { LabubuPopSmash } from './LabubuPopSmash';
export { ReactionTestMini } from './ReactionTestMini';
export { DreamSnailDrift } from './DreamSnailDrift';
export { DreamCloudBuilder } from './DreamCloudBuilder';
export { DreamNebulaExplorer } from './DreamNebulaExplorer';

// Practical/Ops/Money Apps
export { DreamScopeOpsConsoleMini } from './DreamScopeOpsConsoleMini';
export { ShieldMonitorMini } from './ShieldMonitorMini';
export { WormholeRouterMini } from './WormholeRouterMini';
export { OnboardingWizardMini } from './OnboardingWizardMini';
export { CreatorStudioMini } from './CreatorStudioMini';
export { DreamShopMini } from './DreamShopMini';
export { TributeGateMini } from './TributeGateMini';
export { WalletScoreDashboard } from './WalletScoreDashboard';
export { SocialOpsMini } from './SocialOpsMini';
export { WolfPackFundingHUD } from './WolfPackFundingHUD';
export { InboxSquaredMini } from './InboxSquaredMini';
export { CoinSenseiMini } from './CoinSenseiMini';
export { CardForgeProMini } from './CardForgeProMini';

// X402 Mini Apps
export { X402PaymentGateway } from './X402PaymentGateway';
export { X402BalanceViewer } from './X402BalanceViewer';
export { X402ServiceMarketplace } from './X402ServiceMarketplace';
export { X402TransactionHistory } from './X402TransactionHistory';
export { X402MultiChainBridge } from './X402MultiChainBridge';

// App registry for routing
export const MINI_APPS = {
  'passport-mint': {
    component: 'PassportMintApp',
    name: 'Dream Passport Mint',
    category: 'identity',
    requiresPassport: false,
    contractAddress: '0x62805dBCc7fb37b62d9Ca92e14aFf63d1e1424CC',
    contractName: 'DreamPassport',
  },
  'governance': {
    component: 'GovernanceApp',
    name: 'Dream State Governance',
    category: 'governance',
    requiresPassport: true,
    minTier: 'citizen',
    contractAddress: '0x44a2E7ee89EEa63C6EAC6532c6B356be1655ff16',
    contractName: 'DreamGovernance',
  },
  'api-keeper': {
    component: 'APIKeeperDashboard',
    name: 'API Keeper Dashboard',
    category: 'utility',
    requiresPassport: true,
    minTier: 'operator',
    contractAddress: undefined,
  },
  'api-keeper-office': {
    component: 'APIKeeperGovernmentOffice',
    name: 'API Keeper Government Office',
    category: 'governance',
    requiresPassport: true,
    minTier: 'operator',
    contractAddress: undefined,
  },
  'jaggy-office': {
    component: 'JaggyGovernmentOffice',
    name: 'Silent Sentinel Government Office',
    category: 'governance',
    requiresPassport: true,
    minTier: 'operator',
    contractAddress: undefined,
  },
  'mycelium-office': {
    component: 'MyceliumGovernmentOffice',
    name: 'Mycelium Network Government Office',
    category: 'governance',
    requiresPassport: true,
    minTier: 'operator',
    contractAddress: undefined,
  },
  'wolf-pack': {
    component: 'WolfPackPortal',
    name: 'Wolf Pack Funding Portal',
    category: 'commerce',
    requiresPassport: true,
    minTier: 'citizen',
    contractAddress: undefined,
  },
  'social-hub': {
    component: 'SocialHub',
    name: 'DreamNet Social Hub',
    category: 'social',
    requiresPassport: true,
    minTier: 'dreamer',
    contractAddress: undefined,
  },
  'whale-pack': {
    component: 'WhalePackCommerce',
    name: 'Whale Pack Commerce',
    category: 'commerce',
    requiresPassport: true,
    minTier: 'citizen',
    contractAddress: undefined,
  },
  'treasury': {
    component: 'Treasury',
    name: 'DreamNet Treasury',
    category: 'defi',
    requiresPassport: true,
    minTier: 'operator',
    contractAddress: undefined,
  },
  'shield-monitor': {
    component: 'ShieldMonitor',
    name: 'Shield Status Monitor',
    category: 'utility',
    requiresPassport: true,
    minTier: 'operator',
    contractAddress: undefined,
  },
  // Quick win apps
  'dream-gallery': {
    component: 'DreamGalleryExplorer',
    name: 'Dream Gallery Explorer',
    category: 'exploration',
    requiresPassport: false,
    contractAddress: undefined,
  },
  'ecosystem-dashboard': {
    component: 'EcosystemDashboardMini',
    name: 'Ecosystem Dashboard',
    category: 'utility',
    requiresPassport: false,
    contractAddress: undefined,
  },
  'network-explorer': {
    component: 'DreamNetworkExplorer',
    name: 'Dream Network Explorer',
    category: 'utility',
    requiresPassport: false,
    contractAddress: undefined,
  },
  'agent-dashboard': {
    component: 'AgentDashboardMini',
    name: 'Agent Dashboard',
    category: 'utility',
    requiresPassport: false,
    contractAddress: undefined,
  },
  'badge-board': {
    component: 'BadgeBoardMini',
    name: 'Badge Board',
    category: 'social',
    requiresPassport: false,
    contractAddress: '0x6Ece1531C0547b366Fd10814Fae5963788d2c2a1',
    contractName: 'BadgeNFT',
  },
  // Contract-based apps
  'dream-vault': {
    component: 'DreamVaultMini',
    name: 'Dream Vault',
    category: 'creative',
    requiresPassport: true,
    minTier: 'dreamer',
    contractAddress: '0x832876CDAaC6e7BAd9C4B953efce19AF0D89Fbd7',
    contractName: 'DreamVault',
  },
  'bounty-board': {
    component: 'BountyBoardMini',
    name: 'Bounty Board',
    category: 'commerce',
    requiresPassport: true,
    minTier: 'citizen',
    contractAddress: '0x21c4BD450a6689353aFfB3EDCA887aa9F908Fc2c',
    contractName: 'BountyEscrow',
  },
  'dream-remix': {
    component: 'DreamRemixStudio',
    name: 'Dream Remix Studio',
    category: 'creative',
    requiresPassport: true,
    minTier: 'citizen',
    contractAddress: '0x66Ef7DDb340537E22F567D60d6c22EDA2B8c3619',
    contractName: 'DreamRemixRegistry',
  },
  'dream-remix-arena': {
    component: 'DreamRemixArena',
    name: 'Dream Remix Arena',
    category: 'gaming',
    requiresPassport: false,
    contractAddress: '0x66Ef7DDb340537E22F567D60d6c22EDA2B8c3619',
    contractName: 'DreamRemixRegistry',
  },
  'whisper-messenger': {
    component: 'WhisperMessengerApp',
    name: 'Whisper Messenger',
    category: 'social',
    requiresPassport: true,
    minTier: 'dreamer',
    contractAddress: '0x1cBf5C4AB1aa0f1D0Db0fF17f978EC1e165E1002',
    contractName: 'WhisperMessenger',
  },
  'seasonal-events': {
    component: 'SeasonalEventsHub',
    name: 'Seasonal Events Hub',
    category: 'events',
    requiresPassport: false,
    contractAddress: '0xdf30a28fA5DbF392DD76Ed761852a31F772AcC27',
    contractName: 'SeasonalEventsRegistry',
  },
  'nightmare-network': {
    component: 'NightmareNetwork',
    name: 'Nightmare Network',
    category: 'utility',
    requiresPassport: true,
    minTier: 'operator',
    contractAddress: '0x29f2E979E5E2ec0683B1D0ee660824eeb12B7AdF',
    contractName: 'NightmareRegistry',
  },
  'mission-center': {
    component: 'MissionCenter',
    name: 'Mission Center',
    category: 'utility',
    requiresPassport: true,
    minTier: 'operator',
    contractAddress: '0x73999460083aC079A199B10f1DE1f4A9cA3db837',
    contractName: 'MissionRegistry',
  },
  'revenue-sharing': {
    component: 'RevenueSharingDashboard',
    name: 'Revenue Sharing Dashboard',
    category: 'defi',
    requiresPassport: true,
    minTier: 'citizen',
    contractAddress: '0x07ed77169aD71905aF3778b42760F3269a0D0C74',
    contractName: 'RevenueSplitter',
  },
  'progression-tracker': {
    component: 'ProgressionTracker',
    name: 'Progression Tracker',
    category: 'utility',
    requiresPassport: false,
    contractAddress: '0xDa02C8383D42C9b0943d532fC9F95C27C9A8055B',
    contractName: 'ProgressionRegistry',
  },
  'dream-drifters': {
    component: 'DreamDriftersDAO',
    name: 'Dream Drifters DAO',
    category: 'governance',
    requiresPassport: true,
    minTier: 'citizen',
    contractAddress: '0x3987902f05Dfca6197D08AcB694e48BE5Df8cE65',
    contractName: 'DreamDriftersRegistry',
  },
  'time-capsule': {
    component: 'DreamTimeCapsuleApp',
    name: 'Dream Time Capsule',
    category: 'creative',
    requiresPassport: false,
    contractAddress: '0x891A71eB2D20692D22bF7106B16Ba48253826409',
    contractName: 'DreamTimeCapsule',
  },
  'dna-sequencer': {
    component: 'DreamDNASequencerApp',
    name: 'Dream DNA Sequencer',
    category: 'utility',
    requiresPassport: true,
    minTier: 'dreamer',
    contractAddress: '0xd9B140aFB0ef0b358f8342fe6381f6589d450A87',
    contractName: 'DreamDNASequencer',
  },
  'prediction-market': {
    component: 'DreamPredictionMarketApp',
    name: 'Dream Prediction Market',
    category: 'defi',
    requiresPassport: true,
    minTier: 'citizen',
    contractAddress: '0x036b043Ebb894f16639452fC35B7C379bbD05593',
    contractName: 'DreamPredictionMarket',
  },
  'dreamscope-ops': {
    component: 'DreamScopeOpsConsole',
    name: 'DreamScope Ops Console',
    category: 'ops',
    requiresPassport: false,
    contractAddress: undefined,
  },
  'onboarding': {
    component: 'OnboardingWizard',
    name: 'Onboarding Wizard',
    category: 'onboarding',
    requiresPassport: false,
    contractAddress: undefined,
  },
  'creator-studio': {
    component: 'CreatorStudio',
    name: 'Creator Studio',
    category: 'creative',
    requiresPassport: false,
    contractAddress: undefined,
  },
  // Fun/Game Apps (all use GameRegistry and GameAchievementNFT)
  'jaggy-stealth-run': {
    component: 'JaggyStealthRun',
    name: 'Jaggy Stealth Run',
    category: 'gaming',
    requiresPassport: false,
    contractAddress: '0xB38005e10E376D5D43699B45E7fc2f06A8465a5D',
    contractName: 'GameRegistry',
  },
  'dna-sequencer-game': {
    component: 'DreamDNASequencerGame',
    name: 'Dream DNA Sequencer Game',
    category: 'gaming',
    requiresPassport: false,
    contractAddress: '0xB38005e10E376D5D43699B45E7fc2f06A8465a5D',
    contractName: 'GameRegistry',
  },
  'dream-lattice-game': {
    component: 'DreamLatticeGame',
    name: 'Dream Lattice Game',
    category: 'gaming',
    requiresPassport: false,
    contractAddress: '0xB38005e10E376D5D43699B45E7fc2f06A8465a5D',
    contractName: 'GameRegistry',
  },
  'wormhole-escape': {
    component: 'WormholeEscape',
    name: 'Wormhole Escape',
    category: 'gaming',
    requiresPassport: false,
    contractAddress: '0xB38005e10E376D5D43699B45E7fc2f06A8465a5D',
    contractName: 'GameRegistry',
  },
  'dream-bet-arcade': {
    component: 'DreamBetArcade',
    name: 'Dream Bet Arcade',
    category: 'gaming',
    requiresPassport: false,
    contractAddress: '0xB38005e10E376D5D43699B45E7fc2f06A8465a5D',
    contractName: 'GameRegistry',
  },
  'octopus-pattern-master': {
    component: 'OctopusPatternMaster',
    name: 'Octopus Pattern Master',
    category: 'gaming',
    requiresPassport: false,
    contractAddress: '0xB38005e10E376D5D43699B45E7fc2f06A8465a5D',
    contractName: 'GameRegistry',
  },
  'labubu-pop-smash': {
    component: 'LabubuPopSmash',
    name: 'Labubu Pop Smash',
    category: 'gaming',
    requiresPassport: false,
    contractAddress: '0xB38005e10E376D5D43699B45E7fc2f06A8465a5D',
    contractName: 'GameRegistry',
  },
  'reaction-test': {
    component: 'ReactionTestMini',
    name: 'Reaction Test Mini',
    category: 'gaming',
    requiresPassport: false,
    contractAddress: '0xB38005e10E376D5D43699B45E7fc2f06A8465a5D',
    contractName: 'GameRegistry',
  },
  'dream-snail-drift': {
    component: 'DreamSnailDrift',
    name: 'Dream Snail Drift',
    category: 'gaming',
    requiresPassport: false,
    contractAddress: '0xB38005e10E376D5D43699B45E7fc2f06A8465a5D',
    contractName: 'GameRegistry',
  },
  'dream-cloud-builder': {
    component: 'DreamCloudBuilder',
    name: 'Dream Cloud Builder',
    category: 'gaming',
    requiresPassport: false,
    contractAddress: '0xB38005e10E376D5D43699B45E7fc2f06A8465a5D',
    contractName: 'GameRegistry',
  },
  'dream-nebula-explorer': {
    component: 'DreamNebulaExplorer',
    name: 'Dream Nebula Explorer',
    category: 'gaming',
    requiresPassport: false,
    contractAddress: '0xB38005e10E376D5D43699B45E7fc2f06A8465a5D',
    contractName: 'GameRegistry',
  },
  // Practical/Ops/Money Apps
  'dreamscope-ops-mini': {
    component: 'DreamScopeOpsConsoleMini',
    name: 'DreamScope Ops Console Mini',
    category: 'ops',
    requiresPassport: false,
    contractAddress: undefined,
  },
  'shield-monitor-mini': {
    component: 'ShieldMonitorMini',
    name: 'Shield Monitor Mini',
    category: 'utility',
    requiresPassport: false,
    contractAddress: undefined,
  },
  'wormhole-router-mini': {
    component: 'WormholeRouterMini',
    name: 'Wormhole Router Mini',
    category: 'ops',
    requiresPassport: false,
    contractAddress: undefined,
  },
  'onboarding-wizard-mini': {
    component: 'OnboardingWizardMini',
    name: 'Onboarding Wizard Mini',
    category: 'onboarding',
    requiresPassport: false,
    contractAddress: undefined,
  },
  'creator-studio-mini': {
    component: 'CreatorStudioMini',
    name: 'Creator Studio Mini',
    category: 'creative',
    requiresPassport: false,
    contractAddress: undefined,
  },
  'dream-shop-mini': {
    component: 'DreamShopMini',
    name: 'Dream Shop Mini',
    category: 'commerce',
    requiresPassport: false,
    contractAddress: '0xa1E35292c736a68B9CAB7b9e5c271575632F442d',
    contractName: 'DreamShop',
  },
  'tribute-gate-mini': {
    component: 'TributeGateMini',
    name: 'Tribute Gate Mini',
    category: 'commerce',
    requiresPassport: false,
    contractAddress: '0x318292412250E906951f849eB3446c00b7688a6B',
    contractName: 'TributeGate',
  },
  'wallet-score-dashboard': {
    component: 'WalletScoreDashboard',
    name: 'Wallet Score Dashboard',
    category: 'utility',
    requiresPassport: false,
    contractAddress: '0x61A0523f068246E72a77e70f7B30AC2e4bfa87D5',
    contractName: 'WalletScoreRegistry',
  },
  'social-ops-mini': {
    component: 'SocialOpsMini',
    name: 'Social Ops Mini',
    category: 'ops',
    requiresPassport: false,
    contractAddress: undefined,
  },
  'wolf-pack-funding-hud': {
    component: 'WolfPackFundingHUD',
    name: 'Wolf Pack Funding HUD',
    category: 'commerce',
    requiresPassport: false,
    contractAddress: undefined,
  },
  'inbox-squared': {
    component: 'InboxSquaredMini',
    name: 'Inbox² - AI Communication Copilot',
    category: 'ops',
    requiresPassport: false,
    contractAddress: undefined,
  },
  'coinsensei': {
    component: 'CoinSenseiMini',
    name: 'CoinSensei 2.0 - Portfolio Analytics',
    category: 'utility',
    requiresPassport: false,
    contractAddress: undefined,
  },
  'card-forge-pro': {
    component: 'CardForgeProMini',
    name: 'Card Forge Pro - AI Card Creation',
    category: 'creative',
    requiresPassport: false,
    contractAddress: '0x34e1079820b4c733bE7D67A5F980ea4c752DbD47',
    contractName: 'CardForgeNFT',
  },
  // X402 Mini Apps - Pay with MetaMask
  'x402-payment-gateway': {
    component: 'X402PaymentGateway',
    name: 'X402 Payment Gateway',
    description: 'Multi-chain X402 payment processor for DreamNet agents',
    category: 'utility',
    requiresPassport: false,
    contractAddress: undefined, // Uses X402 protocol directly
  },
  'x402-balance-viewer': {
    component: 'X402BalanceViewer',
    name: 'X402 Balance Viewer',
    description: 'Check X402 balances across all chains (BSC, Ethereum, Solana, Base)',
    category: 'utility',
    requiresPassport: false,
    contractAddress: undefined,
  },
  'x402-service-marketplace': {
    component: 'X402ServiceMarketplace',
    name: 'X402 Service Marketplace',
    description: 'List and discover X402-powered services',
    category: 'utility',
    requiresPassport: false,
    contractAddress: '0xb7834fb3Be595dD480C01B912f79D542C2387De3',
    contractName: 'X402ServiceMarketplace',
  },
  'x402-transaction-history': {
    component: 'X402TransactionHistory',
    name: 'X402 Transaction History',
    description: 'View complete X402 payment history',
    category: 'utility',
    requiresPassport: false,
    contractAddress: '0xE9C2c5c0418b4F85BBE5AEE87620A8760Cdf4DDe',
    contractName: 'X402TransactionRegistry',
  },
  'x402-multi-chain-bridge': {
    component: 'X402MultiChainBridge',
    name: 'X402 Multi-Chain Bridge',
    description: 'Bridge X402 tokens across chains with low fees',
    category: 'utility',
    requiresPassport: false,
    contractAddress: undefined,
  },
};

