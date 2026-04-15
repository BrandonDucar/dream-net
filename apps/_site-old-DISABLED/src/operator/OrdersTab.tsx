import React, { useState, useEffect, useCallback } from "react";
import { Copy, X } from "lucide-react";

const API_BASE = import.meta.env.VITE_API_URL ?? "";
const OPERATOR_TOKEN = import.meta.env.VITE_OPERATOR_TOKEN ?? "";

interface Order {
  id: string;
  createdAt: string;
  updatedAt: string;
  itemName: string;
  sku?: string;
  quantity: number;
  currency: string;
  amount: number;
  paymentMethod: string;
  paymentStatus: string;
  txId?: string;
  stripeSessionId?: string;
  customerEmail?: string;
  notes?: string;
  status: string;
}

export function OrdersTab() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [filters, setFilters] = useState({
    status: "",
    paymentStatus: "",
    currency: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const fetchOrders = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.status) params.append("status", filters.status);
      if (filters.paymentStatus) params.append("paymentStatus", filters.paymentStatus);
      if (filters.currency) params.append("currency", filters.currency);

      const response = await fetch(`${API_BASE}/api/admin/orders?${params}`, {
        headers: {
          Authorization: `Bearer ${OPERATOR_TOKEN}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setOrders(data.orders ?? []);
      }
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 30000); // Refresh every 30s
    return () => clearInterval(interval);
  }, [fetchOrders]);

  const updateOrder = async (id: string, patch: Partial<Order>) => {
    try {
      const response = await fetch(`${API_BASE}/api/admin/orders/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${OPERATOR_TOKEN}`,
        },
        body: JSON.stringify(patch),
      });

      if (response.ok) {
        await fetchOrders();
        if (selectedOrder?.id === id) {
          const data = await response.json();
          setSelectedOrder(data.order);
        }
      }
    } catch (error) {
      console.error("Failed to update order:", error);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Copied!");
  };

  const formatAmount = (amount: number, currency: string) => {
    if (currency === "USD") {
      return `$${(amount / 100).toFixed(2)}`;
    }
    return `${amount} ${currency}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-white/40">Orders Management</p>
          <h2 className="text-2xl font-semibold text-white">Orders</h2>
        </div>
        <div className="flex gap-2">
          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            className="rounded-lg border border-white/10 bg-white/5 px-3 py-1 text-sm text-white"
          >
            <option value="">All Status</option>
            <option value="open">Open</option>
            <option value="sourcing">Sourcing</option>
            <option value="awaiting-payment">Awaiting Payment</option>
            <option value="fulfilled">Fulfilled</option>
            <option value="canceled">Canceled</option>
          </select>
          <select
            value={filters.paymentStatus}
            onChange={(e) => setFilters({ ...filters, paymentStatus: e.target.value })}
            className="rounded-lg border border-white/10 bg-white/5 px-3 py-1 text-sm text-white"
          >
            <option value="">All Payment Status</option>
            <option value="unpaid">Unpaid</option>
            <option value="pending">Pending</option>
            <option value="paid">Paid</option>
            <option value="failed">Failed</option>
            <option value="refunded">Refunded</option>
          </select>
          <select
            value={filters.currency}
            onChange={(e) => setFilters({ ...filters, currency: e.target.value })}
            className="rounded-lg border border-white/10 bg-white/5 px-3 py-1 text-sm text-white"
          >
            <option value="">All Currencies</option>
            <option value="USD">USD</option>
            <option value="ETH">ETH</option>
            <option value="USDC">USDC</option>
          </select>
        </div>
      </div>

      <div className="rounded-3xl border border-white/10 bg-black/40 p-5">
        {isLoading ? (
          <p className="text-white/60">Loading...</p>
        ) : orders.length === 0 ? (
          <p className="text-white/60">No orders found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10 text-left text-sm text-white/60">
                  <th className="pb-3">Date</th>
                  <th className="pb-3">Item</th>
                  <th className="pb-3">Amount</th>
                  <th className="pb-3">Payment</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3">Method</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr
                    key={order.id}
                    onClick={() => setSelectedOrder(order)}
                    className="cursor-pointer border-b border-white/5 text-sm text-white/80 transition hover:bg-white/5"
                  >
                    <td className="py-3">{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td className="py-3">{order.itemName}</td>
                    <td className="py-3">{formatAmount(order.amount, order.currency)}</td>
                    <td className="py-3">
                      <span
                        className={`rounded-full px-2 py-1 text-xs ${
                          order.paymentStatus === "paid"
                            ? "bg-green-500/20 text-green-400"
                            : order.paymentStatus === "pending"
                            ? "bg-amber-500/20 text-amber-300"
                            : "bg-white/10 text-white/60"
                        }`}
                      >
                        {order.paymentStatus}
                      </span>
                    </td>
                    <td className="py-3">
                      <span className="rounded-full bg-white/10 px-2 py-1 text-xs">{order.status}</span>
                    </td>
                    <td className="py-3 capitalize">{order.paymentMethod}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-2xl rounded-2xl border border-white/10 bg-black/90 p-6 shadow-2xl">
            <button
              onClick={() => setSelectedOrder(null)}
              className="absolute right-4 top-4 rounded-full p-2 text-white/60 transition hover:bg-white/10 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="mb-6 text-2xl font-bold text-white">Order Details</h2>

            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm text-white/80">Status</label>
                <select
                  value={selectedOrder.status}
                  onChange={(e) => updateOrder(selectedOrder.id, { status: e.target.value })}
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white"
                >
                  <option value="open">Open</option>
                  <option value="sourcing">Sourcing</option>
                  <option value="awaiting-payment">Awaiting Payment</option>
                  <option value="fulfilled">Fulfilled</option>
                  <option value="canceled">Canceled</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm text-white/80">Payment Status</label>
                <select
                  value={selectedOrder.paymentStatus}
                  onChange={(e) => updateOrder(selectedOrder.id, { paymentStatus: e.target.value })}
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white"
                >
                  <option value="unpaid">Unpaid</option>
                  <option value="pending">Pending</option>
                  <option value="paid">Paid</option>
                  <option value="failed">Failed</option>
                  <option value="refunded">Refunded</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm text-white/80">Notes</label>
                <textarea
                  value={selectedOrder.notes || ""}
                  onChange={(e) => setSelectedOrder({ ...selectedOrder, notes: e.target.value })}
                  onBlur={() => updateOrder(selectedOrder.id, { notes: selectedOrder.notes })}
                  rows={4}
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white placeholder-white/40 focus:border-dream-cyan focus:outline-none"
                />
              </div>

              {selectedOrder.stripeSessionId && (
                <div>
                  <label className="mb-2 block text-sm text-white/80">Stripe Session ID</label>
                  <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 p-3">
                    <code className="flex-1 text-xs text-white break-all">{selectedOrder.stripeSessionId}</code>
                    <button
                      onClick={() => copyToClipboard(selectedOrder.stripeSessionId!)}
                      className="rounded p-1 text-white/60 transition hover:bg-white/10 hover:text-white"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {selectedOrder.txId && (
                <div>
                  <label className="mb-2 block text-sm text-white/80">Transaction ID</label>
                  <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 p-3">
                    <code className="flex-1 text-xs text-white break-all">{selectedOrder.txId}</code>
                    <button
                      onClick={() => copyToClipboard(selectedOrder.txId!)}
                      className="rounded p-1 text-white/60 transition hover:bg-white/10 hover:text-white"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 pt-4 text-sm">
                <div>
                  <p className="text-white/60">Item</p>
                  <p className="text-white">{selectedOrder.itemName}</p>
                </div>
                <div>
                  <p className="text-white/60">Amount</p>
                  <p className="text-white">{formatAmount(selectedOrder.amount, selectedOrder.currency)}</p>
                </div>
                <div>
                  <p className="text-white/60">Customer Email</p>
                  <p className="text-white">{selectedOrder.customerEmail || "N/A"}</p>
                </div>
                <div>
                  <p className="text-white/60">Created</p>
                  <p className="text-white">{new Date(selectedOrder.createdAt).toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

