import React, { useState, useEffect, useCallback } from "react";
import { X } from "lucide-react";

const API_BASE = import.meta.env.VITE_API_URL ?? "";
const OPERATOR_TOKEN = import.meta.env.VITE_OPERATOR_TOKEN ?? "";

interface Contact {
  id: string;
  createdAt: string;
  name: string;
  email: string;
  channel?: string;
  message: string;
  category: string;
  tags?: string[];
  status: string;
}

export function ContactsTab() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [filters, setFilters] = useState({
    category: "",
    status: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const fetchContacts = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.category) params.append("category", filters.category);
      if (filters.status) params.append("status", filters.status);

      const response = await fetch(`${API_BASE}/api/admin/contacts?${params}`, {
        headers: {
          Authorization: `Bearer ${OPERATOR_TOKEN}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setContacts(data.contacts ?? []);
      }
    } catch (error) {
      console.error("Failed to fetch contacts:", error);
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchContacts();
    const interval = setInterval(fetchContacts, 30000); // Refresh every 30s
    return () => clearInterval(interval);
  }, [fetchContacts]);

  const updateContact = async (id: string, patch: Partial<Contact>) => {
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
    } catch (error) {
      console.error("Failed to update contact:", error);
    }
  };

  const addTag = (tag: string) => {
    if (tag.trim() && selectedContact && !selectedContact.tags?.includes(tag.trim())) {
      const updated = {
        ...selectedContact,
        tags: [...(selectedContact.tags || []), tag.trim()],
      };
      setSelectedContact(updated);
      updateContact(selectedContact.id, { tags: updated.tags });
    }
  };

  const removeTag = (tag: string) => {
    if (selectedContact) {
      const updated = {
        ...selectedContact,
        tags: selectedContact.tags?.filter((t) => t !== tag) || [],
      };
      setSelectedContact(updated);
      updateContact(selectedContact.id, { tags: updated.tags });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-white/40">Contact Requests</p>
          <h2 className="text-2xl font-semibold text-white">Contacts</h2>
        </div>
        <div className="flex gap-2">
          <select
            value={filters.category}
            onChange={(e) => setFilters({ ...filters, category: e.target.value })}
            className="rounded-lg border border-white/10 bg-white/5 px-3 py-1 text-sm text-white"
          >
            <option value="">All Categories</option>
            <option value="collectibles">Collectibles</option>
            <option value="metals">Metals</option>
            <option value="custom">Custom</option>
            <option value="media">Media</option>
          </select>
          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            className="rounded-lg border border-white/10 bg-white/5 px-3 py-1 text-sm text-white"
          >
            <option value="">All Status</option>
            <option value="new">New</option>
            <option value="review">Review</option>
            <option value="replied">Replied</option>
            <option value="closed">Closed</option>
          </select>
        </div>
      </div>

      <div className="rounded-3xl border border-white/10 bg-black/40 p-5">
        {isLoading ? (
          <p className="text-white/60">Loading...</p>
        ) : contacts.length === 0 ? (
          <p className="text-white/60">No contacts found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10 text-left text-sm text-white/60">
                  <th className="pb-3">Date</th>
                  <th className="pb-3">Name</th>
                  <th className="pb-3">Email</th>
                  <th className="pb-3">Category</th>
                  <th className="pb-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {contacts.map((contact) => (
                  <tr
                    key={contact.id}
                    onClick={() => setSelectedContact(contact)}
                    className="cursor-pointer border-b border-white/5 text-sm text-white/80 transition hover:bg-white/5"
                  >
                    <td className="py-3">{new Date(contact.createdAt).toLocaleDateString()}</td>
                    <td className="py-3">{contact.name}</td>
                    <td className="py-3">{contact.email}</td>
                    <td className="py-3 capitalize">{contact.category}</td>
                    <td className="py-3">
                      <span
                        className={`rounded-full px-2 py-1 text-xs ${
                          contact.status === "new"
                            ? "bg-blue-500/20 text-blue-400"
                            : contact.status === "replied"
                            ? "bg-green-500/20 text-green-400"
                            : "bg-white/10 text-white/60"
                        }`}
                      >
                        {contact.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selectedContact && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-2xl rounded-2xl border border-white/10 bg-black/90 p-6 shadow-2xl">
            <button
              onClick={() => setSelectedContact(null)}
              className="absolute right-4 top-4 rounded-full p-2 text-white/60 transition hover:bg-white/10 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="mb-6 text-2xl font-bold text-white">Contact Details</h2>

            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm text-white/80">Status</label>
                <select
                  value={selectedContact.status}
                  onChange={(e) => updateContact(selectedContact.id, { status: e.target.value })}
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white"
                >
                  <option value="new">New</option>
                  <option value="review">Review</option>
                  <option value="replied">Replied</option>
                  <option value="closed">Closed</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm text-white/80">Message</label>
                <div className="rounded-lg border border-white/10 bg-white/5 p-4 text-sm text-white/80">
                  {selectedContact.message}
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm text-white/80">Tags</label>
                <div className="mb-2 flex flex-wrap gap-2">
                  {selectedContact.tags?.map((tag) => (
                    <span
                      key={tag}
                      className="flex items-center gap-1 rounded-full bg-dream-cyan/20 px-3 py-1 text-sm text-dream-cyan"
                    >
                      {tag}
                      <button
                        onClick={() => removeTag(tag)}
                        className="ml-1 text-dream-cyan/60 hover:text-dream-cyan"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                <input
                  type="text"
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addTag(e.currentTarget.value);
                      e.currentTarget.value = "";
                    }
                  }}
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white placeholder-white/40 focus:border-dream-cyan focus:outline-none"
                  placeholder="Add tag and press Enter"
                />
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 text-sm">
                <div>
                  <p className="text-white/60">Name</p>
                  <p className="text-white">{selectedContact.name}</p>
                </div>
                <div>
                  <p className="text-white/60">Email</p>
                  <p className="text-white">{selectedContact.email}</p>
                </div>
                <div>
                  <p className="text-white/60">Category</p>
                  <p className="text-white capitalize">{selectedContact.category}</p>
                </div>
                <div>
                  <p className="text-white/60">Created</p>
                  <p className="text-white">{new Date(selectedContact.createdAt).toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

