import { Route, Switch, useLocation } from "wouter";
import LayoutHub from "../../layouts/LayoutHub";
import HubOverview from "./index";
import HubGrid from "./grid";
import HubOps from "./ops";
import HubApps from "./apps";
import HubClouds from "./clouds";
import HubWallets from "./wallets";
import HubAgents from "./agents";
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
          <Route path="/hub/:rest*" component={HubOverview} />
        </Switch>
      </LayoutHub>
    </AuthProvider>
  );
}

