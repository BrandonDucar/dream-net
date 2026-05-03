// Original file: C:/Users/brand/.antigravity/dream-net/packages/snapchain-connector/proto/definitions/blocks.proto

import type { Vote as _Vote, Vote__Output as _Vote__Output } from './Vote';
import type { Proposal as _Proposal, Proposal__Output as _Proposal__Output } from './Proposal';

export interface ConsensusMessage {
  'vote'?: (_Vote | null);
  'proposal'?: (_Proposal | null);
  'signature'?: (Buffer | Uint8Array | string);
  'consensusMessage'?: "vote"|"proposal";
}

export interface ConsensusMessage__Output {
  'vote'?: (_Vote__Output | null);
  'proposal'?: (_Proposal__Output | null);
  'signature': (Buffer);
  'consensusMessage'?: "vote"|"proposal";
}
