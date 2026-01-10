"use client";

import { useState } from "react";
import { useMiniApp } from "@neynar/react";
import { signOath } from "~/app/actions";

/**
 * HomeTab component displays the main landing content for the mini app.
 */
export function HomeTab() {
  const { context } = useMiniApp();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  const handleSignOath = async () => {
    if (!context?.user) return;
    setLoading(true);
    setStatus("Signing...");

    try {
      const result = await signOath(context.user.fid.toString(), context.user.username || "Anonymous");
      if (result.success) {
        setStatus("✅ Oath Signed. Welcome to the Sprawl.");
      } else {
        setStatus("❌ Failed to sign oath. Try again.");
      }
    } catch (err) {
      console.error(err);
      setStatus("❌ Error connecting to the Sprawl.");
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-240px)] px-6 text-white bg-black">
      <div className="text-center w-full max-w-md mx-auto space-y-8">
        <div className="space-y-4">
          <h2 className="text-4xl font-black tracking-tighter uppercase italic">Snail's Oath</h2>
          <p className="text-gray-500 text-xs tracking-wide uppercase px-4">
            By signing, you commit to the technological homeostasis and the prosperity of the DreamNet sprawl.
          </p>
        </div>

        {context?.user ? (
          <div className="space-y-6">
            <div className="p-4 border border-white/10 rounded-2xl bg-white/5">
              <p className="text-xs text-gray-400">SIGNING AS</p>
              <p className="text-lg font-mono">@{context.user.username}</p>
            </div>

            <button
              onClick={handleSignOath}
              disabled={loading}
              className="w-full py-4 px-6 bg-white text-black font-black rounded-full hover:bg-gray-200 transition-all disabled:opacity-50 active:scale-95 transition-transform"
            >
              {loading ? "MODULATING..." : "SIGN THE OATH"}
            </button>

            {status && (
              <p className="text-sm font-bold tracking-tight animate-pulse">{status}</p>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="animate-pulse flex flex-col items-center">
              <div className="h-2 w-32 bg-yellow-500/20 rounded-full mb-2"></div>
              <p className="text-yellow-500 text-xs font-bold uppercase tracking-[0.3em]">Awaiting Link</p>
            </div>
          </div>
        )}

        <div className="pt-12">
          <div className="flex justify-center space-x-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-1 w-8 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-white/20 animate-progress" style={{ animationDelay: `${i * 0.5}s` }}></div>
              </div>
            ))}
          </div>
          <p className="text-[9px] text-gray-600 mt-4 uppercase tracking-[0.4em]">DreamNet Intelligence System</p>
        </div>
      </div>
    </div>
  );
} 