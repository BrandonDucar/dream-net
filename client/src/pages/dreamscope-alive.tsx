import React from "react";
import { CompactMetricsOverlay } from "@/components/CompactMetricsOverlay";

export default function DreamScopeAlive() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#06060a] via-[#0a0a12] to-[#06060a] text-white relative">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-dream-cyan to-dream-magenta bg-clip-text text-transparent">
            DreamScope Alive
          </h1>
          <p className="text-white/60 text-lg">System Status Monitor</p>
        </div>
      </div>
      <CompactMetricsOverlay />
    </div>
  );
}

