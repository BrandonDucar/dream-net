"use strict";
// routes/connector.ts
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var connector_export_1 = require("../connector-export");
var router = express_1.default.Router();
// Add logging middleware for debugging
router.use(function (req, res, next) {
    console.log("[Connector-V1] ".concat(req.method, " ").concat(req.path), req.body);
    next();
});
router.post('/', function (req, res) {
    var input = req.body;
    console.log('[Connector-V1] Processing input:', input);
    try {
        var result = (0, connector_export_1.connectorBotV1)(input);
        console.log('[Connector-V1] Routing result:', result);
        return res.json({
            status: "success",
            routedTo: result.nextBot,
            instructions: result.instructions,
            fallbackOptions: result.fallbackOptions
        });
    }
    catch (err) {
        console.error("⚠️ ConnectorBot error:", err);
        return res.status(500).json({
            status: "error",
            message: "ConnectorBot encountered an error.",
            details: err instanceof Error ? err.message : String(err)
        });
    }
});
// Add GET endpoint for testing
router.get('/test', function (req, res) {
    res.json({
        status: "success",
        message: "Streamlined Connector V1 API is working",
        endpoints: {
            route: "POST /api/connector-v1/",
            test: "GET /api/connector-v1/test"
        }
    });
});
exports.default = router;
