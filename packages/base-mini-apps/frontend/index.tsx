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
};

