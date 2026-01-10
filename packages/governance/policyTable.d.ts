import type { PolicyTable, PolicyRule, ActorContext, CapabilityType, ScopeType } from './types.js';
export declare function loadPolicyTable(path?: string): PolicyTable;
export declare function findMatchingRule(actor: ActorContext, capability: CapabilityType, scope: ScopeType, policyTable?: PolicyTable): PolicyRule | null;
export declare function requiresQuorum(rule: PolicyRule): boolean;
export declare function isReversible(rule: PolicyRule): boolean;
export declare function getMinApprovals(rule: PolicyRule, quorumType: string): number;
//# sourceMappingURL=policyTable.d.ts.map