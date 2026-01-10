export type SecurityEventType = 'Security.ThreatDetected' | 'Security.ThreatAnalyzed' | 'Security.MitigationApplied' | 'Security.RiskProfileUpdated' | 'Security.KillSwitchActivated' | 'Security.FrequencyRotated';
export type BrowserEventType = 'Browser.NavigationAttempted' | 'Browser.NavigationAllowed' | 'Browser.NavigationBlocked' | 'Browser.AuditCompleted' | 'Browser.AuditFailed' | 'Browser.CredentialAccessed' | 'Browser.PolicyViolation';
export type AgentEventType = 'Agent.PolicyViolation';
export type EventType = SecurityEventType | BrowserEventType | AgentEventType;
