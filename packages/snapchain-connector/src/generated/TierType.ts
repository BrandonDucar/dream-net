// Original file: C:/Users/brand/.antigravity/dream-net/packages/snapchain-connector/proto/definitions/onchain_event.proto

export const TierType = {
  None: 'None',
  Pro: 'Pro',
} as const;

export type TierType =
  | 'None'
  | 0
  | 'Pro'
  | 1

export type TierType__Output = typeof TierType[keyof typeof TierType]
