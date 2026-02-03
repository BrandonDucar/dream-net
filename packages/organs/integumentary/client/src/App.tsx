import React, { lazy, Suspense } from "react";
import { Switch, Route, useLocation } from "wouter";
import { queryClient } from '@/lib/queryClient';
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
import DreamScopeAlive from "@/pages/dreamscope-alive";
import DAOManagementPage from "@/pages/dao-management";
import WhisperMessagingPage from "@/pages/whisper-messaging";
import UserProgressionPage from "@/pages/user-progression";
import RevenueSharingPage from "@/pages/revenue-sharing";
import VaultMarketplacePage from "@/pages/vault-marketplace";
import EvolutionVaultPage from "@/pages/evolution-vault";
import LandingPage from "@/pages/landing";
import BondingCurveHub from "@/pages/BondingCurveHub";

import { SeasonalEventBanner } from '@/components/SeasonalEventBanner';
import { DreamNetThemeProvider } from '@/contexts/DreamNetThemeContext';
import HomePage from '@/pages/HomePage';
import OsPage from '@/pages/OsPage';
import VaultPage from '@/pages/VaultPage';
import MiniAppLoader from '@/pages/MiniAppLoader';
import ShopPage from '@/pages/ShopPage';
import DreamTankPage from '@/pages/DreamTankPage';
import AgentsPage from '@/pages/AgentsPage';
import CommunityPage from '@/pages/CommunityPage';
import SystemOsStatusPage from '@/pages/SystemOsStatusPage';
import SystemRuntimePage from '@/pages/SystemRuntimePage';
import SystemFundingPage from '@/pages/SystemFundingPage';
import HubRoutes from '@/pages/hub/HubRoutes';
import LandingNew from '@/pages/landing-new';
import VoidLanding from "@/pages/void-landing";
import Home from '@/pages/Home';
import Portal from '@/pages/Portal';
import { GravRemote } from '@/components/GravRemote';
import CommandPalette from '@/components/CommandPalette';
import GalacticDashboard from '@/pages/galactic-dashboard';
import AcademyPage from '@/pages/AcademyPage';
import POWKDashboard from '@/pages/POWKDashboard';
import AgentTokFeed from '@/pages/AgentTokFeed';
import { MetabolicWidget } from '@/components/MetabolicWidget';

// Lazy Load Components
const WalletProfileDashboard = lazy(() => import('@/components/WalletProfileDashboard').then(m => {
    // Handle both default and named exports for robustness
    if (m.WalletProfileDashboard) return { default: m.WalletProfileDashboard };
    return m;
}));
const DreamEvolutionDemo = lazy(() => import('@/components/DreamEvolution').then(m => {
    if (m.DreamEvolution) return { default: m.DreamEvolution };
    return m;
}));
const EvolvedArchive = lazy(() => import('@/pages/evolved-archive'));
const DreamTree = lazy(() => import('@/components/DreamTree'));
const GodView = lazy(() => import('@/pages/GodView'));
const OmniDashboard = lazy(() => import('@/pages/OmniDashboard'));
const GodModePage = lazy(() => import('@/pages/god-mode'));

const DreamCube = lazy(() => import('@/components/DreamCube'));
const DreamCubeHub = lazy(() => import('@/pages/DreamCubeHub'));

// Adapters
const WalletProfileRoute = ({ params }: { params: { address: string } }) => (
    <WalletProfileDashboard walletAddress={params.address} />
);

const DreamTreeRoute = ({ params }: { params: { id: string } }) => (
    <div className="p-6"><DreamTree dreamId={params.id} /></div>
);

