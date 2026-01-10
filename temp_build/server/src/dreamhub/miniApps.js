"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.miniAppRegistry = void 0;
var MiniAppRegistry = /** @class */ (function () {
    function MiniAppRegistry() {
        this.miniApps = new Map();
    }
    MiniAppRegistry.prototype.registerMiniApp = function (app) {
        this.miniApps.set(app.id, app);
        console.log("\u2705 Registered mini app: ".concat(app.name, " (").concat(app.id, ")"));
    };
    MiniAppRegistry.prototype.getMiniApp = function (id) {
        return this.miniApps.get(id);
    };
    MiniAppRegistry.prototype.listMiniApps = function () {
        return Array.from(this.miniApps.values());
    };
    return MiniAppRegistry;
}());
// Global registry instance
exports.miniAppRegistry = new MiniAppRegistry();
