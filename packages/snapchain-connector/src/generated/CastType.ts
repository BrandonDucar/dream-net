// Original file: C:/Users/brand/.antigravity/dream-net/packages/snapchain-connector/proto/definitions/message.proto

export const CastType = {
  CAST: 'CAST',
  LONG_CAST: 'LONG_CAST',
  TEN_K_CAST: 'TEN_K_CAST',
} as const;

export type CastType =
  | 'CAST'
  | 0
  | 'LONG_CAST'
  | 1
  | 'TEN_K_CAST'
  | 2

export type CastType__Output = typeof CastType[keyof typeof CastType]
