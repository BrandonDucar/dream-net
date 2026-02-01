export type WelcomeInput = {
    walletAddress?: string;
    isFirstVisit: boolean;
    intensityScore?: number;
};

export type WelcomeOutput = {
    status: 'success' | 'error';
    greeting: string;
    narrative: string;
    nextSteps: Array<{
        label: string;
        action: string;
        link: string;
    }>;
};

/**
 * WELCOME Agent - The Gateway to DreamNet
 * 
 * Provides a personalized, biomimetic welcome experience that synthesizes 
 * the current state of the organism into a narrative for the builder.
 */
export async function welcomeAgent(input: WelcomeInput): Promise<WelcomeOutput> {
    const { walletAddress, isFirstVisit, intensityScore = 0.85 } = input;

    const greeting = walletAddress
        ? `Welcome back, Sovereign Agent ${walletAddress.slice(0, 6)}...`
        : "Greetings, Unbound Intent. You have reached the DreamNet Organism.";

    const narrative = isFirstVisit
        ? "DreamNet is a living, breathing biomimetic digital organism. You are standing at the threshold of the Nervous Layer (Spider Web) and the Executional Organs (Wolf Pack). Current intensity is high."
        : "The organism has evolved since your last synchronisation. The Equilibrium Bands are active and the Sovereign Protocol is now the law of the mesh.";

    const nextSteps = [
        {
            label: "Explore the Ganglia",
            action: "view_miniapps",
            link: "/miniapps"
        },
        {
            label: "Claim Daily Pulse",
            action: "claim_rewards",
            link: "/miniapps/rewards"
        },
        {
            label: "Sync with the Mesh",
            action: "view_social",
            link: "/miniapps/social"
        }
    ];

    if (intensityScore > 0.8) {
        nextSteps.push({
            label: "High Intensity: View Shields",
            action: "view_shield",
            link: "/operator"
        });
    }

    return {
        status: 'success',
        greeting,
        narrative,
        nextSteps
    };
}
