import React, { useState, useMemo } from 'react';
import { DreamNetHub } from './DreamNetHub.js';
import { MINI_APPS } from './index.js';

// Import all components dynamically
import { PassportMintApp } from './PassportMintApp.js';
import { GovernanceApp } from './GovernanceApp.js';
import { APIKeeperDashboard } from './APIKeeperDashboard.js';
import { APIKeeperGovernmentOffice } from './APIKeeperGovernmentOffice.js';
import { JaggyGovernmentOffice } from './JaggyGovernmentOffice.js';
import { MyceliumGovernmentOffice } from './MyceliumGovernmentOffice.js';
import { WolfPackPortal } from './WolfPackPortal.js';
import { SocialHub } from './SocialHub.js';
import { WhalePackCommerce } from './WhalePackCommerce.js';
import { Treasury } from './Treasury.js';
import { ShieldMonitor } from './ShieldMonitor.js';
import { DreamGalleryExplorer } from './DreamGalleryExplorer.js';
import { EcosystemDashboardMini } from './EcosystemDashboardMini.js';
import { DreamNetworkExplorer } from './DreamNetworkExplorer.js';
import { AgentDashboardMini } from './AgentDashboardMini.js';
import { BadgeBoardMini } from './BadgeBoardMini.js';
import { DreamVaultMini } from './DreamVaultMini.js';
import { BountyBoardMini } from './BountyBoardMini.js';
import { DreamRemixStudio } from './DreamRemixStudio.js';
import { WhisperMessengerApp } from './WhisperMessengerApp.js';
import { SeasonalEventsHub } from './SeasonalEventsHub.js';
import { NightmareNetwork } from './NightmareNetwork.js';
import { MissionCenter } from './MissionCenter.js';
import { RevenueSharingDashboard } from './RevenueSharingDashboard.js';
import { ProgressionTracker } from './ProgressionTracker.js';
import { DreamDriftersDAO } from './DreamDriftersDAO.js';
import { DreamTimeCapsuleApp } from './DreamTimeCapsuleApp.js';
import { DreamDNASequencerApp } from './DreamDNASequencerApp.js';
import { DreamPredictionMarketApp } from './DreamPredictionMarketApp.js';
import { DreamScopeOpsConsole } from './DreamScopeOpsConsole.js';
import { OnboardingWizard } from './OnboardingWizard.js';
import { CreatorStudio } from './CreatorStudio.js';
// Fun/Game Apps
import { JaggyStealthRun } from './JaggyStealthRun.js';
import { DreamDNASequencerGame } from './DreamDNASequencerGame.js';
import { DreamLatticeGame } from './DreamLatticeGame.js';
import { WormholeEscape } from './WormholeEscape.js';
import { DreamBetArcade } from './DreamBetArcade.js';
import { OctopusPatternMaster } from './OctopusPatternMaster.js';
import { LabubuPopSmash } from './LabubuPopSmash.js';
import { ReactionTestMini } from './ReactionTestMini.js';
import { DreamSnailDrift } from './DreamSnailDrift.js';
import { DreamCloudBuilder } from './DreamCloudBuilder.js';
// Practical/Ops/Money Apps
import { DreamScopeOpsConsoleMini } from './DreamScopeOpsConsoleMini.js';
import { ShieldMonitorMini } from './ShieldMonitorMini.js';
import { WormholeRouterMini } from './WormholeRouterMini.js';
import { OnboardingWizardMini } from './OnboardingWizardMini.js';
import { CreatorStudioMini } from './CreatorStudioMini.js';
import { DreamShopMini } from './DreamShopMini.js';
import { TributeGateMini } from './TributeGateMini.js';
import { WalletScoreDashboard } from './WalletScoreDashboard.js';
import { SocialOpsMini } from './SocialOpsMini.js';
import { WolfPackFundingHUD } from './WolfPackFundingHUD.js';
import { InboxSquaredMini } from './InboxSquaredMini.js';
import { CoinSenseiMini } from './CoinSenseiMini.js';
import { CardForgeProMini } from './CardForgeProMini.js';
import { CONTRACT_ADDRESSES } from './config.js';

