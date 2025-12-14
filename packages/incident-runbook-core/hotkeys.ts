/**
 * Hotkey Commands
 * 
 * SAFE_MODE, WRITE_DRAIN, feature flags, traffic shaping
 */

import { DreamNetControlCore } from '@dreamnet/dreamnet-control-core';
import { nervousMessageBus } from '@dreamnet/nervous-system-core/messageBus';
import type { HotkeyCommand } from './types';

/**
 * Enable SAFE_MODE (disable tool use and external calls)
 */
export async function enableSafeMode(reason?: string): Promise<void> {
  // Set feature flags
  DreamNetControlCore.setFeatureFlag('safe_mode', true);
  DreamNetControlCore.setFeatureFlag('tool_use', false);
  DreamNetControlCore.setFeatureFlag('external_calls', false);
  
  // Publish event
  nervousMessageBus.publish({
    id: `safe-mode-enabled-${Date.now()}`,
    ts: Date.now(),
    role: 'system',
    topic: 'alert',
    payload: {
      type: 'safe_mode_enabled',
      reason,
    },
  });
  
  console.log(`[Hotkeys] SAFE_MODE enabled${reason ? `: ${reason}` : ''}`);
}

/**
 * Disable SAFE_MODE
 */
export async function disableSafeMode(reason?: string): Promise<void> {
  DreamNetControlCore.setFeatureFlag('safe_mode', false);
  DreamNetControlCore.setFeatureFlag('tool_use', true);
  DreamNetControlCore.setFeatureFlag('external_calls', true);
  
  nervousMessageBus.publish({
    id: `safe-mode-disabled-${Date.now()}`,
    ts: Date.now(),
    role: 'system',
    topic: 'alert',
    payload: {
      type: 'safe_mode_disabled',
      reason,
    },
  });
  
  console.log(`[Hotkeys] SAFE_MODE disabled${reason ? `: ${reason}` : ''}`);
}

/**
 * Enable WRITE_DRAIN (reject new writes, keep reads)
 */
export async function enableWriteDrain(reason?: string): Promise<void> {
  DreamNetControlCore.setFeatureFlag('write_drain', true);
  
  nervousMessageBus.publish({
    id: `write-drain-enabled-${Date.now()}`,
    ts: Date.now(),
    role: 'system',
    topic: 'alert',
    payload: {
      type: 'write_drain_enabled',
      reason,
    },
  });
  
  console.log(`[Hotkeys] WRITE_DRAIN enabled${reason ? `: ${reason}` : ''}`);
}

/**
 * Disable WRITE_DRAIN
 */
export async function disableWriteDrain(reason?: string): Promise<void> {
  DreamNetControlCore.setFeatureFlag('write_drain', false);
  
  nervousMessageBus.publish({
    id: `write-drain-disabled-${Date.now()}`,
    ts: Date.now(),
    role: 'system',
    topic: 'alert',
    payload: {
      type: 'write_drain_disabled',
      reason,
    },
  });
  
  console.log(`[Hotkeys] WRITE_DRAIN disabled${reason ? `: ${reason}` : ''}`);
}

/**
 * Disable module (kill-switch)
 */
export async function disableModule(module: string, reason?: string): Promise<void> {
  DreamNetControlCore.setFeatureFlag(`module:${module}`, false);
  
  nervousMessageBus.publish({
    id: `module-disabled-${Date.now()}`,
    ts: Date.now(),
    role: 'system',
    topic: 'alert',
    payload: {
      type: 'module_disabled',
      module,
      reason,
    },
  });
  
  console.log(`[Hotkeys] Module ${module} disabled${reason ? `: ${reason}` : ''}`);
}

/**
 * Enable module
 */
export async function enableModule(module: string, reason?: string): Promise<void> {
  DreamNetControlCore.setFeatureFlag(`module:${module}`, true);
  
  nervousMessageBus.publish({
    id: `module-enabled-${Date.now()}`,
    ts: Date.now(),
    role: 'system',
    topic: 'alert',
    payload: {
      type: 'module_enabled',
      module,
      reason,
    },
  });
  
  console.log(`[Hotkeys] Module ${module} enabled${reason ? `: ${reason}` : ''}`);
}

/**
 * Get all hotkey commands
 */
export function getHotkeyCommands(): HotkeyCommand[] {
  return [
    {
      id: 'safe_mode',
      name: 'SAFE_MODE',
      description: 'Disable tool use and external calls',
      execute: () => enableSafeMode(),
      severity: ['P0', 'P1'],
    },
    {
      id: 'write_drain',
      name: 'WRITE_DRAIN',
      description: 'Reject new writes, keep reads',
      execute: () => enableWriteDrain(),
      severity: ['P0', 'P1'],
    },
    {
      id: 'disable_module',
      name: 'DISABLE_MODULE',
      description: 'Disable a specific module',
      execute: async () => {
        // Would need module name as parameter
        await disableModule('unknown');
      },
      severity: ['P0', 'P1', 'P2'],
    },
  ];
}

