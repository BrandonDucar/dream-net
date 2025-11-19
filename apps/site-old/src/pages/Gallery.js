import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Share2, X } from "lucide-react";
const API_BASE = import.meta.env.VITE_API_URL ?? "";
export default function Gallery() {
    const [media, setMedia] = useState([]);
    const [selectedMedia, setSelectedMedia] = useState(null);
    const [filter, setFilter] = useState("all");
    const [isLoading, setIsLoading] = useState(true);
    const filters = [
        { id: "all", label: "All" },
        { id: "organism", label: "Organism" },
        { id: "environments", label: "Environments" },
        { id: "dream-gods", label: "Dream Gods" },
    ];
    useEffect(() => {
        const fetchMedia = async () => {
            setIsLoading(true);
            try {
                const collection = filter === "all" ? undefined : filter;
                const response = await fetch(`${API_BASE}/api/media/public?collection=${collection || "all"}&limit=100`);
                if (response.ok) {
                    const data = await response.json();
                    setMedia(data.media || []);
                }
            }
            catch (error) {
                console.error("Failed to fetch media:", error);
            }
            finally {
                setIsLoading(false);
            }
        };
        fetchMedia();
    }, [filter]);
    const shareLink = (mediaId) => {
        const url = `${window.location.origin}/gallery/${mediaId}`;
        if (navigator.share) {
            navigator.share({ url, title: "DreamNet Gallery" });
        }
        else {
            navigator.clipboard.writeText(url);
            alert("Link copied to clipboard!");
        }
    };
    return (_jsxs("div", { className: "min-h-screen bg-gradient-to-br from-[#06060a] via-[#0a0a12] to-[#06060a] text-white", children: [_jsx("div", { className: "border-b border-white/10 bg-black/60", children: _jsxs("div", { className: "mx-auto flex max-w-7xl items-center justify-between px-6 py-4", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold", children: "Gallery" }), _jsx("p", { className: "text-sm text-white/60", children: "Public media collection" })] }), _jsx(Link, { href: "/", children: _jsx("a", { className: "rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm transition hover:bg-white/10", children: "\u2190 Home" }) })] }) }), _jsxs("div", { className: "mx-auto max-w-7xl px-6 py-8", children: [_jsx("div", { className: "mb-6 flex gap-2", children: filters.map((f) => (_jsx("button", { onClick: () => setFilter(f.id), className: `rounded-full px-4 py-2 text-sm transition ${filter === f.id
                                ? "bg-dream-cyan text-black"
                                : "border border-white/10 bg-white/5 text-white/80 hover:bg-white/10"}`, children: f.label }, f.id))) }), isLoading ? (_jsx("div", { className: "py-12 text-center text-white/60", children: "Loading gallery..." })) : media.length === 0 ? (_jsx("div", { className: "py-12 text-center text-white/60", children: "No media found." })) : (_jsx("div", { className: "grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4", children: media.map((item) => (_jsxs("div", { onClick: () => setSelectedMedia(item), className: "group relative cursor-pointer overflow-hidden rounded-xl border border-white/10 bg-black/40 transition hover:border-dream-cyan/50", children: [_jsx("div", { className: "aspect-square w-full bg-gradient-to-br from-dream-cyan/20 to-dream-magenta/20", children: _jsx("img", { src: `${API_BASE}/api/media/thumb_320/${item.id}.jpg`, alt: item.title, className: "h-full w-full object-cover", onError: (e) => {
                                            e.target.style.display = "none";
                                        } }) }), _jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 transition group-hover:opacity-100", children: _jsxs("div", { className: "absolute bottom-0 left-0 right-0 p-4", children: [_jsx("p", { className: "mb-1 text-sm font-semibold text-white", children: item.title }), item.caption && _jsx("p", { className: "text-xs text-white/80 line-clamp-2", children: item.caption }), _jsxs("button", { onClick: (e) => {
                                                    e.stopPropagation();
                                                    shareLink(item.id);
                                                }, className: "mt-2 flex items-center gap-1 rounded-full bg-white/10 px-3 py-1 text-xs text-white transition hover:bg-white/20", children: [_jsx(Share2, { className: "w-3 h-3" }), "Share"] })] }) })] }, item.id))) }))] }), selectedMedia && (_jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm", children: _jsxs("div", { className: "relative w-full max-w-4xl rounded-2xl border border-white/10 bg-black/90 p-6 shadow-2xl", children: [_jsx("button", { onClick: () => setSelectedMedia(null), className: "absolute right-4 top-4 rounded-full p-2 text-white/60 transition hover:bg-white/10 hover:text-white", children: _jsx(X, { className: "w-5 h-5" }) }), _jsx("div", { className: "mb-4 aspect-video w-full overflow-hidden rounded-lg bg-gradient-to-br from-dream-cyan/20 to-dream-magenta/20", children: _jsx("img", { src: `${API_BASE}/api/media/web_1080/${selectedMedia.id}.jpg`, alt: selectedMedia.title, className: "h-full w-full object-contain" }) }), _jsx("h2", { className: "mb-2 text-2xl font-bold text-white", children: selectedMedia.title }), selectedMedia.caption && _jsx("p", { className: "mb-4 text-white/80", children: selectedMedia.caption }), selectedMedia.collections.length > 0 && (_jsx("div", { className: "mb-4 flex flex-wrap gap-2", children: selectedMedia.collections.map((col) => (_jsx("span", { className: "rounded-full bg-dream-cyan/20 px-3 py-1 text-xs text-dream-cyan", children: col }, col))) })), _jsxs("button", { onClick: () => shareLink(selectedMedia.id), className: "flex items-center gap-2 rounded-lg bg-dream-cyan px-4 py-2 text-black transition hover:bg-dream-cyan/90", children: [_jsx(Share2, { className: "w-4 h-4" }), "Share"] })] }) }))] }));
}
