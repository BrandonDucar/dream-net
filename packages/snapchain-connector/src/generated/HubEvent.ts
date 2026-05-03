// Original file: C:/Users/brand/.antigravity/dream-net/packages/snapchain-connector/proto/definitions/hub_event.proto

import type { HubEventType as _HubEventType, HubEventType__Output as _HubEventType__Output } from './HubEventType';
import type { MergeMessageBody as _MergeMessageBody, MergeMessageBody__Output as _MergeMessageBody__Output } from './MergeMessageBody';
import type { PruneMessageBody as _PruneMessageBody, PruneMessageBody__Output as _PruneMessageBody__Output } from './PruneMessageBody';
import type { RevokeMessageBody as _RevokeMessageBody, RevokeMessageBody__Output as _RevokeMessageBody__Output } from './RevokeMessageBody';
import type { MergeUserNameProofBody as _MergeUserNameProofBody, MergeUserNameProofBody__Output as _MergeUserNameProofBody__Output } from './MergeUserNameProofBody';
import type { MergeOnChainEventBody as _MergeOnChainEventBody, MergeOnChainEventBody__Output as _MergeOnChainEventBody__Output } from './MergeOnChainEventBody';
import type { MergeFailureBody as _MergeFailureBody, MergeFailureBody__Output as _MergeFailureBody__Output } from './MergeFailureBody';
import type { BlockConfirmedBody as _BlockConfirmedBody, BlockConfirmedBody__Output as _BlockConfirmedBody__Output } from './BlockConfirmedBody';
import type { Long } from '@grpc/proto-loader';

export interface HubEvent {
  'type'?: (_HubEventType);
  'id'?: (number | string | Long);
  'mergeMessageBody'?: (_MergeMessageBody | null);
  'pruneMessageBody'?: (_PruneMessageBody | null);
  'revokeMessageBody'?: (_RevokeMessageBody | null);
  'mergeUsernameProofBody'?: (_MergeUserNameProofBody | null);
  'mergeOnChainEventBody'?: (_MergeOnChainEventBody | null);
  'blockNumber'?: (number | string | Long);
  'mergeFailure'?: (_MergeFailureBody | null);
  'shardIndex'?: (number);
  'timestamp'?: (number | string | Long);
  'blockConfirmedBody'?: (_BlockConfirmedBody | null);
  'body'?: "mergeMessageBody"|"pruneMessageBody"|"revokeMessageBody"|"mergeUsernameProofBody"|"mergeOnChainEventBody"|"mergeFailure"|"blockConfirmedBody";
}

export interface HubEvent__Output {
  'type': (_HubEventType__Output);
  'id': (string);
  'mergeMessageBody'?: (_MergeMessageBody__Output | null);
  'pruneMessageBody'?: (_PruneMessageBody__Output | null);
  'revokeMessageBody'?: (_RevokeMessageBody__Output | null);
  'mergeUsernameProofBody'?: (_MergeUserNameProofBody__Output | null);
  'mergeOnChainEventBody'?: (_MergeOnChainEventBody__Output | null);
  'blockNumber': (string);
  'mergeFailure'?: (_MergeFailureBody__Output | null);
  'shardIndex': (number);
  'timestamp': (string);
  'blockConfirmedBody'?: (_BlockConfirmedBody__Output | null);
  'body'?: "mergeMessageBody"|"pruneMessageBody"|"revokeMessageBody"|"mergeUsernameProofBody"|"mergeOnChainEventBody"|"mergeFailure"|"blockConfirmedBody";
}
