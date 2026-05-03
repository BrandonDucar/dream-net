// Original file: C:/Users/brand/.antigravity/dream-net/packages/snapchain-connector/proto/definitions/onchain_event.proto

export const OnChainEventType = {
  EVENT_TYPE_NONE: 'EVENT_TYPE_NONE',
  EVENT_TYPE_SIGNER: 'EVENT_TYPE_SIGNER',
  EVENT_TYPE_SIGNER_MIGRATED: 'EVENT_TYPE_SIGNER_MIGRATED',
  EVENT_TYPE_ID_REGISTER: 'EVENT_TYPE_ID_REGISTER',
  EVENT_TYPE_STORAGE_RENT: 'EVENT_TYPE_STORAGE_RENT',
  EVENT_TYPE_TIER_PURCHASE: 'EVENT_TYPE_TIER_PURCHASE',
} as const;

export type OnChainEventType =
  | 'EVENT_TYPE_NONE'
  | 0
  | 'EVENT_TYPE_SIGNER'
  | 1
  | 'EVENT_TYPE_SIGNER_MIGRATED'
  | 2
  | 'EVENT_TYPE_ID_REGISTER'
  | 3
  | 'EVENT_TYPE_STORAGE_RENT'
  | 4
  | 'EVENT_TYPE_TIER_PURCHASE'
  | 5

export type OnChainEventType__Output = typeof OnChainEventType[keyof typeof OnChainEventType]
