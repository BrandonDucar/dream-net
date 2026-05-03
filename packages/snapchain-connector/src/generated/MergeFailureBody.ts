// Original file: C:/Users/brand/.antigravity/dream-net/packages/snapchain-connector/proto/definitions/hub_event.proto

import type { Message as _Message, Message__Output as _Message__Output } from './Message';

export interface MergeFailureBody {
  'message'?: (_Message | null);
  'code'?: (string);
  'reason'?: (string);
}

export interface MergeFailureBody__Output {
  'message': (_Message__Output | null);
  'code': (string);
  'reason': (string);
}
