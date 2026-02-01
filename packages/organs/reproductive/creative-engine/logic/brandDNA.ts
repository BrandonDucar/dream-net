
/**
 * 🎨 BRAND DNA: The Creative Engine
 * 
 * Inspired by Google Labs "Pomelli".
 * Generates a full Visual Identity from a single seed/name.
 */

export interface BrandProfile {
    name: string;
    primaryColor: string; // Hex
    accentColor: string;  // Hex
    fontPairing: string;  // Header / Body
    tone: string;         // Voice
}

export class BrandDNA {

    static generate(seed: string): BrandProfile {
        console.log(`🎨 [Creative] Generating DNA for: ${seed}`);

        // Deterministic pseudo-random based on seed length (Mocking deep AI)
        const isTech = seed.toLowerCase().includes("tech") || seed.toLowerCase().includes("net");
        const isBio = seed.toLowerCase().includes("bio") || seed.toLowerCase().includes("life");

        if (isBio) {
            return {
                name: seed,
                primaryColor: "#2ECC71", // Emerald
                accentColor: "#F1C40F",  // Sun
                fontPairing: "Inter / Merriweather",
                tone: "Organic, Nurturing, Scientific"
            };
        }

        if (isTech) {
            return {
                name: seed,
                primaryColor: "#00D4FF", // Spectral Cyan (DreamNet Native)
                accentColor: "#8E44AD",  // Void Purple
                fontPairing: "JetBrains Mono / Inter",
                tone: "Precise, Futurist, Sovereign"
            };
        }

        // Default / Consumer
        return {
            name: seed,
            primaryColor: "#FF5733", // Vibrant Orange
            accentColor: "#C70039",  // Deep Red
            fontPairing: "Montserrat / Roboto",
            tone: "Bold, Energetic, Human"
        };
    }
}
