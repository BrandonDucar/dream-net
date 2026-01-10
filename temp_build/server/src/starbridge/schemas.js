"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.starbridgeQuerySchema = exports.starbridgeEventSchema = void 0;
var zod_1 = require("zod");
var types_1 = require("./types");
exports.starbridgeEventSchema = zod_1.z.object({
    id: zod_1.z.string().uuid().optional(),
    topic: zod_1.z.nativeEnum(types_1.StarbridgeTopic),
    source: zod_1.z.nativeEnum(types_1.StarbridgeSource),
    type: zod_1.z.string().min(1),
    ts: zod_1.z.number().int().optional(),
    payload: zod_1.z.unknown().optional(),
});
exports.starbridgeQuerySchema = zod_1.z.object({
    topics: zod_1.z
        .array(zod_1.z.nativeEnum(types_1.StarbridgeTopic))
        .optional()
        .default(Object.values(types_1.StarbridgeTopic)),
    limit: zod_1.z.number().int().positive().max(500).optional().default(100),
    since: zod_1.z.string().optional(),
});
