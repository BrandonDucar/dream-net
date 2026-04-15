/**
 * Wallet Input Validation
 * 
 * Validates wallet addresses and related inputs for critical routes
 */

/**
 * Validate wallet address format
 * Basic validation - checks for hex format and reasonable length
 */
export function validateWalletAddress(wallet: string): { valid: boolean; error?: string } {
  if (!wallet || typeof wallet !== 'string') {
    return { valid: false, error: 'Wallet address is required and must be a string' };
  }
  
  const trimmed = wallet.trim();
  
  if (trimmed.length === 0) {
    return { valid: false, error: 'Wallet address cannot be empty' };
  }
  
  // Basic format check: should be hex string, optionally prefixed with 0x
  const hexPattern = /^(0x)?[0-9a-fA-F]+$/;
  if (!hexPattern.test(trimmed)) {
    return { valid: false, error: 'Wallet address must be a valid hexadecimal string' };
  }
  
  // Length check: Ethereum addresses are 42 chars (0x + 40 hex), but allow some flexibility
  const hexPart = trimmed.startsWith('0x') ? trimmed.slice(2) : trimmed;
  if (hexPart.length < 20 || hexPart.length > 64) {
    return { valid: false, error: 'Wallet address length is invalid (expected 20-64 hex characters)' };
  }
  
  return { valid: true };
}

/**
 * Validate wallet scoring request body
 */
export function validateWalletScoreRequest(body: any): { valid: boolean; error?: string; wallet?: string } {
  if (!body || typeof body !== 'object') {
    return { valid: false, error: 'Request body must be an object' };
  }
  
  const { wallet } = body;
  const walletValidation = validateWalletAddress(wallet);
  
  if (!walletValidation.valid) {
    return { valid: false, error: walletValidation.error };
  }
  
  return { valid: true, wallet: wallet.trim() };
}

/**
 * Validate wallet scoring update request
 */
export function validateWalletScoreUpdateRequest(body: any): { 
  valid: boolean; 
  error?: string; 
  action?: string; 
  points?: number 
} {
  if (!body || typeof body !== 'object') {
    return { valid: false, error: 'Request body must be an object' };
  }
  
  const { action, points } = body;
  
  // Action is optional but if provided should be a string
  if (action !== undefined && typeof action !== 'string') {
    return { valid: false, error: 'Action must be a string if provided' };
  }
  
  // Points is optional but if provided should be a number
  if (points !== undefined) {
    if (typeof points !== 'number' || isNaN(points)) {
      return { valid: false, error: 'Points must be a number if provided' };
    }
    if (points < -100 || points > 100) {
      return { valid: false, error: 'Points must be between -100 and 100' };
    }
  }
  
  return { valid: true, action, points };
}

