// Original file: C:/Users/brand/.antigravity/dream-net/packages/snapchain-connector/proto/definitions/onchain_event.proto

import type { SignerEventType as _SignerEventType, SignerEventType__Output as _SignerEventType__Output } from './SignerEventType';

export interface SignerEventBody {
  'key'?: (Buffer | Uint8Array | string);
  'keyType'?: (number);
  'eventType'?: (_SignerEventType);
  'metadata'?: (Buffer | Uint8Array | string);
  'metadataType'?: (number);
}

export interface SignerEventBody__Output {
  'key': (Buffer);
  'keyType': (number);
  'eventType': (_SignerEventType__Output);
  'metadata': (Buffer);
  'metadataType': (number);
}
