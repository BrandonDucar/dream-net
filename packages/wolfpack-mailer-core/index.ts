import { MailerConfig, MailSendResult } from "./types";
import { createMailerFromEnv, sendMail } from "./logic/mailer";
import { processSendQueueOnce } from "./logic/sendLoop";
import * as rateLimiter from "./logic/rateLimiter";

export const WolfPackMailerCore = {
  createMailerFromEnv,
  sendMail,
  processSendQueueOnce,
  // Rate limiter utilities (for testing/monitoring)
  rateLimiter,
};

export * from "./types";
export default WolfPackMailerCore;

