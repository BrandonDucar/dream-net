// Original file: C:/Users/brand/.antigravity/dream-net/packages/snapchain-connector/proto/definitions/onchain_event.proto

import type { IdRegisterEventType as _IdRegisterEventType, IdRegisterEventType__Output as _IdRegisterEventType__Output } from './IdRegisterEventType';

export interface IdRegisterEventBody {
  'to'?: (Buffer | Uint8Array | string);
  'eventType'?: (_IdRegisterEventType);
  'from'?: (Buffer | Uint8Array | string);
  'recoveryAddress'?: (Buffer | Uint8Array | string);
}

export interface IdRegisterEventBody__Output {
  'to': (Buffer);
  'eventType': (_IdRegisterEventType__Output);
  'from': (Buffer);
  'recoveryAddress': (Buffer);
}
