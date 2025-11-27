/**
 * Protocol Types - Types for agent protocols
 * 
 * Defines standard protocol types for agent communication
 */

/**
 * Protocol Type - Type of protocol
 */
export type ProtocolType =
  | "http"
  | "websocket"
  | "grpc"
  | "mqtt"
  | "custom";

/**
 * Protocol Descriptor - Describes an agent protocol
 */
export interface ProtocolDescriptor {
  /** Protocol identifier */
  id: string;
  /** Protocol type */
  type: ProtocolType;
  /** Protocol name */
  name: string;
  /** Protocol version */
  version?: string;
  /** Protocol endpoint */
  endpoint?: string;
  /** Protocol configuration */
  config?: Record<string, unknown>;
  /** Protocol metadata */
  metadata?: Record<string, unknown>;
}

