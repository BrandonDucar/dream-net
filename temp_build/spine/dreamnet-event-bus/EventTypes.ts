// Security Events
export type SecurityEventType =
    | 'Security.ThreatDetected'
    | 'Security.ThreatAnalyzed'
    | 'Security.MitigationApplied'
    | 'Security.RiskProfileUpdated'
    | 'Security.KillSwitchActivated'
    | 'Security.FrequencyRotated';

// Browser Events
export type BrowserEventType =
    | 'Browser.NavigationAttempted'
    | 'Browser.NavigationAllowed'
    | 'Browser.NavigationBlocked'
    | 'Browser.AuditCompleted'
    | 'Browser.AuditFailed'
    | 'Browser.CredentialAccessed'
    | 'Browser.PolicyViolation';

// Agent Events (Future)
export type AgentEventType =
    | 'Agent.PolicyViolation';

// All Event Types
export type EventType = SecurityEventType | BrowserEventType | AgentEventType;
