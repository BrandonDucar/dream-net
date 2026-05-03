// Original file: C:/Users/brand/.antigravity/dream-net/packages/snapchain-connector/proto/definitions/message.proto

export const SignatureScheme = {
  SIGNATURE_SCHEME_NONE: 'SIGNATURE_SCHEME_NONE',
  SIGNATURE_SCHEME_ED25519: 'SIGNATURE_SCHEME_ED25519',
  SIGNATURE_SCHEME_EIP712: 'SIGNATURE_SCHEME_EIP712',
} as const;

export type SignatureScheme =
  | 'SIGNATURE_SCHEME_NONE'
  | 0
  | 'SIGNATURE_SCHEME_ED25519'
  | 1
  | 'SIGNATURE_SCHEME_EIP712'
  | 2

export type SignatureScheme__Output = typeof SignatureScheme[keyof typeof SignatureScheme]
