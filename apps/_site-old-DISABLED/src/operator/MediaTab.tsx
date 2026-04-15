import React, { useState, useEffect } from "react";

const API_BASE = import.meta.env.VITE_API_URL ?? "";

interface MediaAsset {
  id: string;
  type: "image" | "video";
  title: string;
  source: string;
  tags: string[];
  collections: string[];
  caption: string;
  created_at: string;
  file_path: string;
  width: number;
  height: number;
}

interface PostQueueItem {
  id: string;
  media_id: string;
  platform: "x" | "base" | "ig";
  status: "draft" | "scheduled" | "posted" | "failed";
  scheduled_at: string | null;
  caption: string;
  hashtags: string[];
}

const sectionClass = "rounded-3xl border border-white/10 bg-black/40 p-5 shadow-[0_20px_40px_rgba(0,0,0,0.35)] backdrop-blur";

export function MediaTab() {
  const [media, setMedia] = useState<MediaAsset[]>([]);
  const [selectedMedia, setSelectedMedia] = useState<MediaAsset | null>(null);
  const [queueItems, setQueueItems] = useState<PostQueueItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<{ type?: string; collection?: string }>({});
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchMedia();
    fetchQueue();
  }, [searchQuery, filter]);

  async function fetchMedia() {
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.set("q", searchQuery);
      if (filter.type) params.set("type", filter.type);
      if (filter.collection) params.set("collections", filter.collection);
      
      const res = await fetch(`${API_BASE}/api/media/search?${params}`);
      const data = await res.json();
      if (data.ok) {
        setMedia(data.results || []);
      }
    } catch (err) {
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
    } catch (err) {
      console.error("Failed to fetch queue:", err);
    }
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

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
    } catch (err) {
      console.error("Upload failed:", err);
    } finally {
      setUploading(false);
    }
  }

  async function addToQueue(mediaId: string, platform: "x" | "base" | "ig", caption?: string, hashtags?: string[]) {
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
    } catch (err) {
      console.error("Failed to add to queue:", err);
    }
  }

  const quickFilters = [
    { label: "Goldstorm", collection: "campaign:goldstorm" },
    { label: "Labubu", collection: "series:labubu-cartel" },
    { label: "Coins", tags: ["coins", "bullion"] },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-white">Media Vault</h2>
          <p className="text-sm text-white/60">Upload, tag, and queue media for posting</p>
        </div>
        <label className="rounded-full bg-white/10 px-4 py-2 text-sm text-white/80 transition hover:bg-white/20 cursor-pointer">
          {uploading ? "Uploading..." : "Upload Media"}
          <input type="file" className="hidden" onChange={handleUpload} accept="image/*,video/*" />
        </label>
      </div>

      {/* Search & Filters */}
      <div className="flex gap-4">
        <input
          type="text"
          placeholder="Search media..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 rounded-xl border border-white/10 bg-black/40 px-4 py-2 text-white placeholder:text-white/40"
        />
        <select
          value={filter.type || ""}
          onChange={(e) => setFilter({ ...filter, type: e.target.value || undefined })}
          className="rounded-xl border border-white/10 bg-black/40 px-4 py-2 text-white"
        >
          <option value="">All Types</option>
          <option value="image">Images</option>
          <option value="video">Videos</option>
        </select>
      </div>

      {/* Quick Filters */}
      <div className="flex gap-2">
        {quickFilters.map((qf) => (
          <button
            key={qf.label}
            onClick={() => setFilter({ collection: qf.collection })}
            className="rounded-full border border-white/15 px-4 py-2 text-sm text-white/60 transition hover:text-white"
          >
            {qf.label}
          </button>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Media Grid */}
        <section className={`${sectionClass} lg:col-span-2`}>
          <h3 className="text-lg font-semibold text-white mb-4">Media Library</h3>
          <div className="grid grid-cols-3 gap-4">
            {media.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedMedia(item)}
                className="relative aspect-square rounded-xl border border-white/10 bg-black/40 overflow-hidden cursor-pointer hover:border-white/30 transition"
              >
                {item.type === "image" ? (
                  <img
                    src={`${API_BASE}/media/thumb_320/${item.id}.jpg`}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white/60">
                    <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                    </svg>
                  </div>
                )}
                <div className="absolute bottom-0 left-0 right-0 bg-black/80 p-2">
                  <p className="text-xs text-white truncate">{item.title}</p>
                  <p className="text-[10px] text-white/60">{item.source}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Detail Drawer / Post Queue */}
        <div className="space-y-6">
          {selectedMedia ? (
            <section className={sectionClass}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Media Details</h3>
                <button
                  onClick={() => setSelectedMedia(null)}
                  className="text-white/60 hover:text-white"
                >
                  ✕
                </button>
              </div>
              <div className="space-y-4">
                <img
                  src={`${API_BASE}/media/web_1080/${selectedMedia.id}.jpg`}
                  alt={selectedMedia.title}
                  className="w-full rounded-xl"
                />
                <div>
                  <p className="text-sm font-semibold text-white">{selectedMedia.title}</p>
                  <p className="text-xs text-white/60 mt-1">{selectedMedia.caption}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedMedia.tags.map((tag) => (
                    <span key={tag} className="rounded-full bg-white/10 px-2 py-1 text-xs text-white/80">
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="space-y-2">
                  <p className="text-xs uppercase tracking-[0.2em] text-white/40">Add to Queue</p>
                  <div className="flex gap-2">
                    {(["x", "base", "ig"] as const).map((platform) => (
                      <button
                        key={platform}
                        onClick={() => addToQueue(selectedMedia.id, platform, selectedMedia.caption)}
                        className="flex-1 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/80 transition hover:bg-white/10"
                      >
                        {platform.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          ) : null}

          {/* Post Queue Widget */}
          <section className={sectionClass}>
            <h3 className="text-lg font-semibold text-white mb-4">Post Queue</h3>
            <div className="space-y-3">
              {queueItems.slice(0, 5).map((item) => (
                <div key={item.id} className="rounded-xl border border-white/10 bg-black/40 p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs uppercase tracking-[0.2em] text-white/60">{item.platform}</span>
                    <span className={`text-xs ${
                      item.status === "posted" ? "text-green-400" :
                      item.status === "scheduled" ? "text-amber-400" :
                      item.status === "failed" ? "text-red-400" :
                      "text-white/60"
                    }`}>
                      {item.status}
                    </span>
                  </div>
                  <p className="text-sm text-white/80 mt-2 truncate">{item.caption}</p>
                  {item.scheduled_at && (
                    <p className="text-xs text-white/60 mt-1">
                      {new Date(item.scheduled_at).toLocaleString()}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

