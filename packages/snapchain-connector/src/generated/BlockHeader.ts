// Original file: C:/Users/brand/.antigravity/dream-net/packages/snapchain-connector/proto/definitions/blocks.proto

import type { Height as _Height, Height__Output as _Height__Output } from './Height';
import type { FarcasterNetwork as _FarcasterNetwork, FarcasterNetwork__Output as _FarcasterNetwork__Output } from './FarcasterNetwork';
import type { Long } from '@grpc/proto-loader';

export interface BlockHeader {
  'height'?: (_Height | null);
  'timestamp'?: (number | string | Long);
  'version'?: (number);
  'chainId'?: (_FarcasterNetwork);
  'shardWitnessesHash'?: (Buffer | Uint8Array | string);
  'parentHash'?: (Buffer | Uint8Array | string);
  'stateRoot'?: (Buffer | Uint8Array | string);
  'eventsHash'?: (Buffer | Uint8Array | string);
}

export interface BlockHeader__Output {
  'height': (_Height__Output | null);
  'timestamp': (string);
  'version': (number);
  'chainId': (_FarcasterNetwork__Output);
  'shardWitnessesHash': (Buffer);
  'parentHash': (Buffer);
  'stateRoot': (Buffer);
  'eventsHash': (Buffer);
}
