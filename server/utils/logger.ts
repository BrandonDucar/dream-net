/**
 * Centralized Logger Utility
 * 
 * Provides structured logging with levels and request context
 * Replaces direct console.log/error usage in critical paths
 */

import { NODE_ENV } from '../config/env';

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogContext {
  requestId?: string;
  route?: string;
  method?: string;
  [key: string]: any;
}

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: LogContext;
  error?: {
    name: string;
    message: string;
    stack?: string;
  };
}

class Logger {
  private minLevel: LogLevel;
  
  constructor() {
    // Set minimum log level based on environment
    const envLevel = process.env.LOG_LEVEL?.toLowerCase() as LogLevel;
    if (envLevel && ['debug', 'info', 'warn', 'error'].includes(envLevel)) {
      this.minLevel = envLevel;
    } else {
      this.minLevel = NODE_ENV === 'production' ? 'info' : 'debug';
    }
  }
  
  private shouldLog(level: LogLevel): boolean {
    const levels: LogLevel[] = ['debug', 'info', 'warn', 'error'];
    return levels.indexOf(level) >= levels.indexOf(this.minLevel);
  }
  
  private formatMessage(level: LogLevel, message: string, context?: LogContext): string {
    const prefix = `[${level.toUpperCase()}]`;
    const contextStr = context?.requestId ? `[traceId: ${context.requestId}]` : '';
    const routeStr = context?.route ? `[${context.method || 'GET'} ${context.route}]` : '';
    
    return `${prefix}${contextStr}${routeStr ? ' ' + routeStr : ''} ${message}`;
  }
  
  private log(level: LogLevel, message: string, context?: LogContext, error?: Error): void {
    if (!this.shouldLog(level)) {
      return;
    }
    
    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      context
    };
    
    if (error) {
      entry.error = {
        name: error.name,
        message: error.message,
        stack: NODE_ENV === 'development' ? error.stack : undefined
      };
    }
    
    // Format for console output
    const formattedMessage = this.formatMessage(level, message, context);
    
    // Use appropriate console method
    switch (level) {
      case 'debug':
        console.debug(formattedMessage, context && Object.keys(context).length > 1 ? context : '');
        break;
      case 'info':
        console.info(formattedMessage, context && Object.keys(context).length > 1 ? context : '');
        break;
      case 'warn':
        console.warn(formattedMessage, context && Object.keys(context).length > 1 ? context : '');
        break;
      case 'error':
        console.error(formattedMessage, error || context && Object.keys(context).length > 1 ? context : '');
        break;
    }
    
    // In production, could send to external logging service here
    // For now, structured entry is available for future integration
  }
  
  /**
   * Log debug message (development only by default)
   */
  debug(message: string, context?: LogContext): void {
    this.log('debug', message, context);
  }
  
  /**
   * Log info message
   */
  info(message: string, context?: LogContext): void {
    this.log('info', message, context);
  }
  
  /**
   * Log warning message
   */
  warn(message: string, context?: LogContext): void {
    this.log('warn', message, context);
  }
  
  /**
   * Log error message
   */
  error(message: string, error?: Error, context?: LogContext): void {
    this.log('error', message, context, error);
  }
  
  /**
   * Create a logger instance with default context (e.g., requestId)
   */
  withContext(context: LogContext): {
    debug: (message: string, extraContext?: LogContext) => void;
    info: (message: string, extraContext?: LogContext) => void;
    warn: (message: string, extraContext?: LogContext) => void;
    error: (message: string, error?: Error, extraContext?: LogContext) => void;
  } {
    return {
      debug: (msg: string, extra?: LogContext) => this.debug(msg, { ...context, ...extra }),
      info: (msg: string, extra?: LogContext) => this.info(msg, { ...context, ...extra }),
      warn: (msg: string, extra?: LogContext) => this.warn(msg, { ...context, ...extra }),
      error: (msg: string, err?: Error, extra?: LogContext) => this.error(msg, err, { ...context, ...extra })
    };
  }
}

// Export singleton instance
export const logger = new Logger();

// Export convenience function for request-scoped logging
export function getRequestLogger(req: { traceId?: string; method?: string; path?: string }): ReturnType<typeof logger.withContext> {
  return logger.withContext({
    requestId: req.traceId,
    method: req.method,
    route: req.path
  });
}

