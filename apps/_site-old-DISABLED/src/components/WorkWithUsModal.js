import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { X } from "lucide-react";
export function WorkWithUsModal({ isOpen, onClose }) {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        channel: "",
        message: "",
        category: "custom",
        tags: [],
    });
    const [tagInput, setTagInput] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    if (!isOpen)
        return null;
    const handleSubmit = async (e) => {
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
        }
        catch (error) {
            console.error("Failed to submit contact request:", error);
            alert("Failed to submit. Please try again.");
        }
        finally {
            setIsSubmitting(false);
        }
    };
    const addTag = () => {
        if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
            setFormData({ ...formData, tags: [...formData.tags, tagInput.trim()] });
            setTagInput("");
        }
    };
    const removeTag = (tag) => {
        setFormData({ ...formData, tags: formData.tags.filter((t) => t !== tag) });
    };
    return (_jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm", children: _jsxs("div", { className: "relative w-full max-w-2xl rounded-2xl border border-white/10 bg-black/90 p-6 shadow-2xl", children: [_jsx("button", { onClick: onClose, className: "absolute right-4 top-4 rounded-full p-2 text-white/60 transition hover:bg-white/10 hover:text-white", children: _jsx(X, { className: "w-5 h-5" }) }), _jsx("h2", { className: "mb-6 text-2xl font-bold text-white", children: "Work With Us" }), success ? (_jsxs("div", { className: "py-8 text-center", children: [_jsx("div", { className: "mb-4 text-4xl", children: "\u2713" }), _jsx("p", { className: "text-lg text-green-400", children: "Thank you! We'll be in touch soon." })] })) : (_jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "mb-2 block text-sm text-white/80", children: "Name *" }), _jsx("input", { type: "text", required: true, value: formData.name, onChange: (e) => setFormData({ ...formData, name: e.target.value }), className: "w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white placeholder-white/40 focus:border-dream-cyan focus:outline-none", placeholder: "Your name" })] }), _jsxs("div", { children: [_jsx("label", { className: "mb-2 block text-sm text-white/80", children: "Email *" }), _jsx("input", { type: "email", required: true, value: formData.email, onChange: (e) => setFormData({ ...formData, email: e.target.value }), className: "w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white placeholder-white/40 focus:border-dream-cyan focus:outline-none", placeholder: "your@email.com" })] }), _jsxs("div", { children: [_jsx("label", { className: "mb-2 block text-sm text-white/80", children: "Category *" }), _jsxs("select", { required: true, value: formData.category, onChange: (e) => setFormData({ ...formData, category: e.target.value }), className: "w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white focus:border-dream-cyan focus:outline-none", children: [_jsx("option", { value: "collectibles", children: "Collectibles" }), _jsx("option", { value: "metals", children: "Metals" }), _jsx("option", { value: "custom", children: "Custom" }), _jsx("option", { value: "media", children: "Media" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "mb-2 block text-sm text-white/80", children: "Message *" }), _jsx("textarea", { required: true, rows: 5, value: formData.message, onChange: (e) => setFormData({ ...formData, message: e.target.value }), className: "w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white placeholder-white/40 focus:border-dream-cyan focus:outline-none", placeholder: "Tell us about your project..." })] }), _jsxs("div", { children: [_jsx("label", { className: "mb-2 block text-sm text-white/80", children: "Tags (optional)" }), _jsxs("div", { className: "flex gap-2", children: [_jsx("input", { type: "text", value: tagInput, onChange: (e) => setTagInput(e.target.value), onKeyPress: (e) => {
                                                if (e.key === "Enter") {
                                                    e.preventDefault();
                                                    addTag();
                                                }
                                            }, className: "flex-1 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white placeholder-white/40 focus:border-dream-cyan focus:outline-none", placeholder: "Add tag and press Enter" }), _jsx("button", { type: "button", onClick: addTag, className: "rounded-lg border border-dream-cyan bg-dream-cyan/20 px-4 py-2 text-dream-cyan transition hover:bg-dream-cyan/30", children: "Add" })] }), formData.tags.length > 0 && (_jsx("div", { className: "mt-2 flex flex-wrap gap-2", children: formData.tags.map((tag) => (_jsxs("span", { className: "flex items-center gap-1 rounded-full bg-dream-cyan/20 px-3 py-1 text-sm text-dream-cyan", children: [tag, _jsx("button", { type: "button", onClick: () => removeTag(tag), className: "ml-1 text-dream-cyan/60 hover:text-dream-cyan", children: "\u00D7" })] }, tag))) }))] }), _jsxs("div", { className: "flex gap-3 pt-4", children: [_jsx("button", { type: "button", onClick: onClose, className: "flex-1 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white transition hover:bg-white/10", children: "Cancel" }), _jsx("button", { type: "submit", disabled: isSubmitting, className: "flex-1 rounded-lg bg-dream-cyan px-4 py-2 font-semibold text-black transition hover:bg-dream-cyan/90 disabled:opacity-50", children: isSubmitting ? "Submitting..." : "Submit" })] })] }))] }) }));
}
