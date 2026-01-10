"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateDreamScore = calculateDreamScore;
function calculateDreamScore(dream) {
    var breakdown = {
        originality: calculateOriginalityScore(dream),
        traction: calculateTractionScore(dream),
        collaboration: calculateCollaborationScore(dream),
        updates: calculateUpdatesScore(dream)
    };
    var dreamScore = breakdown.originality + breakdown.traction + breakdown.collaboration + breakdown.updates;
    return { dreamScore: dreamScore, scoreBreakdown: breakdown };
}
function calculateOriginalityScore(dream) {
    // Originality = NLP model checks for uniqueness
    // Use the uniquenessScore from NLP analysis, with fallback calculation
    if (dream.uniquenessScore !== null && dream.uniquenessScore !== undefined) {
        // Convert uniqueness score (0-100) to our 0-25 scale
        return Math.min(Math.round(dream.uniquenessScore * 0.25), 25);
    }
    // Fallback: Basic uniqueness estimation based on content analysis
    var score = 0;
    // Penalty for common words (less original)
    var commonWords = ['app', 'website', 'platform', 'system', 'tool', 'simple', 'basic'];
    var commonWordPenalty = commonWords.filter(function (word) {
        return dream.description.toLowerCase().includes(word) ||
            dream.title.toLowerCase().includes(word);
    }).length * 2; // -2 points per common word
    // Bonus for technical/innovative terms
    var innovativeTerms = [
        'ai', 'blockchain', 'machine learning', 'neural', 'algorithm', 'decentralized',
        'autonomous', 'quantum', 'virtual reality', 'augmented reality', 'iot'
    ];
    var innovativeBonus = innovativeTerms.filter(function (term) {
        return dream.description.toLowerCase().includes(term) ||
            dream.title.toLowerCase().includes(term);
    }).length * 3; // +3 points per innovative term
    // Base score from description complexity and length
    var baseScore = Math.min(dream.description.length / 20, 15); // Max 15 from length
    score = Math.max(0, Math.min(baseScore + innovativeBonus - commonWordPenalty, 25));
    return Math.round(score);
}
function calculateTractionScore(dream) {
    // Traction = views + likes + comments
    var views = dream.views || 0;
    var likes = dream.likes || 0;
    var comments = dream.comments || 0;
    // Weight the different engagement metrics
    var viewPoints = Math.min(views / 10, 10); // 1 point per 10 views, max 10 points
    var likePoints = Math.min(likes * 0.5, 10); // 0.5 points per like, max 10 points  
    var commentPoints = Math.min(comments * 1, 5); // 1 point per comment, max 5 points
    var totalScore = viewPoints + likePoints + commentPoints;
    return Math.min(Math.round(totalScore), 25);
}
function calculateCollaborationScore(dream) {
    // Collaboration = number of active contributors
    var contributors = dream.contributors || [];
    var activeContributors = contributors.length;
    // 3 points per active contributor, max 25 points
    var collaborationScore = Math.min(activeContributors * 3, 25);
    return Math.round(collaborationScore);
}
function calculateUpdatesScore(dream) {
    // Updates = # of edits or status changes over time
    var editCount = dream.editCount || 0;
    // 2 points per edit, max 20 points
    var score = Math.min(editCount * 2, 20);
    // Bonus for recent activity (last 30 days)
    var daysSinceCreated = (Date.now() - new Date(dream.createdAt).getTime()) / (1000 * 60 * 60 * 24);
    if (daysSinceCreated <= 30 && editCount > 0) {
        score += 5; // +5 bonus for recent edits
    }
    return Math.min(Math.round(score), 25);
}