// Component mapping
const COMPONENT_MAP: Record<string, React.ComponentType<any>> = {
  PassportMintApp,
  GovernanceApp,
  APIKeeperDashboard,
  APIKeeperGovernmentOffice,
  JaggyGovernmentOffice,
  MyceliumGovernmentOffice,
  WolfPackPortal,
  SocialHub,
  WhalePackCommerce,
  Treasury,
  ShieldMonitor,
  DreamGalleryExplorer,
  EcosystemDashboardMini,
  DreamNetworkExplorer,
  AgentDashboardMini,
  BadgeBoardMini,
  DreamVaultMini,
  BountyBoardMini,
  DreamRemixStudio,
  WhisperMessengerApp,
  SeasonalEventsHub,
  NightmareNetwork,
  MissionCenter,
  RevenueSharingDashboard,
  ProgressionTracker,
  DreamDriftersDAO,
  DreamTimeCapsuleApp,
  DreamDNASequencerApp,
  DreamPredictionMarketApp,
  DreamScopeOpsConsole,
  OnboardingWizard,
  CreatorStudio,
  // Fun/Game Apps
  JaggyStealthRun,
  DreamDNASequencerGame,
  DreamLatticeGame,
  WormholeEscape,
  DreamBetArcade,
  OctopusPatternMaster,
  LabubuPopSmash,
  ReactionTestMini,
  DreamSnailDrift,
  DreamCloudBuilder,
  // Practical/Ops/Money Apps
  DreamScopeOpsConsoleMini,
  ShieldMonitorMini,
  WormholeRouterMini,
  OnboardingWizardMini,
  CreatorStudioMini,
  DreamShopMini,
  TributeGateMini,
  WalletScoreDashboard,
  SocialOpsMini,
  WolfPackFundingHUD,
  InboxSquaredMini,
  CoinSenseiMini,
  CardForgeProMini,
};

export function DreamNetHubWrapper() {
  const [selectedAppId, setSelectedAppId] = useState<string | null>(null);

  const handleSelectApp = (appId: string) => {
    setSelectedAppId(appId);
  };

  const handleBackToHub = () => {
    setSelectedAppId(null);
  };

  // If an app is selected, render it
  if (selectedAppId && MINI_APPS[selectedAppId]) {
    const app = MINI_APPS[selectedAppId];
    const Component = COMPONENT_MAP[app.component];
    
    if (!Component) {
      return (
        <div className="p-6">
          <p className="text-red-400">Component {app.component} not found</p>
          <button
            onClick={handleBackToHub}
            className="mt-4 bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded"
          >
            Back to Hub
          </button>
        </div>
      );
    }

    // Pass contract addresses as props if needed
    const props: any = {};
    if (selectedAppId === 'passport-mint') {
      props.passportContractAddress = CONTRACT_ADDRESSES.DreamPassport;
    }
    if (selectedAppId === 'governance') {
      props.governanceContractAddress = CONTRACT_ADDRESSES.DreamGovernance;
      props.passportContractAddress = CONTRACT_ADDRESSES.DreamPassport;
    }
    // Other apps use CONTRACT_ADDRESSES directly from config.ts, no props needed

    return (
      <div>
        {/* Back button */}
        <div className="bg-gray-800 border-b border-cyan-500/20 p-4">
          <button
            onClick={handleBackToHub}
            className="text-cyan-400 hover:text-cyan-300 flex items-center gap-2"
          >
            ← Back to Hub
          </button>
          <h2 className="text-xl font-semibold mt-2">{app.name}</h2>
        </div>
        {/* Render the selected app */}
        <Component {...props} />
      </div>
    );
  }

  // Default: show the Hub
  return <DreamNetHub onSelectApp={handleSelectApp} />;
}

