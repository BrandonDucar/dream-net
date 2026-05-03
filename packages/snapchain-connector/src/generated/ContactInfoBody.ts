// Original file: C:/Users/brand/.antigravity/dream-net/packages/snapchain-connector/proto/definitions/request_response.proto

import type { FarcasterNetwork as _FarcasterNetwork, FarcasterNetwork__Output as _FarcasterNetwork__Output } from './FarcasterNetwork';
import type { Long } from '@grpc/proto-loader';

export interface ContactInfoBody {
  'gossipAddress'?: (string);
  'peerId'?: (Buffer | Uint8Array | string);
  'snapchainVersion'?: (string);
  'network'?: (_FarcasterNetwork);
  'timestamp'?: (number | string | Long);
  'announceRpcAddress'?: (string);
}

export interface ContactInfoBody__Output {
  'gossipAddress': (string);
  'peerId': (Buffer);
  'snapchainVersion': (string);
  'network': (_FarcasterNetwork__Output);
  'timestamp': (string);
  'announceRpcAddress': (string);
}
