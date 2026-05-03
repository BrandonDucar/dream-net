// Original file: C:/Users/brand/.antigravity/dream-net/packages/snapchain-connector/proto/definitions/replication.proto

import type * as grpc from '@grpc/grpc-js'
import type { MethodDefinition } from '@grpc/proto-loader'
import type { GetShardSnapshotMetadataRequest as _GetShardSnapshotMetadataRequest, GetShardSnapshotMetadataRequest__Output as _GetShardSnapshotMetadataRequest__Output } from './GetShardSnapshotMetadataRequest';
import type { GetShardSnapshotMetadataResponse as _GetShardSnapshotMetadataResponse, GetShardSnapshotMetadataResponse__Output as _GetShardSnapshotMetadataResponse__Output } from './GetShardSnapshotMetadataResponse';
import type { GetShardTransactionsRequest as _GetShardTransactionsRequest, GetShardTransactionsRequest__Output as _GetShardTransactionsRequest__Output } from './GetShardTransactionsRequest';
import type { GetShardTransactionsResponse as _GetShardTransactionsResponse, GetShardTransactionsResponse__Output as _GetShardTransactionsResponse__Output } from './GetShardTransactionsResponse';

export interface ReplicationServiceClient extends grpc.Client {
  GetShardSnapshotMetadata(argument: _GetShardSnapshotMetadataRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_GetShardSnapshotMetadataResponse__Output>): grpc.ClientUnaryCall;
  GetShardSnapshotMetadata(argument: _GetShardSnapshotMetadataRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_GetShardSnapshotMetadataResponse__Output>): grpc.ClientUnaryCall;
  GetShardSnapshotMetadata(argument: _GetShardSnapshotMetadataRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_GetShardSnapshotMetadataResponse__Output>): grpc.ClientUnaryCall;
  GetShardSnapshotMetadata(argument: _GetShardSnapshotMetadataRequest, callback: grpc.requestCallback<_GetShardSnapshotMetadataResponse__Output>): grpc.ClientUnaryCall;
  getShardSnapshotMetadata(argument: _GetShardSnapshotMetadataRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_GetShardSnapshotMetadataResponse__Output>): grpc.ClientUnaryCall;
  getShardSnapshotMetadata(argument: _GetShardSnapshotMetadataRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_GetShardSnapshotMetadataResponse__Output>): grpc.ClientUnaryCall;
  getShardSnapshotMetadata(argument: _GetShardSnapshotMetadataRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_GetShardSnapshotMetadataResponse__Output>): grpc.ClientUnaryCall;
  getShardSnapshotMetadata(argument: _GetShardSnapshotMetadataRequest, callback: grpc.requestCallback<_GetShardSnapshotMetadataResponse__Output>): grpc.ClientUnaryCall;
  
  GetShardTransactions(argument: _GetShardTransactionsRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_GetShardTransactionsResponse__Output>): grpc.ClientUnaryCall;
  GetShardTransactions(argument: _GetShardTransactionsRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_GetShardTransactionsResponse__Output>): grpc.ClientUnaryCall;
  GetShardTransactions(argument: _GetShardTransactionsRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_GetShardTransactionsResponse__Output>): grpc.ClientUnaryCall;
  GetShardTransactions(argument: _GetShardTransactionsRequest, callback: grpc.requestCallback<_GetShardTransactionsResponse__Output>): grpc.ClientUnaryCall;
  getShardTransactions(argument: _GetShardTransactionsRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_GetShardTransactionsResponse__Output>): grpc.ClientUnaryCall;
  getShardTransactions(argument: _GetShardTransactionsRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_GetShardTransactionsResponse__Output>): grpc.ClientUnaryCall;
  getShardTransactions(argument: _GetShardTransactionsRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_GetShardTransactionsResponse__Output>): grpc.ClientUnaryCall;
  getShardTransactions(argument: _GetShardTransactionsRequest, callback: grpc.requestCallback<_GetShardTransactionsResponse__Output>): grpc.ClientUnaryCall;
  
}

export interface ReplicationServiceHandlers extends grpc.UntypedServiceImplementation {
  GetShardSnapshotMetadata: grpc.handleUnaryCall<_GetShardSnapshotMetadataRequest__Output, _GetShardSnapshotMetadataResponse>;
  
  GetShardTransactions: grpc.handleUnaryCall<_GetShardTransactionsRequest__Output, _GetShardTransactionsResponse>;
  
}

export interface ReplicationServiceDefinition extends grpc.ServiceDefinition {
  GetShardSnapshotMetadata: MethodDefinition<_GetShardSnapshotMetadataRequest, _GetShardSnapshotMetadataResponse, _GetShardSnapshotMetadataRequest__Output, _GetShardSnapshotMetadataResponse__Output>
  GetShardTransactions: MethodDefinition<_GetShardTransactionsRequest, _GetShardTransactionsResponse, _GetShardTransactionsRequest__Output, _GetShardTransactionsResponse__Output>
}
