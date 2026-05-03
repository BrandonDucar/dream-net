// Original file: C:/Users/brand/.antigravity/dream-net/packages/snapchain-connector/proto/definitions/blocks.proto

export const VoteType = {
  PREVOTE: 'PREVOTE',
  PRECOMMIT: 'PRECOMMIT',
} as const;

export type VoteType =
  | 'PREVOTE'
  | 0
  | 'PRECOMMIT'
  | 1

export type VoteType__Output = typeof VoteType[keyof typeof VoteType]
