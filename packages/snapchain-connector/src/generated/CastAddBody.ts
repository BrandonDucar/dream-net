// Original file: C:/Users/brand/.antigravity/dream-net/packages/snapchain-connector/proto/definitions/message.proto

import type { CastId as _CastId, CastId__Output as _CastId__Output } from './CastId';
import type { Embed as _Embed, Embed__Output as _Embed__Output } from './Embed';
import type { CastType as _CastType, CastType__Output as _CastType__Output } from './CastType';
import type { Long } from '@grpc/proto-loader';

export interface CastAddBody {
  'embedsDeprecated'?: (string)[];
  'mentions'?: (number | string | Long)[];
  'parentCastId'?: (_CastId | null);
  'text'?: (string);
  'mentionsPositions'?: (number)[];
  'embeds'?: (_Embed)[];
  'parentUrl'?: (string);
  'type'?: (_CastType);
  'parent'?: "parentCastId"|"parentUrl";
}

export interface CastAddBody__Output {
  'embedsDeprecated': (string)[];
  'mentions': (string)[];
  'parentCastId'?: (_CastId__Output | null);
  'text': (string);
  'mentionsPositions': (number)[];
  'embeds': (_Embed__Output)[];
  'parentUrl'?: (string);
  'type': (_CastType__Output);
  'parent'?: "parentCastId"|"parentUrl";
}
