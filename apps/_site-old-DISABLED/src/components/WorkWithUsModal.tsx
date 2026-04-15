import React, { useState } from "react";
import { X } from "lucide-react";
import type { ContactCategory } from "@dreamnet/orders";

interface WorkWithUsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function WorkWithUsModal({ isOpen, onClose }: WorkWithUsModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    channel: "",
    message: "",
    category: "custom" as ContactCategory,
    tags: [] as string[],
  });
  const [tagInput, setTagInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/public/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to submit");
      }

      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
        setFormData({
          name: "",
          email: "",
          channel: "",
          message: "",
          category: "custom",
          tags: [],
        });
      }, 2000);
    } catch (error) {
      console.error("Failed to submit contact request:", error);
      alert("Failed to submit. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({ ...formData, tags: [...formData.tags, tagInput.trim()] });
      setTagInput("");
    }
  };

  const removeTag = (tag: string) => {
    setFormData({ ...formData, tags: formData.tags.filter((t) => t !== tag) });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl rounded-2xl border border-white/10 bg-black/90 p-6 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-2 text-white/60 transition hover:bg-white/10 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="mb-6 text-2xl font-bold text-white">Work With Us</h2>

        {success ? (
          <div className="py-8 text-center">
            <div className="mb-4 text-4xl">✓</div>
            <p className="text-lg text-green-400">Thank you! We'll be in touch soon.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-2 block text-sm text-white/80">Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white placeholder-white/40 focus:border-dream-cyan focus:outline-none"
                placeholder="Your name"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-white/80">Email *</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white placeholder-white/40 focus:border-dream-cyan focus:outline-none"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-white/80">Category *</label>
              <select
                required
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as ContactCategory })}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white focus:border-dream-cyan focus:outline-none"
              >
                <option value="collectibles">Collectibles</option>
                <option value="metals">Metals</option>
                <option value="custom">Custom</option>
                <option value="media">Media</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm text-white/80">Message *</label>
              <textarea
                required
                rows={5}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white placeholder-white/40 focus:border-dream-cyan focus:outline-none"
                placeholder="Tell us about your project..."
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-white/80">Tags (optional)</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addTag();
                    }
                  }}
                  className="flex-1 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white placeholder-white/40 focus:border-dream-cyan focus:outline-none"
                  placeholder="Add tag and press Enter"
                />
                <button
                  type="button"
                  onClick={addTag}
                  className="rounded-lg border border-dream-cyan bg-dream-cyan/20 px-4 py-2 text-dream-cyan transition hover:bg-dream-cyan/30"
                >
                  Add
                </button>
              </div>
              {formData.tags.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {formData.tags.map((tag) => (
                    <span
                      key={tag}
                      className="flex items-center gap-1 rounded-full bg-dream-cyan/20 px-3 py-1 text-sm text-dream-cyan"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="ml-1 text-dream-cyan/60 hover:text-dream-cyan"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
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
                {isSubmitting ? "Submitting..." : "Submit"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

