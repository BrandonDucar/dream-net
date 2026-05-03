// Original file: C:/Users/brand/.antigravity/dream-net/packages/snapchain-connector/proto/definitions/blocks.proto

import type { UserNameProof as _UserNameProof, UserNameProof__Output as _UserNameProof__Output } from './UserNameProof';
import type { Long } from '@grpc/proto-loader';

export interface FnameTransfer {
  'id'?: (number | string | Long);
  'fromFid'?: (number | string | Long);
  'proof'?: (_UserNameProof | null);
}

export interface FnameTransfer__Output {
  'id': (string);
  'fromFid': (string);
  'proof': (_UserNameProof__Output | null);
}
