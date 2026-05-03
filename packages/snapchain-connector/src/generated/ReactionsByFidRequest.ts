// Original file: C:/Users/brand/.antigravity/dream-net/packages/snapchain-connector/proto/definitions/request_response.proto

import type { ReactionType as _ReactionType, ReactionType__Output as _ReactionType__Output } from './ReactionType';
import type { Long } from '@grpc/proto-loader';

export interface ReactionsByFidRequest {
  'fid'?: (number | string | Long);
  'reactionType'?: (_ReactionType);
  'pageSize'?: (number);
  'pageToken'?: (Buffer | Uint8Array | string);
  'reverse'?: (boolean);
  '_reactionType'?: "reactionType";
  '_pageSize'?: "pageSize";
  '_pageToken'?: "pageToken";
  '_reverse'?: "reverse";
}

export interface ReactionsByFidRequest__Output {
  'fid': (string);
  'reactionType'?: (_ReactionType__Output);
  'pageSize'?: (number);
  'pageToken'?: (Buffer);
  'reverse'?: (boolean);
  '_reactionType'?: "reactionType";
  '_pageSize'?: "pageSize";
  '_pageToken'?: "pageToken";
  '_reverse'?: "reverse";
}
