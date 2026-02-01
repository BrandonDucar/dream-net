/**
 * Env Variable Classifier
 * Classifies environment variables by sensitivity (public/internal/secret)
 */
import type { EnvSensitivity, EnvVarDescriptor } from '../types.js';
/**
 * Classify environment variable by sensitivity
 */
export declare function classifyEnvVar(key: string, value?: string): EnvSensitivity;
/**
 * Create EnvVarDescriptor from key/value
 */
export declare function createEnvVarDescriptor(key: string, value: string, source?: "process" | "file" | "runtime"): EnvVarDescriptor;
/**
 * Update registry with descriptor
 */
export declare function updateEnvRegistry(descriptor: EnvVarDescriptor): void;
/**
 * Get descriptor from registry
 */
export declare function getEnvDescriptor(key: string): EnvVarDescriptor | undefined;
/**
 * Get all descriptors by sensitivity
 */
export declare function getDescriptorsBySensitivity(sensitivity: EnvSensitivity): EnvVarDescriptor[];
//# sourceMappingURL=envClassifier.d.ts.map