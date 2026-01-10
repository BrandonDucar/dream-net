/**
 * Common Input Validation Utilities
 * 
 * Shared validation functions for API routes
 */

/**
 * Validate pagination parameters
 */
export function validatePagination(query: any): {
  valid: boolean;
  error?: string;
  page?: number;
  limit?: number;
} {
  const page = query.page !== undefined ? Number(query.page) : 1;
  const limit = query.limit !== undefined ? Number(query.limit) : 20;
  
  if (isNaN(page) || page < 1) {
    return { valid: false, error: 'Page must be a positive integer' };
  }
  
  if (isNaN(limit) || limit < 1 || limit > 100) {
    return { valid: false, error: 'Limit must be between 1 and 100' };
  }
  
  return { valid: true, page, limit };
}

/**
 * Validate string input with length constraints
 */
export function validateString(
  value: any,
  options: {
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    fieldName?: string;
  } = {}
): { valid: boolean; error?: string; value?: string } {
  const { required = false, minLength, maxLength, fieldName = 'Field' } = options;
  
  if (value === undefined || value === null) {
    if (required) {
      return { valid: false, error: `${fieldName} is required` };
    }
    return { valid: true };
  }
  
  if (typeof value !== 'string') {
    return { valid: false, error: `${fieldName} must be a string` };
  }
  
  const trimmed = value.trim();
  
  if (required && trimmed.length === 0) {
    return { valid: false, error: `${fieldName} cannot be empty` };
  }
  
  if (minLength !== undefined && trimmed.length < minLength) {
    return { valid: false, error: `${fieldName} must be at least ${minLength} characters` };
  }
  
  if (maxLength !== undefined && trimmed.length > maxLength) {
    return { valid: false, error: `${fieldName} must be at most ${maxLength} characters` };
  }
  
  return { valid: true, value: trimmed };
}

/**
 * Create validation middleware for Express routes
 */
export function createValidationMiddleware(
  validator: (req: any) => { valid: boolean; error?: string; [key: string]: any }
) {
  return (req: any, res: any, next: any) => {
    const result = validator(req);
    
    if (!result.valid) {
      const traceId = req.traceId || 'unknown';
      console.warn(`[Validation] ❌ Invalid request (traceId: ${traceId}):`, result.error);
      
      return res.status(400).json({
        ok: false,
        error: 'validation_error',
        message: result.error || 'Invalid request',
        traceId
      });
    }
    
    // Attach validated data to request if provided
    Object.keys(result).forEach(key => {
      if (key !== 'valid' && key !== 'error') {
        req.validated = req.validated || {};
        req.validated[key] = result[key];
      }
    });
    
    next();
  };
}