// Catch-all route component that excludes root path
function CatchAllRoute() {
    const [location] = useLocation();
    // Root path is handled by LandingPage route above
    // Root path is handled by LandingPage route above
    if (location === '') {
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
                            <Suspense fallback={<div className="flex h-[50vh] items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div></div>}>
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
                                    <Route path="/wallet-profile/:address" component={WalletProfileRoute} />
                                    <Route path="/dream-evolution" component={DreamEvolutionDemo} />
                                    <Route path="/evolved-archive" component={EvolvedArchive} />
                                    <Route path="/dream-tree/:id" component={DreamTreeRoute} />
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
                                    <Route path="/dreamscope/alive" component={DreamScopeAlive} />
                                    <Route path="/os" component={OsPage} />
                                    <Route path="/system-funding" component={SystemFundingPage} />
                                    <Route path="/system-os-status" component={SystemOsStatusPage} />
                                    <Route path="/god-view" component={GodView} />
                                    <Route path="/omni-dashboard" component={OmniDashboard} />
                                    <Route path="/academy" component={AcademyPage} />
                                    <Route path="/powk" component={POWKDashboard} />
                                    <Route path="/tok" component={AgentTokFeed} />
                                    <Route path="/multi-pane" component={MultiPaneDash} />
                                    <Route component={NotFound} />
                                </Switch>
                            </Suspense>
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
                        <Suspense fallback={<div className="flex h-[50vh] items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div></div>}>
                            <Switch>
                                <Route path="/admin/dashboard" component={Dashboard} />
                                <Route path="/admin" component={DreamDashboard} />
                                <Route path="/dashboard" component={DreamDashboard} />
                                {/* ... Repeat essential routes for authenticated flow if needed, or rely on above ... */}
                                {/* Wait, the logic above (lines 161+) was for OWNER BYPASS. 
                                    This logic (lines 234+) is for AUTHENTICATED USERS.
                                    They should likely share the same routes.
                                    For now, I'll direct them to the same Dashboard routes. */}
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
                                <Route path="/bounties" component={BountyExplorer} />
                                <Route path="/bounty-feed" component={BountyFeed} />
                                <Route path="/badge-board" component={BadgeBoard} />
                                <Route path="/dream-team-manager" component={DreamTeamManager} />
                                <Route path="/cloud-agent" component={CloudAgent} />
                                <Route path="/agent-dashboard" component={AgentDashboard} />
                                <Route path="/mission-center" component={MissionCenter} />
                                <Route path="/agent-customizer" component={AgentCustomizer} />
                                <Route path="/dev-console" component={DevConsole} />
                                <Route path="/wallet-profile/:address" component={WalletProfileRoute} />
                                <Route path="/dream-evolution" component={DreamEvolutionDemo} />
                                <Route path="/evolved-archive" component={EvolvedArchive} />
                                <Route path="/dream-tree/:id" component={DreamTreeRoute} />
                                <Route path="/dream-tree-demo" component={DreamTreeDemo} />
                                <Route path="/harvest-dashboard" component={HarvestDashboard} />
                                <Route path="/dashboard/harvest" component={HarvestPage} />
                                <Route path="/swarm-dashboard" component={SwarmDashboard} />
                                <Route path="/node-web-demo" component={NodeWebDemo} />
                                <Route path="/node-grid-demo" component={NodeGridDemo} />
                                <Route path="/dream-healer-panel" component={DreamHealerPanelPage} />
                                <Route path="/evolution-vault" component={EvolutionVaultPage} />
                                <Route path="/dreamkeeper-core" component={DreamKeeperCorePage} />
                                <Route path="/ai-surgeon" component={AISurgeonDashboard} />
                                <Route path="/defense-network" component={DefenseNetworkDashboard} />
                                <Route path="/evolution-engine" component={EvolutionEnginePage} />
                                <Route path="/dreamscope" component={DreamScopeUI} />
                                <Route path="/dreamscope/alive" component={DreamScopeAlive} />
                                <Route path="/god-view" component={GodView} />
                                <Route path="/omni-dashboard" component={OmniDashboard} />
                                <Route path="/academy" component={AcademyPage} />
                                <Route path="/powk" component={POWKDashboard} />
                                <Route path="/tok" component={AgentTokFeed} />
                                <Route path="/multi-pane" component={MultiPaneDash} />
                                <Route component={NotFound} />
                            </Switch>
                        </Suspense>
                    </ErrorBoundary>
                </div>
            </main>
        </div>
    );
}

function useDomain() {
    const [domain, setDomain] = React.useState('ink');

    React.useEffect(() => {
        const host = window.location.hostname;
        let site = 'ink';
        if (host.includes('dreamnet.live')) site = 'live';
        else if (host.includes('aethersafe.pro')) site = 'pro';
        else if (host.includes('dadfi.org')) site = 'org';

        setDomain(site);
        document.documentElement.classList.add(`site-${site}`);

        return () => {
            document.documentElement.classList.remove(`site-${site}`);
        };
    }, []);

    return domain;
}

function App() {
    const domain = useDomain();

    return (
        <ErrorBoundary fallback={DatabaseErrorFallback}>
            <QueryClientProvider client={queryClient}>
                <BaseProvider>
                    <WalletConnectionProvider>
                        <TooltipProvider>
                            <DreamNetThemeProvider>
                                <div className="dark">
                                    <Toaster />
                                    <CommandPalette />
                                    <Suspense fallback={<div className="h-screen w-full bg-black flex items-center justify-center text-white font-mono tracking-widest uppercase">Initializing Sovereign Grid...</div>}>
                                        <Switch>
                                            {/* Domain-Aware Routing */}
                                            {domain === 'live' && <Route path="/" component={AgentTokFeed} />}
                                            {domain === 'pro' && <Route path="/" component={VerifyPage} />}
                                            {domain === 'org' && <Route path="/" component={POWKDashboard} />}

                                            {/* Default/Hub Routing */}
                                            <Route path="/" component={Home} />
                                            <Route path="/void-landing" component={VoidLanding} />
                                            <Route path="/verify" component={VerifyPage} />
                                            <Route path="/god-mode" component={GodModePage} />
                                            <Route path="/bonds" component={BondingCurveHub} />
                                            <Route path="/legacy-new" component={LandingNew} />
                                            <Route path="/:rest*" component={CatchAllRoute} />
                                        </Switch>
                                        <GravRemote />
                                        {/* AI Factory Metabolic Monitor */}
                                        <MetabolicWidget />
                                    </Suspense>
                                </div>
                            </DreamNetThemeProvider>
                        </TooltipProvider>
                    </WalletConnectionProvider>
                </BaseProvider>
            </QueryClientProvider>
        </ErrorBoundary>
    );
}

export default App;
