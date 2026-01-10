import { useState, useEffect } from "react";
import { Heart, MessageCircle, Share2, Repeat2, TrendingUp, Filter, Sparkles, X } from "lucide-react";
import { ethers } from "ethers";
import { DreamContributionWidget } from '../../../components/DreamContributionWidget.js';

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000";

interface Dream {
  id: string;
  name: string;
  title?: string;
  creator: string;
  description?: string;
  tags?: string[];
  score?: number;
  views?: number;
  likes?: number;
  comments?: number;
  remixCount?: number;
  image?: string;
  status?: string;
  dreamCloud?: string;
  createdAt?: string;
  last_updated?: string;
}

export default function DreamSocialFeed() {
  const [dreams, setDreams] = useState<Dream[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "trending" | "recent" | "remixes">("all");
  const [selectedDream, setSelectedDream] = useState<Dream | null>(null);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [likedDreams, setLikedDreams] = useState<Set<string>>(new Set());
  const [commentText, setCommentText] = useState("");
  const [remixName, setRemixName] = useState("");
  const [remixDescription, setRemixDescription] = useState("");
  const [showRemixModal, setShowRemixModal] = useState(false);
  const [interacting, setInteracting] = useState<string | null>(null);

  useEffect(() => {
    fetchDreams();
  }, [filter]);

  // Connect wallet
  const connectWallet = async () => {
    if (typeof window === "undefined" || !window.ethereum) {
      alert("MetaMask not detected. Please install MetaMask.");
      return;
    }

    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      if (accounts.length > 0) {
        setWalletAddress(accounts[0]);
      }
    } catch (err) {
      console.error("Failed to connect wallet:", err);
    }
  };

  // Handle like
  const handleLike = async (dreamId: string) => {
    if (!walletAddress) {
      await connectWallet();
      return;
    }

    setInteracting(dreamId);
    try {
      const isLiked = likedDreams.has(dreamId);
      const endpoint = isLiked ? `/api/dreams/${dreamId}/unlike` : `/api/dreams/${dreamId}/like`;
      
      const res = await fetch(`${API_BASE}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": walletAddress,
        },
      });

      if (res.ok) {
        const data = await res.json();
        // Update local state
        setDreams((prev) =>
          prev.map((d) =>
            d.id === dreamId ? { ...d, likes: data.likes } : d
          )
        );
        
        // Update liked set
        if (isLiked) {
          setLikedDreams((prev) => {
            const next = new Set(prev);
            next.delete(dreamId);
            return next;
          });
        } else {
          setLikedDreams((prev) => new Set(prev).add(dreamId));
        }
      }
    } catch (err) {
      console.error("Failed to like dream:", err);
    } finally {
      setInteracting(null);
    }
  };

  // Handle comment
  const handleComment = async (dreamId: string) => {
    if (!walletAddress) {
      await connectWallet();
      return;
    }

    if (!commentText.trim()) {
      alert("Please enter a comment");
      return;
    }

    setInteracting(dreamId);
    try {
      const res = await fetch(`${API_BASE}/api/dreams/${dreamId}/comment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": walletAddress,
        },
        body: JSON.stringify({
          comment: commentText,
          userId: walletAddress,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setDreams((prev) =>
          prev.map((d) =>
            d.id === dreamId ? { ...d, comments: data.comments } : d
          )
        );
        setCommentText("");
        if (selectedDream?.id === dreamId) {
          setSelectedDream({ ...selectedDream, comments: data.comments });
        }
      }
    } catch (err) {
      console.error("Failed to comment:", err);
    } finally {
      setInteracting(null);
    }
  };

  // Handle remix
  const handleRemix = async (dreamId: string) => {
    if (!walletAddress) {
      await connectWallet();
      return;
    }

    if (!remixName.trim()) {
      alert("Please enter a name for your remix");
      return;
    }

    setInteracting(dreamId);
    try {
      const res = await fetch(`${API_BASE}/api/dreams/${dreamId}/remix`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": walletAddress,
        },
        body: JSON.stringify({
          name: remixName,
          description: remixDescription,
          userId: walletAddress,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setDreams((prev) =>
          prev.map((d) =>
            d.id === dreamId
              ? { ...d, remixCount: data.remixCount }
              : d
          )
        );
        setShowRemixModal(false);
        setRemixName("");
        setRemixDescription("");
        alert(`Remix created! Your new dream ID: ${data.remix.id}`);
      }
    } catch (err) {
      console.error("Failed to remix:", err);
    } finally {
      setInteracting(null);
    }
  };

  const fetchDreams = async () => {
    setLoading(true);
    try {
      // Try to fetch from dreams API
      const res = await fetch(`${API_BASE}/api/dreams?limit=50`);
      if (res.ok) {
        const data = await res.json();
        let fetchedDreams = Array.isArray(data) ? data : (data.dreams || []);
        
        // Apply filters
        if (filter === "trending") {
          fetchedDreams = fetchedDreams
            .sort((a, b) => (b.score || 0) - (a.score || 0))
            .slice(0, 20);
        } else if (filter === "recent") {
          fetchedDreams = fetchedDreams
            .sort((a, b) => {
              const aTime = new Date(a.last_updated || a.createdAt || 0).getTime();
              const bTime = new Date(b.last_updated || b.createdAt || 0).getTime();
              return bTime - aTime;
            })
            .slice(0, 20);
        } else if (filter === "remixes") {
          fetchedDreams = fetchedDreams
            .filter((d) => d.remixCount && d.remixCount > 0)
            .sort((a, b) => (b.remixCount || 0) - (a.remixCount || 0));
        }
        
        setDreams(fetchedDreams);
      } else {
        // Fallback to empty array if API fails
        setDreams([]);
      }
    } catch (err) {
      console.error("Failed to fetch dreams:", err);
      setDreams([]);
    } finally {
      setLoading(false);
    }
  };

  const formatAddress = (address: string) => {
    if (!address) return "Unknown";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "Recently";
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return "Today";
    if (days === 1) return "Yesterday";
    if (days < 7) return `${days} days ago`;
    if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#06060a] via-[#0a0a12] to-[#06060a] text-white">
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Sparkles className="h-8 w-8 text-purple-400" />
              <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
                Dream Social Feed
              </h1>
            </div>
            {!walletAddress ? (
              <button
                onClick={connectWallet}
                className="px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-lg font-bold text-white hover:shadow-[0_0_20px_rgba(6,182,212,0.5)] transition-all"
              >
                Connect Wallet
              </button>
            ) : (
              <div className="px-4 py-2 bg-gray-800/50 border border-cyan-500/30 rounded-lg">
                <span className="text-sm text-cyan-400 font-mono">
                  {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                </span>
              </div>
            )}
          </div>
          <p className="text-gray-400 text-lg">
            Browse, share, and remix dreams. Discover trending content and build your creative network.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-8">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-lg font-semibold transition-all ${
              filter === "all"
                ? "bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-[0_0_20px_rgba(6,182,212,0.5)]"
                : "bg-gray-800/50 text-gray-300 border border-gray-700 hover:border-cyan-500/50"
            }`}
          >
            All Dreams
          </button>
          <button
            onClick={() => setFilter("trending")}
            className={`px-4 py-2 rounded-lg font-semibold transition-all flex items-center gap-2 ${
              filter === "trending"
                ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-[0_0_20px_rgba(168,85,247,0.5)]"
                : "bg-gray-800/50 text-gray-300 border border-gray-700 hover:border-purple-500/50"
            }`}
          >
            <TrendingUp className="h-4 w-4" />
            Trending
          </button>
          <button
            onClick={() => setFilter("recent")}
            className={`px-4 py-2 rounded-lg font-semibold transition-all ${
              filter === "recent"
                ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-[0_0_20px_rgba(59,130,246,0.5)]"
                : "bg-gray-800/50 text-gray-300 border border-gray-700 hover:border-blue-500/50"
            }`}
          >
            Recent
          </button>
          <button
            onClick={() => setFilter("remixes")}
            className={`px-4 py-2 rounded-lg font-semibold transition-all flex items-center gap-2 ${
              filter === "remixes"
                ? "bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-[0_0_20px_rgba(236,72,153,0.5)]"
                : "bg-gray-800/50 text-gray-300 border border-gray-700 hover:border-pink-500/50"
            }`}
          >
            <Repeat2 className="h-4 w-4" />
            Remixes
          </button>
        </div>

        {/* Feed */}
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-cyan-500 border-t-transparent mb-4" />
            <p className="text-gray-400">Loading dreams...</p>
          </div>
        ) : dreams.length === 0 ? (
          <div className="text-center py-20 bg-gray-900/50 rounded-2xl border border-gray-800">
            <Sparkles className="h-16 w-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-2">No Dreams Yet</h3>
            <p className="text-gray-400 mb-6">
              Be the first to plant a dream and watch it grow!
            </p>
            <a
              href="/dreamscope"
              className="inline-block px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg font-bold hover:shadow-[0_0_30px_rgba(168,85,247,0.5)] transition-all"
            >
              Create Your First Dream
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dreams.map((dream) => (
              <div
                key={dream.id}
                onClick={() => setSelectedDream(dream)}
                className="group relative bg-gradient-to-br from-gray-900/80 to-gray-800/60 rounded-2xl border-2 border-gray-700/50 hover:border-cyan-500/50 overflow-hidden transition-all hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(6,182,212,0.3)] cursor-pointer"
              >
                {/* Image */}
                {dream.image ? (
                  <div className="aspect-video w-full bg-gradient-to-br from-cyan-900/30 to-purple-900/30 overflow-hidden">
                    <img
                      src={dream.image}
                      alt={dream.name || dream.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
                  </div>
                ) : (
                  <div className="aspect-video w-full bg-gradient-to-br from-cyan-900/30 via-purple-900/30 to-pink-900/30 flex items-center justify-center">
                    <Sparkles className="h-16 w-16 text-cyan-400/30" />
                  </div>
                )}

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-xl font-black text-white group-hover:text-cyan-400 transition-colors line-clamp-2">
                      {dream.name || dream.title || "Untitled Dream"}
                    </h3>
                    {dream.score && (
                      <span className="px-2 py-1 bg-cyan-500/20 border border-cyan-500/30 rounded text-xs font-bold text-cyan-400 whitespace-nowrap ml-2">
                        {dream.score}
                      </span>
                    )}
                  </div>

                  {dream.description && (
                    <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                      {dream.description}
                    </p>
                  )}

                  {/* Tags */}
                  {dream.tags && dream.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {dream.tags.slice(0, 3).map((tag, i) => (
                        <span
                          key={i}
                          className="px-2 py-1 bg-purple-500/10 border border-purple-500/20 rounded text-xs text-purple-300"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Stats */}
                  <div className="flex items-center gap-4 text-sm text-gray-400 mb-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleLike(dream.id);
                      }}
                      disabled={interacting === dream.id}
                      className={`flex items-center gap-1 transition-colors ${
                        likedDreams.has(dream.id)
                          ? "text-pink-400 hover:text-pink-300"
                          : "hover:text-pink-400"
                      } ${interacting === dream.id ? "opacity-50" : ""}`}
                    >
                      <Heart
                        className={`h-4 w-4 ${
                          likedDreams.has(dream.id) ? "fill-current" : ""
                        }`}
                      />
                      <span>{dream.likes || 0}</span>
                    </button>
                    <div className="flex items-center gap-1">
                      <MessageCircle className="h-4 w-4" />
                      <span>{dream.comments || 0}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Repeat2 className="h-4 w-4" />
                      <span>{dream.remixCount || 0}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <TrendingUp className="h-4 w-4" />
                      <span>{dream.views || 0}</span>
                    </div>
                  </div>

                  {/* Creator & Date */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-700/50">
                    <div className="text-xs text-gray-500">
                      by <span className="text-cyan-400 font-mono">{formatAddress(dream.creator)}</span>
                    </div>
                    <div className="text-xs text-gray-500">
                      {formatDate(dream.last_updated || dream.createdAt)}
                    </div>
                  </div>
                </div>

                {/* Hover gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/0 to-purple-500/0 group-hover:from-cyan-500/5 group-hover:to-purple-500/5 transition-all pointer-events-none" />
              </div>
            ))}
          </div>
        )}

        {/* Dream Detail Modal */}
        {selectedDream && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-6"
            onClick={() => setSelectedDream(null)}
          >
            <div
              className="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl border-2 border-cyan-500/30 max-w-3xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                onClick={() => setSelectedDream(null)}
                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X className="h-6 w-6" />
              </button>

              {/* Dream content */}
              <div className="p-8">
                {selectedDream.image && (
                  <div className="aspect-video w-full bg-gradient-to-br from-cyan-900/30 to-purple-900/30 rounded-xl overflow-hidden mb-6">
                    <img
                      src={selectedDream.image}
                      alt={selectedDream.name || selectedDream.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                <div className="flex items-start justify-between mb-4">
                  <h2 className="text-3xl font-black text-white">
                    {selectedDream.name || selectedDream.title || "Untitled Dream"}
                  </h2>
                  {selectedDream.score && (
                    <span className="px-3 py-1 bg-cyan-500/20 border border-cyan-500/30 rounded-lg text-sm font-bold text-cyan-400">
                      Score: {selectedDream.score}
                    </span>
                  )}
                </div>

                {selectedDream.description && (
                  <p className="text-gray-300 text-lg mb-6 leading-relaxed">
                    {selectedDream.description}
                  </p>
                )}

                {selectedDream.tags && selectedDream.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-6">
                    {selectedDream.tags.map((tag, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 bg-purple-500/10 border border-purple-500/20 rounded-lg text-sm text-purple-300"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Actions */}
                <div className="space-y-4 pt-6 border-t border-gray-700">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => handleLike(selectedDream.id)}
                      disabled={interacting === selectedDream.id}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                        likedDreams.has(selectedDream.id)
                          ? "bg-pink-500/20 text-pink-400 border border-pink-500/30 hover:bg-pink-500/30"
                          : "bg-gray-800 hover:bg-gray-700 text-gray-300"
                      } ${interacting === selectedDream.id ? "opacity-50" : ""}`}
                    >
                      <Heart
                        className={`h-5 w-5 ${
                          likedDreams.has(selectedDream.id) ? "fill-current" : ""
                        }`}
                      />
                      <span>Like</span>
                    </button>
                    <button
                      onClick={() => {
                        const textarea = document.getElementById("comment-textarea");
                        textarea?.focus();
                      }}
                      className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors text-gray-300"
                    >
                      <MessageCircle className="h-5 w-5" />
                      <span>Comment</span>
                    </button>
                    <button
                      onClick={() => setShowRemixModal(true)}
                      className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors text-gray-300"
                    >
                      <Repeat2 className="h-5 w-5" />
                      <span>Remix</span>
                    </button>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(
                          `${window.location.origin}/miniapps/social?dream=${selectedDream.id}`
                        );
                        alert("Link copied to clipboard!");
                      }}
                      className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors text-gray-300"
                    >
                      <Share2 className="h-5 w-5" />
                      <span>Share</span>
                    </button>
                  </div>

                  {/* Comment Input */}
                  <div className="space-y-2">
                    <textarea
                      id="comment-textarea"
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      placeholder="Write a comment..."
                      rows={3}
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-cyan-500 focus:outline-none resize-none"
                    />
                    <button
                      onClick={() => handleComment(selectedDream.id)}
                      disabled={!commentText.trim() || interacting === selectedDream.id}
                      className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-semibold text-white transition-colors"
                    >
                      {interacting === selectedDream.id ? "Posting..." : "Post Comment"}
                    </button>
                  </div>
                </div>

                {/* Contribution Widget - Embedded! */}
                <div className="mt-6 pt-6 border-t border-gray-700">
                  <DreamContributionWidget
                    dreamId={selectedDream.id}
                    dreamName={selectedDream.name || selectedDream.title || "Dream"}
                    dreamCreator={selectedDream.creator}
                    walletAddress={walletAddress}
                    onContribute={() => {
                      // Refresh dream data after contribution
                      fetchDreams();
                    }}
                    compact={false}
                  />
                </div>

                {/* Metadata */}
                <div className="mt-6 pt-6 border-t border-gray-700 text-sm text-gray-400">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-gray-500">Creator:</span>
                      <span className="ml-2 text-cyan-400 font-mono">{formatAddress(selectedDream.creator)}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Created:</span>
                      <span className="ml-2">{formatDate(selectedDream.createdAt)}</span>
                    </div>
                    {selectedDream.dreamCloud && (
                      <div>
                        <span className="text-gray-500">Cloud:</span>
                        <span className="ml-2 text-purple-400 capitalize">{selectedDream.dreamCloud}</span>
                      </div>
                    )}
                    <div>
                      <span className="text-gray-500">Status:</span>
                      <span className="ml-2 text-emerald-400 capitalize">{selectedDream.status || "Live"}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Remix Modal */}
        {showRemixModal && selectedDream && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-6"
            onClick={() => setShowRemixModal(false)}
          >
            <div
              className="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl border-2 border-purple-500/30 max-w-lg w-full p-8"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setShowRemixModal(false)}
                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X className="h-6 w-6" />
              </button>

              <h3 className="text-2xl font-black mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Remix Dream
              </h3>
              <p className="text-gray-400 mb-6">
                Create your own version of "{selectedDream.name || selectedDream.title}"
              </p>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Remix Name *</label>
                  <input
                    type="text"
                    value={remixName}
                    onChange={(e) => setRemixName(e.target.value)}
                    placeholder="e.g., Enhanced Dream Vision"
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-purple-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Description</label>
                  <textarea
                    value={remixDescription}
                    onChange={(e) => setRemixDescription(e.target.value)}
                    placeholder="Describe your remix..."
                    rows={4}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-purple-500 focus:outline-none resize-none"
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => handleRemix(selectedDream.id)}
                    disabled={!remixName.trim() || interacting === selectedDream.id}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg font-bold text-white hover:shadow-[0_0_30px_rgba(168,85,247,0.5)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {interacting === selectedDream.id ? "Creating..." : "Create Remix"}
                  </button>
                  <button
                    onClick={() => setShowRemixModal(false)}
                    className="px-6 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg font-semibold text-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Declare window.ethereum for TypeScript
declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: any[] }) => Promise<any>;
    };
  }
}


