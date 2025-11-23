import { FundingLead, WolfPackFundingContext } from "../types";
/**
 * Score a lead using heuristics and ecosystem context.
 * Returns an updated FundingLead with all scores computed.
 */
export declare function scoreLead(ctx: WolfPackFundingContext, lead: FundingLead): FundingLead;
