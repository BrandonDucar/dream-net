/**
 * Incident Runbook Core
 * 
 * P0/P1/P2 incident procedures with hotkeys and pre-baked commands
 * 
 * Features:
 * - Hotkey commands (SAFE_MODE, WRITE_DRAIN, feature flags)
 * - Pre-baked commands (rollback, rotate keys, quarantine, drain DLQ)
 * - Incident classification (P0/P1/P2)
 * - Golden signals monitoring
 */

export {
  enableSafeMode,
  disableSafeMode,
  enableWriteDrain,
  disableWriteDrain,
  disableModule,
  enableModule,
  getHotkeyCommands,
} from './hotkeys';

export {
  rollback,
  rotateKeys,
  quarantineAgent,
  drainDLQ,
  getPreBakedCommands,
} from './commands';

export {
  classifyIncident,
  getResponseTime,
} from './classification';

export type {
  IncidentSeverity,
  Incident,
  GoldenSignals,
  HotkeyCommand,
  PreBakedCommand,
  RunbookProcedure,
  RunbookStep,
} from './types';

import { getHotkeyCommands } from './hotkeys';
import { getPreBakedCommands } from './commands';
import { classifyIncident, getResponseTime } from './classification';

export const IncidentRunbookCore = {
  /**
   * Get hotkey commands
   */
  getHotkeyCommands() {
    return getHotkeyCommands();
  },

  /**
   * Get pre-baked commands
   */
  getPreBakedCommands() {
    return getPreBakedCommands();
  },

  /**
   * Classify incident severity
   */
  classifyIncident(goldenSignals: import('./types').GoldenSignals) {
    return classifyIncident(goldenSignals);
  },

  /**
   * Get response time for severity
   */
  getResponseTime(severity: import('./types').IncidentSeverity) {
    return getResponseTime(severity);
  },
};

export default IncidentRunbookCore;

