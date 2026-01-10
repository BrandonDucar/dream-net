"use strict";
/**
 * DreamNet Email System
 *
 * Email infrastructure for DreamNet communications:
 * - Grant applications
 * - Outreach automation
 * - System notifications
 * - Fleet communications
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
exports.dreamNetEmail = void 0;
var node_crypto_1 = require("node:crypto");
var DreamNetEmail = /** @class */ (function () {
    function DreamNetEmail() {
        this.messages = new Map();
        // Default to console for now, can be configured via env
        this.config = {
            provider: process.env.EMAIL_PROVIDER || "console",
            from: process.env.DREAMNET_EMAIL || "dreamnetgmo@gmail.com",
            replyTo: process.env.DREAMNET_REPLY_TO || "dreamnetgmo@gmail.com",
            apiKey: process.env.EMAIL_API_KEY,
        };
    }
    /**
     * Send email
     */
    DreamNetEmail.prototype.sendEmail = function (to, subject, body, html, metadata) {
        return __awaiter(this, void 0, void 0, function () {
            var message, _a, error_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        message = {
                            id: (0, node_crypto_1.randomUUID)(),
                            to: to,
                            subject: subject,
                            body: body,
                            html: html,
                            from: this.config.from,
                            replyTo: this.config.replyTo,
                            status: "pending",
                            metadata: metadata,
                        };
                        this.messages.set(message.id, message);
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 12, , 13]);
                        _a = this.config.provider;
                        switch (_a) {
                            case "console": return [3 /*break*/, 2];
                            case "resend": return [3 /*break*/, 4];
                            case "sendgrid": return [3 /*break*/, 6];
                            case "smtp": return [3 /*break*/, 8];
                        }
                        return [3 /*break*/, 10];
                    case 2: return [4 /*yield*/, this.sendViaConsole(message)];
                    case 3:
                        _b.sent();
                        return [3 /*break*/, 11];
                    case 4: return [4 /*yield*/, this.sendViaResend(message)];
                    case 5:
                        _b.sent();
                        return [3 /*break*/, 11];
                    case 6: return [4 /*yield*/, this.sendViaSendGrid(message)];
                    case 7:
                        _b.sent();
                        return [3 /*break*/, 11];
                    case 8: return [4 /*yield*/, this.sendViaSMTP(message)];
                    case 9:
                        _b.sent();
                        return [3 /*break*/, 11];
                    case 10: throw new Error("Unknown email provider: ".concat(this.config.provider));
                    case 11:
                        message.status = "sent";
                        message.sentAt = new Date().toISOString();
                        return [3 /*break*/, 13];
                    case 12:
                        error_1 = _b.sent();
                        message.status = "failed";
                        message.error = error_1.message;
                        console.error("[DreamNet Email] Failed to send:", error_1);
                        return [3 /*break*/, 13];
                    case 13: return [2 /*return*/, message];
                }
            });
        });
    };
    /**
     * Send via console (for development)
     */
    DreamNetEmail.prototype.sendViaConsole = function (message) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("\n📧 [DreamNet Email]");
                        console.log("From: ".concat(message.from));
                        console.log("To: ".concat(Array.isArray(message.to) ? message.to.join(", ") : message.to));
                        console.log("Subject: ".concat(message.subject));
                        console.log("Body:\n".concat(message.body, "\n"));
                        if (message.html) {
                            console.log("HTML:\n".concat(message.html, "\n"));
                        }
                        // Simulate async
                        return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 100); })];
                    case 1:
                        // Simulate async
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Send via Resend (production)
     */
    DreamNetEmail.prototype.sendViaResend = function (message) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.config.apiKey) {
                            throw new Error("Resend API key not configured");
                        }
                        // TODO: Implement Resend integration
                        // const resend = new Resend(this.config.apiKey);
                        // await resend.emails.send({
                        //   from: message.from!,
                        //   to: Array.isArray(message.to) ? message.to : [message.to],
                        //   subject: message.subject,
                        //   text: message.body,
                        //   html: message.html,
                        //   reply_to: message.replyTo,
                        // });
                        // For now, fallback to console
                        return [4 /*yield*/, this.sendViaConsole(message)];
                    case 1:
                        // TODO: Implement Resend integration
                        // const resend = new Resend(this.config.apiKey);
                        // await resend.emails.send({
                        //   from: message.from!,
                        //   to: Array.isArray(message.to) ? message.to : [message.to],
                        //   subject: message.subject,
                        //   text: message.body,
                        //   html: message.html,
                        //   reply_to: message.replyTo,
                        // });
                        // For now, fallback to console
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Send via SendGrid (production)
     */
    DreamNetEmail.prototype.sendViaSendGrid = function (message) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.config.apiKey) {
                            throw new Error("SendGrid API key not configured");
                        }
                        // TODO: Implement SendGrid integration
                        // const sgMail = require('@sendgrid/mail');
                        // sgMail.setApiKey(this.config.apiKey);
                        // await sgMail.send({
                        //   to: Array.isArray(message.to) ? message.to : [message.to],
                        //   from: message.from!,
                        //   subject: message.subject,
                        //   text: message.body,
                        //   html: message.html,
                        //   replyTo: message.replyTo,
                        // });
                        // For now, fallback to console
                        return [4 /*yield*/, this.sendViaConsole(message)];
                    case 1:
                        // TODO: Implement SendGrid integration
                        // const sgMail = require('@sendgrid/mail');
                        // sgMail.setApiKey(this.config.apiKey);
                        // await sgMail.send({
                        //   to: Array.isArray(message.to) ? message.to : [message.to],
                        //   from: message.from!,
                        //   subject: message.subject,
                        //   text: message.body,
                        //   html: message.html,
                        //   replyTo: message.replyTo,
                        // });
                        // For now, fallback to console
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Send via SMTP
     */
    DreamNetEmail.prototype.sendViaSMTP = function (message) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: 
                    // TODO: Implement SMTP integration
                    // const nodemailer = require('nodemailer');
                    // const transporter = nodemailer.createTransport({
                    //   host: this.config.smtpHost,
                    //   port: this.config.smtpPort,
                    //   auth: {
                    //     user: this.config.smtpUser,
                    //     pass: this.config.smtpPass,
                    //   },
                    // });
                    // await transporter.sendMail({
                    //   from: message.from,
                    //   to: Array.isArray(message.to) ? message.to : [message.to],
                    //   subject: message.subject,
                    //   text: message.body,
                    //   html: message.html,
                    //   replyTo: message.replyTo,
                    // });
                    // For now, fallback to console
                    return [4 /*yield*/, this.sendViaConsole(message)];
                    case 1:
                        // TODO: Implement SMTP integration
                        // const nodemailer = require('nodemailer');
                        // const transporter = nodemailer.createTransport({
                        //   host: this.config.smtpHost,
                        //   port: this.config.smtpPort,
                        //   auth: {
                        //     user: this.config.smtpUser,
                        //     pass: this.config.smtpPass,
                        //   },
                        // });
                        // await transporter.sendMail({
                        //   from: message.from,
                        //   to: Array.isArray(message.to) ? message.to : [message.to],
                        //   subject: message.subject,
                        //   text: message.body,
                        //   html: message.html,
                        //   replyTo: message.replyTo,
                        // });
                        // For now, fallback to console
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Generate outreach email from template
     */
    DreamNetEmail.prototype.generateOutreachEmail = function (template, variables) {
        return __awaiter(this, void 0, void 0, function () {
            var wolfPack, subject, body, _i, _a, _b, key, value;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("../agents/WolfPack"); })];
                    case 1:
                        wolfPack = (_c.sent()).wolfPack;
                        subject = template;
                        body = template;
                        for (_i = 0, _a = Object.entries(variables); _i < _a.length; _i++) {
                            _b = _a[_i], key = _b[0], value = _b[1];
                            subject = subject.replace("{{".concat(key, "}}"), value);
                            body = body.replace("{{".concat(key, "}}"), value);
                        }
                        return [2 /*return*/, { subject: subject, body: body }];
                }
            });
        });
    };
    /**
     * Get email history
     */
    DreamNetEmail.prototype.getEmailHistory = function (limit) {
        if (limit === void 0) { limit = 50; }
        return Array.from(this.messages.values())
            .sort(function (a, b) {
            var aTime = a.sentAt ? new Date(a.sentAt).getTime() : 0;
            var bTime = b.sentAt ? new Date(b.sentAt).getTime() : 0;
            return bTime - aTime;
        })
            .slice(0, limit);
    };
    /**
     * Configure email provider
     */
    DreamNetEmail.prototype.configure = function (config) {
        this.config = __assign(__assign({}, this.config), config);
    };
    return DreamNetEmail;
}());
// Export singleton
exports.dreamNetEmail = new DreamNetEmail();
