import { VSCE } from './src/vsce.js';
import { RaceEngineer } from './src/agents/race_engineer.js';
import { ReliabilityEngineer } from './src/agents/reliability.js';
import { Conductor } from './src/conductor.js';

// VIRTUAL PIT WALL (MVP)
console.log('------------------------------------------------');
console.log('🏎️  VIRTUAL PIT WALL ONLINE  🏎️');
console.log('------------------------------------------------');

const vsce = new VSCE();
const raceEng = new RaceEngineer(vsce);
const reliabilityEng = new ReliabilityEngineer(vsce);
const conductor = new Conductor();

// SIMULATION: Lap 12 (High Stress)
console.log('\n[Telemetry] Lap 12 - High Stress Sector');
const telemetry = {
    timestamp: Date.now(),
    tireTemp: 112, // Overheating
    fuelLoad: 8,   // Low
    coolantTemp: 106, // Critical
    oilPressure: 54 // Sagging
};

// 1. Ingest
vsce.ingest({
    id: 'lap_12_sec_1',
    timestamp: telemetry.timestamp,
    type: 'TELEMETRY',
    source: 'OBD',
    data: telemetry,
    confidence: 1.0
});

// 2. Agents Analyze
const r1 = raceEng.analyze(telemetry);
const r2 = reliabilityEng.analyze(telemetry);

// 3. Conductor Decides
console.log('\n[Conductor] Arbitrating...');
const decision = conductor.arbitrate({ race: r1, reliability: r2 });

console.log('\n------------------------------------------------');
console.log(`📢 FINAL CALL: ${decision.finalCommand}`);
console.log(`❓ REASON: ${decision.reason}`);
console.log('------------------------------------------------');

// 4. Vehicle State
console.log('\n[Vehicle State Snapshot]');
console.table(vsce.getSnapshot().map(s => ({
    System: s.system,
    Health: s.health + '%',
    MyConf: s.confidence,
    Trend: s.trend
})));
