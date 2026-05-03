// Original file: C:/Users/brand/.antigravity/dream-net/packages/snapchain-connector/proto/definitions/request_response.proto

export const SignerSource = {
  SIGNER_SOURCE_NONE: 'SIGNER_SOURCE_NONE',
  SIGNER_SOURCE_ONCHAIN: 'SIGNER_SOURCE_ONCHAIN',
  SIGNER_SOURCE_OFFCHAIN: 'SIGNER_SOURCE_OFFCHAIN',
} as const;

export type SignerSource =
  | 'SIGNER_SOURCE_NONE'
  | 0
  | 'SIGNER_SOURCE_ONCHAIN'
  | 1
  | 'SIGNER_SOURCE_OFFCHAIN'
  | 2

export type SignerSource__Output = typeof SignerSource[keyof typeof SignerSource]
