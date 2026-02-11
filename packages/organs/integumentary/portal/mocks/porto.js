/**
 * MOCK: porto
 * 
 * This file exists to satisfy Webpack resolution for the 'porto' dependency
 * which is erroneously imported by some server-side libraries (likely @farcaster/hub-nodejs)
 * in the client bundle.
 * 
 * We export a dummy object to prevent "Module not found" errors.
 */

module.exports = {};
