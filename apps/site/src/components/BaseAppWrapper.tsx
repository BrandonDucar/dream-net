/**
 * Base App Wrapper Component
 * Detects Base App context and provides Base App-specific features
 */

import { useEffect, ReactNode } from "react";
import { isBaseApp, getBaseAppContext, trackBaseAppEvent } from "../lib/base-app";

interface BaseAppWrapperProps {
  children: ReactNode;
}

export function BaseAppWrapper({ children }: BaseAppWrapperProps) {
  useEffect(() => {
    if (isBaseApp()) {
      const context = getBaseAppContext();
      console.log("[Base App] Running in Base App context", context);
      
      // Track Base App visit
      trackBaseAppEvent("page_view", {
        path: window.location.pathname,
        fid: context.userFid,
        wallet: context.walletAddress,
      });

      // Auto-connect wallet if provided in context
      if (context.walletAddress) {
        // Wallet context will handle this
        console.log("[Base App] Wallet address from context:", context.walletAddress);
      }
    }
  }, []);

  // Add Base App-specific styling or features
  return <>{children}</>;
}

