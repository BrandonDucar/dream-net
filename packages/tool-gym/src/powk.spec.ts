import { describe, it, expect } from 'vitest';
import { POWKEngine, WorkoutSession } from './powk.js';

describe('POWKEngine', () => {
    const mockSession: WorkoutSession = {
        id: 'test-session-123',
        agentId: 'agent-007',
        taskType: 'CODE_REVIEW',
        startTime: 1700000000000,
        endTime: 1700000001000,
        metrics: {
            latency_ms: 250,
            success_rate: 1.0,
            token_efficiency: 0.9,
            tool_use_count: 5
        }
    };

    it('should generate a valid P.O.W.K. attestation', () => {
        const attestation = POWKEngine.signWorkout(mockSession);
        expect(attestation).toContain('POWK-');
        expect(attestation.length).toBe(21); // POWK- + 16 hex chars
    });

    it('should verify a valid attestation', () => {
        const attestation = POWKEngine.signWorkout(mockSession);
        const isValid = POWKEngine.verifyAttestation(mockSession, attestation);
        expect(isValid).toBe(true);
    });

    it('should fail verification if metrics are tampered with', () => {
        const attestation = POWKEngine.signWorkout(mockSession);
        const tamperedSession = { ...mockSession, metrics: { ...mockSession.metrics, success_rate: 0.5 } };
        const isValid = POWKEngine.verifyAttestation(tamperedSession, attestation);
        expect(isValid).toBe(false);
    });

    it('should detect elite performance in Boss Fights', () => {
        const isElite = POWKEngine.verifyBossFight(mockSession);
        expect(isElite).toBe(true);
    });

    it('should fail Boss Fight if latency is too high', () => {
        const slowSession = { ...mockSession, metrics: { ...mockSession.metrics, latency_ms: 600 } };
        const isElite = POWKEngine.verifyBossFight(slowSession);
        expect(isElite).toBe(false);
    });
});
