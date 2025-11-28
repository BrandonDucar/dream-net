/**
 * OpenTelemetry Node.js Auto-Instrumentation
 * 
 * Initializes OpenTelemetry SDK with auto-instrumentation for Node.js applications.
 * Sends traces to OTLP collector (Google Cloud Trace + Honeycomb).
 */

import { NodeSDK } from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-otlp-proto';
import { Resource } from '@opentelemetry/resources';
import { SEMRESATTRS_SERVICE_NAME, SEMRESATTRS_SERVICE_VERSION } from '@opentelemetry/semantic-conventions';

let sdk: NodeSDK | null = null;

/**
 * Initialize OpenTelemetry SDK
 */
export function initOpenTelemetry(): () => Promise<void> {
  if (sdk) {
    console.warn('OpenTelemetry already initialized');
    return async () => {};
  }

  const otlpEndpoint = process.env.OTEL_EXPORTER_OTLP_ENDPOINT || 'http://localhost:4317';
  const serviceName = process.env.OTEL_SERVICE_NAME || 'dreamnet-api';
  const serviceVersion = process.env.OTEL_SERVICE_VERSION || '1.0.0';
  const samplingRatio = parseFloat(process.env.OTEL_SAMPLING_RATIO || '0.01');

  const traceExporter = new OTLPTraceExporter({
    url: `${otlpEndpoint}/v1/traces`,
  });

  const resource = new Resource({
    [SEMRESATTRS_SERVICE_NAME]: serviceName,
    [SEMRESATTRS_SERVICE_VERSION]: serviceVersion,
  });

  sdk = new NodeSDK({
    resource,
    traceExporter,
    instrumentations: [
      getNodeAutoInstrumentations({
        '@opentelemetry/instrumentation-http': {
          enabled: true,
        },
        '@opentelemetry/instrumentation-express': {
          enabled: true,
        },
      }),
    ],
    // 1% head sampling
    sampler: {
      shouldSample: () => {
        return Math.random() < samplingRatio
          ? { decision: 1 } // RECORD_AND_SAMPLE
          : { decision: 0 }; // DROP
      },
    },
  });

  sdk.start();
  console.log(`✅ OpenTelemetry initialized: ${serviceName}@${serviceVersion} → ${otlpEndpoint}`);

  return async () => {
    if (sdk) {
      await sdk.shutdown();
      sdk = null;
    }
  };
}

/**
 * Get shutdown function (for graceful shutdown)
 */
export function getShutdown(): () => Promise<void> {
  return async () => {
    if (sdk) {
      await sdk.shutdown();
      sdk = null;
    }
  };
}

