// Original file: C:/Users/brand/.antigravity/dream-net/packages/snapchain-connector/proto/definitions/message.proto

import type { Protocol as _Protocol, Protocol__Output as _Protocol__Output } from './Protocol';

export interface VerificationAddAddressBody {
  'address'?: (Buffer | Uint8Array | string);
  'claimSignature'?: (Buffer | Uint8Array | string);
  'blockHash'?: (Buffer | Uint8Array | string);
  'verificationType'?: (number);
  'chainId'?: (number);
  'protocol'?: (_Protocol);
}

export interface VerificationAddAddressBody__Output {
  'address': (Buffer);
  'claimSignature': (Buffer);
  'blockHash': (Buffer);
  'verificationType': (number);
  'chainId': (number);
  'protocol': (_Protocol__Output);
}
