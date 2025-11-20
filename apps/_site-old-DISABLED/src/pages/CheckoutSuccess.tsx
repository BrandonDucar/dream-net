import React from "react";
import { CheckCircle } from "lucide-react";
import { Link } from "wouter";

export default function CheckoutSuccess() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#06060a] via-[#0a0a12] to-[#06060a] text-white">
      <div className="text-center">
        <CheckCircle className="mx-auto mb-4 h-16 w-16 text-green-400" />
        <h1 className="mb-2 text-3xl font-bold">Payment Successful!</h1>
        <p className="mb-6 text-white/60">Thank you for your order. We'll be in touch soon.</p>
        <Link href="/">
          <a className="rounded-lg bg-dream-cyan px-6 py-2 font-semibold text-black transition hover:bg-dream-cyan/90">
            Return Home
          </a>
        </Link>
      </div>
    </div>
  );
}

