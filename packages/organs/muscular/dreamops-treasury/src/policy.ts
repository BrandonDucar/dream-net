import { TreasuryPolicy } from './types.js';

export class PolicyEngine {
  private policies: TreasuryPolicy[] = [];

  constructor(initialPolicies: TreasuryPolicy[] = []) {
    this.policies = initialPolicies;
  }

  /**
   * Evaluates if a proposed settlement complies with all active policies.
   */
  public async evaluate(settlement: { amount: bigint; token?: string; payee: string }): Promise<{ allowed: boolean; reason?: string }> {
    const activePolicies = this.policies.filter(p => p.isActive);

    for (const policy of activePolicies) {
      for (const condition of policy.conditions) {
        switch (condition.type) {
          case 'MAX_AMOUNT':
            if (settlement.amount > BigInt(condition.value)) {
              return { allowed: false, reason: `Policy '${policy.name}' violation: Amount exceeds maximum allowed (${condition.value})` };
            }
            break;
          case 'ALLOWLIST':
            const allowlist = condition.value as string[];
            if (!allowlist.includes(settlement.payee.toLowerCase())) {
              return { allowed: false, reason: `Policy '${policy.name}' violation: Payee not in allowlist` };
            }
            break;
          case 'APPROVAL_REQUIRED':
            // Logic handled by the Governance Gate agent
            return { allowed: false, reason: `Policy '${policy.name}' requires explicit manual approval` };
          default:
            break;
        }
      }
    }

    return { allowed: true };
  }

  public addPolicy(policy: TreasuryPolicy) {
    this.policies.push(policy);
  }
}
