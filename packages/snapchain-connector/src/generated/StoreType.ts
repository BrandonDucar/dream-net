// Original file: C:/Users/brand/.antigravity/dream-net/packages/snapchain-connector/proto/definitions/request_response.proto

export const StoreType = {
  STORE_TYPE_NONE: 'STORE_TYPE_NONE',
  STORE_TYPE_CASTS: 'STORE_TYPE_CASTS',
  STORE_TYPE_LINKS: 'STORE_TYPE_LINKS',
  STORE_TYPE_REACTIONS: 'STORE_TYPE_REACTIONS',
  STORE_TYPE_USER_DATA: 'STORE_TYPE_USER_DATA',
  STORE_TYPE_VERIFICATIONS: 'STORE_TYPE_VERIFICATIONS',
  STORE_TYPE_USERNAME_PROOFS: 'STORE_TYPE_USERNAME_PROOFS',
  STORE_TYPE_STORAGE_LENDS: 'STORE_TYPE_STORAGE_LENDS',
} as const;

export type StoreType =
  | 'STORE_TYPE_NONE'
  | 0
  | 'STORE_TYPE_CASTS'
  | 1
  | 'STORE_TYPE_LINKS'
  | 2
  | 'STORE_TYPE_REACTIONS'
  | 3
  | 'STORE_TYPE_USER_DATA'
  | 4
  | 'STORE_TYPE_VERIFICATIONS'
  | 5
  | 'STORE_TYPE_USERNAME_PROOFS'
  | 6
  | 'STORE_TYPE_STORAGE_LENDS'
  | 7

export type StoreType__Output = typeof StoreType[keyof typeof StoreType]
