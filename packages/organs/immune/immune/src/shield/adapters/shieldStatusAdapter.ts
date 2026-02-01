import { ShieldCore } from '../index.js';
import { ShieldStatus } from '../types.js';

export interface ShieldDashboardView {
  activeLayers: number;
  totalLayers: number;
  overallIntegrity: number;
  shieldHealth: string;
  threatsDetected: number;
  threatsBlocked: number;
  spikesFired: number;
  activeModulators: number;
  activeEmitters: number;
  layers: {
    phase: string;
    strength: number;
    integrity: number;
    frequency: number;
    modulators: number;
    emitters: number;
    breachCount: number;
  }[];
  recentThreats: {
    id: string;
    type: string;
    level: string;
    blocked: boolean;
    detectedAt: number;
  }[];
  recentSpikes: {
    id: string;
    name: string;
    type: string;
    target: string;
    success: boolean;
    firedAt?: number;
  }[];
  frequencies: {
    phase: string;
    frequency: number;
    amplitude: number;
  }[];
}

export function getShieldDashboardView(): ShieldDashboardView {
  const status: ShieldStatus = ShieldCore.status();

  return {
    activeLayers: status.activeLayers,
    totalLayers: status.totalLayers,
    overallIntegrity: status.overallIntegrity,
    shieldHealth: status.shieldHealth,
    threatsDetected: status.threatsDetected,
    threatsBlocked: status.threatsBlocked,
    spikesFired: status.spikesFired,
    activeModulators: status.activeModulators,
    activeEmitters: status.activeEmitters,
    layers: status.currentFrequencies.map((freq) => {
      const layer = ShieldCore.getLayer(freq.phase);
      return {
        phase: freq.phase,
        strength: layer?.strength ?? 0,
        integrity: layer?.integrity ?? 0,
        frequency: freq.frequency,
        modulators: layer?.modulators.length ?? 0,
        emitters: layer?.emitters.length ?? 0,
        breachCount: layer?.breachCount ?? 0,
      };
    }),
    recentThreats: status.recentThreats.map((t) => ({
      id: t.id,
      type: t.type,
      level: t.level,
      blocked: t.blocked,
      detectedAt: t.detectedAt,
    })),
    recentSpikes: status.recentSpikes.map((s) => ({
      id: s.id,
      name: s.name,
      type: s.type,
      target: s.target,
      success: s.success,
      firedAt: s.firedAt,
    })),
    frequencies: status.currentFrequencies.map((f) => ({
      phase: f.phase,
      frequency: f.frequency,
      amplitude: f.amplitude,
    })),
  };
}

