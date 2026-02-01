export type AgentPrefix = string;
export type AgentNextHop = string;
export interface AgentRoute {
    prefix: AgentPrefix;
    nextHop: AgentNextHop;
    metadata?: Record<string, unknown>;
}
export interface AgentRouteAnnouncement {
    type: 'announce' | 'withdraw';
    route: AgentRoute;
}
//# sourceMappingURL=AgentBGP.d.ts.map