import { Route, Switch, useLocation } from "wouter";
import LayoutHub from '../../layouts/LayoutHub.js';
import HubOverview from './index.js';
import HubGrid from './grid.js';
import HubOps from './ops.js';
import HubApps from './apps.js';
import HubClouds from './clouds.js';
import HubWallets from './wallets.js';
import HubAgents from './agents.js';
import HubWebsiteBuilder from './website-builder.js';
import HubDeployment from './deployment.js';
import HubCardForge from './card-forge.js';
import { AuthProvider } from "@/contexts/auth-context";

export default function HubRoutes() {
  return (
    <AuthProvider>
      <LayoutHub>
        <Switch>
          <Route path="/hub" component={HubOverview} />
          <Route path="/hub/grid" component={HubGrid} />
          <Route path="/hub/ops" component={HubOps} />
          <Route path="/hub/apps" component={HubApps} />
          <Route path="/hub/clouds" component={HubClouds} />
          <Route path="/hub/wallets" component={HubWallets} />
          <Route path="/hub/agents" component={HubAgents} />
          <Route path="/hub/website-builder" component={HubWebsiteBuilder} />
          <Route path="/hub/deployment" component={HubDeployment} />
          <Route path="/hub/card-forge" component={HubCardForge} />
          <Route path="/hub/:rest*" component={HubOverview} />
        </Switch>
      </LayoutHub>
    </AuthProvider>
  );
}

