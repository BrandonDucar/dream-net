// Original file: C:/Users/brand/.antigravity/dream-net/packages/snapchain-connector/proto/definitions/onchain_event.proto

export const SignerEventType = {
  SIGNER_EVENT_TYPE_NONE: 'SIGNER_EVENT_TYPE_NONE',
  SIGNER_EVENT_TYPE_ADD: 'SIGNER_EVENT_TYPE_ADD',
  SIGNER_EVENT_TYPE_REMOVE: 'SIGNER_EVENT_TYPE_REMOVE',
  SIGNER_EVENT_TYPE_ADMIN_RESET: 'SIGNER_EVENT_TYPE_ADMIN_RESET',
} as const;

export type SignerEventType =
  | 'SIGNER_EVENT_TYPE_NONE'
  | 0
  | 'SIGNER_EVENT_TYPE_ADD'
  | 1
  | 'SIGNER_EVENT_TYPE_REMOVE'
  | 2
  | 'SIGNER_EVENT_TYPE_ADMIN_RESET'
  | 3

export type SignerEventType__Output = typeof SignerEventType[keyof typeof SignerEventType]
