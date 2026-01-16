import { AgentPrefix, AgentRoute } from './AgentBGP.js';
export declare class RoutingStrategies {
    static selectFirstMatch(prefix: AgentPrefix, routes: AgentRoute[]): AgentRoute | undefined;
    static selectLongestPrefixMatch(prefix: AgentPrefix, routes: AgentRoute[]): AgentRoute | undefined;
}
//# sourceMappingURL=RoutingStrategies.d.ts.map