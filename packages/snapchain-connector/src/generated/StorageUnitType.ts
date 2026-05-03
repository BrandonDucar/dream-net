// Original file: C:/Users/brand/.antigravity/dream-net/packages/snapchain-connector/proto/definitions/message.proto

export const StorageUnitType = {
  UNIT_TYPE_LEGACY: 'UNIT_TYPE_LEGACY',
  UNIT_TYPE_2024: 'UNIT_TYPE_2024',
  UNIT_TYPE_2025: 'UNIT_TYPE_2025',
} as const;

export type StorageUnitType =
  | 'UNIT_TYPE_LEGACY'
  | 0
  | 'UNIT_TYPE_2024'
  | 1
  | 'UNIT_TYPE_2025'
  | 2

export type StorageUnitType__Output = typeof StorageUnitType[keyof typeof StorageUnitType]
