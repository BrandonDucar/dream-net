"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WolfPackFundingCore = void 0;
const fundingStore_1 = require("./store/fundingStore");
const fundingScheduler_1 = require("./scheduler/fundingScheduler");
const emailDraftEngine_1 = require("./logic/emailDraftEngine");
const emailDraftEngineEnhanced_1 = require("./logic/emailDraftEngineEnhanced");
exports.WolfPackFundingCore = {
    // Leads
    // TODO (Phase 4): Add identityId parameter for ownership/permissions
    // Example: upsertLead(partial, identityId?: string)
    upsertLead(partial) {
        // TODO: When identityId is provided, validate agent ownership via IdentityGrid
        // import { identityControlsAgent } from "@dreamnet/shared/identity";
        // if (identityId && !identityControlsAgent(identityId, "agent:WolfPackFunding")) {
        //   throw new Error("Identity does not control WolfPackFunding agent");
        // }
        return fundingStore_1.FundingStore.upsertLead(partial);
    },
    listLeads() {
        return fundingStore_1.FundingStore.listLeads();
    },
    getLead(id) {
        return fundingStore_1.FundingStore.getLead(id);
    },
    // Send Queue
    listQueue() {
        return fundingStore_1.FundingStore.listQueue();
    },
    updateQueueItemStatus(id, status, error) {
        fundingStore_1.FundingStore.updateQueueItemStatus(id, status, error);
    },
    // Email Drafts
    generateEmailDraftForLead(lead, opts) {
        return (0, emailDraftEngine_1.generateEmailDraftForLead)(lead, opts);
    },
    // Email Drafts with Inbox² (Enhanced)
    /**
     * Generate intelligent email draft using Inbox²'s four layers:
     * 1. Research Engine - Gathers 3-5 credible facts
     * 2. SEO + Relevance - Finds trending topics
     * 3. Geo Awareness - Location/event personalization
     * 4. Learning Loop - Engagement-based improvement
     */
    async generateEmailDraftWithInboxSquared(lead, opts) {
        if (opts.useInboxSquared !== false) {
            try {
                return await (0, emailDraftEngineEnhanced_1.generateEmailDraftForLeadEnhanced)(lead, opts);
            }
            catch (error) {
                console.warn('[Wolf Pack] Inbox² draft generation failed, falling back to basic:', error);
            }
        }
        return (0, emailDraftEngine_1.generateEmailDraftForLead)(lead, opts);
    },
    // Grant Drafts (C)
    listGrantDrafts() {
        return fundingStore_1.FundingStore.listGrantDrafts();
    },
    listGrantDraftsForLead(leadId) {
        return fundingStore_1.FundingStore.listGrantDraftsForLead(leadId);
    },
    getGrantDraft(id) {
        return fundingStore_1.FundingStore.getGrantDraft(id);
    },
    // Orchestration
    run(context) {
        return (0, fundingScheduler_1.runWolfPackFundingCycle)(context);
    },
    status() {
        return fundingStore_1.FundingStore.getStatus();
    },
};
__exportStar(require("./types"), exports);
__exportStar(require("./adapters/fundingStatusAdapter"), exports);
__exportStar(require("./logic/grantDraftEngine"), exports);
__exportStar(require("./logic/followUpDraftEngine"), exports);
__exportStar(require("./logic/emailDraftEngineEnhanced"), exports);
exports.default = exports.WolfPackFundingCore;
