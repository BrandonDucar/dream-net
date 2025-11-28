/**
 * Manual Tracing Utilities
 * 
 * Provides utilities for creating manual spans and standard trace paths.
 */

import { trace, context, SpanStatusCode } from '@opentelemetry/api';

const tracer = trace.getTracer('dreamnet');

/**
 * Create a span for a standard operation
 */
export function createSpan(name: string, parentContext?: any): any {
  return tracer.startSpan(name, {
    kind: 1, // SPAN_KIND_INTERNAL
  }, parentContext);
}

/**
 * Standard trace path: wallet_create → agent_tool_call → base_rpc
 */
export function traceWalletCreate(operation: () => Promise<any>): Promise<any> {
  return tracer.startActiveSpan('wallet_create', async (walletSpan) => {
    try {
      return await tracer.startActiveSpan('agent_tool_call', async (toolSpan) => {
        try {
          return await tracer.startActiveSpan('base_rpc', async (rpcSpan) => {
            try {
              const result = await operation();
              rpcSpan.setStatus({ code: SpanStatusCode.OK });
              return result;
            } catch (error: any) {
              rpcSpan.setStatus({
                code: SpanStatusCode.ERROR,
                message: error.message,
              });
              rpcSpan.recordException(error);
              throw error;
            } finally {
              rpcSpan.end();
            }
          });
        } finally {
          toolSpan.end();
        }
      });
    } finally {
      walletSpan.end();
    }
  });
}

/**
 * Standard trace path: dream_create → agent_process → storage_write
 */
export function traceDreamCreate(operation: () => Promise<any>): Promise<any> {
  return tracer.startActiveSpan('dream_create', async (dreamSpan) => {
    try {
      return await tracer.startActiveSpan('agent_process', async (processSpan) => {
        try {
          return await tracer.startActiveSpan('storage_write', async (storageSpan) => {
            try {
              const result = await operation();
              storageSpan.setStatus({ code: SpanStatusCode.OK });
              return result;
            } catch (error: any) {
              storageSpan.setStatus({
                code: SpanStatusCode.ERROR,
                message: error.message,
              });
              storageSpan.recordException(error);
              throw error;
            } finally {
              storageSpan.end();
            }
          });
        } finally {
          processSpan.end();
        }
      });
    } finally {
      dreamSpan.end();
    }
  });
}

/**
 * Standard trace path: deployment_trigger → cloud_run_deploy → verification
 */
export function traceDeployment(operation: () => Promise<any>): Promise<any> {
  return tracer.startActiveSpan('deployment_trigger', async (triggerSpan) => {
    try {
      return await tracer.startActiveSpan('cloud_run_deploy', async (deploySpan) => {
        try {
          return await tracer.startActiveSpan('verification', async (verifySpan) => {
            try {
              const result = await operation();
              verifySpan.setStatus({ code: SpanStatusCode.OK });
              return result;
            } catch (error: any) {
              verifySpan.setStatus({
                code: SpanStatusCode.ERROR,
                message: error.message,
              });
              verifySpan.recordException(error);
              throw error;
            } finally {
              verifySpan.end();
            }
          });
        } finally {
          deploySpan.end();
        }
      });
    } finally {
      triggerSpan.end();
    }
  });
}

export { tracer };

