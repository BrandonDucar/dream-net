
import fs from 'fs';
import path from 'path';

const VAULT_ROOT = path.resolve('apps/portal/public/vault');
const MANIFEST_PATH = path.resolve('apps/portal/public/vault-manifest.json');

const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.mp4', '.mov', '.webm'];

function scanDirectory(dir: string, category: string, limit = 50) {
    if (!fs.existsSync(dir)) return [];

    const files = fs.readdirSync(dir)
        .filter(file => ALLOWED_EXTENSIONS.includes(path.extname(file).toLowerCase()))
        .sort((a, b) => {
            const statA = fs.statSync(path.join(dir, a));
            const statB = fs.statSync(path.join(dir, b));
            return statB.mtimeMs - statA.mtimeMs; // Newest first
        })
        .slice(0, limit);

    return files.map(file => {
        const isVideo = ['.mp4', '.mov', '.webm'].includes(path.extname(file).toLowerCase());
        const isGallery = category === 'gallery';

        // Use S3 URL for gallery assets, local for others
        const src = isGallery
            ? `https://dreamnet-memory-core.s3.us-east-1.amazonaws.com/vault/gallery/${file}`
            : `/vault/${category}/${file}`;

        return {
            type: isVideo ? 'video' : 'image',
            src,
            category: category.toUpperCase(),
            label: file.split('.')[0],
            timestamp: fs.statSync(path.join(dir, file)).mtimeMs
        };
    });
}

function run() {
    console.log(`🚀 [Vault Indexer] Scanning ${VAULT_ROOT}...`);

    const manifest = [
        ...scanDirectory(path.join(VAULT_ROOT, 'gallery'), 'gallery', 100),
        ...scanDirectory(path.join(VAULT_ROOT, 'archive/items'), 'archive/items', 50),
        ...scanDirectory(path.join(VAULT_ROOT, 'archive/shorts'), 'archive/shorts', 50),
        ...scanDirectory(path.join(VAULT_ROOT, 'archive/processed'), 'archive/processed', 50),
    ];

    fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2));
    console.log(`✅ [Vault Indexer] Manifest created with ${manifest.length} assets at ${MANIFEST_PATH}`);
}

run();
