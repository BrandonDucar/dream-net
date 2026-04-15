import type {
  FieldName,
  FieldPointId,
  FieldSample,
  FieldConfig,
  FieldStatus,
} from "../types";

const fieldMap: Map<string, FieldSample> = new Map();

let config: FieldConfig = {
  decayHalfLifeMs: 1000 * 60 * 60, // 1 hour by default
  smoothingFactor: 0.5,
};

let lastRunAt: number | null = null;

function keyFor(field: FieldName, point: FieldPointId): string {
  return `${field}:${point.kind}:${point.id}`;
}

export const FieldStore = {
  configure(partial: Partial<FieldConfig>) {
    config = { ...config, ...partial };
  },

  getConfig(): FieldConfig {
    return config;
  },

  upsertSample(field: FieldName, point: FieldPointId, value: number, updatedAt: number) {
    const key = keyFor(field, point);
    const existing = fieldMap.get(key);

    let finalValue = value;
    if (existing) {
      // Smooth between existing and new value
      const alpha = config.smoothingFactor;
      finalValue = alpha * value + (1 - alpha) * existing.value;
    }

    const sample: FieldSample = {
      field,
      point,
      value: finalValue,
      updatedAt,
    };

    fieldMap.set(key, sample);
  },

  getSample(field: FieldName, point: FieldPointId): FieldSample | undefined {
    return fieldMap.get(keyFor(field, point));
  },

  getAllSamples(): FieldSample[] {
    return Array.from(fieldMap.values());
  },

  setLastRunAt(ts: number | null) {
    lastRunAt = ts;
  },

  status(): FieldStatus {
    const all = Array.from(fieldMap.values());
    const samplePreview = all.slice(0, 50);

    return {
      lastRunAt,
      totalSamples: all.length,
      samplePreview,
    };
  },
};

