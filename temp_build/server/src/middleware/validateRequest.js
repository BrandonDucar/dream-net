"use strict";
/**
 * Request Validation Middleware
 * Uses Zod schemas to validate request bodies, query params, and route params
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRequest = validateRequest;
var zod_1 = require("zod");
function validateRequest(schema) {
    return function (req, res, next) {
        try {
            if (schema.body) {
                req.body = schema.body.parse(req.body);
            }
            if (schema.query) {
                req.query = schema.query.parse(req.query);
            }
            if (schema.params) {
                req.params = schema.params.parse(req.params);
            }
            next();
        }
        catch (error) {
            if (error instanceof zod_1.z.ZodError) {
                return res.status(400).json({
                    ok: false,
                    error: 'validation_error',
                    message: 'Invalid request data',
                    details: error.errors.map(function (e) { return ({
                        path: e.path.join('.'),
                        message: e.message
                    }); })
                });
            }
            return res.status(400).json({
                ok: false,
                error: 'validation_error',
                message: 'Request validation failed'
            });
        }
    };
}
