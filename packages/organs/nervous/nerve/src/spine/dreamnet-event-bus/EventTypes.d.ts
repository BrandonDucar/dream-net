export type SecurityEventType = 'Security.ThreatDetected' | 'Security.ThreatAnalyzed' | 'Security.MitigationApplied' | 'Security.RiskProfileUpdated' | 'Security.KillSwitchActivated' | 'Security.FrequencyRotated';
export type BrowserEventType = 'Browser.NavigationAttempted' | 'Browser.NavigationAllowed' | 'Browser.NavigationBlocked' | 'Browser.AuditCompleted' | 'Browser.AuditFailed' | 'Browser.CredentialAccessed' | 'Browser.PolicyViolation';
export type MarketEventType = 'Market.OpportunityDetected' | 'Market.TradeExecuted' | 'Market.SlippageAlert' | 'Market.AlphaExtracted';
export type AgentEventType = 'Agent.PolicyViolation';
export type EventType = SecurityEventType | BrowserEventType | MarketEventType | AgentEventType;
//# sourceMappingURL=EventTypes.d.ts.map