import React, { lazy } from "react";
import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/contexts/auth-context";
import { ErrorBoundary, DatabaseErrorFallback } from "@/components/ErrorBoundary";
import LoginForm from "@/components/auth/login-form";
import RestrictedAccess from "@/components/auth/restricted-access";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";
import Dreams from "@/pages/dreams";
import DreamGallery from "@/pages/dream-gallery";
import Cocoons from "@/pages/cocoons";
import Cores from "@/pages/cores";
import Wallets from "@/pages/wallets";
import Contributors from "@/pages/contributors";
import WalletAdmin from "@/pages/wallet-admin";
import SubmitDream from "@/pages/submit-dream";
import DreamDashboard from "@/components/dashboard/DreamDashboard";
import DreamFeed from "@/components/DreamFeed";
import DreamForm from "@/components/DreamForm";
import DreamOpsLauncherPage from "@/pages/dream-ops-launcher";
import AgentDashboardTest from "@/pages/agent-dashboard-test";
import CradleTestPage from "@/pages/cradle-test";
import LoadSavedDreamsPage from "@/pages/load-saved-dreams";
import DreamNetworkExplorer from "@/pages/dream-network-explorer";
import FusionVaultPage from "@/pages/fusion-vault";
import DreamViewer from "@/pages/dream-viewer";
import DreamVault from "@/pages/dream-vault";
import SolanaWalletDemo from "@/pages/solana-wallet-demo";
import WalletConnector from "@/components/WalletConnector";
import WalletIntegration from "@/pages/wallet-integration";
import EchoAgent from "@/pages/echo-agent";
import DreamScoringDemo from "@/pages/dream-scoring-demo";
import AgentStatusDemo from "@/pages/agent-status-demo";
import WalletAgentIntegration from "@/pages/wallet-agent-integration";
import BountyFeed from "@/pages/bounty-feed";
import AgentGlowDemo from "@/pages/agent-glow-demo";
import TokenMintingDemo from "@/pages/token-minting-demo";
import DreamMintingDemo from "@/pages/dream-minting-demo";
import FusionChamberDemo from "@/pages/fusion-chamber-demo";
import AgentFilteringDemo from "@/pages/agent-filtering-demo";
import DreamVaultPage from "@/pages/dream-vault";
import DreamRemixerPage from "@/pages/dream-remixer";
import EditDreamPage from "@/pages/edit-dream";
import SharedDreamPage from "@/pages/shared-dream";
import BountyExplorer from "@/pages/bounty-explorer";
import { WalletConnectionProvider } from "@/components/SolanaWalletProvider";
import { BaseProvider } from "@/providers/BaseProvider";
import DreamProcessor from "@/components/DreamProcessor";
import ErrorDemoPage from "@/pages/error-demo";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import DreamCloudPage from "@/pages/dream-cloud";
import FusePage from "@/pages/fuse";
import TokenDemo from "@/pages/token-demo";
import SimpleTokenDemo from "@/pages/simple-token-demo";
import DreamNodes from "@/pages/dream-nodes";
import EcosystemDashboard from "@/pages/ecosystem-dashboard";
import CommandInterface from "@/pages/command-interface";
import RemixSubmission from "@/pages/remix-submission";
import BadgeBoard from "@/pages/badge-board";
import DreamTeamManager from "@/pages/dream-team-manager";
import CloudAgent from "@/pages/cloud-agent";
import AgentDashboard from "@/pages/agent-dashboard";
import MissionCenter from "@/pages/mission-center";
import AgentCustomizer from "@/pages/agent-customizer";
import DevConsole from "@/pages/dev-console";
import NodeWebDemo from "@/pages/node-web-demo";
import NodeGridDemo from "@/pages/node-grid-demo";
import DreamHealerPanelPage from "@/pages/dream-healer-panel";
import DreamNodeTest from "@/pages/dream-node-test";
import SMSDemo from "@/pages/sms-demo";
import LeaderboardPage from "@/pages/leaderboard";
import DreamTreeDemo from "@/pages/dream-tree-demo";
import HarvestDashboard from "@/pages/harvest-dashboard";
import HarvestPage from "@/pages/dashboard/harvest";
import SwarmDashboard from "@/pages/swarm-dashboard";
import DreamKeeperCorePage from "@/pages/dreamkeeper-core";
import AISurgeonDashboard from "@/pages/ai-surgeon-dashboard";
import DefenseNetworkDashboard from "@/pages/defense-network";
import EvolutionEnginePage from "@/pages/evolution-engine";
import DreamScopeUI from "@/pages/dreamscope-ui";
import DAOManagementPage from "@/pages/dao-management";
import WhisperMessagingPage from "@/pages/whisper-messaging";
import UserProgressionPage from "@/pages/user-progression";
import RevenueSharingPage from "@/pages/revenue-sharing";
import VaultMarketplacePage from "@/pages/vault-marketplace";
import EvolutionVaultPage from "@/pages/evolution-vault";
import LandingPage from "@/pages/landing";

