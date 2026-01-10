// Import db from server
import { db } from "../../../server/db";
import { mediaAssets, postQueue } from '@dreamnet/shared';
import { eq, and, or, ilike, sql, gte, lte, inArray } from "drizzle-orm";
import type { MediaAsset, PostQueueItem, SearchFilters } from "./types";
import { randomUUID } from "node:crypto";

export async function getMediaById(id: string): Promise<MediaAsset | null> {
  const result = await db.select().from(mediaAssets).where(eq(mediaAssets.id, id)).limit(1);
  if (result.length === 0) return null;
  return mapMediaRecord(result[0]);
}

export async function getMediaByHash(hash: string): Promise<MediaAsset | null> {
  const result = await db.select().from(mediaAssets).where(eq(mediaAssets.hash, hash)).limit(1);
  if (result.length === 0) return null;
  return mapMediaRecord(result[0]);
}

export async function createMediaAsset(data: Omit<MediaAsset, "id" | "created_at">): Promise<MediaAsset> {
  const id = randomUUID();
  const [result] = await db
    .insert(mediaAssets)
    .values({
      id,
      type: data.type,
      title: data.title,
      source: data.source,
      file_path: data.file_path,
      hash: data.hash,
      width: data.width,
      height: data.height,
      duration_ms: data.duration_ms,
      size_bytes: data.size_bytes,
      tags: data.tags,
      entities: data.entities,
      credits: data.credits,
      caption: data.caption,
      rights: data.rights,
      rating: data.rating,
      collections: data.collections,
      usage: data.usage,
    })
    .returning();
  return mapMediaRecord(result);
}

export async function updateMediaAsset(id: string, updates: Partial<MediaAsset>): Promise<MediaAsset | null> {
  const [result] = await db
    .update(mediaAssets)
    .set({
      ...updates,
      // Don't update id or created_at
      id: undefined,
      created_at: undefined,
    } as any)
    .where(eq(mediaAssets.id, id))
    .returning();
  if (!result) return null;
  return mapMediaRecord(result);
}

export async function incrementMediaUsage(id: string): Promise<void> {
  await db
    .update(mediaAssets)
    .set({
      usage: sql`jsonb_set(
        jsonb_set(
          COALESCE(usage, '{"posts": 0, "downloads": 0, "last_used_at": null}'::jsonb),
          '{posts}',
          ((COALESCE(usage->>'posts', '0')::int + 1)::text)::jsonb
        ),
        '{last_used_at}',
        to_jsonb(now())
      )`,
    })
    .where(eq(mediaAssets.id, id));
}

export async function searchMedia(filters: SearchFilters, limit = 50, offset = 0): Promise<MediaAsset[]> {
  let query = db.select().from(mediaAssets);

  const conditions: any[] = [];

  // Full-text search on title, caption, tags, entities
  if (filters.q) {
    const searchTerm = `%${filters.q}%`;
    conditions.push(
      or(
        ilike(mediaAssets.title, searchTerm),
        ilike(mediaAssets.caption, searchTerm),
        sql`${mediaAssets.tags}::text ILIKE ${searchTerm}`,
        sql`${mediaAssets.entities}::text ILIKE ${searchTerm}`,
      )!,
    );
  }

  // Filters
  if (filters.type) {
    conditions.push(eq(mediaAssets.type, filters.type));
  }
  if (filters.source) {
    conditions.push(eq(mediaAssets.source, filters.source));
  }
  if (filters.rating) {
    conditions.push(eq(mediaAssets.rating, filters.rating));
  }
  if (filters.tags && filters.tags.length > 0) {
    conditions.push(sql`${mediaAssets.tags} && ${filters.tags}`);
  }
  if (filters.collections && filters.collections.length > 0) {
    conditions.push(sql`${mediaAssets.collections} && ${filters.collections}`);
  }
  if (filters.date_from) {
    conditions.push(gte(mediaAssets.created_at, new Date(filters.date_from)));
  }
  if (filters.date_to) {
    conditions.push(lte(mediaAssets.created_at, new Date(filters.date_to)));
  }

  if (conditions.length > 0) {
    query = query.where(and(...conditions)) as any;
  }

  const results = await query.limit(limit).offset(offset).orderBy(sql`${mediaAssets.created_at} DESC`);
  return results.map(mapMediaRecord);
}

