import { ThreadTemplate, SignalThread } from "../types";
/**
 * Ensure default thread templates exist
 */
export declare function ensureDefaultTemplates(): ThreadTemplate[];
/**
 * Find matching template for a thread
 */
export declare function findMatchingTemplate(thread: SignalThread): ThreadTemplate | undefined;
/**
 * Apply template to thread (add execution plan)
 */
export declare function applyTemplateToThread(thread: SignalThread, template: ThreadTemplate): SignalThread;
