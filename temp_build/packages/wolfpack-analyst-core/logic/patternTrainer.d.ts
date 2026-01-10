import { FundingLead, SendQueueItem } from "../../wolfpack-funding-core";
import { LearnedPattern } from "../types";
/**
 * Train on lead scoring patterns
 */
export declare function trainOnLeadScoring(leads: FundingLead[]): LearnedPattern[];
/**
 * Train on email effectiveness patterns
 */
export declare function trainOnEmailEffectiveness(queueItems: SendQueueItem[], leads: FundingLead[]): LearnedPattern[];
