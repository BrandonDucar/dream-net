// OpportunityAlertSystem - Type Definitions

export interface Opportunity {
  id: string;
  title: string;
  description: string;
  source: 'DIU' | 'SAM.gov' | 'grant' | 'partnership';
  requiredAmount: number;
  deadline: Date;
  requiredSkills: string[];
  difficulty: 'easy' | 'medium' | 'hard';
  estimatedROI: number;
  isPoolable: boolean; // Can multiple agents bid together?
}

export interface AgentProfile {
  agentId: string;
  name: string;
  email: string;
  phone: string;
  skills: string[];
  successRate: number;
  currentWorkload: number; // 0-100
  preferences: {
    minAmount: number;
    maxAmount: number;
    preferredSources: string[];
    preferredSkills: string[];
  };
}

export interface OpportunityMatch {
  opportunityId: string;
  agentId: string;
  matchScore: number; // 0-100
  skillsMatched: string[];
  skillsMissing: string[];
  reason: string;
  recommendedAction: 'bid_solo' | 'bid_with_swarm' | 'skip';
}

export interface Alert {
  id: string;
  type: 'email' | 'sms' | 'dashboard' | 'all';
  recipient: string;
  agentId?: string;
  opportunityId: string;
  subject: string;
  body: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  sentAt: Date;
  readAt?: Date;
  actionUrl?: string;
}

export interface DeadlineWarning {
  opportunityId: string;
  daysUntilDeadline: number;
  warningLevel: 'normal' | '7days' | '3days' | '1day' | 'overdue';
  lastWarning?: Date;
}

export interface AlertConfig {
  emailEnabled: boolean;
  smsEnabled: boolean;
  dashboardEnabled: boolean;
  minMatchScore: number;
  autoEscalateThreshold: number; // Escalate to swarm if opportunity > this value
  deadlineWarnings: number[]; // [7, 3, 1] days before deadline
}
