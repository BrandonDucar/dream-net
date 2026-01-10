"use strict";
/**
 * Wallet Input Validation
 *
 * Validates wallet addresses and related inputs for critical routes
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateWalletAddress = validateWalletAddress;
exports.validateWalletScoreRequest = validateWalletScoreRequest;
exports.validateWalletScoreUpdateRequest = validateWalletScoreUpdateRequest;
/**
 * Validate wallet address format
 * Basic validation - checks for hex format and reasonable length
 */
function validateWalletAddress(wallet) {
    if (!wallet || typeof wallet !== 'string') {
        return { valid: false, error: 'Wallet address is required and must be a string' };
    }
    var trimmed = wallet.trim();
    if (trimmed.length === 0) {
        return { valid: false, error: 'Wallet address cannot be empty' };
    }
    // Basic format check: should be hex string, optionally prefixed with 0x
    var hexPattern = /^(0x)?[0-9a-fA-F]+$/;
    if (!hexPattern.test(trimmed)) {
        return { valid: false, error: 'Wallet address must be a valid hexadecimal string' };
    }
    // Length check: Ethereum addresses are 42 chars (0x + 40 hex), but allow some flexibility
    var hexPart = trimmed.startsWith('0x') ? trimmed.slice(2) : trimmed;
    if (hexPart.length < 20 || hexPart.length > 64) {
        return { valid: false, error: 'Wallet address length is invalid (expected 20-64 hex characters)' };
    }
    return { valid: true };
}
/**
 * Validate wallet scoring request body
 */
function validateWalletScoreRequest(body) {
    if (!body || typeof body !== 'object') {
        return { valid: false, error: 'Request body must be an object' };
    }
    var wallet = body.wallet;
    var walletValidation = validateWalletAddress(wallet);
    if (!walletValidation.valid) {
        return { valid: false, error: walletValidation.error };
    }
    return { valid: true, wallet: wallet.trim() };
}
/**
 * Validate wallet scoring update request
 */
function validateWalletScoreUpdateRequest(body) {
    if (!body || typeof body !== 'object') {
        return { valid: false, error: 'Request body must be an object' };
    }
    var action = body.action, points = body.points;
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
    return { valid: true, action: action, points: points };
}
