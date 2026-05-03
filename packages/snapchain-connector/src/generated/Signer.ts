// Original file: C:/Users/brand/.antigravity/dream-net/packages/snapchain-connector/proto/definitions/request_response.proto

import type { SignerSource as _SignerSource, SignerSource__Output as _SignerSource__Output } from './SignerSource';
import type { OnChainEvent as _OnChainEvent, OnChainEvent__Output as _OnChainEvent__Output } from './OnChainEvent';
import type { Long } from '@grpc/proto-loader';

export interface Signer {
  'source'?: (_SignerSource);
  'key'?: (Buffer | Uint8Array | string);
  'keyType'?: (number);
  'fid'?: (number | string | Long);
  'addedAt'?: (number | string | Long);
  'lastUsedAt'?: (number | string | Long);
  'ttl'?: (number);
  'expiresAt'?: (number | string | Long);
  'scopes'?: (number)[];
  'requestFid'?: (number | string | Long);
  'nonce'?: (number);
  'onchainEvent'?: (_OnChainEvent | null);
  '_addedAt'?: "addedAt";
  '_lastUsedAt'?: "lastUsedAt";
  '_ttl'?: "ttl";
  '_expiresAt'?: "expiresAt";
  '_requestFid'?: "requestFid";
  '_nonce'?: "nonce";
  '_onchainEvent'?: "onchainEvent";
}

export interface Signer__Output {
  'source': (_SignerSource__Output);
  'key': (Buffer);
  'keyType': (number);
  'fid': (string);
  'addedAt'?: (string);
  'lastUsedAt'?: (string);
  'ttl'?: (number);
  'expiresAt'?: (string);
  'scopes': (number)[];
  'requestFid'?: (string);
  'nonce'?: (number);
  'onchainEvent'?: (_OnChainEvent__Output | null);
  '_addedAt'?: "addedAt";
  '_lastUsedAt'?: "lastUsedAt";
  '_ttl'?: "ttl";
  '_expiresAt'?: "expiresAt";
  '_requestFid'?: "requestFid";
  '_nonce'?: "nonce";
  '_onchainEvent'?: "onchainEvent";
}
