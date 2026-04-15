import React, { useState } from "react";
import { X, Copy, QrCode } from "lucide-react";
import type { OrderCurrency, PaymentMethod } from "@dreamnet/orders";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CheckoutModal({ isOpen, onClose }: CheckoutModalProps) {
  const [formData, setFormData] = useState({
    itemName: "",
    quantity: 1,
    currency: "USD" as OrderCurrency,
    amount: 0,
    paymentMethod: "stripe" as PaymentMethod,
    customerEmail: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [paymentIntent, setPaymentIntent] = useState<any>(null);
  const [showQR, setShowQR] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
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
      } else if (formData.paymentMethod === "crypto") {
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
        } else {
          alert("Crypto checkout not available.");
        }
      } else {
        // Manual payment
        alert("We'll send you an invoice via email. Thank you!");
        onClose();
      }
    } catch (error) {
      console.error("Failed to process checkout:", error);
      alert("Failed to process checkout. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard!");
  };

  const generateQRCode = (text: string) => {
    // Simple QR code generation using a service
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(text)}`;
  };

  if (paymentIntent) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
        <div className="relative w-full max-w-md rounded-2xl border border-white/10 bg-black/90 p-6 shadow-2xl">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 rounded-full p-2 text-white/60 transition hover:bg-white/10 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>

          <h2 className="mb-4 text-2xl font-bold text-white">Crypto Payment</h2>

          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-sm text-white/60">Send to Address</label>
              <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 p-3">
                <code className="flex-1 text-xs text-white break-all">{paymentIntent.address}</code>
                <button
                  onClick={() => copyToClipboard(paymentIntent.address)}
                  className="rounded p-1 text-white/60 transition hover:bg-white/10 hover:text-white"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm text-white/60">Amount</label>
              <div className="rounded-lg border border-white/10 bg-white/5 p-3">
                <p className="text-lg font-semibold text-white">
                  {paymentIntent.amount} {paymentIntent.currency}
                </p>
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm text-white/60">Memo</label>
              <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 p-3">
                <code className="flex-1 text-xs text-white">{paymentIntent.memo}</code>
                <button
                  onClick={() => copyToClipboard(paymentIntent.memo)}
                  className="rounded p-1 text-white/60 transition hover:bg-white/10 hover:text-white"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>

            {showQR && (
              <div className="flex justify-center rounded-lg border border-white/10 bg-white p-4">
                <img
                  src={generateQRCode(`${paymentIntent.address}?amount=${paymentIntent.amount}`)}
                  alt="Payment QR Code"
                  className="w-48 h-48"
                />
              </div>
            )}

            <button
              onClick={() => setShowQR(!showQR)}
              className="w-full rounded-lg border border-dream-cyan bg-dream-cyan/20 px-4 py-2 text-dream-cyan transition hover:bg-dream-cyan/30"
            >
              <QrCode className="mr-2 inline w-4 h-4" />
              {showQR ? "Hide" : "Show"} QR Code
            </button>

            <button
              onClick={onClose}
              className="w-full rounded-lg bg-dream-cyan px-4 py-2 font-semibold text-black transition hover:bg-dream-cyan/90"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-md rounded-2xl border border-white/10 bg-black/90 p-6 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-2 text-white/60 transition hover:bg-white/10 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="mb-6 text-2xl font-bold text-white">Checkout</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-2 block text-sm text-white/80">Item Name *</label>
            <input
              type="text"
              required
              value={formData.itemName}
              onChange={(e) => setFormData({ ...formData, itemName: e.target.value })}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white placeholder-white/40 focus:border-dream-cyan focus:outline-none"
              placeholder="Product or service name"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-2 block text-sm text-white/80">Quantity *</label>
              <input
                type="number"
                required
                min="1"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 1 })}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white placeholder-white/40 focus:border-dream-cyan focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-white/80">Currency *</label>
              <select
                required
                value={formData.currency}
                onChange={(e) => setFormData({ ...formData, currency: e.target.value as OrderCurrency })}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white focus:border-dream-cyan focus:outline-none"
              >
                <option value="USD">USD</option>
                <option value="ETH">ETH</option>
                <option value="USDC">USDC</option>
              </select>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm text-white/80">Amount *</label>
            <input
              type="number"
              required
              min="0"
              step="0.01"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white placeholder-white/40 focus:border-dream-cyan focus:outline-none"
              placeholder="0.00"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-white/80">Payment Method *</label>
            <div className="space-y-2">
              {(["stripe", "crypto", "manual"] as PaymentMethod[]).map((method) => (
                <label key={method} className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 p-3 cursor-pointer hover:bg-white/10">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={method}
                    checked={formData.paymentMethod === method}
                    onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value as PaymentMethod })}
                    className="text-dream-cyan"
                  />
                  <span className="text-white capitalize">{method}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm text-white/80">Email (optional)</label>
            <input
              type="email"
              value={formData.customerEmail}
              onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white placeholder-white/40 focus:border-dream-cyan focus:outline-none"
              placeholder="your@email.com"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white transition hover:bg-white/10"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 rounded-lg bg-dream-cyan px-4 py-2 font-semibold text-black transition hover:bg-dream-cyan/90 disabled:opacity-50"
            >
              {isSubmitting ? "Processing..." : "Checkout"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

