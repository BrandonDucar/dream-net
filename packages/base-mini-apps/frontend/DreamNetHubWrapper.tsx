import React, { useState, useMemo } from 'react';
import { DreamNetHub } from './DreamNetHub';
import { MINI_APPS } from './index';

// Import all components dynamically
import { PassportMintApp } from './PassportMintApp';
import { GovernanceApp } from './GovernanceApp';
import { APIKeeperDashboard } from './APIKeeperDashboard';
import { APIKeeperGovernmentOffice } from './APIKeeperGovernmentOffice';
import { JaggyGovernmentOffice } from './JaggyGovernmentOffice';
import { MyceliumGovernmentOffice } from './MyceliumGovernmentOffice';
import { WolfPackPortal } from './WolfPackPortal';
import { SocialHub } from './SocialHub';
import { WhalePackCommerce } from './WhalePackCommerce';
import { Treasury } from './Treasury';
import { ShieldMonitor } from './ShieldMonitor';
import { DreamGalleryExplorer } from './DreamGalleryExplorer';
import { EcosystemDashboardMini } from './EcosystemDashboardMini';
import { DreamNetworkExplorer } from './DreamNetworkExplorer';
import { AgentDashboardMini } from './AgentDashboardMini';
import { BadgeBoardMini } from './BadgeBoardMini';
import { DreamVaultMini } from './DreamVaultMini';
import { BountyBoardMini } from './BountyBoardMini';
import { DreamRemixStudio } from './DreamRemixStudio';
import { WhisperMessengerApp } from './WhisperMessengerApp';
import { SeasonalEventsHub } from './SeasonalEventsHub';
import { NightmareNetwork } from './NightmareNetwork';
import { MissionCenter } from './MissionCenter';
import { RevenueSharingDashboard } from './RevenueSharingDashboard';
import { ProgressionTracker } from './ProgressionTracker';
import { DreamDriftersDAO } from './DreamDriftersDAO';
import { DreamTimeCapsuleApp } from './DreamTimeCapsuleApp';
import { DreamDNASequencerApp } from './DreamDNASequencerApp';
import { DreamPredictionMarketApp } from './DreamPredictionMarketApp';
import { DreamScopeOpsConsole } from './DreamScopeOpsConsole';
import { OnboardingWizard } from './OnboardingWizard';
import { CreatorStudio } from './CreatorStudio';
import { CONTRACT_ADDRESSES } from './config';

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

