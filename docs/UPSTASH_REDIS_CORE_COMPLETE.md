# Upstash Redis Core - Complete Documentation

**Package**: `@dreamnet/upstash-redis-core`  
**Status**: ✅ Implemented  
**Last Updated**: 2025-01-27

---

## Overview

Upstash Redis Core provides **serverless Redis integration** for caching and rate limiting using Upstash's serverless Redis platform.

### Key Features

- **Key-Value Storage**: Get, set, delete operations
- **Expiration**: Set key expiration times
- **Counters**: Increment/decrement operations
- **Existence Checks**: Check if keys exist
- **Serverless**: No infrastructure management required

---

## API Reference

### Classes

#### `UpstashRedisClient`

**Methods**:
- **`get(key): Promise<string | null>`**
- **`set(key, value, options?): Promise<void>`**
- **`del(key): Promise<void>`**
- **`exists(key): Promise<boolean>`**
- **`expire(key, seconds): Promise<void>`**
- **`incr(key): Promise<number>`**
- **`decr(key): Promise<number>`**

### Functions

- **`createUpstashRedisClient(): UpstashRedisClient | null`**
- **`getUpstashRedisClient(): UpstashRedisClient | null`**

**Environment Variables**: `UPSTASH_REDIS_URL`, `UPSTASH_REDIS_TOKEN`

---

**Status**: ✅ Implemented

