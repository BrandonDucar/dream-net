import type {
  FieldEntityKind,
  FieldPointId,
  FieldName,
  FieldSample,
  FieldConfig,
  FieldContext,
  FieldStatus,
} from './types.js';
import { FieldStore } from './store/fieldStore.js';
import { runFieldCycle } from './scheduler/fieldScheduler.js';

export const FieldLayer = {
  configure(config: Partial<FieldConfig>) {
    FieldStore.configure(config);
  },

  run(context: FieldContext): FieldStatus {
    return runFieldCycle(context);
  },

  status(): FieldStatus {
    return FieldStore.status();
  },

  sample(field: FieldName, point: FieldPointId): FieldSample | undefined {
    return FieldStore.getSample(field, point);
  },

  allSamples(): FieldSample[] {
    return FieldStore.getAllSamples();
  },
};

export * from './types.js';
export default FieldLayer;

