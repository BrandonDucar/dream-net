import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect, useCallback } from "react";
import { X } from "lucide-react";
const API_BASE = import.meta.env.VITE_API_URL ?? "";
const OPERATOR_TOKEN = import.meta.env.VITE_OPERATOR_TOKEN ?? "";
export function ContactsTab() {
    const [contacts, setContacts] = useState([]);
    const [selectedContact, setSelectedContact] = useState(null);
    const [filters, setFilters] = useState({
        category: "",
        status: "",
    });
    const [isLoading, setIsLoading] = useState(false);
    const fetchContacts = useCallback(async () => {
        setIsLoading(true);
        try {
            const params = new URLSearchParams();
            if (filters.category)
                params.append("category", filters.category);
            if (filters.status)
                params.append("status", filters.status);
            const response = await fetch(`${API_BASE}/api/admin/contacts?${params}`, {
                headers: {
                    Authorization: `Bearer ${OPERATOR_TOKEN}`,
                },
            });
            if (response.ok) {
                const data = await response.json();
                setContacts(data.contacts ?? []);
            }
        }
        catch (error) {
            console.error("Failed to fetch contacts:", error);
        }
        finally {
            setIsLoading(false);
        }
    }, [filters]);
    useEffect(() => {
        fetchContacts();
        const interval = setInterval(fetchContacts, 30000); // Refresh every 30s
        return () => clearInterval(interval);
    }, [fetchContacts]);
    const updateContact = async (id, patch) => {
        try {
            const response = await fetch(`${API_BASE}/api/admin/contacts/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${OPERATOR_TOKEN}`,
                },
                body: JSON.stringify(patch),
            });
            if (response.ok) {
                await fetchContacts();
                if (selectedContact?.id === id) {
                    const data = await response.json();
                    setSelectedContact(data.contact);
                }
            }
        }
        catch (error) {
            console.error("Failed to update contact:", error);
        }
    };
    const addTag = (tag) => {
        if (tag.trim() && selectedContact && !selectedContact.tags?.includes(tag.trim())) {
            const updated = {
                ...selectedContact,
                tags: [...(selectedContact.tags || []), tag.trim()],
            };
            setSelectedContact(updated);
            updateContact(selectedContact.id, { tags: updated.tags });
        }
    };
    const removeTag = (tag) => {
        if (selectedContact) {
            const updated = {
                ...selectedContact,
                tags: selectedContact.tags?.filter((t) => t !== tag) || [],
            };
            setSelectedContact(updated);
            updateContact(selectedContact.id, { tags: updated.tags });
        }
    };
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-xs uppercase tracking-[0.3em] text-white/40", children: "Contact Requests" }), _jsx("h2", { className: "text-2xl font-semibold text-white", children: "Contacts" })] }), _jsxs("div", { className: "flex gap-2", children: [_jsxs("select", { value: filters.category, onChange: (e) => setFilters({ ...filters, category: e.target.value }), className: "rounded-lg border border-white/10 bg-white/5 px-3 py-1 text-sm text-white", children: [_jsx("option", { value: "", children: "All Categories" }), _jsx("option", { value: "collectibles", children: "Collectibles" }), _jsx("option", { value: "metals", children: "Metals" }), _jsx("option", { value: "custom", children: "Custom" }), _jsx("option", { value: "media", children: "Media" })] }), _jsxs("select", { value: filters.status, onChange: (e) => setFilters({ ...filters, status: e.target.value }), className: "rounded-lg border border-white/10 bg-white/5 px-3 py-1 text-sm text-white", children: [_jsx("option", { value: "", children: "All Status" }), _jsx("option", { value: "new", children: "New" }), _jsx("option", { value: "review", children: "Review" }), _jsx("option", { value: "replied", children: "Replied" }), _jsx("option", { value: "closed", children: "Closed" })] })] })] }), _jsx("div", { className: "rounded-3xl border border-white/10 bg-black/40 p-5", children: isLoading ? (_jsx("p", { className: "text-white/60", children: "Loading..." })) : contacts.length === 0 ? (_jsx("p", { className: "text-white/60", children: "No contacts found." })) : (_jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "w-full", children: [_jsx("thead", { children: _jsxs("tr", { className: "border-b border-white/10 text-left text-sm text-white/60", children: [_jsx("th", { className: "pb-3", children: "Date" }), _jsx("th", { className: "pb-3", children: "Name" }), _jsx("th", { className: "pb-3", children: "Email" }), _jsx("th", { className: "pb-3", children: "Category" }), _jsx("th", { className: "pb-3", children: "Status" })] }) }), _jsx("tbody", { children: contacts.map((contact) => (_jsxs("tr", { onClick: () => setSelectedContact(contact), className: "cursor-pointer border-b border-white/5 text-sm text-white/80 transition hover:bg-white/5", children: [_jsx("td", { className: "py-3", children: new Date(contact.createdAt).toLocaleDateString() }), _jsx("td", { className: "py-3", children: contact.name }), _jsx("td", { className: "py-3", children: contact.email }), _jsx("td", { className: "py-3 capitalize", children: contact.category }), _jsx("td", { className: "py-3", children: _jsx("span", { className: `rounded-full px-2 py-1 text-xs ${contact.status === "new"
                                                    ? "bg-blue-500/20 text-blue-400"
                                                    : contact.status === "replied"
                                                        ? "bg-green-500/20 text-green-400"
                                                        : "bg-white/10 text-white/60"}`, children: contact.status }) })] }, contact.id))) })] }) })) }), selectedContact && (_jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm", children: _jsxs("div", { className: "relative w-full max-w-2xl rounded-2xl border border-white/10 bg-black/90 p-6 shadow-2xl", children: [_jsx("button", { onClick: () => setSelectedContact(null), className: "absolute right-4 top-4 rounded-full p-2 text-white/60 transition hover:bg-white/10 hover:text-white", children: _jsx(X, { className: "w-5 h-5" }) }), _jsx("h2", { className: "mb-6 text-2xl font-bold text-white", children: "Contact Details" }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "mb-2 block text-sm text-white/80", children: "Status" }), _jsxs("select", { value: selectedContact.status, onChange: (e) => updateContact(selectedContact.id, { status: e.target.value }), className: "w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white", children: [_jsx("option", { value: "new", children: "New" }), _jsx("option", { value: "review", children: "Review" }), _jsx("option", { value: "replied", children: "Replied" }), _jsx("option", { value: "closed", children: "Closed" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "mb-2 block text-sm text-white/80", children: "Message" }), _jsx("div", { className: "rounded-lg border border-white/10 bg-white/5 p-4 text-sm text-white/80", children: selectedContact.message })] }), _jsxs("div", { children: [_jsx("label", { className: "mb-2 block text-sm text-white/80", children: "Tags" }), _jsx("div", { className: "mb-2 flex flex-wrap gap-2", children: selectedContact.tags?.map((tag) => (_jsxs("span", { className: "flex items-center gap-1 rounded-full bg-dream-cyan/20 px-3 py-1 text-sm text-dream-cyan", children: [tag, _jsx("button", { onClick: () => removeTag(tag), className: "ml-1 text-dream-cyan/60 hover:text-dream-cyan", children: "\u00D7" })] }, tag))) }), _jsx("input", { type: "text", onKeyPress: (e) => {
                                                if (e.key === "Enter") {
                                                    e.preventDefault();
                                                    addTag(e.currentTarget.value);
                                                    e.currentTarget.value = "";
                                                }
                                            }, className: "w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white placeholder-white/40 focus:border-dream-cyan focus:outline-none", placeholder: "Add tag and press Enter" })] }), _jsxs("div", { className: "grid grid-cols-2 gap-4 pt-4 text-sm", children: [_jsxs("div", { children: [_jsx("p", { className: "text-white/60", children: "Name" }), _jsx("p", { className: "text-white", children: selectedContact.name })] }), _jsxs("div", { children: [_jsx("p", { className: "text-white/60", children: "Email" }), _jsx("p", { className: "text-white", children: selectedContact.email })] }), _jsxs("div", { children: [_jsx("p", { className: "text-white/60", children: "Category" }), _jsx("p", { className: "text-white capitalize", children: selectedContact.category })] }), _jsxs("div", { children: [_jsx("p", { className: "text-white/60", children: "Created" }), _jsx("p", { className: "text-white", children: new Date(selectedContact.createdAt).toLocaleString() })] })] })] })] }) }))] }));
}
