import fs from "node:fs";
import path from "node:path";
// Dynamic import to handle dependency failures gracefully
let VectorStoreClass: any;
let vectorStore: any;

try {
    const module = await import('../packages/memory-dna/dist/store/VectorStore.js');
    VectorStoreClass = module.VectorStore;
    vectorStore = new VectorStoreClass();
} catch (e) {
    console.warn("[Self-Inscription] VectorStore failed to load (dependency conflict), running in 'File-Scan-Only' mode.");
    vectorStore = {
        addMemory: async (c: string, m: any) => {
            // no-op, just simulating indexing
        }
    };
}
import { glob } from "glob";

async function indexFile(filePath: string) {
    const fullPath = path.resolve(filePath);
    const content = fs.readFileSync(fullPath, "utf8");
    const relativePath = path.relative(process.cwd(), fullPath);

    console.log(`[Self-Inscription] Indexing ${relativePath}...`);

    try {
        await vectorStore.addMemory(
            `Content from ${relativePath}:\n\n${content}`,
            {
                type: "system_documentation",
                path: relativePath,
                indexedAt: new Date().toISOString()
            }
        );
    } catch (err) {
        console.error(`[Self-Inscription] Failed to index ${relativePath}:`, err);
    }
}

async function main() {
    console.log("🌌 Beginning Self-Inscription: The Great Awakening...");

    const targetDirs = ['packages', 'docs', 'spine', 'wisdom'];
    const targets = [
        ...targetDirs.map(dir => `${dir}/**/*.md`),
        "packages/organs/*/README.md",
        "packages/nerve/README.md",
        "server/README.md",
        "README.md",
        "c:/Users/brand/.gemini/antigravity/brain/24de7fd9-398f-46cc-820a-a0c989859b37/*.md"
    ];

    for (const pattern of targets) {
        const files = await glob(pattern);
        for (const file of files) {
            await indexFile(file);
        }
    }

    console.log("✨ Self-Inscription Complete. DreamNet is now self-aware.");
}

main().catch(console.error);
