"use strict";
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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var router = (0, express_1.Router)();
// Agent command execution endpoint
router.post('/agent-command', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var command, result, commandHistory;
    var _a;
    return __generator(this, function (_b) {
        try {
            command = req.body;
            // Log the command execution
            console.log("[Agent Command] Executing: ".concat(JSON.stringify(command)));
            result = { status: 'success', timestamp: new Date().toISOString() };
            switch (command.command) {
                case 'vault_register':
                    result = __assign(__assign({}, result), { message: 'Vault artifact registered successfully', artifact_id: "vault_".concat(Date.now(), "_").concat(Math.random().toString(36).substr(2, 9)), command_executed: command });
                    break;
                case 'activate_agents':
                    result = __assign(__assign({}, result), { message: "Activated agents: ".concat(((_a = command.agents) === null || _a === void 0 ? void 0 : _a.join(', ')) || 'none specified'), activated_agents: command.agents || [], command_executed: command });
                    break;
                case 'run_agent':
                    result = __assign(__assign({}, result), { message: "Executed ".concat(command.agent, " with action: ").concat(command.action), agent: command.agent, action: command.action, target: command.target, command_executed: command });
                    break;
                default:
                    result = __assign(__assign({}, result), { message: "Command processed: ".concat(command.command), command_executed: command });
            }
            commandHistory = {
                id: "cmd_".concat(Date.now()),
                command: command.command,
                timestamp: new Date().toISOString(),
                status: 'completed',
                result: result
            };
            console.log("[Agent Command] Completed: ".concat(commandHistory.id));
            return [2 /*return*/, res.json({
                    success: true,
                    result: result,
                    history: commandHistory
                })];
        }
        catch (error) {
            console.error('[Agent Command] Error:', error);
            return [2 /*return*/, res.status(400).json({
                    success: false,
                    error: 'Command execution failed',
                    details: {
                        message: error.message,
                        command: req.body
                    }
                })];
        }
        return [2 /*return*/];
    });
}); });
// Get command history
router.get('/command-history', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var mockHistory;
    return __generator(this, function (_a) {
        try {
            mockHistory = [
                {
                    id: 'cmd_001',
                    command: 'activate_agents',
                    agents: ['DreamAgent Core', 'Connector Agent', 'Context Manager'],
                    timestamp: new Date(Date.now() - 3600000).toISOString(),
                    status: 'completed'
                },
                {
                    id: 'cmd_002',
                    command: 'activate_agents',
                    agents: ['DREAMKEEPER', 'Nano Agents', 'Reflex Protocol'],
                    timestamp: new Date(Date.now() - 1800000).toISOString(),
                    status: 'completed'
                },
                {
                    id: 'cmd_003',
                    command: 'run_agent',
                    agent: 'IntegrationScanner',
                    action: 'scan_and_link_all',
                    timestamp: new Date(Date.now() - 900000).toISOString(),
                    status: 'completed'
                }
            ];
            return [2 /*return*/, res.json({
                    history: mockHistory,
                    count: mockHistory.length
                })];
        }
        catch (error) {
            console.error('[Command History] Error:', error);
            return [2 /*return*/, res.status(400).json({
                    success: false,
                    error: 'Failed to fetch command history',
                    details: error.message
                })];
        }
        return [2 /*return*/];
    });
}); });
exports.default = router;
