# Sentry Core - Complete Documentation

**Package**: `@dreamnet/sentry-core`  
**Status**: ✅ Implemented  
**Last Updated**: 2025-01-27

---

## Overview

Sentry Core provides **error tracking and monitoring** integration with Sentry SDK. It enables exception capture, message logging, and performance monitoring.

### Key Features

- **Exception Tracking**: Capture and track exceptions
- **Message Logging**: Log messages with severity levels
- **Performance Monitoring**: Trace HTTP requests and Express routes
- **Environment Support**: Support for multiple environments
- **Release Tracking**: Track releases and deployments

---

## API Reference

### Functions

- **`initSentry(config): void`**: Initialize Sentry SDK
- **`captureException(error, context?): void`**: Capture exception
- **`captureMessage(message, level?): void`**: Capture message
- **`createSentryIntegration(): void`**: Create integration from env vars

**Environment Variables**: `SENTRY_DSN`, `SENTRY_RELEASE`, `SENTRY_TRACES_SAMPLE_RATE`

---

**Status**: ✅ Implemented