export async function getPublicMedia(collection?: string, limit = 100, offset = 0): Promise<MediaAsset[]> {
  let query = db.select().from(mediaAssets);
  
  const conditions: any[] = [];
  
  // Filter by collection if provided
  if (collection && collection !== "all") {
    conditions.push(sql`${mediaAssets.collections} && ARRAY[${collection}]::text[]`);
  }
  
  // Only return media with public collections or specific public flag
  // For now, we'll use collections as the public indicator
  // You can add a public flag to the schema later if needed
  
  if (conditions.length > 0) {
    query = query.where(and(...conditions)) as any;
  }
  
  const results = await query.limit(limit).offset(offset).orderBy(sql`${mediaAssets.created_at} DESC`);
  return results.map(mapMediaRecord);
}

function mapMediaRecord(row: any): MediaAsset {
  return {
    id: row.id,
    type: row.type as MediaAsset["type"],
    title: row.title,
    source: row.source as MediaAsset["source"],
    file_path: row.file_path,
    hash: row.hash,
    width: row.width ?? 0,
    height: row.height ?? 0,
    duration_ms: row.duration_ms ?? 0,
    size_bytes: row.size_bytes ?? 0,
    created_at: row.created_at?.toISOString() ?? new Date().toISOString(),
    tags: row.tags ?? [],
    entities: row.entities ?? [],
    credits: (row.credits as any) ?? {},
    caption: row.caption ?? "",
    rights: (row.rights as MediaAsset["rights"]) ?? "unknown",
    rating: (row.rating as MediaAsset["rating"]) ?? "C",
    collections: row.collections ?? [],
    usage: {
      posts: (row.usage as any)?.posts ?? 0,
      downloads: (row.usage as any)?.downloads ?? 0,
      last_used_at: (row.usage as any)?.last_used_at ?? null,
    },
  };
}

// Post Queue operations
export async function createPostQueueItem(data: Omit<PostQueueItem, "id" | "created_at" | "updated_at">): Promise<PostQueueItem> {
  const id = randomUUID();
  const [result] = await db
    .insert(postQueue)
    .values({
      id,
      media_id: data.media_id,
      platform: data.platform,
      status: data.status,
      scheduled_at: data.scheduled_at ? new Date(data.scheduled_at) : null,
      caption: data.caption,
      hashtags: data.hashtags,
      post_url: data.post_url,
      engagement: data.engagement,
    })
    .returning();
  return mapPostRecord(result);
}

export async function getPostQueueItems(filters?: { status?: PostQueueItem["status"]; platform?: PostQueueItem["platform"] }): Promise<PostQueueItem[]> {
  let query = db.select().from(postQueue);

  const conditions: any[] = [];
  if (filters?.status) {
    conditions.push(eq(postQueue.status, filters.status));
  }
  if (filters?.platform) {
    conditions.push(eq(postQueue.platform, filters.platform));
  }

  if (conditions.length > 0) {
    query = query.where(and(...conditions)) as any;
  }

  const results = await query.orderBy(sql`${postQueue.scheduled_at} ASC NULLS LAST`);
  return results.map(mapPostRecord);
}

export async function updatePostQueueItem(id: string, updates: Partial<PostQueueItem>): Promise<PostQueueItem | null> {
  const [result] = await db
    .update(postQueue)
    .set({
      ...updates,
      updated_at: new Date(),
      id: undefined,
      created_at: undefined,
    } as any)
    .where(eq(postQueue.id, id))
    .returning();
  if (!result) return null;
  return mapPostRecord(result);
}

function mapPostRecord(row: any): PostQueueItem {
  return {
    id: row.id,
    media_id: row.media_id,
    platform: row.platform as PostQueueItem["platform"],
    status: row.status as PostQueueItem["status"],
    scheduled_at: row.scheduled_at?.toISOString() ?? null,
    caption: row.caption ?? "",
    hashtags: row.hashtags ?? [],
    post_url: row.post_url,
    engagement: (row.engagement as any) ?? null,
    created_at: row.created_at?.toISOString() ?? new Date().toISOString(),
    updated_at: row.updated_at?.toISOString() ?? new Date().toISOString(),
  };
}

