// Original file: C:/Users/brand/.antigravity/dream-net/packages/snapchain-connector/proto/definitions/username_proof.proto

export const UserNameType = {
  USERNAME_TYPE_NONE: 'USERNAME_TYPE_NONE',
  USERNAME_TYPE_FNAME: 'USERNAME_TYPE_FNAME',
  USERNAME_TYPE_ENS_L1: 'USERNAME_TYPE_ENS_L1',
  USERNAME_TYPE_BASENAME: 'USERNAME_TYPE_BASENAME',
} as const;

export type UserNameType =
  | 'USERNAME_TYPE_NONE'
  | 0
  | 'USERNAME_TYPE_FNAME'
  | 1
  | 'USERNAME_TYPE_ENS_L1'
  | 2
  | 'USERNAME_TYPE_BASENAME'
  | 3

export type UserNameType__Output = typeof UserNameType[keyof typeof UserNameType]
