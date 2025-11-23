/**
 * Entity vocabulary normalization
 * Maps various entity mentions to controlled vocabulary
 */
const ENTITY_PATTERNS = [
    // Coins
    [/gold[- ]?eagle|american[- ]?eagle|age/i, "coin:gold-eagle"],
    [/maple[- ]?leaf|canadian[- ]?maple/i, "coin:maple"],
    [/krugerrand|krug/i, "coin:krugerrand"],
    [/silver[- ]?eagle|ase/i, "coin:silver-eagle"],
    [/goldback|gold[- ]?back/i, "coin:goldback"],
    [/silver|ag/i, "coin:silver"],
    [/gold|au/i, "coin:gold"],
    // Tokens
    [/bitcoin|btc/i, "token:btc"],
    [/ethereum|eth/i, "token:eth"],
    [/base/i, "token:base"],
    // Toys/Collectibles
    [/labubu/i, "toy:labubu"],
    [/popmart|pop[- ]?mart/i, "toy:popmart"],
    [/cartel/i, "toy:cartel"],
    // NPCs/Characters
    [/tortoise/i, "npc:tortoise"],
    [/predator/i, "npc:predator"],
];
export function normalizeEntity(text) {
    const entities = [];
    for (const [pattern, entity] of ENTITY_PATTERNS) {
        if (pattern.test(text)) {
            entities.push(entity);
        }
    }
    return [...new Set(entities)]; // Deduplicate
}
export function extractTagsFromFilename(filename) {
    const tags = [];
    const lower = filename.toLowerCase();
    // Rule-based tagging from filename
    if (lower.includes("goldback")) {
        tags.push("goldbacks", "bullion");
    }
    if (lower.includes("labubu")) {
        tags.push("labubu", "collectibles", "popmart");
    }
    if (lower.includes("coin") || lower.includes("gold") || lower.includes("silver")) {
        tags.push("coins", "bullion");
    }
    if (lower.includes("dreamnet") || lower.includes("dream-net")) {
        tags.push("dreamnet");
    }
    if (lower.includes("grok")) {
        tags.push("grok", "ai");
    }
    if (lower.includes("sora")) {
        tags.push("sora", "ai", "video");
    }
    return [...new Set(tags)];
}
export function extractTagsFromPrompt(prompt) {
    const tags = [];
    const lower = prompt.toLowerCase();
    // Extract tags from prompt text
    const tagKeywords = {
        goldbacks: ["goldbacks", "bullion", "coins", "silver", "gold", "krugerrand", "maple", "eagle"],
        labubu: ["labubu", "collectibles", "popmart", "toycartel", "instock"],
        dreamnet: ["dreamnet", "grok", "sora", "render", "network", "organism"],
    };
    for (const [category, keywords] of Object.entries(tagKeywords)) {
        if (keywords.some((kw) => lower.includes(kw))) {
            tags.push(category, ...keywords.filter((kw) => lower.includes(kw)));
        }
    }
    return [...new Set(tags)];
}
export const HASHTAG_PRESETS = {
    bullion: ["#Gold", "#Silver", "#Bullion", "#Stackers", "#Coins", "#MapleLeaf", "#Krugerrand", "#GoldEagle", "#Au", "#Ag", "#DreamNet"],
    labubu: ["#Labubu", "#PopMart", "#Collectibles", "#InStock", "#ToyCartel", "#DreamNet"],
    renders: ["#Grok", "#Sora", "#AIArt", "#DreamNet", "#BaseCulture"],
};
export function getHashtagsForTags(tags) {
    const hashtags = [];
    if (tags.some((t) => ["goldbacks", "bullion", "coins", "gold", "silver"].includes(t))) {
        hashtags.push(...HASHTAG_PRESETS.bullion);
    }
    if (tags.some((t) => ["labubu", "collectibles", "popmart"].includes(t))) {
        hashtags.push(...HASHTAG_PRESETS.labubu);
    }
    if (tags.some((t) => ["grok", "sora", "ai", "render"].includes(t))) {
        hashtags.push(...HASHTAG_PRESETS.renders);
    }
    return [...new Set(hashtags)];
}
