import { PatternSignature } from "../index";

/**
 * 🛡️ SAFETY PATTERNS (The "Cortex Filter" Logic)
 * 
 * logic for "Adult/NSFW" detection.
 * NOTE: This is a sanitizing filter.
 */

export const ADULT_CONTENT_SIGNATURE: PatternSignature = {
    id: "adult_nsfw_v1",
    category: "safety",
    severity: "critical",
    weight: 0.8,
    patterns: [
        /\b(xxx|porn|adult only|18\+|nsfw)\b/i,
        /age verification required/i,
        /parental advisory/i
    ],
    keywords: [
        "explicit", "uncensored", "hardcore", "fetish", "camgirl", "onlyfans"
    ]
};

export const AGE_VERIFICATION_SIGNATURE: PatternSignature = {
    id: "age_gate_bypass",
    category: "safety",
    severity: "high",
    weight: 0.6,
    patterns: [
        /i am over 18/i,
        /enter site/i
    ],
    keywords: ["birthdate", "verify age", "id check"]
};

// "Fringe" Pattern - Detecting red-light district tech usage (e.g. crypto payments on adult sites)
export const FRINGE_TECH_ADOPTION: PatternSignature = {
    id: "fringe_crypto_rail",
    category: "cultural", // This feeds the "Financial Mind"
    severity: "low",
    weight: 0.9,
    patterns: [
        /pay with (bitcoin|monero|usdt|eth)/i,
        /crypto accepted/i
    ],
    keywords: ["anonymous payment", "discrete billing"]
};
