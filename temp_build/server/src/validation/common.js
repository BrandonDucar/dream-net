"use strict";
/**
 * Common Input Validation Utilities
 *
 * Shared validation functions for API routes
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.validatePagination = validatePagination;
exports.validateString = validateString;
exports.createValidationMiddleware = createValidationMiddleware;
/**
 * Validate pagination parameters
 */
function validatePagination(query) {
    var page = query.page !== undefined ? Number(query.page) : 1;
    var limit = query.limit !== undefined ? Number(query.limit) : 20;
    if (isNaN(page) || page < 1) {
        return { valid: false, error: 'Page must be a positive integer' };
    }
    if (isNaN(limit) || limit < 1 || limit > 100) {
        return { valid: false, error: 'Limit must be between 1 and 100' };
    }
    return { valid: true, page: page, limit: limit };
}
/**
 * Validate string input with length constraints
 */
function validateString(value, options) {
    if (options === void 0) { options = {}; }
    var _a = options.required, required = _a === void 0 ? false : _a, minLength = options.minLength, maxLength = options.maxLength, _b = options.fieldName, fieldName = _b === void 0 ? 'Field' : _b;
    if (value === undefined || value === null) {
        if (required) {
            return { valid: false, error: "".concat(fieldName, " is required") };
        }
        return { valid: true };
    }
    if (typeof value !== 'string') {
        return { valid: false, error: "".concat(fieldName, " must be a string") };
    }
    var trimmed = value.trim();
    if (required && trimmed.length === 0) {
        return { valid: false, error: "".concat(fieldName, " cannot be empty") };
    }
    if (minLength !== undefined && trimmed.length < minLength) {
        return { valid: false, error: "".concat(fieldName, " must be at least ").concat(minLength, " characters") };
    }
    if (maxLength !== undefined && trimmed.length > maxLength) {
        return { valid: false, error: "".concat(fieldName, " must be at most ").concat(maxLength, " characters") };
    }
    return { valid: true, value: trimmed };
}
/**
 * Create validation middleware for Express routes
 */
function createValidationMiddleware(validator) {
    return function (req, res, next) {
        var result = validator(req);
        if (!result.valid) {
            var traceId = req.traceId || 'unknown';
            console.warn("[Validation] \u274C Invalid request (traceId: ".concat(traceId, "):"), result.error);
            return res.status(400).json({
                ok: false,
                error: 'validation_error',
                message: result.error || 'Invalid request',
                traceId: traceId
            });
        }
        // Attach validated data to request if provided
        Object.keys(result).forEach(function (key) {
            if (key !== 'valid' && key !== 'error') {
                req.validated = req.validated || {};
                req.validated[key] = result[key];
            }
        });
        next();
    };
}
