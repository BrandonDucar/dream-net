/**
 * Sentry Integration Core
 * Error tracking and monitoring (Sentry SDK wrapper)
 */

export interface SentryConfig {
  dsn: string;
  environment?: string;
  release?: string;
  tracesSampleRate?: number;
}

export function initSentry(config: SentryConfig): void {
  try {
    // Dynamic import to avoid requiring Sentry if not installed
    const Sentry = require('@sentry/node');
    
    Sentry.init({
      dsn: config.dsn,
      environment: config.environment || process.env.NODE_ENV || 'production',
      release: config.release,
      tracesSampleRate: config.tracesSampleRate || 0.1,
      integrations: [
        new Sentry.Integrations.Http({ tracing: true }),
        new Sentry.Integrations.Express({ app: undefined }),
      ],
    });

    console.log('[Sentry] ✅ Initialized');
  } catch (error) {
    console.warn('[Sentry] ⚠️  Sentry SDK not installed or initialization failed');
  }
}

export function captureException(error: Error, context?: Record<string, any>): void {
  try {
    const Sentry = require('@sentry/node');
    Sentry.captureException(error, {
      extra: context,
    });
  } catch (e) {
    // Sentry not available
  }
}

export function captureMessage(message: string, level: 'info' | 'warning' | 'error' = 'info'): void {
  try {
    const Sentry = require('@sentry/node');
    Sentry.captureMessage(message, level);
  } catch (e) {
    // Sentry not available
  }
}

export function createSentryIntegration(): void {
  const dsn = process.env.SENTRY_DSN;
  
  if (!dsn) {
    console.warn('[Sentry] ⚠️  SENTRY_DSN not set');
    return;
  }

  initSentry({
    dsn,
    environment: process.env.NODE_ENV,
    release: process.env.SENTRY_RELEASE,
    tracesSampleRate: process.env.SENTRY_TRACES_SAMPLE_RATE 
      ? parseFloat(process.env.SENTRY_TRACES_SAMPLE_RATE) 
      : 0.1,
  });
}

