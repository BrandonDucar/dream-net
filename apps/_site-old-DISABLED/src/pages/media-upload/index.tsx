import { useState, useRef } from "react";
import { Upload, Link, Video, Music, Image, X, CheckCircle, Loader2, Sparkles } from "lucide-react";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000";

type MediaSource = "grok" | "sora" | "camera" | "other";
type MediaRights = "owned" | "licensed" | "unknown";
type MediaRating = "A" | "B" | "C";

interface UploadItem {
  id: string;
  file?: File;
  url?: string;
  title: string;
  source: MediaSource;
  tags: string[];
  collections: string[];
  prompt?: string;
  model?: string;
  rights: MediaRights;
  rating: MediaRating;
  status: "pending" | "uploading" | "success" | "error";
  error?: string;
  assetId?: string;
}

export default function MediaUpload() {
  const [uploads, setUploads] = useState<UploadItem[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);

  // Connect wallet (for rewards)
  const connectWallet = async () => {
    if (typeof window === "undefined" || !window.ethereum) {
      alert("MetaMask not detected. Please install MetaMask.");
      return;
    }
    try {
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      if (accounts.length > 0) {
        setWalletAddress(accounts[0]);
      }
    } catch (err) {
      console.error("Failed to connect wallet:", err);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(Array.from(e.target.files));
    }
  };

  const handleFiles = (files: File[]) => {
    const newUploads: UploadItem[] = files.map((file) => ({
      id: `${Date.now()}-${Math.random()}`,
      file,
      title: file.name.replace(/\.[^/.]+$/, ""), // Remove extension
      source: "other" as MediaSource,
      tags: [],
      collections: ["dreamnet", "seed"],
      rights: "owned" as MediaRights,
      rating: "C" as MediaRating,
      status: "pending" as const,
    }));
    setUploads((prev) => [...prev, ...newUploads]);
  };

  const addUrlUpload = () => {
    const url = prompt("Enter media URL (YouTube, direct link, etc.):");
    if (url) {
      const newUpload: UploadItem = {
        id: `${Date.now()}-${Math.random()}`,
        url,
        title: new URL(url).pathname.split("/").pop() || "Media from URL",
        source: "other" as MediaSource,
        tags: [],
        collections: ["dreamnet", "seed"],
        rights: "licensed" as MediaRights,
        rating: "C" as MediaRating,
        status: "pending" as const,
      };
      setUploads((prev) => [...prev, newUpload]);
    }
  };

  const updateUpload = (id: string, updates: Partial<UploadItem>) => {
    setUploads((prev) => prev.map((u) => (u.id === id ? { ...u, ...updates } : u)));
  };

  const removeUpload = (id: string) => {
    setUploads((prev) => prev.filter((u) => u.id !== id));
  };

  const uploadItem = async (item: UploadItem) => {
    updateUpload(item.id, { status: "uploading" });

    try {
      const formData = new FormData();
      
      if (item.file) {
        formData.append("file", item.file);
      } else if (item.url) {
        formData.append("url", item.url);
      }

      formData.append("source", item.source);
      formData.append("title", item.title);
      formData.append("tags", JSON.stringify(item.tags));
      formData.append("collections", JSON.stringify(item.collections));
      if (item.prompt) formData.append("prompt", item.prompt);
      if (item.model) formData.append("model", item.model);
      formData.append("rights", item.rights);
      formData.append("rating", item.rating);

      const headers: HeadersInit = {};
      if (walletAddress) {
        headers["x-user-id"] = walletAddress;
      }

      const res = await fetch(`${API_BASE}/api/media/ingest`, {
        method: "POST",
        headers,
        body: formData,
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Upload failed");
      }

      const data = await res.json();
      updateUpload(item.id, { status: "success", assetId: data.asset?.id });
    } catch (error) {
      updateUpload(item.id, {
        status: "error",
        error: (error as Error).message,
      });
    }
  };

  const uploadAll = async () => {
    const pending = uploads.filter((u) => u.status === "pending");
    for (const item of pending) {
      await uploadItem(item);
      // Small delay between uploads to avoid rate limiting
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
  };

  const addTag = (id: string, tag: string) => {
    const upload = uploads.find((u) => u.id === id);
    if (upload && !upload.tags.includes(tag)) {
      updateUpload(id, { tags: [...upload.tags, tag] });
    }
  };

  const removeTag = (id: string, tag: string) => {
    const upload = uploads.find((u) => u.id === id);
    if (upload) {
      updateUpload(id, { tags: upload.tags.filter((t) => t !== tag) });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#06060a] via-[#0a0a12] to-[#06060a] text-white p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sparkles className="h-8 w-8 text-purple-400" />
            <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
              Media Vault Upload
            </h1>
          </div>
          <p className="text-gray-400 text-lg">
            Upload your Grok, Sora, YouTube music, and other media to seed DreamNet
          </p>
        </div>

        {/* Wallet Connection */}
        {!walletAddress && (
          <div className="bg-gray-900/50 rounded-xl border border-white/10 p-6 mb-6 text-center">
            <p className="text-gray-400 mb-4">Connect your wallet to earn DREAM rewards for uploads</p>
            <button
              onClick={connectWallet}
              className="px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-lg font-semibold hover:shadow-[0_0_20px_rgba(6,182,212,0.5)] transition-all"
            >
              Connect Wallet
            </button>
          </div>
        )}

        {/* Upload Area */}
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-2xl p-12 text-center mb-6 transition-all ${
            dragActive
              ? "border-cyan-500 bg-cyan-500/10"
              : "border-gray-700 bg-gray-900/30 hover:border-gray-600"
          }`}
        >
          <Upload className="h-16 w-16 mx-auto mb-4 text-gray-400" />
          <h3 className="text-2xl font-bold mb-2">Drop files here or click to browse</h3>
          <p className="text-gray-400 mb-6">Supports images, videos, and audio files (max 50MB each)</p>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg font-semibold hover:shadow-[0_0_20px_rgba(168,85,247,0.5)] transition-all"
            >
              <Upload className="inline-block h-5 w-5 mr-2" />
              Select Files
            </button>
            <button
              onClick={addUrlUpload}
              className="px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-lg font-semibold hover:shadow-[0_0_20px_rgba(6,182,212,0.5)] transition-all"
            >
              <Link className="inline-block h-5 w-5 mr-2" />
              Add URL
            </button>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*,video/*,audio/*"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>

        {/* Quick Actions */}
        {uploads.length > 0 && (
          <div className="flex flex-wrap gap-3 mb-6">
            <button
              onClick={uploadAll}
              disabled={uploads.filter((u) => u.status === "pending").length === 0}
              className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-lg font-semibold hover:shadow-[0_0_20px_rgba(16,185,129,0.5)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Upload All ({uploads.filter((u) => u.status === "pending").length} pending)
            </button>
            <button
              onClick={() => setUploads([])}
              className="px-6 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg font-semibold transition"
            >
              Clear All
            </button>
          </div>
        )}

        {/* Upload List */}
        <div className="space-y-4">
          {uploads.map((item) => (
            <div
              key={item.id}
              className="bg-gray-900/50 rounded-xl border border-white/10 p-6 hover:border-purple-500/50 transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    {item.file?.type.startsWith("video/") ? (
                      <Video className="h-5 w-5 text-purple-400" />
                    ) : item.file?.type.startsWith("audio/") || item.url?.includes("youtube") ? (
                      <Music className="h-5 w-5 text-pink-400" />
                    ) : (
                      <Image className="h-5 w-5 text-cyan-400" />
                    )}
                    <h3 className="text-lg font-bold">{item.title}</h3>
                    {item.status === "success" && (
                      <CheckCircle className="h-5 w-5 text-emerald-400" />
                    )}
                    {item.status === "uploading" && (
                      <Loader2 className="h-5 w-5 text-blue-400 animate-spin" />
                    )}
                    {item.status === "error" && (
                      <X className="h-5 w-5 text-red-400" />
                    )}
                  </div>
                  {item.file && (
                    <p className="text-sm text-gray-400">
                      {(item.file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  )}
                  {item.url && (
                    <p className="text-sm text-gray-400 break-all">{item.url}</p>
                  )}
                  {item.error && (
                    <p className="text-sm text-red-400 mt-2">{item.error}</p>
                  )}
                </div>
                {item.status !== "uploading" && (
                  <button
                    onClick={() => removeUpload(item.id)}
                    className="p-2 text-gray-400 hover:text-red-400 transition"
                  >
                    <X className="h-5 w-5" />
                  </button>
                )}
              </div>

              {/* Metadata Form */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Title</label>
                  <input
                    type="text"
                    value={item.title}
                    onChange={(e) => updateUpload(item.id, { title: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-purple-500 focus:outline-none"
                    disabled={item.status === "uploading"}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Source</label>
                  <select
                    value={item.source}
                    onChange={(e) => updateUpload(item.id, { source: e.target.value as MediaSource })}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-purple-500 focus:outline-none"
                    disabled={item.status === "uploading"}
                  >
                    <option value="grok">Grok</option>
                    <option value="sora">Sora</option>
                    <option value="camera">Camera</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Prompt (optional)</label>
                  <input
                    type="text"
                    value={item.prompt || ""}
                    onChange={(e) => updateUpload(item.id, { prompt: e.target.value })}
                    placeholder="AI generation prompt..."
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-purple-500 focus:outline-none"
                    disabled={item.status === "uploading"}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Model (optional)</label>
                  <input
                    type="text"
                    value={item.model || ""}
                    onChange={(e) => updateUpload(item.id, { model: e.target.value })}
                    placeholder="e.g., grok-2, sora-v1"
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-purple-500 focus:outline-none"
                    disabled={item.status === "uploading"}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Rights</label>
                  <select
                    value={item.rights}
                    onChange={(e) => updateUpload(item.id, { rights: e.target.value as MediaRights })}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-purple-500 focus:outline-none"
                    disabled={item.status === "uploading"}
                  >
                    <option value="owned">Owned</option>
                    <option value="licensed">Licensed</option>
                    <option value="unknown">Unknown</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Rating</label>
                  <select
                    value={item.rating}
                    onChange={(e) => updateUpload(item.id, { rating: e.target.value as MediaRating })}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-purple-500 focus:outline-none"
                    disabled={item.status === "uploading"}
                  >
                    <option value="A">A - Premium</option>
                    <option value="B">B - Standard</option>
                    <option value="C">C - Basic</option>
                  </select>
                </div>
              </div>

              {/* Tags */}
              <div className="mb-4">
                <label className="block text-sm font-semibold mb-2">Tags</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {item.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-purple-500/20 border border-purple-500/30 rounded-lg text-sm flex items-center gap-2"
                    >
                      {tag}
                      <button
                        onClick={() => removeTag(item.id, tag)}
                        className="text-purple-300 hover:text-red-400"
                        disabled={item.status === "uploading"}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <input
                  type="text"
                  placeholder="Add tag and press Enter"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && e.currentTarget.value.trim()) {
                      addTag(item.id, e.currentTarget.value.trim());
                      e.currentTarget.value = "";
                    }
                  }}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-purple-500 focus:outline-none"
                  disabled={item.status === "uploading"}
                />
              </div>

              {/* Collections */}
              <div className="mb-4">
                <label className="block text-sm font-semibold mb-2">Collections</label>
                <div className="flex flex-wrap gap-2">
                  {["dreamnet", "seed", "ecosystem", "agents", "starbridge"].map((collection) => (
                    <button
                      key={collection}
                      onClick={() => {
                        const collections = item.collections.includes(collection)
                          ? item.collections.filter((c) => c !== collection)
                          : [...item.collections, collection];
                        updateUpload(item.id, { collections });
                      }}
                      className={`px-3 py-1 rounded-lg text-sm transition ${
                        item.collections.includes(collection)
                          ? "bg-cyan-500/20 border border-cyan-500/30 text-cyan-300"
                          : "bg-gray-800 border border-gray-700 text-gray-400 hover:border-gray-600"
                      }`}
                      disabled={item.status === "uploading"}
                    >
                      {collection}
                    </button>
                  ))}
                </div>
              </div>

              {/* Upload Button */}
              {item.status === "pending" && (
                <button
                  onClick={() => uploadItem(item)}
                  className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg font-semibold hover:shadow-[0_0_20px_rgba(168,85,247,0.5)] transition-all"
                >
                  Upload Now
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Empty State */}
        {uploads.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <p>No files queued. Drop files above or add a URL to get started.</p>
          </div>
        )}
      </div>
    </div>
  );
}

declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: any[] }) => Promise<any>;
    };
  }
}

