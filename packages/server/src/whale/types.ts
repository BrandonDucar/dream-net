/**
 * Whale Pack Types
 * Types for metrics, manifests, and actions
 */

export type MiniAppId =
  | 'passport'
  | 'governance'
  | 'vault'
  | 'bounty'
  | 'timeCapsule'
  | 'prediction'
  | 'dreamscopeOps'
  | 'onboarding'
  | 'creatorStudio';

export interface MiniAppMetric {
  id: MiniAppId;
  label: string;
  category: 'identity' | 'governance' | 'utility' | 'creative' | 'ops' | 'onboarding';
  stats: Record<string, number>;
  health: 'healthy' | 'degraded' | 'unhealthy';
  updatedAt: number;
}

export interface WhaleAction {
  appId: MiniAppId;
  action: string;
  payload?: Record<string, unknown>;
}

export interface WhaleActionResponse {
  success: boolean;
  message: string;
  actionId?: string;
}

