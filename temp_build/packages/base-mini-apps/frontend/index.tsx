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

// App registry for routing
export const MINI_APPS = {
  'passport-mint': {
    component: 'PassportMintApp',
    name: 'Dream Passport Mint',
    category: 'identity',
    requiresPassport: false,
  },
  'governance': {
    component: 'GovernanceApp',
    name: 'Dream State Governance',
    category: 'governance',
    requiresPassport: true,
    minTier: 'citizen',
  },
  'api-keeper': {
    component: 'APIKeeperDashboard',
    name: 'API Keeper Dashboard',
    category: 'utility',
    requiresPassport: true,
    minTier: 'operator',
  },
  'api-keeper-office': {
    component: 'APIKeeperGovernmentOffice',
    name: 'API Keeper Government Office',
    category: 'governance',
    requiresPassport: true,
    minTier: 'operator',
  },
  'jaggy-office': {
    component: 'JaggyGovernmentOffice',
    name: 'Silent Sentinel Government Office',
    category: 'governance',
    requiresPassport: true,
    minTier: 'operator',
  },
  'mycelium-office': {
    component: 'MyceliumGovernmentOffice',
    name: 'Mycelium Network Government Office',
    category: 'governance',
    requiresPassport: true,
    minTier: 'operator',
  },
  'wolf-pack': {
    component: 'WolfPackPortal',
    name: 'Wolf Pack Funding Portal',
    category: 'commerce',
    requiresPassport: true,
    minTier: 'citizen',
  },
  'social-hub': {
    component: 'SocialHub',
    name: 'DreamNet Social Hub',
    category: 'social',
    requiresPassport: true,
    minTier: 'dreamer',
  },
  'whale-pack': {
    component: 'WhalePackCommerce',
    name: 'Whale Pack Commerce',
    category: 'commerce',
    requiresPassport: true,
    minTier: 'citizen',
  },
  'treasury': {
    component: 'Treasury',
    name: 'DreamNet Treasury',
    category: 'defi',
    requiresPassport: true,
    minTier: 'operator',
  },
  'shield-monitor': {
    component: 'ShieldMonitor',
    name: 'Shield Status Monitor',
    category: 'utility',
    requiresPassport: true,
    minTier: 'operator',
  },
  // Quick win apps
  'dream-gallery': {
    component: 'DreamGalleryExplorer',
    name: 'Dream Gallery Explorer',
    category: 'exploration',
    requiresPassport: false,
  },
  'ecosystem-dashboard': {
    component: 'EcosystemDashboardMini',
    name: 'Ecosystem Dashboard',
    category: 'utility',
    requiresPassport: false,
  },
  'network-explorer': {
    component: 'DreamNetworkExplorer',
    name: 'Dream Network Explorer',
    category: 'utility',
    requiresPassport: false,
  },
  'agent-dashboard': {
    component: 'AgentDashboardMini',
    name: 'Agent Dashboard',
    category: 'utility',
    requiresPassport: false,
  },
  'badge-board': {
    component: 'BadgeBoardMini',
    name: 'Badge Board',
    category: 'social',
    requiresPassport: false,
  },
  // Contract-based apps
  'dream-vault': {
    component: 'DreamVaultMini',
    name: 'Dream Vault',
    category: 'creative',
    requiresPassport: true,
    minTier: 'dreamer',
  },
  'bounty-board': {
    component: 'BountyBoardMini',
    name: 'Bounty Board',
    category: 'commerce',
    requiresPassport: true,
    minTier: 'citizen',
  },
  'dream-remix': {
    component: 'DreamRemixStudio',
    name: 'Dream Remix Studio',
    category: 'creative',
    requiresPassport: true,
    minTier: 'citizen',
  },
  'whisper-messenger': {
    component: 'WhisperMessengerApp',
    name: 'Whisper Messenger',
    category: 'social',
    requiresPassport: true,
    minTier: 'dreamer',
  },
  'seasonal-events': {
    component: 'SeasonalEventsHub',
    name: 'Seasonal Events Hub',
    category: 'events',
    requiresPassport: false,
  },
  'nightmare-network': {
    component: 'NightmareNetwork',
    name: 'Nightmare Network',
    category: 'utility',
    requiresPassport: true,
    minTier: 'operator',
  },
  'mission-center': {
    component: 'MissionCenter',
    name: 'Mission Center',
    category: 'utility',
    requiresPassport: true,
    minTier: 'operator',
  },
  'revenue-sharing': {
    component: 'RevenueSharingDashboard',
    name: 'Revenue Sharing Dashboard',
    category: 'defi',
    requiresPassport: true,
    minTier: 'citizen',
  },
  'progression-tracker': {
    component: 'ProgressionTracker',
    name: 'Progression Tracker',
    category: 'utility',
    requiresPassport: false,
  },
  'dream-drifters': {
    component: 'DreamDriftersDAO',
    name: 'Dream Drifters DAO',
    category: 'governance',
    requiresPassport: true,
    minTier: 'citizen',
  },
  'time-capsule': {
    component: 'DreamTimeCapsuleApp',
    name: 'Dream Time Capsule',
    category: 'creative',
    requiresPassport: false,
  },
  'dna-sequencer': {
    component: 'DreamDNASequencerApp',
    name: 'Dream DNA Sequencer',
    category: 'utility',
    requiresPassport: true,
    minTier: 'dreamer',
  },
  'prediction-market': {
    component: 'DreamPredictionMarketApp',
    name: 'Dream Prediction Market',
    category: 'defi',
    requiresPassport: true,
    minTier: 'citizen',
  },
  'dreamscope-ops': {
    component: 'DreamScopeOpsConsole',
    name: 'DreamScope Ops Console',
    category: 'ops',
    requiresPassport: false,
  },
  'onboarding': {
    component: 'OnboardingWizard',
    name: 'Onboarding Wizard',
    category: 'onboarding',
    requiresPassport: false,
  },
  'creator-studio': {
    component: 'CreatorStudio',
    name: 'Creator Studio',
    category: 'creative',
    requiresPassport: false,
  },
  // Fun/Game Apps
  'jaggy-stealth-run': {
    component: 'JaggyStealthRun',
    name: 'Jaggy Stealth Run',
    category: 'gaming',
    requiresPassport: false,
  },
  'dna-sequencer-game': {
    component: 'DreamDNASequencerGame',
    name: 'Dream DNA Sequencer Game',
    category: 'gaming',
    requiresPassport: false,
  },
  'dream-lattice-game': {
    component: 'DreamLatticeGame',
    name: 'Dream Lattice Game',
    category: 'gaming',
    requiresPassport: false,
  },
  'wormhole-escape': {
    component: 'WormholeEscape',
    name: 'Wormhole Escape',
    category: 'gaming',
    requiresPassport: false,
  },
  'dream-bet-arcade': {
    component: 'DreamBetArcade',
    name: 'Dream Bet Arcade',
    category: 'gaming',
    requiresPassport: false,
  },
  'octopus-pattern-master': {
    component: 'OctopusPatternMaster',
    name: 'Octopus Pattern Master',
    category: 'gaming',
    requiresPassport: false,
  },
  'labubu-pop-smash': {
    component: 'LabubuPopSmash',
    name: 'Labubu Pop Smash',
    category: 'gaming',
    requiresPassport: false,
  },
  'reaction-test': {
    component: 'ReactionTestMini',
    name: 'Reaction Test Mini',
    category: 'gaming',
    requiresPassport: false,
  },
  'dream-snail-drift': {
    component: 'DreamSnailDrift',
    name: 'Dream Snail Drift',
    category: 'gaming',
    requiresPassport: false,
  },
  'dream-cloud-builder': {
    component: 'DreamCloudBuilder',
    name: 'Dream Cloud Builder',
    category: 'gaming',
    requiresPassport: false,
  },
  // Practical/Ops/Money Apps
  'dreamscope-ops-mini': {
    component: 'DreamScopeOpsConsoleMini',
    name: 'DreamScope Ops Console Mini',
    category: 'ops',
    requiresPassport: false,
  },
  'shield-monitor-mini': {
    component: 'ShieldMonitorMini',
    name: 'Shield Monitor Mini',
    category: 'utility',
    requiresPassport: false,
  },
  'wormhole-router-mini': {
    component: 'WormholeRouterMini',
    name: 'Wormhole Router Mini',
    category: 'ops',
    requiresPassport: false,
  },
  'onboarding-wizard-mini': {
    component: 'OnboardingWizardMini',
    name: 'Onboarding Wizard Mini',
    category: 'onboarding',
    requiresPassport: false,
  },
  'creator-studio-mini': {
    component: 'CreatorStudioMini',
    name: 'Creator Studio Mini',
    category: 'creative',
    requiresPassport: false,
  },
  'dream-shop-mini': {
    component: 'DreamShopMini',
    name: 'Dream Shop Mini',
    category: 'commerce',
    requiresPassport: false,
  },
  'tribute-gate-mini': {
    component: 'TributeGateMini',
    name: 'Tribute Gate Mini',
    category: 'commerce',
    requiresPassport: false,
  },
  'wallet-score-dashboard': {
    component: 'WalletScoreDashboard',
    name: 'Wallet Score Dashboard',
    category: 'utility',
    requiresPassport: false,
  },
  'social-ops-mini': {
    component: 'SocialOpsMini',
    name: 'Social Ops Mini',
    category: 'ops',
    requiresPassport: false,
  },
  'wolf-pack-funding-hud': {
    component: 'WolfPackFundingHUD',
    name: 'Wolf Pack Funding HUD',
    category: 'commerce',
    requiresPassport: false,
  },
  'inbox-squared': {
    component: 'InboxSquaredMini',
    name: 'Inbox² - AI Communication Copilot',
    category: 'ops',
    requiresPassport: false,
  },
  'coinsensei': {
    component: 'CoinSenseiMini',
    name: 'CoinSensei 2.0 - Portfolio Analytics',
    category: 'utility',
    requiresPassport: false,
  },
  'card-forge-pro': {
    component: 'CardForgeProMini',
    name: 'Card Forge Pro - AI Card Creation',
    category: 'creative',
    requiresPassport: false,
  },
};

