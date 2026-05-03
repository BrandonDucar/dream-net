// Original file: C:/Users/brand/.antigravity/dream-net/packages/snapchain-connector/proto/definitions/message.proto

export const Protocol = {
  PROTOCOL_ETHEREUM: 'PROTOCOL_ETHEREUM',
  PROTOCOL_SOLANA: 'PROTOCOL_SOLANA',
} as const;

export type Protocol =
  | 'PROTOCOL_ETHEREUM'
  | 0
  | 'PROTOCOL_SOLANA'
  | 1

export type Protocol__Output = typeof Protocol[keyof typeof Protocol]
