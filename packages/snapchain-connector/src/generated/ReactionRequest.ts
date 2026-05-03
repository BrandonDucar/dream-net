// Original file: C:/Users/brand/.antigravity/dream-net/packages/snapchain-connector/proto/definitions/request_response.proto

import type { ReactionType as _ReactionType, ReactionType__Output as _ReactionType__Output } from './ReactionType';
import type { CastId as _CastId, CastId__Output as _CastId__Output } from './CastId';
import type { Long } from '@grpc/proto-loader';

export interface ReactionRequest {
  'fid'?: (number | string | Long);
  'reactionType'?: (_ReactionType);
  'targetCastId'?: (_CastId | null);
  'targetUrl'?: (string);
  'target'?: "targetCastId"|"targetUrl";
}

export interface ReactionRequest__Output {
  'fid': (string);
  'reactionType': (_ReactionType__Output);
  'targetCastId'?: (_CastId__Output | null);
  'targetUrl'?: (string);
  'target'?: "targetCastId"|"targetUrl";
}
