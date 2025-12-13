/**
 * Detect if app is running in Base App (Farcaster client) vs standalone browser
 */
export function isBaseApp(): boolean {
  if (typeof window === 'undefined') return false;
  
  // Check for Base App user agent or referrer
  const userAgent = window.navigator.userAgent.toLowerCase();
  const referrer = document.referrer.toLowerCase();
  
  return (
    userAgent.includes('base') ||
    referrer.includes('base.org') ||
    referrer.includes('baseapp') ||
    // Check for Base App injected objects
    typeof (window as any).base !== 'undefined' ||
    typeof (window as any).farcaster !== 'undefined'
  );
}

/**
 * Get environment context for hybrid app
 */
export function getEnvironment() {
  const isBase = isBaseApp();
  
  return {
    isBaseApp: isBase,
    isStandalone: !isBase,
    environment: isBase ? 'base-app' : 'browser',
  };
}

