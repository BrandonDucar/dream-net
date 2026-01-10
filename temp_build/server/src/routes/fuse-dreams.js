"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = fuseDreamsHandler;
function fuseDreamsHandler(req, res) {
    var _a = req.body, dreamIds = _a.dreamIds, fusionType = _a.fusionType;
    var fusedDream = {
        id: "fused-".concat(Date.now()),
        title: "Fused Dream: ".concat(dreamIds.join(' + ')),
        dreamCloud: 'custom',
        fusionType: fusionType,
        parentDreams: dreamIds,
        createdAt: new Date().toISOString()
    };
    res.json({ success: true, fusedDream: fusedDream });
}
