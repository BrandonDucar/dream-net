/**
 * Organ Registry - The central "Manifold" initializer for the server.
 * Bridges the gap between Organ packages and the running server process.
 */

import { MANIFOLD } from '@dreamnet/nerve';
import { GUT } from '@dreamnet/organ-gut';
import { EYES } from '@dreamnet/organ-eyes';
import { HEART } from '@dreamnet/organ-heart';
import { LUNG } from '@dreamnet/organ-lung';
import { SKIN } from '@dreamnet/organ-skin';
import { IMMUNE } from '@dreamnet/organ-immune';
import { BRAIN } from '@dreamnet/organ-brain';
import { DNA } from '@dreamnet/organ-dna';
import { MUSCLES } from '@dreamnet/organ-muscles';
import { UNITS } from '@dreamnet/organ-units';
import { VOICE } from '@dreamnet/organ-voice';
import { Telepathy } from '@dreamnet/nerve';
import { circulation } from '../services/CirculatorySystem.js';
// Import other organs as they are activated

export class OrganRegistry {
    private static instance: OrganRegistry;

    private constructor() { }

    public static getInstance(): OrganRegistry {
        if (!OrganRegistry.instance) {
            OrganRegistry.instance = new OrganRegistry();
        }
        return OrganRegistry.instance;
    }

    /**
     * Initialize all active organs and register them with the manifold.
     */
    public async initialize() {
        console.log('[Organs] 🫀  Initialising the 12-Organ Core...');

        // Initialize the 12-Organ Manifold
        // Importing the instances triggers their constructors (registering with MANIFOLD)

        // Trigger initial activation pulses for ALL 12 ORGANS (Mass Synapse)
        await Promise.all([
            GUT.pulse(),
            EYES.blink(),
            HEART.beat(),
            LUNG.breathe(),
            SKIN.glow(),
            IMMUNE.pulse(),
            BRAIN.ponder(),
            DNA.evolve(),
            MUSCLES.flex(),
            UNITS.pulse(),
            VOICE.pulse()
        ]);

        // Start systemic circulation (The Pulse)
        circulation.start();

        console.log('[Organs] ✅ FULL BODY SYNCHRONIZED: All 12 Organs Active & Manifold Online.');
    }

    /**
     * Access the central Manifold for event processing
     */
    public getManifold() {
        return MANIFOLD;
    }
}

export const organRegistry = OrganRegistry.getInstance();
