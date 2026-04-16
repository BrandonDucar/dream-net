/**
 * Whale Pack Actions Handler
 * Processes actions and updates system state
 */

import { MiniAppId, WhaleActionResponse } from './types';

// In-memory action state (would be in DB/Redis in production)
const actionState: Record<string, Record<string, any>> = {};

/**
 * Process a Whale Pack action
 */
export async function processWhaleAction(
  appId: MiniAppId,
  action: string,
  payload: Record<string, unknown>
): Promise<WhaleActionResponse> {
  console.log(`[WhalePack] Processing action: ${appId}.${action}`, payload);

  try {
    switch (`${appId}.${action}`) {
      case 'governance.highlightCreateProposal':
        return await handleHighlightCreateProposal(payload);
      
      case 'onboarding.increasePriority':
        return await handleIncreasePriority(payload);
      
      case 'prediction.highlightCreateMarket':
        return await handleHighlightCreateMarket(payload);
      
      default:
        // Generic action handler
        return await handleGenericAction(appId, action, payload);
    }
  } catch (err: any) {
    console.error(`[WhalePack] Action failed: ${appId}.${action}`, err);
    return {
      success: false,
      message: err.message || 'Action failed',
    };
  }
}

/**
 * Get current action state for an app
 */
export function getActionState(appId: MiniAppId): Record<string, any> {
  return actionState[appId] || {};
}

/**
 * Set action state for an app
 */
export function setActionState(appId: MiniAppId, state: Record<string, any>): void {
  actionState[appId] = { ...actionState[appId], ...state };
}

async function handleHighlightCreateProposal(payload: Record<string, unknown>): Promise<WhaleActionResponse> {
  setActionState('governance', {
    highlightCreateProposal: true,
    highlightUntil: Date.now() + (payload.duration as number || 3600000), // 1 hour default
    ...payload,
  });

  return {
    success: true,
    message: 'Governance create proposal highlighted',
    actionId: `governance.highlightCreateProposal.${Date.now()}`,
  };
}

async function handleIncreasePriority(payload: Record<string, unknown>): Promise<WhaleActionResponse> {
  const priority = (payload.priority as number) || 1;
  setActionState('onboarding', {
    priority,
    priorityUntil: Date.now() + (payload.duration as number || 7200000), // 2 hours default
    ...payload,
  });

  return {
    success: true,
    message: `Onboarding priority increased to ${priority}`,
    actionId: `onboarding.increasePriority.${Date.now()}`,
  };
}

async function handleHighlightCreateMarket(payload: Record<string, unknown>): Promise<WhaleActionResponse> {
  setActionState('prediction', {
    highlightCreateMarket: true,
    highlightUntil: Date.now() + (payload.duration as number || 3600000), // 1 hour default
    ...payload,
  });

  return {
    success: true,
    message: 'Prediction create market highlighted',
    actionId: `prediction.highlightCreateMarket.${Date.now()}`,
  };
}

async function handleGenericAction(
  appId: MiniAppId,
  action: string,
  payload: Record<string, unknown>
): Promise<WhaleActionResponse> {
  // Store generic action state
  const currentState = getActionState(appId);
  setActionState(appId, {
    ...currentState,
    [action]: {
      ...payload,
      timestamp: Date.now(),
    },
  });

  return {
    success: true,
    message: `Action ${action} processed for ${appId}`,
    actionId: `${appId}.${action}.${Date.now()}`,
  };
}

