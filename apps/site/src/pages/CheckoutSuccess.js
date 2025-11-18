import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { CheckCircle } from "lucide-react";
import { Link } from "wouter";
export default function CheckoutSuccess() {
    return (_jsx("div", { className: "flex min-h-screen items-center justify-center bg-gradient-to-br from-[#06060a] via-[#0a0a12] to-[#06060a] text-white", children: _jsxs("div", { className: "text-center", children: [_jsx(CheckCircle, { className: "mx-auto mb-4 h-16 w-16 text-green-400" }), _jsx("h1", { className: "mb-2 text-3xl font-bold", children: "Payment Successful!" }), _jsx("p", { className: "mb-6 text-white/60", children: "Thank you for your order. We'll be in touch soon." }), _jsx(Link, { href: "/", children: _jsx("a", { className: "rounded-lg bg-dream-cyan px-6 py-2 font-semibold text-black transition hover:bg-dream-cyan/90", children: "Return Home" }) })] }) }));
}
