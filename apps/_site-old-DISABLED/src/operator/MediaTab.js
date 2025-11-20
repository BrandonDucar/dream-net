import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
const API_BASE = import.meta.env.VITE_API_URL ?? "";
const sectionClass = "rounded-3xl border border-white/10 bg-black/40 p-5 shadow-[0_20px_40px_rgba(0,0,0,0.35)] backdrop-blur";
export function MediaTab() {
    const [media, setMedia] = useState([]);
    const [selectedMedia, setSelectedMedia] = useState(null);
    const [queueItems, setQueueItems] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [filter, setFilter] = useState({});
    const [uploading, setUploading] = useState(false);
    useEffect(() => {
        fetchMedia();
        fetchQueue();
    }, [searchQuery, filter]);
    async function fetchMedia() {
        try {
            const params = new URLSearchParams();
            if (searchQuery)
                params.set("q", searchQuery);
            if (filter.type)
                params.set("type", filter.type);
            if (filter.collection)
                params.set("collections", filter.collection);
            const res = await fetch(`${API_BASE}/api/media/search?${params}`);
            const data = await res.json();
            if (data.ok) {
                setMedia(data.results || []);
            }
        }
        catch (err) {
            console.error("Failed to fetch media:", err);
        }
    }
    async function fetchQueue() {
        try {
            const res = await fetch(`${API_BASE}/api/posts/queue`);
            const data = await res.json();
            if (data.ok) {
                setQueueItems(data.items || []);
            }
        }
        catch (err) {
            console.error("Failed to fetch queue:", err);
        }
    }
    async function handleUpload(e) {
        const file = e.target.files?.[0];
        if (!file)
            return;
        setUploading(true);
        try {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("source", "other");
            formData.append("title", file.name);
            const res = await fetch(`${API_BASE}/api/media/ingest`, {
                method: "POST",
                body: formData,
            });
            if (res.ok) {
                await fetchMedia();
            }
        }
        catch (err) {
            console.error("Upload failed:", err);
        }
        finally {
            setUploading(false);
        }
    }
    async function addToQueue(mediaId, platform, caption, hashtags) {
        try {
            const res = await fetch(`${API_BASE}/api/posts/queue`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    media_id: mediaId,
                    platform,
                    caption,
                    hashtags,
                }),
            });
            if (res.ok) {
                await fetchQueue();
            }
        }
        catch (err) {
            console.error("Failed to add to queue:", err);
        }
    }
    const quickFilters = [
        { label: "Goldstorm", collection: "campaign:goldstorm" },
        { label: "Labubu", collection: "series:labubu-cartel" },
        { label: "Coins", tags: ["coins", "bullion"] },
    ];
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h2", { className: "text-2xl font-semibold text-white", children: "Media Vault" }), _jsx("p", { className: "text-sm text-white/60", children: "Upload, tag, and queue media for posting" })] }), _jsxs("label", { className: "rounded-full bg-white/10 px-4 py-2 text-sm text-white/80 transition hover:bg-white/20 cursor-pointer", children: [uploading ? "Uploading..." : "Upload Media", _jsx("input", { type: "file", className: "hidden", onChange: handleUpload, accept: "image/*,video/*" })] })] }), _jsxs("div", { className: "flex gap-4", children: [_jsx("input", { type: "text", placeholder: "Search media...", value: searchQuery, onChange: (e) => setSearchQuery(e.target.value), className: "flex-1 rounded-xl border border-white/10 bg-black/40 px-4 py-2 text-white placeholder:text-white/40" }), _jsxs("select", { value: filter.type || "", onChange: (e) => setFilter({ ...filter, type: e.target.value || undefined }), className: "rounded-xl border border-white/10 bg-black/40 px-4 py-2 text-white", children: [_jsx("option", { value: "", children: "All Types" }), _jsx("option", { value: "image", children: "Images" }), _jsx("option", { value: "video", children: "Videos" })] })] }), _jsx("div", { className: "flex gap-2", children: quickFilters.map((qf) => (_jsx("button", { onClick: () => setFilter({ collection: qf.collection }), className: "rounded-full border border-white/15 px-4 py-2 text-sm text-white/60 transition hover:text-white", children: qf.label }, qf.label))) }), _jsxs("div", { className: "grid gap-6 lg:grid-cols-3", children: [_jsxs("section", { className: `${sectionClass} lg:col-span-2`, children: [_jsx("h3", { className: "text-lg font-semibold text-white mb-4", children: "Media Library" }), _jsx("div", { className: "grid grid-cols-3 gap-4", children: media.map((item) => (_jsxs("div", { onClick: () => setSelectedMedia(item), className: "relative aspect-square rounded-xl border border-white/10 bg-black/40 overflow-hidden cursor-pointer hover:border-white/30 transition", children: [item.type === "image" ? (_jsx("img", { src: `${API_BASE}/media/thumb_320/${item.id}.jpg`, alt: item.title, className: "w-full h-full object-cover" })) : (_jsx("div", { className: "w-full h-full flex items-center justify-center text-white/60", children: _jsx("svg", { className: "w-12 h-12", fill: "currentColor", viewBox: "0 0 20 20", children: _jsx("path", { d: "M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" }) }) })), _jsxs("div", { className: "absolute bottom-0 left-0 right-0 bg-black/80 p-2", children: [_jsx("p", { className: "text-xs text-white truncate", children: item.title }), _jsx("p", { className: "text-[10px] text-white/60", children: item.source })] })] }, item.id))) })] }), _jsxs("div", { className: "space-y-6", children: [selectedMedia ? (_jsxs("section", { className: sectionClass, children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsx("h3", { className: "text-lg font-semibold text-white", children: "Media Details" }), _jsx("button", { onClick: () => setSelectedMedia(null), className: "text-white/60 hover:text-white", children: "\u2715" })] }), _jsxs("div", { className: "space-y-4", children: [_jsx("img", { src: `${API_BASE}/media/web_1080/${selectedMedia.id}.jpg`, alt: selectedMedia.title, className: "w-full rounded-xl" }), _jsxs("div", { children: [_jsx("p", { className: "text-sm font-semibold text-white", children: selectedMedia.title }), _jsx("p", { className: "text-xs text-white/60 mt-1", children: selectedMedia.caption })] }), _jsx("div", { className: "flex flex-wrap gap-2", children: selectedMedia.tags.map((tag) => (_jsx("span", { className: "rounded-full bg-white/10 px-2 py-1 text-xs text-white/80", children: tag }, tag))) }), _jsxs("div", { className: "space-y-2", children: [_jsx("p", { className: "text-xs uppercase tracking-[0.2em] text-white/40", children: "Add to Queue" }), _jsx("div", { className: "flex gap-2", children: ["x", "base", "ig"].map((platform) => (_jsx("button", { onClick: () => addToQueue(selectedMedia.id, platform, selectedMedia.caption), className: "flex-1 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/80 transition hover:bg-white/10", children: platform.toUpperCase() }, platform))) })] })] })] })) : null, _jsxs("section", { className: sectionClass, children: [_jsx("h3", { className: "text-lg font-semibold text-white mb-4", children: "Post Queue" }), _jsx("div", { className: "space-y-3", children: queueItems.slice(0, 5).map((item) => (_jsxs("div", { className: "rounded-xl border border-white/10 bg-black/40 p-3", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { className: "text-xs uppercase tracking-[0.2em] text-white/60", children: item.platform }), _jsx("span", { className: `text-xs ${item.status === "posted" ? "text-green-400" :
                                                                item.status === "scheduled" ? "text-amber-400" :
                                                                    item.status === "failed" ? "text-red-400" :
                                                                        "text-white/60"}`, children: item.status })] }), _jsx("p", { className: "text-sm text-white/80 mt-2 truncate", children: item.caption }), item.scheduled_at && (_jsx("p", { className: "text-xs text-white/60 mt-1", children: new Date(item.scheduled_at).toLocaleString() }))] }, item.id))) })] })] })] })] }));
}
