// Original file: C:/Users/brand/.antigravity/dream-net/packages/snapchain-connector/proto/definitions/message.proto

import type { Protocol as _Protocol, Protocol__Output as _Protocol__Output } from './Protocol';

export interface VerificationRemoveBody {
  'address'?: (Buffer | Uint8Array | string);
  'protocol'?: (_Protocol);
}

export interface VerificationRemoveBody__Output {
  'address': (Buffer);
  'protocol': (_Protocol__Output);
}
