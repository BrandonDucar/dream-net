"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.computeMerkleRoot = computeMerkleRoot;
var buffer_1 = require("buffer");
var hash_1 = require("./hash");
function pairwiseHash(a, b, algo) {
    var combined = buffer_1.Buffer.concat([a, b]);
    return buffer_1.Buffer.from((0, hash_1.hashBuffer)(combined, algo), "hex");
}
function computeMerkleRoot(hashes, algo) {
    var _a;
    if (hashes.length === 0) {
        return (0, hash_1.hashBuffer)(buffer_1.Buffer.from(""), algo);
    }
    var layer = hashes.map(function (hex) { return buffer_1.Buffer.from(hex, "hex"); });
    while (layer.length > 1) {
        var next = [];
        for (var i = 0; i < layer.length; i += 2) {
            var left = layer[i];
            var right = (_a = layer[i + 1]) !== null && _a !== void 0 ? _a : layer[i];
            next.push(pairwiseHash(left, right, algo));
        }
        layer = next;
    }
    return layer[0].toString("hex");
}
