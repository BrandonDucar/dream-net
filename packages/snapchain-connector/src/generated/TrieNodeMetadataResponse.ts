// Original file: C:/Users/brand/.antigravity/dream-net/packages/snapchain-connector/proto/definitions/request_response.proto

import type { TrieNodeMetadataResponse as _TrieNodeMetadataResponse, TrieNodeMetadataResponse__Output as _TrieNodeMetadataResponse__Output } from './TrieNodeMetadataResponse';
import type { Long } from '@grpc/proto-loader';

export interface TrieNodeMetadataResponse {
  'prefix'?: (Buffer | Uint8Array | string);
  'numMessages'?: (number | string | Long);
  'hash'?: (string);
  'children'?: (_TrieNodeMetadataResponse)[];
}

export interface TrieNodeMetadataResponse__Output {
  'prefix': (Buffer);
  'numMessages': (string);
  'hash': (string);
  'children': (_TrieNodeMetadataResponse__Output)[];
}
