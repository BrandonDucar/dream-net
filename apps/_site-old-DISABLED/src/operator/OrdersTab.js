import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect, useCallback } from "react";
import { Copy, X } from "lucide-react";
const API_BASE = import.meta.env.VITE_API_URL ?? "";
const OPERATOR_TOKEN = import.meta.env.VITE_OPERATOR_TOKEN ?? "";
export function OrdersTab() {
    const [orders, setOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
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
            if (filters.status)
                params.append("status", filters.status);
            if (filters.paymentStatus)
                params.append("paymentStatus", filters.paymentStatus);
            if (filters.currency)
                params.append("currency", filters.currency);
            const response = await fetch(`${API_BASE}/api/admin/orders?${params}`, {
                headers: {
                    Authorization: `Bearer ${OPERATOR_TOKEN}`,
                },
            });
            if (response.ok) {
                const data = await response.json();
                setOrders(data.orders ?? []);
            }
        }
        catch (error) {
            console.error("Failed to fetch orders:", error);
        }
        finally {
            setIsLoading(false);
        }
    }, [filters]);
    useEffect(() => {
        fetchOrders();
        const interval = setInterval(fetchOrders, 30000); // Refresh every 30s
        return () => clearInterval(interval);
    }, [fetchOrders]);
    const updateOrder = async (id, patch) => {
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
        }
        catch (error) {
            console.error("Failed to update order:", error);
        }
    };
    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        alert("Copied!");
    };
    const formatAmount = (amount, currency) => {
        if (currency === "USD") {
            return `$${(amount / 100).toFixed(2)}`;
        }
        return `${amount} ${currency}`;
    };
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-xs uppercase tracking-[0.3em] text-white/40", children: "Orders Management" }), _jsx("h2", { className: "text-2xl font-semibold text-white", children: "Orders" })] }), _jsxs("div", { className: "flex gap-2", children: [_jsxs("select", { value: filters.status, onChange: (e) => setFilters({ ...filters, status: e.target.value }), className: "rounded-lg border border-white/10 bg-white/5 px-3 py-1 text-sm text-white", children: [_jsx("option", { value: "", children: "All Status" }), _jsx("option", { value: "open", children: "Open" }), _jsx("option", { value: "sourcing", children: "Sourcing" }), _jsx("option", { value: "awaiting-payment", children: "Awaiting Payment" }), _jsx("option", { value: "fulfilled", children: "Fulfilled" }), _jsx("option", { value: "canceled", children: "Canceled" })] }), _jsxs("select", { value: filters.paymentStatus, onChange: (e) => setFilters({ ...filters, paymentStatus: e.target.value }), className: "rounded-lg border border-white/10 bg-white/5 px-3 py-1 text-sm text-white", children: [_jsx("option", { value: "", children: "All Payment Status" }), _jsx("option", { value: "unpaid", children: "Unpaid" }), _jsx("option", { value: "pending", children: "Pending" }), _jsx("option", { value: "paid", children: "Paid" }), _jsx("option", { value: "failed", children: "Failed" }), _jsx("option", { value: "refunded", children: "Refunded" })] }), _jsxs("select", { value: filters.currency, onChange: (e) => setFilters({ ...filters, currency: e.target.value }), className: "rounded-lg border border-white/10 bg-white/5 px-3 py-1 text-sm text-white", children: [_jsx("option", { value: "", children: "All Currencies" }), _jsx("option", { value: "USD", children: "USD" }), _jsx("option", { value: "ETH", children: "ETH" }), _jsx("option", { value: "USDC", children: "USDC" })] })] })] }), _jsx("div", { className: "rounded-3xl border border-white/10 bg-black/40 p-5", children: isLoading ? (_jsx("p", { className: "text-white/60", children: "Loading..." })) : orders.length === 0 ? (_jsx("p", { className: "text-white/60", children: "No orders found." })) : (_jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "w-full", children: [_jsx("thead", { children: _jsxs("tr", { className: "border-b border-white/10 text-left text-sm text-white/60", children: [_jsx("th", { className: "pb-3", children: "Date" }), _jsx("th", { className: "pb-3", children: "Item" }), _jsx("th", { className: "pb-3", children: "Amount" }), _jsx("th", { className: "pb-3", children: "Payment" }), _jsx("th", { className: "pb-3", children: "Status" }), _jsx("th", { className: "pb-3", children: "Method" })] }) }), _jsx("tbody", { children: orders.map((order) => (_jsxs("tr", { onClick: () => setSelectedOrder(order), className: "cursor-pointer border-b border-white/5 text-sm text-white/80 transition hover:bg-white/5", children: [_jsx("td", { className: "py-3", children: new Date(order.createdAt).toLocaleDateString() }), _jsx("td", { className: "py-3", children: order.itemName }), _jsx("td", { className: "py-3", children: formatAmount(order.amount, order.currency) }), _jsx("td", { className: "py-3", children: _jsx("span", { className: `rounded-full px-2 py-1 text-xs ${order.paymentStatus === "paid"
                                                    ? "bg-green-500/20 text-green-400"
                                                    : order.paymentStatus === "pending"
                                                        ? "bg-amber-500/20 text-amber-300"
                                                        : "bg-white/10 text-white/60"}`, children: order.paymentStatus }) }), _jsx("td", { className: "py-3", children: _jsx("span", { className: "rounded-full bg-white/10 px-2 py-1 text-xs", children: order.status }) }), _jsx("td", { className: "py-3 capitalize", children: order.paymentMethod })] }, order.id))) })] }) })) }), selectedOrder && (_jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm", children: _jsxs("div", { className: "relative w-full max-w-2xl rounded-2xl border border-white/10 bg-black/90 p-6 shadow-2xl", children: [_jsx("button", { onClick: () => setSelectedOrder(null), className: "absolute right-4 top-4 rounded-full p-2 text-white/60 transition hover:bg-white/10 hover:text-white", children: _jsx(X, { className: "w-5 h-5" }) }), _jsx("h2", { className: "mb-6 text-2xl font-bold text-white", children: "Order Details" }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "mb-2 block text-sm text-white/80", children: "Status" }), _jsxs("select", { value: selectedOrder.status, onChange: (e) => updateOrder(selectedOrder.id, { status: e.target.value }), className: "w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white", children: [_jsx("option", { value: "open", children: "Open" }), _jsx("option", { value: "sourcing", children: "Sourcing" }), _jsx("option", { value: "awaiting-payment", children: "Awaiting Payment" }), _jsx("option", { value: "fulfilled", children: "Fulfilled" }), _jsx("option", { value: "canceled", children: "Canceled" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "mb-2 block text-sm text-white/80", children: "Payment Status" }), _jsxs("select", { value: selectedOrder.paymentStatus, onChange: (e) => updateOrder(selectedOrder.id, { paymentStatus: e.target.value }), className: "w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white", children: [_jsx("option", { value: "unpaid", children: "Unpaid" }), _jsx("option", { value: "pending", children: "Pending" }), _jsx("option", { value: "paid", children: "Paid" }), _jsx("option", { value: "failed", children: "Failed" }), _jsx("option", { value: "refunded", children: "Refunded" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "mb-2 block text-sm text-white/80", children: "Notes" }), _jsx("textarea", { value: selectedOrder.notes || "", onChange: (e) => setSelectedOrder({ ...selectedOrder, notes: e.target.value }), onBlur: () => updateOrder(selectedOrder.id, { notes: selectedOrder.notes }), rows: 4, className: "w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white placeholder-white/40 focus:border-dream-cyan focus:outline-none" })] }), selectedOrder.stripeSessionId && (_jsxs("div", { children: [_jsx("label", { className: "mb-2 block text-sm text-white/80", children: "Stripe Session ID" }), _jsxs("div", { className: "flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 p-3", children: [_jsx("code", { className: "flex-1 text-xs text-white break-all", children: selectedOrder.stripeSessionId }), _jsx("button", { onClick: () => copyToClipboard(selectedOrder.stripeSessionId), className: "rounded p-1 text-white/60 transition hover:bg-white/10 hover:text-white", children: _jsx(Copy, { className: "w-4 h-4" }) })] })] })), selectedOrder.txId && (_jsxs("div", { children: [_jsx("label", { className: "mb-2 block text-sm text-white/80", children: "Transaction ID" }), _jsxs("div", { className: "flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 p-3", children: [_jsx("code", { className: "flex-1 text-xs text-white break-all", children: selectedOrder.txId }), _jsx("button", { onClick: () => copyToClipboard(selectedOrder.txId), className: "rounded p-1 text-white/60 transition hover:bg-white/10 hover:text-white", children: _jsx(Copy, { className: "w-4 h-4" }) })] })] })), _jsxs("div", { className: "grid grid-cols-2 gap-4 pt-4 text-sm", children: [_jsxs("div", { children: [_jsx("p", { className: "text-white/60", children: "Item" }), _jsx("p", { className: "text-white", children: selectedOrder.itemName })] }), _jsxs("div", { children: [_jsx("p", { className: "text-white/60", children: "Amount" }), _jsx("p", { className: "text-white", children: formatAmount(selectedOrder.amount, selectedOrder.currency) })] }), _jsxs("div", { children: [_jsx("p", { className: "text-white/60", children: "Customer Email" }), _jsx("p", { className: "text-white", children: selectedOrder.customerEmail || "N/A" })] }), _jsxs("div", { children: [_jsx("p", { className: "text-white/60", children: "Created" }), _jsx("p", { className: "text-white", children: new Date(selectedOrder.createdAt).toLocaleString() })] })] })] })] }) }))] }));
}
