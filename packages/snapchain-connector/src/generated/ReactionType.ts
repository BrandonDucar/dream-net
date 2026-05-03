// Original file: C:/Users/brand/.antigravity/dream-net/packages/snapchain-connector/proto/definitions/message.proto

export const ReactionType = {
  REACTION_TYPE_NONE: 'REACTION_TYPE_NONE',
  REACTION_TYPE_LIKE: 'REACTION_TYPE_LIKE',
  REACTION_TYPE_RECAST: 'REACTION_TYPE_RECAST',
} as const;

export type ReactionType =
  | 'REACTION_TYPE_NONE'
  | 0
  | 'REACTION_TYPE_LIKE'
  | 1
  | 'REACTION_TYPE_RECAST'
  | 2

export type ReactionType__Output = typeof ReactionType[keyof typeof ReactionType]
