import React from "react";
import { XCircle } from "lucide-react";
import { Link } from "wouter";

export default function CheckoutCancel() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#06060a] via-[#0a0a12] to-[#06060a] text-white">
      <div className="text-center">
        <XCircle className="mx-auto mb-4 h-16 w-16 text-amber-400" />
        <h1 className="mb-2 text-3xl font-bold">Payment Cancelled</h1>
        <p className="mb-6 text-white/60">Your payment was cancelled. No charges were made.</p>
        <Link href="/">
          <a className="rounded-lg bg-dream-cyan px-6 py-2 font-semibold text-black transition hover:bg-dream-cyan/90">
            Return Home
          </a>
        </Link>
      </div>
    </div>
  );
}

