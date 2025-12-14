# Detector Generator Core - Complete Documentation

**Package**: `@dreamnet/detector-generator-core`  
**Status**: ✅ Implemented  
**Last Updated**: 2025-01-27

---

## Overview

Detector Generator Core **automatically generates M≈1-5k detectors per surface** for anomaly detection. It creates detectors for latency, error rate, queue depth, memory pressure, and throughput, with automatic scoring (eps=0.85 threshold) and Z-score gating to reduce noise.

### Key Features

- **Automatic Generation**: Generates 1-5k detectors per surface
- **Multiple Surfaces**: Supports latency, error rate, queue depth, memory pressure, throughput
- **Scoring**: Automatic precision scoring with eps=0.85 threshold
- **Z-Score Gating**: Reduces noise in detector results
- **Metrics Integration**: Integrates with metrics pipeline

---

## Architecture

### How It Works

```
Surface + Historical Data → Detector Generator → Scoring → Filtering (eps≥0.85) → Detector Store
```

1. **Surface Definition**: Define detector surface (latency, error_rate, etc.)
2. **Historical Data**: Provide historical metrics data
3. **Generation**: Generate detectors with various thresholds and window sizes
4. **Scoring**: Score detectors against historical data
5. **Filtering**: Filter detectors with score ≥ 0.85
6. **Storage**: Store detectors in DetectorStore

### Why This Design

- **Automation**: Reduces manual detector configuration
- **Scalability**: Generates thousands of detectors automatically
- **Precision**: Scoring ensures high-quality detectors
- **Noise Reduction**: Z-score gating reduces false positives

---

## API Reference

### Types

```typescript
export type DetectorSurface = 
  | 'latency' 
  | 'error_rate' 
  | 'queue_depth' 
  | 'memory_pressure' 
  | 'throughput';

export type DetectorMetric = 
  | 'p95' 
  | 'p99' 
  | 'error_percentage' 
  | 'queue_depth' 
  | 'memory_usage' 
  | 'requests_per_second';

export interface Detector {
  id: string;
  surface: DetectorSurface;
  metric: DetectorMetric;
  threshold: number;
  windowSize: number; // seconds
  score?: number; // precision score (eps=0.85 threshold)
  createdAt: number;
}

export interface DetectorResult {
  detectorId: string;
  triggered: boolean;
  value: number;
  threshold: number;
  timestamp: number;
}

export interface DetectorGeneratorStatus {
  detectorCount: number;
  detectorsBySurface: Record<DetectorSurface, number>;
  lastGeneratedAt: number | null;
}
```

### Functions

#### `generateDetectors(surface: DetectorSurface, historicalData: any[]): Detector[]`

Generate detectors for a surface based on historical data.

**Example**:
```typescript
import { generateDetectors } from "@dreamnet/detector-generator-core";

const historicalData = [
  { timestamp: Date.now() - 3600000, p95: 150, p99: 200 },
  { timestamp: Date.now() - 1800000, p95: 160, p99: 210 },
  // ... more data points
];

const detectors = generateDetectors("latency", historicalData);
console.log(`Generated ${detectors.length} detectors`);
```

#### `scoreDetector(detector: Detector, historicalData: any[]): number`

Score a detector against historical data (returns precision score).

### Main Export

#### `DetectorGeneratorCore`

Main API object with all detector generation methods.

**Methods**:

- **`generateDetectors(surface: DetectorSurface, historicalData: any[]): Detector[]`**
  - Generate detectors for a surface
  - Automatically scores and filters (eps≥0.85)
  - Stores detectors in DetectorStore

- **`getDetectors(): Detector[]`**
  - Get all detectors

- **`getDetectorsBySurface(surface: DetectorSurface): Detector[]`**
  - Get detectors for a specific surface

- **`evaluateDetectors(): Promise<DetectorResult[]>`**
  - Evaluate detectors against current metrics (TODO: implement)

- **`status(): DetectorGeneratorStatus`**
  - Get detector generator status

**Example**:
```typescript
import DetectorGeneratorCore from "@dreamnet/detector-generator-core";

// Generate detectors
const detectors = DetectorGeneratorCore.generateDetectors("latency", historicalData);
console.log(`Generated ${detectors.length} detectors with score ≥ 0.85`);

// Get detectors by surface
const latencyDetectors = DetectorGeneratorCore.getDetectorsBySurface("latency");

// Get status
const status = DetectorGeneratorCore.status();
console.log("Total detectors:", status.detectorCount);
console.log("By surface:", status.detectorsBySurface);
```

---

## Integration Points

### Consumes

- **Metrics Pipeline**: Historical metrics data
- **DetectorStore**: Storage for generated detectors

### Produces

- **Detectors**: Generated detector configurations
- **Detector Results**: Evaluation results (when implemented)

---

## Usage Examples

### Generate Latency Detectors

```typescript
import DetectorGeneratorCore from "@dreamnet/detector-generator-core";

const historicalLatencyData = [
  { timestamp: Date.now() - 3600000, p95: 150, p99: 200 },
  { timestamp: Date.now() - 1800000, p95: 160, p99: 210 },
  { timestamp: Date.now() - 900000, p95: 155, p99: 205 },
  // ... more data points
];

const detectors = DetectorGeneratorCore.generateDetectors("latency", historicalLatencyData);
console.log(`Generated ${detectors.length} latency detectors`);
```

### Generate Error Rate Detectors

```typescript
const historicalErrorData = [
  { timestamp: Date.now() - 3600000, error_percentage: 0.5 },
  { timestamp: Date.now() - 1800000, error_percentage: 0.3 },
  // ... more data points
];

const detectors = DetectorGeneratorCore.generateDetectors("error_rate", historicalErrorData);
```

### Get Detectors by Surface

```typescript
const latencyDetectors = DetectorGeneratorCore.getDetectorsBySurface("latency");
const errorDetectors = DetectorGeneratorCore.getDetectorsBySurface("error_rate");
const queueDetectors = DetectorGeneratorCore.getDetectorsBySurface("queue_depth");
```

### Get Status

```typescript
const status = DetectorGeneratorCore.status();
console.log("Total detectors:", status.detectorCount);
console.log("Latency detectors:", status.detectorsBySurface.latency);
console.log("Error rate detectors:", status.detectorsBySurface.error_rate);
console.log("Last generated:", status.lastGeneratedAt);
```

---

## Best Practices

1. **Historical Data**: Provide sufficient historical data (at least 100+ data points)
2. **Surface Selection**: Choose appropriate surface for your use case
3. **Scoring Threshold**: Use eps=0.85 threshold for high-quality detectors
4. **Window Sizes**: Detectors use various window sizes for different time horizons
5. **Regular Regeneration**: Regenerate detectors periodically as data patterns change

---

## Security Considerations

- **Data Privacy**: Ensure historical data doesn't contain sensitive information
- **Threshold Validation**: Validate detector thresholds before deployment
- **Rate Limiting**: Consider rate limits when evaluating detectors

---

## Related Systems

- **Resilience Early Warning**: Uses detectors for early warning
- **HALO Loop**: Uses detectors for weak point detection
- **Metrics Pipeline**: Provides historical data

---

**Status**: ✅ Implemented  
**Next**: Implement detector evaluation logic

