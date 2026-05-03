// Original file: C:/Users/brand/.antigravity/dream-net/packages/snapchain-connector/proto/definitions/blocks.proto

import type { Message as _Message, Message__Output as _Message__Output } from './Message';
import type { ValidatorMessage as _ValidatorMessage, ValidatorMessage__Output as _ValidatorMessage__Output } from './ValidatorMessage';
import type { Long } from '@grpc/proto-loader';

export interface Transaction {
  'fid'?: (number | string | Long);
  'userMessages'?: (_Message)[];
  'systemMessages'?: (_ValidatorMessage)[];
  'accountRoot'?: (Buffer | Uint8Array | string);
}

export interface Transaction__Output {
  'fid': (string);
  'userMessages': (_Message__Output)[];
  'systemMessages': (_ValidatorMessage__Output)[];
  'accountRoot': (Buffer);
}
