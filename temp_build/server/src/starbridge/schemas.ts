import { z } from "zod";
import { StarbridgeSource, StarbridgeTopic } from "./types";

export const starbridgeEventSchema = z.object({
  id: z.string().uuid().optional(),
  topic: z.nativeEnum(StarbridgeTopic),
  source: z.nativeEnum(StarbridgeSource),
  type: z.string().min(1),
  ts: z.number().int().optional(),
  payload: z.unknown().optional(),
});

export type StarbridgeEventInput = z.infer<typeof starbridgeEventSchema>;

export const starbridgeQuerySchema = z.object({
  topics: z
    .array(z.nativeEnum(StarbridgeTopic))
    .optional()
    .default(Object.values(StarbridgeTopic)),
  limit: z.number().int().positive().max(500).optional().default(100),
  since: z.string().optional(),
});

export type StarbridgeQuery = z.infer<typeof starbridgeQuerySchema>;
