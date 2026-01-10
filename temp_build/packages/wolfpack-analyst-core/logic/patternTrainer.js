"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.trainOnLeadScoring = trainOnLeadScoring;
exports.trainOnEmailEffectiveness = trainOnEmailEffectiveness;
const analystStore_1 = require("../store/analystStore");
/**
 * Train on lead scoring patterns
 */
function trainOnLeadScoring(leads) {
    const patterns = [];
    const now = Date.now();
    // Pattern 1: High dreamFitScore correlates with qualification
    const qualifiedLeads = leads.filter((l) => l.stage === "qualified" || l.stage === "hot");
    const highFitQualified = qualifiedLeads.filter((l) => (l.dreamFitScore ?? 0) > 0.7);
    if (highFitQualified.length > 0) {
        const confidence = Math.min(1, highFitQualified.length / Math.max(1, qualifiedLeads.length));
        patterns.push({
            id: `pattern:high-fit-qualifies-${now}`,
            type: "lead_quality",
            pattern: "Leads with dreamFitScore > 0.7 are more likely to qualify",
            confidence,
            evidence: {
                sampleSize: highFitQualified.length,
                successRate: confidence,
                examples: highFitQualified.slice(0, 5).map((l) => l.id),
            },
            createdAt: now,
            lastValidated: now,
        });
    }
    // Pattern 2: VC leads progress faster than other types
    const vcLeads = leads.filter((l) => l.type === "vc");
    const vcHot = vcLeads.filter((l) => l.stage === "hot" || l.stage === "replied");
    if (vcHot.length > 0 && vcLeads.length > 0) {
        const vcProgressRate = vcHot.length / vcLeads.length;
        const otherLeads = leads.filter((l) => l.type !== "vc");
        const otherHot = otherLeads.filter((l) => l.stage === "hot" || l.stage === "replied");
        const otherProgressRate = otherHot.length / Math.max(1, otherLeads.length);
        if (vcProgressRate > otherProgressRate * 1.2) {
            patterns.push({
                id: `pattern:vc-progresses-faster-${now}`,
                type: "stage_progression",
                pattern: "VC leads progress to 'hot' or 'replied' faster than other lead types",
                confidence: Math.min(1, (vcProgressRate - otherProgressRate) / 0.5),
                evidence: {
                    sampleSize: vcLeads.length,
                    successRate: vcProgressRate,
                    examples: vcHot.slice(0, 5).map((l) => l.id),
                },
                createdAt: now,
                lastValidated: now,
            });
        }
    }
    // Pattern 3: High priorityScore leads get contacted sooner
    const highPriority = leads.filter((l) => (l.priorityScore ?? 0) > 0.8);
    const highPriorityContacted = highPriority.filter((l) => l.stage !== "new" && l.stage !== "dead");
    if (highPriorityContacted.length > 0 && highPriority.length > 0) {
        const contactRate = highPriorityContacted.length / highPriority.length;
        patterns.push({
            id: `pattern:high-priority-contacted-${now}`,
            type: "scoring_correlation",
            pattern: "Leads with priorityScore > 0.8 are prioritized for contact",
            confidence: contactRate,
            evidence: {
                sampleSize: highPriority.length,
                successRate: contactRate,
                examples: highPriorityContacted.slice(0, 5).map((l) => l.id),
            },
            createdAt: now,
            lastValidated: now,
        });
    }
    // Pattern 4: Leads with email addresses progress faster
    const withEmail = leads.filter((l) => l.email);
    const withEmailContacted = withEmail.filter((l) => l.stage !== "new");
    const withoutEmail = leads.filter((l) => !l.email);
    const withoutEmailContacted = withoutEmail.filter((l) => l.stage !== "new");
    if (withEmail.length > 0 && withoutEmail.length > 0) {
        const withEmailRate = withEmailContacted.length / withEmail.length;
        const withoutEmailRate = withoutEmailContacted.length / Math.max(1, withoutEmail.length);
        if (withEmailRate > withoutEmailRate * 1.3) {
            patterns.push({
                id: `pattern:email-accelerates-${now}`,
                type: "stage_progression",
                pattern: "Leads with email addresses progress faster than those without",
                confidence: Math.min(1, (withEmailRate - withoutEmailRate) / 0.4),
                evidence: {
                    sampleSize: withEmail.length,
                    successRate: withEmailRate,
                    examples: withEmailContacted.slice(0, 5).map((l) => l.id),
                },
                createdAt: now,
                lastValidated: now,
            });
        }
    }
    // Store patterns
    patterns.forEach((p) => analystStore_1.AnalystStore.upsertPattern(p));
    return patterns;
}
/**
 * Train on email effectiveness patterns
 */
function trainOnEmailEffectiveness(queueItems, leads) {
    const patterns = [];
    const now = Date.now();
    // Pattern: Sent emails that led to replies
    const sentEmails = queueItems.filter((q) => q.status === "sent");
    const repliedLeads = leads.filter((l) => l.stage === "replied" || l.stage === "hot");
    if (sentEmails.length > 0 && repliedLeads.length > 0) {
        // Find leads that were emailed and then replied
        const emailedLeadIds = new Set(sentEmails.map((q) => q.leadId));
        const repliedAfterEmail = repliedLeads.filter((l) => emailedLeadIds.has(l.id));
        if (repliedAfterEmail.length > 0) {
            const replyRate = repliedAfterEmail.length / sentEmails.length;
            patterns.push({
                id: `pattern:email-reply-rate-${now}`,
                type: "email_effectiveness",
                pattern: `Email response rate: ${(replyRate * 100).toFixed(1)}% of sent emails lead to replies`,
                confidence: Math.min(1, replyRate * 2), // Scale confidence
                evidence: {
                    sampleSize: sentEmails.length,
                    successRate: replyRate,
                    examples: repliedAfterEmail.slice(0, 5).map((l) => l.id),
                },
                createdAt: now,
                lastValidated: now,
            });
        }
    }
    // Pattern: Subject line length correlation (if we can infer from subject)
    const shortSubjects = sentEmails.filter((q) => q.subject.length < 50);
    const longSubjects = sentEmails.filter((q) => q.subject.length >= 50);
    if (shortSubjects.length > 0 && longSubjects.length > 0) {
        const shortSubjectLeadIds = new Set(shortSubjects.map((q) => q.leadId));
        const longSubjectLeadIds = new Set(longSubjects.map((q) => q.leadId));
        const shortReplied = repliedLeads.filter((l) => shortSubjectLeadIds.has(l.id)).length;
        const longReplied = repliedLeads.filter((l) => longSubjectLeadIds.has(l.id)).length;
        const shortRate = shortReplied / shortSubjects.length;
        const longRate = longReplied / longSubjects.length;
        if (Math.abs(shortRate - longRate) > 0.1) {
            const better = shortRate > longRate ? "short" : "long";
            patterns.push({
                id: `pattern:subject-length-${now}`,
                type: "email_effectiveness",
                pattern: `${better} subject lines (${better === "short" ? "<50" : ">=50"} chars) correlate with higher reply rates`,
                confidence: Math.min(1, Math.abs(shortRate - longRate) * 2),
                evidence: {
                    sampleSize: sentEmails.length,
                    successRate: better === "short" ? shortRate : longRate,
                    examples: (better === "short" ? shortSubjects : longSubjects)
                        .slice(0, 5)
                        .map((q) => q.leadId),
                },
                createdAt: now,
                lastValidated: now,
            });
        }
    }
    // Store patterns
    patterns.forEach((p) => analystStore_1.AnalystStore.upsertPattern(p));
    return patterns;
}
