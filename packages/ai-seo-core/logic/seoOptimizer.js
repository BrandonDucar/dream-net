import { SEOStore } from "../store/seoStore";
let optimizationCounter = 0;
function nextOptimizationId() {
    optimizationCounter += 1;
    return `seo:opt:${Date.now()}:${optimizationCounter}`;
}
/**
 * Optimize content for SEO
 */
export function optimizeContent(contentType, contentId, platform, title, description) {
    const now = Date.now();
    // Extract keywords from title/description
    const keywords = extractKeywords(title || "", description || "");
    // Generate SEO-optimized title and description
    const optimizedTitle = optimizeTitle(title || contentType, platform, keywords);
    const optimizedDescription = optimizeDescription(description || "", platform, keywords);
    // Calculate SEO score
    const score = calculateSEOScore(optimizedTitle, optimizedDescription, keywords, platform);
    // Generate meta tags
    const metaTags = generateMetaTags(keywords, platform);
    // Generate structured data
    const structuredData = generateStructuredData(contentType, contentId, optimizedTitle, optimizedDescription);
    const optimization = {
        id: nextOptimizationId(),
        contentType,
        contentId,
        platform,
        title: optimizedTitle,
        description: optimizedDescription,
        keywords,
        metaTags,
        structuredData,
        score,
        optimizedAt: now,
        lastUpdated: now,
    };
    SEOStore.addOptimization(optimization);
    return optimization;
}
/**
 * Extract keywords from text
 */
function extractKeywords(title, description) {
    const text = `${title} ${description}`.toLowerCase();
    const words = text.split(/\s+/).filter((w) => w.length > 3);
    // DreamNet-specific keywords
    const dreamNetKeywords = [
        "dreamnet", "dream net", "multi-agent", "biomimetic", "blockchain", "base",
        "ai", "agents", "wolf pack", "whale pack", "orca pack", "funding", "dao",
        "web3", "crypto", "decentralized", "autonomous", "self-governing",
    ];
    const keywords = [];
    const seen = new Set();
    for (const keyword of dreamNetKeywords) {
        if (text.includes(keyword.toLowerCase()) && !seen.has(keyword)) {
            seen.add(keyword);
            keywords.push({
                keyword,
                difficulty: 0.3, // DreamNet is niche, easier to rank
                volume: estimateVolume(keyword),
                intent: determineIntent(keyword),
                relevance: 1.0, // Always relevant to DreamNet
                discoveredAt: Date.now(),
            });
            SEOStore.addKeyword(keywords[keywords.length - 1]);
        }
    }
    // Extract other relevant keywords
    for (const word of words) {
        if (!seen.has(word) && isRelevantKeyword(word)) {
            seen.add(word);
            keywords.push({
                keyword: word,
                difficulty: 0.5,
                volume: estimateVolume(word),
                intent: "informational",
                relevance: 0.6,
                discoveredAt: Date.now(),
            });
            SEOStore.addKeyword(keywords[keywords.length - 1]);
        }
    }
    return keywords;
}
/**
 * Optimize title for platform
 */
function optimizeTitle(title, platform, keywords) {
    const maxLength = {
        web: 60,
        twitter: 280,
        farcaster: 320,
        instagram: 150,
        tiktok: 150,
        youtube: 100,
        linkedin: 150,
    };
    let optimized = title;
    const maxLen = maxLength[platform] || 60;
    // Add top keyword if not present
    if (keywords.length > 0 && !title.toLowerCase().includes(keywords[0].keyword.toLowerCase())) {
        optimized = `${keywords[0].keyword} | ${title}`;
    }
    // Truncate if needed
    if (optimized.length > maxLen) {
        optimized = optimized.substring(0, maxLen - 3) + "...";
    }
    return optimized;
}
/**
 * Optimize description for platform
 */
function optimizeDescription(description, platform, keywords) {
    const maxLength = {
        web: 160,
        twitter: 280,
        farcaster: 320,
        instagram: 2200,
        tiktok: 2200,
        youtube: 5000,
        linkedin: 3000,
    };
    let optimized = description;
    const maxLen = maxLength[platform] || 160;
    // Include top keywords naturally
    if (keywords.length > 0 && !description.toLowerCase().includes(keywords[0].keyword.toLowerCase())) {
        optimized = `${description} ${keywords[0].keyword}.`;
    }
    if (optimized.length > maxLen) {
        optimized = optimized.substring(0, maxLen - 3) + "...";
    }
    return optimized;
}
/**
 * Calculate SEO score
 */
function calculateSEOScore(title, description, keywords, platform) {
    let score = 0;
    // Title optimization (30 points)
    if (title.length > 0 && title.length <= 60)
        score += 30;
    else if (title.length > 60)
        score += 20;
    // Description optimization (25 points)
    if (description.length >= 120 && description.length <= 160)
        score += 25;
    else if (description.length > 0)
        score += 15;
    // Keyword usage (25 points)
    if (keywords.length >= 3)
        score += 25;
    else if (keywords.length > 0)
        score += 15;
    // Keyword relevance (20 points)
    const avgRelevance = keywords.length > 0
        ? keywords.reduce((sum, k) => sum + k.relevance, 0) / keywords.length
        : 0;
    score += avgRelevance * 20;
    return Math.min(100, Math.round(score));
}
/**
 * Generate meta tags
 */
function generateMetaTags(keywords, platform) {
    const tags = [];
    // Add top keywords as tags
    keywords.slice(0, 10).forEach((k) => {
        tags.push(k.keyword);
    });
    // Platform-specific tags
    if (platform === "web") {
        tags.push("dreamnet", "ai", "blockchain", "web3", "dao");
    }
    return tags;
}
/**
 * Generate structured data
 */
function generateStructuredData(contentType, contentId, title, description) {
    return {
        "@context": "https://schema.org",
        "@type": contentType === "product" ? "Product" : contentType === "post" ? "BlogPosting" : "WebPage",
        name: title,
        description,
        identifier: contentId,
    };
}
// Helper functions
function estimateVolume(keyword) {
    // Simple estimation (in real system, would use SEO API)
    const dreamNetTerms = ["dreamnet", "dream net", "wolf pack", "whale pack"];
    if (dreamNetTerms.some((term) => keyword.toLowerCase().includes(term))) {
        return 100; // Low volume for niche terms
    }
    return 1000; // Medium volume for general terms
}
function determineIntent(keyword) {
    const commercial = ["funding", "invest", "buy", "sell", "token"];
    const transactional = ["apply", "join", "signup", "register"];
    const navigational = ["dreamnet", "dream net", "home", "about"];
    const lower = keyword.toLowerCase();
    if (commercial.some((term) => lower.includes(term)))
        return "commercial";
    if (transactional.some((term) => lower.includes(term)))
        return "transactional";
    if (navigational.some((term) => lower.includes(term)))
        return "navigational";
    return "informational";
}
function isRelevantKeyword(word) {
    // Filter out common words
    const stopWords = ["the", "and", "for", "are", "but", "not", "you", "all", "can", "her", "was", "one", "our", "out", "day", "get", "has", "him", "his", "how", "its", "may", "new", "now", "old", "see", "two", "way", "who", "boy", "did", "its", "let", "put", "say", "she", "too", "use"];
    return !stopWords.includes(word) && word.length > 3;
}
