// Original file: C:/Users/brand/.antigravity/dream-net/packages/snapchain-connector/proto/definitions/hub_event.proto

import type { Message as _Message, Message__Output as _Message__Output } from './Message';

export interface MergeMessageBody {
  'message'?: (_Message | null);
  'deletedMessages'?: (_Message)[];
}

export interface MergeMessageBody__Output {
  'message': (_Message__Output | null);
  'deletedMessages': (_Message__Output)[];
}
