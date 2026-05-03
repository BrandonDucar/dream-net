// Original file: C:/Users/brand/.antigravity/dream-net/packages/snapchain-connector/proto/definitions/onchain_event.proto

import type { OnChainEventType as _OnChainEventType, OnChainEventType__Output as _OnChainEventType__Output } from './OnChainEventType';
import type { SignerEventBody as _SignerEventBody, SignerEventBody__Output as _SignerEventBody__Output } from './SignerEventBody';
import type { SignerMigratedEventBody as _SignerMigratedEventBody, SignerMigratedEventBody__Output as _SignerMigratedEventBody__Output } from './SignerMigratedEventBody';
import type { IdRegisterEventBody as _IdRegisterEventBody, IdRegisterEventBody__Output as _IdRegisterEventBody__Output } from './IdRegisterEventBody';
import type { StorageRentEventBody as _StorageRentEventBody, StorageRentEventBody__Output as _StorageRentEventBody__Output } from './StorageRentEventBody';
import type { TierPurchaseBody as _TierPurchaseBody, TierPurchaseBody__Output as _TierPurchaseBody__Output } from './TierPurchaseBody';
import type { Long } from '@grpc/proto-loader';

export interface OnChainEvent {
  'type'?: (_OnChainEventType);
  'chainId'?: (number);
  'blockNumber'?: (number);
  'blockHash'?: (Buffer | Uint8Array | string);
  'blockTimestamp'?: (number | string | Long);
  'transactionHash'?: (Buffer | Uint8Array | string);
  'logIndex'?: (number);
  'fid'?: (number | string | Long);
  'signerEventBody'?: (_SignerEventBody | null);
  'signerMigratedEventBody'?: (_SignerMigratedEventBody | null);
  'idRegisterEventBody'?: (_IdRegisterEventBody | null);
  'storageRentEventBody'?: (_StorageRentEventBody | null);
  'txIndex'?: (number);
  'version'?: (number);
  'tierPurchaseEventBody'?: (_TierPurchaseBody | null);
  'body'?: "signerEventBody"|"signerMigratedEventBody"|"idRegisterEventBody"|"storageRentEventBody"|"tierPurchaseEventBody";
}

export interface OnChainEvent__Output {
  'type': (_OnChainEventType__Output);
  'chainId': (number);
  'blockNumber': (number);
  'blockHash': (Buffer);
  'blockTimestamp': (string);
  'transactionHash': (Buffer);
  'logIndex': (number);
  'fid': (string);
  'signerEventBody'?: (_SignerEventBody__Output | null);
  'signerMigratedEventBody'?: (_SignerMigratedEventBody__Output | null);
  'idRegisterEventBody'?: (_IdRegisterEventBody__Output | null);
  'storageRentEventBody'?: (_StorageRentEventBody__Output | null);
  'txIndex': (number);
  'version': (number);
  'tierPurchaseEventBody'?: (_TierPurchaseBody__Output | null);
  'body'?: "signerEventBody"|"signerMigratedEventBody"|"idRegisterEventBody"|"storageRentEventBody"|"tierPurchaseEventBody";
}