import { SeasonalEventBanner } from "./components/SeasonalEventBanner";

// Catch-all route component that excludes root path
function CatchAllRoute() {
  const [location] = useLocation();
  // Root path is handled by LandingPage route above
  if (location === '/' || location === '') {
    return null;
  }
  return (
    <AuthProvider>
      <AuthenticatedApp />
    </AuthProvider>
  );
}

function AuthenticatedApp() {
  const { isAdmin, isLoading, walletAddress } = useAuth();

  // Owner wallet gets instant access (no login needed)
  // Other admins must sign in with their wallets
  // Future: DreamSnail-based authentication will replace wallet auth
  const OWNER_WALLET = '0x742d35Cc6527Cc3de8b36b5C81B8a0ea4d5d3a8e'; // Your wallet
  const isOwner = walletAddress?.toLowerCase() === OWNER_WALLET.toLowerCase();
  
  // Check if we're accessing from owner's browser (localStorage check for instant access)
  const storedOwnerWallet = typeof window !== 'undefined' 
    ? localStorage.getItem('owner_wallet') 
    : null;
  const isOwnerSession = storedOwnerWallet?.toLowerCase() === OWNER_WALLET.toLowerCase();

  // Owner gets instant bypass, others need full auth
  if (isOwnerSession && !walletAddress) {
    // Owner accessing - grant instant access without wallet connection
    return (
      <div className="flex min-h-screen bg-background text-foreground">
        <Sidebar />
        <main className="flex-1 overflow-auto">
          <Header />
          <div className="p-6">
            <ErrorBoundary fallback={DatabaseErrorFallback}>
              <Switch>
                <Route path="/admin/dashboard" component={Dashboard} />
                <Route path="/admin" component={DreamDashboard} />
                <Route path="/dashboard" component={DreamDashboard} />
                <Route path="/dreams" component={Dreams} />
                <Route path="/dream-gallery" component={DreamGallery} />
                <Route path="/cocoons" component={Cocoons} />
                <Route path="/cores" component={Cores} />
                <Route path="/wallets" component={Wallets} />
                <Route path="/contributors" component={Contributors} />
                <Route path="/leaderboard" component={LeaderboardPage} />
                <Route path="/dao-management" component={DAOManagementPage} />
                <Route path="/whisper-messaging" component={WhisperMessagingPage} />
                <Route path="/user-progression" component={UserProgressionPage} />
                <Route path="/revenue-sharing" component={RevenueSharingPage} />
                <Route path="/vault-marketplace" component={VaultMarketplacePage} />
                <Route path="/dream-cloud" component={DreamCloudPage} />
                <Route path="/wallet-admin" component={WalletAdmin} />
                <Route path="/feed" component={DreamFeed} />
                <Route path="/dream-network-explorer" component={DreamNetworkExplorer} />
                <Route path="/cloud/:slug" component={DreamCloudPage} />
                <Route path="/fuse" component={FusePage} />
                <Route path="/tokens" component={TokenDemo} />
                <Route path="/simple-tokens" component={SimpleTokenDemo} />
                <Route path="/dream-nodes" component={DreamNodes} />
                <Route path="/ecosystem" component={EcosystemDashboard} />
                <Route path="/commands" component={CommandInterface} />
                <Route path="/remix" component={RemixSubmission} />
                <Route path="/dreamkeeper-core" component={DreamKeeperCorePage} />
                <Route path="/ai-surgeon" component={AISurgeonDashboard} />
                <Route path="/defense-network" component={DefenseNetworkDashboard} />
                <Route path="/evolution-engine" component={EvolutionEnginePage} />
                <Route path="/dreamscope-ui" component={DreamScopeUI} />
                <Route path="/evolution-vault" component={EvolutionVaultPage} />
                <Route component={DreamDashboard} />
              </Switch>
            </ErrorBoundary>
          </div>
        </main>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 animate-spin rounded-full border-2 border-electric-cyan border-t-transparent mx-auto mb-4"></div>
          <p className="text-muted-foreground">Connecting...</p>
        </div>
      </div>
    );
  }

  if (!walletAddress) {
    // Show login form - admins must sign in with their wallets
    // Future: Will support DreamSnail NFT-based authentication
    return <LoginForm />;
  }

  if (!isAdmin && !isOwner) {
    // Not an admin and not the owner - show restricted access
    return <RestrictedAccess />;
  }

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <Header />
        <div className="p-6">
          <ErrorBoundary fallback={DatabaseErrorFallback}>
            <Switch>
              <Route path="/admin/dashboard" component={Dashboard} />
              <Route path="/admin" component={DreamDashboard} />
              <Route path="/dashboard" component={DreamDashboard} />
              <Route path="/dreams" component={Dreams} />
              <Route path="/dream-gallery" component={DreamGallery} />
              <Route path="/cocoons" component={Cocoons} />
              <Route path="/cores" component={Cores} />
              <Route path="/wallets" component={Wallets} />
              <Route path="/contributors" component={Contributors} />
              <Route path="/leaderboard" component={LeaderboardPage} />
              <Route path="/dao-management" component={DAOManagementPage} />
              <Route path="/whisper-messaging" component={WhisperMessagingPage} />
              <Route path="/user-progression" component={UserProgressionPage} />
              <Route path="/revenue-sharing" component={RevenueSharingPage} />
              <Route path="/vault-marketplace" component={VaultMarketplacePage} />
              <Route path="/dream-cloud" component={DreamCloudPage} />
              <Route path="/wallet-admin" component={WalletAdmin} />
              <Route path="/feed" component={DreamFeed} />
              <Route path="/dream-network-explorer" component={DreamNetworkExplorer} />
              <Route path="/cloud/:slug" component={DreamCloudPage} />
              <Route path="/dream-cloud" component={DreamCloudPage} />
              <Route path="/fuse" component={FusePage} />
              <Route path="/tokens" component={TokenDemo} />
              <Route path="/simple-tokens" component={SimpleTokenDemo} />
              <Route path="/dream-nodes" component={DreamNodes} />
              <Route path="/ecosystem" component={EcosystemDashboard} />
              <Route path="/commands" component={CommandInterface} />
              <Route path="/remix" component={RemixSubmission} />
              <Route path="/bounties" component={BountyExplorer} />
              <Route path="/bounty-feed" component={BountyFeed} />
              <Route path="/badge-board" component={BadgeBoard} />
              <Route path="/dream-team-manager" component={DreamTeamManager} />
              <Route path="/cloud-agent" component={CloudAgent} />
              <Route path="/agent-dashboard" component={AgentDashboard} />
              <Route path="/mission-center" component={MissionCenter} />
              <Route path="/agent-customizer" component={AgentCustomizer} />
              <Route path="/dev-console" component={DevConsole} />
              <Route path="/seasonal-events" component={() => (
                <div className="p-6">
                  <h1 className="text-2xl font-bold text-white mb-6">Seasonal Events</h1>
                  <SeasonalEventBanner />
                </div>
              )} />
              <Route path="/wallet-profile/:address" component={({ params }: { params: { address: string } }) => {
                const { WalletProfileDashboard } = require('./components/WalletProfileDashboard');
                return (
                  <div className="p-6">
                    <h1 className="text-2xl font-bold text-white mb-6">Wallet Profile</h1>
                    <WalletProfileDashboard walletAddress={params.address} />
                  </div>
                );
              }} />
              <Route path="/dream-evolution" component={() => {
                const DreamCard = require('./components/DreamCard').default;
                const sampleDream = {
                  id: 'dream-evo-1',
                  title: 'Neural Network Consciousness',
                  content: 'A dream exploring the emergence of consciousness in artificial neural networks, examining the boundary between simulation and sentience.',
                  score: 94,
                  creatorWallet: '0xEliteDreamer123',
                  created: Date.now() - 86400000,
                  evolved: false
                };
                return (
                  <div className="p-6">
                    <h1 className="text-2xl font-bold text-white mb-6">Dream Evolution Demo</h1>
                    <div className="max-w-2xl">
                      <DreamCard dream={sampleDream} />
                    </div>
                  </div>
                );
              }} />
              <Route path="/evolved-archive" component={() => {
                const EvolvedArchive = require('./pages/evolved-archive').default;
                return <EvolvedArchive />;
              }} />
              <Route path="/dream-tree/:id" component={({ params }: { params: { id: string } }) => {
                const DreamTree = require('./components/DreamTree').default;
                return (
                  <div className="p-6">
                    <DreamTree dreamId={params.id} />
                  </div>
                );
              }} />
              <Route path="/dream-tree-demo" component={DreamTreeDemo} />
              <Route path="/harvest-dashboard" component={HarvestDashboard} />
              <Route path="/dashboard/harvest" component={HarvestPage} />
              <Route path="/swarm-dashboard" component={SwarmDashboard} />
              <Route path="/node-web-demo" component={NodeWebDemo} />
              <Route path="/node-grid-demo" component={NodeGridDemo} />
              <Route path="/dream-healer-panel" component={DreamHealerPanelPage} />
              <Route path="/demo/node-grid" component={NodeGridDemo} />
              <Route path="/evolution-vault" component={EvolutionVaultPage} />
              <Route path="/dreamkeeper-core" component={DreamKeeperCorePage} />
              <Route path="/ai-surgeon" component={AISurgeonDashboard} />
              <Route path="/defense-network" component={DefenseNetworkDashboard} />
              <Route path="/evolution-engine" component={EvolutionEnginePage} />
              <Route path="/dreamscope" component={DreamScopeUI} />
              <Route component={NotFound} />
            </Switch>
          </ErrorBoundary>
        </div>
      </main>
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary fallback={DatabaseErrorFallback}>
      <QueryClientProvider client={queryClient}>
        <BaseProvider>
          <WalletConnectionProvider>
            <TooltipProvider>
              <div className="dark">
                <Toaster />
                <Switch>
              {/* Public Landing Page - Must be first and exact */}
              <Route path="/" component={LandingPage} />
              
              {/* Public Routes - No Authentication Required */}
              <Route path="/submit-dream" component={SubmitDream} />
              <Route path="/gallery" component={DreamGallery} />
              <Route path="/feed" component={DreamFeed} />
              <Route path="/dream-form" component={() => <DreamForm onSubmit={() => {}} />} />
              <Route path="/launcher" component={DreamOpsLauncherPage} />
              <Route path="/agent-test" component={AgentDashboardTest} />
              <Route path="/cradle-test" component={CradleTestPage} />
              <Route path="/load-dreams" component={LoadSavedDreamsPage} />
              <Route path="/dreams/:slug" component={SharedDreamPage} />
              <Route path="/dream/:id" component={DreamViewer} />
              <Route path="/vault" component={DreamVault} />
              <Route path="/fusion-vault" component={FusionVaultPage} />
              <Route path="/solana-demo" component={SolanaWalletDemo} />
              <Route path="/wallet" component={WalletConnector} />
              <Route path="/wallet-integration" component={WalletIntegration} />
              <Route path="/echo-agent" component={EchoAgent} />
              <Route path="/dream-scoring" component={DreamScoringDemo} />
              <Route path="/agent-status" component={AgentStatusDemo} />
              <Route path="/wallet-agents" component={WalletAgentIntegration} />
              <Route path="/agent-glow" component={AgentGlowDemo} />
              <Route path="/token-minting" component={TokenMintingDemo} />
              <Route path="/dream-minting" component={DreamMintingDemo} />
              <Route path="/fusion-chamber" component={FusionChamberDemo} />
              <Route path="/agent-filtering" component={AgentFilteringDemo} />
              <Route path="/dream-vault" component={DreamVaultPage} />
              <Route path="/dream-remixer" component={DreamRemixerPage} />
              <Route path="/edit-dream/:id" component={EditDreamPage} />
              <Route path="/dreams/:id" component={SharedDreamPage} />
              <Route path="/bounty-explorer" component={BountyExplorer} />
              <Route path="/bounty-feed" component={BountyFeed} />
              <Route path="/remix-thread/:dreamId" component={lazy(() => import('@/pages/remix-thread'))} />
              <Route path="/badge-board" component={BadgeBoard} />
              <Route path="/dream-team-manager" component={DreamTeamManager} />
              <Route path="/cloud-agent" component={CloudAgent} />
              <Route path="/agent-dashboard" component={AgentDashboard} />
              <Route path="/dream-graveyard" component={lazy(() => import('@/pages/dream-graveyard'))} />
              <Route path="/xp-progression" component={lazy(() => import('@/pages/xp-progression'))} />
              <Route path="/god-terminal" component={lazy(() => import('@/pages/god-terminal'))} />
              <Route path="/team-management" component={lazy(() => import('@/pages/team-management'))} />
              <Route path="/processor" component={DreamProcessor} />
              <Route path="/error-demo" component={ErrorDemoPage} />
              <Route path="/flutterbye-node" component={lazy(() => import('@/pages/flutterbye-node'))} />
              <Route path="/dream-healer" component={DreamHealerPanelPage} />
              <Route path="/remix-tracker" component={lazy(() => import('@/pages/remix-submission-tracker'))} />
              <Route path="/remix-gallery" component={lazy(() => import('@/pages/remix-gallery'))} />
              <Route path="/dream-node-test" component={DreamNodeTest} />
              <Route path="/sms-demo" component={SMSDemo} />
        <Route path="/dreams/:dreamId" component={lazy(() => import('@/pages/dream-detail'))} />
              
              {/* Base Mini Apps */}
              <Route path="/miniapps" component={lazy(() => import('@/pages/miniapps/index'))} />
              <Route path="/miniapps/:id" component={lazy(() => import('@/pages/miniapps/[id]'))} />
              
              {/* Disabled demo routes with lazy loading issues */}
              
              {/* Admin Routes - Authentication Required */}
              <Route path="/admin">
                <AuthProvider>
                  <AuthenticatedApp />
                </AuthProvider>
              </Route>
              
              {/* Protected Routes - Authentication Required (backwards compat) - Must be last */}
              {/* Catch-all: matches any path not matched above */}
              <Route path="*">
                <CatchAllRoute />
              </Route>
            </Switch>
            </div>
          </TooltipProvider>
        </WalletConnectionProvider>
        </BaseProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
