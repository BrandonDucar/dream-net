import { AgentPrefix, AgentRoute } from './AgentBGP';

export class RoutingStrategies {
    public static selectFirstMatch(prefix: AgentPrefix, routes: AgentRoute[]): AgentRoute | undefined {
        return routes.find(r => r.prefix === prefix);
    }

    public static selectLongestPrefixMatch(prefix: AgentPrefix, routes: AgentRoute[]): AgentRoute | undefined {
        let bestMatch: AgentRoute | undefined;
        let maxLen = -1;

        for (const route of routes) {
            if (prefix.startsWith(route.prefix)) {
                if (route.prefix.length > maxLen) {
                    maxLen = route.prefix.length;
                    bestMatch = route;
                }
            }
        }
        return bestMatch;
    }
}
