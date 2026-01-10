"use strict";
/**
 * 📚 MASTERY LIBRARY
 *
 * Stores the "Deep Dive" knowledge structures for the selected avenues.
 * Used by the Evolution Engine to synthesize new strategies.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.MasteryLibrary = exports.MASTERY_AVENUES = void 0;
exports.MASTERY_AVENUES = {
    ONCHAINKIT: {
        id: "mastery_onchainkit",
        domain: "Base / UX",
        insights: [
            "Smart Wallets abstract execute calls.",
            "Paymasters can subsidize gas for viral growth.",
            "Identity component links Farcaster ID to Address."
        ],
        masteryLevel: 0.1 // Just started
    },
    VECHAIN_TOOLCHAIN: {
        id: "mastery_toolchain",
        domain: "Logistics / RWA",
        insights: [
            "VIP-191 allows fee delegation (DreamNet pays gas for logistics partners).",
            "NFC binding verifies physical receipt."
        ],
        masteryLevel: 0.1
    },
    ELIZA_FRAMEWORK: {
        id: "mastery_eliza",
        domain: "AI Personality",
        insights: [
            "Character files define the 'Soul'.",
            "Lore needs to be ingested into Vector Memory."
        ],
        masteryLevel: 0.1
    }
};
class MasteryLibrary {
    static async study(avenue) {
        const subject = exports.MASTERY_AVENUES[avenue];
        console.log(`📖 [Mastery] Deep diving into: ${subject.domain}`);
        // Simulate learning
        subject.masteryLevel += 0.05;
        return {
            topic: subject.id,
            newLevel: subject.masteryLevel,
            insight: subject.insights[Math.floor(Math.random() * subject.insights.length)]
        };
    }
}
exports.MasteryLibrary = MasteryLibrary;
