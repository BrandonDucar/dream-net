/**
 * DreamNet Medical Team - Specialized Agents for Systemic Health
 */

import { type ClusterId } from "../types.js";

export interface MedicalSpecialist {
    id: string;
    name: string;
    specialty: "PATHOLOGY" | "SURGERY" | "IMMUNOLOGY" | "PSYCHOLOGY" | "VITAL_SIGNS";
    clusterId: ClusterId;
    description: string;
}

export const DREAMNET_MEDICAL_TEAM: Record<string, MedicalSpecialist> = {
    DR_MYCELIUM: {
        id: "DR_MYCELIUM",
        name: "Dr. Mycelium",
        specialty: "PATHOLOGY",
        clusterId: "OCTOPUS", // Master of connectivity
        description: "Expert in cross-package 'Fungal' infections and dependency rot. Diagnoses the 'Connectome' failures."
    },
    SURGEON_JAGGY: {
        id: "SURGEON_JAGGY",
        name: "Surgeon Jaggy",
        specialty: "SURGERY",
        clusterId: "JAGGY", // High precision
        description: "Performs precision code transplants and removes 'Cancers' (Memory leaks/Bad code) from the core."
    },
    IMMUNO_GUARD: {
        id: "IMMUNO_GUARD",
        name: "Immuno-Guard",
        specialty: "IMMUNOLOGY",
        clusterId: "SHIELD_CORE",
        description: "The White Blood Cell of the Nerve bus. Neutralizes malicious payloads and generates Digital Antibodies."
    },
    NURSE_PULSE: {
        id: "NURSE_PULSE",
        name: "Nurse Pulse",
        specialty: "VITAL_SIGNS",
        clusterId: "WEBHOOK_NERVOUS_SYSTEM",
        description: "24/7 monitoring of Heartbeat and metabolic rates (CPU/Memory). Triggers alarms for Arrhythmia."
    }
};
