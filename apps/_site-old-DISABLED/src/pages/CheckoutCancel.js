import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { XCircle } from "lucide-react";
import { Link } from "wouter";
export default function CheckoutCancel() {
    return (_jsx("div", { className: "flex min-h-screen items-center justify-center bg-gradient-to-br from-[#06060a] via-[#0a0a12] to-[#06060a] text-white", children: _jsxs("div", { className: "text-center", children: [_jsx(XCircle, { className: "mx-auto mb-4 h-16 w-16 text-amber-400" }), _jsx("h1", { className: "mb-2 text-3xl font-bold", children: "Payment Cancelled" }), _jsx("p", { className: "mb-6 text-white/60", children: "Your payment was cancelled. No charges were made." }), _jsx(Link, { href: "/", children: _jsx("a", { className: "rounded-lg bg-dream-cyan px-6 py-2 font-semibold text-black transition hover:bg-dream-cyan/90", children: "Return Home" }) })] }) }));
}
