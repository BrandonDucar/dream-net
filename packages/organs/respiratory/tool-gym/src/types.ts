import { z } from 'zod';

export const P_O_W_K_Schema = z.object({
  id: z.string().uuid(),
  agentId: z.string(),
  timestamp: z.number(),
  workoutType: z.enum(['STRENGTH', 'AGILITY', 'REASONING', 'ADVERSARIAL']),
  performanceDelta: z.object({
    latency: z.number(), // ms improvement
    successRate: z.number(), // 0-1 delta
    reasoningDepth: z.number() // score delta
  }),
  metrics: z.record(z.any()),
  attestationHash: z.string()
});

export type P_O_W_K = z.infer<typeof P_O_W_K_Schema>;

export const WorkoutScheduleSchema = z.object({
  id: z.string().uuid(),
  agentId: z.string(),
  frequency: z.enum(['DAILY', 'WEEKLY']),
  regime: z.array(z.string()), // IDs of exercises
  lastWorkout: z.number().optional(),
  nextWorkout: z.number()
});

export type WorkoutSchedule = z.infer<typeof WorkoutScheduleSchema>;

export const MembershipSchema = z.object({
  id: z.string().uuid(),
  owner: z.string(), // Wallet or Agent ID
  tier: z.enum(['INDIVIDUAL', 'TEAM', 'SWARM']),
  status: z.enum(['ACTIVE', 'EXPIRED']),
  expiresAt: z.number(),
  powsCount: z.number()
});

export type Membership = z.infer<typeof MembershipSchema>;
