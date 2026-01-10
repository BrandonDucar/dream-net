
import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';
import { BlobStore, BlobMetadata, BlobId, Commitment } from '../index.js';

export class FileSystemBlobStore implements BlobStore {
    private baseDir: string;

    constructor(basePath: string) {
        this.baseDir = basePath;
        this.ensureDir();
    }

    private async ensureDir() {
        try {
            await fs.mkdir(this.baseDir, { recursive: true });
        } catch (e) {
            // ignore exists
        }
    }

    private getPath(id: string): string {
        return path.join(this.baseDir, id);
    }

    private getMetaPath(id: string): string {
        return path.join(this.baseDir, `${id}.meta.json`);
    }

    async put(data: Uint8Array | string, mimeType: string, ttlSeconds: number = 7776000): Promise<BlobMetadata> { // Default 90 days (3 months)
        const buffer = typeof data === 'string' ? Buffer.from(data) : Buffer.from(data);
        const id = crypto.randomUUID();

        // Generate Commitment (SHA-256 Hash)
        const hash = crypto.createHash('sha256').update(buffer).digest('hex');
        const commitment = `sha256:${hash}`;

        const now = Date.now();
        const expiresAt = now + (ttlSeconds * 1000);

        const metadata: BlobMetadata = {
            id,
            size: buffer.length,
            mimeType,
            createdAt: now,
            expiresAt,
            commitment
        };

        // Write Blob and Metadata atomically-ish
        await fs.writeFile(this.getPath(id), buffer);
        await fs.writeFile(this.getMetaPath(id), JSON.stringify(metadata, null, 2));

        return metadata;
    }

    async get(id: string): Promise<Uint8Array | null> {
        try {
            const buffer = await fs.readFile(this.getPath(id));
            if (!buffer) return null;
            return new Uint8Array(buffer); // Convert back to Uint8Array
        } catch (e) {
            return null;
        }
    }

    async resolve(commitment: string): Promise<Uint8Array | null> {
        // In a real content-addressed system, we'd look up by hash.
        // For this simple FS adapter, we scan metadata (inefficient but works for MVP)
        // Optimization: In Phase 3, use a specialized index or DB.

        const files = await fs.readdir(this.baseDir);
        for (const file of files) {
            if (file.endsWith('.meta.json')) {
                try {
                    const content = await fs.readFile(path.join(this.baseDir, file), 'utf-8');
                    const meta = JSON.parse(content) as BlobMetadata;
                    if (meta.commitment === commitment) {
                        return this.get(meta.id);
                    }
                } catch (e) {
                    continue; // Skip corrupted meta
                }
            }
        }
        return null;
    }

    async prune(): Promise<number> {
        const now = Date.now();
        let pruned = 0;

        const files = await fs.readdir(this.baseDir);
        for (const file of files) {
            if (file.endsWith('.meta.json')) {
                try {
                    const metaPath = path.join(this.baseDir, file);
                    const content = await fs.readFile(metaPath, 'utf-8');
                    const meta = JSON.parse(content) as BlobMetadata;

                    if (meta.expiresAt < now) {
                        // Expired! Delete blob and meta.
                        const blobPath = this.getPath(meta.id);
                        await fs.unlink(blobPath).catch(() => { });
                        await fs.unlink(metaPath).catch(() => { });
                        pruned++;
                    }
                } catch (e) {
                    // Corrupted meta? Might want to delete it or ignore.
                }
            }
        }
        return pruned;
    }
}
