"use strict";
/**
 * Error Logging Middleware
 * Structured error logging for production monitoring
 */
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorLogger = errorLogger;
function logError(context) {
    var logEntry = __assign(__assign({ timestamp: new Date().toISOString(), level: 'error' }, context), { error: {
            name: context.error.name,
            message: context.error.message,
            stack: process.env.NODE_ENV === 'development' ? context.error.stack : undefined
        } });
    // In production, you'd send this to a logging service (Sentry, DataDog, etc.)
    // For now, use structured console logging
    console.error('[ERROR]', JSON.stringify(logEntry, null, 2));
    // TODO: Integrate with Sentry or other error tracking service
    // if (process.env.SENTRY_DSN) {
    //   Sentry.captureException(context.error, { extra: logEntry });
    // }
}
function errorLogger(err, req, res, next) {
    var traceId = req.traceId || 'unknown';
    logError({
        traceId: traceId,
        method: req.method,
        path: req.path,
        ip: req.ip || req.socket.remoteAddress,
        userAgent: req.get('user-agent'),
        error: err instanceof Error ? err : new Error(String(err)),
        statusCode: err.status || err.statusCode
    });
    next(err);
}
