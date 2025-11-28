/**
 * Observability Core - Exports
 */

export { initOpenTelemetry, getShutdown } from './otel-node.js';
export { tracer, createSpan, traceWalletCreate, traceDreamCreate, traceDeployment } from './tracing.js';
export { meter, dreamnetMetrics, createLatencyHistogram, createCounter, bucketUserId, bucketWalletAge } from './metrics.js';
export { bucketUserTier, bucketRequestSize, bucketResponseTime, bucketErrorCode } from './metrics-buckets.js';
export { dreamnetViews } from './metrics-views.js';

