/**
 * Base App Integration Utilities
 * Detects when running in Base App context and provides Base App-specific functionality
 */

export interface BaseAppContext {
  isBaseApp: boolean;
  userFid?: string;
  walletAddress?: string;
  referrer?: string;
}

/**
 * Detect if the app is running inside Base App
 */
export function isBaseApp(): boolean {
  if (typeof window === 'undefined') return false;
  
  // Check URL parameters
  const params = new URLSearchParams(window.location.search);
  if (params.get('baseApp') === 'true') return true;
  
  // Check referrer
  if (document.referrer.includes('base.org') || 
      document.referrer.includes('base.app')) {
    return true;
  }
  
  // Check user agent (Base App might have specific UA)
  if (navigator.userAgent.includes('BaseApp')) return true;
  
  return false;
}

/**
 * Get Base App context from URL parameters or referrer
 */
export function getBaseAppContext(): BaseAppContext {
  const params = new URLSearchParams(window.location.search);
  const isBase = isBaseApp();
  
  return {
    isBaseApp: isBase,
    userFid: params.get('fid') || undefined,
    walletAddress: params.get('wallet') || params.get('address') || undefined,
    referrer: document.referrer || undefined,
  };
}

/**
 * Get the appropriate app URL for Base App context
 * Base App may require specific URL format or parameters
 */
export function getBaseAppUrl(path: string): string {
  const base = window.location.origin;
  const context = getBaseAppContext();
  
  if (context.isBaseApp) {
    // Add Base App context to URL
    const url = new URL(path, base);
    url.searchParams.set('baseApp', 'true');
    if (context.userFid) url.searchParams.set('fid', context.userFid);
    if (context.walletAddress) url.searchParams.set('wallet', context.walletAddress);
    return url.toString();
  }
  
  return `${base}${path}`;
}

/**
 * Track Base App-specific analytics
 */
export function trackBaseAppEvent(event: string, data?: Record<string, unknown>) {
  if (!isBaseApp()) return;
  
  // Base App may have specific analytics requirements
  console.log('[Base App Event]', event, data);
  
  // You can integrate with Base's analytics here
  // For now, just log
}

