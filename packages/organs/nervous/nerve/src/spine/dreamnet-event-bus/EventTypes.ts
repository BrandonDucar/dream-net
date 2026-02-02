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

// Market Events
export type MarketEventType =
    | 'Market.OpportunityDetected'
    | 'Market.TradeExecuted'
    | 'Market.SlippageAlert'
    | 'Market.AlphaExtracted';

// Agent Events
export type AgentEventType =
    | 'Agent.PolicyViolation'
    | 'Agent.Thought'
    | 'Agent.GeneticShift'
    | 'Agent.ImpactScore';

// Mastery Events
export type MasteryEventType =
    | 'Mastery.LevelUp'
    | 'Mastery.SkillUnlocked'
    | 'Mastery.ResearchCompleted';

// All Event Types
export type EventType = SecurityEventType | BrowserEventType | MarketEventType | AgentEventType | MasteryEventType;
