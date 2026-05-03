// Original file: C:/Users/brand/.antigravity/dream-net/packages/snapchain-connector/proto/definitions/username_proof.proto

import type { UserNameType as _UserNameType, UserNameType__Output as _UserNameType__Output } from './UserNameType';
import type { Long } from '@grpc/proto-loader';

export interface UserNameProof {
  'timestamp'?: (number | string | Long);
  'name'?: (Buffer | Uint8Array | string);
  'owner'?: (Buffer | Uint8Array | string);
  'signature'?: (Buffer | Uint8Array | string);
  'fid'?: (number | string | Long);
  'type'?: (_UserNameType);
}

export interface UserNameProof__Output {
  'timestamp': (string);
  'name': (Buffer);
  'owner': (Buffer);
  'signature': (Buffer);
  'fid': (string);
  'type': (_UserNameType__Output);
}
