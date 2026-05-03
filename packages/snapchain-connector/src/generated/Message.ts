// Original file: C:/Users/brand/.antigravity/dream-net/packages/snapchain-connector/proto/definitions/message.proto

import type { MessageData as _MessageData, MessageData__Output as _MessageData__Output } from './MessageData';
import type { HashScheme as _HashScheme, HashScheme__Output as _HashScheme__Output } from './HashScheme';
import type { SignatureScheme as _SignatureScheme, SignatureScheme__Output as _SignatureScheme__Output } from './SignatureScheme';

export interface Message {
  'data'?: (_MessageData | null);
  'hash'?: (Buffer | Uint8Array | string);
  'hashScheme'?: (_HashScheme);
  'signature'?: (Buffer | Uint8Array | string);
  'signatureScheme'?: (_SignatureScheme);
  'signer'?: (Buffer | Uint8Array | string);
  'dataBytes'?: (Buffer | Uint8Array | string);
  '_dataBytes'?: "dataBytes";
}

export interface Message__Output {
  'data': (_MessageData__Output | null);
  'hash': (Buffer);
  'hashScheme': (_HashScheme__Output);
  'signature': (Buffer);
  'signatureScheme': (_SignatureScheme__Output);
  'signer': (Buffer);
  'dataBytes'?: (Buffer);
  '_dataBytes'?: "dataBytes";
}
