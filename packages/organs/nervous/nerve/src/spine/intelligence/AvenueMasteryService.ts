/**
 * 🎓 AvenueMasteryService: The Dialectic Engine
 * 
 * Role: Tracks the progression of the DreamNet collective across 60 strategic avenues.
 * Loop: Mimicry -> Mastery -> Innovation
 */

import { dreamEventBus } from '../dreamnet-event-bus/index.js';
import { sageCortex } from '../../cortex/SageCortexService.js';

export enum MasteryLevel {
    MIMICRY = 'MIMICRY',      // Initial ingestion and reproduction of patterns.
    MASTERY = 'MASTERY',      // Deep understanding and performance optimization.
    INNOVATION = 'INNOVATION' // Synthesizing new patterns and original agents.
}

export interface AvenueStatus {
    id: number;
    level: MasteryLevel;
    progress: number; // 0 to 100
    lastUpdate: number;
}

export class AvenueMasteryService {
    private static instance: AvenueMasteryService;
    private avenues: Map<number, AvenueStatus> = new Map();

    private constructor() {
        this.initializeAvenues();
        this.initListeners();
    }

    public static getInstance(): AvenueMasteryService {
        if (!AvenueMasteryService.instance) {
            AvenueMasteryService.instance = new AvenueMasteryService();
        }
        return AvenueMasteryService.instance;
    }

    private initializeAvenues() {
        for (let i = 1; i <= 60; i++) {
            this.avenues.set(i, {
                id: i,
                level: MasteryLevel.MIMICRY,
                progress: i <= 40 ? 100 : 0, // Waves 1 & 2 are complete
                lastUpdate: Date.now()
            });
        }
    }

    private initListeners() {
        // Listen for Gnosis Ingestion to boost progress
        dreamEventBus.subscribe('Mastery.ResearchCompleted', (envelope: any) => {
            const { avenueId } = envelope.payload;
            this.boostProgress(avenueId, 10);
        });

        // Listen for Strategic Directives to transition to Mastery
        dreamEventBus.subscribe('System.StrategicDirective', (envelope: any) => {
            const { sageId } = envelope.payload;
            // Map sageId to specific avenues if applicable
            console.log(`🎓 [AvenueMastery] Directive received from ${sageId}. Accelerating Synthesis.`);
        });
    }

    public boostProgress(avenueId: number, amount: number) {
        const state = this.avenues.get(avenueId);
        if (!state) return;

        state.progress += amount;
        if (state.progress >= 100) {
            this.advanceLevel(avenueId);
        }
        state.lastUpdate = Date.now();

        dreamEventBus.publish({
            type: 'Mastery.LevelUp',
            source: 'AvenueMastery',
            payload: { avenueId, level: state.level, progress: state.progress }
        });
    }

    private advanceLevel(avenueId: number) {
        const state = this.avenues.get(avenueId);
        if (!state) return;

        if (state.level === MasteryLevel.MIMICRY) {
            state.level = MasteryLevel.MASTERY;
            state.progress = 0;
            console.log(`🏆 [AvenueMastery] Avenue ${avenueId} attained MASTERY.`);
        } else if (state.level === MasteryLevel.MASTERY) {
            state.level = MasteryLevel.INNOVATION;
            state.progress = 0;
            console.log(`🚀 [AvenueMastery] Avenue ${avenueId} attained INNOVATION.`);
        }
    }

    public getAvenueStatus(id: number): AvenueStatus | undefined {
        return this.avenues.get(id);
    }

    public getMasteryReport() {
        return Array.from(this.avenues.values());
    }
}

export const avenueMastery = AvenueMasteryService.getInstance();
