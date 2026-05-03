// Original file: C:/Users/brand/.antigravity/dream-net/packages/snapchain-connector/proto/definitions/message.proto

import type { CastId as _CastId, CastId__Output as _CastId__Output } from './CastId';

export interface FrameActionBody {
  'url'?: (Buffer | Uint8Array | string);
  'buttonIndex'?: (number);
  'castId'?: (_CastId | null);
  'inputText'?: (Buffer | Uint8Array | string);
  'state'?: (Buffer | Uint8Array | string);
  'transactionId'?: (Buffer | Uint8Array | string);
  'address'?: (Buffer | Uint8Array | string);
}

export interface FrameActionBody__Output {
  'url': (Buffer);
  'buttonIndex': (number);
  'castId': (_CastId__Output | null);
  'inputText': (Buffer);
  'state': (Buffer);
  'transactionId': (Buffer);
  'address': (Buffer);
}
