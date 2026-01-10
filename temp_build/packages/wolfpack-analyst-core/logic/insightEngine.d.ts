import { FundingLead, SendQueueItem } from "../../wolfpack-funding-core";
import { AnalystInsight, LeadPrediction, EmailEffectiveness } from "../types";
/**
 * Generate insights from current data and learned patterns
 */
export declare function generateInsights(leads: FundingLead[], queueItems: SendQueueItem[], patterns: any[]): AnalystInsight[];
/**
 * Generate predictions for leads
 */
export declare function generatePredictions(leads: FundingLead[], patterns: any[]): LeadPrediction[];
/**
 * Analyze email effectiveness
 */
export declare function analyzeEmailEffectiveness(queueItems: SendQueueItem[], leads: FundingLead[]): EmailEffectiveness[];
