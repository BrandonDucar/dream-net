export type MediaType = "image" | "video";
export type MediaSource = "grok" | "sora" | "camera" | "other";
export type MediaRights = "owned" | "licensed" | "unknown";
export type MediaRating = "A" | "B" | "C";
export type PostPlatform = "x" | "base" | "ig";
export type PostStatus = "draft" | "scheduled" | "posted" | "failed";

export interface MediaAsset {
  id: string;
  type: MediaType;
  title: string;
  source: MediaSource;
  file_path: string;
  hash: string;
  width: number;
  height: number;
  duration_ms: number;
  size_bytes: number;
  created_at: string;
  tags: string[];
  entities: string[];
  credits: {
    prompt?: string;
    model?: string;
  };
  caption: string;
  rights: MediaRights;
  rating: MediaRating;
  collections: string[];
  usage: {
    posts: number;
    downloads: number;
    last_used_at: string | null;
  };
}

export interface PostQueueItem {
  id: string;
  media_id: string;
  platform: PostPlatform;
  status: PostStatus;
  scheduled_at: string | null;
  caption: string;
  hashtags: string[];
  post_url: string | null;
  engagement: {
    likes?: number;
    reposts?: number;
    views?: number;
  } | null;
  created_at: string;
  updated_at: string;
}

export interface IngestOptions {
  file?: Buffer;
  url?: string;
  source: MediaSource;
  title?: string;
  tags?: string[];
  collections?: string[];
  prompt?: string;
  model?: string;
  rights?: MediaRights;
  rating?: MediaRating;
}

export interface SearchFilters {
  q?: string;
  tags?: string[];
  type?: MediaType;
  source?: MediaSource;
  collections?: string[];
  rating?: MediaRating;
  date_from?: string;
  date_to?: string;
}

