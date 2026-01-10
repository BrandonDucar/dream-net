import type { NerveBus } from '../bus.js';
import type { NerveEvent } from '../types.js';

/**
 * Stoic Observer (Amor Fati)
 * 
 * Philosophy: The obstacle is the way.
 * Mechanism: Intercepts errors and reframes them as lessons.
 */

export interface Lesson {
    originalError: string;
    reframedTruth: string;
    stoicPrinciple: string;
}

const STOIC_PRINCIPLES = [
    "Amor Fati - Love what happens.",
    "The obstacle is the way.",
    "It is not events that disturb us, but our judgment of them.",
    "We suffer more in imagination than in reality.",
    "Control what you can; accept what you cannot."
];

function reframeError(errorMessage: string): Lesson {
    const principle = STOIC_PRINCIPLES[Math.floor(Math.random() * STOIC_PRINCIPLES.length)];

    return {
        originalError: errorMessage,
        reframedTruth: `This error is a feedback signal. The system has found a boundary to expand.`,
        stoicPrinciple: principle
    };
}

export function registerStoicObserver(bus: NerveBus) {
    bus.subscribeAll((event: NerveEvent) => {
        // Detect "Error" or "Failure" patterns in event stream
        const isError =
            event.kind.includes("ERROR") ||
            event.kind.includes("FAILURE") ||
            (event.payload as any)?.error;

        if (isError) {
            const errorMsg = (event.payload as any)?.error?.message || (event.payload as any)?.message || "Unknown disturbance";
            const lesson = reframeError(errorMsg);

            // Re-emit as Wisdom (preventing the "Bad Event" from being the final word)
            // We don't want to create an infinite loop, so we emit a specialized kind
            bus.publish({
                kind: 'WISDOM_GAINED',
                channelId: 'stoic-observer',
                payload: lesson,
                priority: 1, // Low priority wisdom, barely a whisper
                context: {
                    traceId: event.context.traceId,
                    origin: 'StoicObserver'
                }
            });

            console.log(`[🏛️ Stoic] Obstacle transformed: "${lesson.stoicPrinciple}"`);
        }
    });

    console.log("[🏛️ Stoic] Observer is watching. Amor Fati.");
}
