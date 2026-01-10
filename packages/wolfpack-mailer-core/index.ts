import { MailerConfig, MailSendResult } from './types.js';
import { createMailerFromEnv, sendMail } from './logic/mailer.js';
import { processSendQueueOnce } from './logic/sendLoop.js';
import * as rateLimiter from './logic/rateLimiter.js';

export const WolfPackMailerCore = {
  createMailerFromEnv,
  sendMail,
  processSendQueueOnce,
  // Rate limiter utilities (for testing/monitoring)
  rateLimiter,
};

export * from './types.js';
export default WolfPackMailerCore;

