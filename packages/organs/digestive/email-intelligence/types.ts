// EmailIntelligence - Type Definitions

export interface Email {
  id: string;
  from: string;
  to: string;
  subject: string;
  body: string;
  receivedAt: Date;
  attachments?: Array<{ filename: string; url: string }>;
  raw?: string;
}

export interface ParsedEmail {
  originalEmail: Email;
  intent: EmailIntent;
  sentiment: 'positive' | 'neutral' | 'negative';
  urgency: 'low' | 'medium' | 'high' | 'critical';
  actionRequired: boolean;
  actionItems: string[];
  keyEntities: {
    amounts?: number[];
    dates?: Date[];
    names?: string[];
    organizations?: string[];
  };
  confidence: number; // 0-100
}

export type EmailIntent = 
  | 'grant_notification'
  | 'grant_approved'
  | 'grant_rejected'
  | 'contract_inquiry'
  | 'payment_notification'
  | 'payment_received'
  | 'deadline_reminder'
  | 'document_request'
  | 'negotiation'
  | 'status_update'
  | 'other';

export interface RoutingDecision {
  parsedEmail: ParsedEmail;
  recommendedAgent: string;
  alternativeAgents: string[];
  reason: string;
  shouldEscalateToSwarm: boolean;
}

export interface AutoResponse {
  to: string;
  subject: string;
  body: string;
  scheduledFor?: Date;
  requiresApproval: boolean;
}

export interface EmailAction {
  id: string;
  type: 'alert' | 'create_task' | 'trigger_workflow' | 'update_record' | 'escalate';
  description: string;
  targetAgentId?: string;
  targetSwarm?: boolean;
  payload?: any;
  executedAt?: Date;
  status: 'pending' | 'executing' | 'complete' | 'failed';
}

export interface FollowUpSchedule {
  emailId: string;
  scheduledFor: Date;
  type: 'reminder' | 'follow_up' | 'deadline_warning';
  action: string;
  status: 'scheduled' | 'sent' | 'cancelled';
}

export interface EmailConfig {
  llmProvider: 'openai' | 'anthropic' | 'local';
  autoResponseEnabled: boolean;
  requireApprovalForResponses: boolean;
  followUpEnabled: boolean;
  intentsToMonitor: EmailIntent[];
  urgencyThresholds: {
    autoRespond: boolean;
    escalateToAgent: boolean;
    escalateToSwarm: boolean;
  };
}
