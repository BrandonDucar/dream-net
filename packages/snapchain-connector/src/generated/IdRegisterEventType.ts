// Original file: C:/Users/brand/.antigravity/dream-net/packages/snapchain-connector/proto/definitions/onchain_event.proto

export const IdRegisterEventType = {
  ID_REGISTER_EVENT_TYPE_NONE: 'ID_REGISTER_EVENT_TYPE_NONE',
  ID_REGISTER_EVENT_TYPE_REGISTER: 'ID_REGISTER_EVENT_TYPE_REGISTER',
  ID_REGISTER_EVENT_TYPE_TRANSFER: 'ID_REGISTER_EVENT_TYPE_TRANSFER',
  ID_REGISTER_EVENT_TYPE_CHANGE_RECOVERY: 'ID_REGISTER_EVENT_TYPE_CHANGE_RECOVERY',
} as const;

export type IdRegisterEventType =
  | 'ID_REGISTER_EVENT_TYPE_NONE'
  | 0
  | 'ID_REGISTER_EVENT_TYPE_REGISTER'
  | 1
  | 'ID_REGISTER_EVENT_TYPE_TRANSFER'
  | 2
  | 'ID_REGISTER_EVENT_TYPE_CHANGE_RECOVERY'
  | 3

export type IdRegisterEventType__Output = typeof IdRegisterEventType[keyof typeof IdRegisterEventType]
