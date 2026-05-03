// Original file: C:/Users/brand/.antigravity/dream-net/packages/snapchain-connector/proto/definitions/blocks.proto

import type { Message as _Message, Message__Output as _Message__Output } from './Message';

export interface MempoolMessage {
  'userMessage'?: (_Message | null);
  'mempoolMessage'?: "userMessage";
}

export interface MempoolMessage__Output {
  'userMessage'?: (_Message__Output | null);
  'mempoolMessage'?: "userMessage";
}
