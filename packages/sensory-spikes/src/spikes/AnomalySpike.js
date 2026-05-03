export class AnomalySpike {
    name = 'Anomaly';
    type = 'geopolitical';
    async fetch() {
        return {
            source: 'Chaos Engine',
            data: { anomaly: 'None detected' },
            timestamp: Date.now(),
            confidence: 1
        };
    }
}
//# sourceMappingURL=AnomalySpike.js.map