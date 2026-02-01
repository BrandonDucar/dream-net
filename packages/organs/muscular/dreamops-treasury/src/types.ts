import { z } from 'zod';

export const TreasuryPolicySchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  description: z.string(),
  conditions: z.array(z.object({
    type: z.enum(['MAX_AMOUNT', 'ALLOWLIST', 'COOLDOWN', 'APPROVAL_REQUIRED']),
    value: z.any()
  })),
  isActive: z.boolean()
});

export type TreasuryPolicy = z.infer<typeof TreasuryPolicySchema>;

export const UserOperationSchema = z.object({
  sender: z.string(),
  nonce: z.string(),
  initCode: z.string(),
  callData: z.string(),
  callGasLimit: z.string(),
  verificationGasLimit: z.string(),
  preVerificationGas: z.string(),
  maxFeePerGas: z.string(),
  maxPriorityFeePerGas: z.string(),
  paymasterAndData: z.string(),
  signature: z.string()
});

export type UserOperation = z.infer<typeof UserOperationSchema>;

export const SettlementSchema = z.object({
  id: z.string().uuid(),
  bountyId: z.string(),
  amount: z.string(), // ether or token amount in hex/decimal string
  token: z.string().optional(), // Address of token or null for ETH
  payee: z.string(),
  status: z.enum(['PENDING', 'APPROVED', 'SPONSORED', 'EXECUTED', 'FAILED']),
  txHash: z.string().optional(),
  timestamp: z.number()
});

export type Settlement = z.infer<typeof SettlementSchema>;

export const POWKSchema = z.object({
  id: z.string(),
  agentId: z.string(),
  taskType: z.string(),
  metrics: z.object({
    latency_ms: z.number(),
    success_rate: z.number(),
    token_efficiency: z.number(),
    tool_use_count: z.number()
  }),
  attestation: z.string() // The P.O.W.K hash
});

export type P_O_W_K = z.infer<typeof POWKSchema>;
