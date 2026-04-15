import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { X, Copy, QrCode } from "lucide-react";
export function CheckoutModal({ isOpen, onClose }) {
    const [formData, setFormData] = useState({
        itemName: "",
        quantity: 1,
        currency: "USD",
        amount: 0,
        paymentMethod: "stripe",
        customerEmail: "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [orderId, setOrderId] = useState(null);
    const [paymentIntent, setPaymentIntent] = useState(null);
    const [showQR, setShowQR] = useState(false);
    if (!isOpen)
        return null;
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            // Create order
            const orderRes = await fetch("/api/public/order", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
            if (!orderRes.ok) {
                throw new Error("Failed to create order");
            }
            const { order } = await orderRes.json();
            setOrderId(order.id);
            // Handle payment method
            if (formData.paymentMethod === "stripe") {
                const checkoutRes = await fetch("/api/public/checkout/stripe", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        orderId: order.id,
                        successUrl: `${window.location.origin}/checkout/success`,
                        cancelUrl: `${window.location.origin}/checkout/cancel`,
                    }),
                });
                if (checkoutRes.ok) {
                    const { checkoutUrl } = await checkoutRes.json();
                    if (checkoutUrl) {
                        window.location.href = checkoutUrl;
                        return;
                    }
                }
                alert("Stripe checkout not available. Please use another payment method.");
            }
            else if (formData.paymentMethod === "crypto") {
                const cryptoRes = await fetch("/api/public/checkout/crypto", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        orderId: order.id,
                        network: formData.currency === "USDC" ? "base" : "eth",
                    }),
                });
                if (cryptoRes.ok) {
                    const { paymentIntent } = await cryptoRes.json();
                    setPaymentIntent(paymentIntent);
                }
                else {
                    alert("Crypto checkout not available.");
                }
            }
            else {
                // Manual payment
                alert("We'll send you an invoice via email. Thank you!");
                onClose();
            }
        }
        catch (error) {
            console.error("Failed to process checkout:", error);
            alert("Failed to process checkout. Please try again.");
        }
        finally {
            setIsSubmitting(false);
        }
    };
    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        alert("Copied to clipboard!");
    };
    const generateQRCode = (text) => {
        // Simple QR code generation using a service
        return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(text)}`;
    };
    if (paymentIntent) {
        return (_jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm", children: _jsxs("div", { className: "relative w-full max-w-md rounded-2xl border border-white/10 bg-black/90 p-6 shadow-2xl", children: [_jsx("button", { onClick: onClose, className: "absolute right-4 top-4 rounded-full p-2 text-white/60 transition hover:bg-white/10 hover:text-white", children: _jsx(X, { className: "w-5 h-5" }) }), _jsx("h2", { className: "mb-4 text-2xl font-bold text-white", children: "Crypto Payment" }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "mb-1 block text-sm text-white/60", children: "Send to Address" }), _jsxs("div", { className: "flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 p-3", children: [_jsx("code", { className: "flex-1 text-xs text-white break-all", children: paymentIntent.address }), _jsx("button", { onClick: () => copyToClipboard(paymentIntent.address), className: "rounded p-1 text-white/60 transition hover:bg-white/10 hover:text-white", children: _jsx(Copy, { className: "w-4 h-4" }) })] })] }), _jsxs("div", { children: [_jsx("label", { className: "mb-1 block text-sm text-white/60", children: "Amount" }), _jsx("div", { className: "rounded-lg border border-white/10 bg-white/5 p-3", children: _jsxs("p", { className: "text-lg font-semibold text-white", children: [paymentIntent.amount, " ", paymentIntent.currency] }) })] }), _jsxs("div", { children: [_jsx("label", { className: "mb-1 block text-sm text-white/60", children: "Memo" }), _jsxs("div", { className: "flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 p-3", children: [_jsx("code", { className: "flex-1 text-xs text-white", children: paymentIntent.memo }), _jsx("button", { onClick: () => copyToClipboard(paymentIntent.memo), className: "rounded p-1 text-white/60 transition hover:bg-white/10 hover:text-white", children: _jsx(Copy, { className: "w-4 h-4" }) })] })] }), showQR && (_jsx("div", { className: "flex justify-center rounded-lg border border-white/10 bg-white p-4", children: _jsx("img", { src: generateQRCode(`${paymentIntent.address}?amount=${paymentIntent.amount}`), alt: "Payment QR Code", className: "w-48 h-48" }) })), _jsxs("button", { onClick: () => setShowQR(!showQR), className: "w-full rounded-lg border border-dream-cyan bg-dream-cyan/20 px-4 py-2 text-dream-cyan transition hover:bg-dream-cyan/30", children: [_jsx(QrCode, { className: "mr-2 inline w-4 h-4" }), showQR ? "Hide" : "Show", " QR Code"] }), _jsx("button", { onClick: onClose, className: "w-full rounded-lg bg-dream-cyan px-4 py-2 font-semibold text-black transition hover:bg-dream-cyan/90", children: "Done" })] })] }) }));
    }
    return (_jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm", children: _jsxs("div", { className: "relative w-full max-w-md rounded-2xl border border-white/10 bg-black/90 p-6 shadow-2xl", children: [_jsx("button", { onClick: onClose, className: "absolute right-4 top-4 rounded-full p-2 text-white/60 transition hover:bg-white/10 hover:text-white", children: _jsx(X, { className: "w-5 h-5" }) }), _jsx("h2", { className: "mb-6 text-2xl font-bold text-white", children: "Checkout" }), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "mb-2 block text-sm text-white/80", children: "Item Name *" }), _jsx("input", { type: "text", required: true, value: formData.itemName, onChange: (e) => setFormData({ ...formData, itemName: e.target.value }), className: "w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white placeholder-white/40 focus:border-dream-cyan focus:outline-none", placeholder: "Product or service name" })] }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "mb-2 block text-sm text-white/80", children: "Quantity *" }), _jsx("input", { type: "number", required: true, min: "1", value: formData.quantity, onChange: (e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 1 }), className: "w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white placeholder-white/40 focus:border-dream-cyan focus:outline-none" })] }), _jsxs("div", { children: [_jsx("label", { className: "mb-2 block text-sm text-white/80", children: "Currency *" }), _jsxs("select", { required: true, value: formData.currency, onChange: (e) => setFormData({ ...formData, currency: e.target.value }), className: "w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white focus:border-dream-cyan focus:outline-none", children: [_jsx("option", { value: "USD", children: "USD" }), _jsx("option", { value: "ETH", children: "ETH" }), _jsx("option", { value: "USDC", children: "USDC" })] })] })] }), _jsxs("div", { children: [_jsx("label", { className: "mb-2 block text-sm text-white/80", children: "Amount *" }), _jsx("input", { type: "number", required: true, min: "0", step: "0.01", value: formData.amount, onChange: (e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 }), className: "w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white placeholder-white/40 focus:border-dream-cyan focus:outline-none", placeholder: "0.00" })] }), _jsxs("div", { children: [_jsx("label", { className: "mb-2 block text-sm text-white/80", children: "Payment Method *" }), _jsx("div", { className: "space-y-2", children: ["stripe", "crypto", "manual"].map((method) => (_jsxs("label", { className: "flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 p-3 cursor-pointer hover:bg-white/10", children: [_jsx("input", { type: "radio", name: "paymentMethod", value: method, checked: formData.paymentMethod === method, onChange: (e) => setFormData({ ...formData, paymentMethod: e.target.value }), className: "text-dream-cyan" }), _jsx("span", { className: "text-white capitalize", children: method })] }, method))) })] }), _jsxs("div", { children: [_jsx("label", { className: "mb-2 block text-sm text-white/80", children: "Email (optional)" }), _jsx("input", { type: "email", value: formData.customerEmail, onChange: (e) => setFormData({ ...formData, customerEmail: e.target.value }), className: "w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white placeholder-white/40 focus:border-dream-cyan focus:outline-none", placeholder: "your@email.com" })] }), _jsxs("div", { className: "flex gap-3 pt-4", children: [_jsx("button", { type: "button", onClick: onClose, className: "flex-1 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white transition hover:bg-white/10", children: "Cancel" }), _jsx("button", { type: "submit", disabled: isSubmitting, className: "flex-1 rounded-lg bg-dream-cyan px-4 py-2 font-semibold text-black transition hover:bg-dream-cyan/90 disabled:opacity-50", children: isSubmitting ? "Processing..." : "Checkout" })] })] })] }) }));
}
