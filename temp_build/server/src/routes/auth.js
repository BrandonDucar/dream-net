"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerAuthRoutes = registerAuthRoutes;
var jsonwebtoken_1 = require("jsonwebtoken");
var stack_auth_js_1 = require("../middleware/stack-auth.js");
function registerAuthRoutes(app) {
    // Auth selftest endpoint (accepts both local JWT and Stack Auth tokens)
    app.get('/auth/selftest', stack_auth_js_1.verifyAnyAuth, function (req, res) {
        var user = req.user;
        res.json({
            ok: true,
            userId: user.userId,
            email: user.email,
            roles: user.roles || [],
            provider: user.provider || 'unknown'
        });
    });
    // Stack Auth specific selftest endpoint
    app.get('/auth/stack-selftest', stack_auth_js_1.verifyStackAuth, function (req, res) {
        var user = req.stackUser;
        res.json({
            ok: true,
            sub: user.sub,
            email: user.email,
            roles: user.roles || [],
            provider: 'stack-auth'
        });
    });
    // Mock auth endpoint for testing (remove in production)
    app.post('/auth/token', function (req, res) {
        var _a = req.body, userId = _a.userId, roles = _a.roles;
        if (!userId) {
            return res.status(400).json({ error: 'userId required' });
        }
        var token = jsonwebtoken_1.default.sign({ userId: userId, roles: roles || ['creator'] }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token: token });
    });
}
