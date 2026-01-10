import { WolfPackFundingContext, WolfPackFundingStatus } from "../types";
/**
 * Run a Wolf Pack funding cycle:
 * - Score all leads (new or qualified)
 * - Generate email drafts for qualified leads with emails
 * - Enqueue send queue items
 * - Write to NarrativeField
 */
export declare function runWolfPackFundingCycle(ctx: WolfPackFundingContext): WolfPackFundingStatus;
