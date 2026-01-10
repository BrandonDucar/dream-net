"use strict";
/**
 * X-Trace-Id Middleware
 * Generates and propagates trace IDs for request tracking and debugging
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateTraceId = generateTraceId;
exports.getTraceId = getTraceId;
exports.traceIdMiddleware = traceIdMiddleware;
exports.createChildSpan = createChildSpan;
exports.formatTraceContext = formatTraceContext;
var crypto_1 = require("crypto");
/**
 * Generate a trace ID (format: timestamp-hex)
 */
function generateTraceId() {
    var timestamp = Date.now().toString(36);
    var random = (0, crypto_1.randomBytes)(8).toString("hex");
    return "".concat(timestamp, "-").concat(random);
}
/**
 * Extract or generate trace ID from request headers
 */
function getTraceId(req) {
    // Check for existing trace ID in headers
    var headerTraceId = req.headers["x-trace-id"] || req.headers["x-request-id"];
    if (typeof headerTraceId === "string" && headerTraceId.length > 0) {
        return headerTraceId;
    }
    // Generate new trace ID
    return generateTraceId();
}
/**
 * Trace ID middleware - adds trace ID to all requests
 */
function traceIdMiddleware(req, res, next) {
    var traceId = getTraceId(req);
    // Attach to request
    req.traceId = traceId;
    req.traceContext = {
        traceId: traceId,
        spanId: (0, crypto_1.randomBytes)(4).toString("hex"),
    };
    // Add to response headers
    res.setHeader("X-Trace-Id", traceId);
    // Log trace ID for debugging
    if (process.env.DEBUG_TRACE === "true") {
        console.log("[Trace] ".concat(req.method, " ").concat(req.path, " - Trace-ID: ").concat(traceId));
    }
    next();
}
/**
 * Create a child span for nested operations
 */
function createChildSpan(parentTraceId, parentSpanId) {
    return {
        traceId: parentTraceId,
        parentSpanId: parentSpanId,
        spanId: (0, crypto_1.randomBytes)(4).toString("hex"),
    };
}
/**
 * Format trace context for logging
 */
function formatTraceContext(context) {
    return "trace=".concat(context.traceId, " span=").concat(context.spanId).concat(context.parentSpanId ? " parent=".concat(context.parentSpanId) : "");
}
