// Original file: C:/Users/brand/.antigravity/dream-net/packages/snapchain-connector/proto/definitions/message.proto

export const HashScheme = {
  HASH_SCHEME_NONE: 'HASH_SCHEME_NONE',
  HASH_SCHEME_BLAKE3: 'HASH_SCHEME_BLAKE3',
} as const;

export type HashScheme =
  | 'HASH_SCHEME_NONE'
  | 0
  | 'HASH_SCHEME_BLAKE3'
  | 1

export type HashScheme__Output = typeof HashScheme[keyof typeof HashScheme]
