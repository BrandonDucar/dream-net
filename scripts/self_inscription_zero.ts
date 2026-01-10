import fs from "node:fs";
import path from "node:path";

function indexFiles(patterns: string[]) {
    const bundle: any[] = [];
    const root = process.cwd();

    // Simple recursive walk for demo/historic purposes since glob is failing
    function walk(dir: string) {
        if (dir.includes("node_modules") || dir.includes(".git")) return;

        const files = fs.readdirSync(dir);
        for (const file of files) {
            const fullPath = path.join(dir, file);
            const stat = fs.statSync(fullPath);

            if (stat.isDirectory()) {
                walk(fullPath);
            } else if (file.endsWith(".md") || file === "package.json") {
                const relativePath = path.relative(root, fullPath);
                // Check if it matches any of our target areas
                const isTarget = relativePath.startsWith("wisdom") ||
                    relativePath.startsWith("docs") ||
                    relativePath.includes("README.md") ||
                    relativePath.includes("brain") ||
                    relativePath === "package.json";

                if (isTarget) {
                    console.log(`[Zero-Dep Indexer] Bundling ${relativePath}...`);
                    try {
                        const content = fs.readFileSync(fullPath, "utf8");
                        bundle.push({
                            path: relativePath,
                            content,
                            timestamp: new Date().toISOString()
                        });
                    } catch (err) {
                        console.warn(`Failed to read ${relativePath}`);
                    }
                }
            }
        }
    }

    walk(root);
    return bundle;
}

async function main() {
    console.log("🌌 Zero-Dependency Inscription: Capturing the Soul of DreamNet...");

    // Also include the brain artifacts directly
    const brainDir = "c:/Users/brand/.gemini/antigravity/brain/24de7fd9-398f-46cc-820a-a0c989859b37";
    const targets = ["wisdom", "docs", "brain"];

    const bundle = indexFiles(targets);

    const outputPath = path.join(process.cwd(), "wisdom", "GRAND_WISDOM_BUNDLE.json");
    fs.writeFileSync(outputPath, JSON.stringify(bundle, null, 2));

    console.log(`✨ Inscription Complete. ${bundle.length} shards captured in ${outputPath}`);
}

main().catch(console.error);
