import { createMailerFromEnv, sendMail } from "./logic/mailer";
import { processSendQueueOnce } from "./logic/sendLoop";
import * as rateLimiter from "./logic/rateLimiter";
export declare const WolfPackMailerCore: {
    createMailerFromEnv: typeof createMailerFromEnv;
    sendMail: typeof sendMail;
    processSendQueueOnce: typeof processSendQueueOnce;
    rateLimiter: typeof rateLimiter;
};
export * from "./types";
export default WolfPackMailerCore;
