# API Validation Core - Complete Documentation

**Generated**: 2025-01-27  
**Status**: Complete System Documentation

---

## Overview

API Validation Core provides **request validation** for DreamNet APIs using Zod schemas. It includes middleware for validating request bodies, query parameters, and route parameters, with comprehensive error handling and common schema definitions.

---

## Key Features

### Request Validation
- Body validation
- Query parameter validation
- Route parameter validation
- Zod schema integration

### Error Handling
- Detailed validation errors
- Field-level error messages
- Error code tracking
- Standardized error responses

### Common Schemas
- Predefined schemas
- Reusable validators
- Common patterns
- Type-safe validation

---

## Architecture

### Components

1. **Request Validator** (`validateRequest.ts`)
   - Validation middleware
   - Error handling
   - Schema validation
   - Common schemas

---

## API Reference

### Validation Middleware

#### `validateBody<T>(schema: T): Middleware`
Validates request body against Zod schema.

**Example**:
```typescript
import { validateBody } from '@dreamnet/api-validation-core';
import { z } from 'zod';

const createDreamSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
});

router.post('/dreams', validateBody(createDreamSchema), async (req, res) => {
  // req.body is now validated and typed
  const { name, description } = req.body;
});
```

#### `validateQuery<T>(schema: T): Middleware`
Validates query parameters against Zod schema.

**Example**:
```typescript
import { validateQuery } from '@dreamnet/api-validation-core';
import { z } from 'zod';

const paginationSchema = z.object({
  page: z.string().regex(/^\d+$/).transform(Number).default('1'),
  limit: z.string().regex(/^\d+$/).transform(Number).default('10'),
});

router.get('/dreams', validateQuery(paginationSchema), async (req, res) => {
  // req.query is now validated and typed
  const { page, limit } = req.query;
});
```

#### `validateParams<T>(schema: T): Middleware`
Validates route parameters against Zod schema.

**Example**:
```typescript
import { validateParams } from '@dreamnet/api-validation-core';
import { z } from 'zod';

const idSchema = z.object({
  id: z.string().uuid(),
});

router.get('/dreams/:id', validateParams(idSchema), async (req, res) => {
  // req.params is now validated and typed
  const { id } = req.params;
});
```

### Common Schemas

#### `commonSchemas`
Predefined common schemas.

**Example**:
```typescript
import { commonSchemas } from '@dreamnet/api-validation-core';

router.post('/dreams', validateBody(commonSchemas.createDream), async (req, res) => {
  // Use common schema
});
```

---

## Data Models

### ValidationError

```typescript
interface ValidationError {
  field: string;
  message: string;
  code: string;
}
```

### Error Response

```typescript
{
  success: false;
  error: "VALIDATION_ERROR";
  message: string;
  errors: ValidationError[];
}
```

---

## Validation Flow

### Request Flow
1. Request received
2. Schema validation
3. Error handling (if invalid)
4. Continue to handler (if valid)
5. Replace request data with validated data

### Error Handling
- Parse Zod errors
- Map to ValidationError format
- Return 400 status
- Include detailed errors

---

## Common Schemas

### Predefined Schemas
- UUID validation
- Email validation
- Pagination schemas
- Date schemas
- Common patterns

---

## Integration Points

### DreamNet Systems
- **Server**: Express middleware
- **API Routes**: Route validation
- **DreamNet Audit Core**: Validation audit
- **DreamNet Alerts Core**: Validation alerts

---

## Usage Examples

### Validate Body

```typescript
const schema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
});

router.post('/users', validateBody(schema), handler);
```

### Validate Query

```typescript
const schema = z.object({
  page: z.string().transform(Number),
  limit: z.string().transform(Number),
});

router.get('/users', validateQuery(schema), handler);
```

### Validate Params

```typescript
const schema = z.object({
  id: z.string().uuid(),
});

router.get('/users/:id', validateParams(schema), handler);
```

---

## Best Practices

1. **Validation**
   - Use Zod schemas
   - Validate all inputs
   - Provide clear errors
   - Use common schemas

2. **Error Handling**
   - Return detailed errors
   - Include field names
   - Use error codes
   - Standardize responses

---

## Security Considerations

1. **Input Security**
   - Validate all inputs
   - Sanitize data
   - Prevent injection
   - Limit input size

2. **Error Security**
   - Don't expose internals
   - Sanitize error messages
   - Control error details
   - Monitor validation failures

---

**Status**: ✅ Complete Documentation  
**Last Updated**: 2025-01-27

