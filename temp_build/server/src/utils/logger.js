"use strict";
/**
 * Centralized Logger Utility
 *
 * Provides structured logging with levels and request context
 * Replaces direct console.log/error usage in critical paths
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
exports.logger = void 0;
exports.getRequestLogger = getRequestLogger;
var env_1 = require("../config/env");
var Logger = /** @class */ (function () {
    function Logger() {
        var _a;
        // Set minimum log level based on environment
        var envLevel = (_a = process.env.LOG_LEVEL) === null || _a === void 0 ? void 0 : _a.toLowerCase();
        if (envLevel && ['debug', 'info', 'warn', 'error'].includes(envLevel)) {
            this.minLevel = envLevel;
        }
        else {
            this.minLevel = env_1.NODE_ENV === 'production' ? 'info' : 'debug';
        }
    }
    Logger.prototype.shouldLog = function (level) {
        var levels = ['debug', 'info', 'warn', 'error'];
        return levels.indexOf(level) >= levels.indexOf(this.minLevel);
    };
    Logger.prototype.formatMessage = function (level, message, context) {
        var prefix = "[".concat(level.toUpperCase(), "]");
        var contextStr = (context === null || context === void 0 ? void 0 : context.requestId) ? "[traceId: ".concat(context.requestId, "]") : '';
        var routeStr = (context === null || context === void 0 ? void 0 : context.route) ? "[".concat(context.method || 'GET', " ").concat(context.route, "]") : '';
        return "".concat(prefix).concat(contextStr).concat(routeStr ? ' ' + routeStr : '', " ").concat(message);
    };
    Logger.prototype.log = function (level, message, context, error) {
        if (!this.shouldLog(level)) {
            return;
        }
        var entry = {
            level: level,
            message: message,
            timestamp: new Date().toISOString(),
            context: context
        };
        if (error) {
            entry.error = {
                name: error.name,
                message: error.message,
                stack: env_1.NODE_ENV === 'development' ? error.stack : undefined
            };
        }
        // Format for console output
        var formattedMessage = this.formatMessage(level, message, context);
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
    };
    /**
     * Log debug message (development only by default)
     */
    Logger.prototype.debug = function (message, context) {
        this.log('debug', message, context);
    };
    /**
     * Log info message
     */
    Logger.prototype.info = function (message, context) {
        this.log('info', message, context);
    };
    /**
     * Log warning message
     */
    Logger.prototype.warn = function (message, context) {
        this.log('warn', message, context);
    };
    /**
     * Log error message
     */
    Logger.prototype.error = function (message, error, context) {
        this.log('error', message, context, error);
    };
    /**
     * Create a logger instance with default context (e.g., requestId)
     */
    Logger.prototype.withContext = function (context) {
        var _this = this;
        return {
            debug: function (msg, extra) { return _this.debug(msg, __assign(__assign({}, context), extra)); },
            info: function (msg, extra) { return _this.info(msg, __assign(__assign({}, context), extra)); },
            warn: function (msg, extra) { return _this.warn(msg, __assign(__assign({}, context), extra)); },
            error: function (msg, err, extra) { return _this.error(msg, err, __assign(__assign({}, context), extra)); }
        };
    };
    return Logger;
}());
// Export singleton instance
exports.logger = new Logger();
// Export convenience function for request-scoped logging
function getRequestLogger(req) {
    return exports.logger.withContext({
        requestId: req.traceId,
        method: req.method,
        route: req.path
    });
}
